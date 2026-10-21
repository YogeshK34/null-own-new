'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RWAAsset, StealthKeys, ZKProof } from '@/lib/rwa-privacy/types';
import { generateZKProof, tamperProof, verifyZKProof } from '@/lib/rwa-privacy/crypto';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProgressLoader } from '@/components/ui/progress-loader';

interface ZKProofPanelProps {
  asset: RWAAsset | null;
  stealthKeys: StealthKeys | null;
  proof: ZKProof | null;
  isTampered: boolean;
  verificationResult: boolean | null;
  onProofGenerated: (proof: ZKProof) => void;
  onTamperToggle: (tampered: boolean) => void;
  onVerificationEvaluated: (isValid: boolean) => void;
  onBack: () => void;
  onRestart: () => void;
}

export default function ZKProofPanel({
  asset,
  stealthKeys,
  proof,
  isTampered,
  verificationResult,
  onProofGenerated,
  onTamperToggle,
  onVerificationEvaluated,
  onBack,
  onRestart,
}: ZKProofPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofProgress, setProofProgress] = useState(0);
  const [proofStatus, setProofStatus] = useState('SYNTHESIZING R1CS ARITHMETIC CONSTRAINTS...');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState('READING VERIFICATION KEY & SIGNALS...');

  const genTimerRef = useRef<NodeJS.Timeout | null>(null);
  const verifyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (genTimerRef.current) clearInterval(genTimerRef.current);
      if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
    };
  }, []);

  const handleGenerateProof = () => {
    if (!asset || !stealthKeys || isGenerating) return;

    setIsGenerating(true);
    setProofProgress(12);
    setProofStatus('SYNTHESIZING R1CS ARITHMETIC CONSTRAINTS...');

    let current = 12;
    genTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 11;

      if (current >= 30 && current < 60) {
        setProofStatus('EVALUATING QAP POLYNOMIAL WITNESS OVER BN254...');
      } else if (current >= 60 && current < 88) {
        setProofStatus('COMPUTING GROTH16 PROOF POINTS (π_a, π_b, π_c)...');
      } else if (current >= 88) {
        setProofStatus('PACKAGING ZERO-KNOWLEDGE PROOF PAYLOAD!');
      }

      if (current >= 100) {
        current = 100;
        if (genTimerRef.current) clearInterval(genTimerRef.current);
        setProofProgress(100);

        setTimeout(() => {
          const generated = generateZKProof(
            stealthKeys.recipientSpendingKey,
            stealthKeys.stealthAddress,
            asset.id
          );
          onProofGenerated(generated);
          setIsGenerating(false);
        }, 300);
      } else {
        setProofProgress(current);
      }
    }, 200);
  };

  const handleVerify = () => {
    if (!proof || isVerifying) return;

    setIsVerifying(true);
    setVerifyProgress(15);
    setVerifyStatus('PARSING GROTH16 PROOF & PUBLIC SIGNALS...');

    let current = 15;
    verifyTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 22) + 18;

      if (current >= 45 && current < 80) {
        setVerifyStatus('COMPUTING BILINEAR PAIRING OVER G1 & G2 CURVES...');
      } else if (current >= 80) {
        setVerifyStatus('EVALUATING PAIRING EQUATION e(A, B) = e(α, β) · e(C, δ)...');
      }

      if (current >= 100) {
        current = 100;
        if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
        setVerifyProgress(100);

        setTimeout(() => {
          const activeProof = isTampered ? tamperProof(proof) : proof;
          const valid = verifyZKProof(activeProof, isTampered);
          onVerificationEvaluated(valid);
          setIsVerifying(false);
        }, 300);
      } else {
        setVerifyProgress(current);
      }
    }, 150);
  };

  const displayProof = proof
    ? isTampered
      ? tamperProof(proof)
      : proof
    : null;

  return (
    <Card className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] bg-background">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">STEP 4 OF 4</Badge>
          <Badge variant="outline">ZERO-KNOWLEDGE VERIFICATION</Badge>
        </div>
        <CardTitle className="text-2xl font-[900] uppercase tracking-[-0.03em]">
          Prove Ownership with ZKP
        </CardTitle>
        <CardDescription className="text-sm">
          &ldquo;The real owner can prove they control this stealth address without revealing who they are.&rdquo; Using zero-knowledge zk-SNARKs (Groth16), Bob computes a mathematical proof that he holds the secret spending key corresponding to the stealth address holding the RWA.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Two Panels Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prover Side */}
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b-2 border-black">
                <h3 className="font-[800] text-base uppercase tracking-tight">
                  Prover (Bob - Private)
                </h3>
                <Badge variant="default">CLIENT-SIDE SNARK</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4 font-mono">
                The secret inputs never leave Bob&apos;s device.
              </p>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    Private Witness (Spending Key)
                  </span>
                  <pre className="border-2 border-black bg-white dark:bg-black p-2.5 font-mono text-xs break-all whitespace-pre-wrap">
                    {stealthKeys?.recipientSpendingKey || '0x...'}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    Public Signal (Stealth Address)
                  </span>
                  <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-2.5 font-mono text-xs break-all whitespace-pre-wrap shadow-[2px_2px_0px_#0A0A0A]">
                    {stealthKeys?.stealthAddress || '0x...'}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    Public Signal (Asset ID)
                  </span>
                  <pre className="border-2 border-black bg-white dark:bg-black p-2.5 font-mono text-xs break-all whitespace-pre-wrap">
                    {asset?.id || 'rwa-id'}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              {isGenerating && (
                <div className="mb-4">
                  <ProgressLoader
                    progress={proofProgress}
                    statusText={proofStatus}
                  />
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleGenerateProof}
                disabled={isGenerating || !stealthKeys}
              >
                {isGenerating
                  ? `Computing ZK Proof... (${proofProgress}%)`
                  : proof
                  ? 'Regenerate ZK Proof'
                  : 'Generate ZK Proof'}
              </Button>

              {proof && !isGenerating && (
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    Generated Groth16 Proof Object
                  </span>
                  <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-48 shadow-[2px_2px_0px_#0A0A0A]">
                    {JSON.stringify(displayProof, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Verifier Side */}
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b-2 border-black">
                <h3 className="font-[800] text-base uppercase tracking-tight">
                  Verifier (Smart Contract / Auditor)
                </h3>
                <Badge variant="outline">ON-CHAIN VERIFIER</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4 font-mono">
                Checks pairing equation <code className="bg-[#0A0A0A] text-[#00C853] px-1 py-0.5 border border-black">e(A, B) = e(α, β) · e(C, δ)</code> without ever seeing keys.
              </p>

              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                  Verification Target (Stealth Address)
                </span>
                <pre className="border-2 border-black bg-white dark:bg-black p-2.5 font-mono text-xs break-all whitespace-pre-wrap">
                  {stealthKeys?.stealthAddress || '0x...'}
                </pre>
              </div>

              {/* Tamper Switch */}
              <div
                className={`border-2 border-black p-4 mb-4 transition-colors ${
                  isTampered ? 'bg-[#FF2D2D]/10 border-[#FF2D2D]' : 'bg-[#E8E8E3]/60'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isTampered}
                    onChange={(e) => onTamperToggle(e.target.checked)}
                    className="size-5 rounded-none border-2 border-black accent-[#FF2D2D] cursor-pointer"
                  />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Inject Adversarial Parameter (Tamper Verification)
                  </span>
                </label>
                <div
                  className={`text-xs font-mono font-bold mt-2 ${
                    isTampered ? 'text-[#FF2D2D]' : 'text-muted-foreground'
                  }`}
                >
                  {isTampered
                    ? '⚠ Adversarial payload active: Scalar corrupted with invalid parameters.'
                    : 'Valid state: Authentic cryptographic parameters ready for verification.'}
                </div>
              </div>
            </div>

            <div>
              {isVerifying && (
                <div className="mb-4">
                  <ProgressLoader
                    progress={verifyProgress}
                    statusText={verifyStatus}
                  />
                </div>
              )}

              <Button
                type="button"
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleVerify}
                disabled={!proof || isVerifying}
              >
                {isVerifying ? `Verifying Proof... (${verifyProgress}%)` : 'Verify Proof'}
              </Button>

              {/* Verification Result Display */}
              {verificationResult !== null && !isVerifying && (
                <div className="mt-4">
                  {verificationResult ? (
                    <Alert variant="success">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">✓</span>
                        <AlertTitle className="text-sm font-[900] uppercase tracking-wide mb-0">
                          VALID PROOF — OWNERSHIP CONFIRMED
                        </AlertTitle>
                      </div>
                      <AlertDescription className="text-xs text-foreground font-medium">
                        Ownership verified! Cryptographic proof confirms the caller controls the stealth address holding {asset?.name} without revealing identity.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">✗</span>
                        <AlertTitle className="text-sm font-[900] uppercase tracking-wide mb-0">
                          INVALID PROOF — FORGERY DETECTED
                        </AlertTitle>
                      </div>
                      <AlertDescription className="text-xs text-foreground font-medium">
                        Verification failed! Proof parameters or public signals do not satisfy the elliptic curve pairing equation. Fraud detected.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Final Summary Card */}
        {verificationResult === true && !isVerifying && (
          <div className="border-2 border-black bg-[#FFDD00] p-6 shadow-[6px_6px_0px_#0A0A0A]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b-2 border-black">
              <h3 className="font-[900] text-xl uppercase tracking-tight">
                Privacy-Preserving RWA Transfer Complete
              </h3>
              <Badge variant="default">SYSTEM VERIFIED</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#0A0A0A]">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  1. Asset Transferred
                </span>
                <div className="font-[900] text-base">{asset?.name}</div>
                <div className="text-xs font-mono mt-1 text-muted-foreground">
                  ${asset?.value.toLocaleString()} USD ({asset?.type})
                </div>
              </div>

              <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#0A0A0A]">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  2. Owner Identity Private
                </span>
                <div className="font-[900] text-base text-[#0A0A0A]">
                  Recipient: Bob (Hidden)
                </div>
                <div className="text-xs font-mono mt-1 text-muted-foreground">
                  Stealth Address controls custody
                </div>
              </div>

              <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#0A0A0A]">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  3. Mathematical Guarantee
                </span>
                <div className="font-[900] text-base text-[#00C853] bg-black px-1.5 py-0.5 inline-block">
                  Groth16 Validated
                </div>
                <div className="text-xs font-mono mt-1 text-muted-foreground">
                  Zero identity leaks on-chain
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center gap-4 flex-wrap pt-4 border-t-2 border-black">
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            ← Back to Transfer Step
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={onRestart}>
            ↺ Reset Protocol Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
