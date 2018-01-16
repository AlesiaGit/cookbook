import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

import settings from "../config";

const mapStateToProps = state => {
    return {
        
    };
};


const Items = (props) => {

    return (
        <div className="change-category__icons-raw" >
            {props.rowIcons.map((elem, index) => (
                <div 
                    key={index}
                    className="change-category__icon-item-wrapper" 
                    style={{backgroundColor: elem === props.selectedIcon ? '#d0cccc' : '#f0f0f0'}}>
                    <div 
                        className="change-category__icon-item" 
                        style={{WebkitMaskImage: "url(" + elem + ")", backgroundColor: props.color }} 
                        onClick={() => props.changeCategoryIcon(elem)}></div>
                </div>
            ))}
        </div> 
    )
}

class IconsTable extends Component {


    render() {
       let iconsArray = [];
       let itemsPerRow = 5;

       for (let i = 0; i < Math.round(settings.icons.length / itemsPerRow); i++) {
            let rowIcons = [];
            for (let j = 0; j < itemsPerRow; j++) {
                rowIcons.push(settings.icons[i * itemsPerRow + j]);
            }
            iconsArray.push(rowIcons);
       }

        return (
             <div className="category__list">
                {iconsArray.map((item, index) => (
                    <div key={index}>
                         <Items 
                            rowIcons={item} 
                            color={this.props.color}
                            selectedIcon={this.props.selectedIcon} 
                            changeCategoryIcon={this.props.changeCategoryIcon} />
                    </div>
                ))}
            </div>
        );
    }
}


/*Game.propTypes = {
    location: PropTypes.string
};*/

export default connect(mapStateToProps)(IconsTable);