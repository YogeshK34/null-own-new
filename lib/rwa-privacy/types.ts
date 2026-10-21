export type AssetType = 'Real Estate' | 'Bond' | 'Equity' | 'Commodity';

export interface RWAAsset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  ownerLabel: string;
  ownerAddress: string;
  registeredTxHash?: string;
  registeredBlock?: number;
  registeredAt?: string;
}

export interface StealthKeys {
  recipientSpendingKey: string;
  recipientViewingKey: string;
  ephemeralPrivKey: string;
  ephemeralPubKey: string;
  stealthAddress: string;
  originalRecipientAddress: string;
}

export interface TransferRecord {
  txHash: string;
  blockNumber: number;
  fromAddress: string;
  toAddress: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  value: number;
  timestamp: string;
  status: 'pending' | 'confirmed';
  isPrivate: boolean;
}

export interface ZKProof {
  pi_a: [string, string, string];
  pi_b: [[string, string], [string, string], [string, string]];
  pi_c: [string, string, string];
  public_signals: string[];
}

export interface ProtocolConsoleState {
  currentStep: number;
  asset: RWAAsset | null;
  stealthKeys: StealthKeys | null;
  transferRecord: TransferRecord | null;
  proof: ZKProof | null;
  isTampered: boolean;
  verificationResult: boolean | null;
}

export type DemoState = ProtocolConsoleState;
