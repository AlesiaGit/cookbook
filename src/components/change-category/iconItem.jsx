import React from "react";

const IconItem = props => {
    return (
        <div className="change-category__icons-raw">
            {props.rowIcons.map((elem, index) => (
                <div
                    key={index}
                    className="change-category__icon-item-wrapper"
                    style={{
                        backgroundColor:
                            elem === props.selectedIcon ? "#d0cccc" : "#f0f0f0"
                    }}
                >
                    <div
                        className="change-category__icon-item"
                        style={{
                            WebkitMaskImage: "url(" + elem + ")",
                            backgroundColor: props.color
                        }}
                        onClick={() => props.changeCategoryIcon(elem)}
                    />
                </div>
            ))}
        </div>
    );
};

export default IconItem;
