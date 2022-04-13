import React, { useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./Loader";

const MarketItems = () => {
  const { fetchMarketItems, marketItems, buyNFT, loading } =
    useContext(TransactionContext);

  useEffect(() => {
    (async () => {
      await fetchMarketItems();
      console.log("Market Items:", marketItems);
    })();
  }, []);

  if (loading) return <Loader />;
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {marketItems.map((item, id) => (
            <div key={id} className="border rounded-xl shadow overflow-hidden ">
              <img src={item.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold "
                >
                  {item.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {item.price} Matic
                </p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNFT(item)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
