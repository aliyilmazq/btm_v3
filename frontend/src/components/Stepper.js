import React from "react";

const steps = [
  "Veri Girişi",
  "Strateji Seçimi",
  "Analiz ve Sonuç"
];

function Stepper({ activeStep }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      maxWidth: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 14
    }}>
      {steps.map((label, idx) => (
        <div key={label} style={{
          flex: 1,
          textAlign: 'center',
          color: idx === activeStep ? '#1976d2' : '#888',
          fontWeight: idx === activeStep ? 'bold' : 'normal',
          position: 'relative'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: idx === activeStep ? '#1976d2' : '#e0e0e0',
            color: idx === activeStep ? '#fff' : '#888',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontWeight: 'bold',
            fontSize: 15
          }}>{idx + 1}</div>
          <div>{label}</div>
          {idx < steps.length - 1 && (
            <div style={{
              position: 'absolute',
              top: 14,
              right: -2,
              left: '100%',
              height: 2,
              background: '#e0e0e0',
              zIndex: 0
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default Stepper; 