import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import useStoreUserEffect from "../useStoreUserEffect";

import LikedIngredients from "../components/LikedIngredients";
import DislikedIngredients from "../components/DislikedIngredients";
import DietaryRestrictions from "../components/DietaryRestrictions";

import './Recipes.css'

const Recipes: React.FC = () => {
  const userId = useStoreUserEffect();
  return (
    <Template>
      <h1 className="content-body center">My Palate</h1>
      <div className="my-palate content-body">
        <LikedIngredients/>
        <DislikedIngredients/>
        <DietaryRestrictions/>
      </div>
    </Template>
  );
};

export default Recipes;
