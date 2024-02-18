import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faLink, faThumbsUp, faThumbsDown);

interface Recipe {
    _id: any;
  name: string;
  image: string;
  ingredients: string[];
  totalTime: string;
  liked: any;
  url: string;
}

interface PinnedComponentProps {
  recipe: Recipe;
}
const PinnedComponent: React.FC<PinnedComponentProps> = ({ recipe }) => {
    const [showModal, setShowModal] = useState(false);
    const user = useQuery(api.users.retrieveUserData);
    const userLikedIngredients: string[] = user ? user.likedIngredients : [];
  
    const removePinned = useMutation(api.users.removePinned);
    const addRecipe = useMutation(api.users.addRecipe);
    const updateLiked = useMutation(api.recipes.updateLiked); // Assuming you have a mutation to update the liked status
  
    const toggleModal = () => {
      setShowModal(!showModal);
    };
  
    const handleThumbsUp = async () => {
      try {
        await updateLiked({ id: recipe._id, liked: 1 }); // Thumbs up
      } catch (error) {
        console.error("Error updating liked status:", error);
      }
    };
  
    const handleThumbsDown = async () => {
      try {
        await updateLiked({ id: recipe._id, liked: -1 }); // Thumbs down
      } catch (error) {
        console.error("Error updating liked status:", error);
      }
    };
  
    const handleCooked = async () => {
      try {
        await removePinned({ recipeId: recipe._id });
        await addRecipe({ recipeId: recipe._id });
      } catch (error) {
        console.error("Error handling cooked recipe:", error);
      }
    };
  
    const isLikedIngredient = (ingredient: string) => {
      return userLikedIngredients.some(
        (likedIngredient: string) =>
          likedIngredient.toLowerCase() === ingredient.toLowerCase()
      );
    };
  
    return (
      <div
        className="recipe-item"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%), url(${recipe.image})`,
        }}
        onClick={toggleModal}
      >
        <p className="white-text">{recipe.name}</p>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>
                &times;
              </span>
              {recipe.liked === -1 && (
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className="thumbs thumbs-down"
                />
              )}
              {recipe.liked === 1 && (
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="thumbs thumbs-up"
                />
              )}
              <h2 className="recipe-title center">{recipe.name}</h2>
              {recipe.image && <img src={recipe.image} alt={recipe.name} />}
              <p>Cook Time: {recipe.totalTime} minutes</p>
              <p>Ingredients:</p>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    style={{
                      color: isLikedIngredient(ingredient) ? "green" : "inherit",
                    }}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
              <button
                className="input-button"
                onClick={() => window.open(recipe.url, "_blank", "noopener noreferrer")}
              >
                <FontAwesomeIcon icon={faLink} /> Recipe URL
              </button>
              <button className="input-button" onClick={handleThumbsUp}>
                Thumbs Up
              </button>
              <button className="input-button" onClick={handleThumbsDown}>
                Thumbs Down
              </button>
              <button className="input-button" onClick={handleCooked}>
                Cooked?
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default PinnedComponent;