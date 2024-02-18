import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faLink, faThumbsUp, faThumbsDown);


interface Recipe {
  name: string;
  image: string;
  ingredients: string[];
  totalTime: string;
  liked: any;
  url: string;
}

interface RecipeComponentProps {
  recipe: Recipe;
}

const RecipeComponent: React.FC<RecipeComponentProps> = ({ recipe }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useQuery(api.users.retrieveUserData);
  const userLikedIngredients: string[] = user ? user.likedIngredients : [];

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const isLikedIngredient = (ingredient: string) => {
    return userLikedIngredients.some((likedIngredient: string) =>
      likedIngredient.toLowerCase() === ingredient.toLowerCase()
    );
  };

  return (
    <div className="recipe-item" style={{
      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%), url(${recipe.image})`
    }} onClick={toggleModal}>
      <p className="white-text">{recipe.name}</p>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            {recipe.liked === -1 && <FontAwesomeIcon icon={faThumbsDown} className="thumbs thumbs-down" />}
            {recipe.liked === 1 && <FontAwesomeIcon icon={faThumbsUp} className="thumbs thumbs-up" />}
            <h2 className="recipe-title center">{recipe.name}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.name} />}
            <p>Cook Time: {recipe.totalTime} minutes</p>
            <p>Ingredients:</p>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ color: isLikedIngredient(ingredient) ? 'green' : 'inherit' }}>
                  {ingredient}
                </li>
              ))}
            </ul>
            <button className="input-button"
            onClick={() => window.open(recipe.url, '_blank', 'noopener noreferrer')}
          >
            <FontAwesomeIcon icon={faLink} /> Recipe URL
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeComponent;
