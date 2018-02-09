import React from "react";
//import { Link } from "react-router-dom";

const HeaderMenu = props => {
	return (
		<div 
			style={{display: props.display}}		
			className="wrapper-transparent-cover" 
			onClick={() => props.toggleHeaderMenu()}
			>
		    <div className="recipe__header-overlay-menu">
	            <div 
	            	className="recipe__header-overlay-menu-item"
	            	onClick={() => props.saveSharedRecipe()}
	            	>
	            	Сохранить рецепт
	            </div>
	        </div>
        </div>
    )
}

export default HeaderMenu;