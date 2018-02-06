import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";
import Croppie from "croppie";

//components
import CategoriesDropDown from './categoriesDropDown';
import BackButton from "./backButton";
import IngredientsList from "./ingredientsList";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
import { addRecipe, deleteRecipe } from "../../ducks/recipes";

const mapStateToProps = state => {
    return {
         recipes: state.recipes,
         categories: state.categories,
         menu: state.menu,
         login: state.login
    };
};

class AddRecipe extends Component {
    constructor(props) {
        super(props);

        let id = this.props.location.pathname.split("/add-recipe/").pop();
        
        let empty = {
            id: id,
            cooktime: {
                hours: '', 
                minutes: ''
            }, 
            image: '',
            ingredients: [], 
            portions: '', 
            steps: '', 
            title: '',
            category: ''
        }

        let recipe = this.props.recipes.array.filter(elem => elem.id === id)[0] || empty;

        this.state = {
            cropperDisplay: false,
            recipe: recipe,
            resultImage: recipe.image === '' ? "url('" + settings.defaultCategory.image + "')" : recipe.image,
            recipeId: id,
            recipeName: recipe.title,
            recipeCookHours: recipe.cooktime.hours,
            recipeCookMinutes: recipe.cooktime.minutes,
            recipePortions: recipe.portions,
            recipeDescription: recipe.steps,
            recipeIngredients: recipe.ingredients,
            recipeCategory: recipe.category,
            ingredientName: '',
            ingredientQuantity: '',
            ingredientUnits: 'мл',
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            croppie: ""
        };
    }

