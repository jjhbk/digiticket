import RedeemForm from "../components/redeemform";
import WalletConnector from "../components/walletconnector";

export default function RedeemPage() {
  return (
    <div>
      <h1>Redeem NFTs</h1>
      <WalletConnector />
      <RedeemForm />
    </div>
  );
}
