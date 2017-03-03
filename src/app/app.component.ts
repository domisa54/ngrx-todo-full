import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/* export class AppComponent {

} */
//@Injectable()
export class AppComponent {
  public events: string[] = [];
  
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      this.events.push(event.toString())
    })
  }
  
  public linkClick(link: string): void {
    this.events.push(`${link} link clicked.`);
  }

  /* goHome() {
    this.router.navigate(['']); 
  }

  goTodos() {
    this.router.navigate(['todos']); 
  } */
}
