'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AssetType, RWAAsset } from '@/lib/rwa-privacy/types';
import { generateAddress, generateBlockNumber, generateTxHash, randomHex } from '@/lib/rwa-privacy/crypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProgressLoader } from '@/components/ui/progress-loader';

interface AssetFormProps {
  asset: RWAAsset | null;
  onAssetRegistered: (asset: RWAAsset) => void;
  onProceed: () => void;
}

const ASSET_TYPES: AssetType[] = ['Real Estate', 'Bond', 'Equity', 'Commodity'];

export default function AssetForm({ asset, onAssetRegistered, onProceed }: AssetFormProps) {
  const [name, setName] = useState(asset?.name || 'Commercial Tower Manhattan');
  const [type, setType] = useState<AssetType>(asset?.type || 'Real Estate');
  const [value, setValue] = useState(asset?.value ? String(asset.value) : '2500000');
  const [ownerLabel, setOwnerLabel] = useState(asset?.ownerLabel || 'Alice');
  const [submitted, setSubmitted] = useState(!!asset);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerProgress, setRegisterProgress] = useState(0);
  const [registerStatus, setRegisterStatus] = useState('VALIDATING ASSET TITLE & RECORD...');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) return;

    setIsRegistering(true);
    setRegisterProgress(2);
    setRegisterStatus('VALIDATING ASSET TITLE & RECORD ON REGISTRY...');

    const numValue = parseFloat(value) || 0;
    const ownerAddress = asset?.ownerAddress || generateAddress(ownerLabel);
    const newAsset: RWAAsset = {
      id: asset?.id || 'rwa-' + randomHex(8).replace('0x', ''),
      name,
      type,
      value: numValue,
      ownerLabel,
      ownerAddress,
      registeredTxHash: asset?.registeredTxHash || generateTxHash(),
      registeredBlock: asset?.registeredBlock || generateBlockNumber(),
      registeredAt: asset?.registeredAt || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    };

    let current = 2;
    timerRef.current = setInterval(() => {
      // 150ms intervals with ~2.4% avg increment => ~6.2 seconds total
      current += Math.random() * 1.6 + 1.6;

      if (current < 25) {
        setRegisterStatus('VALIDATING ASSET TITLE & RECORD ON REGISTRY...');
      } else if (current >= 25 && current < 50) {
        setRegisterStatus('INITIALIZING ERC-3643 PERMISSIONED COMPLIANCE RULES...');
      } else if (current >= 50 && current < 75) {
        setRegisterStatus('COMPUTING ON-CHAIN ASSET IDENTIFIER...');
      } else if (current >= 75 && current < 92) {
        setRegisterStatus('MINING BLOCK & COMMITTING TITLE TO PUBLIC LEDGER...');
      } else if (current >= 92) {
        setRegisterStatus('ASSET REGISTRATION FINALIZED ON LEDGER!');
      }

      if (current >= 100) {
        current = 100;
        if (timerRef.current) clearInterval(timerRef.current);
        setRegisterProgress(100);

        setTimeout(() => {
          setIsRegistering(false);
          onAssetRegistered(newAsset);
          setSubmitted(true);
        }, 400);
      } else {
        setRegisterProgress(Math.floor(current));
      }
    }, 150);
  };

  return (
    <Card className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] bg-background">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">STEP 1 OF 4</Badge>
          <Badge variant="outline">PUBLIC LEDGER</Badge>
        </div>
        <CardTitle className="text-2xl font-[900] uppercase tracking-[-0.03em]">
          Register Real-World Asset
        </CardTitle>
        <CardDescription className="text-sm">
          Issue and tokenize a Real World Asset (RWA) onto the public ledger under standard transparent conditions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" htmlFor="asset-name">
                Asset Name
              </label>
              <Input
                id="asset-name"
                type="text"
                value={name}
                disabled={isRegistering}
                onChange={(e) => {
                  setName(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. 500 Park Ave Real Estate"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" htmlFor="asset-type">
                Asset Type
              </label>
              <select
                id="asset-type"
                disabled={isRegistering}
                className="flex h-9 w-full rounded-none border-2 border-black bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-black focus-visible:shadow-[4px_4px_0px_#0A0A0A] disabled:opacity-50"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as AssetType);
                  setSubmitted(false);
                }}
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" htmlFor="asset-value">
                Asset Value (USD)
              </label>
              <Input
                id="asset-value"
                type="number"
                min="1"
                disabled={isRegistering}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="2500000"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" htmlFor="owner-label">
                Owner Name / Label
              </label>
              <Input
                id="owner-label"
                type="text"
                disabled={isRegistering}
                value={ownerLabel}
                onChange={(e) => {
                  setOwnerLabel(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. Alice"
                required
              />
            </div>
          </div>

          {isRegistering && (
            <ProgressLoader
              progress={registerProgress}
              statusText={registerStatus}
            />
          )}

          <div>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={isRegistering}
            >
              {isRegistering
                ? `Registering on Ledger... (${registerProgress}%)`
                : submitted
                ? 'Update Registered Asset'
                : 'Register Asset on Public Ledger'}
            </Button>
          </div>
        </form>

        {asset && !isRegistering && (
          <div className="space-y-6 pt-4 border-t-2 border-black">
            {/* Destructive Warning Alert */}
            <Alert variant="destructive">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⚠</span>
                <AlertTitle className="text-sm font-[800] uppercase tracking-wide mb-0">
                  CRITICAL PRIVACY HAZARD: ANYONE CAN SEE THIS ON-CHAIN
                </AlertTitle>
              </div>
              <AlertDescription className="text-xs text-foreground font-medium">
                Your legal identity, tokenized property value (${asset.value.toLocaleString()} USD), and transaction records are perpetually broadcast to every competitor, chain-analysis firm, and public explorer.
              </AlertDescription>
            </Alert>

            {/* Public Ledger Entry */}
            <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#0A0A0A]">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b-2 border-black">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Public Ledger Inspection Record
                </span>
                <Badge variant="destructive">STATUS: FULLY EXPOSED</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Owner Identity Label
                  </span>
                  <div className="font-[800] text-base">{asset.ownerLabel}</div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Public Wallet Address (Exposed)
                  </span>
                  <pre className="border-2 border-black bg-black text-[#FF2D2D] p-2 text-xs font-mono break-all whitespace-pre-wrap">
                    {asset.ownerAddress}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Asset Token ID
                  </span>
                  <pre className="border-2 border-black bg-black text-[#00C853] p-2 text-xs font-mono break-all whitespace-pre-wrap">
                    {asset.id}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Declared Market Value
                  </span>
                  <div className="font-[900] text-xl">
                    ${asset.value.toLocaleString()} USD
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tx Hash
                  </span>
                  <pre className="border-2 border-black bg-white dark:bg-black p-2 font-mono text-xs break-all whitespace-pre-wrap">
                    {asset.registeredTxHash}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Block Number
                  </span>
                  <div className="font-mono text-sm font-bold">
                    #{asset.registeredBlock}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button type="button" variant="default" size="lg" onClick={onProceed}>
                Proceed to Stealth Address Generation →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
