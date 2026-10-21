'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RWAAsset, StealthKeys, TransferRecord } from '@/lib/rwa-privacy/types';
import { generateBlockNumber, generateTxHash } from '@/lib/rwa-privacy/crypto';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProgressLoader } from '@/components/ui/progress-loader';
import MockLedgerTable from './MockLedgerTable';

interface TransactionPanelProps {
  asset: RWAAsset | null;
  stealthKeys: StealthKeys | null;
  transferRecord: TransferRecord | null;
  onTransferComplete: (record: TransferRecord) => void;
  onProceed: () => void;
  onBack: () => void;
}

export default function TransactionPanel({
  asset,
  stealthKeys,
  transferRecord,
  onTransferComplete,
  onProceed,
  onBack,
}: TransactionPanelProps) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastStatus, setBroadcastStatus] = useState('PREPARING ON-CHAIN TRANSFER TRANSACTION...');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleExecuteTransfer = () => {
    if (!asset || !stealthKeys || isBroadcasting) return;

    setIsBroadcasting(true);
    setBroadcastProgress(1);
    setBroadcastStatus('COMPOSING ERC-3643 PRIVACY TRANSFER ENVELOPE...');

    let current = 1;
    timerRef.current = setInterval(() => {
      // 180ms intervals with ~1.8% avg increment => ~10 seconds total
      current += Math.random() * 0.8 + 1.4;

      if (current < 20) {
        setBroadcastStatus('COMPOSING ERC-3643 PRIVACY TRANSFER ENVELOPE...');
      } else if (current >= 20 && current < 40) {
        setBroadcastStatus('SIGNING SENDER WITNESS & BROADCASTING TO MEMPOOL...');
      } else if (current >= 40 && current < 65) {
        setBroadcastStatus('PROPAGATING TX ACROSS VALIDATOR GOSSIP NETWORK...');
      } else if (current >= 65 && current < 88) {
        setBroadcastStatus('AWAITING MULTI-VALIDATOR CONSENSUS ATTESTATIONS...');
      } else if (current >= 88) {
        setBroadcastStatus('TRANSACTION INCLUDED IN BLOCK & FINALIZED ON LEDGER!');
      }

      if (current >= 100) {
        current = 100;
        if (timerRef.current) clearInterval(timerRef.current);
        setBroadcastProgress(100);

        setTimeout(() => {
          setIsBroadcasting(false);

          const record: TransferRecord = {
            txHash: generateTxHash(),
            blockNumber: generateBlockNumber(),
            fromAddress: asset.ownerAddress,
            toAddress: stealthKeys.stealthAddress,
            assetId: asset.id,
            assetName: asset.name,
            assetType: asset.type,
            value: asset.value,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            status: 'confirmed',
            isPrivate: true,
          };

          onTransferComplete(record);
        }, 400);
      } else {
        setBroadcastProgress(Math.floor(current));
      }
    }, 180);
  };

  // Build ledger entries including initial registration if available + stealth transfer
  const ledgerEntries: TransferRecord[] = [];
  if (asset) {
    ledgerEntries.push({
      txHash: asset.registeredTxHash || '0x5829a8f0923e...',
      blockNumber: asset.registeredBlock || 19820100,
      fromAddress: '0x0000000000000000000000000000000000000000 (Mint)',
      toAddress: asset.ownerAddress,
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      value: asset.value,
      timestamp: asset.registeredAt || '2026-10-21 14:20:00 UTC',
      status: 'confirmed',
      isPrivate: false,
    });
  }

  if (transferRecord) {
    ledgerEntries.unshift(transferRecord);
  }

  return (
    <Card className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] bg-background">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">STEP 3 OF 4</Badge>
          <Badge variant="outline">ON-CHAIN ROUTING</Badge>
        </div>
        <CardTitle className="text-2xl font-[900] uppercase tracking-[-0.03em]">
          Transfer RWA to Stealth Address
        </CardTitle>
        <CardDescription className="text-sm">
          Execute an on-chain transfer routing the tokenized asset into the derived stealth address. Observers will verify an authentic transaction, but the true recipient remains completely anonymous.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Transaction Details Card */}
        <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#0A0A0A]">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b-2 border-black">
            <h3 className="font-[800] text-base uppercase tracking-tight">
              On-Chain Transaction Payload
            </h3>
            <Badge variant="default">ERC-3643 / PRIVACY WRAPPER</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                From (Sender Address)
              </span>
              <pre className="border-2 border-black bg-white dark:bg-black p-3 font-mono text-xs break-all whitespace-pre-wrap">
                {asset?.ownerAddress || '0xAliceAddress...'}
              </pre>
              <div className="text-xs font-mono font-bold mt-1 text-muted-foreground">
                Entity: {asset?.ownerLabel || 'Alice'}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                To (Target Stealth Address)
              </span>
              <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-3 text-xs font-mono break-all whitespace-pre-wrap shadow-[2px_2px_0px_#0A0A0A]">
                {stealthKeys?.stealthAddress || '0xStealthAddress...'}
              </pre>
              <div className="text-xs font-mono font-bold mt-1 text-[#00C853] bg-black px-1.5 py-0.5 inline-block">
                Status: Cryptographically Untraceable to Bob
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t-2 border-black">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                Token Name
              </span>
              <div className="font-[800]">{asset?.name || 'Asset Name'}</div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                Asset Classification
              </span>
              <div className="font-[800]">{asset?.type || 'Real Estate'}</div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                Total Value
              </span>
              <div className="font-[900] text-lg">
                ${asset?.value?.toLocaleString() || '0'} USD
              </div>
            </div>
          </div>
        </div>

        {/* Broadcasting Animation using ProgressLoader */}
        {isBroadcasting && (
          <ProgressLoader
            progress={broadcastProgress}
            statusText={broadcastStatus}
          />
        )}

        {/* Broadcast execution button */}
        {!transferRecord && !isBroadcasting && (
          <div>
            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={handleExecuteTransfer}
              disabled={!asset || !stealthKeys || isBroadcasting}
            >
              Execute On-Chain Transfer
            </Button>
          </div>
        )}

        {/* Transfer Confirmed State */}
        {transferRecord && !isBroadcasting && (
          <div className="space-y-6 pt-4 border-t-2 border-black">
            <Alert variant="success">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✓</span>
                <AlertTitle className="text-sm font-[800] uppercase tracking-wide mb-0">
                  TRANSACTION CONFIRMED IN BLOCK #{transferRecord.blockNumber}
                </AlertTitle>
              </div>
              <AlertDescription className="text-xs text-foreground font-medium">
                The RWA contract has successfully updated token custody to the stealth address. The public ledger reflects the transfer without ever revealing Bob&apos;s real address or legal identity.
              </AlertDescription>
              <div className="mt-3">
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                  Confirmed Tx Hash:
                </span>
                <code className="border-2 border-black bg-black text-[#00C853] p-1.5 text-xs font-mono break-all inline-block">
                  {transferRecord.txHash}
                </code>
              </div>
            </Alert>

            {/* Real-time Explorer Table */}
            <MockLedgerTable
              records={ledgerEntries}
              title="Blockchain Explorer — Post-Transfer State"
              subtitle="Notice how the asset is held by the stealth address with no link to Bob"
              highlightHash={transferRecord.txHash}
            />

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <Button type="button" variant="outline" size="lg" onClick={onBack}>
                ← Back to Stealth Address
              </Button>
              <Button type="button" variant="default" size="lg" onClick={onProceed}>
                Proceed to Ownership ZK Proof →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
