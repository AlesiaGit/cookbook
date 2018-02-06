import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import Sortable from "sortablejs";
import Sortable from "react-sortablejs";
//import PropTypes from "prop-types";

//components
import CategoryItemMenu from "./categoryItemMenu";

//utils
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
import { addCategory } from "../../ducks/categories";

const mapStateToProps = state => {
    return {
        categories: state.categories,
        login: state.login
    };
};

class CategoriesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: false,
            position: {
                top: '0px',
                left: '0px'
            },
            item: '',
            categoriesFromDom: this.props.categories.array
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.categoriesFromDom !== nextProps.categories.array) {
            this.setState({
                categoriesFromDom: nextProps.categories.array,
                display: false,
                item: nextProps.categories.array[0]
            })
        }
    }

    toggleItemMenu = (x, y, item) => {
        this.setState({
            display: !this.state.display,
            position: {
                top: y + 'px',
                left: x + 'px'
            },
            item: item
        });
     
    }

    changeOrder = (order, sortable, evt) => {
        let categories = this.state.categoriesFromDom;
        categories.splice(evt.newIndex, 0, categories.splice(evt.oldIndex, 1)[0]);
        this.setState({ 
            categoriesFromDom: categories 
        });
        store.dispatch(addCategory(categories));
        db.collection(this.props.login.uid).doc('categories').set({categories});
    }

    render() {
        return (
            <div>
            <Sortable ref={sortable => this.sortable = sortable} 
                style={{touchAction: 'none'}}
                onChange={this.changeOrder}>
                {this.state.categoriesFromDom.map((item, index) => (
                    <div 
                        className="drawer__category-wrapper" 
                        key={index} 
                        id={item.id}
                        style={{backgroundColor: (item === this.props.selectedCategory) ? "#f0f0f0" : "#ffffff"}}
                        >
                        <div className={(item === this.props.selectedCategory) ? "drawer__drag-icon white" : "drawer__drag-icon grey"}></div>
                        <div className="drawer__left" >
                            <Link 
                                className="drawer__category-info" 
                                to={"/category/" + item.id} 
                                onClick={() => {this.props.toggleDrawer()}}>
                                <div className="drawer__category-icon" style={this.props.drawCategoryIcon(item)}></div>
                                <div className="drawer__category-data">
                                    <div className="drawer__category-title">{item.name}</div>
                                    <div className="drawer__category-recipes-count">{this.props.writeRecipesCount(item.id)}</div>
                                </div>
                            </Link>
                            <div className="drawer__dots-menu-btn" 
                                onClick={(event) => {this.toggleItemMenu(event.clientX, event.clientY, item)}} 
                                id={index}
                                style={{touchAction: 'auto'}}>
                            </div>
                        </div>
                    </div>
                    ))} 
            </Sortable>
            <div 
                className="wrapper-transparent-cover" 
                onClick={(event) => {this.toggleItemMenu(0, 0, '')}} 
                style={{display: this.state.display ? 'flex' : 'none'}}>
                <CategoryItemMenu
                    display={this.state.display}
                    category={this.state.item}
                    position={this.state.position}
                    deleteCategory={this.props.deleteCategory} 
                />
            </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(CategoriesList);

 