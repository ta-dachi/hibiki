import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    downloadPlaylist(string: string) {
      ipcRenderer.send('youtube-dl-download-playlist', string);
    },
    // Setup the app by instantiating needed variables like project root
    setup() {
      ipcRenderer.send('setup');
    },

    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example', 'youtube-dl-download-playlist', 'setup'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example', 'youtube-dl-download-playlist', 'setup'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
