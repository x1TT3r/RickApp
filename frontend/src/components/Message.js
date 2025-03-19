import React from "react";

function Message({ text }) {
  if (!text) return null; // Não renderiza nada se o texto for vazio ou indefinido

  return (
    <div style={{ 
      color: "green", 
      margin: "10px 0", 
      padding: "10px", 
      border: "1px solid #4caf50", 
      borderRadius: "5px", 
      backgroundColor: "#f0f9f4",
      fontWeight: "bold"
    }}>
      {text}
    </div>
  );
}

export default Message;
