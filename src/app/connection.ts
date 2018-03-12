import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {catchError, tap} from 'rxjs/operators';
import {ChildProcess} from 'child_process';

const _oracledb = (<any>window).require('oracledb');

const _knex = (<any>window).require('knex');

const {spawn} = (<any>window).require('child_process');

export class Connection {

    tnsPath;
    tns1 = '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = DESKTOP-DO16BSK)';
    tns2 = '(PORT = 1521))(CONNECT_DATA = (SERVER = DEDICATED)(SERVICE_NAME = XE)))';
    userexist = false;

    constructor(public username: string,
                public password: string,
                public db: string,
                public hostname: string,
                public servicename: string,
                public fromuser: string,
                public schemaname: string,
                public dump: string) {
    }

    connect(): Observable<any> {
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });
        return knex;
    }

    setTnsHostName(): Observable<ChildProcess> {
        console.log('SetTNSHostName');
        const commandLine = `echo %TNS_HOST%`;
        const bat: ChildProcess = spawn('cmd.exe', ['/c', commandLine]);

        // commandLine = 'echo %TNS_SERVICE%';
        // bat = spawn('cmd.exe', ['/c', commandLine]);

        return new Observable(obs => {
            bat.stdout.on('data', (data) => {
                // this.tnsPath = data.toString() + '\\tnsnames.ora';
                // this.tnsPath = this.tnsPath.replace(/(\r\n|\n|\r)/gm, '');
                console.log(data.toString());
                this.hostname = data.toString().replace(/(\r\n|\n|\r)/gm, '');
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

    setTnsServiceName(): Observable<ChildProcess> {
        console.log('SetTNSServiceName');
        const commandLine = `echo %TNS_SERVICE%`;
        const bat: ChildProcess = spawn('cmd.exe', ['/c', commandLine]);

        // commandLine = 'echo %TNS_SERVICE%';
        // bat = spawn('cmd.exe', ['/c', commandLine]);

        return new Observable(obs => {
            bat.stdout.on('data', (data) => {
                // this.tnsPath = data.toString() + '\\tnsnames.ora';
                // this.tnsPath = this.tnsPath.replace(/(\r\n|\n|\r)/gm, '');
                console.log(data.toString());
                this.servicename = data.toString().replace(/(\r\n|\n|\r)/gm, '');
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

    checkIfUserExist(): Observable<any> {
        console.log('Drop User for Schema: ' + this.schemaname);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });

        const temp = this;

        const result = fromPromise(knex.raw('select username as id from all_users where username = \'' + (this.schemaname).toUpperCase() + '\'').then(function (res) {
            console.log('Check if User exists');
            if (res.length > 0) {
                console.log('User exist');
                temp.userexist = true;

            } else {
                console.log('User doesnt exist');
            }
        }))
            .pipe(catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }));

        return result;
    }

    dropUser(): Observable<any> {
        console.log('Drop User for Schema: ' + this.schemaname);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });

        console.log('check user variable: ' + this.userexist);

        if (this.userexist) {
            return fromPromise(knex.raw('DROP USER ' + (this.schemaname).toUpperCase() + ' CASCADE'))
                .pipe(catchError(err => {
                        console.log(err);
                        return Observable.throw(err);
                    }),
                    tap(console.log));
        }

        // FALLS USER NICHT ENTHALTEN nichts zurückgeben überbrückt !!! MUSS GEÄNDERT WERDEN
        return fromPromise(knex.raw('select sysdate from dual'))
            .pipe(
                catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }),
                tap(console.log)
            );
    }

    changePasswordfromUser(): Observable<any> {
        console.log('Change Password for Schema: ' + this.schemaname);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });

        return fromPromise(knex.raw('ALTER USER ' + this.schemaname + ' IDENTIFIED BY ' + this.schemaname))
            .pipe(
                catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }),
                tap(console.log)
            );
    }

    /*compileInvalidObjects(): Observable<any> {
        console.log('Compile Invalid Objects for Schema: ' + this.schemaname);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /!*'srv-db-fls'*!/ this.hostname,
                user: this.username,
                password: this.password,
                database: /!*'FLSKDDB.FLS.DE'*!/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });

        const sql = 'EXEC DBMS_UTILITY.compile_schema(schema => \'' + (this.schemaname).toUpperCase() + '\')';
        console.log(sql);

        return fromPromise(knex.raw(sql))
            .pipe(
                catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }),
                tap(console.log)
            );
    }*/

    checkInvalidObjects(): Observable<any> {
        console.log('Check Invalid Objects for Schema: ' + this.schemaname);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
            }
        });

        const sql = 'select owner, object_type, object_name, status from dba_objects where status = \'INVALID\' and owner = \'' + (this.schemaname).toUpperCase() + '\'';
        console.log(sql);

        return fromPromise(knex.raw(sql))
            .pipe(
                catchError(err => {
                    console.log(err);
                    return Observable.throw(err);
                }),
                tap(console.log)
            );
    }

    checkConnection(): Observable<any> {
        console.log('Checkconnection: ' + this.hostname + ' ' + this.servicename);
        const knex = _knex({
            client: 'oracledb',
            connection: {
                host: /*'srv-db-fls'*/ this.hostname,
                user: this.username,
                password: this.password,
                database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
                // connectString: this.tns1 + this.tns2,
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
