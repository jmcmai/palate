import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import LogoutButton from "../components/LogoutButton";

const Recipes = () => {
  const ingredients = useQuery(api.ingredients.get);
  return (
    <Template>
      <div>{JSON.stringify(ingredients, null, 2)}</div>;
      <LogoutButton />
    </Template>
  );
};

export default Recipes;
