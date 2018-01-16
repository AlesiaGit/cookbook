import React, { Component } from "react";
//import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import ColorsTable from "./colorsTable";
import IconsTable from "./iconsTable";
import BackButton from "./backButton";
import ConfirmButton from "./confirmButton";

import { asyncLocalStorage } from "../utils/asyncLocalStorage";

import store from "../store/store";
import { addCategory/*, deleteCategory*/ } from "../ducks/categories";
import { changeCategory/*, resetCategory*/ } from "../ducks/selected-category";

import settings from "../config";

const mapStateToProps = state => {
    return {
        categories: state.categories,
        selectedCategory: state.selectedCategory
    };
};

class AddCategory extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            categoryColor: settings.colors[0],
            categoryName: '',
            categoryIcon: settings.icons[0],
            icons: settings.icons
        };
    }

    changeCategoryColor = (color) => {
        this.setState({
            categoryColor: color
        })
    }

    changeCategoryName = (ev) => {
        this.setState({
            categoryName: ev.target.value
        })
    }

    changeCategoryIcon = (icon) => {
        this.setState({
            categoryIcon: icon
        })
    }

    saveCategory = () => {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        let newCategory = {
            id: 'c' + Date.now(),
            icon: this.state.categoryIcon,
            name: this.state.categoryName,
            color: this.state.categoryColor
        };

        categories.push(newCategory);

        store.dispatch(addCategory(categories));
        store.dispatch(changeCategory(newCategory));

        asyncLocalStorage.setItem('categories', categories);
    }
    

    render() {

        return (
           <div className="wrapper">
        <div className="add-category__header header" style={{backgroundColor: this.state.categoryColor}} >
            <div className="add-category__header-left-menu">
                <BackButton />
            </div>
            <div className="add-category__header-title">Добавить категорию</div>
            <div className="add-category__header-right-menu" onClick={this.saveCategory}>
                <ConfirmButton />
            </div>
        </div>
        <div className="body add-category__body">
            <div className="add-category__body-section">
                <div className="add-category__body-section-title">Название папки</div>
                <input className="add-category__body-section-input" type="text" onChange={this.changeCategoryName} placeholder="например, 'Десерты'" />
            </div>
            <div className="add-category__body-section">
                <div className="add-category__body-section-title">Цвет категории</div>
                <ColorsTable 
                    selectedColor={this.state.categoryColor} 
                    changeCategoryColor={this.changeCategoryColor} 
                />
            </div>
            <div className="add-category__body-section">
                <div className="add-category__body-section-title">Иконка категории</div>
                <IconsTable 
                    icons={this.state.icons} 
                    selectedIcon={this.state.categoryIcon}
                    color={this.state.categoryColor} 
                    changeCategoryIcon={this.changeCategoryIcon}
                />
            </div>
        </div>
    </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(AddCategory);
