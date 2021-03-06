import { EventEmitter, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListAction from "../shopping-list/store/shopping-list.action";
import * as fromApp from '../store/app.reducer';


@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Recipe 1', 'Recipe 1 and only', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg',[
  //     new Ingredient('Random', 2),
  //     new Ingredient('Other', 24),
  //   ]),
  //   new Recipe('Recipe 2', 'Recipe 2', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg',[
  //     new Ingredient('Random 2', 2),
  //     new Ingredient('Other 2', 24),
  //   ])
  // ];

  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(){
    // Use .slice() to create separated array, not referenced
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredient: Ingredient[]){
    // this.slService.addIngredients(ingredient);
    this.store.dispatch(new ShoppingListAction.AddIngredients(ingredient));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
