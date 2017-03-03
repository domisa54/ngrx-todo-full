import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodosComponent implements OnInit, OnDestroy{
  
  private _toggleTodo: any;
  private  _subscriptionToToggleCompleted : ISubscription;
  
  toggleBoolean

  @Input() todos;
  
  @Output() toggle = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();

  public get toggleTodo(): any {
    // transform value for display
    return this._toggleTodo;
  }
 
  @Input()
  public set toggleTodo(action) {
    if (action) {
      //console.log("todos List Component > @input set toogleTodo > toggleTodoSuccess$  Action ",action, "id =",action.payload.id);

     //this._toggleTodo = action.payload.id;
     this._toggleTodo = Observable.of(action.payload.id)
      //.debug("toggleCompleted$")
     .tag("toggleCompleted$");
      
    }
    else {
      //this._toggleTodo = null;
      this._toggleTodo = Observable.of(null).tag("toggleCompleted$");
    }
  }

  ngOnInit(){
    
    console.log("Initialisation Todo List component ...");
}

ngOnDestroy() {
  if (this._subscriptionToToggleCompleted) this._subscriptionToToggleCompleted.unsubscribe();
  console.log("todos List component destroyed : ");
    }


}
