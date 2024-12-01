"use client";

import { useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../utils/constants";

export default function RedeemForm() {
  const [tokenId, setTokenId] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { contract } = useContract(CONTRACT_ADDRESS);

  async function redeemNFT(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!contract) {
        setMessage("Contract not loaded.");
        return;
      }

      const tx = await contract.call("redeem", [
        tokenId, // tokenId
        deadline, // deadline
        signature, // signed message
      ]);

      console.log("Redemption transaction:", tx);
      setMessage("NFT Redeemed Successfully!");
    } catch (err) {
      console.error("Redemption failed:", err);
      setMessage("Redemption failed. Check console for errors.");
    }
  }

  return (
    <div>
      <form onSubmit={redeemNFT}>
        <label>Token ID:</label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <label>Deadline:</label>
        <input
          type="text"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <label>Signature:</label>
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />

        <button type="submit">Redeem NFT</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
