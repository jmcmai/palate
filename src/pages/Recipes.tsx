import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import useStoreUserEffect from "../useStoreUserEffect";

import LikedIngredients from "../components/LikedIngredients";
import DislikedIngredients from "../components/DislikedIngredients";

import './Recipes.css'

const Recipes: React.FC = () => {
  const userId = useStoreUserEffect();
  return (
    <Template>
      <div>{userId}</div>
      <LikedIngredients/>
      <DislikedIngredients/>
    </Template>
  );
};

export default Recipes;
