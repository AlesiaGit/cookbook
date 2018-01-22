import defaultIcon from "./img/svg/app-icon.svg";
import defaultImage from "./img/icons/app-cover-image.png";
import menuIcon from "./img/svg/menu-icon.svg";
import menuImage from "./img/icons/menu-cover-image.png";

import ananasIcon from "./img/svg/ananas.svg";
import appleIcon from "./img/svg/apple.svg";
import bakedIcon from "./img/svg/baked.svg";
import burgerIcon from "./img/svg/burger.svg";
import cakeIcon from "./img/svg/cake.svg";
import chickenIcon from "./img/svg/chicken.svg";
import eggIcon from "./img/svg/egg.svg";
import fishIcon from "./img/svg/fish.svg";
import grapesIcon from "./img/svg/grapes.svg";
import icecreamIcon from "./img/svg/icecream.svg";
import lemonIcon from "./img/svg/lemon.svg";
import meatIcon from "./img/svg/meat.svg";
import noodlesIcon from "./img/svg/noodles.svg";
import pearIcon from "./img/svg/pear.svg";
import watermelonIcon from "./img/svg/watermelon.svg";

const settings = {
	colors: [
		"#e898a5", "#00bcd4", "#673ab7", "#03a9f4", "#259b24", 
		"#009688", "#e91e63", "#ffc107", "#ff5722", "#795548", 
		"#b6de8c", "#5f564e", "#f79273", "#dbaf47", "#a9aef5"],
	icons: [
		ananasIcon, appleIcon, bakedIcon, burgerIcon, cakeIcon, 
        chickenIcon, eggIcon, fishIcon, grapesIcon, icecreamIcon, 
        lemonIcon, meatIcon, noodlesIcon, pearIcon, watermelonIcon],
    defaultCategory: {
	    id: 'default',
	    icon: defaultIcon,
	    name: "Все рецепты",
	    color: "#e7989e",
	    image: defaultImage
	},
	menuCategory: {
		id: 'menu',
		icon: menuIcon,
		name: "Меню",
		color: "#dbaf47",
		image: menuImage
	}
}

export default settings;
