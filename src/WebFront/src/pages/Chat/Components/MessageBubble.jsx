import React from 'react';
import './MessageBubble.css';

export default function MessageBubble({message}){
  const mine = message.from === 'me';
  return (
    <div className={`messageRow ${mine ? 'mine' : 'other'}`}>
      <div className={`bubble ${mine ? 'bubbleMine' : 'bubbleOther'}`}>
        <div className="bubbleText">{message.text}</div>
        <div className="bubbleTime">{message.time}</div>
      </div>
    </div>
  );
}
