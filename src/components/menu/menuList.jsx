import React, { Component } from "react";

//components
import MenuItems from "./menuItems";

//utils
import settings from "../../config";
import { db } from "../../utils/firebase";
import { recipesToIngredients } from "../../utils/recipesToIngredients";

//store
import store from "../../store/store";
import { updateMenu } from "../../ducks/menu";

class MenuList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alertBox: this.props.menu.recipes.map(elem => false),
            recipes: this.props.menu.recipes,
            categories: this.props.categories
        };
    }

    componentWillMount = () => {
        document.addEventListener("contextmenu", this.handleContextMenu);
    };

    componentWillUnmount = () => {
        document.removeEventListener("contextmenu", this.handleContextMenu);
        clearTimeout(this.longPressTimer);
    };

    componentWillReceiveProps = nextProps => {
        if (this.state.menu !== nextProps.menu) {
            this.setState({
                alertBox: nextProps.menu.recipes.map(elem => false),
                recipes: nextProps.menu.recipes,
                categories: nextProps.categories
            });
        }
    };

    handleContextMenu = event => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    handleRecipeLongPress = index => {
        this.longPressTimer = setTimeout(() => {
            this.setState({
                alertBox: this.state.alertBox.map(
                    (elem, i) => (i === index ? true : false)
                )
            });
        }, 300);
    };

    handleRecipeRelease = () => {
        clearTimeout(this.longPressTimer);
    };

    alertBoxDisplay = index => {
        return this.state.alertBox[index] === true ? "flex" : "none";
    };

    resetAlertBoxes = () => {
        clearTimeout(this.longPressTimer);
        this.setState({
            alertBox: this.state.alertBox.map(elem => false)
        });
    };

    addStyle = item => {
        if (item)
            return {
                backgroundImage:
                    item.image === ""
                        ? "url(" + settings.menuCategory.image + ")"
                        : item.image,
                backgroundColor: settings.menuCategory.color
            };
    };

    addTitle = item => {
        if (item) return item.title;
    };

    addIcon = item => {
        if (item) {
            let category = this.state.categories.filter(
                elem => elem.id === item.category
            )[0];
            return {
                backgroundColor: category.color,
                WebkitMaskImage: "url(" + category.icon + ")"
            };
        }
    };

    getId = item => {
        if (item) return item.id;
    };

    hideEmpty = item => {
        if (!item)
            return {
                visibility: "hidden"
            };
    };

    deleteRecipeFromMenu = recipe => {
        if (recipe) {
            let recipes = this.state.recipes.filter(
                elem => elem.id !== recipe.id
            );
            store.dispatch(updateMenu(recipes));

            let menu = {
                recipes: recipes,
                ingredients: recipesToIngredients(recipes)
            };
            db
                .collection("users/" + this.props.uid + "/menu")
                .doc("menu")
                .set({ menu });
        }
    };

    render() {
        let table = [];
        let itemsPerRow = 2;

        for (
            let i = 0;
            i < Math.round(this.state.recipes.length / itemsPerRow);
            i++
        ) {
            let row = [];
            for (let j = 0; j < itemsPerRow; j++) {
                row.push(this.state.recipes[i * itemsPerRow + j]);
            }
            table.push(row);
        }

        return (
            <div className="category__list">
                {table.map((item, index) => (
                    <div key={index}>
                        <MenuItems
                            recipes={this.state.recipes}
                            categories={this.state.categories}
                            rowIndex={index}
                            rowData={item}
                            onTouchStart={this.handleRecipeLongPress}
                            onTouchEnd={this.handleRecipeRelease}
                            alertBoxDisplayArray={this.state.alertBox}
                            resetAlertBoxes={this.resetAlertBoxes}
                            addTitle={this.addTitle}
                            addStyle={this.addStyle}
                            addIcon={this.addIcon}
                            getId={this.getId}
                            handleRecipeLongPress={this.handleRecipeLongPress}
                            handleRecipeRelease={this.handleRecipeRelease}
                            deleteRecipeFromMenu={this.deleteRecipeFromMenu}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default MenuList;
