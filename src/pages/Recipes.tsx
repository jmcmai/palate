import React from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import Template from "../components/Template";
import LikedIngredients from "../components/LikedIngredients";
import LikedCuisines from "../components/LikedCuisines";
import DislikedIngredients from "../components/DislikedIngredients";
import DietaryRestrictions from "../components/DietaryRestrictions";
import RecipeComponent from "../components/RecipeComponent";
import PinnedComponent from "../components/PinnedComponent";
import Pantry from "../components/Pantry";

import "./Recipes.css";

const Recipes: React.FC = () => {
  const usersRecipes: any = useQuery(api.users.getRecipes, {});
  const usersPinned: any = useQuery(api.users.getPinned, {});

  return (
    <Template>
      <h1 className="content-body center">📖 Recipe History 📖</h1>
      <div className="content-body recipes-list">
        {usersRecipes && usersRecipes.length > 0 ? (
          usersRecipes.map((recipe: any, index: number) => (
            <RecipeComponent key={index} recipe={recipe} />
          ))
        ) : (
          <h2 className="grey-text no-recipes center">No previous recipes yet!<br></br>Let's cook something up...</h2>
        )}
      </div>
      <h1 className="content-body center">📌 Pinned Recipes 📌</h1>
      <div className="content-body recipes-list">
        {usersPinned && usersPinned.length > 0 ? (
          usersPinned.map((recipe: any, index: number) => (
            <PinnedComponent key={index} recipe={recipe} />
          ))
        ) : (
          <h2 className="grey-text no-recipes center">No pinned recipes yet!<br></br>Find some through chatting with Ramsey.</h2>
        )}
      </div>
      <h1 className="content-body center">🍽️ My Palate 🍽️</h1>
      <div className="my-palate content-body">
        <LikedIngredients />
        <LikedCuisines />
        <DislikedIngredients />
        <DietaryRestrictions />
        <Pantry/>
      </div>
    </Template>
  );
};

export default Recipes;
