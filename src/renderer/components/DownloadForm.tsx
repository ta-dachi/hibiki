import { useEffect, useState } from 'react';

type DownloadFormState = {
  [x: string]: string | boolean;
};

type DownloadFormProps = {
  classes?: string
}

export const DownloadForm = ({classes} : DownloadFormProps) => {
  const [state, setState] = useState<DownloadFormState>({
    url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
  });

  const [disableDownload, setDisableDownload] = useState<boolean>(false)

  const [errorLog, setErrorLog] = useState<string>("No Errors")

  useEffect(() => {
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.on('youtube-dl-download-playlist', (output) => {
      // eslint-disable-next-line no-console
      console.log(output);
      setErrorLog(JSON.stringify(output))
      setDisableDownload(false)
      // console.log('test')
    });
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({ [name]: value });
  };

  return (
    <div className={`${classes}`}>
      {/* // DEBUG */}
      <div>
        <pre>{JSON.stringify(state)}</pre>
      </div>
      {/*  */}
      <div>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="url"
          type="text"

          value={state['url'] as string}
          onChange={handleInputChange}
        />
      </div>
      {/*  */}
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-25"
          disabled={disableDownload}
          onClick={() => {
            setDisableDownload(true)
            window.electron.ipcRenderer.downloadPlaylist(state['url'] as string)
          }}
        >
          {disableDownload ?   "Downloading" : "Download"}
        </button>
      </div>

      <div>
        <pre>{errorLog}</pre>
      </div>

      {/* <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.electron.ipcRenderer.myPing()}
        >
          Ping
        </button>
      </div> */}
    </div>
  );
};
