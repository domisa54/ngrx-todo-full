import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, ErrorHandler, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { StoreModule } from "@ngrx/store";
import { Action } from '@ngrx/store';
import { TodoComponent } from './todo/todo.component';
import { TodosComponent } from './todos/todos.component';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TodosService } from "./todos.service";
import { TodoListStorageService } from './todo-list-storage.service';
import { EffectsModule } from "@ngrx/effects";
import { TodosEffects } from "./todos.effects";
import { AddTodoComponent } from './add-todo/add-todo.component';
import { FiltersComponent } from "./filters/filters.component";
import { TodosPageComponent } from './todos-page/todos-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Router, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { debug } from 'util';
import { create } from "rxjs-spy";
import "rxjs-spy/add/operator/tag";

export const GET_TODOS = "GET_TODOS";
export const GET_TODOS_SUCCESS = "GET_TODOS_SUCCESS";
export const GET_TODOS_ERROR = "GET_TODOS_ERROR";
export const ADD_TODO = "ADD_TODO";
export const ADD_TODO_SUCCESS = "ADD_TODO_SUCCESS";
export const ADD_TODO_ERROR = "ADD_TODO_ERROR";
export const REMOVE_TODO = "REMOVE_TODO";
export const REMOVE_TODO_SUCCESS = "REMOVE_TODO_SUCCESS";
export const REMOVE_TODO_ERROR = "REMOVE_TODO_ERROR";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const TOGGLE_TODO_SUCCESS = "TOGGLE_TODO_SUCCESS";
export const TOGGLE_TODO_ERROR = "TOGGLE_TODO_ERROR";


export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";
export const GET_VISIBILITY_FILTER = "GET_VISIBILITY_FILTER";

const spy = create();
spy.log();

/**
   * find the index of an item in the array
   * @param id
   * @returns {number}
   */
function findIndex(id: number, todoList: Todo[]) { return todoList.map((o) => o.id).indexOf(id); }


export function setVisibilityFilter(filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    payload: filter
  }
}

export function getTodos() {
  return {
    type: GET_TODOS
  }
}

export interface Todo {
  id: number,
  title: string,
  completed: boolean,
}

export function addTodo(title) {
  return {
    type: ADD_TODO,
    payload: {
      id: Math.random(),
      title: title,
      completed: false,
    }
  }
}

export class addTodoAction implements Action {
  type = ADD_TODO;
  constructor(public payload: Todo) { }
}

export function removeTodo(todo) {
  return {
    type: REMOVE_TODO,
    payload: todo
  }
}

export class removeTodoAction implements Action {
  type = REMOVE_TODO;
  constructor(public payload: Todo) { }
}



export class toggleTodoAction implements Action {
  type = TOGGLE_TODO;
  constructor(public payload: Todo) { }
}


export function toggleTodo(todo) {
  return {
    type: TOGGLE_TODO,
    payload: todo
  }
}

const initialState = {
  data: [],
  pending: false,
  error: null
}

export function todos(state = initialState, { type, payload }) {
  switch (type) {

    case GET_TODOS:
      return Object.assign({}, state, { pending: true, error: null })

    case GET_TODOS_SUCCESS:
      console.log("Reducer > case GET_TODOS_SUCCESS > TodoList is ", payload);
      return Object.assign({}, state, { data: payload, pending: false })

    case GET_TODOS_ERROR:
      return Object.assign({}, state, { pending: false, error: "Error Get Todos" })

    case TOGGLE_TODO_SUCCESS:
      //console.log("Reducer > case TOGGLE_TODO_SUCCESS ", " payload is ",payload, " with state = ",state);
      return Object.assign({}, state, {
        data: state.data.map(todo => {
          if (todo.id === payload.id) {
            console.log("Reducer > case TOGGLE_TODO_SUCCESS ", " current Todo is ", todo, " payload is ", payload);
            //console.log("Reducer > case TOGGLE_TODO_SUCCESS ", " New state of Todo is ",Object.assign({}, todo, {completed: !todo.completed}), " with state = ", !todo.completed);

            //Créer une nouvelle copie de l'objet Todo si on veut forcer la desctruction et la recréation du composant <todo>
            //return Object.assign({},todo, {completed: !todo.completed})

            //on prend soin de changer seulement la valeur du hash #completed mais attention de prendre soin qu'il n'y ait pas de référence cachée
            return Object.assign(todo, { completed: !todo.completed })
          }
          return todo;
        })
      })

    case TOGGLE_TODO_ERROR:
      return Object.assign({}, state, { pending: false, error: "Error Toggle Todo" })

    case ADD_TODO_SUCCESS:
      console.log("Reducer > case ADD_TODO_SUCCESS ", " todo is ", payload, "source todo list is ", state.data, "final todo list is ", [...state.data, payload]);
      return Object.assign({}, state, {
        data: [...state.data, payload]
      });

    case ADD_TODO_ERROR:
      return Object.assign({}, state, { pending: false, error: "Error Add Todo" })


    case REMOVE_TODO_SUCCESS:
      console.log("Reducer > case REMOVE_TODO_SUCCESS ", " todo is ", payload, "source todo list is ", state.data, "final todo list is ", [...state.data, payload]);
      let todos: Todo[] = state.data;
      let index: number = findIndex(payload.id, todos);
      return Object.assign({}, state, {
        data: [...todos.slice(0, index), ...todos.slice(index + 1)]
      });

    case REMOVE_TODO_ERROR:
      return Object.assign({}, state, { pending: false, error: "Error Remove Todo" })

    default:
      console.log("reducer todos > default Action.type", type, " payload = ", payload, " state is ", state);
      return state;
  }
}

export function visibilityFilter(state = "SHOW_ALL", action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.payload;
    case GET_VISIBILITY_FILTER:
      return state;
    default:
      return state;
  }
}

const routes = [
  { path: "", component: HomePageComponent, patchMatch: "full" },
  { path: "todos", component: TodosPageComponent }
]

/* let hasRouterError = false;

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor(private inj: Injector) { }

  handleError(error: any): void {
    console.log('MyErrorHandler: ' + error);

    if (hasRouterError) {
      let router = this.inj.get(Router);
      router.navigated = false;
    }

    //throw error;
  }
}

export function MyRouterErrorHandler(error: any) {
  console.log('RouterErrorHandler: ' + error);
  hasRouterError = true;
  throw error;
}

export class PreventErrorRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }
  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (hasRouterError) {
      hasRouterError = false;
      return false;
    }
    return future.routeConfig === curr.routeConfig;
  }
} */

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodosComponent,
    FiltersComponent,
    AddTodoComponent,
    TodosPageComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes
     /*  , {
      errorHandler: MyRouterErrorHandler,
      enableTracing: true
    } */
  ),
    StoreModule.forRoot({ todos, visibilityFilter }),
    EffectsModule.forRoot([TodosEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [TodosService, TodoListStorageService
    /* , { provide: ErrorHandler, useClass: MyErrorHandler }, { provide: RouteReuseStrategy, useClass: PreventErrorRouteReuseStrategy } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
