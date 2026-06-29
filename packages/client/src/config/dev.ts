/**
 * About-the-dev + donation configuration for the landing page.
 * Single source of truth — edit here to update the landing page.
 *
 * NOTE: All values below are placeholders. Replace them with your own
 * name, links, and wallet addresses before going live.
 */

export interface DevInfo {
  name: string;
  tagline: string;
  blurb: string;
  /** Optional avatar image (served from /public). Falls back to initials. */
  avatarUrl?: string;
  /** The portfolio URL we want to drive clicks/backlinks to. */
  portfolioUrl: string;
  socials: { label: string; url: string }[];
}

export const DEV_INFO: DevInfo = {
  name: 'Deepansh Sinha',
  tagline: 'Independent developer — I build fast, privacy-first web tools.',
  blurb:
    "Hi, I'm Deepansh — Zipline is my take on sending files directly between devices, without handing them to anyone's cloud. Everything is encrypted in your browser and streamed peer-to-peer. If it saved you an upload — or you just like the idea — a tip keeps independent projects like this going.",
  // Drop your photo at packages/client/public/profile.jpg to show it here.
  avatarUrl: '/profile.jpg',
  // TODO: replace with your own portfolio / homepage URL.
  portfolioUrl: 'https://example.com',
  // TODO: replace with your own social links.
  socials: [{ label: 'X', url: 'https://example.com' }],
};

export interface DonationWallet {
  /** Chain / asset label shown to the user. */
  label: string;
  /** Short symbol used for the chip. */
  symbol: string;
  /** Public receiving address. */
  address: string;
  /** A wallet-friendly URI used for the QR code (deep-links wallet apps). */
  uri: string;
  /** Block-explorer link for transparency. */
  explorerUrl?: string;
  /** Optional note, e.g. which network a stablecoin lives on. */
  note?: string;
}

// TODO: replace these placeholder addresses with your own wallet addresses.
export const DONATION_WALLETS: DonationWallet[] = [
  {
    label: 'Bitcoin',
    symbol: 'BTC',
    address: 'your-btc-address-here',
    uri: 'bitcoin:your-btc-address-here',
    explorerUrl: 'https://mempool.space/',
    note: 'Native SegWit / Taproot address',
  },
  {
    label: 'Ethereum / EVM',
    symbol: 'ETH',
    address: 'your-eth-address-here',
    uri: 'ethereum:your-eth-address-here',
    explorerUrl: 'https://etherscan.io/',
    note: 'ETH & ERC-20 tokens on Ethereum and EVM L2s',
  },
  {
    label: 'Solana',
    symbol: 'SOL',
    address: 'your-sol-address-here',
    uri: 'solana:your-sol-address-here',
    explorerUrl: 'https://solscan.io/',
    note: 'SOL & SPL tokens',
  },
  {
    label: 'USDC',
    symbol: 'USDC',
    address: 'your-usdc-address-here',
    uri: 'ethereum:your-usdc-address-here',
    explorerUrl: 'https://etherscan.io/',
    note: 'USDC (ERC-20) on Ethereum/EVM — SPL USDC also welcome at the Solana address',
  },
];
