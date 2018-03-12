import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Connection} from '../connection';
import {concatMap} from 'rxjs/operators';
import {ChildProcess} from 'child_process';
import {Observable} from 'rxjs/Observable';
import {bindCallback} from 'rxjs/observable/bindCallback';

const cmd = (<any>window).require('node-cmd');
const {spawn} = (<any>window).require('child_process');
const _tns = (<any>window).require('tns');
const _fs = (<any>window).require('fs');
const replace = (<any>window).require('replace-in-file');

@Component({
    selector: 'app-dump-import',
    templateUrl: './dump-import.component.html',
    styleUrls: ['./dump-import.component.css']
})
export class DumpImportComponent implements OnInit {

    model = new Connection('system', 'fls6n7km1', 'flskddb', '', '', 'ly', 'dev_ly', 'ly');

    submitted = false;
    success = false;

    onSubmit() {
        this.success = false;
        this.submitted = true;

        this.model.setTnsHostName()
            .pipe(concatMap(() => this.model.setTnsServiceName()),
                concatMap(() => this.model.checkConnection()),
                concatMap(() => this.model.checkIfUserExist()),
                concatMap(() => this.model.dropUser()),
                concatMap(() => this.dumpimport()),
                concatMap(() => this.model.changePasswordfromUser()),
                concatMap(() => this.executePackDS()),
                concatMap(() => this.compileInvalidObjects()),
                concatMap(() => this.model.checkInvalidObjects()))
            .subscribe(res => {
                console.log('submitted', res);
                this.submitted = false;
                this.success = true;
                this._cdRef.detectChanges();
                console.log(this.submitted);
            }, res => {
                console.log('Verbindung fehlgeschlagen: ' + res);
                this.submitted = false;
            });
    }

    dumpimport(): Observable<ChildProcess> {
        console.log('Dump-Import');
        const commandLine = `impdp ${this.model.username}/${this.model.password}@${this.model.db} DUMPFILE=${this.model.dump} REMAP_SCHEMA=${this.model.fromuser}:${this.model.schemaname}`;
        console.log(commandLine);
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

    compileInvalidObjects(): Observable<ChildProcess> {
        console.log('Compile Invalid Objects');


        _fs.writeFile('RecompileSchema.sql', 'EXEC DBMS_UTILITY.compile_schema(schema => \'' + (this.model.schemaname).toUpperCase() + '\')', function (err) {
            if (err) {
                console.log(err);
            }
            console.log('The file RecompileSchema.sql was saved!');
        });

        /*const changes = replace.sync({
            files: 'Test.sql',
            from: 'PLACEHOLDER',
            to: (this.model.schemaname).toUpperCase(),
        });

        console.log(changes);

        _fs.readFile('Test.sql', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data.toString());
        });*/

        const commandLine = `exit | sqlplus -silent ${this.model.username}/${this.model.password}@${this.model.db} @RecompileSchema.sql`;
        const bat: ChildProcess = spawn('cmd.exe', ['/c', commandLine]);

        return new Observable(obs => {
            bat.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            bat.stderr.on('data', (data) => {
                console.log(data.toString());
            });

            bat.on('exit', (code) => {
                _fs.unlink('RecompileSchema.sql', (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log('successfully deleted RecompileSchema.sql!');
                });
                console.log('Child exited with code ${code}');
                obs.next(bat);
                obs.complete();
            });

        });
    }

    executePackDS(): Observable<ChildProcess> {
        console.log('Execute PackDS-Skript');
        const commandLine = `exit | sqlplus -silent ${this.model.schemaname}/${this.model.schemaname}@${this.model.db} @Objekt_PackDS.sql`;
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

    constructor(private _cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

}
