/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FoodItem from "./FoodItem";
import { motion } from "framer-motion";

const FoodDisplay = () => {
  const { foodList } = useContext(AuthContext);

  return (
    <section className="w-full flex justify-center py-16 bg-linear-to-b from-amber-50 to-white">
      <div className="w-[90%] max-w-7xl flex flex-col gap-6">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center 
          bg-linear-to-r from-amber-700 via-orange-600 to-red-600 
          bg-clip-text text-transparent"
        >
          🍽 Top Dishes Near You
        </motion.h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Freshly prepared meals from nearby kitchens — delivered fast & hot
        </p>

        {/* Food Grid */}
        {foodList?.length > 0 ? (
          <div
            className="grid grid-flow-col auto-cols-[260px] md:auto-cols-[300px] 
            gap-8 mt-10 overflow-x-auto scroll-smooth snap-x snap-mandatory 
            pb-6
            [&::-webkit-scrollbar]:hidden 
            [-ms-overflow-style:none] 
            [scrollbar-width:none]"
          >
            {foodList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="snap-start"
              >
                <FoodItem
                  id={item.id}
                  image={item.image}
                  dish_name={item.dish_name}
                  description={item.description}
                  rating={item.rating}
                  price={item.price}
                  category={item.category}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <span className="text-5xl">😕</span>
            <p className="mt-4 text-lg font-medium">
              No dishes available nearby
            </p>
            <p className="text-sm">Please check again later</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FoodDisplay;
