import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import DislikedIngredientItem from './DislikedIngredientItem';

const LikedIngredients: React.FC = () => {
  const addLikedIngredient = useMutation(api.users.addDislikedIngredient);

  const [ingredient, setIngredient] = useState<string>('');
  const user = useQuery(api.users.retrieveUserData);
  let userDislikedIngredients: string[] = []
  if (user){
    userDislikedIngredients = user.dislikedIngredients;
  }

  const handleAddLikedIngredient = async () => {
    console.log(user);
    console.log(userDislikedIngredients);
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
        <h3>Disliked Ingredients</h3>
        <div className="ingredients-list">
            {userDislikedIngredients.map((ingredient, index) => (
                <DislikedIngredientItem key={index} name={ingredient} />
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
