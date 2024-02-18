import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import LikedCuisineItem from './LikedCuisineItem';

const LikedCuisines: React.FC = () => {
  const addLikedCuisine = useMutation(api.users.addCuisine);

  const [Cuisine, setCuisine] = useState<string>('');
  const user = useQuery(api.users.retrieveUserData);
  let userLikedCuisines: string[] = []
  if (user){
    userLikedCuisines = user.cuisines;
  }

  const handleAddLikedCuisine = async () => {
    try {
      const trimmedCuisine = Cuisine.trim();
      if (!trimmedCuisine) return; 

      const result = await addLikedCuisine({ cuisine: trimmedCuisine });

      if (result) {
        console.log("Cuisine added successfully!");
        setCuisine(''); // Reset the input after successful addition
      } else {
        console.log("Failed to add Cuisine.");
      }
    } catch (error) {
      console.error("Error adding Cuisine:", error);
    }
  };

  return (
    <div className="ingredients-box">
        <h3>🧑‍🍳 Liked Cuisines</h3>
        <div className="ingredients-list">
            {userLikedCuisines.map((Cuisine, index) => (
                <LikedCuisineItem key={index} name={Cuisine} />
            ))}
        </div>
        <div className="input-bar">
        <input
            type="text"
            spellCheck="true"
            value={Cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleAddLikedCuisine();
                }
            }}
            placeholder="type a cuisine..."
        />
            <button className="input-button" onClick={handleAddLikedCuisine}>Add Cuisine</button>
        </div>
    </div>
  );
};

export default LikedCuisines;
