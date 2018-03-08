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

  constructor(public username: string,
              public password: string,
              public db: string,
              public hostname: string,
              public servicename: string,
              public extusername: string,
              public dump: string) {
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

  checkConnection(): Observable<any> {
    console.log('Checkconnection: ' + this.hostname + ' ' + this.servicename);
    const knex = _knex({
      client: 'oracledb',
      connection: {
        // host: /*'srv-db-fls'*/ this.hostname,
        user: this.username,
        password: this.password,
        // database: /*'FLSKDDB.FLS.DE'*/ this.servicename,
        connectString: this.tns1 + this.tns2,
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
