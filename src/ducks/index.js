import {combineReducers} from 'redux';
import recipes from './recipes';
import categories from './categories';
import menu from './menu';
import login from './login';

const reducers = {
  recipes: recipes,
  categories: categories,
  menu: menu,
  login: login
};

export default combineReducers(reducers);
