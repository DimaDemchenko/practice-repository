import * as posenet from '@tensorflow-models/posenet'
import { Vector2D } from '@tensorflow-models/posenet/dist/types'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import styles from './CameraStream.module.css'

type CameraScrollProps = {
  handleWrist: (direction: 'up' | 'down') => void
}

export const CameraStream = ({ handleWrist }: CameraScrollProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoVisible, setIsVideoVisible] = useState(false)

  const handleScrollRef = useRef(handleWrist)
  handleScrollRef.current = handleWrist

  useEffect(() => {
    let initialWristPosUp: { x: number; y: number } | undefined

    const handleWristMovementUp = (newWristPos: Vector2D) => {
      console.log(newWristPos)
      if (!initialWristPosUp || newWristPos.y - initialWristPosUp.y > 30) {
        initialWristPosUp = newWristPos
        return
      }

      if (initialWristPosUp.y - newWristPos.y > 300) {
        handleScrollRef.current('up')
        initialWristPosUp = newWristPos
      }
    }

    let initialWristPosDown: { x: number; y: number } | undefined

    const handleWristMovementDown = (newWristPos: Vector2D) => {
      if (!initialWristPosDown || initialWristPosDown.y - newWristPos.y > 30) {
        initialWristPosDown = newWristPos
        return
      }

      if (newWristPos.y - initialWristPosDown.y > 300) {
        handleScrollRef.current('down')
        initialWristPosDown = newWristPos
      }
    }

    let poseNetModel: posenet.PoseNet | null = null

    const detectPose = async () => {
      if (!poseNetModel || !videoRef.current) return

      const pose = await poseNetModel.estimateSinglePose(videoRef.current)
      const wristPosition = pose.keypoints[10].position

      handleWristMovementUp(wristPosition)
      handleWristMovementDown(wristPosition)
    }

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })

        const video = videoRef.current

        if (!video) return

        video.srcObject = stream
        video.onloadedmetadata = () => {
          video.play()
        }

        poseNetModel = await posenet.load()
      } catch (error) {
        console.log(error)
      }
    }

    tf.setBackend('webgl')
    tf.ready()
    initializeCamera()

    const intervalId = setInterval(detectPose, 200)

    return () => {
      clearInterval(intervalId)
    }
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
          width={640}
          height={480}
        />
      </div>
    </div>
  )
}
