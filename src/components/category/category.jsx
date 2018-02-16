import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

//components
import Drawer from "./drawer";
import RecipesList from "./recipesList";
import HeaderMenu from "./headerMenu";

//utils
import { db } from "../../utils/firebase";
import { recipesToIngredients } from "../../utils/recipesToIngredients";

//store
import store from "../../store/store";
import { deleteCategory } from "../../ducks/categories";
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

class Category extends Component {
    constructor(props) {
        super(props);

        let id = this.props.location.pathname.split("/category/").pop();

        this.state = {
            value: "",
            drawer: false,
            startButton: true,
            headerMenu: false,
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            id: id,
            selectedCategory: this.props.categories.array.filter(
                elem => elem.id === id
            )[0],
            selectedCategoryRecipes: this.props.recipes.array.filter(
                elem => elem.category === id
            ),
            redirect: false,
            redirectTo: "/"
        };
    }

    componentWillMount = () => {
        if (!this.state.selectedCategory)
            return this.setState({
                redirect: true,
                redirectTo: "/"
            });
        this.setState({
            ratio: window.innerWidth / window.innerHeight
        });
        this.setStatusBarColor(this.state.selectedCategory.color);
    };

    componentWillReceiveProps = nextProps => {
        let id = nextProps.location.pathname.split("/category/").pop();
        if (this.state.id !== id) {
            this.setState(
                {
                    drawer: false,
                    startButton: true,
                    headerMenu: false,
                    id: id,
                    selectedCategory: this.props.categories.array.filter(
                        elem => elem.id === id
                    )[0],
                    selectedCategoryRecipes: this.props.recipes.array.filter(
                        elem => elem.category === id
                    )
                },
                () => {
                    this.setStatusBarColor(this.state.selectedCategory.color);
                }
            );
        }
    };

    setStatusBarColor = color => {
        document
            .querySelector("meta[name=theme-color]")
            .setAttribute("content", color);
    };

    preventWindowFromResize = () => {
        document
            .querySelector("meta[name=viewport]")
            .setAttribute(
                "content",
                "width=device-width, height=" +
                    window.innerWidth / this.state.ratio +
                    ", user-scalable=no, initial-scale=1.0, maximum-scale=1.0"
            );
    };

