import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';
import * as _knex from 'knex';
// import * as _oracledb from 'oracledb';

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
      console.log('LIB');

      /*
      const oracledb = _oracledb;
      oracledb.getConnection({
        user: 'fls',
        password: 'fls',
        connectString: 'localhost/xe'
      }, function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        connection.execute( 'SELECT * from TEST',
          [],
          function(error, result) {
            if (error) {
              console.error(error.message);
              return;
            }
            console.log(result.metaData);
            console.log(result.rows);
          });
      });
*/
/*

      const knex = _knex({
        client: _oracledb,
        connection: {
          host: 'localhost',
          user: 'fls',
          password: 'fls',
          database: 'xe'
        }
      })
       knex.raw('select * from TEST').then(function () {
       console.log('RIGHT');
       });
*/
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
