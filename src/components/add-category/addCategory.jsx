import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import ColorsTable from "./colorsTable";
import IconsTable from "./iconsTable";

//utils
import settings from "../../config";
//import { asyncLocalStorage } from "../../utils/asyncLocalStorage";
import firebaseApp from "../../utils/firebase";
import 'firebase/firestore';

//store
import store from "../../store/store";
import { addCategory } from "../../ducks/categories";
import { addRecipe } from "../../ducks/recipes";

const mapStateToProps = state => {
    return {
        categories: state.categories,
        recipes: state.recipes,
        login: state.login
    };
};

class AddCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryId: this.props.location.pathname.split("/add-category/").pop(),
            categoryColor: settings.colors[0],
            categoryName: '',
            categoryIcon: settings.icons[0],
            icons: settings.icons
        };
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });
        if (this.props.location.state) return this.setState({fromRecipe: this.props.location.state.fromRecipe});
        this.setStatusBarColor(settings.colors[0]);
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
        })
    }

    saveCategory = () => {
        let categories = this.props.categories.array;
        let newCategory = {
            id: this.state.categoryId,
            icon: this.state.categoryIcon,
            name: this.state.categoryName,
            color: this.state.categoryColor
        };
        categories.push(newCategory);
        store.dispatch(addCategory(categories));
        firebaseApp.firestore().collection(this.props.login.uid).doc('categories').set({categories});
        // asyncLocalStorage.setItem('categories', categories);


        if (this.state.fromRecipe) {
            let targetRecipe = this.props.recipes.array.filter(elem => elem.id === this.state.fromRecipe)[0];
            targetRecipe.category = newCategory.id;
            
            let recipes = this.props.recipes.array.map(elem => elem.id !== this.state.fromRecipe ? targetRecipe : elem);
            store.dispatch(addRecipe(recipes));
            firebaseApp.firestore().collection(this.props.login.uid).doc('recipes').set({recipes});
            //asyncLocalStorage.setItem('recipes', recipes);
        }
    }



       render() {
        let path = this.state.fromRecipe ? "/change-recipe/" + this.state.fromRecipe : "/category/" + this.state.categoryId;

        return (
           <div className="wrapper">
        <div className="add-category__header header" style={{backgroundColor: this.state.categoryColor}} >
            <div className="add-category__header-left-menu">
                <Link to={path} className="back-btn" />
            </div>
            <div className="add-category__header-title">Добавить категорию</div>
            <div className="add-category__header-right-menu">
                <Link to={path} className="confirm-btn" onClick={this.saveCategory}/>
            </div>
        </div>
        <div className="body add-category__body">
            <div className="add-category__body-section">
                <div className="add-category__body-section-title">Название папки</div>
                <input 
                    className="add-category__body-section-input" 
                    type="text" 
                    onChange={this.changeCategoryName}
                    onFocus={this.preventWindowFromResize}
                    placeholder="например, 'Десерты'" />
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
