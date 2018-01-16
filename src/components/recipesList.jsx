import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import settings from "../config";

const mapStateToProps = state => {
    return {
        
    };
};

const Overlay = props => {
	let display = props.alertBoxDisplayArray[props.index] ? 'flex' : 'none';
    return (
    	<div 
    		className="category__alert-box-wrapper"
    		style={{display: display}}
    		>
	        <div 
	            className="wrapper-transparent-cover" 
	            onClick={(event) => {
	            	event.preventDefault(); 
	            	event.stopPropagation(); 
	            	props.resetAlertBoxes()}
	            }>
        	</div>
        	<div 
                className="category__alert-box">
                <div className="category__alert-message">Добавить рецепт в меню?</div>
                <div 
                	className="category__alert-confirm-btn" 
                	onClick={(event) => {
		            	event.preventDefault(); 
		            	event.stopPropagation(); 
		            	props.resetAlertBoxes();
                        console.log('to add menu functionality');}
		        	}>
		        </div>
            </div>
        </div>
    )
}

const Items = (props) => {
    return (
        <div className="category__list-row">
         {props.rowData.map((elem, index) => (
	        <Link
	        	style={{visibility: elem === undefined ? 'hidden' : 'visible'}} 
	        	key={props.rowIndex * 2 + index}
	            className="category__list-item" 
	            to={{pathname: "/recipe", state: {recipe: props.recipes[props.rowIndex * 2 + index]}}}
	            onTouchStart={() => props.handleRecipeLongPress(props.rowIndex * 2 + index)}
	            onTouchEnd={() => props.handleRecipeRelease}>
	            <div className="category__list-image" style={props.addStyle(props.recipes[props.rowIndex * 2 + index], props.rowIndex * 2 + index)}></div>
	            <div className="category__list-title">{props.addTitle(props.recipes[props.rowIndex * 2 + index])}</div>
	            <Overlay 
	                alertBoxDisplayArray={props.alertBoxDisplayArray}
	                resetAlertBoxes={props.resetAlertBoxes}
	                index={props.rowIndex * 2 + index}
	            />
	        </Link>
	        ))}
        </div>
    )
}

class RecipesList extends Component {
	constructor(props) {
		super(props);

		this.state = {
	        alertBox: this.props.recipes.map(elem => false)
	    }
	}

	componentWillUnmount = () => {
		clearTimeout(this.longPressTimer);
	}

    handleRecipeLongPress = (index) => {
        this.longPressTimer = setTimeout(() => {
            this.setState({
                alertBox: this.state.alertBox.map((elem, i) => (i === index) ? true : false)
            })
    	}, 1000);        	
    }

    handleRecipeRelease = () => {
        clearTimeout(this.longPressTimer);
    }

    alertBoxDisplay = (index) => {
    	return this.state.alertBox[index] === true ? "flex" : "none";
    }

    resetAlertBoxes = () => {
    	clearTimeout(this.longPressTimer);
        this.setState({
            alertBox: this.state.alertBox.map(elem => false)
        });
    }

    addStyle = item => {
        if (item) return ({
            backgroundImage: (item.image === '') ? 'url(' + settings.defaultCategory.icon + ')' : item.image,
            backgroundSize: (item.image === '') ? '50%' : 'cover',
            backgroundColor: this.props.color
        })
    }

    addTitle = item => {
        if (item) return item.title;
    }

    hideEmpty = item => {
        if (!item) return ({
            visibility: 'hidden'
        })
    }

    render() {
        let table = [];
        let itemsPerRow = 2;

        for (let i = 0; i < Math.round(this.props.recipes.length / itemsPerRow); i++) {
            let row = [];
            for (let j = 0; j < itemsPerRow; j++) {
                row.push(this.props.recipes[i * itemsPerRow + j]);
            }
            table.push(row);
        }

        return (
             <div className="category__list">
                {table.map((item, index) => (
                   <div key={index}>
                         <Items
                         	recipes={this.props.recipes}
                         	rowIndex={index}
                            rowData={item}
                            onTouchStart={this.handleRecipeLongPress}
	            			onTouchEnd={this.handleRecipeRelease}
	            			alertBoxDisplayArray={this.state.alertBox}
	                		resetAlertBoxes={this.resetAlertBoxes}
	                		addTitle={this.addTitle}
	                		addStyle={this.addStyle}
	                		handleRecipeLongPress={this.handleRecipeLongPress}
	                		handleRecipeRelease={this.handleRecipeRelease}
                            /> 
                    </div>
                 ))}
            </div>
            
        );
    }
}




/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(RecipesList);