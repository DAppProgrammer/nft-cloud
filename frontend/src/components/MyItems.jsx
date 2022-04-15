import React, { useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./Loader";

const MyItems = () => {
  const {
    currentAccount,
    connectWallet,
    fetchMyItems,
    myItems,
    loading
  } = useContext(TransactionContext);

  useEffect(() => {
    alert("Current account:" + currentAccount);
    if (currentAccount === undefined) return;
    (async () => {
      await fetchMyItems();
      console.log("My Items:", myItems);
    })();
  }, [currentAccount]);

  if (loading) return <Loader />;
  if (currentAccount === undefined)
    return (
      <>
        <button
          className="border-2 rounded-sm shadow-sm bg-cyan-50 p-5"
          onClick={connectWallet}
        >
          Connect Wallet!!!
        </button>
      </>
    );
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {myItems.map((item, id) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyItems;
