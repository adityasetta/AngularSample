import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListAction from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private idChangeSub: Subscription;

  constructor(private slService: ShoppingListService, 
    private loggingService: LoggingService,
    private store: Store<fromShoppingList.AppState>) { }

  ngOnInit(){
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.idChangeSub = this.slService.ingredientsChanged.subscribe(
    //   (ingredients : Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );

    // this.loggingService.printLog('From ShoppingListComponent ngOnInit');
  }

  onEditItem(index: number){
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListAction.StartEdit(index));
  }

  ngOnDestroy(): void {
      // this.idChangeSub.unsubscribe();
  }
}
