import {combineReducers} from 'redux';
import recipes from './recipes';
import categories from './categories';
import menu from './menu';

const reducers = {
  recipes: recipes,
  categories: categories,
  menu: menu
};

export default combineReducers(reducers);
