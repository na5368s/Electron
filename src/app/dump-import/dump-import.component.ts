import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';

@Component({
  selector: 'app-dump-import',
  templateUrl: './dump-import.component.html',
  styleUrls: ['./dump-import.component.css']
})
export class DumpImportComponent implements OnInit {

  model = new Connection('', '', '', '', '');

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
