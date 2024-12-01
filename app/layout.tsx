"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { PropsWithChildren } from "react";

export const metadata = {
  title: "Redeemable NFT dApp",
  description: "Mint and Redeem NFTs using ThirdWeb",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider activeChain="ethereum">{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
