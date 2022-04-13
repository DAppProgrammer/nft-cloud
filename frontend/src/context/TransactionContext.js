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

const { ethereum } = window;

const requestAccount = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");
    await ethereum.request({
      method: "eth_requestAccounts"
    });
  } catch (error) {
    console.log(error);
  }
};

const getContract = async (contractName, withSigner) => {
  if (!ethereum) return alert("Please install metamask");
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.signer;
  console.log("provider", provider);
  console.log("signer", signer);
  let contract;
  if (contractName === "NFT") {
    if (withSigner) {
      requestAccount();
      contract = new ethers.Contract(
        NFT_ADDRESS,
        NFT_ABI,
        provider.getSigner()
      );
    } else contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  } else if (contractName === "MARKET") {
    if (withSigner) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, signer);
    } else contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
  }

  return contract;
};

export const TransactionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [myItems, setMyItems] = useState([]);

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
    const data = await marketContract.fetchMyOwnedItems();
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
    console.log("buyNFT:", contract);
    console.log("NFT Address: ", nft.address);
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
        buyNFT
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
