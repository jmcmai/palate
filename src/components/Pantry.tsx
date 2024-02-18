import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import PantryItem from './PantryItem';

const Pantrys: React.FC = () => {
  const addPantry = useMutation(api.users.addPantry);

  const [ingredient, setIngredient] = useState<string>('');
  const user = useQuery(api.users.retrieveUserData);
  let userPantrys: string[] = []
  if (user){
    userPantrys = user.pantry;
  }

  const handleAddPantry = async () => {
    try {
      const trimmedIngredient = ingredient.trim();
      if (!trimmedIngredient) return; 

      const result = await addPantry({ ingredient: trimmedIngredient });

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
        <h3>🥫 My Pantry</h3>
        <div className="ingredients-list">
            {userPantrys.map((ingredient, index) => (
                <PantryItem key={index} name={ingredient} />
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
                    handleAddPantry();
                }
            }}
            placeholder="type an ingredient..."
        />
            <button className="input-button" onClick={handleAddPantry}>Add Ingredient</button>
        </div>
    </div>
  );
};

export default Pantrys;

