import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <View style={styles.row}>
      <TextInput value={text} onChangeText={setText} placeholder="Digite uma mensagem" style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#f7f7f7', marginRight: 8 },
  btn: { backgroundColor: '#5E499D', paddingHorizontal: 14, justifyContent: 'center', borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});
