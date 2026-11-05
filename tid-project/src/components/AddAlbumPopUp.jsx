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