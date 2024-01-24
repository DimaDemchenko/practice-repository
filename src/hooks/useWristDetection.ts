import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef } from 'react'
type useWristProps = {
  handleWrist: (direction: 'up' | 'down') => void
}

export const useWristDetection = ({ handleWrist }: useWristProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const handleScrollRef = useRef(handleWrist)
  handleScrollRef.current = handleWrist

  useEffect(() => {
    let initialWristPos: { x: number; y: number; time: number } | undefined
    let poseNetModel: posenet.PoseNet | null = null
    let isDetecting = false

    const detectPose = async () => {
      if (!poseNetModel || !videoRef.current || isDetecting) {
        return
      }
      try {
        isDetecting = true

        const pose = await poseNetModel.estimateSinglePose(videoRef.current)
        const wristPosition = pose.keypoints[10].position

        if (!initialWristPos) {
          initialWristPos = { ...wristPosition, time: Date.now() }
          return
        }

        if (wristPosition.y < 300 && Date.now() - initialWristPos.time > 250) {
          handleScrollRef.current('down')
          initialWristPos = { ...wristPosition, time: Date.now() }
        }

        if (wristPosition.y > 500 && Date.now() - initialWristPos.time > 250) {
          handleScrollRef.current('up')
          initialWristPos = { ...wristPosition, time: Date.now() }
        }
      } finally {
        isDetecting = false
      }
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

        poseNetModel = await posenet.load()
      } catch (error) {
        console.log(error)
      }
    }

    tf.setBackend('webgl')
    tf.ready()
    initializeCamera()

    const intervalId = setInterval(() => {
      detectPose()
    }, 50)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return videoRef
}
