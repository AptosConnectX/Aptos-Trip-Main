import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../utils/aptosAgent"; // Только aptos

const Points = () => {
  const { account, connected } = useWallet();
  const [points, setPoints] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [merkleTradePoints, setMerkleTradePoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const CONTRACT_ADDRESS = "0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc";

  const fetchContractPoints = async (userAddress) => {
    try {
      const response = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::AptosTripOMGTEST::get_points`,
          typeArguments: [],
          functionArguments: [userAddress],
        },
      });
      return parseInt(response[0]);
    } catch (error) {
      console.error("Ошибка получения очков из контракта:", error);
      return 0;
    }
  };

  const fetchTransactionCount = async (userAddress) => {
    try {
      const transactions = await aptos.getAccountTransactions({
        accountAddress: userAddress,
      });
      return transactions.length;
    } catch (error) {
      console.error("Ошибка получения транзакций:", error);
      return 0;
    }
  };

  const fetchMerkleTradePoints = async () => {
    const mockMerkleTrades = 2; // Заглушка
    return mockMerkleTrades * 2;
  };

  const fetchPoints = async () => {
    if (!connected || !account) {
      setLoading(false);
      return;
    }

    const userAddress = account.address;
    setLoading(true);

    const contractPoints = await fetchContractPoints(userAddress);
    const txCount = await fetchTransactionCount(userAddress);
    const tradePoints = await fetchMerkleTradePoints();

    const totalPoints = contractPoints + txCount + tradePoints;

    setPoints(totalPoints);
    setTransactionCount(txCount);
    setMerkleTradePoints(tradePoints);
    setLoading(false);
  };

  useEffect(() => {
    fetchPoints();
  }, [account, connected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121a21] text-white p-10">
      <h1 className="text-6xl font-bold text-center" style={{ fontFamily: "LC Chalk" }}>
        Points
      </h1>
      {loading ? (
        <p className="mt-4 text-xl">Loading points...</p>
      ) : !connected ? (
        <p className="mt-4 text-xl">Please connect your wallet to see your points.</p>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-2xl">Total Points: <span className="font-bold">{points}</span></p>
          <p className="text-xl mt-2">From Transactions: {transactionCount} (1 tx = 1 point)</p>
          <p className="text-xl mt-2">From Merkle Trade: {merkleTradePoints} (1 trade = 2 points)</p>
          <p className="text-xl mt-2">From Contract: {points - transactionCount - merkleTradePoints}</p>
        </div>
      )}
    </div>
  );
};

export default Points;