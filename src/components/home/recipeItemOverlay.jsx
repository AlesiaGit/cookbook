import React from "react";

const RecipeItemOverlay = props => {
    let display = props.alertBoxDisplayArray[props.index] ? "flex" : "none";
    return (
        <div
            className="category__alert-box-wrapper"
            style={{ display: display }}
        >
            <div
                className="wrapper-transparent-cover"
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    props.resetAlertBoxes();
                }}
            />
            <div className="category__alert-box">
                <div className="category__alert-message">
                    {props.showMenuMessage(props.item)}
                </div>
                <div
                    className="category__alert-confirm-btn"
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        props.resetAlertBoxes();
                        props.handleRecipeMenuToggle(props.item);
                    }}
                />
            </div>
        </div>
    );
};

export default RecipeItemOverlay;
