import React, {useState} from 'react';
import './ChatInput.css';

export default function ChatInput({onSend}){
  const [text, setText] = useState('');
  function submit(e){
    e && e.preventDefault();
    if(!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <form className="chatInput" onSubmit={submit}>
      <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Digite uma mensagem..." />
      <button type="submit">➤</button>
    </form>
  );
}
