import { useEffect, useRef, useState } from 'react'
import styles from './CameraStream.module.css'

export const CameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCam, setShowCam] = useState(false)

  const getVideo = async () => {
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

  useEffect(() => {
    getVideo()
  }, [])

  const handleChange = () => {
    setShowCam(!showCam)
  }

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.checkBoxStyle}>
        <input
          type="checkbox"
          id="showVideo"
          checked={showCam}
          onChange={handleChange}
        ></input>
        <label htmlFor="showVideo">Show video</label>
      </div>
      <div>
        <video
          className={showCam ? styles.videoStream : styles.displayNone}
          ref={videoRef}
        ></video>
      </div>
    </div>
  )
}
