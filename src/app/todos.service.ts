import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { TodoListStorageService } from './todo-list-storage.service';
import { debug } from 'util';
import { Todo } from 'app/app.module';

@Injectable()
export class TodosService {
  
  private _counter = 0;

  constructor(private storage:TodoListStorageService) {
  }

  getTodos(filter, state?) {
   /* Faire attention à faire une deep shadow copy
   afin de ne passer aucune référence à un objet
   mais uniquement copier les valeurs
    } */
    let _todos = this.storage.get();
    console.log("Todos Service > getTodos > data _todos : ",_todos)

    return Observable.timer(2000)
      .mapTo(this.getVisibleTodos(this._deepCopy(_todos), filter))
  }

  addTodo( todo ) {
    return Observable.timer(1500)
      .mapTo(todo)
      .do((todo) => {
        console.log("Service AddTodo - Count",++this._counter);
        // Faire attention à passer une copie par valeur afin d'éviter de passer une référence.
       //this._todos.push(this._deepCopy(todo));

       this.storage.post(this._deepCopy(todo));

        console.log("Added todo",todo," in ",this.storage.get() );
      })
  }


  removeTodo( todo ) {
    return Observable.timer(1000)
    .mapTo(todo)
    .do((todo) => {

      this.storage.destroy(todo);

      console.log("Removed todo",todo," out of this new TodoList ",this.storage.get() );
    })
  }

  toggleTodo(todo) {
    let _todos = this.storage.get();
    return Observable.timer(500)
    .mapTo(todo)
    .do((todo) => {
      todo.completed = !todo.completed;
      this.storage.put(todo.id, todo);
      console.log("Service toogleTodo done ",todo, "completed is ",todo.completed);
      /* _todos.map(
        currentTodo => {
          if (currentTodo.id === todo.id) {
            currentTodo.completed = !currentTodo.completed;
            console.log("Service toogleTodo done ",currentTodo, "completed is ",currentTodo.completed);
          }
        }
      ) */
    })
  }

  getVisibleTodos( todos, filter ) {
    if( filter === "SHOW_ALL" ) {
      return [...todos];
    } else if( filter === "SHOW_COMPLETED" ) {
      return [...todos.filter(t => t.completed)];
    } else {
      return [...todos.filter(t => !t.completed)];
    }
  }

  private _deepCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

}
