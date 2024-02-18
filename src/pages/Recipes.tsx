import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import useStoreUserEffect from "../useStoreUserEffect";

import LikedIngredients from "../components/LikedIngredients";
import LikedCuisines from "../components/LikedCuisines";
import DislikedIngredients from "../components/DislikedIngredients";
import DietaryRestrictions from "../components/DietaryRestrictions";
import RecipeComponent from "../components/RecipeComponent";

import './Recipes.css'

const Recipes: React.FC = () => {
  const userId = useStoreUserEffect();
  const usersRecipes: any = useQuery(api.users.getRecipes, {});


  return (
    <Template>
      <h1 className="content-body center">📖 Recipe History 📖</h1>
        <div className="content-body recipes-list">
        {usersRecipes && usersRecipes.map((recipe: any, index: number) => (
          <RecipeComponent key={index} recipe={recipe} />
        ))}
      </div>
      <h1 className="content-body center">📌 Pinned Recipes 📌</h1>
      <h1 className="content-body center">🍽️ My Palate 🍽️</h1>
      <div className="my-palate content-body">
        <LikedIngredients/>
        <LikedCuisines/>
        <DislikedIngredients/>
        <DietaryRestrictions/>
      </div>
    </Template>
  );
};

export default Recipes;
