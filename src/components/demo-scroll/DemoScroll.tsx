import { useState } from 'react'
import { Pokemon } from '../../types/pokemon-data'
import { InfiniteScroll } from '../infinite-scroll/InfiniteScroll'
import './DemoScroll.css'

const renderItem = (item: Pokemon) => {
  return (
    <li className="list-item" key={item.url}>
      <span className="span-name">Name: {item.name} </span>
      <span className="span-url">Url: {item.url}</span>
    </li>
  )
}

const getDataFunc = async (page: number, itemsPerPage: number) => {
  try {
    const baseUrl = import.meta.env.VITE_POKEMON_API_URL

    const response = await fetch(
      `${baseUrl}` +
        'pokemon?' +
        new URLSearchParams({
          limit: itemsPerPage.toString(),
          offset: (page * itemsPerPage).toString(),
        })
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    const items: Pokemon[] = data.results

    return items
  } catch (error) {
    console.error('Fetch error:', error)
    return []
  }
}

export const DemoScroll = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false)

  const handleChange = () => {
    setIsVideoVisible(!isVideoVisible)
  }

  return (
    <div className="main-container">
      <div className="check-box">
        <input
          type="checkbox"
          id="showVideo"
          checked={isVideoVisible}
          onChange={handleChange}
        />
        <label htmlFor="showVideo">Show video</label>
      </div>
      <InfiniteScroll<Pokemon>
        getDataFunc={getDataFunc}
        renderItem={renderItem}
        maxItemsInList={500}
        itemsPerPage={5}
        isScrollByCameraOn={true}
      />
    </div>
  )
}
