import { shell, app, BrowserWindow } from 'electron'
const path = require('path');
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    const filename = item.getFilename();
    const dir = app.getPath('downloads');
    const filePath = (path.join(dir, filename));
      
    item.setSavePath(filePath)
      item.on('done', (e, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        if (process.platform === 'darwin') {
					app.dock.downloadFinished(filePath);
        }
        var extract = require('extract-zip')
        let arquivo = item.getFilename()
				extract(path.join(dir, arquivo), {dir: path.join("C:\\ServerHallss", arquivo)}, function (err) {
					shell.openItem(path.join("C:\\ServerHallss\\" + arquivo + "\\mini_server_11\\mysql_start.bat"))
					setTimeout(() => {
            const http = require('http')
            const port = 3000
            const ip = 'localhost'

            const server = http.createServer((req, res) => {
              var mysql = require('mysql');
              var pool = mysql.createPool({
                  connectionLimit: 5,
                  host: 'localhost',
                  user: 'root',
                  port: 3311,
                  password: 'root',
                  waitForConnections:false,
                  database: 'mysql'
              });

              pool.getConnection((err, connection) => {
                var query = "SHOW TABLES"
                connection.query(query, function (error, results, fields) {
                  if (error) return reject(error)
                  var resultados = '<h1>TABELAS:</h1>'
                  for(var i in results){
                    resultados = resultados + '<h4>' + results[i].Tables_in_mysql + '</h4>'
                  }
                  res.end(resultados)
                });
              })
            })

            server.listen(port, ip, () => {
              console.log(`Servidor rodando em http://${ip}:${port}`)

            })
					}, 500);
				})
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
