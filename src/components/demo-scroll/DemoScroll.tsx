import axios from 'axios'
import { Pokemon } from '../../interfaces/response-data.interface'
import InfiniteScroll, {
  GetDataFuncType,
} from '../infinite-scroll/InfiniteScroll'

const getDataFunc: GetDataFuncType<Pokemon> = async (page: number) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${page * 10}`
  )
  const items: Pokemon[] = response.data.results
  console.log(response.data)
  return items
}

const renderItem: (item: Pokemon) => JSX.Element = (item) => {
  return (
    <li key={item.url}>
      {item.url}&&&&&{item.name}
    </li>
  )
}

const DemoScroll = () => {
  return (
    <InfiniteScroll
      getDataFunc={getDataFunc}
      renderItem={renderItem}
      maxOffset={230}
    ></InfiniteScroll>
  )
}

export default DemoScroll
