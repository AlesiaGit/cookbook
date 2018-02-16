import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import ReactSpinner from "react16-spinjs";

//components
import Drawer from "./drawer";
import RecipesList from "./recipesList";

//utils
import settings from "../../config";
import { auth, db } from "../../utils/firebase";
import { recipesToIngredients } from "../../utils/recipesToIngredients";

//store
import store from "../../store/store";
import { addCategory, deleteCategory } from "../../ducks/categories";
import { addRecipe, deleteRecipe } from "../../ducks/recipes";
import { updateMenu, updateIngredients } from "../../ducks/menu";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu,
        login: state.login
    };
};

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: settings.defaultCategory.id,
            value: "",
            drawer: false,
            startButton: true,
            headerMenu: false,
            categories: this.props.categories.array,
            recipes: this.props.recipes.array,
            selectedCategory: settings.defaultCategory,
            redirect: false,
            spinner: false,
            ratio: window.innerWidth / window.innerHeight,
            redirectTo: "/"
        };
    }

    componentWillMount = () => {
        if (this.props.login.uid === "undefined")
            return this.setState({
                redirect: true,
                redirectTo: "/login"
            });

        this.setStatusBarColor(this.state.selectedCategory.color);

        if (
            this.props.categories.array.length > 0 &&
            !this.props.location.state
        )
            return;

        this.setState({
            spinner: true
        });

        let recipesRef = db.collection(
            "users/" + this.props.login.uid + "/recipes"
        );
        let categoriesRef = db.collection(
            "users/" + this.props.login.uid + "/categories"
        );
        let menuRef = db.collection("users/" + this.props.login.uid + "/menu");

        Promise.resolve().then(() => {
            recipesRef.get().then(querySnapshot => {
                if (querySnapshot.empty)
                    return this.setState({ spinner: false });

                let recipes = [];
                querySnapshot.forEach(doc => {
                    recipes.push(doc.data().recipe);
                });

                if (
                    this.props.location.state &&
                    recipes
                        .map(elem => (elem = elem.id))
                        .indexOf(this.props.location.state.sharedRecipe.id) ===
                        -1
                ) {
                    recipes.push(this.props.location.state.sharedRecipe);
                    db
                        .collection(
                            "users/" + this.props.login.uid + "/recipes"
                        )
                        .doc(this.props.location.state.sharedRecipe.id)
                        .set({
                            recipe: this.props.location.state.sharedRecipe
                        });
                }

                store.dispatch(addRecipe(recipes));

                this.setState({
                    recipes: recipes,
                    spinner: false
                });
            });

            categoriesRef
                .doc("categories")
                .get()
                .then(doc => {
                    if (doc.exists) {
                        let categories = doc.data().categories;

                        if (
                            this.props.location.state &&
                            categories
                                .map(elem => (elem = elem.id))
                                .indexOf("external") === -1
                        ) {
                            categories.push(
                                this.props.location.state.sharedCategory
                            );
                            db
                                .collection(
                                    "users/" +
                                        this.props.login.uid +
                                        "/categories"
                                )
                                .doc("categories")
                                .set({ categories });
                        }

                        store.dispatch(addCategory(categories));

                        this.setState({
                            categories: categories,
                            spinner: false
                        });
                    }
                });

            menuRef
                .doc("menu")
                .get()
                .then(doc => {
                    if (doc.exists) {
                        let menu = doc.data().menu;

                        store.dispatch(updateIngredients(menu));

                        this.setState({
                            menu: menu,
                            spinner: false
                        });
                    }
                });
        });
    };

    componentWillReceiveProps = nextProps => {
        if (this.state.categories !== nextProps.categories.array) {
            this.setState({
                categories: nextProps.categories.array
            });
        }

        if (this.state.recipes !== nextProps.recipes.array) {
            this.setState({
                recipes: nextProps.recipes.array
            });
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

    logOut = () => {
        auth.signOut().then(() => {
            return this.setState({
                redirect: true,
                redirectTo: "/login"
            });
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
        if (id === "default")
            return this.correctlyWrite(this.props.recipes.array.length);

        this.props.recipes.array.forEach(item => {
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

                let menuIndices = categories.map(elem => (elem = elem.id));
                let menuRecipes = this.props.menu.recipes.filter(
                    elem => menuIndices.indexOf(elem.category) !== -1
                );

                if (menuRecipes.length !== this.props.menu.recipes.length) {
                    let menu = {
                        recipes: menuRecipes,
                        ingredients: recipesToIngredients(menuRecipes)
                    };

                    db
                        .collection("users/" + this.props.login.uid + "/menu")
                        .doc("menu")
                        .set({ menu });
                    store.dispatch(updateMenu(menuRecipes));
                }
            })
            .then(() => {
                this.setState({
                    categories: categories,
                    recipes: recipes,
                    headerMenu: false,
                    redirect: false
                });
            });
    };

    handleInput = event => {
        let search = event.target.value;

        this.setState({
            recipes: this.props.recipes.array.filter(
                elem =>
                    elem.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
            ),
            value: search
        });
    };

    resetInput = () => {
        this.setState({
            recipes: this.props.recipes.array,
            value: ""
        });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;

        let categoryColor = this.state.selectedCategory.color;
        let drawerVisibility = this.state.drawer ? "flex" : "none";
        let sideMenuDisplay = this.state.sideMenu ? "flex" : "none";
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";
        let startButtonImage = this.state.startButton
            ? "start-menu-btn"
            : "return-menu-btn";
        let categoryId =
            this.props.categories.array.length === 0
                ? ""
                : this.props.categories.array[0].id;
        let spinner = this.state.spinner ? "block" : "none";

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
                <div className="category__scroll">
                    <div style={{ display: headerMenuDisplay }}>
                        <div
                            className="wrapper-transparent-cover"
                            onClick={this.toggleHeaderMenu}
                        />
                        <div className="category__header-overlay-menu">
                            <div
                                className="category__header-overlay-menu-item"
                                onClick={this.logOut}
                            >
                                Выйти
                            </div>
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
                            recipes={this.state.recipes}
                            color={categoryColor}
                            categories={this.state.categories}
                        />
                        <Link
                            className="category__add-recipe-btn"
                            style={{ backgroundColor: categoryColor }}
                            to={{
                                pathname: "/add-recipe/r" + Date.now(),
                                state: { categoryId: categoryId }
                            }}
                        />
                    </div>
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
                <div className="spinner-wrapper" style={{ display: spinner }}>
                    <ReactSpinner
                        config={{ scale: 1.5, width: 4, color: "#e7989e" }}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Home);
