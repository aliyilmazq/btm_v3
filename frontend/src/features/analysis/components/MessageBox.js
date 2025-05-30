import React from "react";

const colors = {
  info: { bg: "#e3f2fd", color: "#1976d2" },
  success: { bg: "#e8f5e9", color: "#388e3c" },
  error: { bg: "#ffebee", color: "#d32f2f" }
};

export default function MessageBox({ type = "info", message, onClose }) {
  if (!message) return null;
  const style = colors[type] || colors.info;
  return (
    <div style={{
      background: style.bg,
      color: style.color,
      padding: "12px 18px",
      borderRadius: 8,
      margin: "18px 0",
      fontSize: 16,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      position: "relative"
    }}>
      <span style={{flex: 1}}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{
          background: "none", border: "none", color: style.color, fontSize: 20, marginLeft: 12, cursor: "pointer"}}>×</button>
      )}
    </div>
  );
} 