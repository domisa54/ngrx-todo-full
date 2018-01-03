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
  private _subscriptionToRemoveToSucess: ISubscription;
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

  constructor(private store: Store < any > , private todosEffects: TodosEffects, private actions$: Actions) {

    this.store.dispatch(getTodos());

    this.activeFilter$ = store.select("visibilityFilter").take(1);

    // We get a reference on a Observable for reducer todos which return a new or current state
    //store.select() internally uses distinctUntilChanged(), meaning it will only fire when the state actually changes. 
    // the todos[] payload are stored in the hash data: of the state
    this.todos$ = store.select("todos");

    // todoEffects.addTodos completes by emiiting TOGGLE_TODO_SUCCESS Action
    this.addTodoSuccess$ = this.todosEffects.addTodo$
      //this.addTodoSuccess$ = this.actions$
      .filter(({
        type
      }) => type === ADD_TODO_SUCCESS).tag('addTodoSuccess$');

    this._subscriptionToAddToSucess = this.addTodoSuccess$.subscribe(action =>
      console.log("Todo Page > addTodoSuccess$ Action =", action)
    )


    //this.toggleTodoSuccess$ = this.todosEffects.toggleTodo$
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
    this._subscriptionToAddToSucess.unsubscribe();
    this._subscriptionToToggleToSucess.unsubscribe();

  }

  /* ngOnChanges() {
      let subscription = this.todos$.subscribe( state => 
      console.log("ngOnChanges - data are : ",state));
      subscription.unsubscribe();
    }
  
    ngAfterContentInit() {
      let subscription = this.todos$.subscribe( state => 
        console.log("ngAfterContentInit",state));
        subscription.unsubscribe();
    }
  
    ngAfterContentChecked() {
      let subscription = this.todos$.subscribe( state => 
        console.log("ngAfterContentChecked",state));
        subscription.unsubscribe();
    }
  
    ngAfterViewInit() {
      let subscription = this.todos$.subscribe( state => 
        console.log("ngAfterViewInit",state));
        subscription.unsubscribe();
    }
  
    ngAfterViewChecked() {
      let subscription = this.todos$.subscribe( state => 
        console.log("ngAfterViewChecked",state));
        subscription.unsubscribe();
    } */


}
