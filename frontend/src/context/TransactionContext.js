import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import {
  NFT_ADDRESS,
  NFT_ABI,
  MARKET_ADDRESS,
  MARKET_ABI
} from "../components/utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getContract = async (contractName, withSigner) => {
  if (!ethereum) return alert("Please install metamask");
  const provider = new ethers.providers.Web3Provider(ethereum);
  let contract;
  if (contractName === "NFT") {
    contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  } else {
    contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
  }
  if (withSigner) {
    contract.connect(provider.signer);
  }
  return contract;
};

export const TransactionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [marketItems, setMarketItems] = useState([]);

  const fetchMarketItems = async () => {
    setLoading(true);
    const contract = await getContract("Market", true);
    console.log("CONTRACT: ", contract);
    const marketItems = await contract.fetchMarketItems();
    setMarketItems(marketItems);
    setLoading(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        loading,
        fetchMarketItems,
        marketItems
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