    componentWillMount = () => {
        if (!this.props.location.state) return this.setState({redirectToHome: true});

        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });

        if (this.props.location.state.categoryId === '') return this.setState({redirectToAddCategory: true});

        this.setState({
            selectedCategory: this.state.recipeCategory === '' 
                ? this.props.categories.array.filter(elem => elem.id === this.props.location.state.categoryId)[0] 
                : this.props.categories.array.filter(elem => elem.id === this.props.categories.array.id)[0]
        }, () => this.setStatusBarColor(this.state.selectedCategory.color));
    }

    setStatusBarColor = (color) => {
        document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / this.state.ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
    }

    handleInputChange = (event) => {
        let target = event.target;
        let value = (target.type === 'radio') ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleFileUpload = (event) => {
        this.setState({
            width: this.resultWrapper.offsetWidth * 0.8 + 'px',
            height: this.resultWrapper.offsetWidth * 0.6 + 'px',
        }, () => {

        this.setState({
            
            croppie: new Croppie(this.croppie, {
                viewport: {
                    width: this.resultWrapper.offsetWidth * 0.8,
                    height: this.resultWrapper.offsetWidth * 0.4,
                    type: 'square'
                },
                boundary: {
                    width: this.resultWrapper.offsetWidth * 0.8,
                    height: this.resultWrapper.offsetWidth * 0.6
                    
                },
                showZoomer:false
            }),
                cropperDisplay: true
            })
        });

        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onloadend = () => {
            this.state.croppie.bind({
                url: reader.result
            });
        }

        reader.readAsDataURL(file);
    }

    saveCroppedImage = () => {
        this.state.croppie.result().then((croppedImage) => {
            this.setState({
                resultImage: 'url("' + croppedImage + '")',
                cropperDisplay: false
            });
        });

        this.state.croppie.destroy();
    }

    cancelCroppedImage = () => {
        this.state.croppie.destroy();

        this.setState({
            cropperDisplay: false
        })
    }

    handleUnitsChange = (event) => {
        this.setState({
            ingredientUnits: event.target.value
        });
    }

    addIngredient = () => {
        if (this.state.ingredientName === '' || this.state.ingredientQuantity === '') return;

        let trimmed = this.state.ingredientName.trim();
        let name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

        let ingredient = {
            ingredientName: name,
            ingredientQuantity: this.state.ingredientQuantity,
            ingredientUnits: this.state.ingredientUnits,
        };

        let ingredients = this.state.recipeIngredients;
        ingredients.push(ingredient);

        this.setState({
            recipeIngredients: ingredients,
            ingredientName: '',
            ingredientQuantity: '',
            ingredientUnits: 'мл'
        });
    }

    cancelIngredient = () => {
        this.setState({
            recipeIngredients: this.state.recipeIngredients,
            ingredientName: '',
            ingredientQuantity: '',
            ingredientUnits: 'мл'
        });
    }

    saveRecipe = () => {
        let hours = this.state.recipeCookHours === '' ? "0" : this.state.recipeCookHours;
        let minutes = this.state.recipeCookMinutes === '' ? '00' : this.state.recipeCookMinutes;
        let portions = this.state.recipePortions === '' ? "1" : this.state.recipePortions;
        let title = this.state.recipeName === '' ? 'Без названия' : this.state.recipeName;

        let newRecipe = {
            id: this.state.recipeId,
            cooktime: {
                hours: hours, 
                minutes: minutes
            }, 
            image: this.state.resultImage,
            ingredients: this.state.recipeIngredients, 
            portions: portions, 
            steps:this.state.recipeDescription, 
            title: title,
            category: this.state.selectedCategory.id
        };

        this.setState({
            recipe: newRecipe
        })

        let recipes = this.props.recipes.array.filter(elem => elem.id !== newRecipe.id);
        recipes.push(newRecipe);
        store.dispatch(addRecipe(recipes));
        db.collection(this.props.login.uid).doc('recipes').set({recipes});
    }

    deleteRecipe = () => {
        let recipes = this.props.recipes.filter(elem => elem.id !== this.state.recipeId);
        store.dispatch(deleteRecipe(recipes));
        db.collection(this.props.login.uid).doc('recipes').set({recipes});
    }

    handleCategoryChange = (category) => {
        this.setState({
            selectedCategory: category
        });

        this.setStatusBarColor(category.color);
    }

    changeIngredient = (i) => {
        let remaining = this.state.recipeIngredients.slice();
        let target = remaining.splice(i, 1)[0];
        this.setState({
            recipeIngredients: remaining,
            ingredientName: target.ingredientName,
            ingredientQuantity: target.ingredientQuantity,
            ingredientUnits: target.ingredientUnits
        });
    }

    render() {
        if (this.state.redirectToHome) return (<Redirect to='/' />);
        if (this.state.redirectToAddCategory) return (<Redirect to={{pathname: "/add-category/c" + Date.now(), state: {fromCategory: false}}} />);

        let categoryColor = this.state.selectedCategory.color;
        let cropperDisplay = this.state.cropperDisplay === true ? "flex" : "none";
        return (
           <div className="wrapper">
            <div className="add-recipe__header header" style={{backgroundColor: categoryColor}} >
                <div className="add-recipe__header-left-menu">
                    <BackButton onClick={this.deleteRecipe} />
                </div>
                <div className="add-recipe__header-title">Добавить рецепт</div>
                <div className="add-recipe__header-right-menu" onClick={this.saveRecipe}>
                    <Link 
                        className="confirm-btn" 
                        to={"/recipe/" + this.state.recipeId}
                    />
                </div>
            </div>
            <div className="add-recipe__scroll">
                <div className="add-recipe__add-picture-wrapper" ref={resultWrapper => {this.resultWrapper = resultWrapper}} style={{backgroundImage: this.state.resultImage}} >
                    <label className="add-recipe__add-picture-icon">
                        <input type="file" className="add-recipe__add-picture-input" onChange={this.handleFileUpload} />
                    </label>
                    <div className="add-recipe__add-picture-text">Добавить фотографию</div>
                </div>
                <div 
                    className="change-recipe__image-cropper-wrapper" 
                    style={{display: cropperDisplay, width: this.state.width, height: 'calc(' + this.state.height + ' + 8vh)'}}>
                    <div 
                        className="change-recipe__cropper" 
                        ref={croppie => {this.croppie = croppie}} 
                        style={{width: this.state.width, height: this.state.height}}>
                    </div>
                    <div className="change-recipe__image-cropper-buttons-wrapper" style={{backgroundColor: categoryColor, width: this.state.width}} >
                        <a className="change-recipe__image-cropper-btn image-cropper-cancel-btn" onClick={this.cancelCroppedImage}>Отменить</a>
                        <a className="change-recipe__image-cropper-btn image-cropper-confirm-btn" onClick={this.saveCroppedImage}>Сохранить</a>
                    </div>
                </div>
                <div className="body add-recipe__body">
                    <div className="add-recipe__body-section">
                        <div className="add-recipe__body-section-title">Название рецепта</div>
                        <input className="add-recipe__body-section-input" 
                            onFocus={this.preventWindowFromResize} 
                            value={this.state.recipeName} 
                            onChange={this.handleInputChange} 
                            type="text" 
                            name="recipeName" 
                            placeholder="например, торт 'Наполеон'" 
                        />
                    </div>
                    <div className="add-recipe__body-section">
                        <div className="add-recipe__body-section-title">Категория</div>
                        <CategoriesDropDown 
                            handleCategoryChange={this.handleCategoryChange} 
                            categories={this.state.categories}
                            selectedCategory={this.state.selectedCategory}
                            saveTempData={this.saveTempData}
                            saveRecipe={this.saveRecipe}
                            recipe={this.state.recipe}
                        />
                    </div>
                    <div className="add-recipe__body-section">
                        <div className="add-recipe__cooktime-portions-wrapper">
                            <div className="add-recipe__cooktime-wrapper">
                                <div className="add-recipe__body-section-title">Время приготовления</div>
                                <div className="add-recipe__cooktime-inputs-wrapper">
                                    <label><input 
                                        className="add-recipe__cooktime-input" 
                                        onFocus={this.preventWindowFromResize} 
                                        value={this.state.recipeCookHours} 
                                        onChange={this.handleInputChange} 

                                        type="number" 
                                        name="recipeCookHours" 
                                        placeholder="00" 
                                    /> час</label>
                                    <label><input 
                                        className="add-recipe__cooktime-input" 
                                        onFocus={this.preventWindowFromResize} 
                                        value={this.state.recipeCookMinutes} 
                                        onChange={this.handleInputChange} 
                                        type="number" 
                                        name="recipeCookMinutes" 
                                        placeholder="30" /> мин</label>
                                </div>
                            </div>
                            <div className="add-recipe__portions-wrapper">
                                <div className="add-recipe__body-section-title">Порции</div>
                                <input 
                                    className="add-recipe__portions-input" 
                                    onFocus={this.preventWindowFromResize} 
                                    value={this.state.recipePortions} 
                                    onChange={this.handleInputChange} 
                                    type="number" 
                                    name="recipePortions" 
                                    placeholder="1" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="add-recipe__body-section">
                        <div className="add-recipe__body-section-header">
                            <div className="add-recipe__body-section-title">Ингредиенты</div>
                            <div className="change-recipe__add-ingredient-btn-wrapper">
                                <div 
                                    className="change-recipe__add-ingredient-btn" 
                                    onClick={this.addIngredient} 
                                    style={{backgroundColor: this.state.selectedCategory.color}}>
                                </div>
                                <div 
                                    className="change-recipe__delete-ingredient-btn"
                                    onClick={this.cancelIngredient}>
                                </div>
                            </div>
                        </div>
                        <IngredientsList 
                            recipeIngredients={this.state.recipeIngredients}
                            changeIngredient={this.changeIngredient}
                        />
                        <div className="add-recipe__subsections-wrapper">
                            <div className="add-recipe__subsection-ingredients">
                                <div className="add-recipe__ingredient-input-wrapper">
                                    <input 
                                        className="add-recipe__ingredient-input ingredient-name" 
                                        onFocus={this.preventWindowFromResize} 
                                        value={this.state.ingredientName} 
                                        onChange={this.handleInputChange} 
                                        type="text" 
                                        name="ingredientName" 
                                        placeholder="например, 'яйца'" 
                                    />
                                </div>  
                                    <span className="add-recipe__ingredient-divider">-</span>
                                    <input 
                                        className="add-recipe__ingredient-input ingredient-quantity" 
                                        type="number" 
                                        name="ingredientQuantity" 
                                        value={this.state.ingredientQuantity} 
                                        onChange={this.handleInputChange} 
                                        onFocus={this.preventWindowFromResize} 
                                        placeholder="0" 
                                    />
                            </div>
                            <div className="add-recipe__subsection-units">
                                <input
                                    style={{backgroundColor: this.state.ingredientUnits === 'мл' ? categoryColor : "#c1c1c1"}}
                                    className="add-recipe__ingredient-unit unit-ml" 
                                    type="radio" 
                                    name="ingredientUnits" 
                                    value="мл" 
                                    checked={this.state.ingredientUnits === 'мл'} 
                                    onChange={this.handleUnitsChange}
                                />
                                <input 
                                    style={{backgroundColor: this.state.ingredientUnits === 'гр' ? categoryColor : "#c1c1c1"}}
                                    className="add-recipe__ingredient-unit unit-gr" 
                                    type="radio" 
                                    name="ingredientUnits" 
                                    value="гр" 
                                    checked={this.state.ingredientUnits === 'гр'} 
                                    onChange={this.handleUnitsChange} 
                                />
                                <input 
                                    style={{backgroundColor: this.state.ingredientUnits === 'шт' ? categoryColor : "#c1c1c1"}}
                                    className="add-recipe__ingredient-unit unit-item" 
                                    type="radio" 
                                    name="ingredientUnits" 
                                    value="шт" 
                                    checked={this.state.ingredientUnits === 'шт'} 
                                    onChange={this.handleUnitsChange} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="add-recipe__body-section">
                        <div className="add-recipe__body-section-title">Способ приготовления</div>
                        <textarea 
                            className="add-recipe__body-section-textarea" 
                            onFocus={this.preventWindowFromResize} 
                            value={this.state.recipeDescription} 
                            onChange={this.handleInputChange} 
                            type="text" rows="6" 
                            name="recipeDescription" 
                            placeholder="Отделите белки от желтков. Желтки взбейте. Белки смешайте с сахаром. Добавьте разрыхлитель в муку. Медленно вмешивайте муку в яйца." 
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(AddRecipe);
