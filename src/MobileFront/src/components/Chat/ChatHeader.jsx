import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';

export default function ChatHeader({ title, status, onMenuPress, activeName, nameVisible, onTitlePress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.titleWrap} onPress={onTitlePress} activeOpacity={0.8}>
        {nameVisible && activeName ? (
          <Text style={styles.title}>{activeName}</Text>
        ) : (
          <Text style={styles.placeholder}>Chat</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#5E499D', height: 56 },
  menuButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuIcon: { fontSize: 22, color: '#fff' },
  titleWrap: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
});
