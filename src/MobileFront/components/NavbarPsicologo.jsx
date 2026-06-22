import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function NavbarPsicologo() {

  return (
    <View>
      <View style={styles.navbar}>
        <Text style={styles.tituloVibecheck}>Vibecheck</Text>
        <View style={styles.botoesNavbar}>
          {/* <Pressable onPress={() => router.back()}>
            <Image source={require("../assets/images/chat.png")} style={{ height: "20", width: "20" }} />
          </Pressable> */}
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(psicologo)/pacientes')} style={{ height: '100%', justifyContent: 'center', padding: 18, backgroundColor: '#5E499D' }}>
            <Image source={require("../assets/images/left-arrow.png")} style={{ height: "20", width: "20" }} />
          </Pressable>
        </View>
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