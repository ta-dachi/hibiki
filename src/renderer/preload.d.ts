declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        // Add more methods
        downloadPlaylist(url: string): void;
        getMetadata(url: string): void,
        // Setup the app by instantiating needed variables like project root
        setup(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
