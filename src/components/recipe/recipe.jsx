import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

//components
import HeaderMenu from "./headerMenu";
import PopUp from "./popUp";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";
import { recipesToIngredients } from "../../utils/recipesToIngredients";

//store
import store from "../../store/store";
import { deleteRecipe } from "../../ducks/recipes";
import { updateMenu } from "../../ducks/menu";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu,
        login: state.login
    };
};

class Recipe extends Component {
    constructor(props) {
        super(props);

        let id = this.props.location.pathname.split("/recipe/").pop();

        this.state = {
            sideMenu: false,
            startButton: true,
            headerMenu: false,
            redirect: false,
            redirectTo: "/",
            recipe: this.props.recipes.array.filter(elem => elem.id === id)[0],
            isInMenu:
                this.props.menu.recipes
                    .map(elem => (elem = elem.id))
                    .indexOf(id) !== -1
                    ? true
                    : false,
            sharePopup: false,
            popUpUrl: "",
            spinner: false
        };
    }

    componentWillMount = () => {
        if (this.state.recipe === undefined) {
            this.setState({
                redirect: true,
                redirectTo: "/"
            });
        } else {
            this.setState(
                {
                    selectedCategory: this.props.categories.array.filter(
                        elem => elem.id === this.state.recipe.category
                    )[0]
                },
                () => this.setStatusBarColor(this.state.selectedCategory.color)
            );
        }
    };

    setStatusBarColor = color => {
        document
            .querySelector("meta[name=theme-color]")
            .setAttribute("content", color);
    };

    addStyle = item => {
        if (item)
            return {
                backgroundImage:
                    item.image === ""
                        ? "url(" + settings.defaultCategory.icon + ")"
                        : item.image,
                backgroundSize: item.image === "" ? "50%" : "cover"
            };
    };

