"use client";

import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";

export default function WalletConnector() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  return (
    <div>
      {address ? (
        <div>
          <p>Connected as: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWithMetamask}>Connect Wallet</button>
      )}
    </div>
  );
}
