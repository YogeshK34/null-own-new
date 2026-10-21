import { StealthKeys, ZKProof } from './types';

export function randomHex(bytes: number): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < bytes * 2; i++) {
    result += chars[Math.floor(Math.random() * 16)];
  }
  return result;
}

export function generateAddress(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  return '0x' + hexPart + randomHex(16).replace('0x', '');
}

export function deriveEphemeralKey(): { privKey: string; pubKey: string } {
  return {
    privKey: randomHex(32),
    pubKey: '0x04' + randomHex(32).replace('0x', '') + randomHex(32).replace('0x', ''),
  };
}

export function createStealthBundle(recipientLabel: string = 'Bob'): StealthKeys {
  const spendingKey = randomHex(32);
  const viewingKey = randomHex(32);
  const ephemeral = deriveEphemeralKey();

  const originalRecipientAddress = generateAddress(recipientLabel);

  // Derived stealth address is a unique hash
  const stealthAddress = '0x' + randomHex(20).replace('0x', '');

  return {
    recipientSpendingKey: spendingKey,
    recipientViewingKey: viewingKey,
    ephemeralPrivKey: ephemeral.privKey,
    ephemeralPubKey: ephemeral.pubKey,
    stealthAddress,
    originalRecipientAddress,
  };
}

export function generateZKProof(spendingKey: string, stealthAddress: string, assetId: string): ZKProof {
  return {
    pi_a: [randomHex(64), randomHex(64), '1'],
    pi_b: [
      [randomHex(64), randomHex(64)],
      [randomHex(64), randomHex(64)],
      ['1', '0'],
    ],
    pi_c: [randomHex(64), randomHex(64), '1'],
    public_signals: [stealthAddress, assetId, '1'],
  };
}

export const generateMockProof = generateZKProof;

export function tamperProof(proof: ZKProof): ZKProof {
  return {
    ...proof,
    pi_a: [randomHex(64), proof.pi_a[1], proof.pi_a[2]],
    public_signals: ['0x000000000000000000000000000000000000dead', proof.public_signals[1] || '0x0', '0'],
  };
}

export function verifyZKProof(proof: ZKProof, isTampered: boolean): boolean {
  if (isTampered) {
    return false;
  }
  if (proof.public_signals.includes('0x000000000000000000000000000000000000dead') || proof.public_signals[2] !== '1') {
    return false;
  }
  return true;
}

export const verifyMockProof = verifyZKProof;

export function generateTxHash(): string {
  return randomHex(32);
}

export function generateBlockNumber(): number {
  return 19821000 + Math.floor(Math.random() * 500);
}
