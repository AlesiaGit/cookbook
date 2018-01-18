import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import settings from "../config";
//import BackButton from "./backButton";
import { asyncLocalStorage } from "../utils/asyncLocalStorage";
import { deleteRecipe } from "../ducks/recipes";
import { saveTempData/*, resetTempData*/ } from "../ducks/temp-data";

import store from "../store/store";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
        tempData: state.tempData
    };
};

const HeaderMenu = props => {
	return (
		<div 
			style={{display: props.display}}		
			className="wrapper-transparent-cover" 
			onClick={() => props.toggleHeaderMenu()}
			>
		    <div className="recipe__header-overlay-menu">
	            <Link 
	            	to="/" 
	            	className="recipe__header-overlay-menu-item" 
	            	onClick={() => props.deleteRecipe()}>
	            	Удалить
	            </Link>
	            <Link 
	            	to={"/change-recipe/" + props.recipe.id} 
	            	className="recipe__header-overlay-menu-item"
	            	>
	            	Изменить
	            </Link>
	        </div>
        </div>
    )
}

class Recipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	sideMenu: false,
            startButton: true,
            headerMenu: false,
            redirect: false,
            recipe: this.props.recipes.array.filter(elem => elem.id === window.location.hash.split("/recipe/").pop())[0],
        };
    }

    componentWillMount = () => {
        if (this.state.recipe === undefined) {
            this.setState({
                redirect: true
            });
        } else {
        	/*if (this.props.location.state.recipe) {
        		this.setState({
	                selectedCategory: this.props.categories.array.filter(elem => elem.id === this.props.location.state.recipe.category)[0]
	            });
        	} else {*/
        		this.setState({
	                selectedCategory: this.props.categories.array.filter(elem => elem.id === this.state.recipe.category)[0]
	                //selectedCategory: this.props.selectedCategory
	            });
        	//}
            
        }          
    }

    componentDidMount = () => {
    	store.dispatch(saveTempData(this.state.recipe));
    }

    addStyle = item => {
        if (item) return ({
            backgroundImage: (item.image === '') ? 'url(' + settings.defaultCategory.icon + ')' : item.image,
            backgroundSize: (item.image === '') ? '50%' : 'cover'
        })
    }

    toggleSideMenu = () => {
        this.setState({
            sideMenu: !this.state.sideMenu,
            startButton: !this.state.startButton
        })
    }

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu,
        })
    }

    deleteRecipe = () => {
    	let remainingRecipes = this.props.recipes.array.filter(elem => {
    		return elem.id !== this.state.recipe.id;
    	});

    	store.dispatch(deleteRecipe(remainingRecipes));

    	asyncLocalStorage.setItem('recipes', remainingRecipes);
    }
   
    render() {
    	if (this.state.redirect) return (<Redirect to="/" />);

    	let headerMenuVisibility = this.state.headerMenu ? "flex" : "none";

        return (
            <div className="wrapper" onClick={this.hideHeaderMenu}>
	            <div className="recipe__header header" style={this.addStyle(this.state.recipe)}>
	                <div className="recipe__menu-wrapper">
		                <div className="recipe__header-left-menu">
		                   {/* <BackButton />*/}
		                    <Link className="back-btn" to="/" />
		                </div>
		                <div className="recipe__header-right-menu">
		                    <div className="recipe__header-share-btn"></div>
		                    <div className="recipe__header-menu-btn dots-menu-btn" onClick={this.toggleHeaderMenu}></div>
		                </div>
	                </div>
	                <div className="recipe__title">{this.state.recipe.title}</div>
	            </div>
				<div className="recipe__category-wrapper" style={{backgroundColor: this.state.selectedCategory.color}}>
					<div className="recipe__category-icon" 
						style={{
							backgroundImage: 'url(' + this.state.selectedCategory.icon + ')'}}></div>
					<div className="recipe__category-name">{this.state.selectedCategory.name}</div>
				</div>
				<div className="recipe__info-wrapper">
					<div className="recipe__headings">
						<div className="recipe__cooktime-heading">Время приготовления</div>
						<div className="recipe__portions-heading">Количество порций</div>
					</div>
					<div className="recipe__info">
						<div className="recipe__cooktime">{this.state.recipe.cooktime.hours} час {this.state.recipe.cooktime.minutes} мин</div>
						<div className="recipe__portions">{this.state.recipe.portions} чел</div>
					</div>
				</div>
				<div className="recipe__block-wrapper">
					<div className="recipe__block-title" style={{color: this.state.selectedCategory.color}}>Ингредиенты</div>
					<ul className="recipe__block-list">
						{this.state.recipe.ingredients.map((elem, index) => (
							<li key={index}>{elem.ingredientName} - {elem.ingredientQuantity} {elem.ingredientUnits}</li>
						))}
					</ul>
				</div>
				<div className="recipe__block-wrapper">
					<div className="recipe__block-title" style={{color: this.state.selectedCategory.color}}>Способ приготовления</div>
					<div className="recipe__block-text">{this.state.recipe.steps}</div>
				</div>
				 <HeaderMenu 
	            	display={headerMenuVisibility}
	            	toggleHeaderMenu={this.toggleHeaderMenu}
	            	deleteRecipe={this.deleteRecipe}
	            	recipe={this.state.recipe}
	            />
			</div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Recipe);
