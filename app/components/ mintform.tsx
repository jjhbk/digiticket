"use client";

import { useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { ethers } from "ethers";
import contractABI from "../utils/DigiTicket.json";
import Web3 from "web3";

export default function MintForm() {
  const [tokenId, setTokenId] = useState<string>("");
  const [tokenURI, setTokenURI] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // const { contract } = useContract(CONTRACT_ADDRESS);

  async function mintNFT(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      console.log("the provider is:", provider);
      const signer = provider.getSigner();
      // const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      if (!contract) {
        setMessage("Contract not loaded.");
        return;
      }
      console.log(contract);
      const tx = await contract.mint(
        signer.getAddress(),
        parseInt(tokenId),
        tokenURI,
        {
          value: ethers.utils.parseEther(price), // ETH in wei
        }
      );
      console.log("Minting transaction:", tx);

      await tx.wait();

      setMessage("NFT Minted Successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      setMessage("Minting failed. Check console for errors.");
    }
  }

  return (
    <div>
      <form onSubmit={mintNFT}>
        <label>Token ID:</label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <label>Token URI:</label>
        <input
          type="text"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
        />

        <label>Price (ETH):</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">Mint NFT</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
