import React from "react";

const ColorItem = props => {
    return (
        <div className="change-category__icons-raw">
            {props.rowColors.map((elem, index) => (
                <div
                    className="change-category__color-item"
                    key={index}
                    style={{
                        backgroundColor: elem,
                        borderColor:
                            elem === props.selectedColor ? "#d0cccc" : "#f0f0f0"
                    }}
                    onClick={() => props.changeCategoryColor(elem)}
                />
            ))}
        </div>
    );
};

export default ColorItem;
