import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";
import Croppie from "croppie";


import CategoriesDropDown from './categoriesDropDown';
import BackButton from "./backButton";
//import ConfirmButton from "./confirmButton";
import { asyncLocalStorage } from "../utils/asyncLocalStorage";
//import settings from "../config";


import store from "../store/store";
import { addRecipe/*, deleteRecipe*/ } from "../ducks/recipes";
//import { addCategory, deleteCategory } from "../ducks/categories";
import { changeCategory/*, resetCategory*/ } from "../ducks/selected-category";
import { saveTempData/*, resetTempData*/ } from "../ducks/temp-data";


const mapStateToProps = state => {
    return {
         recipes: state.recipes,
         categories: state.categories,
         selectedCategory: state.selectedCategory,
         tempData: state.tempData
    };
};


let ratio = window.innerWidth/window.innerHeight;

const IngredientsList = (props) => {
    return (
        <li className="change-recipe__added-ingredient-item">
            {props.recipeIngredients.map((elem, index) => (
                <div key={index}>
                    <span className="ingredient-item-name">{elem.ingredientName}</span>
                    <span> - </span>
                    <span className="ingredient-item-quantity">{elem.ingredientQuantity}</span>
                    <span> </span>
                    <span className="ingredient-item-unit">{elem.ingredientUnits}</span>
                </div>
            ))}
        </li> 
    )
}

class ChangeRecipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cropperDisplay: false,
            resultImage: this.props.tempData.data.image,
            recipeId: this.props.tempData.data.id,
            recipeName: this.props.tempData.data.title,
            recipeCookHours: this.props.tempData.data.cooktime.hours,
            recipeCookMinutes: this.props.tempData.data.cooktime.minutes,
            recipePortions: this.props.tempData.data.portions,
            recipeDescription: this.props.tempData.data.steps,
            ingredientName: '',
            ingredientQuantity: '',
            ingredientUnits: 'мл',
            recipeIngredients: this.props.tempData.data.ingredients,
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            selectedCategory: this.props.categories.array.filter(elem => elem.id === this.props.tempData.data.category)[0],
            croppie: ""
        };

    }

    componentDidMount = () => {
        store.dispatch(changeCategory(this.state.selectedCategory));
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
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
        this.croppie.style.width = this.resultWrapper.offsetWidth * 0.8 + 'px';
        this.croppie.style.height = this.resultWrapper.offsetWidth * 0.8 + 'px';

        this.setState({
            croppie: new Croppie(this.croppie, {
                viewport: {
                    width: this.resultWrapper.offsetWidth * 0.8,
                    height: this.resultWrapper.offsetHeight * 0.8
                },
                boundary: {
                    width: this.resultWrapper.offsetWidth * 0.8,
                    height: this.resultWrapper.offsetWidth * 0.8
                    
                },
                showZoomer:false
            })
        });

        this.setState({
            cropperDisplay: true
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
        let ingredient = {
            ingredientName: this.state.ingredientName,
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

    saveTempData = () => {
        //let image = (this.state.resultImage === '') ? 'url(' + settings.defaultCategory.icon + ')' : this.state.resultImage

        let tempData = {
            id: this.state.recipeId,
            cooktime: {
                hours: this.state.recipeCookHours, 
                minutes: this.state.recipeCookMinutes}, 
            image: this.state.resultImage,
            ingredients: this.state.recipeIngredients, 
            portions: this.state.recipePortions, 
            steps:this.state.recipeDescription, 
            title: this.state.recipeName,
            category: this.state.selectedCategory.id
        };

        store.dispatch(saveTempData(tempData));
    }

    saveRecipe = () => {
        let recipes = this.props.recipes.array;
        //let image = (this.state.resultImage === '') ? 'url(' + settings.defaultCategory.icon + ')' : this.state.resultImage

        let updatedRecipe = {
            id: this.state.recipeId,
            cooktime: {
                hours: this.state.recipeCookHours, 
                minutes: this.state.recipeCookMinutes
            }, 
            image: this.state.resultImage,
            ingredients: this.state.recipeIngredients, 
            portions: this.state.recipePortions, 
            steps:this.state.recipeDescription, 
            title: this.state.recipeName,
            category: this.state.selectedCategory.id
        };

        let array = recipes.filter(elem => elem.id !== updatedRecipe.id);
        array.push(updatedRecipe);
        store.dispatch(addRecipe(array));
        asyncLocalStorage.setItem('recipes', array);
    }

    handleCategoryChange = (category) => {
        store.dispatch(changeCategory(category));
        this.setState({
            selectedCategory: category
        })
    }

    render() {
        let categoryColor = this.state.selectedCategory.color;
        let cropperDisplay = this.state.cropperDisplay === true ? "flex" : "none";
        return (
           <div className="wrapper">
            <div className="change-recipe__header header" style={{backgroundColor: categoryColor}} >
                <div className="change-recipe__header-left-menu">
                    <BackButton />
                    
                </div>
                <div className="change-recipe__header-title">Изменить рецепт</div>
                <div className="change-recipe__header-right-menu" onClick={this.saveRecipe}>
                   <Link 
                        className="confirm-btn" 
                        to= {
                                {
                                    pathname: "/recipe", 
                                    state: {
                                        recipe: {
                                            id: this.state.recipeId,
                                            cooktime: {
                                                hours: this.state.recipeCookHours, 
                                                minutes: this.state.recipeCookMinutes
                                            }, 
                                            image: (this.state.resultImage === '') ? '' : this.state.resultImage,
                                            ingredients: this.state.recipeIngredients, 
                                            portions: this.state.recipePortions, 
                                            steps:this.state.recipeDescription, 
                                            title: this.state.recipeName,
                                            category: this.state.selectedCategory.id
                                        }
                                    }
                                }
                            }
                    />
                </div>
            </div>
            <div className="change-recipe__add-picture-wrapper" ref={resultWrapper => {this.resultWrapper = resultWrapper}} style={{backgroundImage: this.state.resultImage}} >
                <label className="change-recipe__add-picture-icon">
                    <input type="file" className="change-recipe__add-picture-input" onChange={this.handleFileUpload} />
                </label>
                <div className="change-recipe__add-picture-text">Изменить фотографию</div>
            </div>
            <div className="change-recipe__image-cropper-wrapper" ref={croppieWrapper => {this.croppieWrapper = croppieWrapper}} style={{display: cropperDisplay}}>
                <div className="change-recipe__image-cropper" ref={croppie => {this.croppie = croppie}} ></div>
                <div className="change-recipe__image-cropper-buttons-wrapper" style={{backgroundColor: categoryColor}} >
                    <a className="change-recipe__image-cropper-btn image-cropper-cancel-btn" onClick={this.cancelCroppedImage}>Отменить</a>
                    <a className="change-recipe__image-cropper-btn image-cropper-confirm-btn" onClick={this.saveCroppedImage}>Сохранить</a>
                </div>
            </div>
            <div className="body change-recipe__body">
                <div className="change-recipe__body-section">
                    <div className="change-recipe__body-section-title">Название рецепта</div>
                    <input className="change-recipe__body-section-input" 
                        onFocus={this.preventWindowFromResize} 
                        value={this.state.recipeName} 
                        onChange={this.handleInputChange} 
                        type="text" 
                        name="recipeName" 
                        placeholder="например, торт 'Наполеон'" 
                    />
                </div>
                <div className="change-recipe__body-section">
                    <div className="change-recipe__body-section-title">Категория</div>
                    <CategoriesDropDown 
                        handleCategoryChange={this.handleCategoryChange} 
                        categories={this.state.categories}
                        selectedCategory={this.state.selectedCategory}
                        temp={this.state.temp}
                        saveTempData={this.saveTempData}
                    />
                </div>
                <div className="change-recipe__body-section">
                    <div className="change-recipe__cooktime-portions-wrapper">
                        <div className="change-recipe__cooktime-wrapper">
                            <div className="change-recipe__body-section-title">Время приготовления</div>
                            <div className="change-recipe__cooktime-inputs-wrapper">
                                <label><input 
                                    className="change-recipe__cooktime-input" 
                                    onFocus={this.preventWindowFromResize} 
                                    value={this.state.recipeCookHours} 
                                    onChange={this.handleInputChange} 

                                    type="number" 
                                    name="recipeCookHours" 
                                    placeholder="00" 
                                /> час</label>
                                <label><input 
                                    className="change-recipe__cooktime-input" 
                                    onFocus={this.preventWindowFromResize} 
                                    value={this.state.recipeCookMinutes} 
                                    onChange={this.handleInputChange} 
                                    type="number" 
                                    name="recipeCookMinutes" 
                                    placeholder="30" /> мин</label>
                            </div>
                        </div>
                        <div className="change-recipe__portions-wrapper">
                            <div className="change-recipe__body-section-title">Порции</div>
                            <input 
                                className="change-recipe__portions-input" 
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
                <div className="change-recipe__body-section">
                    <div className="change-recipe__body-section-header">
                        <div className="change-recipe__body-section-title">Ингредиенты</div>
                        <div className="change-recipe__add-ingredient-btn-wrapper">
                            <div 
                                className="change-recipe__add-ingredient-btn" 
                                onClick={this.addIngredient} 
                                style={{backgroundColor: this.state.selectedCategory.color}}>
                            </div>
                            <div className="change-recipe__delete-ingredient-btn"></div>
                        </div>
                    </div>
                    <ul className="change-recipe__added-ingredients">
                        <IngredientsList recipeIngredients={this.state.recipeIngredients} />
                    </ul>
                    <div className="change-recipe__subsections-wrapper">
                        <div className="change-recipe__subsection-ingredients">
                            <div className="change-recipe__ingredient-input-wrapper">
                                <input 
                                    className="change-recipe__ingredient-input ingredient-name" 
                                    onFocus={this.preventWindowFromResize} 
                                    value={this.state.ingredientName} 
                                    onChange={this.handleInputChange} 
                                    type="text" 
                                    name="ingredientName" 
                                    placeholder="например, 'яйца'" 
                                />
                                <ul className="change-recipe__ingredient-hint-list"></ul>
                            </div>  
                                <span className="change-recipe__ingredient-divider">-</span>
                                <input 
                                    className="change-recipe__ingredient-input ingredient-quantity" 
                                    type="number" 
                                    name="ingredientQuantity" 
                                    value={this.state.ingredientQuantity} 
                                    onChange={this.handleInputChange} 
                                    onFocus={this.preventWindowFromResize} 
                                    placeholder="0" 
                                />
                        </div>
                        <div className="change-recipe__subsection-units">
                            <input
                                style={{backgroundColor: this.state.ingredientUnits === 'мл' ? categoryColor : "#c1c1c1"}}
                                className="change-recipe__ingredient-unit unit-ml" 
                                type="radio" 
                                name="ingredientUnits" 
                                value="мл" 
                                checked={this.state.ingredientUnits === 'мл'} 
                                onChange={this.handleUnitsChange}
                            />
                            <input 
                                style={{backgroundColor: this.state.ingredientUnits === 'гр' ? categoryColor : "#c1c1c1"}}
                                className="change-recipe__ingredient-unit unit-gr" 
                                type="radio" 
                                name="ingredientUnits" 
                                value="гр" 
                                checked={this.state.ingredientUnits === 'гр'} 
                                onChange={this.handleUnitsChange} 
                            />
                            <input 
                                style={{backgroundColor: this.state.ingredientUnits === 'шт' ? categoryColor : "#c1c1c1"}}
                                className="change-recipe__ingredient-unit unit-item" 
                                type="radio" 
                                name="ingredientUnits" 
                                value="шт" 
                                checked={this.state.ingredientUnits === 'шт'} 
                                onChange={this.handleUnitsChange} 
                            />
                        </div>
                    </div>
                </div>
                <div className="change-recipe__body-section">
                    <div className="change-recipe__body-section-title">Способ приготовления</div>
                    <textarea 
                        className="change-recipe__body-section-textarea" 
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
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(ChangeRecipe);
