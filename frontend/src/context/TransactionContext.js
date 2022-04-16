import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import axios from "axios";
import {
  NFT_ADDRESS,
  NFT_ABI,
  MARKET_ADDRESS,
  MARKET_ABI
} from "../components/utils/constants";
export const TransactionContext = React.createContext();

const networks = {
  mumbaiTestnet: {
    chainId: "0x13881",
    chainName: "Mumbai Testne",
    nativeCurrency: {
      name: "Matic",
      symbol: "Matic",
      decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"]
  }
};
const { ethereum } = window;

ethereum.on("chainChanged", (_chainId) => window.location.reload());

const changeNetwork = async (networkName) => {
  try {
    if (!ethereum) return alert("Please install metamask");

    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName]
        }
      ]
    });
  } catch (error) {
    console.log(error.message);
  }
};


const getContract = async (contractName, withSigner) => {
  if (!ethereum) return alert("Please install metamask");
  const provider = new ethers.providers.Web3Provider(ethereum);
  let contract;
  switch (contractName) {
    case "NFT":
      contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
      break;
      case "MARKET":
      contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
      break;
  }
  if (withSigner) {
    contract.connect(provider.getSigner());
  }
  return contract;
};

export const TransactionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      const chainId = await ethereum.request({
        method: "eth_chainId"
      });

      if (chainId != "0x13881") {
        // alert("Please select mumbai testnet");
        // return;
        await changeNetwork("mumbaiTestnet");
      }

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMarketItems = async () => {
    setLoading(true);
    const nftContract = await getContract("NFT", false);
    const marketContract = await getContract("MARKET", false);
    console.log("nftContract: ", nftContract);
    console.log("marketContract: ", marketContract);
    const data = await marketContract.fetchMarketItems();

    const marketItems = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const address = await nftContract.address;

        console.log(tokenUri);
        const meta = await axios.get(tokenUri);
        console.log("meta:", meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          address,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };
        return item;
      })
    );
    setMarketItems(marketItems);
    setLoading(false);
  };

  const fetchMyItems = async () => {
    setLoading(true);

    const nftContract = await getContract("NFT", false);
    const marketContract = await getContract("MARKET", false);
    const address = await nftContract.address;
    const data = await marketContract.fetchMyOwnedItems({
      from: currentAccount
    });
    const myItems = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          address,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };
        return item;
      })
    );
    setMyItems(myItems);
    setLoading(false);
  };

  const buyNFT = async (nft) => {
    const contract = await getContract("MARKET", true);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const tx = await contract.createMarketSale(nft.address, nft.tokenId, {
      value: price
    });
    await tx.wait();
    fetchMarketItems();
  };

  return (
    <TransactionContext.Provider
      value={{
        loading,
        fetchMarketItems,
        marketItems,
        fetchMyItems,
        myItems,
        buyNFT,
        connectWallet,
        currentAccount
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
