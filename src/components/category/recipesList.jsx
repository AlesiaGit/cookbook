import React, { Component } from "react";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import RecipeItem from "./recipeItem";

//utils
//import { asyncLocalStorage } from "../../utils/asyncLocalStorage";
import settings from "../../config";
import firebaseApp from "../../utils/firebase";

//store
import store from "../../store/store";
import { addToMenu, deleteFromMenu } from "../../ducks/menu";

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
	        alertBox: this.props.recipes.map(elem => false),
            menu: this.props.menu.array
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
        if (this.props.menu.array !== nextProps.menu.array) {
            this.setState({
                menu: nextProps.menu.array
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
            return this.state.menu.indexOf(recipe.id) === -1 ? "Добавить рецепт в меню?" : "Удалить рецепт из меню?";
        }
    }

    handleRecipeMenuToggle = recipe => {
        if (recipe && this.state.menu.indexOf(recipe.id) === -1) {
            let menu = this.state.menu;
            menu.push(recipe.id);
            //asyncLocalStorage.setItem('menu', array);
            store.dispatch(addToMenu(menu));
            firebaseApp.firestore().collection(this.props.login.uid).doc('menu').set({menu});
            return;
        }

        if (recipe && this.state.menu.indexOf(recipe.id) !== -1) {
            let menu = this.state.menu.filter(elem => elem !== recipe.id);
            //asyncLocalStorage.setItem('menu', array);
            store.dispatch(deleteFromMenu(menu));
            firebaseApp.firestore().collection(this.props.login.uid).doc('menu').set({menu});
            return;
        } 
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
                            getId={this.getId}
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