import React from "react";
import {View, Text} from "react-native"

export default function ProgressBar ({score}) {

  const progresso = `${Math.round(score * 10)}%`;    
  return (
    <View
      style={{
        backgroundColor: "#e8e0f0",
        borderRadius: 999,
        height: 8,
        width:"100%"
      }}
    >
      <View
        style={{
          width: progresso,
          backgroundColor: "#6b3fa0",
          borderRadius: 999,
          height: "100%",
        }}
      />
    </View>
  );
}
