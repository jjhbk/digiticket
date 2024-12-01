import MintForm from "../components/ mintform";
import WalletConnector from "../components/walletconnector";

export default function MintPage() {
  return (
    <div>
      <h1>Mint NFTs</h1>
      <WalletConnector />
      <MintForm />
    </div>
  );
}
