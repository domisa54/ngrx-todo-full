import { Component, Input, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoComponent implements OnInit, OnDestroy {
  
 
  private _completed: boolean = false;

   public get completed(): boolean {
      // transform value for display
      return this._completed;
    }
    
    @Input()
    public set completed(toggle: boolean) {
      console.log('prev value _toogle : ', this._completed, ' for todo ID ', this.todo ? this.todo.id : null );
      console.log('got new value toogle : ', toggle ,'for todo ID : ', this.todo ? this.todo.id : null );
      this._completed = toggle;
    }
  


  @Input() todo;

  @Input() titi;

  @Output() toggle = new EventEmitter<any>();
  
  @Output() remove:EventEmitter<any> = new EventEmitter();


  constructor(){}

  
ngOnInit(){
    
   this._completed= this.todo.completed;
    console.log("Initialisation Todo ...",this.todo, this._completed);
}

ngOnDestroy() {
  console.log("todo.component destroyed : ", this.todo);
    }

    /* ngOnChanges() {
      console.log("ngOnChanges - data is}", this.todo);
    }
  
  
  
    ngAfterContentInit() {
      console.log("ngAfterContentInit",this.todo);
    }
  
    ngAfterContentChecked() {

      console.log("ngAfterContentChecked",this.todo,this.completed);

      //this.lineThrough = this.todo.completed;
    }
  
    ngAfterViewInit() {
      console.log("ngAfterViewInit",this.todo);
    }
  
    ngAfterViewChecked() {
      console.log("ngAfterViewChecked",this.todo);
    } */
  
}
