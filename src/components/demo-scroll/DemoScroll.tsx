import axios from 'axios'
import { Pokemon } from '../../interfaces/pokemon-data.interface'
import InfiniteScroll from '../infinite-scroll/InfiniteScroll'
import styles from './DemoScroll.module.css'

const getDataFunc = async (page: number): Promise<Pokemon[]> => {
  try {
    const baseUrl = import.meta.env.VITE_POKEMON_API_URL

    const response = await axios.get(`${baseUrl}` + 'pokemon', {
      params: {
        limit: 10,
        offset: page * 10,
      },
    })

    const items: Pokemon[] = response.data.results
    //console.log(response.data)
    return items
  } catch (error) {
    console.log(error)
    return []
  }
}

const renderItem: (item: Pokemon) => JSX.Element = (item) => {
  return (
    <li className={styles.listItem} key={item.url}>
      <span className={styles.spanName}>Name: {item.name} </span>
      <span className={styles.spanUrl}>Url: {item.url}</span>
    </li>
  )
}

const DemoScroll = () => {
  return (
    <div className={styles.mainContainer}>
      <InfiniteScroll
        getDataFunc={getDataFunc}
        renderItem={renderItem}
        maxOffset={230}
      ></InfiniteScroll>
    </div>
  )
}

export default DemoScroll
