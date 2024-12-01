import { PropsWithChildren } from "react";

export const metadata = {
  title: "Redeemable NFT dApp",
  description: "Mint and Redeem NFTs using ThirdWeb",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
