import React from "react";
import { Link } from "react-router-dom";

const HeaderMenu = props => {
	return (
		<div
			style={{ display: props.display }}
			className="wrapper-transparent-cover"
			onClick={() => props.toggleHeaderMenu()}
		>
			<div className="recipe__header-overlay-menu">
				<Link
					to={"/category/" + props.recipe.category}
					className="recipe__header-overlay-menu-item"
					onClick={() => props.deleteRecipe()}
				>
					Удалить
				</Link>
				<Link
					to={"/change-recipe/" + props.recipe.id}
					className="recipe__header-overlay-menu-item"
				>
					Изменить
				</Link>
				<div
					className="recipe__header-overlay-menu-item"
					onClick={() => props.handleRecipeMenuToggle()}
				>
					{props.menuStatus}
				</div>
			</div>
		</div>
	);
};

export default HeaderMenu;
