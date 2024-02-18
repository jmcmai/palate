import React, { useState }  from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faTrashCan);

interface LikedCuisineItemProps {
    name: string;
}

const LikedCuisineItem: React.FC<LikedCuisineItemProps> = ({ name }) => {
    const deleteLikedCuisineItem = useMutation(api.users.removeCuisine);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleDeleteLikedCuisine = async () => {
        try {
            const result = await deleteLikedCuisineItem({ Cuisine: name });

            if (result) {
                console.log("Cuisine deleted successfully:", name);
            } else {
                console.log("Failed to delete Cuisine:", name);
            }
        } catch (error) {
            console.error("Error deleting Cuisine:", error);
        }
    };

    return (
        <div 
        className="Cuisine-item" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <span>{name}</span>
        {isHovered && (
            <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteLikedCuisine}/>
        )}
    </div>
    );
};

export default LikedCuisineItem;