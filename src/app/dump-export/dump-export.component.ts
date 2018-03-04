import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';

@Component({
  selector: 'app-dump-export',
  templateUrl: './dump-export.component.html',
  styleUrls: ['./dump-export.component.css']
})
export class DumpExportComponent implements OnInit {

  model = new Connection('', '', '', '', '');

  submitted = false;

  onSubmit() {
    const check = this.model.checkConnection();
    if (check) {
      this.submitted = true;
      this.model.executeConnection();
    } else {
      console.log('Fehler bei der Verbindung');
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
