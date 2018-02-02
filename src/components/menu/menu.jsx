import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import MenuBody from "./menuBody";
import HeaderMenu from './headerMenu';
import settings from "../../config";

//utils
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
import { resetMenu } from "../../ducks/menu";
import { shoppingListDeleted } from "../../ducks/shopping-list";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu,
        login: state.login,
        shoppingList: state.shoppingList
    };
};

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            startButton: true,
            headerMenu: false,
            selectedCategory: settings.menuCategory,
            selectedCategoryRecipes: this.props.recipes.array.filter(elem => this.props.menu.array.indexOf(elem.id) !== -1),
            redirect: false,
            menuList: true
        };
    }

    componentWillMount = () => {
        if (this.props.categories.array.length === 0) return this.setState({ redirect: true });

        let categories = this.state.selectedCategoryRecipes.map(elem => elem = elem.category);
        this.setState({
            selectedCategoriesList: this.props.categories.array.filter(elem => categories.indexOf(elem.id) !== -1)
        })

        this.setStatusBarColor(this.state.selectedCategory.color);


    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.menu !== nextProps.menu) {
            let array = this.props.recipes.array.filter(elem => nextProps.menu.array.indexOf(elem.id) !== -1);
            this.setState({
                selectedCategoryRecipes: array,
                selectedCategoriesList: this.props.categories.array.filter(elem => array.map(elem => elem = elem.category).indexOf(elem.id) !== -1)
            });
        }
    }

    setStatusBarColor = (color) => {
        document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    }

    toggleHeaderMenu = () => {
        this.setState({
            headerMenu: !this.state.headerMenu,
        })
    }

    drawCategoryIcon = (category) => {
        return ({
            WebkitMaskImage: "url(" + category.icon + ")",
            backgroundColor: category.color 
        })
    }
    
    correctlyWrite = (number) => {
        if (number % 10 === 1) return number + " рецепт";
        if (number % 10 > 1 && number % 10 < 5 && number > 20) return number + " рецепта";
        if (number > 1 && number < 5) return number + " рецепта";
        return number + " рецептов";
    }

    addStyle = item => {
        if (item) return ({
            backgroundImage: (item.image === '') ? 'url(' + settings.defaultCategory.image + ')' : item.image,
            backgroundColor: this.state.selectedCategory.color
        })
    }

    addTitle = item => {
        if (item) return item.title;
    }

    addIcon = item => {
        if (item) {
            let category = this.state.selectedCategoriesList.filter(elem => elem.id === item.category)[0];
            return ({
                backgroundColor: category.color,
                WebkitMaskImage: "url(" + category.icon + ")", 
            });
        }
    }

    deleteMenu = () => {
        let menu = [];
        let shoppingList = [];

        store.dispatch(resetMenu());
        store.dispatch(shoppingListDeleted());

        db.collection(this.props.login.uid).doc('menu').set({menu});
        db.collection(this.props.login.uid).doc('shopping-list').set({shoppingList});
        
        this.setState({
            redirect: true
        })
    }

    toggleMenuList = () => {
        this.setState({
            menuList: !this.state.menuList,
            headerMenu: !this.state.headerMenu
        });
    }
   
    render() {
        if (this.state.redirect) return (<Redirect to="/" />);

        let categoryColor = this.state.selectedCategory.color;
        let headerMenuDisplay = this.state.headerMenu ? "flex" : "none";

        return (
           <div className="wrapper">
                <div className="menu__header header" style={{backgroundColor: categoryColor}} >
                <div className="menu__header-left-menu">
                     <Link 
                        className="back-btn" 
                        to="/"
                    />
                </div>
                <div className="menu__header-right-menu">
                    <div className="menu__header-menu-btn dots-menu-btn" onClick={this.toggleHeaderMenu}></div>
                </div>
            </div>
            <div className="menu__scroll">
                <div className="menu__body">
                    <div className="menu__title">
                        <div className="menu__selected">
                            <div className="menu__selected-icon" style={this.drawCategoryIcon(this.state.selectedCategory)}></div>
                            <div className="menu__selected-title" style={{color: categoryColor}}>{this.state.selectedCategory.name}</div>
                        </div>
                        <div className="menu__items-count-wrapper">
                            <div className="menu__items-count" style={{backgroundColor: categoryColor}}>{this.correctlyWrite(this.state.selectedCategoryRecipes.length)}</div>
                        </div>
                    </div>
                    <MenuBody 
                        menuRecipes={this.state.selectedCategoryRecipes}
                        menuCategories={this.state.selectedCategoriesList}
                        menuList={this.state.menuList}
                        uid={this.props.login.uid}
                        shoppingList={this.props.shoppingList}
                    />
                </div>
            </div>
            <HeaderMenu 
                headerMenuDisplay={headerMenuDisplay}
                toggleHeaderMenu={this.toggleHeaderMenu}
                deleteMenu={this.deleteMenu}
                toggleMenuList={this.toggleMenuList}
                menuList={this.state.menuList}
            />
        </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Menu);
