const { app, BrowserWindow } = require('electron')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1060,
    height: 1024,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  })

  console.log('TEST');
  //var oracledb = require('oracledb');
  var knex = require('knex')({
    client: 'oracledb',
    connection: {
      host: 'srv-db-fls',
      user: 'ly',
      password: 'ly',
      database: 'FLSKDDB.FLS.DE'
    }
  });
  console.log('GGGGG');
  if(knex) {
    console.log('connected');
  }else {
    console.log('Connection failed');
  }
  var query = 'select username from SY_USER';
  knex.raw(query).then(function(resp) {
    console.log(resp);
  })

  var _fs = require("fs");
  _fs.readFile('Test.sql', "utf8", (err, data) => {
    if(err) throw err;
    // console.log(data);
    knex.raw(data).then(function(resp) {
      console.log(resp);
    })
  })
  //var oracledb = require('C:\\Users\\Noel\\Documents\\Repository\\Test\\angular-electron\\node_modules\\oracledb\\build\\Release\\oracledb.node');
  /*oracledb.getConnection({
    host: 'srv-db-fls',
    user: "fkleer",
    password: "fkleer",
    database: "FLSKDDB"
  }, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute( "SELECT username from SY_USER;",
      [],
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log('Statement');
        console.log(result.metaData);
        console.log(result.rows);
        doRelease(connection);
      });
  });

  function doRelease(connection) {
    connection.release(
      function(err) {
        if (err) {console.error(err.message);}
      }
    );
  }

*/

  win.loadURL(`file://${__dirname}/dist/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
