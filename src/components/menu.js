import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import Drawer from "./drawer";
import BackButton from "./backButton";
import RecipesList from "./recipesList";

import { asyncLocalStorage } from "../utils/asyncLocalStorage";

import store from "../store/store";
import { /*addCategory,*/ deleteCategory } from "../ducks/categories";
import { changeCategory, resetCategory } from "../ducks/selected-category";
import { /*addRecipe,*/ deleteRecipe } from "../ducks/recipes";
import { /*saveTempData,*/ resetTempData } from "../ducks/temp-data";

import settings from "../config";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        selectedCategory: state.selectedCategory
    };
};


const HeaderMenu = props => {
    if (props.selectedCategory.id === 'default') {
        return (
            <div style={{display: props.headerMenuDisplay}}>
                <div 
                    className="wrapper-transparent-cover" 
                    onClick={() => props.toggleHeaderMenu()}>
                </div>
                <div className="category__header-overlay-menu">
                    <Link 
                        to="/"
                        className="category__header-overlay-menu-item" 
                        onClick={() => props.logOut()}>Logout</Link>
                </div>
            </div>
        )
    } else {
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
                        onClick={() => props.deleteCategory(props.selectedCategory)}>
                        Удалить
                    </Link>
                    <Link 
                        to="/change-category"
                        className="category__header-overlay-menu-item"
                        onClick={() => props.handleCategoryChange(props.category)}>
                        Изменить
                    </Link>
                </div>
            </div>
        )
    }
}



class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            drawer: false,
            startButton: true,
            headerMenu: false,
            sideMenu: false,
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            selectedCategory: this.props.selectedCategory.data,
            selectedCategoryRecipes: (this.props.selectedCategory.data.id !== 'default') ? this.props.recipes.array.filter(elem => elem.category === this.props.selectedCategory.data.id) : this.props.recipes.array,
            defaultCategory: settings.defaultCategory,
            defaultCategoryRecipes: this.props.recipes.array,
        };
    }

    componentWillMount = () => {
        store.dispatch(resetTempData());
    }

    componentWillUnmount = () => {

    }


    setCategoryToDefault = () => {
        store.dispatch(resetCategory());
		this.setState({
        	selectedCategory: settings.defaultCategory,
            selectedCategoryRecipes: this.props.recipes.array
        });
    }

    selectCategory = (category) => {
    	store.dispatch(changeCategory(category));
		this.setState({
        	selectedCategory: category,
            selectedCategoryRecipes: this.props.recipes.array.filter(elem => elem.category === category.id)
        });
    }

    toggleDrawer = () => {
        this.setState({
            drawer: !this.state.drawer,
            startButton: !this.state.startButton
        })
    }

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu,
        })
    }

    logOut = () => {
        //add logout functionality
        // this.setState({
        //     headerMenu: !this.state.headerMenu,
        // })
    }

    toggleSideMenu = () => {
        this.setState({
            sideMenu: !this.state.sideMenu,
        })
    }

    handleCategoryChange = (category) => {
    	category ? this.selectCategory(category) : this.setCategoryToDefault();
    	this.toggleDrawer();
    }

    drawCategoryIcon = (category) => {
        return ({
            WebkitMaskImage: "url(" + category.icon + ")",
            backgroundColor: category.color 
        })
    }

    writeRecipesCount = (id) => {
        let count = 0;
        if (id === 'default') return this.correctlyWrite(this.state.recipes.length);
            
        this.state.recipes.forEach(item => {
            if (item.category === id) return count++;
        });

        return this.correctlyWrite(count);
    }

    correctlyWrite = (number) => {
        if (number % 10 === 1) return number + " рецепт";
        if (number % 10 > 1 && number % 10 < 5 && number > 20) return number + " рецепта";
        if (number > 1 && number < 5) return number + " рецепта";
        return number + " рецептов";
    }

    deleteCategory = (category) => {
        let remainingCategories = this.state.categories.filter(elem => elem !== category);
        let remainingRecipes = this.state.recipes.filter(elem => elem.category !== category.id);

        this.setState({
            categories: remainingCategories,
            recipes: remainingRecipes,
            selectedCategory: settings.defaultCategory,
            selectedCategoryRecipes: remainingRecipes,
            headerMenu: !this.state.headerMenu
        });

        asyncLocalStorage.setItem('recipes', remainingRecipes);
        asyncLocalStorage.setItem('categories', remainingCategories);

        store.dispatch(deleteRecipe(remainingRecipes));
        store.dispatch(deleteCategory(remainingCategories));

        this.forceUpdate();
    }

    handleInput = (event) => {
        let search = event.target.value;
        let array;

        if (this.state.selectedCategory.id === 'default') {
            array = this.state.recipes.filter(elem => elem.title.toLowerCase().indexOf(search) >= 0);
        } else {
            array = this.state.recipes.filter(elem => elem.title.toLowerCase().indexOf(search) >= 0 && elem.category === this.state.selectedCategory.id);
        }

        this.setState({
            selectedCategoryRecipes: array,
            value: search
        })
    }

    resetInput = () => {
        this.setState({
            value: ''
        })
    }
    

    render() {
        let drawerVisibility = this.state.drawer ? "flex" : "none";
        let sideMenuDisplay = this.state.sideMenu ? "flex" : "none";
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";
        let startButtonImage = this.state.startButton ? "start-menu-btn" : "return-menu-btn";
        let color = this.state.selectedCategory.color;
        let addRecipeLink = this.state.categories.length === 0 ? "/add-category" : "/add-recipe";

        return (
           <div className="wrapper" onClick={this.hideHeaderMenu}>
            <div className="category__header header" style={{backgroundColor: color}} >
                <div className="category__header-left-menu">
                    <BackButton />
                </div>
                <div className="category__header-right-menu">
                    <div className="category__header-menu-btn dots-menu-btn" onClick={this.toggleHeaderMenu}></div>
                </div>
            </div>
            <div className="category__body">
                <div className="category__title">
                    <div className="category__selected">
                        <div className="category__selected-icon" style={this.drawCategoryIcon(this.state.selectedCategory)}></div>
                        <div className="category__selected-title" style={{color: color}}>{this.state.selectedCategory.name}</div>
                    </div>
                    <div className="category__items-count-wrapper">
                        <div className="category__items-count" style={{backgroundColor: color}}>{this.writeRecipesCount(this.state.selectedCategory.id)}</div>
                    </div>
                </div>
                <RecipesList 
                    recipes={this.state.selectedCategoryRecipes} 
                    color={color}
                />
                <Link className="category__add-recipe-btn" style={{backgroundColor: color}} to={addRecipeLink} />
            </div>
            <HeaderMenu 
            	headerMenuDisplay={headerMenuDisplay}
            	toggleHeaderMenu={this.toggleHeaderMenu}
                handleCategoryChange={this.handleCategoryChange}
                selectedCategory={this.state.selectedCategory}
                deleteCategory={this.deleteCategory}
                logOut={this.logOut}
                category={this.state.selectedCategory}
            />
        </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Menu);
