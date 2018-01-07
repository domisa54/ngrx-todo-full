import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodosComponent implements OnInit, OnDestroy {
  @ViewChild('id') id;

  private _toggleTodo$: Observable<number>;
  private _subscriptionToToggleCompleted: ISubscription;
  private _timeoutID;

  @Input() todos;

  @Output() toggle = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();

  public get toggleTodo$(): any {
    // transform value for display
    return this._toggleTodo$;
  }

  @Input()
  public set toggleTodo$(action) {
    // on passe par un Subject afin de créer un Hot Observable qui ne puisse pas être relue à chaque binding de l'attribut input du TodoComponent; ce qui provoque une nouvelle exécution du change detection dans le cas où le todoComponent est destroyed puis recreated notamment après l'exécution d'un Visibility Filter
    // En quelques sorte, Subject permet un reset de l'Observable
    let subject = new Subject<number>();
    this._toggleTodo$ = subject.asObservable()
    .share()
    .debug("toggleCompleted$").tag("toggleCompleted$");

    if (action) {

      console.log("todos List Component > @input set toogleTodo > toggleTodoSuccess$  Action ", action, "id =", action.payload.id);
      // reset getter dans la pile d'événements avec un Id initial 0 to force change detection by angular ngOnChanges et envoi de l'événement suivant avec un delay de 0 pour être traité par le tick() suivant d'angular
      // Au final , cela ne marche pas car cela crée un Cold Obsevable qui est relue en cas de nouvelle soucription par le composant
      /* this._toggleTodo$ = Observable.of(0).concat(Observable.of(action.payload.id).delay(0))
      .share()
       .debug("toggleCompleted$").tag("toggleCompleted$"); */

      // delay permet de différer l'emission de l'événement après le subscribe() dans la pile d'exécution Javascript >> ce qui évite de "completed" l'Observable avant qu'il emmette lors du next()!
      // 2ème effet Kiss Cool, on envoie une valeur null lors du subscribe initial

      //alternative avec publish() = multicast d'un subject non réutiisable et refcount() pour remise à zéro après la souscription pipe | async
      /* this._toggleTodo$ = Observable.of(action.payload.id).delay(0).publish().refCount()
    .debug("toggleCompleted$").tag("toggleCompleted$"); */

      Observable.of(action.payload.id).delay(0).subscribe(subject);
      //subject.next();
    }
    else {
      //this._toggleTodo$ = Observable.of(0);
     subject.next();
    }

    if (this._toggleTodo$) this._subscriptionToToggleCompleted = this._toggleTodo$
      .catch((e) => { if (e) return Observable.of(0); })
      .subscribe(
      id => console.log("todos List Component > @input set toogleTodo > subscriptionToToggleCompleted Id = ", id),
      error => console.log("todos List Component > @input set toogleTodo > subscriptionToToggleCompleted Error =", error),
      () => console.log("todos List Component > @input set toogleTodo > subscriptionToToggleCompleted has completed !")

      );
  }

  constructor() {

  }

  ngOnInit() {

    console.log("Initialisation Todo List component ...");
  }

  ngOnDestroy() {
    if (this._subscriptionToToggleCompleted) this._subscriptionToToggleCompleted.unsubscribe();
    console.log("todos List component destroyed : ");
  }


}
