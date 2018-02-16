import React, { Component } from "react";

import settings from "../../config";
import ColorItem from "./colorItem";

class ColorsTable extends Component {
    addColor = (rowNumber, index) => {
        return settings.colors[rowNumber * 5 + index];
    };

    render() {
        let colorsArray = [];
        let itemsPerRow = 5;

        for (
            let i = 0;
            i < Math.round(settings.colors.length / itemsPerRow);
            i++
        ) {
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
                        <ColorItem
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

export default ColorsTable;
