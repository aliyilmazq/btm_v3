import React, { useState } from "react";
import Step1VeriParametreleri from "../features/analysis/components/Step1VeriParametreleri";
import Step2StratejiSecimi from "../features/strategy/components/Step2StratejiSecimi";
import Step3AnalizSonuc from "../features/analysis/components/Step3AnalizSonuc";
import Stepper from "../features/stepper/components/Stepper";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <div className="app-container" style={{ maxWidth: 480, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <Stepper activeStep={step - 1} className="stepper" />
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
          onNext={(seciliStratejiOrParams) => {
            if (typeof seciliStratejiOrParams === 'object') {
              setFormData({ ...formData, ...seciliStratejiOrParams });
            } else {
              setFormData({ ...formData, strategy: seciliStratejiOrParams });
            }
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