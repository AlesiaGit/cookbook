import React, { Component } from "react";
import FlipMove from "react-flip-move";
//import PropTypes from "prop-types";

//components
//import MenuItems from "./menuItems";

//utils
//import settings from "../../config";
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
//import { deleteFromMenu } from "../../ducks/menu";
import { shoppingListCreated } from "../../ducks/shopping-list";

/*const mapStateToProps = state => {
    return {
        menu: state.menu,
        login: state.login,
        shoppingList: state.shoppingList
    };
};*/

class ShoppingList extends Component {
	constructor(props) {
		super(props);

		this.state = {
	        ingredients: this.props.menuRecipes.map(elem => elem = elem.ingredients),
            enterLeaveAnimation: 'accordionVertical',
            view: 'list'
	    }

	}

    componentWillMount = () => {
        let a = this.props.menuRecipes.map(elem => elem = elem.id);
        let b = this.props.shoppingList.recipes;
        let result = this.checkArrays(a, b);
        if (this.props.shoppingList.recipes.length === 0 || !result) {
            let concat = [];
            this.state.ingredients.forEach(elem => { 
                elem.forEach(item => {
                    concat.push(item);
                })
            })

            let namesArray = [];
            concat.forEach(elem => namesArray.push(Object.values(elem)[0]));

            let uniqueNames = [...new Set(namesArray)].sort(); 

            let test = uniqueNames.map(elem => {
                let array = concat.filter(item => item.ingredientName === elem);
                let quantity = array.map(item => item = parseInt(item.ingredientQuantity, 10)).reduce((sum, obj) => sum + obj);
                let units = array[0].ingredientUnits;

                return elem = {name: elem, quantity: quantity, units: units, checked: false};
            })

            this.setState({
                mergedIngredients: test,
            })
        }

        else {
            this.setState({
                mergedIngredients: this.props.shoppingList.ingredients
            })
        }
    }

    componentWillUnmount = () => {
        let shoppingList = {
            recipes: this.props.menuRecipes.map(elem => elem = elem.id),
            ingredients: this.state.mergedIngredients
        };
        db.collection(this.props.uid).doc('shopping-list').set({shoppingList});
        store.dispatch(shoppingListCreated(shoppingList));
    }

    checkArrays = (a, b) => {
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }

        return true;
    }

    handleChange = (event) => {
        let index = event.target.id;

        let array = this.state.mergedIngredients;
        array[index].checked = !array[index].checked;

        array.sort((a, b) => {
          return a.checked - b.checked;
        });

        this.setState({
            mergedIngredients: array
        })
    }

    render() {
        return (
             <FlipMove 
                staggerDurationBy="20"
                duration={700}
                enterAnimation='accordionVertical'
                leaveAnimation='accordionVertical'
                typeName="div"
             >
                {this.state.mergedIngredients.map((elem, index) => (
                    <div 
                        key={elem.name} 
                        className="shopping-list__item" 
                        view={this.state.view} 
                        style={{backgroundColor: elem.checked ? "#c8c8c8" : "#ffffff"}}
                    >
                        <input type="checkbox" className="shopping-list__item-checkbox" checked={elem.checked} onChange={this.handleChange} id={index} />
                        <div>{elem.name + ' - ' + elem.quantity + ' ' + elem.units}</div>
                    </div>
                ))}
            </FlipMove>
            
        );
    }
}

/*Game.propTypes = {
    location: PropTypes.string
};*/

export default ShoppingList;