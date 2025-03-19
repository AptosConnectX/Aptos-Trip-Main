import React, { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const CarList = () => {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [votes, setVotes] = useState({});
  const [cars, setCars] = useState([]);
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setHasVoted] = useState({});

  const config = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(config);
  const contractAddress = "0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc";

  useEffect(() => {
    console.log("Wallet connected:", connected);
    console.log("Account:", account ? account.address : "No account");
    console.log("Owned tokens:", ownedTokens);
  }, [connected, account, ownedTokens]);

  const fetchJsonUri = async () => {
    try {
      const uri = await aptos.view({
        payload: {
          function: `${contractAddress}::AptosTripOMGTEST::get_ipfs_link`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      console.log("Получен IPFS URI:", uri[0]);
      return uri[0];
    } catch (error) {
      console.error("Ошибка получения URI:", error);
      return null;
    }
  };

  const fetchCars = async () => {
    try {
      const uri = await fetchJsonUri();
      if (!uri) return;
      const response = await fetch(uri);
      const data = await response.json();
      const carsWithIds = data.map((car, index) => ({ ...car, id: index }));
      console.log("Список машин:", carsWithIds);
      setCars(carsWithIds);
    } catch (error) {
      console.error("Ошибка загрузки списка машин:", error);
    }
  };

  const fetchOwnedTokens = async () => {
    if (!account) return;
    try {
      const address = typeof account.address === "string" ? account.address : account.address.toString();
      console.log("Адрес аккаунта для запроса токенов:", address);

      const tokens = await aptos.getAccountOwnedTokens({
        accountAddress: address,
      });
      console.log("Полные данные всех токенов:", tokens);

      const owned = tokens.filter((token) => {
        const collectionId = token.current_token_data?.collection_id;
        console.log("Collection ID для токена", token.token_data_id, ":", collectionId);
        return collectionId === "0x675cb4d0790e6d1ab3dbfeb0187106506c769d7ad7d61e794e9c856b2cd6a3ad";
      });
      console.log("Отфильтрованные токены:", owned);

      setOwnedTokens(
        owned.map((token) => {
          const mappedToken = {
            address: token.token_data_id,
            id: token.token_data_id,
            tokenObject: token.token_object,
          };
          console.log("Сопоставленный токен:", mappedToken);
          return mappedToken;
        })
      );
    } catch (error) {
      console.error("Ошибка получения NFT:", error);
    }
  };

  const fetchProposals = async () => {
    if (cars.length === 0) return;
    try {
      const updatedProposals = [];
      for (let i = 0; i < cars.length; i++) {
        const votes = await aptos.view({
          payload: {
            function: `${contractAddress}::AptosTripOMGTEST::get_votes`,
            typeArguments: [],
            functionArguments: [i.toString()],
          },
        });
        console.log(`Голоса для carId ${i}:`, votes[0]);
        updatedProposals.push({
          id: i,
          carId: i,
          totalVotes: parseInt(votes[0]),
        });
      }
      setProposals(updatedProposals);
      const updatedVotes = {};
      updatedProposals.forEach((proposal) => {
        const car = cars.find((c) => c.id === proposal.carId);
        if (car) updatedVotes[car.name] = proposal.totalVotes;
      });
      console.log("Обновленные голоса:", updatedVotes);
      setVotes(updatedVotes);
    } catch (error) {
      console.error("Ошибка получения голосов:", error);
    }
  };

  const checkHasVoted = async (proposalId) => {
    if (!account) return;
    try {
      const address = typeof account.address === "string" ? account.address : account.address.toString();
      const voted = await aptos.view({
        payload: {
          function: `${contractAddress}::AptosTripOMGTEST::has_voted`,
          typeArguments: [],
          functionArguments: [address],
        },
      });
      console.log(`Проверка голосования для proposalId ${proposalId}:`, voted[0]);
      setHasVoted((prev) => ({ ...prev, [proposalId]: voted[0] }));
    } catch (error) {
      console.error("Ошибка проверки голосования:", error);
      setHasVoted((prev) => ({ ...prev, [proposalId]: false }));
    }
  };

  const handleVote = async (carId) => {
    if (!connected) {
      alert("Пожалуйста, подключите кошелёк.");
      return;
    }
    if (ownedTokens.length === 0) {
      alert("У вас нет NFT для голосования. Пожалуйста, заминтите NFT.");
      return;
    }
    if (hasVoted[carId]) {
      alert("Вы уже проголосовали.");
      return;
    }

    try {
      const transaction = {
        data: {
          function: `${contractAddress}::AptosTripOMGTEST::vote`,
          typeArguments: [],
          functionArguments: [carId],
        },
      };
      console.log("Отправка транзакции для голосования:", transaction);
      const response = await signAndSubmitTransaction(transaction);
      console.log("Ответ на транзакцию:", response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      alert(`Голос за ${cars.find((c) => c.id === carId).name} засчитан!`);
      fetchProposals();
      checkHasVoted(carId);
    } catch (error) {
      console.error("Ошибка при голосовании:", error);
      alert("Ошибка при голосовании. Проверьте консоль.");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    fetchOwnedTokens();
    fetchProposals();
  }, [account, connected, cars]);

  useEffect(() => {
    proposals.forEach((proposal) => checkHasVoted(proposal.id));
  }, [proposals, account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121a21] text-white p-10">
      <h1 className="text-6xl font-bold text-center" style={{ fontFamily: "LC Chalk" }}>
        Best of the Best
      </h1>
      <div className="mt-10 w-full max-w-2xl">
        {cars.length === 0 ? (
          <p>Загрузка списка машин...</p>
        ) : (
          cars.map((car) => {
            const proposal = proposals.find((p) => p.carId === car.id);
            const isDisabled = (proposal && hasVoted[car.id]) || ownedTokens.length === 0;
            console.log(
              `Button for ${car.name} is disabled:`,
              isDisabled,
              "Has voted:",
              hasVoted[car.id],
              "Owned tokens:",
              ownedTokens.length
            );
            return (
              <div key={car.id} className="flex justify-between items-center border-b border-gray-600 py-4">
                <span className="text-2xl font-bold" style={{ fontFamily: "LC Chalk" }}>
                  {car.name}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold">{votes[car.name] || 0}</span>
                  <button
                    onClick={() => handleVote(car.id)}
                    className="relative px-6 py-2 text-lg font-bold text-black bg-yellow-500 rounded-lg shadow-md 
                      hover:bg-yellow-600 transition-transform transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: "LC Chalk" }}
                    disabled={isDisabled}
                  >
                    {hasVoted[car.id] ? "Voted" : "Vote"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CarList;