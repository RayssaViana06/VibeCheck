import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, Dimensions, TouchableOpacity, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatHeader from '../../components/Chat/ChatHeader';
import ChatInput from '../../components/Chat/ChatInput';
import MessageBubble from '../../components/Chat/MessageBubble';
import ConversationsList from '../../components/Chat/ConversationsList';
import {
  createChatConnection,
  startChatConnection,
  stopChatConnection,
  sendChatMessage,
  getChatToken,
  getUserFromStorage,
} from './ChatService';
import { chatApi } from '../../services/chatApi';

function formatTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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

function parseJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = global.atob ? global.atob(payload) : Buffer.from(payload, 'base64').toString('binary');
    return JSON.parse(decodeURIComponent(Array.prototype.map.call(decoded, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch (e) {
    return null;
  }
}

function getUserIdFromToken(token) {
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  return (
    payload.nameidentifier ||
    payload['nameidentifier'] ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    payload.sub ||
    null
  );
}

function getUserInfoFromToken(token) {
  const payload = parseJwtPayload(token);
  if (!payload) return { id: null, role: null };

  const id =
    payload.nameidentifier ||
    payload['nameidentifier'] ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    payload.sub ||
    null;

  const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;

  return { id, role };
}

function getCurrentUserId(token, user) {
  return (
    user?.id || user?._id || user?.userId || user?.usuarioId || getUserIdFromToken(token)
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
      unreadCount: chat.unreadCount || 0,
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
  conversations: 'chat:conversations',
  messages: 'chat:messages',
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [status, setStatus] = useState('desconectado');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInlineList, setShowInlineList] = useState(Dimensions.get('window').width > 700);
  const [nameVisible, setNameVisible] = useState(false);
  const connectionRef = useRef(null);
  const activeConversationRef = useRef(null);
  const currentUserRef = useRef(null);
  const tokenRef = useRef(null);
  const messageCacheRef = useRef(new Map());
  const pendingMessageRequestsRef = useRef(new Map());
  const menuAnim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  const { width: windowWidth } = Dimensions.get('window');
  const listAnim = useRef(new Animated.Value(0)).current; // translateX for inline list during swipe-close
  const [inlineWidth, setInlineWidth] = useState(Math.max(200, Math.min(320, Math.floor(windowWidth * 0.35))));
  const persistConversationsTimeoutRef = useRef(null);
  const persistMessagesTimeoutRef = useRef(null);

  // update inline visibility and width on dimension changes
  useEffect(() => {
    function onChange({ window }) {
      setShowInlineList(window.width > 700);
      setInlineWidth(Math.max(200, Math.min(320, Math.floor(window.width * 0.35))));
    }

    const sub = Dimensions.addEventListener ? Dimensions.addEventListener('change', onChange) : Dimensions.addEventListener('change', onChange);
    return () => {
      try { Dimensions.removeEventListener('change', onChange); } catch (e) {}
      try { sub && sub.remove && sub.remove(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    activeConversationRef.current = activeConversation?.id || null;
  }, [activeConversation]);

  function schedulePersistConversations(nextConversations) {
    if (persistConversationsTimeoutRef.current) {
      clearTimeout(persistConversationsTimeoutRef.current);
    }
    persistConversationsTimeoutRef.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(nextConversations || [])).catch(() => {});
    }, 400);
  }

  function schedulePersistMessages() {
    if (persistMessagesTimeoutRef.current) {
      clearTimeout(persistMessagesTimeoutRef.current);
    }
    persistMessagesTimeoutRef.current = setTimeout(() => {
      const payload = Object.fromEntries(messageCacheRef.current.entries());
      AsyncStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(payload)).catch(() => {});
    }, 400);
  }

  async function prefetchAllMessages(nextConversations) {
    if (!Array.isArray(nextConversations) || nextConversations.length === 0) return;

    const token = tokenRef.current || (await getChatToken());
    const currentUserId = getCurrentUserId(token, currentUserRef.current);

    const fetches = nextConversations.map(async (conversation) => {
      const chatId = conversation.id;
      if (!chatId || messageCacheRef.current.has(chatId)) return null;

      try {
        const data = await chatApi.get(`/chats/buscar-mensagens/${chatId}`);
        const msgs = transformMessagesToView(data, currentUserId);
        messageCacheRef.current.set(chatId, msgs);
        return { chatId, msgs };
      } catch (e) {
        return null;
      }
    });

    await Promise.all(fetches);
    schedulePersistMessages();
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCachedData() {
      try {
        const [conversationsRaw, messagesRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.conversations),
          AsyncStorage.getItem(STORAGE_KEYS.messages),
        ]);

        if (cancelled) return;

        let cachedConversations = [];
        if (conversationsRaw) {
          const parsedConversations = JSON.parse(conversationsRaw);
          if (Array.isArray(parsedConversations)) cachedConversations = parsedConversations;
        }

        if (messagesRaw) {
          const parsedMessages = JSON.parse(messagesRaw) || {};
          Object.entries(parsedMessages).forEach(([chatId, msgs]) => {
            if (Array.isArray(msgs)) messageCacheRef.current.set(chatId, msgs);
          });
        }

        if (cachedConversations.length > 0) {
          setConversations(cachedConversations);
          setActiveConversation((prev) => (prev && cachedConversations.some((c) => c.id === prev.id) ? prev : cachedConversations[0]));

          const firstChatId = cachedConversations[0]?.id;
          if (firstChatId && messageCacheRef.current.has(firstChatId)) {
            setMessages(messageCacheRef.current.get(firstChatId));
          }
        }
      } catch (e) {
        console.error('Erro ao carregar cache local', e);
      }
    }

    loadCachedData();

    return () => {
      cancelled = true;
      if (persistConversationsTimeoutRef.current) {
        clearTimeout(persistConversationsTimeoutRef.current);
      }
      if (persistMessagesTimeoutRef.current) {
        clearTimeout(persistMessagesTimeoutRef.current);
      }
    };
  }, []);

  // PanResponder to allow dragging from left edge to open the menu
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => {
        // start gesture if from left edge or menu already open
        return gs.x0 < 30 || menuOpen;
      },
      onMoveShouldSetPanResponder: (evt, gs) => {
        const isHorizontal = Math.abs(gs.dx) > Math.abs(gs.dy);
        if (menuOpen) return isHorizontal && Math.abs(gs.dx) > 6;
        return gs.x0 < 30 && isHorizontal && Math.abs(gs.dx) > 6;
      },
      onPanResponderMove: (evt, gs) => {
        // gs.dx can be negative when closing
        const start = menuOpen ? windowWidth : 0;
        const moved = start + gs.dx;
        let v = moved / windowWidth;
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        menuAnim.setValue(v);
      },
      onPanResponderRelease: (evt, gs) => {
        const v = menuAnim.__getValue ? menuAnim.__getValue() : 0;
        const open = v > 0.4 || gs.vx > 0.3;
        setMenuOpen(open);
        Animated.timing(menuAnim, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start();
      },
    }),
  ).current;

  // PanResponder to allow dragging from right-to-left on the inline list to close it
  const closeListPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => {
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gs) => {
        return false;
      },
      onMoveShouldSetPanResponder: (evt, gs) => {
        // start recognizing mainly horizontal left swipes
        return Math.abs(gs.dx) > Math.abs(gs.dy) && gs.dx < -6;
      },
      onMoveShouldSetPanResponderCapture: (evt, gs) => {
        return Math.abs(gs.dx) > Math.abs(gs.dy) && gs.dx < -6;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderMove: (evt, gs) => {
        // live translate while dragging to give immediate feedback
        const width = windowWidth > 1000 ? inlineWidth : windowWidth * 0.35;
        let dx = gs.dx;
        if (dx > 0) dx = 0;
        if (dx < -width) dx = -width;
        listAnim.setValue(dx);
      },
      onPanResponderRelease: (evt, gs) => {
        const width = windowWidth > 1000 ? inlineWidth : windowWidth * 0.35;
        // if user swiped left enough or with enough velocity, animate out then close
        if (gs.dx < -40 || gs.vx < -0.25) {
          Animated.timing(listAnim, { toValue: -width, duration: 250, useNativeDriver: true }).start(() => {
            // hide and reset
            setShowInlineList(false);
            if (activeConversation?.name) setNameVisible(true);
            listAnim.setValue(0);
          });
        } else {
          // return to original position
          Animated.spring(listAnim, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menuOpen, menuAnim]);

  useEffect(() => {
    let disposed = false;

    async function init() {
      const token = await getChatToken();
      tokenRef.current = token;
      if (!token) {
        setStatus('sem token');
        return;
      }

      const conn = createChatConnection(token);

      const handleReceive = (msg) => {
        const chatId = msg.chatId || msg.ChatId;
        const text = msg.texto || msg.Texto || '';
        const currentUserId = getCurrentUserId(tokenRef.current, currentUserRef.current);

        const receivedMessage = {
          id: msg.id || Date.now(),
          chatId,
          from: msg.usuarioOrigem === currentUserId ? 'me' : 'other',
          text,
          time: formatTime(msg.createAt || msg.CreateAt || new Date()),
        };

        setConversations((cur) => {
          const next = cur.map((c) => {
            if (c.id !== chatId) return c;
            const unreadCount = chatId === activeConversationRef.current ? 0 : (c.unreadCount || 0) + 1;
            return { ...c, lastMessage: text, unreadCount };
          });
          schedulePersistConversations(next);
          return next;
        });

        // update cache
        if (chatId) {
          const cached = messageCacheRef.current.get(chatId) || [];
          const next = [...cached, receivedMessage].sort((a, b) => new Date(a.createAt || 0) - new Date(b.createAt || 0));
          messageCacheRef.current.set(chatId, next);
          schedulePersistMessages();
        }

        if (chatId && chatId === activeConversationRef.current) {
          setMessages((currentMessages) => [...currentMessages, receivedMessage]);
        }
      };

      conn.onreconnecting(() => setStatus('reconectando'));
      conn.onreconnected(() => setStatus('conectado'));
      conn.onclose(() => setStatus('desconectado'));

      try {
        await startChatConnection(conn, handleReceive);
        if (disposed) {
          await stopChatConnection(conn);
          return;
        }
        connectionRef.current = conn;
        setStatus('conectado');
      } catch (e) {
        setStatus('erro ao conectar');
        console.error('Erro ao conectar SignalR:', e);
      }
    }

    init();

    return () => {
      disposed = true;
      if (connectionRef.current) {
        stopChatConnection(connectionRef.current);
        connectionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function loadConversations() {
      try {
        const token = await getChatToken();
        const user = await getUserFromStorage();
        currentUserRef.current = user;

        const { id: tokenUserId, role: tokenUserRole } = getUserInfoFromToken(token || '');

        const userId =
          user?.id || user?._id || user?.userId || user?.usuarioId || tokenUserId || null;

        const userRole = tokenUserRole || user?.role || null;

        if (!userId) return;

        const data = await chatApi.get(`/chats/buscar-chats/${userId}`);

        const convs = transformChatsToConversations(data, userRole);

        setConversations(convs);
        schedulePersistConversations(convs);
        setActiveConversation((prev) => (prev && convs.some((c) => c.id === prev.id) ? prev : convs[0] || null));
        prefetchAllMessages(convs);
      } catch (e) {
        console.error('Erro ao carregar conversas', e);
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!activeConversation?.id) {
        setMessages([]);
        return;
      }
      const chatId = activeConversation.id;

      // return cached messages if available
      const cached = messageCacheRef.current.get(chatId);
      if (cached) {
        setMessages(cached);
      }

      // if there's already a pending request for this chat, await it
      const pending = pendingMessageRequestsRef.current.get(chatId);
      if (pending) {
        try {
          const pendingMsgs = await pending;
          if (activeConversation?.id === chatId) setMessages(pendingMsgs);
          return;
        } catch (e) {
          console.error('Erro no pedido pendente de mensagens', e);
          setMessages([]);
          return;
        }
      }

      try {
        const token = tokenRef.current || (await getChatToken());
        const currentUserId = getCurrentUserId(token, currentUserRef.current);

        const requestPromise = chatApi.get(`/chats/buscar-mensagens/${chatId}`).then((data) => {
          const msgs = transformMessagesToView(data, currentUserId);
          messageCacheRef.current.set(chatId, msgs);
          schedulePersistMessages();
          return msgs;
        }).finally(() => {
          pendingMessageRequestsRef.current.delete(chatId);
        });

        pendingMessageRequestsRef.current.set(chatId, requestPromise);

        const msgs = await requestPromise;
        if (activeConversation?.id === chatId) setMessages(msgs);
      } catch (e) {
        console.error('Erro ao carregar mensagens', e);
        setMessages([]);
      }
    }

    loadMessages();
  }, [activeConversation]);

  async function handleSend(text) {
    const trimmed = (text || '').trim();
    if (!trimmed || !activeConversation) return;

    const payload = {
      chatId: activeConversation.id,
      texto: trimmed,
      usuarioDestinoId: activeConversation.destinoId || activeConversation.id,
    };

    try {
      if (connectionRef.current) await sendChatMessage(connectionRef.current, payload);

      const preview = { id: Date.now(), chatId: payload.chatId, from: 'me', text: trimmed, time: formatTime() };
      setMessages((cur) => [...cur, preview]);
      setConversations((cur) => {
        const next = cur.map((c) => (c.id === activeConversation.id ? { ...c, lastMessage: trimmed } : c));
        schedulePersistConversations(next);
        return next;
      });
      // update cache
      const cached = messageCacheRef.current.get(activeConversation.id) || [];
      messageCacheRef.current.set(activeConversation.id, [...cached, preview]);
      schedulePersistMessages();
    } catch (e) {
      console.error('Falha ao enviar mensagem:', e);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ChatHeader title="Chat" status={status} activeName={activeConversation?.name} nameVisible={nameVisible} onMenuPress={() => setMenuOpen(true)} onTitlePress={() => setNameVisible((v) => !v)} />

      <View style={{ flexDirection: 'row', flex: 1 }} onTouchStart={() => { if (menuOpen) setMenuOpen(false); }}>
        <View {...panResponder.panHandlers} style={styles.menuEdge} />
        {showInlineList && (
          <Animated.View {...closeListPanResponder.panHandlers} style={[windowWidth > 1000 ? { width: inlineWidth } : { flex: 1 }, { transform: [{ translateX: listAnim }] }] }>
            <ConversationsList
              conversations={conversations}
              activeId={activeConversation?.id}
              onSelect={(c) => {
                setActiveConversation(c);
                setMenuOpen(false);
                setShowInlineList(false);
                setNameVisible(true);
                setConversations((cur) => {
                  const next = cur.map((item) => (item.id === c.id ? { ...item, unreadCount: 0 } : item));
                  schedulePersistConversations(next);
                  return next;
                });
              }}
            />
          </Animated.View>
        )}

        <View style={{ flex: showInlineList ? 2 : 1 }} onTouchStart={() => { if (menuOpen) setMenuOpen(false); }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messagesList}
            style={styles.messagesScroller}
            keyboardShouldPersistTaps="handled"
          />

          <ChatInput onSend={handleSend} />
        </View>
      </View>

      {/* Animated full-screen menu panel */}
      <Animated.View pointerEvents={menuOpen ? 'auto' : 'none'} style={[styles.overlay, { top: 0, opacity: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}>
        <Animated.View
          style={[
            styles.menuPanel,
            {
              transform: [
                {
                  translateX: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [-windowWidth, 0] }),
                },
                ],
            },
          ]}
        >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Conversas</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.menuClose}>
                <Text style={styles.menuCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ConversationsList
              conversations={conversations}
              activeId={activeConversation?.id}
              onSelect={(c) => {
                setActiveConversation(c);
                setMenuOpen(false);
                setShowInlineList(false);
                setNameVisible(true);
                setConversations((cur) => {
                  const next = cur.map((item) => (item.id === c.id ? { ...item, unreadCount: 0 } : item));
                  schedulePersistConversations(next);
                  return next;
                });
              }}
            />
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ff' },
  messagesScroller: { flex: 1 },
  messagesList: { padding: 12, paddingBottom: 18, flexGrow: 1, backgroundColor: '#f5f0ff' },
  menuEdge: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 24, zIndex: 10 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.3)' },
  menuPanel: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  menuHeader: { height: 56, backgroundColor: '#5E499D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  menuTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
  menuClose: { position: 'absolute', right: 12, top: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  menuCloseText: { color: '#fff', fontSize: 18 },
});
