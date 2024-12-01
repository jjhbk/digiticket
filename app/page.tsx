"use client";
import Link from "next/link";
import WalletConnector from "./components/walletconnector";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

export default function Home() {
  return (
    <ThirdwebProvider>
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
    </ThirdwebProvider>
  );
}