    toggleSideMenu = () => {
        this.setState({
            sideMenu: !this.state.sideMenu,
            startButton: !this.state.startButton
        });
    };

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu
        });
    };

    deleteRecipe = () => {
        let recipes = this.props.recipes.array.filter(elem => {
            return elem.id !== this.state.recipe.id;
        });
        store.dispatch(deleteRecipe(recipes));
        db
            .collection("users/" + this.props.login.uid + "/recipes")
            .doc(this.state.recipe.id)
            .delete();

        let indices = recipes.map(elem => (elem = elem.id));
        let menuRecipes = this.props.menu.recipes.filter(
            elem => indices.indexOf(elem.id) !== -1
        );

        if (this.state.isInMenu) {
            let menu = {
                recipes: menuRecipes,
                ingredients: recipesToIngredients(menuRecipes)
            };
            store.dispatch(updateMenu(menuRecipes));

            db
                .collection("users/" + this.props.login.uid + "/menu")
                .doc("menu")
                .set({ menu });
        }
    };

    handleRecipeMenuToggle = () => {
        Promise.resolve()
            .then(() => {
                let menuRecipes = this.props.menu.recipes;

                if (!this.state.isInMenu) {
                    menuRecipes.push(this.state.recipe);
                } else {
                    menuRecipes = this.props.menu.recipes.filter(
                        elem => elem.id !== this.state.recipe.id
                    );
                }

                let menu = {
                    recipes: menuRecipes,
                    ingredients: recipesToIngredients(menuRecipes)
                };

                store.dispatch(updateMenu(menuRecipes));
                db
                    .collection("users/" + this.props.login.uid + "/menu")
                    .doc("menu")
                    .set({ menu });
            })
            .then(() => {
                this.setState({
                    redirect: true,
                    redirectTo: "/menu"
                });
            });
    };

    shareRecipe = () => {
        let random = this.props.login.uid.substr(0, 10);
        let doc = random + this.state.recipe.id;

        let recipe = {
            id: doc,
            cooktime: {
                hours: this.state.recipe.cooktime.hours,
                minutes: this.state.recipe.cooktime.minutes
            },
            image: this.state.recipe.image,
            ingredients: this.state.recipe.ingredients,
            portions: this.state.recipe.portions,
            steps: this.state.recipe.steps,
            title: this.state.recipe.title,
            category: ""
        };

        let url = "https://alesiagit.github.io/cookbook/#/shared/" + doc;

        db
            .collection("shared")
            .doc(doc)
            .set({ recipe: recipe });

        this.setState({
            sharePopup: true,
            popUpUrl: url
        });
    };

    toggleSharePopup = () => {
        this.setState({
            sharePopup: false,
            popUpUrl: ""
        });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;

        let headerMenuVisibility = this.state.headerMenu ? "flex" : "none";
        let menuStatus = this.state.isInMenu
            ? "Удалить из меню"
            : "Добавить в меню";

        return (
            <div className="wrapper" onClick={this.hideHeaderMenu}>
                <div
                    className="recipe__header header"
                    style={this.addStyle(this.state.recipe)}
                >
                    <div className="recipe__menu-wrapper">
                        <div className="recipe__header-left-menu">
                            <Link
                                className="back-btn"
                                to={"/category/" + this.state.recipe.category}
                            />
                        </div>
                        <div className="recipe__header-right-menu">
                            <div
                                className="recipe__header-share-btn"
                                onClick={this.shareRecipe}
                            />
                            <div
                                className="recipe__header-menu-btn dots-menu-btn"
                                onClick={this.toggleHeaderMenu}
                            />
                        </div>
                    </div>
                    <div className="recipe__title">
                        {this.state.recipe.title}
                    </div>
                </div>
                <div
                    className="recipe__category-wrapper"
                    style={{
                        backgroundColor: this.state.selectedCategory.color
                    }}
                >
                    <div
                        className="recipe__category-icon"
                        style={{
                            backgroundImage:
                                "url(" + this.state.selectedCategory.icon + ")"
                        }}
                    />
                    <div className="recipe__category-name">
                        {this.state.selectedCategory.name}
                    </div>
                </div>
                <div className="recipe__info-wrapper">
                    <div className="recipe__headings">
                        <div className="recipe__cooktime-heading">
                            Время приготовления
                        </div>
                        <div className="recipe__portions-heading">
                            Количество порций
                        </div>
                    </div>
                    <div className="recipe__info">
                        <div className="recipe__cooktime">
                            {this.state.recipe.cooktime.hours} час{" "}
                            {this.state.recipe.cooktime.minutes} мин
                        </div>
                        <div className="recipe__portions">
                            {this.state.recipe.portions} чел
                        </div>
                    </div>
                </div>
                <div className="recipe__block-wrapper">
                    <div
                        className="recipe__block-title"
                        style={{ color: this.state.selectedCategory.color }}
                    >
                        Ингредиенты
                    </div>
                    <ul className="recipe__block-list">
                        {this.state.recipe.ingredients.map((elem, index) => (
                            <li key={index}>
                                {elem.ingredientName} -{" "}
                                {elem.ingredientQuantity} {elem.ingredientUnits}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="recipe__block-wrapper">
                    <div
                        className="recipe__block-title"
                        style={{ color: this.state.selectedCategory.color }}
                    >
                        Способ приготовления
                    </div>
                    <div className="recipe__block-text">
                        {this.state.recipe.steps}
                    </div>
                </div>
                <HeaderMenu
                    display={headerMenuVisibility}
                    toggleHeaderMenu={this.toggleHeaderMenu}
                    deleteRecipe={this.deleteRecipe}
                    recipe={this.state.recipe}
                    menuStatus={menuStatus}
                    handleRecipeMenuToggle={this.handleRecipeMenuToggle}
                />
                <PopUp
                    url={this.state.popUpUrl}
                    display={this.state.sharePopup}
                    toggleSharePopup={this.toggleSharePopup}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Recipe);
