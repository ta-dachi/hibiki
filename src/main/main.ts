import { HibikiConfiguration, YoutubeMetadata } from './types.d';
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath, subset } from './util';
//
import youtubedl from 'youtube-dl-exec';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


/**
 * Events
 */

 ipcMain.on('setup', async (event) => {
  const hibikiConfiguration: HibikiConfiguration = {
    projectRoot: process.env.PWD ?? ""
  }

  event.reply('setup', hibikiConfiguration);
})

ipcMain.on('youtube-dl-get-metadata', async (event, url: string) => {
  console.log(url)

  youtubedl(url, {
    simulate: true,
    dumpJson: true,
    printJson: true,
  }).then((output) => {
    const metadata = subset<any>(output, 
      "artist",
      "album",
      "duration",
      "thumbnails",
      "upload_date",
      "like_count",
      "view_count",
      "webpage_url"
    ) as YoutubeMetadata
    console.log(metadata)
    event.reply('youtube-dl-get-metadata', metadata);
  }).catch((error) => {
    console.log(error)
    event.reply('youtube-dl-get-metadata', 'Error!');
    event.reply('youtube-dl-get-metadata', error);
  })
})


/**
 * Download using youtube through ipc
 */
ipcMain.on('youtube-dl-download-playlist', async (event, url: string) => {
  const msg = () => `Downloaded!`;
  console.log(url)


  // single file
  // youtube-dl --extract-audio --audio-format mp3 <video URL>
  // Playlist
  // youtube-dl --ignore-errors --format bestaudio --extract-audio --audio-format mp3 --audio-quality 160K --output "%(title)s.%(ext)s" --yes-playlist


  // try {
  //   const ex = await exec("ls -la", (error, stdout, stderr) => {
  //     if (error) {
  //         console.log(`error: ${error.message}`);
  //         return;
  //     }
  //     if (stderr) {
  //         console.log(`stderr: ${stderr}`);
  //         return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //   });
    
  
  // } catch (error) {
  //   console.error(error)
  // }

  // eg. /Users/tadachi/Desktop/repos/hibiki/
  const projectRoot = process.env.PWD

  youtubedl(url, {
    extractAudio: true,
    audioFormat: 'mp3',
    audioQuality: 160,
    ffmpegLocation: `${projectRoot}/bin/mac/ffmpeg`,
  }).then((output) => {
    console.log(output)
    event.reply('youtube-dl-download-playlist', output);
  }).catch((error) => {
    console.log(error)
    event.reply('youtube-dl-download-playlist', 'Error!');
    event.reply('youtube-dl-download-playlist', error);
  })

  // Subprocess test code
  // const subprocess = youtubedlRAW.raw(url, {
  //   noCallHome: true,
  //   noCheckCertificate: true,
  //   preferFreeFormats: true,
  //   format: 'mp4',
  //   youtubeSkipDashManifest: true,
  //   output: '%(id)s.%(ext)s'
  // })

  // subprocess.stdout.on('data', (data: any) => {
  //   console.log(data)
  // })


});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));

  event.reply('ipc-example', msgTemplate('pong'));
});

/**
 * Database
 */

//  const db = new Database('foobar.db', { verbose: console.log });
//  const createStmt = db.prepare('CREATE TABLE IF NOT EXISTS youtube_urls (id INT, url CHAR)');

//  createStmt.run()

//  const insertStmt = db.prepare('INSERT INTO youtube_urls (id, url) VALUES (0, test)');