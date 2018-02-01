import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Sortable from "sortablejs";
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
            display: this.props.categories.array.map(elem => false),
            categoriesFromDom: this.props.categories.array
        }
    }
    

    componentDidMount = () => {
        Sortable.create(this.sortable, {
            onEnd: (evt) => {
                let children = evt.to.childNodes;
                let categories = [];

                for (var i = 0; i < children.length; i++) {
                    for (var j = 0; j < this.props.categories.array.length; j++) {
                        if (this.props.categories.array[j].id === children[i].id) {
                            categories.push(this.props.categories.array[j]);
                        }
                    }
                }

                this.setState({
                    categoriesFromDom: categories
                })
            }
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.categoriesFromDom !== nextProps.categories.array) {
            this.setState({
                categoriesFromDom: nextProps.categories.array,
                display: nextProps.categories.array.map(elem => false)
            })
        }
    }

    componentWillUnmount = () => {
        let categories = this.state.categoriesFromDom;
        store.dispatch(addCategory(categories));
        db.collection(this.props.login.uid).doc('categories').set({categories});
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
            },
        });
    }

    render() {
        return (
            <div ref={sortable => this.sortable = sortable} >
            {this.props.categories.array.map((item, index) => (
                <div 
                    className="drawer__category-wrapper" 
                    key={index} 
                    id={item.id}
                    style={{backgroundColor: (item === this.props.selectedCategory) ? "#f0f0f0" : "#ffffff"}}
                    >
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
                                categoriesFromDom={this.state.categoriesFromDom}
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