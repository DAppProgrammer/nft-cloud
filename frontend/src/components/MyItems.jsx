import React, { useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./Loader";

const MyItems = () => {
  const { fetchMyItems, myItems, loading } = useContext(TransactionContext);

  useEffect(() => {
    (async () => {
      await fetchMyItems();
      console.log("My Items:", myItems);
    })();
  }, []);

  if (loading) return <Loader />;
  return (
    <>
      <h1>My Items</h1>
      {myItems.map((item, id) => (
        <span key={id}>{item.tokenId.toString()}</span>
      ))}
    </>
  );
};

export default MyItems;
