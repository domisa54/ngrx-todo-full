import { Injectable } from '@angular/core';
import { Todo } from 'app/app.module';

const storageName = 'reyren_todo_list';
const defaultTodoList = [
  {id: 1, title: "Learn ngrx/store", completed: true}, 
  {id: 2, title: "Learn ngrx/effects", completed: false,}
];

@Injectable()
export class TodoListStorageService {

  private _todoList: Todo[];
  

  constructor() {
    this._todoList = JSON.parse(localStorage.getItem(storageName)) ||  defaultTodoList;
   }

  /**
   * get items
   * @returns {any[]}
   */
  
    get() : Todo[] {
      return [...this._todoList];
    }

  /**
   * Add a new todo item
   * @param item
   * @returns Todo[{todo}]
   */
  post(todo:Todo) : Todo[] {
    this._todoList.push(todo);
    return this._update();
  }
  
  /**
   * Syncronize the local storage with the current list
   * @returns Todo[{todo}]
   */

  private _update(): Todo[] {
    localStorage.setItem(storageName, JSON.stringify(this._todoList));

    return this.get();
  }

/**
   * find the index of an item in the array
   * @param id
   * @returns {number}
   */
  private _findIndex = (id) => this._todoList.map((o) => o.id).indexOf(id);

  /**
   * Update an existing item
   * @param id
   * @param changes
   * @returns Todo[{todo}]
   */
  put(id: number, changes:Todo) : Todo[] {
    Object.assign(this._todoList[this._findIndex(id)], changes);
    return this._update();
  }

  /**
   * Remove an item from the list
   * @param id
   * @returns Todo[{todo}]
   */
  destroy(id: number) : Todo[] {
    this._todoList.splice(this._findIndex(id), 1);
    return this._update();
  }


}
