import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { connect } from "react-redux";

//import PropTypes from "prop-types";

class CategoryItemMenu extends Component {
    render() {
        return (
            <div 
                className="drawer__header-overlay-menu" 
                style={this.props.position}>
                <div 
                    className="drawer__header-overlay-menu-item" 
                    onClick={() => this.props.deleteCategory(this.props.category, this.props.categoriesFromDom)}>
                    Удалить
                </div>
                <Link 
                    to={"/change-category/" + this.props.category.id}
                    className="drawer__header-overlay-menu-item">
                    Изменить
                </Link>
            </div>
        )
    }
}

export default CategoryItemMenu;