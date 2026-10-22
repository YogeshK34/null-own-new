import Link from 'next/link';
import { NavBar } from '@/components/nav-bar';
import MockLedgerTable from '@/components/rwa-privacy/MockLedgerTable';
import { TransferRecord } from '@/lib/rwa-privacy/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata = {
  title: 'RWA Privacy Architecture | Stealth Addresses & ZK Proofs',
  description: 'RWA on public chains is a privacy breach. Here is the fix.',
};

const EXPOSED_TRANSACTIONS: TransferRecord[] = [
  {
    txHash: '0x9b72a1e840d0c8fa62e7a17bc12e4315bc302179b4a5309bca7df61e389e1a90',
    blockNumber: 19821034,
    fromAddress: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
    toAddress: '0x71C80F2c68e1aA154562c5b73D05e83693F38b29 (Alice)',
    assetId: 'rwa-ny-real-estate-44',
    assetName: 'Park Ave Commercial High-Rise Deed',
    assetType: 'Real Estate',
    value: 12500000,
    timestamp: '2026-10-21 09:12:44 UTC',
    status: 'confirmed',
    isPrivate: false,
  },
  {
    txHash: '0x3a4f6690cb25390e1bc031405e3f2277cba774577884489a421f57ba2358c21a',
    blockNumber: 19821029,
    fromAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    toAddress: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB (Bob)',
    assetId: 'rwa-us-treasury-2026',
    assetName: '10Y US Treasury Note Tokenized Series',
    assetType: 'Bond',
    value: 5000000,
    timestamp: '2026-10-21 08:48:19 UTC',
    status: 'confirmed',
    isPrivate: false,
  },
  {
    txHash: '0x17c98e1047db331f24d776f3ea83359190117ab8997a06f36528d2038740d999',
    blockNumber: 19820982,
    fromAddress: '0x0000000000000000000000000000000000000000',
    toAddress: '0x8472901a88b5e27a6962058e132981da4f09a632 (Citadel Corp)',
    assetId: 'rwa-crude-oil-vault',
    assetName: 'Permian Crude Reserve Warehouse Receipt',
    assetType: 'Commodity',
    value: 18400000,
    timestamp: '2026-10-21 07:33:02 UTC',
    status: 'confirmed',
    isPrivate: false,
  },
];

