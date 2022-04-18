import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.on('ipc-example', (arg) => {
  console.log(arg);
});


// calling IPC exposed from preload script
window.electron.ipcRenderer.on('youtube-dl-download-playlist', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
  // console.log('test')
});