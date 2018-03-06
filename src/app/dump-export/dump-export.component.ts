import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';
const _knex = (<any>window).require("knex");
const _oracledb = (<any>window).require("oracledb");
const _execa = (<any>window).require("execa");
const _fs = (<any>window).require("fs");

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


      var knex = _knex({
        client: 'oracledb',
        connection: {
          host: 'srv-db-fls',
          user: 'ly',
          password: 'ly',
          database: 'FLSKDDB.FLS.DE',

        }
      });
      if(knex) {
        console.log('connected');
      }else {
        console.log('Connection failed');
      }
      var query = 'select username from SY_USER';
      knex.raw(query).then(function(resp) {
        console.log(resp);
      })

      query = 'set serveroutput on;';
      knex.raw(query).then(function(resp) {
        console.log(resp);
      })

      _fs.readFile('Pruefe_Update.sql', "utf8", (err, data) => {
        if(err) throw err;
        knex.raw(data).debug([true]).then(function(resp) {
          console.log(resp);
        })
      })


      /*_oracledb.getConnection({
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
      });*/
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
