import React, { Component } from "react";
//import { Link } from "react-router-dom";
//import { connect } from "react-redux";
//import PropTypes from "prop-types";

import settings from "../config";

const Items = (props) => {
    return (
        <div className="change-category__icons-raw" >
            {props.rowColors.map((elem, index) => (
                <div 
                    className="change-category__color-item" 
                    key={index} 
                    style={{backgroundColor: elem, borderColor: elem === props.selectedColor ? '#d0cccc' : '#f0f0f0'}} 
                    onClick={() => props.changeCategoryColor(elem)} >
                </div>
            ))}
        </div> 
    )
}

class ColorsTable extends Component {

    addColor = (rowNumber, index) => {
        return settings.colors[rowNumber * 5 + index];
    }

    render() {
       let colorsArray = [];
       let itemsPerRow = 5;

       for (let i = 0; i < Math.round(settings.colors.length / itemsPerRow); i++) {
            let rowColors = [];
            for (let j = 0; j < itemsPerRow; j++) {
                rowColors.push(settings.colors[i * itemsPerRow + j]);
            }
            colorsArray.push(rowColors);
       }

        return (
             <div className="category__list">
                {colorsArray.map((item, index) => (
                    <div key={index}>
                        <Items 
                            rowColors={item}
                            selectedColor={this.props.selectedColor}
                            changeCategoryColor={this.props.changeCategoryColor} 
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

export default ColorsTable;