    toggleDrawer = () => {
        this.setState({
            drawer: !this.state.drawer,
            startButton: !this.state.startButton
        });
    };

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu
        });
    };

    drawCategoryIcon = category => {
        return {
            WebkitMaskImage: "url(" + category.icon + ")",
            backgroundColor: category.color
        };
    };

    writeRecipesCount = id => {
        let count = 0;

        this.state.recipes.forEach(item => {
            if (item.category === id) return count++;
        });

        return this.correctlyWrite(count);
    };

    correctlyWrite = number => {
        if (number % 10 === 1) return number + " рецепт";
        if (number % 10 > 1 && number % 10 < 5 && number > 20)
            return number + " рецепта";
        if (number > 1 && number < 5) return number + " рецепта";
        return number + " рецептов";
    };

    deleteCategory = category => {
        let categories = this.props.categories.array.filter(
            elem => elem.id !== category.id
        );
        let recipes = this.props.recipes.array.filter(
            elem => elem.category !== category.id
        );

        Promise.resolve()
            .then(() => {
                let recipesIndices = this.props.recipes.array
                    .filter(elem => elem.category === category.id)
                    .map(elem => (elem = elem.id));
                recipesIndices.forEach(elem => {
                    db
                        .collection(
                            "users/" + this.props.login.uid + "/recipes"
                        )
                        .doc(elem)
                        .delete();
                });
                store.dispatch(deleteRecipe(recipes));

                db
                    .collection("users/" + this.props.login.uid + "/categories")
                    .doc("categories")
                    .set({ categories });
                store.dispatch(deleteCategory(categories));

                let indices = categories.map(elem => (elem = elem.id));
                let menuRecipes = this.props.menu.recipes.filter(
                    elem => indices.indexOf(elem.category) !== -1
                );

                if (menuRecipes.length < this.props.menu.recipes.length) {
                    let menu = {
                        recipes: menuRecipes,
                        ingredients: recipesToIngredients(menuRecipes)
                    };

                    db
                        .collection("users/" + this.props.login.uid + "/menu")
                        .doc("menu")
                        .set({ menu });
                    store.dispatch(updateMenu(recipes));
                }
            })
            .then(() => {
                if (category.id === this.state.selectedCategory.id) {
                    this.setState({
                        redirect: true,
                        redirectTo: "/"
                    });
                } else {
                    this.setState(
                        {
                            categories: categories,
                            recipes: recipes,
                            headerMenu: false,
                            selectedCategory: categories.filter(
                                elem => elem.id === this.state.id
                            )[0],
                            selectedCategoryRecipes: recipes.filter(
                                elem => elem.category === this.state.id
                            ),
                            redirect: false
                        },
                        () => console.log(store.getState())
                    );
                }
            });
    };

    handleInput = event => {
        let search = event.target.value;

        this.setState({
            selectedCategoryRecipes: this.state.recipes.filter(
                elem =>
                    elem.title.toLowerCase().indexOf(search.toLowerCase()) >=
                        0 && elem.category === this.state.id
            ),
            value: search
        });
    };

    resetInput = () => {
        this.setState({
            selectedCategoryRecipes: this.props.recipes.array.filter(
                elem => elem.category === this.state.id
            ),
            value: ""
        });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;

        let categoryColor = this.state.selectedCategory.color;
        let drawerVisibility = this.state.drawer ? "flex" : "none";
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";
        let startButtonImage = this.state.startButton
            ? "start-menu-btn"
            : "return-menu-btn";

        return (
            <div className="wrapper" onClick={this.hideHeaderMenu}>
                <div
                    className="category__header header"
                    style={{ backgroundColor: categoryColor }}
                >
                    <div className="category__header-left-menu">
                        <div
                            className={
                                "category__header-menu-btn " + startButtonImage
                            }
                            onClick={this.toggleDrawer}
                        />
                    </div>
                    <div className="category__header-right-menu">
                        <input
                            onFocus={this.preventWindowFromResize}
                            className="category__header-search-field"
                            onChange={this.handleInput}
                            value={this.state.value}
                        />
                        <div
                            className="category__header-menu-btn dots-menu-btn"
                            onClick={this.toggleHeaderMenu}
                        />
                    </div>
                </div>
                <div className="category__body">
                    <div className="category__title">
                        <div className="category__selected">
                            <div
                                className="category__selected-icon"
                                style={this.drawCategoryIcon(
                                    this.state.selectedCategory
                                )}
                            />
                            <div
                                className="category__selected-title"
                                style={{ color: categoryColor }}
                            >
                                {this.state.selectedCategory.name}
                            </div>
                        </div>
                        <div className="category__items-count-wrapper">
                            <div
                                className="category__items-count"
                                style={{ backgroundColor: categoryColor }}
                            >
                                {this.writeRecipesCount(
                                    this.state.selectedCategory.id
                                )}
                            </div>
                        </div>
                    </div>
                    <RecipesList
                        recipes={this.state.selectedCategoryRecipes}
                        color={categoryColor}
                        categories={this.state.categories}
                    />
                    <Link
                        className="category__add-recipe-btn"
                        style={{ backgroundColor: categoryColor }}
                        to={{
                            pathname: "/add-recipe/r" + Date.now(),
                            state: { categoryId: this.state.id }
                        }}
                    />
                </div>
                <HeaderMenu
                    headerMenuDisplay={headerMenuDisplay}
                    toggleHeaderMenu={this.toggleHeaderMenu}
                    id={this.state.id}
                    selectedCategory={this.state.selectedCategory}
                    deleteCategory={this.deleteCategory}
                    logOut={this.logOut}
                    category={this.state.selectedCategory}
                />
                <Drawer
                    id={this.state.id}
                    drawerDisplay={drawerVisibility}
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

export default connect(mapStateToProps)(Category);
