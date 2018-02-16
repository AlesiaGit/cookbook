import React from "react";

const HeaderMenu = props => {
    return (
        <div style={{ display: props.headerMenuDisplay }}>
            <div
                className="wrapper-transparent-cover"
                onClick={() => props.toggleHeaderMenu()}
            />
            <div className="menu__header-overlay-menu">
                <div
                    className="menu__header-overlay-menu-item"
                    onClick={() => props.deleteMenu()}
                >
                    Удалить меню
                </div>
                <div
                    className="menu__header-overlay-menu-item"
                    onClick={() => props.toggleMenuList()}
                >
                    {props.menuList ? "Список покупок" : "Показать меню"}
                </div>
            </div>
        </div>
    );
};

export default HeaderMenu;
