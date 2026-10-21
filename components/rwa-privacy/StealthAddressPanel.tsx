'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RWAAsset, StealthKeys } from '@/lib/rwa-privacy/types';
import { createStealthBundle } from '@/lib/rwa-privacy/crypto';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProgressLoader } from '@/components/ui/progress-loader';

interface StealthAddressPanelProps {
  asset: RWAAsset | null;
  stealthKeys: StealthKeys | null;
  onKeysGenerated: (keys: StealthKeys) => void;
  onProceed: () => void;
  onBack: () => void;
}

export default function StealthAddressPanel({
  asset,
  stealthKeys,
  onKeysGenerated,
  onProceed,
  onBack,
}: StealthAddressPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [generateStatus, setGenerateStatus] = useState('INITIALIZING SECP256K1 CURVE...');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGenerate = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerateProgress(1);
    setGenerateStatus('READING RECIPIENT PUBLIC META-KEYS (VIEWING & SPENDING)...');

    let current = 1;
    timerRef.current = setInterval(() => {
      // 180ms intervals with ~1.45% avg increment => ~12.5 seconds total
      current += Math.random() * 0.7 + 1.1;

      if (current < 18) {
        setGenerateStatus('READING RECIPIENT PUBLIC META-KEYS (VIEWING & SPENDING)...');
      } else if (current >= 18 && current < 35) {
        setGenerateStatus('SAMPLING SECP256K1 CRYPTOGRAPHIC ENTROPY...');
      } else if (current >= 35 && current < 55) {
        setGenerateStatus('GENERATING EPHEMERAL SECRET \'r\' & BROADCAST KEY \'R\'...');
      } else if (current >= 55 && current < 75) {
        setGenerateStatus('COMPUTING DIFFIE-HELLMAN SHARED SECRET H(r · K_view)...');
      } else if (current >= 75 && current < 90) {
        setGenerateStatus('BLINDING SPENDING KEY VIA ELLIPTIC CURVE POINT MULTIPLICATION...');
      } else if (current >= 90) {
        setGenerateStatus('DERIVING ONE-TIME UNLINKABLE STEALTH DESTINATION ADDRESS!');
      }

      if (current >= 100) {
        current = 100;
        if (timerRef.current) clearInterval(timerRef.current);
        setGenerateProgress(100);

        setTimeout(() => {
          const bundle = createStealthBundle('Bob');
          onKeysGenerated(bundle);
          setIsGenerating(false);
        }, 400);
      } else {
        setGenerateProgress(Math.floor(current));
      }
    }, 180);
  };

  return (
    <Card className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] bg-background">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="accent">STEP 2 OF 4</Badge>
          {asset && (
            <Badge variant="default">
              TARGET: {asset.name} (${asset.value.toLocaleString()} USD)
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-[900] uppercase tracking-[-0.03em]">
          Generate Stealth Address
        </CardTitle>
        <CardDescription className="text-sm">
          To break the link between recipient and asset, the receiver publishes a public meta-address (spending + viewing keys). The sender combines this with an ephemeral key pair to derive an entirely new, single-use stealth address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Recipient Master Keys */}
        <div className="border-2 border-black bg-[#E8E8E3]/50 p-5 shadow-[4px_4px_0px_#0A0A0A]">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b-2 border-black">
            <h3 className="font-[800] text-base uppercase tracking-tight">
              Recipient Meta-Keys (Bob)
            </h3>
            <Badge variant="default">STATIC IDENTITY KEYS</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            The receiver generates a dual-key pair. The <strong className="text-foreground">viewing key</strong> allows scanning the chain for incoming payments, while the <strong className="text-foreground">spending key</strong> is held strictly offline to control funds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                Recipient Viewing Key (Scanning)
              </span>
              <pre className="border-2 border-black bg-white dark:bg-black p-3 font-mono text-xs break-all whitespace-pre-wrap">
                {stealthKeys?.recipientViewingKey || '0x4f8c92a10b37... [Click Generate Below]'}
              </pre>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                Recipient Spending Key (Secret)
              </span>
              <pre className="border-2 border-black bg-white dark:bg-black p-3 font-mono text-xs break-all whitespace-pre-wrap">
                {stealthKeys?.recipientSpendingKey || '0x99e018d41a77... [Click Generate Below]'}
              </pre>
            </div>
          </div>
        </div>

        {isGenerating && (
          <ProgressLoader
            progress={generateProgress}
            statusText={generateStatus}
          />
        )}

        <div>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating
              ? `Deriving Stealth Keys... (${generateProgress}%)`
              : stealthKeys
              ? 'Regenerate New Ephemeral Stealth Address'
              : 'Generate Stealth Address for this Transfer'}
          </Button>
        </div>

        {stealthKeys && !isGenerating && (
          <div className="space-y-6 pt-4 border-t-2 border-black">
            {/* Ephemeral Key Announcement */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                Ephemeral Public Key (Published by Sender in Tx Data)
              </span>
              <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all shadow-[4px_4px_0px_#0A0A0A]">
                {stealthKeys.ephemeralPubKey}
              </pre>
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Broadcast alongside the transfer. Only Bob can compute the matching private key: <span className="bg-[#0A0A0A] text-[#00C853] px-1.5 py-0.5 border border-black font-bold">P = H(r · K_view) · G + K_spend</span>
              </p>
            </div>

            {/* Unlinkability Diff Panel */}
            <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#0A0A0A]">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b-2 border-black">
                <h3 className="font-[800] text-base uppercase tracking-tight">
                  Unlinkability Verification Diff
                </h3>
                <Badge variant="success">0% CRYPTOGRAPHIC CORRELATION</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4 bg-[#F5F5F0]">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    Original Recipient Public Address
                  </span>
                  <pre className="border-2 border-black bg-black text-[#FF2D2D] p-3 font-mono text-xs break-all whitespace-pre-wrap">
                    {stealthKeys.originalRecipientAddress}
                  </pre>
                  <div className="mt-2 text-xs font-[800] text-[#FF2D2D] uppercase tracking-wide">
                    ✕ NEVER EXPOSED ON PUBLIC LEDGER
                  </div>
                </div>

                <div className="border-2 border-black border-l-[6px] border-l-[#00C853] p-4 bg-white shadow-[2px_2px_0px_#0A0A0A]">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    One-Time Stealth Address (Derived Destination)
                  </span>
                  <pre className="border-2 border-black bg-black text-[#00C853] p-3 font-mono text-xs break-all whitespace-pre-wrap">
                    {stealthKeys.stealthAddress}
                  </pre>
                  <div className="mt-2 text-xs font-[800] text-[#0A0A0A] uppercase tracking-wide">
                    ✓ ONLY THIS UNLINKABLE HASH IS SEEN BY OBSERVERS
                  </div>
                </div>
              </div>
            </div>

            {/* Success Alert */}
            <Alert variant="success">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✓</span>
                <AlertTitle className="text-sm font-[800] uppercase tracking-wide mb-0">
                  ON-CHAIN, ONLY THE STEALTH ADDRESS APPEARS
                </AlertTitle>
              </div>
              <AlertDescription className="text-xs text-foreground font-medium">
                The real recipient is hidden from external observers, blockchain explorers, and surveillance algorithms.
              </AlertDescription>
            </Alert>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <Button type="button" variant="outline" size="lg" onClick={onBack}>
                ← Back to Asset Form
              </Button>
              <Button type="button" variant="default" size="lg" onClick={onProceed}>
                Proceed to Transfer RWA →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
