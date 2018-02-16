import React from "react";
import { Link } from "react-router-dom";

//components
import CategoriesList from "./categoriesList";

//utils
import settings from "../../config";

const Drawer = props => {
    return (
        <div style={{ display: props.drawerDisplay }}>
            <div
                className="wrapper-transparent-cover"
                onClick={() => props.toggleDrawer()}
            />
            <div className="category__side-overlay-menu drawer">
                <Link
                    className="drawer__category-wrapper menu"
                    to="/menu"
                    style={{
                        backgroundColor:
                            settings.menuCategory.id ===
                            props.selectedCategory.id
                                ? "#f0f0f0"
                                : "#ffffff"
                    }}
                >
                    <div className="drawer__category-info">
                        <div
                            className="drawer__category-icon"
                            style={props.drawCategoryIcon(
                                settings.menuCategory
                            )}
                        />
                        <div className="drawer__category-data">
                            <div className="drawer__category-title">
                                {settings.menuCategory.name}
                            </div>
                        </div>
                    </div>
                </Link>
                <Link
                    className="drawer__category-wrapper all-recipes"
                    to="/"
                    style={{
                        backgroundColor:
                            settings.defaultCategory.id ===
                            props.selectedCategory.id
                                ? "#f0f0f0"
                                : "#ffffff"
                    }}
                >
                    <div className="drawer__category-info">
                        <div
                            className="drawer__category-icon"
                            style={props.drawCategoryIcon(
                                settings.defaultCategory
                            )}
                        />
                        <div className="drawer__category-data">
                            <div className="drawer__category-title">
                                {settings.defaultCategory.name}
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="drawer__categories-wrapper">
                    <div className="drawer__categories-header">
                        <div className="drawer__categories-title">
                            Категории
                        </div>
                        <Link
                            className="drawer__add-category"
                            to={"/add-category/c" + Date.now()}
                        />
                    </div>
                    <CategoriesList
                        id={props.id}
                        drawerDisplay={props.drawerDisplay}
                        drawCategoryIcon={props.drawCategoryIcon}
                        writeRecipesCount={props.writeRecipesCount}
                        deleteCategory={props.deleteCategory}
                        selectedCategory={props.selectedCategory}
                        toggleDrawer={props.toggleDrawer}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawer;
