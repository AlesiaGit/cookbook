import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import MenuList from "./menuList";
import settings from "../../config";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        menu: state.menu
    };
};

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            startButton: true,
            headerMenu: false,
            //menu: this.props.menu.array,
            selectedCategory: settings.menuCategory,
            selectedCategoryRecipes: this.props.recipes.array.filter(elem => this.props.menu.array.indexOf(elem.id) !== -1)
        };
    }

    componentWillMount = () => {
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
   
    render() {
        let categoryColor = this.state.selectedCategory.color;

        return (
           <div className="wrapper">
                <div className="category__header header" style={{backgroundColor: categoryColor}} >
                <div className="category__header-left-menu">
                     <Link 
                        className="back-btn" 
                        to="/"
                    />
                </div>
                <div className="category__header-right-menu">
                    <div className="category__header-menu-btn dots-menu-btn" onClick={this.toggleHeaderMenu}></div>
                </div>
            </div>
            <div className="category__body">
                <div className="category__title">
                    <div className="category__selected">
                        <div className="category__selected-icon" style={this.drawCategoryIcon(this.state.selectedCategory)}></div>
                        <div className="category__selected-title" style={{color: categoryColor}}>{this.state.selectedCategory.name}</div>
                    </div>
                    <div className="category__items-count-wrapper">
                        <div className="category__items-count" style={{backgroundColor: categoryColor}}>{this.correctlyWrite(this.state.selectedCategoryRecipes.length)}</div>
                    </div>
                </div>
                <MenuList 
                    recipes={this.state.selectedCategoryRecipes}
                    categories={this.state.selectedCategoriesList}
                />
            </div>
        </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(Menu);
