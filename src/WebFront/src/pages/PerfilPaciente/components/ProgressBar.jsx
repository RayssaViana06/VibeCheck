import React from "react";

export default function ProgressBar ({score}) {

  const progresso = `${Math.round(score * 10)}%`;    
  return (
    <div
      style={{
        background: "#e8e0f0",
        borderRadius: 999,
        height: 8,
        width:"100%"
      }}
    >
      <div
        style={{
          width: progresso,
          background: "#6b3fa0",
          borderRadius: 999,
          height: "100%",
        }}
      />
    </div>
  );
}
