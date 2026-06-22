import React, { useEffect, useRef, useState } from 'react';
import './ChatLayout.css';
import ChatHeader from './ChatHeader';
import SidebarConversations from './SidebarConversations';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useAuth } from '../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { chatApi } from '../Services/chatApi';
import {
  createChatConnection,
  getChatToken,
  getUserFromStorage,
  sendChatMessage,
  startChatConnection,
  stopChatConnection,
} from '../Services/SignalR';

function formatTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name = '') {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return '??';
}

function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    const payload = jwtDecode(token);

    return (
      payload.nameidentifier ||
      payload['nameidentifier'] ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload.sub ||
      null
    );
  } catch (error) {
    console.error('Falha ao decodificar token do chat:', error);
    return null;
  }
}

function getUserInfoFromToken(token) {
  if (!token) return { id: null, role: null };

  try {
    const payload = jwtDecode(token);

    const id =
      payload.nameidentifier ||
      payload['nameidentifier'] ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload.sub ||
      null;

    const role =
      payload.role ||
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null;

    return { id, role };
  } catch (error) {
    console.error('Falha ao decodificar token do chat:', error);
    return { id: null, role: null };
  }
}

function getCurrentUserId(token, user) {
  return (
    user?.id ||
    user?._id ||
    user?.userId ||
    user?.usuarioId ||
    getUserIdFromToken(token)
  );
}

function transformChatsToConversations(chatsData, userRole) {
  const chats = Array.isArray(chatsData)
    ? chatsData
    : Array.isArray(chatsData?.chats)
      ? chatsData.chats
      : [];

  return chats.map((chat) => {
    const outroUsuarioId = userRole === 'psicologo' ? chat.pacienteId : chat.psicologoId;

    const contactName =
      // prefer explicit fields returned by API
      (userRole === 'psicologo'
        ? chat.nomePaciente ?? chat.pacienteNome
        : chat.nomePsicologo ?? chat.psicologoNome) ||
      chat.nomeContato ||
      chat.name ||
      outroUsuarioId ||
      'Chat';

    const initials = getInitials(contactName);

    return {
      id: chat.id,
      name: contactName,
      initials,
      destinoId: outroUsuarioId,
      lastMessage: chat.ultimaMensagem || chat.lastMessage || '',
      createAt: chat.createAt,
    };
  });
}

function transformMessagesToView(messagesData, currentUserId) {
  const messages = Array.isArray(messagesData)
    ? messagesData
    : Array.isArray(messagesData?.mensagens)
      ? messagesData.mensagens
      : [];

  return messages
    .slice()
    .sort((left, right) => new Date(left.createAt) - new Date(right.createAt))
    .map((message) => ({
      id: message.id,
      chatId: message.chatId,
      from: message.usuarioOrigem === currentUserId ? 'me' : 'other',
      text: message.texto || '',
      time: formatTime(message.createAt),
      createAt: message.createAt,
    }));
}

const STORAGE_KEYS = {
  conversations: 'webchat:conversations',
  messages: 'webchat:messages',
};

