import { HibikiConfiguration, YoutubeMetadata } from 'main/types';
import { useDebounce } from 'main/util';
import { useEffect, useMemo, useState } from 'react';

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

  const [metadata, setMetadata] = useState<YoutubeMetadata>({
    artist: '',
    album: '',
    duration: 0,
    thumbnails: [],
    upload_date: '',
    like_count: 0,
    view_count: 0,
    webpage_url: ''
  })
  
  const [configuration, setConfiguration] = useState<HibikiConfiguration>({
    projectRoot: ''
  })

  useEffect(() => {
    window.electron.ipcRenderer.on('setup', (output) => {
      setConfiguration(output as HibikiConfiguration)
      console.log(output);
    });

    window.electron.ipcRenderer.setup()
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on('youtube-dl-get-metadata', (output) => {
      setMetadata(output as YoutubeMetadata)
      console.log(output);
    });

  }, [])

  useEffect(() => {
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.on('youtube-dl-download-playlist', (output) => {
      console.log(output);
      setErrorLog(JSON.stringify(output))
      setDisableDownload(false)
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({ [name]: value });
  };

  // const handleSearchString = useDebounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   try {
  //     console.log(event.target.value)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // })
  const [searchString, setSearchString] = useDebounce();
  const handleSearchString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };
  useEffect(() => {
    window.electron.ipcRenderer.getMetadata(searchString)

  }, [searchString])


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
          onChange={(e) => {
            handleInputChange(e)
            handleSearchString(e)
          }}
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

      {/* <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-25"
          disabled={disableDownload}
          onClick={() => {
            window.electron.ipcRenderer.getMetadata(state['url'] as string)
          }}
        >
          {'Get Metadata'}
        </button>
      </div> */}

      <div className="mt-4">
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </div>


      <div className="mt-4">
        <pre>{JSON.stringify(configuration, null, 2)}</pre>
      </div>


      <div className="mt-4">
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
