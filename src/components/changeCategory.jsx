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

class ChangeCategory extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            categoryColor: this.props.selectedCategory.data.color,
            categoryName: this.props.selectedCategory.data.name,
            categoryIcon: this.props.selectedCategory.data.icon,
            categoryId: this.props.selectedCategory.data.id,
            icons: settings.icons,
            selectedCategory: this.props.selectedCategory.data
        };
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });

        this.setStatusBarColor(this.props.selectedCategory.data.color);
    }

    setStatusBarColor = (color) => {
        document.querySelector('meta[name=theme-color]').setAttribute('content', color);
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / this.state.ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
    }

    changeCategoryColor = (color) => {
        this.setState({
            categoryColor: color
        });

        this.setStatusBarColor(color);
    }

    changeCategoryName = (ev) => {
        this.setState({
            categoryName: ev.target.value
        })
    }

    changeCategoryIcon = (icon) => {
        this.setState({
            categoryIcon: icon
        });
    }

    saveCategory = () => {
        let changedCategory = {
            id: this.state.categoryId,
            icon: this.state.categoryIcon,
            name: this.state.categoryName,
            color: this.state.categoryColor
        };

        let categories = this.props.categories.array;
        categories.splice(this.props.categories.array.indexOf(this.props.selectedCategory.data), 1, changedCategory);

        store.dispatch(addCategory(categories));
        store.dispatch(changeCategory(changedCategory));

        asyncLocalStorage.setItem('categories', categories);
    }
    

    render() {
        return (
           <div className="wrapper">
        <div className="change-category__header header" style={{backgroundColor: this.state.categoryColor}} >
            <div className="change-category__header-left-menu">
                <BackButton />
            </div>
            <div className="change-category__header-title">Изменить категорию</div>
            <div className="change-category__header-right-menu" onClick={this.saveCategory}>
                <ConfirmButton />
            </div>
        </div>
        <div className="body change-category__body">
            <div className="change-category__body-section">
                <div className="change-category__body-section-title">Название папки</div>
                <input 
                    className="change-category__body-section-input" 
                    type="text" 
                    onChange={this.changeCategoryName}
                    onFocus={this.preventWindowFromResize} 
                    value={this.state.categoryName} />
            </div>
            <div className="change-category__body-section">
                <div className="change-category__body-section-title">Цвет категории</div>
                <ColorsTable 
                    selectedColor={this.state.categoryColor} 
                    changeCategoryColor={this.changeCategoryColor} 
                />
            </div>
            <div className="change-category__body-section">
                <div className="change-category__body-section-title">Иконка категории</div>
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

export default connect(mapStateToProps)(ChangeCategory);
