import * as posenet from '@tensorflow-models/posenet'
import { Vector2D } from '@tensorflow-models/posenet/dist/types'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import styles from './CameraStream.module.css'

type CameraScrollProps = {
  handleScroll: () => void
}

export const CameraStream = ({ handleScroll }: CameraScrollProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevRightWristPosRef = useRef<Vector2D>({ x: 0, y: 0 })
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [rightWristPos, setRightWristPos] = useState<Vector2D>({ x: 0, y: 0 })

  useEffect(() => {
    let poseNetModel: posenet.PoseNet | null = null

    const initializePoseNet = async () => {
      poseNetModel = await posenet.load()
    }

    const detectPose = async () => {
      if (!poseNetModel || !videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      context?.drawImage(video, 0, 0)

      const pose = await poseNetModel.estimateSinglePose(canvas)

      setRightWristPos(pose.keypoints[10].position)
    }

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        })

        const video = videoRef.current

        if (!video) return

        video.srcObject = stream
        video.onloadedmetadata = () => {
          video.play()
        }

        await initializePoseNet()
      } catch (error) {
        console.log(error)
      }
    }

    tf.setBackend('webgl')
    tf.ready()
    initializeCamera()

    const intervalId = setInterval(() => {
      detectPose()
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (
      rightWristPos.x === prevRightWristPosRef.current.x &&
      rightWristPos.y === prevRightWristPosRef.current.y
    )
      return

    if (prevRightWristPosRef.current.y - rightWristPos.y > 300) {
      handleScroll()
      prevRightWristPosRef.current = { x: 0, y: 0 }

      return
    }

    prevRightWristPosRef.current = rightWristPos
  }, [rightWristPos, handleScroll])

  const handleChange = () => {
    setIsVideoVisible(!isVideoVisible)
  }

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.checkBoxStyle}>
        <button onClick={handleScroll}>Scroll</button>
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
        />
        <canvas ref={canvasRef} className={styles.displayNone} />
      </div>
    </div>
  )
}
