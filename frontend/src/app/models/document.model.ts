export interface Signer {
  name: string;
  email: string;
}

export interface DocumentItem {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
  signers?: Signer[];
}

export interface DocumentPayload {
  name: string;
  file_url?: string;
  signers: Signer[];
}