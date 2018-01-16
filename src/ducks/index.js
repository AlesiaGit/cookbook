import {combineReducers} from 'redux';
import test from './test';
import recipes from './recipes';
import categories from './categories';
import selectedCategory from './selected-category';
import selectedRecipe from './selected-recipe';
import tempData from './temp-data';
import menu from './menu';

const reducers = {
  testReducer: test,
  recipes: recipes,
  categories: categories,
  selectedCategory: selectedCategory,
  selectedRecipe: selectedRecipe,
  tempData: tempData,
  menu: menu
};

export default combineReducers(reducers);
