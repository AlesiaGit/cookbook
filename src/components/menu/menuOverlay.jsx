import React from "react";

const MenuOverlay = props => {
	let display = props.alertBoxDisplayArray[props.index] ? 'flex' : 'none';
    return (
    	<div 
    		className="category__alert-box-wrapper"
    		style={{display: display}}
    		>
	        <div 
	            className="wrapper-transparent-cover" 
	            onClick={(event) => {
	            	event.preventDefault(); 
	            	event.stopPropagation(); 
	            	props.resetAlertBoxes()}
	            }>
        	</div>
        	<div 
                className="category__alert-box">
                <div className="category__alert-message">Удалить рецепт из меню?</div>
                <div 
                	className="category__alert-confirm-btn" 
                	onClick={(event) => {
		            	event.preventDefault(); 
		            	event.stopPropagation(); 
		            	props.resetAlertBoxes();
                        props.deleteRecipeFromMenu(props.item);
                        }
		        	}>
		        </div>
            </div>
        </div>
    )
}

export default MenuOverlay;