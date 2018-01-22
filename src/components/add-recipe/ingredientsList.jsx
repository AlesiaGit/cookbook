import React from "react";

const IngredientsList = (props) => {
    return (
        <li className="add-recipe__added-ingredient-item">
            {props.recipeIngredients.map((elem, index) => (
                <div key={index}>
                    <span className="ingredient-item-name">{elem.ingredientName}</span>
                    <span> - </span>
                    <span className="ingredient-item-quantity">{elem.ingredientQuantity}</span>
                    <span> </span>
                    <span className="ingredient-item-unit">{elem.ingredientUnits}</span>
                </div>
            ))}
        </li> 
    )
}

export default IngredientsList;