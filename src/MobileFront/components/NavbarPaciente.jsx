import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function NavbarPaciente() {

  return (
    <View>
      <View style={styles.navbar}>
        <Text style={styles.tituloVibecheck}>Vibecheck</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  botoesNavbar: {
    display: "flex",
    flexDirection: "row",
    gap: 18,
    height: "100%",
    alignItems: "center"
  },
  tituloVibecheck: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 20
  },
  navbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5E499D",
    height: 56,
    justifyContent: "space-between",
    paddingLeft: 18
  }
})