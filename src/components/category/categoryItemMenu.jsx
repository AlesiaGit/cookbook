import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { connect } from "react-redux";

//import PropTypes from "prop-types";

class CategoryItemMenu extends Component {
    render() {
        if (this.props.category.id === this.props.id) {
            return (
                <div 
                    className="drawer__header-overlay-menu" 
                    style={this.props.position}>
                    <Link 
                        to="/" 
                        className="drawer__header-overlay-menu-item" 
                        onClick={() => this.props.deleteCategory(this.props.category)}>
                        Удалить
                    </Link>
                    <Link 
                        to={"/change-category/" + this.props.category.id}
                        className="drawer__header-overlay-menu-item">
                        Изменить
                    </Link>
                </div>
            )
        } else {
            return (
                <div 
                    className="drawer__header-overlay-menu" 
                    style={this.props.position}>
                    <Link 
                        to={"/category/" + this.props.id}
                        className="drawer__header-overlay-menu-item" 
                        onClick={() => this.props.deleteCategory(this.props.category)}>
                        Удалить
                    </Link>
                    <Link 
                        to={"/change-category/" + this.props.category.id}
                        className="drawer__header-overlay-menu-item"
                        >
                        Изменить
                    </Link>
                </div>
            );
        }
    }
}

export default CategoryItemMenu;