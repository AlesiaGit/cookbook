import React from "react";

import MenuList from "./menuList";
import ShoppingList from "./shoppingList";

const MenuBody = props => {
	if (props.menuList)
		return (
			<MenuList
				menu={props.menu}
				uid={props.uid}
				categories={props.categories}
			/>
		);

	return <ShoppingList menu={props.menu} uid={props.uid} />;
};

export default MenuBody;
