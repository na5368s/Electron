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
  var oracledb = require('oracledb');
  //var oracledb = require('C:\\Users\\Noel\\Documents\\Repository\\Test\\angular-electron\\node_modules\\oracledb\\build\\Release\\oracledb.node');
  oracledb.getConnection({
    user: "fls",
    password: "fls",
    connectString: "localhost/xe"
  }, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute( "SELECT * from TEST",
      [],
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
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
