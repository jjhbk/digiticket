"use client";
import MintForm from "../components/ mintform";
import WalletConnector from "../components/walletconnector";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { MediaRenderer } from "@thirdweb-dev/react";

export default function MintPage() {
  return (
    <ThirdwebProvider>
      <div>
        <h1>Mint NFTs</h1>

        <WalletConnector />
        <MintForm />
        <MediaRenderer src="https://music.youtube.com/watch?v=CDqvDPmfUo0&list=RDAMVMFAYx9JbtHRc" />
      </div>
    </ThirdwebProvider>
  );
}
