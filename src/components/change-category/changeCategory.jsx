import React, { Component } from "react";
import { Link, Redirect/*, withRouter*/ } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import ColorsTable from "./colorsTable";
import IconsTable from "./iconsTable";

//utils
import { asyncLocalStorage } from "../../utils/asyncLocalStorage";
import settings from "../../config";

//store
import store from "../../store/store";
import { addCategory} from "../../ducks/categories";

const mapStateToProps = state => {
    return {
        categories: state.categories
    };
};

class ChangeCategory extends Component {
    constructor(props) {
        super(props);

        let categoryId = this.props.location.pathname.split("/change-category/").pop();
        let selectedCategory = this.props.categories.array.filter(elem => elem.id === categoryId)[0];

        this.state = {
            categoryId: categoryId,
            icons: settings.icons,
            selectedCategory: selectedCategory,
            redirect: false
        };
    }

    componentWillMount = () => {
        if (!this.state.selectedCategory) return this.setState({redirect: true});

        this.setState({
            ratio: window.innerWidth/window.innerHeight,
        });

        this.setState({
            categoryColor: this.state.selectedCategory.color,
            categoryName: this.state.selectedCategory.name,
            categoryIcon: this.state.selectedCategory.icon,
        })

        this.setStatusBarColor(this.state.selectedCategory.color);
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

        var changedArray = this.props.categories.array.map(elem => elem.id === this.state.categoryId ? changedCategory : elem);
        store.dispatch(addCategory(changedArray));
        asyncLocalStorage.setItem('categories', changedArray);
    }
    

    render() {
        if (this.state.redirect) return (<Redirect to="/" />);

        return (
           <div className="wrapper">
        <div className="change-category__header header" style={{backgroundColor: this.state.categoryColor}} >
            <div className="change-category__header-left-menu">
                <Link 
                    to={"/category/" + this.state.categoryId} 
                    className="back-btn" 
                />
            </div>
            <div className="change-category__header-title">Изменить категорию</div>
            <div className="change-category__header-right-menu" >
                <Link 
                    onClick={this.saveCategory}
                    to={"/category/" + this.state.categoryId} 
                    className="confirm-btn" 
                />
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
