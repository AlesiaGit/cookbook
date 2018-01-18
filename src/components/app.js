import React, { Component } from 'react';
import './app.css';

import {Route, /*Switch,*/ HashRouter} from "react-router-dom";

import Category from "./category";
import AddCategory from "./addCategory";
import ChangeCategory from "./changeCategory";
import Recipe from "./recipe";
import AddRecipe from "./addRecipe";
import ChangeRecipe from "./changeRecipe";
import Menu from "./menu";



class App extends Component {
  	render() {
        return (
            <HashRouter>
                <div>
                    <Route exact path="/" component={Category} />
                    <Route path="/change-category" component={ChangeCategory} />
                    <Route path="/add-category" component={AddCategory} />
                    <Route path="/change-recipe" component={ChangeRecipe} />
                    <Route path="/add-recipe" component={AddRecipe} />
                    <Route path="/recipe" component={Recipe} />
                    <Route path="/menu" component={Menu} />
                </div>
            </HashRouter>
        );
    }
}

export default App;

