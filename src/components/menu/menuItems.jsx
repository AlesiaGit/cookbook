import React from "react";
import { Link } from "react-router-dom";
import MenuOverlay from "./menuOverlay";

const MenuItems = props => {
    return (
        <div className="category__list-row">
            {props.rowData.map((elem, index) => (
                <Link
                    style={{
                        visibility: elem === undefined ? "hidden" : "visible"
                    }}
                    key={props.rowIndex * 2 + index}
                    className="category__list-item"
                    to={
                        elem === undefined
                            ? "/"
                            : "/recipe/" +
                              props.recipes[props.rowIndex * 2 + index].id
                    }
                    onTouchStart={() =>
                        props.handleRecipeLongPress(props.rowIndex * 2 + index)
                    }
                    onTouchEnd={() => props.handleRecipeRelease()}
                >
                    <div
                        className="category__list-image"
                        style={props.addStyle(
                            props.recipes[props.rowIndex * 2 + index],
                            props.rowIndex * 2 + index
                        )}
                    />
                    <div className="category__list-info-wrapper">
                        <div
                            className="category__list-icon"
                            style={props.addIcon(
                                props.recipes[props.rowIndex * 2 + index]
                            )}
                        />
                        <div className="category__list-title">
                            {props.addTitle(
                                props.recipes[props.rowIndex * 2 + index]
                            )}
                        </div>
                    </div>
                    <MenuOverlay
                        alertBoxDisplayArray={props.alertBoxDisplayArray}
                        resetAlertBoxes={props.resetAlertBoxes}
                        item={props.recipes[props.rowIndex * 2 + index]}
                        index={props.rowIndex * 2 + index}
                        deleteRecipeFromMenu={props.deleteRecipeFromMenu}
                    />
                </Link>
            ))}
        </div>
    );
};

export default MenuItems;
