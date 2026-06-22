import React from 'react';
import './ChatHeader.css';

export default function ChatHeader({name, initials, status, userName}){
  const statusLabel =
    status === 'conectado'
      ? 'Conectado ao hub'
      : status === 'reconectando'
        ? 'Reconectando...'
        : status === 'erro ao conectar'
          ? 'Falha na conexão'
          : status === 'sem token'
            ? 'Token não informado'
            : 'Conectando...';

  return (
    <div className="chatHeader">
      <div className="headerLeft">
        <div className="avatarCircle">{initials}</div>
        <div className="headerInfo">
          <div className="name">{name}</div>
          <div className="status">{statusLabel}</div>
        </div>
      </div>
      {userName && (
        <div style={{ fontSize: '12px', color: '#888' }}>
          👤 {userName}
        </div>
      )}
    </div>
  );
}
