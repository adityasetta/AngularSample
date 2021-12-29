import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Recipe 1', 'Recipe 1 and only', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg',[
      new Ingredient('Random', 2),
      new Ingredient('Other', 24),
    ]),
    new Recipe('Recipe 2', 'Recipe 2', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg',[
      new Ingredient('Random 2', 2),
      new Ingredient('Other 2', 24),
    ])
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes(){
    // Use .slice() to create separated array, not referenced
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredient: Ingredient[]){
    this.slService.addIngredients(ingredient);
  }
}
