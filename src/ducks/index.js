import {combineReducers} from 'redux';
import recipes from './recipes';
import categories from './categories';
import menu from './menu';
import login from './login';
import shoppingList from './shopping-list';

const reducers = {
  recipes: recipes,
  categories: categories,
  menu: menu,
  login: login,
  shoppingList: shoppingList
};

export default combineReducers(reducers);
