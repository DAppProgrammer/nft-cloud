import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import {
  NFT_ABI,
  MARKET_ABI,
  NFT_ADDRESS,
  MARKET_ADDRESS
} from "../components/utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

export const TransactionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <TransactionContext.Provider
      value={{
        loading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
