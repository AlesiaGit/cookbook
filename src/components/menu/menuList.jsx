import React, { Component } from "react";
//import PropTypes from "prop-types";

//components
import MenuItems from "./menuItems";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
import { deleteFromMenu } from "../../ducks/menu";
//import { shoppingListCreated } from "../../ducks/shopping-list";

/*const mapStateToProps = state => {
    return {
        login: state.login
    };
};*/


class MenuList extends Component {
	constructor(props) {
		super(props);

		this.state = {
	        alertBox: this.props.menuRecipes.map(elem => false),
            recipes: this.props.menuRecipes,
            categories: this.props.menuCategories
	    }

	}

    componentWillMount = () => {
        document.addEventListener('contextmenu', this.handleContextMenu);
    }

	componentWillUnmount = () => {
        document.removeEventListener('contextmenu', this.handleContextMenu);
        clearTimeout(this.longPressTimer);
	}

    componentWillReceiveProps = (nextProps) => {
        if (this.state.menuRecipes !== nextProps.menuRecipes) {
            this.setState({
                alertBox: nextProps.menuRecipes.map(elem => false),
                recipes: nextProps.menuRecipes,
                categories: nextProps.menuCategories
            })
        }
    }

    handleContextMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    handleRecipeLongPress = (index) => {
        this.longPressTimer = setTimeout(() => {
            this.setState({
                alertBox: this.state.alertBox.map((elem, i) => (i === index) ? true : false)
            })
    	}, 300);        	
    }

    handleRecipeRelease = () => {
        clearTimeout(this.longPressTimer);
    }

    alertBoxDisplay = (index) => {
    	return this.state.alertBox[index] === true ? "flex" : "none";
    }

    resetAlertBoxes = () => {
    	clearTimeout(this.longPressTimer);
        this.setState({
            alertBox: this.state.alertBox.map(elem => false)
        });
    }

    addStyle = item => {
        if (item) return ({
            backgroundImage: (item.image === '') ? 'url(' + settings.menuCategory.image + ')' : item.image,
            backgroundColor: settings.menuCategory.color
        })
    }

    addTitle = item => {
        if (item) return item.title;
    }

    addIcon = item => {
        if (item) {
            let category = this.state.categories.filter(elem => elem.id === item.category)[0];
            return ({
                backgroundColor: category.color,
                WebkitMaskImage: "url(" + category.icon + ")", 
            });
        }
    }

    getId = item => {
        if (item) return item.id;
    }

    hideEmpty = item => {
        if (!item) return ({
            visibility: 'hidden'
        })
    }

    deleteRecipeFromMenu = (recipe) => {
        if (recipe) {
            let indices = this.state.recipes.map(elem => elem = elem.id);
            let menu = indices.filter(elem => elem !== recipe.id);
            store.dispatch(deleteFromMenu(menu));
            db.collection(this.props.uid).doc('menu').set({menu});
        } 
    }

    render() {
        let table = [];
        let itemsPerRow = 2;

        for (let i = 0; i < Math.round(this.state.recipes.length / itemsPerRow); i++) {
            let row = [];
            for (let j = 0; j < itemsPerRow; j++) {
                row.push(this.state.recipes[i * itemsPerRow + j]);
            }
            table.push(row);
        }

        return (
             <div className="category__list">
                {table.map((item, index) => (
                   <div key={index}>
                         <MenuItems
                         	recipes={this.state.recipes}
                            categories={this.state.categories}
                         	rowIndex={index}
                            rowData={item}
                            onTouchStart={this.handleRecipeLongPress}
	            			onTouchEnd={this.handleRecipeRelease}
	            			alertBoxDisplayArray={this.state.alertBox}
	                		resetAlertBoxes={this.resetAlertBoxes}
	                		addTitle={this.addTitle}
	                		addStyle={this.addStyle}
                            addIcon={this.addIcon}
                            getId={this.getId}
	                		handleRecipeLongPress={this.handleRecipeLongPress}
	                		handleRecipeRelease={this.handleRecipeRelease}
                            deleteRecipeFromMenu={this.deleteRecipeFromMenu}
                            /> 
                    </div>
                 ))}
            </div>
            
        );
    }
}

/*Game.propTypes = {
    location: PropTypes.string
};*/

export default MenuList;