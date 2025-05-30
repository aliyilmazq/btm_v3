import React from "react";
import PropTypes from "prop-types";

const steps = [
  { label: "Veri Girişi", icon: "📝" },
  { label: "Strateji Seçimi", icon: "📊" },
  { label: "Analiz ve Sonuç", icon: "📈" }
];

function Stepper({ activeStep }) {
  return (
    <nav
      aria-label="Adım adım ilerleme"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 14,
        flexWrap: "wrap"
      }}
    >
      {steps.map((step, idx) => (
        <div
          key={step.label}
          style={{
            flex: 1,
            minWidth: 80,
            textAlign: "center",
            color: idx === activeStep ? "#1976d2" : "#888",
            fontWeight: idx === activeStep ? "bold" : "normal",
            position: "relative",
            zIndex: 1,
            outline: idx === activeStep ? "2px solid #1976d2" : "none",
            borderRadius: 8,
            background: idx === activeStep ? "#f0f7ff" : "transparent",
            transition: "background 0.2s"
          }}
          aria-current={idx === activeStep ? "step" : undefined}
          tabIndex={0}
          aria-label={`Adım ${idx + 1}: ${step.label}`}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: idx === activeStep ? "#1976d2" : "#e0e0e0",
              color: idx === activeStep ? "#fff" : "#888",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
              marginLeft: "auto",
              marginRight: "auto",
              fontWeight: "bold",
              fontSize: 18,
              boxShadow: idx === activeStep ? "0 0 0 2px #1976d2" : "none",
              transition: "background 0.2s, box-shadow 0.2s"
            }}
            aria-hidden="true"
          >
            {step.icon}
          </div>
          <div style={{ fontSize: 13 }}>{step.label}</div>
          {idx < steps.length - 1 && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: -2,
                left: "100%",
                height: 2,
                background: "#e0e0e0",
                zIndex: 0,
                width: "calc(100% - 32px)",
                maxWidth: 60
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  );
}

Stepper.propTypes = {
  activeStep: PropTypes.number.isRequired
};

export default Stepper; 