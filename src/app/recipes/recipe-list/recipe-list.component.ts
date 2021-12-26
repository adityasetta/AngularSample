import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('Recipe 1', 'Recipe 1 and only', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg'),
    new Recipe('Recipe 2', 'Recipe 2', 'https://image.freepik.com/free-psd/recipe-notebook-pasta-arrangement_23-2148591861.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe);
  }
}
