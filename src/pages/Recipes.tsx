import React from "react";
import Template from "../components/Template";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import useStoreUserEffect from "../useStoreUserEffect";

const Recipes: React.FC = () => {
  const userId = useStoreUserEffect();
  return (
    <Template>
      <div>{userId}</div>
    </Template>
  );
};

export default Recipes;
