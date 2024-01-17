import { Pokemon } from '../../types/pokemon-data'
import { InfiniteScroll } from '../infinite-scroll/InfiniteScroll'
import styles from './DemoScroll.module.css'

const renderItem = (item: Pokemon) => {
  return (
    <li className={styles.listItem} key={item.url}>
      <span className={styles.spanName}>Name: {item.name} </span>
      <span className={styles.spanUrl}>Url: {item.url}</span>
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
  return (
    <div className={styles.mainContainer}>
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
