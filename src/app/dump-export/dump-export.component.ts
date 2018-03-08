import {Component, OnInit} from '@angular/core';
import {Connection} from '../connection';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import {bindCallback} from 'rxjs/observable/bindCallback';
import {ChildProcess} from 'child_process';
import {concatMap} from 'rxjs/operators';

const _knex = (<any>window).require('knex');
const _oracledb = (<any>window).require('oracledb');
const _execa = (<any>window).require('execa');
const _fs = (<any>window).require('fs');
const cmd = (<any>window).require('node-cmd');
const {spawn} = (<any>window).require('child_process');


@Component({
    selector: 'app-dump-export',
    templateUrl: './dump-export.component.html',
    styleUrls: ['./dump-export.component.css']
})
export class DumpExportComponent implements OnInit {

    model = new Connection('ly', 'ly', 'flskddb', 'a', 'ly');

    submitted = false;

    onSubmit() {
        this.submitted = true;
        this.model.setTnsNames().subscribe(res => {
            console.log('tns-success: ', res);
            _fs.readFile(this.model.tnsPath, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                console.log(data);
            });
        }, res => {
            console.log('tns-error', res);
        });
        this.model.checkConnection()
            .pipe(concatMap(() => this.dumpexport()))
            .subscribe(res => {
                console.log('submitted', res);
                this.submitted = false;
            }, res => {
                this.submitted = false;
                console.log('Verbindung fehlgeschlagen:' + res);
            });
    }

    dumpexport(): Observable<ChildProcess> {
        const commandLine = `expdp ${this.model.username}/${this.model.password}@${this.model.db} DUMPFILE=${this.model.dump}`;
        const bat: ChildProcess = spawn('cmd.exe', ['/c', commandLine]);

        return new Observable(obs => {
            bat.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            bat.stderr.on('data', (data) => {
                console.log(data.toString());
            });

            bat.on('exit', (code) => {
                console.log('Child exited with code ${code}');
                obs.next(bat);
                obs.complete();
            });

        });
    }

    constructor() {
    }

    ngOnInit() {
    }

}
