import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import * as Linking from 'expo-linking';

const PHANTOM_URL = 'https://phantom.app/ul/v1/connect';

export async function connectPhantomWallet(onConnect: (publicKey: string) => void) {
  const session = Math.random().toString(36).substring(2);
  const callbackUrl = Linking.createURL('phantom-connect');
  const url = `${PHANTOM_URL}?app_url=${encodeURIComponent('https://clovia.app')}&redirect_link=${encodeURIComponent(callbackUrl)}&cluster=devnet`;

  const handleUrl = (event: { url: string }) => {
    const { url } = event;
    if (url.includes('phantom-connect')) {
      const match = url.match(/public_key=([^&]+)/);
      if (match && match[1]) {
        const pubkey = decodeURIComponent(match[1]);
        onConnect(pubkey);
      }
      subscription.remove();
    }
  };
  const subscription = Linking.addEventListener('url', handleUrl);
  await Linking.openURL(url);
}

export async function buildStakeTransaction({
  from,
  to,
  amountSol,
}: {
  from: string;
  to: string;
  amountSol: number;
}) {
  const connection = new Connection('https://api.devnet.solana.com');
  const fromPubkey = new PublicKey(from);
  const toPubkey = new PublicKey(to);

  const blockhashInfo = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: fromPubkey,
    recentBlockhash: blockhashInfo.blockhash,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.floor(amountSol * 1e9), // Convert SOL to lamports
    })
  );

  // 👇 DO NOT SIGN. Phantom expects it unsigned.
  const serializedTx = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  return serializedTx.toString('base64');
}

export async function openPhantomSignAndSend({
  transaction,
  onComplete,
}: {
  transaction: string;
  onComplete: (signature: string | null) => void;
}) {
  const callbackUrl = Linking.createURL('phantom-tx');

  const url = `https://phantom.app/ul/v1/signAndSendTransaction?app_url=${encodeURIComponent(
    'https://clovia.app'
  )}&redirect_link=${encodeURIComponent(callbackUrl)}&network=devnet&transaction=${encodeURIComponent(
    transaction
  )}`;

  const handleUrl = (event: { url: string }) => {
    const { url } = event;
    if (url.startsWith(callbackUrl)) {
      const match = url.match(/signature=([^&]+)/);
      onComplete(match ? decodeURIComponent(match[1]) : null);
      subscription.remove();
    }
  };

  const subscription = Linking.addEventListener('url', handleUrl);
  await Linking.openURL(url);
}
