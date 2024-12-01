"use client";

import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/DigiTicket.json";
import { CONTRACT_ADDRESS } from "../utils/constants";

export default function RedeemForm() {
  const [tokenId, setTokenId] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  async function signMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Initialize the contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // Fetch the current nonce for the user and token
      const nonce = await contract.getNonce(userAddress);

      // Define the structured data for EIP-712
      const domain = {
        name: "digiticket",
        version: "1",
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract: CONTRACT_ADDRESS,
      };

      const types = {
        RedeemRequest: [
          { name: "redeemer", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        redeemer: userAddress,
        tokenId: parseInt(tokenId),
        nonce: nonce.toNumber(),
        deadline: parseInt(deadline),
      };
      console.log(domain, types, value);

      // Request the user to sign the message
      const signature = await signer._signTypedData(domain, types, value);

      setSignature(signature);
      setMessage("Message signed successfully!");
    } catch (err) {
      console.error("Signing failed:", err);
      setMessage("Signing failed. Check console for errors.");
    }
  }

  async function redeemNFT(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!signature) {
      setMessage("Please sign the message first.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();

      // Initialize the contract with signer
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // Call the redeem function
      const tx = await contract.redeem(
        parseInt(tokenId),
        parseInt(deadline),
        signature
      );
      await tx.wait();
      setMessage("NFT Redeemed Successfully!");
      console.log("Redeem transaction:", tx);
    } catch (err) {
      console.error("Redemption failed:", err);
      setMessage("Redemption failed. Check console for errors.");
    }
  }

  return (
    <div>
      <form onSubmit={signMessage}>
        <label>Token ID:</label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          required
        />

        <label>Deadline (Unix Timestamp):</label>
        <input
          type="text"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <button type="submit">Sign Message</button>
      </form>

      {signature && (
        <div>
          <p>Message Signed: {signature}</p>
          <button onClick={redeemNFT}>Redeem NFT</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
