import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import DietaryRestrictionItem from './DietaryRestrictionItem';

const LikedIngredients: React.FC = () => {
  const AddRestriction = useMutation(api.users.addRestriction);

  const [ingredient, setIngredient] = useState<string>('');
  const user = useQuery(api.users.retrieveUserData);
  let userDietaryRestriction: string[] = []
  if (user){
    userDietaryRestriction = user.restrictions;
  }

  const handleAddRestriction = async () => {
    console.log(user);
    console.log(userDietaryRestriction);
    try {
      const trimmedIngredient = ingredient.trim();
      if (!trimmedIngredient) return; 

      const result = await AddRestriction({ diet: trimmedIngredient });

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
        <h3>🙅‍♀️ Dietary Restrictions</h3>
        <div className="ingredients-list">
            {userDietaryRestriction.map((ingredient, index) => (
                <DietaryRestrictionItem key={index} name={ingredient} />
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
                    handleAddRestriction();
                }
            }}
            placeholder="peanut allergy, vegan, etc..."
        />
            <button className="input-button" onClick={handleAddRestriction}>Add Restriction</button>
        </div>
    </div>
  );
};

export default LikedIngredients;
