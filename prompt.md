# Coding Agent Prompt: RWA + Stealth Address + ZKP Privacy POC

## Context

I have an existing Next.js project (app router, TypeScript). You are adding **new pages, components, and logic only** — do not touch any existing routing, config, or unrelated files.

The POC demonstrates a privacy-preserving RWA (Real World Asset) transfer system where:
- RWA tokens are sent to **stealth addresses** (so on-chain observers can't link the asset to the real recipient)
- **ZK proofs** are used to verify ownership without revealing identity

This is a **frontend POC / simulation** — no real blockchain calls, no wallet connection required. All cryptographic operations should be **mocked or simulated in-browser** with realistic data shapes. The goal is to make the flow feel real and educate a technical audience on how the system works.

---

## Pages to Build

### 1. `/rwa-privacy` — Landing / Explainer Page

A single-page explainer that sets up the problem and the solution before the user dives in. Content:

- **Hero**: "RWA on public chains is a privacy breach. Here's the fix." — bold, confrontational, no softening.
- **Problem section**: Show a simple diagram — public chain → anyone can see your RWA holdings → privacy breach. Use a mocked transaction table (address, asset, amount, timestamp) to illustrate how exposed the data is.
- **Solution section**: 3-step flow diagram — (1) generate stealth address → (2) send RWA to stealth address → (3) prove ownership with ZKP. Keep it visual, not wordy.
- **CTA**: "Try the POC →" links to `/rwa-privacy/demo`

---

### 2. `/rwa-privacy/demo` — Interactive POC

This is the core. Build it as a **multi-step flow** (stepper UI, 4 steps):

#### Step 1 — Register RWA Asset
- Form fields: Asset Name, Asset Type (dropdown: Real Estate / Bond / Equity / Commodity), Asset Value (USD), Owner Label (just a string, e.g. "Alice")
- On submit: store in local state, show a mock "public ledger entry" with a fake tx hash, block number, and the owner's address **fully visible** — make this feel alarming. Label it: "⚠ Anyone can see this on-chain."

#### Step 2 — Generate Stealth Address
- Show the concept: recipient has a **spending key** and **viewing key** (display as mock hex strings)
- Button: "Generate Stealth Address for this Transfer"
- On click: derive a mock stealth address (just `keccak256`-style hex generation in JS is fine), display it alongside the original address
- Show a diff panel: Original Address vs Stealth Address — make it visually clear these are unlinkable
- Ephemeral public key also displayed (mock)
- Label: "✓ On-chain, only the stealth address appears. The real recipient is hidden."

#### Step 3 — Transfer RWA to Stealth Address
- Show a mock transaction panel: from (sender address), to (stealth address), asset details, value
- Button: "Execute Transfer (Simulated)"
- On click: animate a fake "broadcasting to chain" loader (1.5s), then show a success state with a fake tx hash
- Show updated "public ledger" — stealth address visible, real owner NOT visible
- Add a mock "Blockchain Explorer" table below showing stealth address holding the asset, with no link to the original owner

#### Step 4 — Prove Ownership with ZKP
- Explain in one sentence: "The real owner can prove they control this stealth address without revealing who they are."
- Show two panels side by side:
  - **Prover side**: inputs (spending key, stealth address, asset ID) → Button "Generate ZK Proof" → after 2s fake loading, display a mock proof object (a JSON blob with `pi_a`, `pi_b`, `pi_c`, `public_signals` fields — fake hex values are fine)
  - **Verifier side**: inputs (proof, public signals, stealth address) → Button "Verify Proof" → show ✓ VALID or ✗ INVALID result. Default to ✓ VALID. Add a toggle to simulate a tampered proof that returns ✗ INVALID.
- End state: show a final summary card — asset transferred, owner private, ownership verifiable.

---

## UI Design System — Neo-Brutalism

Apply these rules to **every** component on these pages. Do not use any existing UI library (shadcn, MUI, etc.) for these pages — raw CSS modules or Tailwind only.

### Tokens

```css
--black: #000000;
--white: #FFFFFF;
--yellow: #FFEE00;
--pink: #FF3366;
--blue: #0066FF;
--green: #00FF88;
--bg: #F5F5F5;

--border: 2px solid #000;
--border-thick: 3px solid #000;
--shadow: 4px 4px 0px #000;
--shadow-lg: 6px 6px 0px #000;
--shadow-sm: 2px 2px 0px #000;
--radius: 0px;
```

### Typography
- Font: `Space Grotesk` (import from Google Fonts) for all text
- Headings: `font-weight: 800`, large and aggressive
- Labels: `font-weight: 600`, uppercase only where it genuinely signals a label (not decoratively)
- No subtle text. If it's on screen, it earns its presence.

### Components

**Buttons**
```css
background: var(--yellow);
border: var(--border-thick);
box-shadow: var(--shadow);
border-radius: 0;
font-weight: 700;
padding: 12px 24px;
cursor: pointer;
transition: box-shadow 0.1s, transform 0.1s;

/* hover */
box-shadow: var(--shadow-lg);

/* active / click */
box-shadow: var(--shadow-sm);
transform: translate(2px, 2px);
```

**Cards / Panels**
```css
background: white;
border: var(--border);
box-shadow: var(--shadow);
padding: 24px;
border-radius: 0;
```

**Warning / Alarming state** (for the "anyone can see this" panels)
```css
background: var(--pink);
color: white;
border: var(--border-thick);
box-shadow: 6px 6px 0px #000;
```

**Success state**
```css
background: var(--green);
color: #000;
border: var(--border-thick);
```

**Code / hex displays**
```css
font-family: 'IBM Plex Mono', monospace;
background: #000;
color: var(--yellow);
padding: 8px 12px;
font-size: 12px;
word-break: break-all;
```

**Stepper**
- Horizontal step bar at the top, numbered 1–4
- Active step: black background, white number, `box-shadow: var(--shadow)`
- Completed step: yellow background, black number
- Inactive: white background, black border

**Mock transaction table**
- Full-width, `border-collapse: collapse`
- Every cell: `border: 1px solid #000`
- Header row: black background, white text, `font-weight: 700`
- Alternating rows: white / `#F5F5F5`

### Layout
- Max width: `1100px`, centered
- Left-align everything inside sections
- Section separation: thick horizontal black rule (`border-top: 3px solid #000`) with generous padding
- Avoid centering text blocks; let them breathe left

---

## Mocking Cryptographic Operations

All crypto is **simulated** — no real lib calls needed (though you can use `ethers.js` utils like `ethers.utils.keccak256` if already in the project for realism).

```ts
// Mock stealth address generation
function generateStealthAddress(recipientPubKey: string, ephemeralPrivKey: string): string {
  // combine and hash — just make it look real
  const combined = recipientPubKey + ephemeralPrivKey + Date.now()
  return '0x' + Array.from(combined).map(c => c.charCodeAt(0).toString(16)).join('').slice(0, 40)
}

// Mock ZK proof object
function generateMockProof(spendingKey: string, stealthAddress: string, assetId: string) {
  return {
    pi_a: [randomHex(64), randomHex(64), "1"],
    pi_b: [[randomHex(64), randomHex(64)], [randomHex(64), randomHex(64)], ["1", "0"]],
    pi_c: [randomHex(64), randomHex(64), "1"],
    public_signals: [stealthAddress, assetId, "1"]
  }
}

function randomHex(len: number): string {
  return '0x' + [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
}
```

---

## File Structure

Create only under these paths:

```
app/
  rwa-privacy/
    page.tsx               ← landing/explainer
    demo/
      page.tsx             ← multi-step demo
components/
  rwa-privacy/
    Stepper.tsx
    AssetForm.tsx
    StealthAddressPanel.tsx
    ZKProofPanel.tsx
    MockLedgerTable.tsx
    TransactionPanel.tsx
lib/
  rwa-privacy/
    mockCrypto.ts          ← all mocked crypto functions
    types.ts               ← shared types for this POC
styles/
  rwa-privacy.css          ← neo-brutalism tokens + shared styles for these pages
```

---

## Scope Boundary

- ✅ Add: new pages, new components, new lib utils, new styles
- ❌ Do not touch: `layout.tsx`, `globals.css`, existing components, `next.config.js`, `package.json` (unless adding `Space Grotesk` import)
- ❌ No wallet connection, no real chain calls, no environment variables needed

---

## Deliverable Check

When done, confirm:
- [ ] `/rwa-privacy` renders with problem/solution explainer and CTA
- [ ] `/rwa-privacy/demo` has a working 4-step stepper with persistent state across steps
- [ ] Step 2 generates and displays a distinct stealth address
- [ ] Step 4 ZK proof panel shows generate + verify flow with tamper toggle
- [ ] All UI follows neo-brutalism tokens — no rounded corners, no soft shadows, no gradients anywhere on these pages
- [ ] No TypeScript errors
