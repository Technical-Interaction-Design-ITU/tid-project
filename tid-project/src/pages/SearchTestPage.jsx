import { useState } from 'react'
import SearchBox from '../components/SearchBox.jsx'

// Test page: pick an album, then look up its better cover (MusicBrainz, Discogs fallback).
export default function SearchTestPage() {
  const [album, setAlbum] = useState(null)
  const [cover, setCover] = useState(null)

  async function pick(a) {
    setAlbum(a)
    setCover(null)
    const params = new URLSearchParams({ id: a.id, cover: a.cover ?? '' })
    setCover((await (await fetch(`/api/cover?${params}`)).json()).url)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Search test</h1>
      <SearchBox onSelect={pick} />
      {album && (
        <div style={{ marginTop: 24 }}>
          <h2>{album.artist} - {album.title} {album.year && `(${album.year})`}</h2>
          <p>{album.have} have / {album.want} want · <a href={album.url}>Discogs</a></p>
          {cover ? <img src={cover} width={300} alt="" /> : <p>Loading cover…</p>}
          <p>{cover?.includes('coverartarchive') ? 'Source: MusicBrainz / Cover Art Archive' : cover && 'Source: Discogs (fallback)'}</p>
        </div>
      )}
    </div>
  )
}
