import axios from 'axios'
import { Pokemon } from '../../interfaces/pokemon-data.interface'
import InfiniteScroll from '../infinite-scroll/InfiniteScroll'
import styles from './DemoScroll.module.css'

const getDataFunc = async (page: number) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${page * 10}`
  )
  const items: Pokemon[] = response.data.results
  //console.log(response.data)
  return items
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
