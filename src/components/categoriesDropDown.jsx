import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import HeaderDropDown from "./headerDropDown";
//import { addCategory, deleteCategorye } from "../ducks/categories";
//import { changeCategory, resetCategory } from "../ducks/selected-category";


const mapStateToProps = state => {
    return {
        //categories: state.categories,
        //selectedCategory: state.selectedCategory
    };
};


class CategoriesDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: this.props.categories,
            dropDownDisplay: false,
            selectedCategory: this.props.selectedCategory
        }
    } 

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedCategory !== this.props.selectedCategory) {
            this.setState({
                selectedCategory: this.props.selectedCategory
            })
        }
    }   

    handleSelect = (event) => {
        let id = event.currentTarget.id;

        this.state.categories.forEach(elem => {
            if (elem.id === id) {
                return this.props.handleCategoryChange(elem);
            }
        });

        this.setState({
            dropDownDisplay: false
        });
    }

    showCategoriesList = () => {
        this.setState({
            dropDownDisplay: true
        });

        this.props.saveTempData();
    }

    hideCategoriesList = () => {
        this.setState({
            dropDownDisplay: false
        });
    }

    render() {
        let dropDownDisplay = this.state.dropDownDisplay ? "flex" : "none";

        return (
            <div className="add-recipe__category-selection-wrapper">
                <div className="add-recipe__category-selected">
                    <div 
                        className="add-recipe__category-selected-icon" 
                        style={{
                            WebkitMaskImage: "url(" + this.state.selectedCategory.icon + ")", 
                            backgroundColor: this.state.selectedCategory.color
                        }}>
                    </div>
                    <div className="add-recipe__category-selected-name"
                    style={{color: this.state.selectedCategory.color}}>{this.state.selectedCategory.name}</div>
                </div>
                <div className="add-recipe__category-selection-btn" onClick={this.showCategoriesList}></div>
                <div className="wrapper-transparent-cover" style={{display: dropDownDisplay}} onClick={this.hideCategoriesList}></div>
                <ul className="add-recipe__category-selection-list" style={{display: dropDownDisplay}}>
                    {this.state.categories.map((elem, index) => (
                        <li 
                            className="add-recipe__category-selection-item" 
                            key={index}
                            id={elem.id}
                            onClick={this.handleSelect}
                            >
                            <div 
                                className="add-recipe__category-selected-icon" 
                                style={{
                                    WebkitMaskImage: "url(" + elem.icon + ")", 
                                    backgroundColor: elem.color
                                }}>
                            </div>
                            <div 
                                className="add-recipe__category-selected-name"
                                style={{color: elem.color}}
                                >
                                {elem.name}
                            </div>
                            
                        </li>
                    ))}
                    <li className="add-recipe__category-selection-item">
                        <Link 
                            to={{pathname: "/add-category", state: {temp: this.props.temp}}}
                            className="add-recipe__add-category-link"
                        />
                    </li>
                </ul>
            </div>
        )
    }
}

/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(CategoriesDropDown);