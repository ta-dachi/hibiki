import { useState } from 'react';

type DownloadFormState = {
  [x: string]: string | boolean;
};

export const DownloadForm = () => {
  const [state, setState] = useState<DownloadFormState>({ url: 'https://www.youtube.com/watch?v=9bZkp7q19f0' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({ [name]: value });
  };

  return (
    <div className="w-6/12">
      <div>
        <pre>
          {JSON.stringify(state)}
        </pre>
      </div>
      <div>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="url"
          type="text"
          value={state['url'] as string}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.electron.ipcRenderer.downloadPlaylist(state['url'] as string)}
        >
          Download
        </button>
      </div>
    </div>
  );
};
