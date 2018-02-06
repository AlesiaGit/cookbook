import React, { Component } from "react";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import RecipeItem from "./recipeItem";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";
import { recipesToIngredients } from "../../utils/recipesToIngredients";

//store
import store from "../../store/store";
import { updateMenu } from "../../ducks/menu";

const mapStateToProps = state => {
    return {
        menu: state.menu,
        login: state.login
    };
};

class RecipesList extends Component {
	constructor(props) {
		super(props);

		this.state = {
	        alertBox: this.props.recipes.map(elem => false)
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
        if (this.props.recipes !== nextProps.recipes) {
            this.setState({
                alertBox: nextProps.recipes.map(elem => false)
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
            backgroundImage: (item.image === '') ? 'url(' + settings.defaultCategory.image + ')' : item.image,
            backgroundColor: this.props.color
        })
    }

    addTitle = item => {
        if (item) return item.title;
    }

    addIcon = item => {
        if (item) {
            let category = this.props.categories.filter(elem => elem.id === item.category)[0];
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

    showMenuMessage = recipe => {
        if (recipe) {
            let indices = this.props.menu.recipes.map(elem => elem = elem.id);
            return indices.indexOf(recipe.id) === -1 ? "Добавить рецепт в меню?" : "Удалить рецепт из меню?";
        }
    }

    handleRecipeMenuToggle = recipe => {
        let menuRecipes = this.props.menu.recipes;
        let indices = this.props.menu.recipes.map(elem => elem = elem.id);

        if (!recipe) return;
        
        if (indices.indexOf(recipe.id) === -1)  {
            menuRecipes.push(recipe);
        } else {
            let index = menuRecipes.indexOf(recipe);
            menuRecipes.splice(index, 1);
        }

        let menu = {
            recipes: menuRecipes,
            ingredients: recipesToIngredients(menuRecipes)
        }

        store.dispatch(updateMenu(menuRecipes));
        db.collection(this.props.login.uid).doc('menu').set({menu});
    }

    render() {
        let table = [];
        let itemsPerRow = 2;

        for (let i = 0; i < Math.round(this.props.recipes.length / itemsPerRow); i++) {
            let row = [];
            for (let j = 0; j < itemsPerRow; j++) {
                row.push(this.props.recipes[i * itemsPerRow + j]);
            }
            table.push(row);
        }

        return (
             <div className="category__list">
                {table.map((item, index) => (
                   <div key={index}>
                         <RecipeItem
                         	recipes={this.props.recipes}
                         	rowIndex={index}
                            rowData={item}
                            onTouchStart={this.handleRecipeLongPress}
	            			onTouchEnd={this.handleRecipeRelease}
	            			alertBoxDisplayArray={this.state.alertBox}
	                		resetAlertBoxes={this.resetAlertBoxes}
	                		addTitle={this.addTitle}
	                		addStyle={this.addStyle}
                            addIcon={this.addIcon}
	                		handleRecipeLongPress={this.handleRecipeLongPress}
	                		handleRecipeRelease={this.handleRecipeRelease}
                            categories={this.props.categories}
                            handleRecipeMenuToggle={this.handleRecipeMenuToggle}
                            showMenuMessage={this.showMenuMessage}
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

export default connect(mapStateToProps)(RecipesList);