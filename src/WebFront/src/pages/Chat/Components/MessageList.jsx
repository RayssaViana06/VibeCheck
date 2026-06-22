import React from 'react';
import './MessageList.css';
import MessageBubble from './MessageBubble';

export default function MessageList({messages}){
  function formatDateLabel(value) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((startOfToday - startOfDate) / 86400000);

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  }

  let lastDateKey = '';

  return (
    <div className="messageList">
      {messages.map((message) => {
        const date = message.createAt || message.createAt || message.time;
        const dateKey = date ? new Date(date).toDateString() : '';
        const showDate = dateKey && dateKey !== lastDateKey;
        if (showDate) {
          lastDateKey = dateKey;
        }

        return (
          <React.Fragment key={message.id}>
            {showDate ? (
              <div className="messageDateRow">
                <span className="messageDate">{formatDateLabel(date)}</span>
              </div>
            ) : null}
            <MessageBubble message={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
