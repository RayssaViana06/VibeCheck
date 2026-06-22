import React from 'react';
import './ConversationItem.css';
import { useAuth } from '../../../hooks/useAuth';

export default function ConversationItem({ conversation, active, onClick }) {
  const { role } = useAuth() || {};

  const isPsicologo = role === 'psicologo';

  const otherName = isPsicologo
    ? conversation?.nomePaciente ?? conversation?.name
    : conversation?.nomePsicologo ?? conversation?.name;

  const initials =
    conversation?.initials ||
    (otherName
      ? otherName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U');

  return (
    <div
      className={`conversationItem ${active ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="convAvatar">{initials}</div>
      <div className="convBody">
        <div className="convName">{otherName || 'Usuário'}</div>
        <div className="convLast">{conversation?.lastMessage || 'Sem mensagens ainda'}</div>
      </div>
      {conversation?.unreadCount ? (
        <div className="convBadge">
          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
        </div>
      ) : null}
    </div>
  );
}
