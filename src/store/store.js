import { createStore } from "redux";
import reducer from "../ducks/index";

let store = createStore(reducer);

export default store;
