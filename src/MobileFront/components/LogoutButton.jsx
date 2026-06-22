import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function LogoutButton({ logoutRoute }) {
  const { usuario, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace(logoutRoute);
  }

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.navSairBtn}>
      <Text style={styles.navSairTexto}>Sair</Text>
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navSairBtn: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#7c66c0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  navSairTexto: { color: "#fff", fontSize: 14 },
});
