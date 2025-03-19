import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

const MODULE_ADDRESS = "0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc";

export const mintTripNFT = (): InputTransactionData => {
  return {
    data: {
      function: `${MODULE_ADDRESS}::AptosTripOMGTEST::mint_nft`,
      typeArguments: [],
      functionArguments: [],
    },
  };
};