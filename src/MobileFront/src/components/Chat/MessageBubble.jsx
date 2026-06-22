import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message }) {
  const isMe = message.from === 'me';
  return (
    <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
      <Text style={styles.text}>{message.text}</Text>
      <Text style={styles.time}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { marginBottom: 10, padding: 10, borderRadius: 8, maxWidth: '80%' },
  me: { backgroundColor: '#d8c9f2', alignSelf: 'flex-end' },
  other: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  text: { fontSize: 14, color: '#111' },
  time: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'right' },
});