export default function ChatLayout() {
  const { token: authToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('desconectado');
  const [currentUser, setCurrentUser] = useState(null);
  const [prefetching, setPrefetching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const activeConversationRef = useRef(null);
  const currentUserRef = useRef(null);
  const messageCacheRef = useRef(new Map());
  const pendingMessageRequestsRef = useRef(new Map());
  const persistConversationsTimeoutRef = useRef(null);
  const persistMessagesTimeoutRef = useRef(null);
  const notificationTimeoutsRef = useRef(new Map());

  useEffect(() => {
    const user = getUserFromStorage();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    activeConversationRef.current = activeConversation?.id || null;
  }, [activeConversation]);

  function safeGetLocalStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSetLocalStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // ignore storage errors
    }
  }

  function schedulePersistConversations(nextConversations) {
    if (persistConversationsTimeoutRef.current) {
      clearTimeout(persistConversationsTimeoutRef.current);
    }
    persistConversationsTimeoutRef.current = window.setTimeout(() => {
      safeSetLocalStorage(
        STORAGE_KEYS.conversations,
        JSON.stringify(nextConversations || []),
      );
    }, 400);
  }

  function schedulePersistMessages() {
    if (persistMessagesTimeoutRef.current) {
      clearTimeout(persistMessagesTimeoutRef.current);
    }
    persistMessagesTimeoutRef.current = window.setTimeout(() => {
      const payload = Object.fromEntries(messageCacheRef.current.entries());
      safeSetLocalStorage(STORAGE_KEYS.messages, JSON.stringify(payload));
    }, 400);
  }

  function dismissNotification(id) {
    setNotifications((current) => current.filter((item) => item.id !== id));
    const timeoutId = notificationTimeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      notificationTimeoutsRef.current.delete(id);
    }
  }

  function pushNotification(payload) {
    const id = `${payload.chatId}-${Date.now()}`;
    const nextNotification = { id, ...payload };

    setNotifications((current) => [nextNotification, ...current].slice(0, 3));

    const timeoutId = window.setTimeout(() => {
      dismissNotification(id);
    }, 6000);

    notificationTimeoutsRef.current.set(id, timeoutId);
  }

  async function prefetchAllMessages(nextConversations, token, currentUserId) {
    if (!Array.isArray(nextConversations) || nextConversations.length === 0) return;

    setPrefetching(true);
    const fetches = nextConversations.map(async (conversation) => {
      const chatId = conversation.id;

      if (!chatId || messageCacheRef.current.has(chatId)) return null;

      try {
        const data = await chatApi.get(`/chats/buscar-mensagens/${chatId}`);
        const formattedMessages = transformMessagesToView(data, currentUserId);
        messageCacheRef.current.set(chatId, formattedMessages);
        return { chatId, messages: formattedMessages };
      } catch (error) {
        return null;
      }
    });

    await Promise.all(fetches);
    schedulePersistMessages();
    setPrefetching(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCachedData() {
      try {
        const cachedConversationsRaw = safeGetLocalStorage(STORAGE_KEYS.conversations);
        const cachedMessagesRaw = safeGetLocalStorage(STORAGE_KEYS.messages);

        if (cancelled) return;

        const cachedConversations = cachedConversationsRaw
          ? JSON.parse(cachedConversationsRaw)
          : [];

        if (Array.isArray(cachedConversations) && cachedConversations.length > 0) {
          setConversations(cachedConversations);
          setActiveConversation((prev) => {
            if (prev && cachedConversations.some((conversation) => conversation.id === prev.id)) {
              return prev;
            }
            return cachedConversations[0] || null;
          });
        }

        if (cachedMessagesRaw) {
          const parsedMessages = JSON.parse(cachedMessagesRaw) || {};
          Object.entries(parsedMessages).forEach(([chatId, msgs]) => {
            if (Array.isArray(msgs)) {
              messageCacheRef.current.set(chatId, msgs);
            }
          });
        }

        const firstChatId = cachedConversations?.[0]?.id;
        if (firstChatId && messageCacheRef.current.has(firstChatId)) {
          setMessages(messageCacheRef.current.get(firstChatId));
        }
      } catch (error) {
        console.error('Erro ao carregar cache local do chat:', error);
      } finally {
        setPrefetching(false);
      }
    }

    setPrefetching(true);
    loadCachedData();

    return () => {
      cancelled = true;
      if (persistConversationsTimeoutRef.current) {
        clearTimeout(persistConversationsTimeoutRef.current);
      }
      if (persistMessagesTimeoutRef.current) {
        clearTimeout(persistMessagesTimeoutRef.current);
      }
      notificationTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      notificationTimeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    async function loadConversations() {
      const token = authToken || getChatToken();
      const { id: userId, role: userRole } = getUserInfoFromToken(token);

      if (!userId) {
        console.error('Nao foi possivel obter o nameidentifier do token do chat.');
        setConversations([]);
        setActiveConversation(null);
        return;
      }

      if (!userRole) {
        console.error('Nao foi possivel obter a role do token do chat.');
        setConversations([]);
        setActiveConversation(null);
        return;
      }

      try {
        const data = await chatApi.get(`/chats/buscar-chats/${userId}`);

        const formattedConversations = transformChatsToConversations(data, userRole);

        setConversations(formattedConversations);
        schedulePersistConversations(formattedConversations);
        setActiveConversation((prev) => {
          if (
            prev &&
            formattedConversations.some((conversation) => conversation.id === prev.id)
          ) {
            return prev;
          }

          return formattedConversations[0] || null;
        });
        const currentUserId = getCurrentUserId(token, currentUserRef.current);
        await prefetchAllMessages(formattedConversations, token, currentUserId);
      } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        setConversations([]);
        setActiveConversation(null);
      }
    }

    loadConversations();
  }, [authToken]);

  useEffect(() => {
    async function loadMessagesForConversation() {
      if (!activeConversation?.id) {
        setMessages([]);
        return;
      }

      const cachedMessages = messageCacheRef.current.get(activeConversation.id);

      if (cachedMessages) {
        setMessages(cachedMessages);
      }

      const pendingRequest = pendingMessageRequestsRef.current.get(activeConversation.id);

      if (pendingRequest) {
        const pendingMessages = await pendingRequest;

        if (activeConversationRef.current === activeConversation.id) {
          setMessages(pendingMessages);
        }

        return;
      }

      const token = authToken || getChatToken();
      const currentUserId = getCurrentUserId(token, currentUser);

      const requestPromise = chatApi
        .get(`/chats/buscar-mensagens/${activeConversation.id}`)
        .then((data) => {
          const formattedMessages = transformMessagesToView(data, currentUserId);
          messageCacheRef.current.set(activeConversation.id, formattedMessages);
          schedulePersistMessages();
          return formattedMessages;
        })
        .finally(() => {
          pendingMessageRequestsRef.current.delete(activeConversation.id);
        });

      pendingMessageRequestsRef.current.set(activeConversation.id, requestPromise);

      try {
        const formattedMessages = await requestPromise;

        if (activeConversationRef.current !== activeConversation.id) {
          return;
        }

        setMessages(formattedMessages);
        setConversations((currentConversations) => {
          const next = currentConversations.map((conversation) =>
            conversation.id === activeConversation.id
              ? {
                  ...conversation,
                  lastMessage: formattedMessages.at(-1)?.text || conversation.lastMessage || '',
                }
              : conversation,
          );
          schedulePersistConversations(next);
          return next;
        });
      } catch (error) {
        console.error('Erro ao buscar mensagens da conversa:', error);
        setMessages([]);
      }
    }

    loadMessagesForConversation();
  }, [activeConversation, authToken, currentUser]);

  useEffect(() => {
    const token = getChatToken();

    if (!token) {
      setConnectionStatus('sem token');
      return undefined;
    }

    const hubConnection = createChatConnection(token);
    let disposed = false;

    const handleReceiveMessage = (msg) => {
      const chatId = msg.chatId || msg.ChatId;
      const text = msg.texto || msg.Texto || '';
      const currentUserId = getCurrentUserId(token, currentUserRef.current);
      const receivedMessage = {
        id: msg.id || Date.now(),
        chatId,
        from: msg.usuarioOrigem === currentUserId ? 'me' : 'other',
        text,
        time: formatTime(msg.createAt || msg.CreateAt || new Date()),
        createAt: msg.createAt || msg.CreateAt || new Date().toISOString(),
      };

      setConversations((currentConversations) => {
        let conversationName = null;
        const next = currentConversations.map((conversation) => {
          if (conversation.id !== chatId) return conversation;
          conversationName = conversation.name || conversation.nomeContato || 'Chat';
          return {
            ...conversation,
            lastMessage: text,
            unreadCount:
              chatId === activeConversationRef.current
                ? 0
                : (conversation.unreadCount || 0) + 1,
          };
        });

        if (chatId && chatId !== activeConversationRef.current) {
          pushNotification({
            chatId,
            name: conversationName || 'Nova mensagem',
            message: text,
            time: receivedMessage.time,
          });
        }

        schedulePersistConversations(next);
        return next;
      });

      if (chatId && chatId === activeConversationRef.current) {
        setMessages((currentMessages) => [...currentMessages, receivedMessage]);
      }

      if (chatId) {
        const cachedMessages = messageCacheRef.current.get(chatId) || [];
        const nextMessages = [...cachedMessages, receivedMessage].sort(
          (left, right) => new Date(left.createAt || 0) - new Date(right.createAt || 0),
        );

        messageCacheRef.current.set(chatId, nextMessages);
        schedulePersistMessages();
      }
    };

    hubConnection.onreconnecting(() => {
      setConnectionStatus('reconectando');
    });

    hubConnection.onreconnected(() => {
      setConnectionStatus('conectado');
    });

    hubConnection.onclose(() => {
      setConnectionStatus('desconectado');
    });

    async function connect() {
      try {
        await startChatConnection(hubConnection, handleReceiveMessage);

        if (disposed) {
          await stopChatConnection(hubConnection);
          return;
        }

        setConnection(hubConnection);
        setConnectionStatus('conectado');
      } catch (error) {
        setConnectionStatus('erro ao conectar');
        console.error('Falha ao conectar ao SignalR do chat:', error);
      }
    }

    connect();

    return () => {
      disposed = true;
      setConnection(null);
      stopChatConnection(hubConnection);
    };
  }, [authToken]);

  async function handleSend(text) {
    if (!activeConversation) return;

    const previewTime = formatTime();
    const payload = {
      chatId: activeConversation.id,
      texto: text,
      usuarioDestinoId: activeConversation.destinoId || activeConversation.id,
    };

    try {
      if (connection) {
        await sendChatMessage(connection, payload);
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          chatId: activeConversation.id,
          from: 'me',
          text,
          time: previewTime,
          createAt: new Date().toISOString(),
        },
      ]);
      messageCacheRef.current.set(activeConversation.id, [
        ...(messageCacheRef.current.get(activeConversation.id) || []),
        {
          id: Date.now(),
          chatId: activeConversation.id,
          from: 'me',
          text,
          time: previewTime,
          createAt: new Date().toISOString(),
        },
      ]);
      schedulePersistMessages();
      setConversations((currentConversations) => {
        const next = currentConversations.map((conversation) =>
          conversation.id === activeConversation.id
            ? {
                ...conversation,
                lastMessage: text,
                unreadCount: 0,
              }
            : conversation,
        );
        schedulePersistConversations(next);
        return next;
      });
    } catch (error) {
      console.error('Falha ao enviar mensagem pelo SignalR:', error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          chatId: activeConversation.id,
          from: 'me',
          text,
          time: previewTime,
          createAt: new Date().toISOString(),
        },
      ]);
      messageCacheRef.current.set(activeConversation.id, [
        ...(messageCacheRef.current.get(activeConversation.id) || []),
        {
          id: Date.now(),
          chatId: activeConversation.id,
          from: 'me',
          text,
          time: previewTime,
          createAt: new Date().toISOString(),
        },
      ]);
      schedulePersistMessages();
      setConversations((currentConversations) => {
        const next = currentConversations.map((conversation) =>
          conversation.id === activeConversation.id
            ? {
                ...conversation,
                lastMessage: text,
                unreadCount: 0,
              }
            : conversation,
        );
        schedulePersistConversations(next);
        return next;
      });
    }
  }

  return (
    <div className="chatRoot">
      {notifications.length > 0 && (
        <div className="chatNotifications">
          {notifications.map((item) => (
            <div key={item.id} className="chatNotification">
              <button
                type="button"
                className="chatNotificationClose"
                onClick={() => dismissNotification(item.id)}
                aria-label="Fechar notificacao"
              >
                ×
              </button>
              <div
                className="chatNotificationBody"
                role="button"
                tabIndex={0}
                onClick={() => {
                  const conversation = conversations.find((c) => c.id === item.chatId);
                  if (conversation) {
                    setActiveConversation(conversation);
                    setConversations((currentConversations) => {
                      const next = currentConversations.map((c) =>
                        c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
                      );
                      schedulePersistConversations(next);
                      return next;
                    });
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const conversation = conversations.find((c) => c.id === item.chatId);
                    if (conversation) {
                      setActiveConversation(conversation);
                      setConversations((currentConversations) => {
                        const next = currentConversations.map((c) =>
                          c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
                        );
                        schedulePersistConversations(next);
                        return next;
                      });
                    }
                  }
                }}
              >
                <div className="chatNotificationTitle">
                  <span>{item.name}</span>
                  {item.time ? <span className="chatNotificationTime">{item.time}</span> : null}
                </div>
                <div className="chatNotificationText">{item.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <SidebarConversations
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelectConversation={(conversation) => {
          setActiveConversation(conversation);
          setConversations((currentConversations) => {
            const next = currentConversations.map((item) =>
              item.id === conversation?.id
                ? { ...item, unreadCount: 0 }
                : item,
            );
            schedulePersistConversations(next);
            return next;
          });
        }}
        prefetching={prefetching}
      />
      <div className="chatMain">
        <ChatHeader
          name={activeConversation?.name || 'Chat'}
          initials={activeConversation?.initials || '??'}
          status={connectionStatus}
          userName={currentUser?.Name || currentUser?.name}
        />
        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
