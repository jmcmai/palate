import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const LikedIngredients: React.FC = () => {
  const addLikedIngredient = useMutation(api.users.addLikedIngredient);

  const [ingredient, setIngredient] = useState<string>(''); // State to hold the ingredient input

  const handleAddLikedIngredient = async () => {
    try {
      const trimmedIngredient = ingredient.trim();
      if (!trimmedIngredient) return; 

      const result = await addLikedIngredient({ ingredient: trimmedIngredient });

      if (result) {
        console.log("Ingredient added successfully!");
        setIngredient(''); // Reset the input after successful addition
      } else {
        console.log("Failed to add ingredient.");
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  return (
    <div className="ingredients-box content-body">
        <div className="ingredients-list">
            
        </div>
        <div className="input-bar">
            <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="type an ingredient..."/>
            <button className="input-button" onClick={handleAddLikedIngredient}>Add Ingredient</button>
        </div>
    </div>
  );
};

export default LikedIngredients;
