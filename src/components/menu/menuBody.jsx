import React from "react";

import MenuList from "./menuList";
import ShoppingList from "./shoppingList";

const MenuBody = props => {
	if (props.menuList) return (
		<MenuList 
            menuRecipes={props.menuRecipes}
            uid={props.uid}
            menuCategories={props.menuCategories}

        />
	);

	return (
		<ShoppingList 
			menuRecipes={props.menuRecipes}
			uid={props.uid}
			shoppingList={props.shoppingList}
		/>
	);
}

export default MenuBody;