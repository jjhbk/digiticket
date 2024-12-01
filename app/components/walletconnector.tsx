"use client";

import { useAddress, ConnectWallet, useDisconnect } from "@thirdweb-dev/react";

export default function WalletConnector() {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div>
      <ConnectWallet />
      {/*address ? (
        <div>
          <p>Connected as: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )*/}
      {address && (
        <div>
          <p>Connected as: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
