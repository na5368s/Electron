import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {catchError, tap} from 'rxjs/operators';
import {ChildProcess} from 'child_process';

const _oracledb = (<any>window).require('oracledb');

const _knex = (<any>window).require('knex');

const {spawn} = (<any>window).require('child_process');

export class Connection {

    tnsPath;

    constructor(public username: string,
                public password: string,
                public db: string,
                public extusername: string,
                public dump: string) {
    }

    setTnsNames(): Observable<ChildProcess> {
        const commandLine = `echo %TNS_NAMES%`;
        const bat: ChildProcess = spawn('cmd.exe', ['/c', commandLine]);

        return new Observable(obs => {
            bat.stdout.on('data', (data) => {
                this.tnsPath = data.toString() + '\\tnsnames.ora';
                this.tnsPath = this.tnsPath.replace(/(\r\n|\n|\r)/gm, '');
                console.log(this.tnsPath);
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

    checkConnection(): Observable<any> {
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: 'srv-db-fls',
                user: this.username,
                password: this.password,
                database: 'FLSKDDB.FLS.DE',

            }
        });

        return fromPromise(knex.raw('select sysdate from dual'))
            .pipe(
                catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }),
                tap(console.log)
            );
    }

}
