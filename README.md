# hibiki

Download youtube videos as audio in mp3 format.

## Install

Clone the repo and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git your-project-name
cd your-project-name
npm install
```

**Having issues installing? See our [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Docs

See [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## FFmpeg compile command:
```
./configure --disable-everything --disable-network --disable-autodetect --enable-small --enable-decoder=aac,mp3 --enable-demuxer=mov,m4v,matroska --enable-muxer=mp3,mp4 --enable-protocol=file --enable-libmp3lame --enable-encoder=libmp3lame --enable-filter=aresample --extra-cflags="-I/opt/homebrew/include" --extra-ldflags="-L/opt/homebrew/lib"
```
## Install lame via package manager:

### Mac OS 

```
brew install lame
```

## libmp3lame compile command:

Download source: https://sourceforge.net/projects/lame/files/lame/3.100/
```
./configure --disable-decoder --host="x86_64"
make
make install
```

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[stackoverflow-img]: https://img.shields.io/badge/stackoverflow-electron_react_boilerplate-blue.svg
[stackoverflow-url]: https://stackoverflow.com/questions/tagged/electron-react-boilerplate