export default function RWAPrivacyLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        {/* HERO SECTION */}
        <section className="mb-14">
          <div className="mb-3">
            <Badge variant="destructive" className="text-xs">
              ARCHITECTURAL EXPOSURE ALERT
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-[900] tracking-[-0.04em] uppercase leading-tight mb-4">
            RWA ON PUBLIC CHAINS IS A PRIVACY BREACH. HERE&apos;S THE FIX.
          </h1>

          <p className="font-mono text-base text-muted-foreground max-w-3xl leading-relaxed">
            Tokenizing real-world assets without cryptographic unlinkability broadcasts commercial holdings, corporate balance sheets, and personal net worth to global surveillance.
          </p>

          <div className="flex gap-4 flex-wrap mt-8">
            <Button asChild variant="secondary" size="lg">
              <Link href="/rwa-privacy/demo">
                Launch Protocol Console →
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#problem-breakdown">
                Inspect the Breach ↓
              </a>
            </Button>
          </div>
        </section>

        <hr className="border-t-2 border-black my-12" id="problem-breakdown" />

        {/* PROBLEM SECTION */}
        <section className="mb-14">
          <div className="mb-2">
            <Badge variant="destructive">THE REALITY OF PUBLIC CHAINS</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-[900] tracking-[-0.03em] uppercase mb-2">
            1. The Exposure Vector
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-3xl mb-8">
            When an institutional debt bond, luxury real estate title, or commodities note is minted or transferred on Ethereum or L2s, the transfer history permanently exposes the counterparty wallet, physical asset metadata, and transaction size.
          </p>

          {/* Flow Diagram */}
          <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_#0A0A0A] mb-8">
            <span className="text-xs font-bold uppercase tracking-wider block mb-4">
              Vulnerability Flow Diagram
            </span>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="border-2 border-black p-4 bg-background">
                <div className="font-mono font-bold text-xs text-muted-foreground mb-1">
                  STEP 1
                </div>
                <div className="font-[900] text-sm uppercase">Public Chain Transfer</div>
                <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Alice transfers RWA token to Bob&apos;s known public Ethereum address.
                </div>
              </div>

              <div className="text-center font-[900] text-2xl hidden md:block">
                →
              </div>

              <div className="border-2 border-black p-4 bg-[#E8E8E3]/60">
                <div className="font-mono font-bold text-xs text-muted-foreground mb-1">
                  STEP 2
                </div>
                <div className="font-[900] text-sm uppercase">Global Ledger Visibility</div>
                <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Block explorers, chain analysis firms, and adversaries index the token holder.
                </div>
              </div>

              <div className="text-center font-[900] text-2xl hidden md:block">
                →
              </div>

              <div className="border-2 border-black p-4 bg-[#FF2D2D] text-[#F5F5F0] shadow-[2px_2px_0px_#0A0A0A]">
                <div className="font-mono font-bold text-xs text-[#FFDD00] mb-1">
                  CRITICAL IMPACT
                </div>
                <div className="font-[900] text-sm uppercase">Total Privacy Breach</div>
                <div className="text-xs mt-1.5 font-medium text-white/90">
                  Competitors track solvency, collateral, and commercial deals in real time.
                </div>
              </div>
            </div>
          </div>

          {/* Exposed Ledger Table */}
          <MockLedgerTable
            records={EXPOSED_TRANSACTIONS}
            title="Public Explorer Snapshot (Unprotected RWA Protocol)"
            subtitle="Identities, balances, and asset legal designations are fully leaked to the world"
          />

          <Alert variant="destructive" className="mt-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">⚠</span>
              <AlertTitle className="text-sm font-[900] uppercase tracking-wide mb-0">
                ZERO COMMERCIAL CONFIDENTIALITY
              </AlertTitle>
            </div>
            <AlertDescription className="text-xs text-foreground font-medium">
              No institutional treasury, sovereign fund, or private individual can operate under complete transparent balance sheet disclosure. Privacy is not optional for real-world finance.
            </AlertDescription>
          </Alert>
        </section>

        <hr className="border-t-2 border-black my-12" />

        {/* SOLUTION SECTION */}
        <section className="mb-14">
          <div className="mb-2">
            <Badge variant="success">THE PROTOCOL ARCHITECTURE</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-[900] tracking-[-0.03em] uppercase mb-2">
            2. The Fix: Stealth Addresses + ZKP
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-3xl mb-8">
            We eliminate public address linkability by combining non-interactive Diffie-Hellman stealth addresses with Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs).
          </p>

          {/* 3-Step Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Step 1 Card */}
            <Card className="border-2 border-black border-l-[6px] border-l-[#FFDD00] shadow-[4px_4px_0px_#0A0A0A] bg-white">
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <span className="size-6 bg-black text-[#FFDD00] flex items-center justify-center font-[900] text-xs">
                    1
                  </span>
                  <Badge variant="accent">KEY DERIVATION</Badge>
                </div>
                <CardTitle className="text-base font-[900] uppercase tracking-tight">
                  Generate Stealth Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  Sender derives a fresh one-time destination address using receiver&apos;s public viewing key and an ephemeral secret.
                </p>
                <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all shadow-[2px_2px_0px_#0A0A0A]">
                  P = H(r · K_view)·G + K_spend
                </pre>
              </CardContent>
            </Card>

            {/* Step 2 Card */}
            <Card className="border-2 border-black border-l-[6px] border-l-[#00C853] shadow-[4px_4px_0px_#0A0A0A] bg-white">
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <span className="size-6 bg-black text-[#00C853] flex items-center justify-center font-[900] text-xs">
                    2
                  </span>
                  <Badge variant="success">ON-CHAIN SETTLEMENT</Badge>
                </div>
                <CardTitle className="text-base font-[900] uppercase tracking-tight">
                  Send RWA to Stealth Hash
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  Token moves into the stealth address on-chain. External observers see an unrelated address with no link to the receiver.
                </p>
                <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all shadow-[2px_2px_0px_#0A0A0A]">
                  To: 0x47e1...99bc [Unlinkable]
                </pre>
              </CardContent>
            </Card>

            {/* Step 3 Card */}
            <Card className="border-2 border-black border-l-[6px] border-l-black shadow-[4px_4px_0px_#0A0A0A] bg-white">
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <span className="size-6 bg-black text-white flex items-center justify-center font-[900] text-xs">
                    3
                  </span>
                  <Badge variant="default">ZERO-KNOWLEDGE</Badge>
                </div>
                <CardTitle className="text-base font-[900] uppercase tracking-tight">
                  Prove Ownership with ZKP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  Owner proves control over the spending key via zk-SNARK. The verifier validates title ownership without knowing who holds it.
                </p>
                <pre className="border-2 border-black bg-[#0A0A0A] text-[#00C853] p-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all shadow-[2px_2px_0px_#0A0A0A]">
                  Verify: e(π_a, π_b) = e(α, β)·e(π_c, δ)
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Transfer Engine CTA Card */}
          <div className="border-2 border-black bg-[#0A0A0A] text-[#F5F5F0] p-6 shadow-[6px_6px_0px_#0A0A0A]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="text-[#FFDD00] font-[900] text-lg sm:text-xl uppercase tracking-tight mb-2">
                  INITIALIZE CRYPTOGRAPHIC TRANSFER ENGINE
                </div>
                <div className="text-xs sm:text-sm text-[#E8E8E3] max-w-2xl font-mono leading-relaxed">
                  Execute the 4-stage transfer flow with live key derivation, immutable ledger execution, and Groth16 zk-SNARK verification.
                </div>
              </div>
              <Button asChild variant="secondary" size="lg" className="shrink-0">
                <Link href="/rwa-privacy/demo">
                  Launch Console →
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <hr className="border-t-2 border-black mt-12 mb-6" />
        <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="text-foreground">
            NULL OWN PRIVACY ARCHITECTURE & PROTOCOL SPECIFICATION
          </div>
          <div className="font-mono text-xs">
            NEO-BRUTALIST ARCHITECTURE • CRYPTOGRAPHIC PROTOCOL SPECIFICATION
          </div>
        </footer>
      </main>
    </div>
  );
}
