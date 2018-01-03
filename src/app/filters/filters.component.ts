import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'filters',
  template: `
    <div><select [formControl]="filter" (change)="changeFilter.next(filter.value)">
      <option *ngFor="let filter of filters" [ngValue]="filter.id">{{filter.title}}</option>
    </select></div>
   `
})
export class FiltersComponent implements OnInit{
  @Input() filters;
  @Output() changeFilter = new EventEmitter<any>();
  filter : FormControl;

  constructor() {
    this.filter = new FormControl();
  }

  @Input() set active( val ) {
    console.log("Filters Component > @input set active > activeFilter$ value", val);
    this.filter.setValue(val);
  }

  ngOnInit(){
    console.log("Initialisation Filters  component");
  }

}
