import React, { Component } from 'react';
import './app.css';

import {Route, Switch} from "react-router-dom";

import Category from "./category";
import AddCategory from "./addCategory";
import ChangeCategory from "./changeCategory";
import Recipe from "./recipe";
import AddRecipe from "./addRecipe";
import ChangeRecipe from "./changeRecipe";



class App extends Component {
  	render() {
        return (
            <Switch>
                <Route exact path="/" component={Category} />
                <Route path="/change-category" component={ChangeCategory} />
                <Route path="/add-category" component={AddCategory} />
                <Route path="/change-recipe" component={ChangeRecipe} />
                <Route path="/add-recipe" component={AddRecipe} />
                <Route path="/recipe" component={Recipe} />
            </Switch>
        );
    }
}

export default App;
