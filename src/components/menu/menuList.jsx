import React, { Component } from "react";
//import PropTypes from "prop-types";

//components
import MenuItems from "./menuItems";

//utils
import settings from "../../config";
import { asyncLocalStorage } from "../../utils/asyncLocalStorage";

//store
import store from "../../store/store";
import { deleteFromMenu } from "../../ducks/menu";

class MenuList extends Component {
	constructor(props) {
		super(props);

		this.state = {
	        alertBox: this.props.recipes.map(elem => false),
            recipes: this.props.recipes,
            categories: this.props.categories
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
        if (this.state.recipes !== nextProps.recipes) {
            this.setState({
                alertBox: nextProps.recipes.map(elem => false),
                recipes: nextProps.recipes,
                categories: nextProps.categories
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
            let array = indices.filter(elem => elem !== recipe.id);
            asyncLocalStorage.setItem('menu', array);
            store.dispatch(deleteFromMenu(array));
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