# NullOwn

> **Privacy-Preserving Real World Asset (RWA) Architecture on Public Blockchains**  
> Cryptographic unlinkability via non-interactive Diffie-Hellman stealth addresses and zero-knowledge ownership verification.

---

## ⚡ Overview

Tokenizing Real World Assets (RWAs)—such as commercial real estate, sovereign debt, corporate equities, and commodities—directly on public ledgers introduces severe privacy and counterparty risks. Because public blockchains broadcast every transaction, account balance, and address interaction, corporate treasuries and high-net-worth participants are exposed to global surveillance and predatory intelligence extraction.

**NullOwn** provides a cryptographic privacy architecture that decouples asset ownership from on-chain identity:

1. **Unlinkable Transfers**: Utilizes non-interactive Diffie-Hellman key derivation (ERC-5564) to generate one-time stealth addresses for recipients. On-chain observers only see an anonymous address receiving the asset.
2. **Zero-Knowledge Ownership Proofs**: Leverages Groth16 zk-SNARK proofs over BN254 to enable asset owners to cryptographically prove ownership to verifiers and auditors without disclosing their identity or private spending keys.

---

## 🏗️ Protocol Architecture & Flow

The system guides users through the complete four-step lifecycle:

```
[ Step 1: Register RWA ]
   │  Tokenize asset with attributes (name, type, value, owner)
   ▼  Exposed on public ledger (baseline vulnerability)
[ Step 2: Derive Stealth Keys ]
   │  Recipient provides viewing & spending meta-keys
   ▼  ECDH computation yields an unlinkable one-time stealth address
[ Step 3: Execute Confidential Transfer ]
   │  Asset ownership transfers to the stealth address
   ▼  Ledger reflects new holder; recipient's real identity remains hidden
[ Step 4: Prove Ownership via ZKP ]
      Owner generates Groth16 zk-SNARK proof using private spending key
      Verifier mathematically confirms ownership without identity disclosure
```

### 1. RWA Tokenization & Registry
* Captures asset properties across major classes: **Real Estate**, **Bonds**, **Equities**, and **Commodities**.
* Demonstrates the initial public ledger record, highlighting unshielded ownership visibility.

### 2. Stealth Address Derivation (ERC-5564)
* Operates on dual-key meta-addresses: a **spending key** and a **viewing key**.
* Derives an ephemeral public key and shared secret using elliptic curve Diffie-Hellman (secp256k1).
* Generates a unique, one-time destination address mathematically decoupled from the recipient's public address.

### 3. Private Ledger Settlement
* Submits the asset transfer transaction to the network.
* Updates the public ledger: on-chain records reflect the asset being held by the stealth address, breaking transaction graph linkability.

### 4. Zero-Knowledge Ownership Attestation (Groth16 zk-SNARK)
* **Prover**: Synthesizes R1CS arithmetic constraints and computes Groth16 proof points (`pi_a`, `pi_b`, `pi_c`) using the private spending key, stealth address, and asset ID.
* **Verifier**: Evaluates pairing equations against public signals to determine valid or invalid ownership status. Includes a tamper toggle to test cryptographic resilience against forged signals.

---

## 🛠️ Tech Stack

* **Core Framework**: [Next.js 16](https://nextjs.org) (App Router, Server & Client Components)
* **Runtime & Library**: React 19, TypeScript
* **Styling**: Tailwind CSS v4, custom Neo-Brutalism design system
* **UI Primitives**: `@base-ui/react`, `@radix-ui/react-slot`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
* **Standards Modeled**:
  * **ERC-5564**: Non-interactive stealth address generation
  * **ERC-3643**: Permissioned tokenized asset compliance
  * **Groth16 zk-SNARK / BN254**: Zero-knowledge proof structures
* **Package Manager**: [pnpm](https://pnpm.io)

---

## 📁 Project Structure

```
null-own/
├── app/
│   ├── layout.tsx                 # Root layout with fonts & metadata
│   ├── page.tsx                   # Redirect / Root entry point
│   ├── globals.css                # Base Tailwind v4 styles
│   ├── neo-brutal.css             # Neo-brutalist design tokens & utilities
│   └── rwa-privacy/
│       ├── page.tsx               # Landing & architectural explainer
│       └── demo/
│           └── page.tsx           # Interactive 4-step protocol console
├── components/
│   ├── nav-bar.tsx                # Global top navigation bar
│   ├── rwa-privacy/
│   │   ├── Stepper.tsx            # Protocol step progress indicator
│   │   ├── AssetForm.tsx          # Step 1: Asset registration form
│   │   ├── StealthAddressPanel.tsx# Step 2: Stealth address derivation
│   │   ├── TransactionPanel.tsx   # Step 3: Confidential transfer execution
│   │   ├── ZKProofPanel.tsx       # Step 4: Prover & verifier interface
│   │   ├── MockLedgerTable.tsx    # Live ledger transaction explorer
│   │   └── LedgerTable.tsx        # Public transaction inspection table
│   └── ui/                        # Reusable neo-brutal UI components
├── lib/
│   ├── rwa-privacy/
│   │   ├── types.ts               # Core protocol data structures & types
│   │   ├── crypto.ts              # Cryptographic exports
│   │   └── mockCrypto.ts          # ECDH and zk-SNARK algorithms
│   ├── design-tokens.ts           # Neo-brutalist color & shadow tokens
│   └── utils.ts                   # Class merging helpers
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+ installed
* `pnpm` installed (`npm install -g pnpm` or via Corepack)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/null-own.git
cd null-own

# Install dependencies
pnpm install
```

### Running Locally

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

* Navigate to `/` or `/rwa-privacy` to view the architectural problem breakdown.
* Navigate to `/rwa-privacy/demo` to launch the interactive Protocol Console.

### Production Build

```bash
# Create an optimized production build
pnpm build

# Start the production server
pnpm start
```

---

## 🎨 UI Design System

NullOwn employs an opinionated **Neo-Brutalism** design language:
* **High-Contrast Palette**: Pure black `#000000`, white `#FFFFFF`, alert yellow `#FFEE00`, warning red `#FF3366`, and neon green `#00FF88`.
* **Crisp Borders & Hard Shadows**: Thick solid borders (`2px solid #000`) paired with non-blurred hard drop-shadows (`4px 4px 0px #000`).
* **Typography**: Geometric grotesque sans-serif (`Space Grotesk`) paired with technical monospace (`IBM Plex Mono`).
