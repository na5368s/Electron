export class Connection {

  constructor(
    public username: string,
    public password: string,
    public db: string,
    public extusername: string,
    public dump: string
  ) { }

  checkConnection() {
    // console.log(oracledb);
    const check = true;

    if (check === true) {
      console.log('Connection successful.');
      return true;
    }
    return false;
  }

  executeConnection() {
    // console.log(oracledb);

    console.log('Execute Dump-Export');

    return 0;
  }
}
