import React, { Component } from "react";
import FlipMove from "react-flip-move";
//import PropTypes from "prop-types";

//utils
import { db } from "../../utils/firebase";

//store
import store from "../../store/store";
import { updateIngredients } from "../../ducks/menu";


class ShoppingList extends Component {
	constructor(props) {
		super(props);

		this.state = {
            recipes: this.props.menu.recipes,
	        ingredients: this.props.menu.ingredients,
            enterLeaveAnimation: 'accordionVertical',
            view: 'list'
	    }
	}

    componentWillUnmount = () => {
        let menu = {
            recipes: this.state.recipes,
            ingredients: this.state.ingredients
        }

        db.collection(this.props.uid).doc('menu').set({menu});
        store.dispatch(updateIngredients(menu));
    }

    handleChange = (event) => {
        let index = event.target.id;

        let array = this.state.ingredients;
        array[index].checked = !array[index].checked;

        array.sort((a, b) => {
          return a.checked - b.checked;
        });

        this.setState({
            ingredients: array
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
                {this.state.ingredients.map((elem, index) => (
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