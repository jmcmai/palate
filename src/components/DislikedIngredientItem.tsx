import React, { useState }  from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faTrashCan);

interface DislikedIngredientItemProps {
    name: string;
}

const DislikedIngredientItem: React.FC<DislikedIngredientItemProps> = ({ name }) => {
    const deleteDislikedIngredientItem = useMutation(api.users.removeDislikedIngredient);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleDeleteDislikedIngredient = async () => {
        try {
            const result = await deleteDislikedIngredientItem({ ingredient: name });

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
            <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteDislikedIngredient}/>
        )}
    </div>
    );
};

export default DislikedIngredientItem;