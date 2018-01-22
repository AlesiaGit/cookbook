import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import Drawer from "./drawer";
import RecipesList from "./recipesList";

//utils
import settings from "../../config";
import { asyncLocalStorage } from "../../utils/asyncLocalStorage";

//store
import store from "../../store/store";
import { deleteCategory } from "../../ducks/categories";
import { deleteRecipe } from "../../ducks/recipes";
import { deleteFromMenu } from "../../ducks/menu";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu
    };
};

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: settings.defaultCategory.id,
            value: '',
            drawer: false,
            startButton: true,
            headerMenu: false,
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            selectedCategory: settings.defaultCategory,
            selectedCategoryRecipes: this.props.recipes.array,
        };
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });
        this.setStatusBarColor(this.state.selectedCategory.color);
    }

    setStatusBarColor = (color) => {
        document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / this.state.ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
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
        });
    }

    logOut = () => {
        //add logout functionality
        // this.setState({
        //     headerMenu: !this.state.headerMenu,
        // })
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

        let remainingRecipesIndices = remainingRecipes.map(elem => elem = elem.id);
        let remainingMenu = this.props.menu.array.filter(elem => remainingRecipesIndices.indexOf(elem) !== -1);

        this.setState({
            categories: remainingCategories,
            recipes: remainingRecipes,
            headerMenu: false,
            drawer: false
        });

        asyncLocalStorage.setItem('recipes', remainingRecipes);
        asyncLocalStorage.setItem('categories', remainingCategories);
        asyncLocalStorage.setItem('menu', remainingMenu);

        store.dispatch(deleteRecipe(remainingRecipes));
        store.dispatch(deleteCategory(remainingCategories));
        store.dispatch(deleteFromMenu(remainingMenu));

    }

    handleInput = (event) => {
        let search = event.target.value;

        this.setState({
            selectedCategoryRecipes: this.state.recipes.filter(elem => elem.title.toLowerCase().indexOf(search.toLowerCase()) >= 0),
            value: search
        });
    }

    resetInput = () => {
        this.setState({
            selectedCategoryRecipes: this.props.recipes.array,
            value: ''
        });
    }
    

    render() {
        let categoryColor = this.state.selectedCategory.color;
        let drawerVisibility = this.state.drawer ? "flex" : "none";
        let sideMenuDisplay = this.state.sideMenu ? "flex" : "none";
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";
        let startButtonImage = this.state.startButton ? "start-menu-btn" : "return-menu-btn";
        let categoryId = this.props.categories.array.length === 0 ? "" : this.props.categories.array[0].id;

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
            <div style={{display: headerMenuDisplay}}>
                <div 
                    className="wrapper-transparent-cover" 
                    onClick={this.toggleHeaderMenu}>
                </div>
                <div className="category__header-overlay-menu">
                    <Link 
                        to="/"
                        className="category__header-overlay-menu-item" 
                        onClick={this.logOut}>Logout</Link>
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
                    categories={this.state.categories}
                />
                <Link 
                    className="category__add-recipe-btn" 
                    style={{backgroundColor: categoryColor}} 
                    to={{
                        pathname: "/add-recipe/r" + Date.now(), 
                        state: {categoryId: categoryId}
                    }} 
                />
            </div>
			<Drawer 
                id={this.state.id}
				drawerDisplay={drawerVisibility}
                sideMenuDisplay={sideMenuDisplay}
				toggleDrawer={this.toggleDrawer}
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

export default connect(mapStateToProps)(Home);
