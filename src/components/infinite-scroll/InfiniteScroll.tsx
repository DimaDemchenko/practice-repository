import React, { useEffect, useRef, useState } from 'react'
import { CameraStream } from '../camera-stream/CameraStream'
import styles from './InfiniteScroll.module.css'

type InfiniteScrollProps<T> = {
  getDataFunc: (page: number, offset: number) => Promise<T[]>
  renderItem: (item: T) => JSX.Element
  maxItemsInList: number
  itemsPerPage: number
  isScrollByCameraOn?: boolean
}

export const InfiniteScroll = <T,>({
  getDataFunc,
  renderItem,
  maxItemsInList,
  itemsPerPage,
  isScrollByCameraOn,
}: InfiniteScrollProps<T>) => {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setItems([])
    setPage(0)
  }, [getDataFunc])

  useEffect(() => {
    if (
      !observerTarget.current ||
      isLoading ||
      (maxItemsInList !== undefined && page * itemsPerPage >= maxItemsInList)
    )
      return

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const data = await getDataFunc(page, itemsPerPage)

        if (data && data.length > 0) {
          setPage((prevPage) => prevPage + 1)
          setItems((prevItems) => [...prevItems, ...data])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const target = observerTarget.current

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
  }, [getDataFunc, isLoading, maxItemsInList, itemsPerPage, page])

  return (
    <>
      {isScrollByCameraOn && <CameraStream />}
      <div className={styles.listContainer}>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
        {isLoading && <p>Loading...</p>}
        <div ref={observerTarget} />
      </div>
    </>
  )
}
