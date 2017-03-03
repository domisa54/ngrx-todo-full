import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'add-todo',
  template: `<input type="text" placeholder="Add todo.." [formControl]="control">
             <button (click)="add.next(control.value)">Add</button>
             <p>{{titi}} et {{toto}}</p>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddTodoComponent implements OnInit, OnDestroy{

  count : number = 0;

  timeoutId ;

  toto : string = "Dominique";

  control : FormControl = new FormControl("");
  
  @Output() add = new EventEmitter();

  @Input() titi : string;

  @Input()
  public set reset( value : boolean ) {
    if (value) console.log("add-todo.component Reset count = ",++this.count,"value is ", value);
    
    value && this.control.reset();
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
console.log("Initialisation Add Todo Component" )
    
    console.log ("titi 1 : ", this.titi);
    this.timeoutId = setTimeout(() => { 
      this.titi = String("Isabelle Dupont");
      this.cd.markForCheck();
      console.log ("titi 2 : ", this.titi);
    }, 5000);

  }

  ngOnDestroy() {
clearTimeout(this.timeoutId);
  }

}
