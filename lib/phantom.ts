import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import * as Linking from 'expo-linking';
import { Buffer } from 'buffer';
import { encode as bs58Encode, decode as bs58Decode } from 'bs58';
import nacl from 'tweetnacl';
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

// Setup
const dappKeyPair = nacl.box.keyPair();
let sharedSecret: Uint8Array | null = null;
let session: string | null = null;

const DEVNET_URL = clusterApiUrl('devnet');
const USE_UNIVERSAL_LINKS = false;

const buildUrl = (path: string, params: URLSearchParams) =>
  `${USE_UNIVERSAL_LINKS ? 'https://phantom.app/ul/' : 'phantom://'}v1/${path}?${params.toString()}`;

const decryptPayload = (data: string, nonce: string) => {
  if (!sharedSecret) throw new Error('Shared secret not initialized');
  const decrypted = nacl.box.open.after(bs58Decode(data), bs58Decode(nonce), sharedSecret);
  if (!decrypted) throw new Error('Unable to decrypt Phantom response');
  return JSON.parse(Buffer.from(decrypted).toString('utf8'));
};

const encryptPayload = (payload: any) => {
  if (!sharedSecret) throw new Error('Shared secret not initialized');
  const nonce = nacl.randomBytes(24);
  const encrypted = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret);
  return [nonce, encrypted];
};

export async function connectPhantomWallet(onConnect: (publicKey: string) => void) {
  const redirect_link = Linking.createURL('phantom-connect');
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58Encode(dappKeyPair.publicKey),
    cluster: 'devnet',
    app_url: 'https://clovia.app',
    redirect_link
  });

  const url = buildUrl('connect', params);

  const handleUrl = ({ url }: { url: string }) => {
    const parsed = new URL(url);
    const sp = parsed.searchParams;

    if (sp.get('errorCode')) return;

    const phantomEncryptionPubKey = bs58Decode(sp.get('phantom_encryption_public_key')!);
    sharedSecret = nacl.box.before(phantomEncryptionPubKey, dappKeyPair.secretKey);

    const connectData = decryptPayload(sp.get('data')!, sp.get('nonce')!);
    session = connectData.session;
    onConnect(connectData.public_key);
    subscription.remove();
  };

  const subscription = Linking.addEventListener('url', handleUrl);
  await Linking.openURL(url);
}

export async function buildStakeTransaction({ from, to, amountSol }: { from: string, to: string, amountSol: number }) {
  const connection = new Connection(DEVNET_URL);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports: Math.floor(amountSol * 1e9),
    })
  );
  tx.feePayer = new PublicKey(from);
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  return tx;
}

export async function openPhantomSignAndSend({ transaction, onComplete }: { transaction: Transaction, onComplete: (signature: string | null) => void }) {
  const serializedTx = bs58Encode(transaction.serialize({ requireAllSignatures: false }));

  const payload = { session, transaction: serializedTx };
  const [nonce, encrypted] = encryptPayload(payload);

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58Encode(dappKeyPair.publicKey),
    nonce: bs58Encode(nonce),
    redirect_link: Linking.createURL('phantom-tx'),
    payload: bs58Encode(encrypted)
  });

  const url = buildUrl('signAndSendTransaction', params);

  const handleUrl = ({ url }: { url: string }) => {
    const parsed = new URL(url);
    const sp = parsed.searchParams;
    if (sp.get('errorCode')) return onComplete(null);

    const response = decryptPayload(sp.get('data')!, sp.get('nonce')!);
    onComplete(response.signature || null);
    subscription.remove();
  };

  const subscription = Linking.addEventListener('url', handleUrl);
  await Linking.openURL(url);
}