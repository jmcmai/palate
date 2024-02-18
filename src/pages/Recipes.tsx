import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import LogoutButton from "../components/LogoutButton";
import useStoreUserEffect from "../useStoreUserEffect";

const Recipes = () => {
  const userId = useStoreUserEffect();
  const ingredients = useQuery(api.ingredients.get);
  return (
    <Template>
      <div>{JSON.stringify(ingredients, null, 2)}</div>;<div>{userId}</div>
      <LogoutButton />
    </Template>
  );
};

export default Recipes;
