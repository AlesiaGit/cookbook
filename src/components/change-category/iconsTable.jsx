import React, { Component } from "react";

import settings from "../../config";
import IconItem from "./iconItem";

class IconsTable extends Component {
    render() {
        let iconsArray = [];
        let itemsPerRow = 5;

        for (
            let i = 0;
            i < Math.round(settings.icons.length / itemsPerRow);
            i++
        ) {
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
                        <IconItem
                            rowIcons={item}
                            color={this.props.color}
                            selectedIcon={this.props.selectedIcon}
                            changeCategoryIcon={this.props.changeCategoryIcon}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default IconsTable;
