import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private idChangeSub: Subscription;

  constructor(private slService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnInit(){
    this.ingredients = this.slService.getIngredients();
    this.idChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients : Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );

    this.loggingService.printLog('From ShoppingListComponent ngOnInit');
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
      this.idChangeSub.unsubscribe();
  }
}
