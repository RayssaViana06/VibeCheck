import React from 'react';
import './SidebarConversations.css';
import ConversationItem from './ConversationItem';

export default function SidebarConversations({conversations, activeId, onSelectConversation, prefetching}){
  return (
    <div className="sidebar">
      <div className="sidebarTitle">
        Conversas
        {prefetching ? <span className="sidebarLoader">Carregando…</span> : null}
      </div>
      <div className="conversationList">
        {conversations.map(c => (
          <ConversationItem
            key={c.id}
            conversation={c}
            active={c.id===activeId}
            onClick={() => onSelectConversation?.(c)}
          />
        ))}
      </div>
    </div>
  );
}
