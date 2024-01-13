/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react'

type GetDataFuncType<T> = (page: number) => Promise<T[]>

type InfiniteScrollProps<T> = {
  getDataFunc: GetDataFuncType<T>
  renderItem: (item: T) => JSX.Element
}

const InfiniteScroll = <T,>({
  getDataFunc,
  renderItem,
}: InfiniteScrollProps<T>) => {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState<number>(1)

  const fetchData = async () => {
    const data = await getDataFunc(page)

    if (data) {
      setPage((prevPage) => prevPage + 1)
      setItems((prevItems) => [...prevItems, ...data])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
  }, [observerTarget])

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </ul>
      <div ref={observerTarget}></div>
    </div>
  )
}

export default InfiniteScroll
