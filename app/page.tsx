import Link from "next/link";
import WalletConnector from "./components/walletconnector";
export default function Home() {
  return (
    <div>
      <h1>Welcome to Redeemable NFT dApp</h1>
      <WalletConnector />
      <nav>
        <ul>
          <li>
            <Link href="/mint">Mint NFTs</Link>
          </li>
          <li>
            <Link href="/redeem">Redeem NFTs</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
