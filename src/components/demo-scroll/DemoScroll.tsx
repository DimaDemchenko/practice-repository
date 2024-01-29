import { useRef, useState } from 'react'
import { Pokemon } from '../../types/pokemon-data'
import { InfiniteScroll } from '../infinite-scroll/InfiniteScroll'
import { InputCheckBox } from '../input-check-box/InputCheckBox'
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
  const [isScrollByCameraOn, setIsScrollByCameraOn] = useState(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const handleScrollByCamera = () => {
    setIsScrollByCameraOn(!isScrollByCameraOn)
  }

  const handleVideoVisible = () => {
    setIsVideoVisible(!isVideoVisible)
  }

  const changeHeightOfContainer = () => {
    if (!mainContainerRef.current) return

    mainContainerRef.current.classList.toggle('max-height')
  }

  return (
    <div ref={mainContainerRef} className="main-container max-height">
      <InputCheckBox
        isChecked={isScrollByCameraOn}
        onChange={() => {
          handleScrollByCamera()
          changeHeightOfContainer()
        }}
        labelText={'Scroll by camera'}
      />
      {isScrollByCameraOn && (
        <InputCheckBox
          isChecked={isVideoVisible}
          onChange={handleVideoVisible}
          labelText={'Show video'}
        />
      )}
      <InfiniteScroll<Pokemon>
        getDataFunc={getDataFunc}
        renderItem={renderItem}
        maxItemsInList={500}
        itemsPerPage={10}
        isScrollByCameraOn={isScrollByCameraOn}
        isCameraPreviewOn={isVideoVisible}
      />
    </div>
  )
}
