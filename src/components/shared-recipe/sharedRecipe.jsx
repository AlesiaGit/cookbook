import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import ReactSpinner from "react16-spinjs";

//components
import HeaderMenu from "./headerMenu";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";

const mapStateToProps = state => {
    return {
        login: state.login
    };
};

class SharedRecipe extends Component {
    constructor(props) {
        super(props);

        let id = this.props.location.pathname.split("/shared/").pop();

        let initialRecipe = {
            id: id,
            cooktime: {
                hours: "0",
                minutes: "00"
            },
            image: "",
            ingredients: [],
            portions: "1",
            steps: "",
            title: "Новый рецепт",
            category: "external"
        };

        let initialCategory = {
            color: settings.defaultCategory.color,
            icon: settings.defaultCategory.icon,
            id: "external",
            name: "Внешние"
        };

        this.state = {
            sharedId: id,
            redirect: false,
            recipe: initialRecipe,
            category: initialCategory,
            headerMenu: false,
            redirectTo: "/"
        };

        this.setStatusBarColor();
    }

    componentWillMount = () => {
        if (this.props.login.uid === "undefined")
            return this.setState({ redirect: true });

        this.setState({
            spinner: true
        });

        db
            .collection("shared")
            .doc(this.state.sharedId)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({
                        recipe: doc.data().recipe,
                        spinner: false
                    });
                } else {
                    this.setState({
                        redirect: true,
                        spinner: false
                    });
                }
            });
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

    setStatusBarColor = color => {
        document
            .querySelector("meta[name=theme-color]")
            .setAttribute("content", settings.defaultCategory.color);
    };

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu
        });
    };

    saveSharedRecipe = () => {
        let recipe = {
            id: this.state.recipe.id,
            cooktime: {
                hours: this.state.recipe.cooktime.hours,
                minutes: this.state.recipe.cooktime.minutes
            },
            image: this.state.recipe.image,
            ingredients: this.state.recipe.ingredients,
            portions: this.state.recipe.portions,
            steps: this.state.recipe.steps,
            title: this.state.recipe.title,
            category: "external"
        };

        this.setState({
            redirect: true,
            redirectTo: {
                pathname: "/",
                state: {
                    sharedRecipe: recipe,
                    sharedCategory: this.state.category
                }
            }
        });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
        let spinner = this.state.spinner ? "block" : "none";
        let headerMenuVisibility = this.state.headerMenu ? "flex" : "none";

        return (
            <div className="wrapper">
                <div
                    className="recipe__header header"
                    style={this.addStyle(this.state.recipe)}
                >
                    <div className="recipe__menu-wrapper">
                        <div className="recipe__header-left-menu">
                            <Link className="back-btn" to="/" />
                        </div>
                        <div
                            className="recipe__header-right-menu"
                            style={{ justifyContent: "flex-end" }}
                        >
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
                    style={{ backgroundColor: settings.defaultCategory.color }}
                >
                    <div
                        className="recipe__category-icon"
                        style={{
                            backgroundImage:
                                "url(" + settings.defaultCategory.icon + ")"
                        }}
                    />
                    <div className="recipe__category-name">Внешний рецепт</div>
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
                        style={{ color: settings.defaultCategory.color }}
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
                        style={{ color: settings.defaultCategory.color }}
                    >
                        Способ приготовления
                    </div>
                    <div className="recipe__block-text">
                        {this.state.recipe.steps}
                    </div>
                </div>
                <div
                    className="shared-recipe__wrapper-semitransparent-cover"
                    style={{ display: spinner }}
                >
                    <div className="spinner-wrapper">
                        <ReactSpinner
                            config={{ scale: 1.5, width: 4, color: "#ffffff" }}
                        />
                    </div>
                </div>
                <HeaderMenu
                    display={headerMenuVisibility}
                    toggleHeaderMenu={this.toggleHeaderMenu}
                    saveSharedRecipe={this.saveSharedRecipe}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(SharedRecipe);
