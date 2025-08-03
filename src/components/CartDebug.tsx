"use client";

import { useAppSelector } from "@/store/hooks";

export const CartDebug = () => {
  const cart = useAppSelector((state) => state.cart);

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs z-50">
      <div>Items: {cart.items.length}</div>
      <div>Total: {cart.total}</div>
      <div>Total Items: {cart.totalItems}</div>
      <div>Is Open: {cart.isOpen ? "Yes" : "No"}</div>
    </div>
  );
};
