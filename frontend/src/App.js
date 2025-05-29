import React, { useState } from "react";
import Step1VeriParametreleri from "./components/Step1VeriParametreleri";
import Step2StratejiSecimi from "./components/Step2StratejiSecimi";
import Step3AnalizSonuc from "./components/Step3AnalizSonuc";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {step === 1 && (
        <Step1VeriParametreleri
          onNext={(data) => {
            setFormData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2StratejiSecimi
          onNext={(seciliStrateji) => {
            setFormData({ ...formData, strategy: seciliStrateji });
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3AnalizSonuc
          formData={formData}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

export default App; 