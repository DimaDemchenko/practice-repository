/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react'
import styles from './InfiniteScroll.module.css'
export type GetDataFuncType<T> = (page: number) => Promise<T[]>

type InfiniteScrollProps<T> = {
  getDataFunc: GetDataFuncType<T>
  renderItem: (item: T) => JSX.Element
  maxOffset?: number
}

const InfiniteScroll = <T,>({
  getDataFunc,
  renderItem,
  maxOffset,
}: InfiniteScrollProps<T>) => {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = async () => {
    if (isLoading || (maxOffset !== undefined && page * 10 >= maxOffset)) return // page * 10 = offset
    setIsLoading(true)

    const data = await getDataFunc(page)
    if (data && data.length > 0) {
      setPage((prevPage) => prevPage + 1)
      setItems((prevItems) => [...prevItems, ...data])
    }

    setIsLoading(false)
  }

  /*
  useEffect(() => {
    fetchData()
  }, [])*/

  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData()
        }
      },
      { threshold: 1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, isLoading])

  return (
    <div className={styles.listContainer}>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      <div ref={observerTarget}></div>
    </div>
  )
}

export default InfiniteScroll
