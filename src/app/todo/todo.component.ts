import { Component, Input, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoComponent implements OnInit, OnDestroy {
 
  private _completed: boolean;
  private _changeCompleted = false;

  
    
    @Input()
    public set completed(toggle: boolean) {
      console.log('prev value _toogle : ', this._completed, ' for todo ID ', this.todo ? this.todo.id : null );
      console.log('got new value toogle : ', toggle ,'for todo ID : ', this.todo ? this.todo.id : null );
      // Si this.completed a déja été initialisé sinon priorité à ngOnInit() qui se déclenche après ngOnChange()
      if ((this._completed !== undefined) && toggle) {
        this._changeCompleted = true;
        this._completed = !this._completed;
      }
    }

    public get completed(): boolean {
      // transform value for display
      console.log("id ", this.todo.id, "is completed ? : ",this._completed);
      return this._completed;
    }

  @Input() todo;

  @Input() titi;

  @Output() toggle = new EventEmitter<any>();
  
  @Output() remove:EventEmitter<any> = new EventEmitter();


  constructor(private cd: ChangeDetectorRef){}

  
ngOnInit(){
    
  if (this.todo) this._completed =  this.todo.completed
  else this._completed = false;
  
    console.log("Initialisation Todo ...",this.todo, this._completed);
}

ngOnDestroy() {
  console.log("todo.component destroyed : ", this.todo);
    }

    ngOnChanges() {
      console.log("ngOnChanges - data is}", this.todo);
    }
  
  
  /* 
    ngAfterContentInit() {
      console.log("ngAfterContentInit",this.todo);
    } */
  
    /* ngAfterContentChecked() {
      console.log("ngAfterContentChecked",this.todo,this.completed);
      if  (!this._changeCompleted && !this.completed)  this._completed = !this._completed
     else this._changeCompleted = false; 
    
    } */
  
   /*  ngAfterViewInit() {
      console.log("ngAfterViewInit",this.todo);
    }
  
    ngAfterViewChecked() {
      console.log("ngAfterViewChecked",this.todo);
    } */
  
}
