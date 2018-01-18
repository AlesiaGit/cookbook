import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import Drawer from "./drawer";
import RecipesList from "./recipesList";

import { asyncLocalStorage } from "../utils/asyncLocalStorage";

import store from "../store/store";
import { /*addCategory,*/ deleteCategory } from "../ducks/categories";
import { changeCategory, resetCategory } from "../ducks/selected-category";
import { /*addRecipe,*/ deleteRecipe } from "../ducks/recipes";

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



class Category extends Component {
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

        //console.log(this.props);
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });
        this.setStatusBarColor(this.props.selectedCategory.data.color);
    }

    componentWillUnmount = () => {
        //store.dispatch(changeCategory(this.state.selectedCategory));
    }

    setStatusBarColor = (color) => {
        document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / this.state.ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
    }

    setCategoryToDefault = () => {
        store.dispatch(resetCategory());
		this.setState({
        	selectedCategory: settings.defaultCategory,
            selectedCategoryRecipes: this.props.recipes.array
        });
        this.setStatusBarColor(settings.defaultCategory.color);
    }

    selectCategory = (category) => {
    	store.dispatch(changeCategory(category));
		this.setState({
        	selectedCategory: category,
            selectedCategoryRecipes: this.props.recipes.array.filter(elem => elem.category === category.id)
        });
        this.setStatusBarColor(category.color);
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
            array = this.state.recipes.filter(elem => elem.title.toLowerCase().indexOf(search.toLowerCase()) >= 0);
        } else {
            array = this.state.recipes.filter(elem => elem.title.toLowerCase().indexOf(search.toLowerCase()) >= 0 && elem.category === this.state.selectedCategory.id);
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

        let categoryColor = this.state.selectedCategory.color;
        let drawerVisibility = this.state.drawer ? "flex" : "none";
        let sideMenuDisplay = this.state.sideMenu ? "flex" : "none";
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";
        let startButtonImage = this.state.startButton ? "start-menu-btn" : "return-menu-btn";

        return (
           <div className="wrapper" onClick={this.hideHeaderMenu}>
            <div className="category__header header" style={{backgroundColor: categoryColor}} >
                <div className="category__header-left-menu">
                    <div className={"category__header-menu-btn " + startButtonImage} onClick={this.toggleDrawer}></div>
                </div>
                <div className="category__header-right-menu">
                    <input 
                        onFocus={this.preventWindowFromResize} 
                        onBlur={this.resetInput}
                        className="category__header-search-field" 
                        onChange={this.handleInput} 
                        value={this.state.value} 
                    />
                    <div className="category__header-menu-btn dots-menu-btn" onClick={this.toggleHeaderMenu}></div>
                </div>
            </div>
            <div className="category__body">
                <div className="category__title">
                    <div className="category__selected">
                        <div className="category__selected-icon" style={this.drawCategoryIcon(this.state.selectedCategory)}></div>
                        <div className="category__selected-title" style={{color: categoryColor}}>{this.state.selectedCategory.name}</div>
                    </div>
                    <div className="category__items-count-wrapper">
                        <div className="category__items-count" style={{backgroundColor: categoryColor}}>{this.writeRecipesCount(this.state.selectedCategory.id)}</div>
                    </div>
                </div>
                <RecipesList 
                    recipes={this.state.selectedCategoryRecipes} 
                    color={categoryColor}
                    selectCategory={this.selectCategory}
                    categories={this.state.categories}
                />
                <Link className="category__add-recipe-btn" style={{backgroundColor: categoryColor}} to={"/add-recipe/r" + Date.now()}/>
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
			<Drawer 
				drawerDisplay={drawerVisibility}
                sideMenuDisplay={sideMenuDisplay}
				categories={this.state.categories} 
				toggleDrawer={this.toggleDrawer}
				handleCategoryChange={this.handleCategoryChange}
				drawCategoryIcon={this.drawCategoryIcon} 
				writeRecipesCount={this.writeRecipesCount}
				deleteCategory={this.deleteCategory}
                selectedCategory={this.state.selectedCategory}
			/>
            
        </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Category);
