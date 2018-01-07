import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Store
} from "@ngrx/store";
import {
  Observable
} from "rxjs";
import {
  getTodos,
  ADD_TODO_SUCCESS,
  setVisibilityFilter,
  toggleTodo,
  addTodo,
  TOGGLE_TODO_SUCCESS,
  REMOVE_TODO_SUCCESS,
  removeTodo
} from "../app.module";
import {
  TodosEffects
} from "../todos.effects";
import {
  debug
} from 'util';
import {
  ISubscription
} from 'rxjs/Subscription';
import {
  Actions
} from '@ngrx/effects';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html'
})
export class TodosPageComponent implements OnInit, OnDestroy {

  todos$: Observable < any > ;
  activeFilter$: Observable < any > ;
  addTodoSuccess$: Observable < any > ;
  toggleTodoSuccess$: Observable < any > ;
  private _subscriptionToAddToSucess: ISubscription;
  private _subscriptionToToggleToSucess: ISubscription;
  count: number = 0;

  filters = [{
    id: "SHOW_ALL",
    title: "All"
  }, {
    id: "SHOW_COMPLETED",
    title: "Completed"
  }, {
    id: "SHOW_ACTIVE",
    title: "Active"
  }];

  constructor(
    private store: Store < any > , 
    private todosEffects: TodosEffects, 
    private actions$: Actions
  ) {

    this.store.dispatch(getTodos());

    this.activeFilter$ = store.select("visibilityFilter").take(1);

  
    this.todos$ = store.select("todos");

    
    this.addTodoSuccess$ = this.todosEffects.addTodo$
      .filter(({
        type
      }) => type === ADD_TODO_SUCCESS).tag('addTodoSuccess$');

    this._subscriptionToAddToSucess = this.addTodoSuccess$.subscribe(action =>
      console.log("Todo Page > addTodoSuccess$ Action =", action)
    )


   
    this.toggleTodoSuccess$ = this.actions$
      .filter(({
        type
      }) => type === TOGGLE_TODO_SUCCESS).tag('toggleTodoSuccess$');

    this._subscriptionToToggleToSucess = this.toggleTodoSuccess$.subscribe(action =>
      console.log("Todo Page > toggleTodoSuccess$ Action = ", action)
    )

  }

  changeFilter(filter) {
    this.store.dispatch(setVisibilityFilter(filter));
    // Refresh of the displaying
    this.store.dispatch(getTodos());
  }

  toggle(todo) {
    console.log("dispatch toggleTodo in todo-page avec payload ", todo, "completed = ", todo.completed);
    this.store.dispatch(toggleTodo(Object.assign({}, todo)));

    // Si toogle une TODO quand le filtre 'completed' ou 'active est activé, on relance l'affichage après un délai de 0,5 sec environ

    this.refreshDisplay(["SHOW_COMPLETED", "SHOW_ACTIVE"], 500)
  }

  addTodo(todo) {
    console.log("dispatch Action addTodo in todo-page avec count = ", ++this.count, " pour la todo ", todo)
    this.store.dispatch(addTodo(todo));

    // Si ajoute un todo quand le filtre 'completed' est activé, on relance l'affichage après un délai de 1,5 sec environ
    this.refreshDisplay(["SHOW_COMPLETED"], 1500)

  }

  remove(todo) {
    console.log("dispatch Action removeTodo in todo-page for todo", todo);
    this.store.dispatch(removeTodo(todo));
    // Refresh of the displaying
    //this.store.dispatch(getTodos());
  }

  // conditions est un tableau Array de strings Filters
  refreshDisplay(conditions: string[], timeout) {
    let subscription = this.activeFilter$.subscribe(
      (filter) => {
        if (conditions.some(f => f === filter)) {
          let timeoutId = setTimeout(() => {
            this.store.dispatch(getTodos());
            clearTimeout(timeoutId);
          }, timeout);
        }
      }
    )
    subscription.unsubscribe();
  }

  ngOnInit() {
    console.log("Initialisation Todos Page component");
    //debugger
  }

  ngOnDestroy() {
    if (this._subscriptionToAddToSucess)this._subscriptionToAddToSucess.unsubscribe();
    if (this._subscriptionToToggleToSucess)this._subscriptionToToggleToSucess.unsubscribe();
  }

}
