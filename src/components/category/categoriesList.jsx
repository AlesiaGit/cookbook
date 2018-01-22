import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//components
import CategoryItemMenu from "./categoryItemMenu";

const mapStateToProps = state => {
    return {
        categories: state.categories
    };
};

class CategoriesList extends Component {
    state = {
        display: this.props.categories.array.map(elem => false),
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

    render() {
        return (
            <div>
            {this.props.categories.array.map((item, index) => (
                <div className="drawer__category-wrapper" key={index} style={{backgroundColor: (item === this.props.selectedCategory) ? "#f0f0f0" : "#ffffff"}}>
                    <div className={(item === this.props.selectedCategory) ? "drawer__drag-icon white" : "drawer__drag-icon grey"}></div>
                    <div className="drawer__left" >
                        <Link className="drawer__category-info" to={"/category/" + item.id} onClick={() => this.props.toggleDrawer()}>
                            <div className="drawer__category-icon" style={this.props.drawCategoryIcon(item)}></div>
                            <div className="drawer__category-data">
                                <div className="drawer__category-title">{item.name}</div>
                                <div className="drawer__category-recipes-count">{this.props.writeRecipesCount(item.id)}</div>
                            </div>
                        </Link>
                        <div className="drawer__dots-menu-btn" onClick={this.toggle} id={index}></div>
                        <div className="wrapper-transparent-cover" onClick={this.toggle} style={{display: this.state.display[index] ? 'flex' : 'none'}}>
                            <CategoryItemMenu
                                id={this.props.id}
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

export default connect(mapStateToProps)(CategoriesList);