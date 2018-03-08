import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';

@Component({
  selector: 'app-check-updates',
  templateUrl: './check-updates.component.html',
  styleUrls: ['./check-updates.component.css']
})
export class CheckUpdatesComponent implements OnInit {

  model = new Connection('', '', '', '', '', '', '');

  submitted = false;

  onSubmit() {
    const check = this.model.checkConnection();
    if (check) {

    } else {
      console.log('Fehler bei der Verbindung');
    }
    this.submitted = true;
  }

  constructor() { }

  ngOnInit() {
  }

}
