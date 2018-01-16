import React, { Component } from "react";
import { Link } from "react-router-dom";
//import PropTypes from "prop-types";

import settings from "../config";

class CategoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: this.props.categories.map(elem => false),
        }
    }

    toggle = (event) => {
        let id = event.currentTarget.id;
        let array = this.state.display.map(elem => false);
        array[id] = !this.state.display[id];

        this.setState({
            display: array,
            position: {
                top: event.clientY + 'px',
                left: event.clientX + 'px'
            }
        });
    }

    /*addStyle = category => {
        (catgeory === this.props.selectedCategory) ? "f0f0f0" : "000000"
    }*/
    
    render() {
        return (
            <div>
            {this.props.categories.map((item, index) => (
                <div className="drawer__category-wrapper" key={index} style={{backgroundColor: (item === this.props.selectedCategory) ? "#f0f0f0" : "#ffffff"}}>
                    <div className="drawer__drag-icon"></div>
                    <div className="drawer__left" >
                        <div className="drawer__category-info" onClick={() => this.props.handleCategoryChange(item)}>
                            <div className="drawer__category-icon" style={this.props.drawCategoryIcon(item)}></div>
                            <div className="drawer__category-data">
                                <div className="drawer__category-title">{item.name}</div>
                                <div className="drawer__category-recipes-count">{this.props.writeRecipesCount(item.id)}</div>
                            </div>
                        </div>
                        <div className="drawer__dots-menu-btn" onClick={this.toggle} id={index}></div>
                        <div className="wrapper-transparent-cover" onClick={this.toggle} style={{display: this.state.display[index] ? 'flex' : 'none'}}>
                            <SideMenu
                                handleCategoryChange={this.props.handleCategoryChange}
                                category={item}
                                position={this.state.position}
                                deleteCategory={this.props.deleteCategory} 
                                toggle={this.toggle}
                            />
                        </div>                           
                    </div>
                </div>
                ))} 
            </div>
        );
    }
}


const SideMenu = props => {
    return (
        <div 
            className="drawer__header-overlay-menu" 
            style={props.position}>
            <Link 
                to="/" 
                className="drawer__header-overlay-menu-item" 
                onClick={() => props.deleteCategory(props.category)}>
                Удалить
            </Link>
            <Link 
                to="/change-category" 
                className="drawer__header-overlay-menu-item"
                onClick={() => props.handleCategoryChange(props.category)}>
                Изменить
            </Link>
        </div>
    );
}



class Drawer extends Component {
    render() {
        return (
            <div style={{display: this.props.drawerDisplay}}>
                <div className="wrapper-transparent-cover" onClick={() => this.props.toggleDrawer()} ></div>
                <div className="category__side-overlay-menu drawer" >
                    <div 
                        className="drawer__category-wrapper menu" 
                        onClick={() => console.log('menu')} 
                        style={{backgroundColor: (settings.menuCategory.id === this.props.selectedCategory.id) ? "#f0f0f0" : "#ffffff"}}>
                        <div className="drawer__category-info">
                            <div className="drawer__category-icon" style={this.props.drawCategoryIcon(settings.menuCategory)}></div>
                            <div className="drawer__category-data">
                                <div className="drawer__category-title">{settings.menuCategory.name}</div>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="drawer__category-wrapper all-recipes" 
                        onClick={() => this.props.handleCategoryChange()} 
                        style={{backgroundColor: (settings.defaultCategory.id === this.props.selectedCategory.id) ? "#f0f0f0" : "#ffffff"}}>
                        <div className="drawer__category-info">
                            <div className="drawer__category-icon" style={this.props.drawCategoryIcon(settings.defaultCategory)}></div>
                            <div className="drawer__category-data">
                                <div className="drawer__category-title">{settings.defaultCategory.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="drawer__categories-wrapper">
                        <div className="drawer__categories-header">
                            <div className="drawer__categories-title">Категории</div>
                            <Link to="/add-category" className="drawer__add-category" />
                        </div>
                        <CategoryList 
                            sideMenuDisplay={this.props.SideMenuDisplay}
                            drawerDisplay={this.props.drawerDisplay}
                            categories={this.props.categories}
                            handleCategoryChange={this.props.handleCategoryChange}
                            drawCategoryIcon={this.props.drawCategoryIcon} 
                            writeRecipesCount={this.props.writeRecipesCount} 
                            deleteCategory={this.props.deleteCategory}
                            selectedCategory={this.props.selectedCategory}
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

export default Drawer;