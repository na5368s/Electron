const _knex = (<any>window).require('knex');

export class Connection {

  isConnected = false;
  constructor(
    public username: string,
    public password: string,
    public db: string,
    public extusername: string,
    public dump: string
  ) { }

  checkConnection() {
    const knex = _knex({
      client: 'oracledb',
      connection: {
        host: 'localhost',
        user: this.username,
        password: this.password,
        database: this.db,

      }
    });
    this.isConnected = true;
    knex.raw('select * from Test').catch(err => {
      this.isConnected = false;
    });
  }

}
