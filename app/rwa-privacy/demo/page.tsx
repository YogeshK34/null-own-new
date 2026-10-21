'use client';

import React, { useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import Stepper from '@/components/rwa-privacy/Stepper';
import AssetForm from '@/components/rwa-privacy/AssetForm';
import StealthAddressPanel from '@/components/rwa-privacy/StealthAddressPanel';
import TransactionPanel from '@/components/rwa-privacy/TransactionPanel';
import ZKProofPanel from '@/components/rwa-privacy/ZKProofPanel';
import { RWAAsset, StealthKeys, TransferRecord, ZKProof } from '@/lib/rwa-privacy/types';

export default function RWAPrivacyConsolePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);

  // Persistent state across all 4 steps
  const [asset, setAsset] = useState<RWAAsset | null>(null);
  const [stealthKeys, setStealthKeys] = useState<StealthKeys | null>(null);
  const [transferRecord, setTransferRecord] = useState<TransferRecord | null>(null);
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Handlers for step progression and persistence
  const handleAssetRegistered = (registeredAsset: RWAAsset) => {
    setAsset(registeredAsset);
    setMaxCompletedStep((prev) => Math.max(prev, 1));
  };

  const handleKeysGenerated = (keys: StealthKeys) => {
    setStealthKeys(keys);
    setMaxCompletedStep((prev) => Math.max(prev, 2));
  };

  const handleTransferComplete = (record: TransferRecord) => {
    setTransferRecord(record);
    setMaxCompletedStep((prev) => Math.max(prev, 3));
  };

  const handleProofGenerated = (newProof: ZKProof) => {
    setProof(newProof);
    setVerificationResult(null);
  };

  const handleTamperToggle = (tampered: boolean) => {
    setIsTampered(tampered);
    if (verificationResult !== null) {
      setVerificationResult(tampered ? false : true);
    }
  };

  const handleVerificationEvaluated = (isValid: boolean) => {
    setVerificationResult(isValid);
    if (isValid) {
      setMaxCompletedStep(4);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setMaxCompletedStep(0);
    setAsset(null);
    setStealthKeys(null);
    setTransferRecord(null);
    setProof(null);
    setIsTampered(false);
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        {/* Standard Page Header Pattern */}
        <div>
          <h1 className="text-3xl font-[900] tracking-[-0.04em] uppercase">
            RWA PRIVACY ARCHITECTURE — PROTOCOL CONSOLE
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            Non-interactive Diffie-Hellman stealth addresses & Groth16 zk-SNARK verification
          </p>
          <hr className="border-t-2 border-black mt-4 mb-6" />
        </div>

        {/* Stepper Navigation */}
        <Stepper
          currentStep={currentStep}
          maxCompletedStep={maxCompletedStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Step Views with State Retention */}
        <div className="mt-8">
          {currentStep === 1 && (
            <AssetForm
              asset={asset}
              onAssetRegistered={handleAssetRegistered}
              onProceed={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <StealthAddressPanel
              asset={asset}
              stealthKeys={stealthKeys}
              onKeysGenerated={handleKeysGenerated}
              onProceed={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <TransactionPanel
              asset={asset}
              stealthKeys={stealthKeys}
              transferRecord={transferRecord}
              onTransferComplete={handleTransferComplete}
              onProceed={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <ZKProofPanel
              asset={asset}
              stealthKeys={stealthKeys}
              proof={proof}
              isTampered={isTampered}
              verificationResult={verificationResult}
              onProofGenerated={handleProofGenerated}
              onTamperToggle={handleTamperToggle}
              onVerificationEvaluated={handleVerificationEvaluated}
              onBack={() => setCurrentStep(3)}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* FOOTER */}
        <hr className="border-t-2 border-black mt-16 mb-6" />
        <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="text-foreground">
            NULL//OWN PRIVACY ARCHITECTURE & PROTOCOL SPECIFICATION
          </div>
          <div className="font-mono text-xs">
            NEO-BRUTALIST ARCHITECTURE • CRYPTOGRAPHIC PROTOCOL SPECIFICATION
          </div>
        </footer>
      </main>
    </div>
  );
}
