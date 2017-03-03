import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  GET_TODOS, GET_TODOS_SUCCESS, GET_TODOS_ERROR, ADD_TODO, ADD_TODO_SUCCESS,
  ADD_TODO_ERROR,
  addTodoAction,
  TOGGLE_TODO,
  toggleTodoAction,
  TOGGLE_TODO_SUCCESS,
  TOGGLE_TODO_ERROR,
  REMOVE_TODO,
  removeTodoAction,
  REMOVE_TODO_SUCCESS,
  REMOVE_TODO_ERROR
} from "./app.module";
import { TodosService } from "./todos.service";
import { Store, Action } from "@ngrx/store";
import { Actions, Effect } from "@ngrx/effects";


@Injectable()
export class TodosEffects {
  constructor( private actions$ : Actions, private todosService : TodosService, private store : Store<any> ) {
  }
debugger
  @Effect() getTodos$ = this.actions$
    //.debug("Effects GetTodos$ > actions$")
    .filter(({type}) => type === GET_TODOS)
    //.ofType(GET_TODOS)
    .debug("Effects GetTodos$ > ofType GET_TODOS")
  .withLatestFrom(this.store.select("visibilityFilter"), (action, filter) => filter)
  .withLatestFrom(this.store.select("todos"))
    .debug("Effects GetTodos$ > withLatestFrom")
    .switchMap(([filter,state]) =>
      this.todosService.getTodos(filter,state)
      .debug("Effects GetTodos$ > switchmap > todosService.getTodos")
        .map(todos => ({type: GET_TODOS_SUCCESS, payload: todos}))
        .debug("Effects GetTodos$ > switchmap > dispatch Action GET_TODOS_SUCCESS")
        .catch(() => Observable.of({type: GET_TODOS_ERROR}))
      )
      .debug("Effects GetTodos$ > switchmap complete")
      .tag('getTodos$');

  @Effect() addTodo$ = this.actions$
  .debug("Effects AddTodo$ > actions$")
  .filter(({type}) => type === ADD_TODO)
  //The throttle operator takes a function that returns an observable and, until that observable emits, any values emitted by the source are throttled/ignored.

//If you pass throttle the effect itself, any actions received whilst the slow request is being handled will be ignored.
  .throttle(() => this.addTodo$)
   // .ofType(ADD_TODO)
   .debug("Effects AddTodo$ > ofType ADD_TODO")
    .switchMap((action: addTodoAction) =>
      this.todosService.addTodo(action.payload)
      .debug("Effects AddTodo$ > switchmap > todosService.AddTodo")
        .map(todo => ({type: ADD_TODO_SUCCESS, payload: todo}))
        .debug("Effects AddTodo$ > map > dispatch Action ADD_TODO_SUCCESS")
        .catch(() => Observable.of({type: ADD_TODO_ERROR})))
      .share()
        .debug("Effects AddTodo$ > switchmap complete")
        .tag('addTodo$');

        @Effect() removeTodo$ = this.actions$
        .debug("Effects removeTodo$ > actions$")
        .filter(({type}) => type === REMOVE_TODO)
        .throttle(() => this.addTodo$)
         // .ofType(REMOVE_TODO)
         .debug("Effects removeTodo$ > ofType REMOVE_TODO")
          .switchMap((action: removeTodoAction) =>
            this.todosService.removeTodo(action.payload)
            .debug("Effects removeTodo$ > switchmap > todosService.removeTodo")
              .map(todo => ({type: REMOVE_TODO_SUCCESS, payload: todo}))
              .debug("Effects removeTodo$ > map > dispatch Action REMOVE_TODO_SUCCESS")
              .catch(() => Observable.of({type: REMOVE_TODO_ERROR})))
            .share()
              .debug("Effects removeTodo$ > switchmap complete")
              .tag('removeTodo$');



  @Effect() toggleTodo$ = this.actions$
  .debug("Effects toggleTodo$ > actions$")
  .filter(({type}) => type === TOGGLE_TODO)
    //.ofType(TOGGLE_TODO)
    .throttle(() => this.toggleTodo$)
    .debug("Effects toogleTodo$ > ofType TOGGLE_TODO")
    .switchMap((action: toggleTodoAction) =>
      this.todosService.toggleTodo(action.payload)
      .debug("Effects toggleTodo$ > switchmap > todosService.toggleTodo")
      .map(todo => ({type: TOGGLE_TODO_SUCCESS, payload: todo}))
      .debug("Effects toggleTodo$ > map > dispatch Action TOGGLE_TODO_SUCCESS")
      .catch(() => Observable.of({type: TOGGLE_TODO_ERROR})))
    .share()
    .debug("Effects toggleTodo$ > switchmap complete")
    .tag('toggleTodo$');

}