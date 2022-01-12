import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListAction from './shopping-list.action';

const initialState = {
    ingredients : [
        new Ingredient('Baju', 5),
        new Ingredient('Tomato', 1),
        new Ingredient('Test', 33),
      ]
};

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListAction.ShoppingListActions) {
    switch(action.type){
        case ShoppingListAction.ADD_INGREDIENT:
            console.log('masoook');
            console.log(action.payload);
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListAction.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        default:
            return state;
    }
}