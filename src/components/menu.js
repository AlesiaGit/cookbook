import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import Drawer from "./drawer";
//import BackButton from "./backButton";
//import RecipesList from "./recipesList";

//import { asyncLocalStorage } from "../utils/asyncLocalStorage";

//import store from "../store/store";
//import { addCategory, deleteCategory } from "../ducks/categories";
//import { changeCategory, resetCategory } from "../ducks/selected-category";
//import { addRecipe, deleteRecipe } from "../ducks/recipes";
//import { saveTempData, resetTempData } from "../ducks/temp-data";
//import { addToMenu, deleteFromMenu, resetMenu } from "../ducks/menu";

//import settings from "../config";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu
    };
};


/*const HeaderMenu = props => {
    return (
        <div style={{display: props.headerMenuDisplay}}>
            <div 
                className="wrapper-transparent-cover" 
                onClick={() => props.toggleHeaderMenu()}
            ></div>
            <div className="category__header-overlay-menu">
                <Link 
                    to="/" 
                    className="category__header-overlay-menu-item" 
                    onClick={() => console.log('add reset menu functionality')}>
                    Удалить
                </Link>
                <Link 
                    to="/change-category"
                    className="category__header-overlay-menu-item"
                    onClick={() => console.log('add export to shopping list functionality')}>
                    Изменить
                </Link>
            </div>
        </div>
    )

}*/



class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            startButton: true,
            headerMenu: false,
            menu: this.props.menu.array,
            menuRecipes: this.props.recipes.array.filter(elem => this.props.menu.array.indexOf(elem.id) !== -1)
        };
    }

    componentWillMount = () => {
        console.log(this.state.menuRecipes);
    }

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu,
        })
    }

   
    render() {
        return (
           <div className="wrapper">To be continued
           
        </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Menu);
