import { useEffect, useRef, useState } from 'react'
import styles from './CameraStream.module.css'

export const CameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoVisible, setIsVideoVisible] = useState(false)

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        })

        const video = videoRef.current

        if (!video) return

        video.srcObject = stream
        video.play()
      } catch (error) {
        console.log(error)
      }
    }

    initializeCamera()
  }, [])

  const handleChange = () => {
    setIsVideoVisible(!isVideoVisible)
  }

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.checkBoxStyle}>
        <input
          type="checkbox"
          id="showVideo"
          checked={isVideoVisible}
          onChange={handleChange}
        />
        <label htmlFor="showVideo">Show video</label>
      </div>
      <div>
        <video
          className={isVideoVisible ? styles.videoStream : styles.displayNone}
          ref={videoRef}
        ></video>
      </div>
    </div>
  )
}
