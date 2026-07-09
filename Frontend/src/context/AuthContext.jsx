/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const url = import.meta.env.VITE_API_URL || "https://kindbite-backend-bvuo.onrender.com";

  const [cartItem, setcartItem] = useState({});
  const [foodList, setFoodList] = useState([]);
  const [token, settoken] = useState(localStorage.getItem("token") || "");

  // ✅ Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token && token !== "null" && token !== "undefined") {
      localStorage.setItem("token", token);
    } else if (!token || token === "null" || token === "undefined") {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ================= FETCH FOOD LIST ================= */

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list", {
        timeout: 5000
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const formattedFood = response.data.data.map((item) => ({
          id: item._id,
          dish_name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: url + "/images/" + item.image,
          rating: item.rating || 4.5
        }));

        setFoodList(formattedFood);
      } else {
        setFoodList([]);
      }

    } catch (error) {
      setFoodList([]);
    }
  };


  /* ================= LOAD CART DATA ================= */

  const loadCartData = async (userToken) => {

    try {
      // ✅ Validate token
      if (!userToken || userToken === "null" || userToken === "undefined") {
        return;
      }

      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { 
          headers: { token: userToken },
          timeout: 5000 // Add 5 second timeout
        }
      );

      if (response.data.success && response.data.cartData) {
        setcartItem(response.data.cartData);
      } else {
        setcartItem({});
      }

    } catch (error) {
      setcartItem({});
    }
  };


  /* ================= ADD TO CART ================= */

  const AddToCart = async (itemId) => {

    setcartItem((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { 
            headers: { token },
            timeout: 5000
          }
        );

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          settoken("");
        }
      }
    }
  };


  /* ================= REMOVE FROM CART ================= */

  const removeFromCart = async (itemId) => {

    setcartItem((prev) => {

      const updatedCart = { ...prev };

      if (updatedCart[itemId] === 1) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] -= 1;
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { 
            headers: { token },
            timeout: 5000
          }
        );

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          settoken("");
        }
      }
    }
  };


  /* ================= TOTAL CART PRICE ================= */

  const getTotalCart = () => {

    let totalAmount = 0;

    for (const itemId in cartItem) {

      const quantity = cartItem[itemId];

      if (quantity > 0) {

        const itemInfo = foodList.find(
          (product) => product.id === itemId
        );

        if (itemInfo) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }

    return totalAmount;
  };


  /* ================= LOAD DATA ON START ================= */

  useEffect(() => {

    async function loadData() {

      await fetchFoodList();

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        settoken(storedToken);
        await loadCartData(storedToken);
      }
    }

    loadData();

  }, []);


  /* ================= CONTEXT VALUE ================= */

  const contextValue = {
    foodList,
    cartItem,
    setcartItem,
    AddToCart,
    removeFromCart,
    getTotalCart,
    url,
    token,
    settoken
  };


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
