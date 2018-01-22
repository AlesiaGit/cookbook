import React from "react";
import { Link } from "react-router-dom";

const HeaderMenu = props => {
    return (
        <div style={{display: props.headerMenuDisplay}}>
            <div 
                className="wrapper-transparent-cover" 
                onClick={() => props.toggleHeaderMenu()}
            ></div>
            <div className="category__header-overlay-menu">
                <Link 
                    to="/" 
                    className="category__header-overlay-menu-item" 
                    onClick={() => props.deleteCategory(props.selectedCategory)}>
                    Удалить
                </Link>
                <Link 
                    to={"/change-category/" + props.id}
                    className="category__header-overlay-menu-item"
                    >
                    Изменить
                </Link>
            </div>
        </div>
    )
}

export default HeaderMenu;