import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import { addCategory, deleteCategorye } from "../ducks/categories";
//import { changeCategory, resetCategory } from "../ducks/selected-category";

const mapStateToProps = state => {
    return {
        recipes: state.recipes,
        categories: state.categories,
        selectedCategory: state.selectedCategory
    };
};

class HeaderDropDown extends Component {
    /*constructor(props) {
        super(props);

        console.log(this.props);
    }*/



    render () {
       // console.log(this.props.selectedCategory);
        
        if (this.props.selectedCategory.data.id !== 'default') {
            return (
                <div className="add-recipe__category-selected">
                    <div 
                        className="add-recipe__category-selected-icon" 
                        style={{
                            WebkitMaskImage: "url(" + this.props.selectedCategory.data.icon + ")", 
                            backgroundColor: this.props.selectedCategory.data.color
                        }}>
                    </div>
                    <div className="add-recipe__category-selected-name"
                    style={{color: this.props.selectedCategory.data.color}}>{this.props.selectedCategory.data.name}</div>
                </div>
                )
        }else if (this.props.selectedCategory.data.id === 'default' && this.props.categories.array.length > 0) {
            return (
                <div className="add-recipe__category-selected">
                    <div 
                        className="add-recipe__category-selected-icon" 
                        style={{
                            WebkitMaskImage: "url(" + this.props.categories.array[0].icon + ")", 
                            backgroundColor: this.props.categories.array[0].color
                        }}>
                    </div>
                    <div className="add-recipe__category-selected-name"
                    style={{color: this.props.categories.array[0].color}}>{this.props.categories.array[0].name}</div>
                </div>
            )
        }/*else {
            return (
                <div className="add-recipe__category-selection-item">
                    <Link 
                        to="/add-category" 
                        className="add-recipe__add-category-link"
                    />
                </div>
            )
        }*/
    }
}

export default connect(mapStateToProps)(HeaderDropDown);