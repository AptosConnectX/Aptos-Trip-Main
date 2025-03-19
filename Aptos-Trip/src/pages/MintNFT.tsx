import { useState, useEffect } from "react";
import "./MintNFT.css";
import questionMarkImage from "../assets/question-mark.png";
import nftFirstImage from "../assets/nftfirst.png";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "../utils/aptosClient";
import { mintTripNFT } from "../entry-functions/mint_nft";
import { TransactionHash } from "../components/TransactionHash";

function MintNFTPage() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const aptos = aptosClient();
  const contractAddress = "0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc";
  const MINT_PRICE = 1000; // 0.001 APT в октетах

  const fetchBalance = async () => {
    if (!account) return;
    try {
      const balance = await aptos.getAccountCoinAmount({
        accountAddress: account.address,
        coinType: "0x1::aptos_coin::AptosCoin",
      });
      setBalance(balance);
    } catch (error) {
      console.error("Ошибка получения баланса:", error);
    }
  };

  const checkIfInitialized = async () => {
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: contractAddress,
        resourceType: `${contractAddress}::AptosTripOMGTEST::MintedNFTs`,
      });
      return !!resource;
    } catch (error) {
      console.error("Ошибка проверки инициализации:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkIfMinted = async () => {
      if (!connected || !account) return;

      try {
        const mintedNfts = await aptos.getAccountResource({
          accountAddress: contractAddress,
          resourceType: `${contractAddress}::AptosTripOMGTEST::MintedNFTs`,
        });
        console.log("MintedNFTs resource:", mintedNfts);

        const mintedAddresses = (mintedNfts.data as any).minted_addresses;
        const hasMintedBefore = await aptos.getTableItem<boolean>({
          handle: (mintedAddresses as any).handle,
          data: {
            key: account.address,
            key_type: "address",
            value_type: "bool",
          },
        }).catch(() => false);
        setHasMinted(hasMintedBefore);
      } catch (error) {
        console.error("Error checking mint status:", error);
        setHasMinted(false);
      }
    };

    fetchBalance();
    checkIfMinted();
  }, [account, connected, aptos, contractAddress]);

  const handleMint = async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    const isInitialized = await checkIfInitialized();
    if (!isInitialized) {
      alert("Contract is not initialized. Please initialize it first.");
      return;
    }

    if (hasMinted) {
      alert("You have already minted an NFT with this wallet!");
      return;
    }

    if (balance !== null && balance < MINT_PRICE) {
      alert("Insufficient balance to mint NFT (0.001 APT required)!");
      return;
    }

    try {
      setIsMinting(true);

      const payload = mintTripNFT();
      console.log("Mint payload:", payload);
      const response = await signAndSubmitTransaction(payload);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      setTransactionHash(response.hash);
      setHasMinted(true);
      alert("NFT minted successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error minting NFT:", error);
      alert(`Error minting NFT: ${errorMessage}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mint-nft-page">
      <div className="mint-nft-container">
        <div className="image-container">
          <img src={questionMarkImage} alt="Mystery Car" className="mystery-car-image" />
        </div>

        <div className="right-container">
          <div className="mission-container">
            <img src={nftFirstImage} alt="Mission" className="mission-image" />
          </div>

          <div className="controls-container">
            <div className="mint-info">
              <p>Mint Price: 0.001 APT</p>
            </div>
            <button
              onClick={handleMint}
              className={`mint-nft-button ${hasMinted ? "minted" : ""}`}
              disabled={isMinting || hasMinted}
            >
              {isMinting ? "Minting..." : hasMinted ? "✓ Minted" : "Mint NFT"}
            </button>
          </div>

          {transactionHash && (
            <div className="transaction-container">
              <h3 className="transaction-title">Your NFT:</h3>
              <div className="transaction-content">
                <TransactionHash hash={transactionHash} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MintNFTPage;