import { Component, OnInit } from '@angular/core';
import { Connection } from '../connection';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
const _knex = (<any>window).require('knex');
const _oracledb = (<any>window).require('oracledb');
const _execa = (<any>window).require('execa');
const _fs = (<any>window).require('fs');
const cmd = (<any>window).require('node-cmd');


@Component({
  selector: 'app-dump-export',
  templateUrl: './dump-export.component.html',
  styleUrls: ['./dump-export.component.css']
})
export class DumpExportComponent implements OnInit {

  model = new Connection('', '', '', '', '');

  submitted = false;
  connecting = false;
  error = false;
  success = false;

  onSubmit() {
    this.error = false;
    this.submitted = true;
    this.connecting = true;
    this.success = false;
    this.model.checkConnection();
    setTimeout(() => {
      if (this.model.isConnected) {
        this.connecting = false;
        this.dumpexport();
      } else {
        this.error = true;
        this.connecting = false;
      }
    }, 1000);
  }

  dumpexport() {
    const myObservable = Observable.of();
    const myObserver1 = {
       complete: () => this.submitted = false,
     };
    const myObserver2 = {
      complete: () => this.error = true,
    };
    const myObserver3 = {
      complete: () => this.success = true,
    };
    const commandline = 'expdp ' + this.model.username + '/' + this.model.password + '@' + this.model.db + ' DUMPFILE=' + this.model.dump;
    cmd.get(commandline, function(err, data, stderr) {
        if (!err) {
            myObservable.subscribe(myObserver1);
            myObservable.subscribe(myObserver3);
        } else {
            myObservable.subscribe(myObserver1);
            myObservable.subscribe(myObserver2);
        }
    });

  }

  constructor() { }

  ngOnInit() {
  }

}
