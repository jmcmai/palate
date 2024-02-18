import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const Recipes: React.FC = () => {
  const ingredients = useQuery(api.ingredients.get);
  return (
    <Template>
      <div>{JSON.stringify(ingredients, null, 2)}</div>;
    </Template>
  );
};

export default Recipes;
