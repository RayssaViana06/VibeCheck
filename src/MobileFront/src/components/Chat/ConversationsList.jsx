import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return '??';
}

export default function ConversationsList({ conversations, activeId, onSelect, inlineWidth }) {
  const containerStyle = [inlineWidth ? { width: inlineWidth } : { flex: 1 }, styles.container];

  function formatTime(value) {
    if (!value) return '';
    try {
      const d = new Date(value);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  return (
    <View style={containerStyle}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={[styles.row, item.id === activeId && styles.active]}>
            <View style={styles.left}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.initials || getInitials(item.name)}</Text>
              </View>
            </View>
            <View style={styles.center}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text style={styles.last} numberOfLines={1} ellipsizeMode="tail">{item.lastMessage}</Text>
            </View>
            <View style={styles.right}>
              {item.unreadCount ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.unreadCount > 99 ? '99+' : String(item.unreadCount)}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.time}>{formatTime(item.createAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f0ff' },
  row: { marginHorizontal: 12, marginVertical: 6, padding: 12, borderRadius: 12, backgroundColor: '#efe7fb', flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  active: { backgroundColor: '#e2d6f4' },
  left: { width: 64, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#5E499D', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, paddingRight: 8 },
  name: { fontWeight: '700', color: '#111', fontSize: 15 },
  last: { color: '#666', marginTop: 4, fontSize: 13 },
  right: { width: 56, alignItems: 'flex-end' },
  badge: { minWidth: 18, height: 18, paddingHorizontal: 6, borderRadius: 9, backgroundColor: '#5E499D', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  time: { fontSize: 12, color: '#999' },
});
