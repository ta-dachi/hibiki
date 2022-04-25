export type HibikiConfiguration = {
  projectRoot: string
}

export type YoutubeMetadata = {
  artist: string
  album: string
  duration: number
  //
  thumbnails: {
    height: number
    id: string
    resolution: string
    url: string
    width: string
  }[]
  upload_date: string
  //
  like_count: number
  view_count: number
  webpage_url: string
}