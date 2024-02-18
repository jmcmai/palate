import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import LikedIngredientItem from './LikedIngredientItem';

const LikedIngredients: React.FC = () => {
  const addLikedIngredient = useMutation(api.users.addLikedIngredient);

  const [ingredient, setIngredient] = useState<string>('');
  const user = useQuery(api.users.retrieveUserData);
  let userlikedIngredients: string[] = []
  if (user){
    userlikedIngredients = user.likedIngredients;
  }

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
    <div className="ingredients-box">
        <h3>🤤 Liked Ingredients</h3>
        <div className="ingredients-list">
            {userlikedIngredients.map((ingredient, index) => (
                <LikedIngredientItem key={index} name={ingredient} />
            ))}
        </div>
        <div className="input-bar">
        <input
            type="text"
            spellCheck="true"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleAddLikedIngredient();
                }
            }}
            placeholder="type an ingredient..."
        />
            <button className="input-button" onClick={handleAddLikedIngredient}>Add Ingredient</button>
        </div>
    </div>
  );
};

export default LikedIngredients;

