import {combineReducers} from 'redux';
import recipes from './recipes';
import categories from './categories';
import login from './login';
import menu from './menu';

const reducers = {
  recipes: recipes,
  categories: categories,
  menu: menu,
  login: login,
};

export default combineReducers(reducers);
