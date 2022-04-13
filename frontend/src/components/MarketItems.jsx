import React, { useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./Loader";

const MarketItems = () => {
  const { fetchMarketItems, marketItems, loading } =
    useContext(TransactionContext);
    
  useEffect(() => {
    (async () => {
      await fetchMarketItems();
      console.log("Market Items:", marketItems);
    })();
  }, []);

  if (loading) return <Loader />;
  return (
    <>
      <h1>Market Items</h1>
      {marketItems.map((item, id) => {
        <span>{item.itemId}</span>;
      })}
    </>
  );
};

export default MarketItems;
