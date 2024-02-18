import React, { useState }  from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faTrashCan);

interface LikedPantry {
    name: string;
}

const LikedIngredientItem: React.FC<LikedPantry> = ({ name }) => {
    const deletePantry = useMutation(api.users.removePantry);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleDeleteLikedIngredient = async () => {
        try {
            const result = await deletePantry({ ingredient: name });

            if (result) {
                console.log("Ingredient deleted successfully:", name);
            } else {
                console.log("Failed to delete ingredient:", name);
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
        }
    };

    return (
        <div 
        className="ingredient-item" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <span>{name}</span>
        {isHovered && (
            <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteLikedIngredient}/>
        )}
    </div>
    );
};

export default LikedIngredientItem;