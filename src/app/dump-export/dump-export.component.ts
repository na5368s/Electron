import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';
const _knex = (<any>window).require("knex");
const _oracledb = (<any>window).require("oracledb");
const _execa = (<any>window).require("execa");
const _fs = (<any>window).require("fs");
const _tns = (<any>window).require("tns");
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
var cmd = (<any>window).require("node-command-line"),
    Promise = (<any>window).require("bluebird");

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

      /*_fs.readFile('tnsnames.ora','utf8', (err, contents) => {
        if(err) throw err;
        console.log(contents);
        //const ast = _tns(contents);
        //console.log(ast);
      })*/

      var knex = _knex({
        client: 'oracledb',
        connection: {
          host: 'srv-db-fls',
          user: 'fkbaro2',
          password: 'fkbaro2',
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


      /*_fs.readFile('Pruefe_Update.sql', "utf8", (err, data) => {
        if(err) throw err;
        knex.raw(data).then(function(resp) {
          console.log(resp);
        })
      })*/

      // GET DATA_PUMP_DIR
      knex.select('DIRECTORY_PATH').from('DBA_DIRECTORIES').where('DIRECTORY_NAME','DATA_PUMP_DIR').then(function (result) {
        console.log(result);
      });


// Execute ExpDP and check if successfull



       this.submitted = true;

      const myObservable = Observable.of(cmd.run('expdp fkbaro2/fkbaro2@flskddb DUMPFILE=baro2.dmp'));

      const myObserver = {
        next: x => console.log('Observable: ' + x),
        error: err => console.error('Oberserver got an error: ' + err),
        complete: () => this.submitted = false,
      };

      myObservable.subscribe(myObserver);
      /*Promise.coroutine(function (){
        // var response = cmd.run('expdp fkbaro2/fkbaro2@flskddb DUMPFILE=baro2.dmp');
         var response = cmd.run('node --version');
        if(response.success) {
          // do something
          // if success get stdout info in message. like response.message
          console.log('Doooo');
        } else {
          console.log('Dont');
          // do something
          // if not success get error message and stdErr info as error and stdErr.
          //like response.error and response.stdErr
        }
        console.log('Executed your command :)');
        this.submitted = false;
      })*/




      this.model.executeConnection();
    } else {
      console.log('Fehler bei der Verbindung');
    }
    _knex.destroy();
  }

  constructor() { }

  ngOnInit() {
  }

}
