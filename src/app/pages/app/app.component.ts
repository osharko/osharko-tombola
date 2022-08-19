import { Component, OnInit } from '@angular/core';
import { Tombola } from 'src/model/tombola';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public tombola = new Tombola();
  public wonUsers?;

  ngOnInit() {
    this.tombola.createNewUserWithTables("Luigi", 3);
    this.tombola.createNewUserWithTables("Luca", 4);
  }

  public newGame() {
    this.tombola.flush();
  }

  public getNumber() {
    this.wonUsers = this.tombola.extractNewElement();
  }

  public getUntil() {
    while (!this.wonUsers)
      this.wonUsers = this.tombola.extractNewElement();
  }
}
