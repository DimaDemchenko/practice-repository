import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef } from 'react'

type WristDetectionProps = {
  handleWrist: (direction: 'up' | 'down') => void
  isCameraPreviewOn?: boolean
  videoWidth?: number
  videoHeight?: number
}

export const WristDetection = ({
  handleWrist,
  isCameraPreviewOn,
  videoWidth,
  videoHeight,
}: WristDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const handleScrollRef = useRef(handleWrist)
  handleScrollRef.current = handleWrist

  useEffect(() => {
    let initialWristPos: { x: number; y: number; time: number } | undefined
    let poseNetModel: posenet.PoseNet | null = null
    let isDetecting = false
    let stream: MediaStream | null = null

    const detectPose = async () => {
      if (
        !poseNetModel ||
        !videoRef.current ||
        isDetecting ||
        !videoWidth ||
        !videoHeight
      ) {
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

        if (
          wristPosition.y < videoHeight * 0.33 &&
          Date.now() - initialWristPos.time > 250
        ) {
          handleScrollRef.current('down')
          initialWristPos = { ...wristPosition, time: Date.now() }
        }

        if (
          wristPosition.y > videoHeight * 0.66 &&
          Date.now() - initialWristPos.time > 250
        ) {
          handleScrollRef.current('up')
          initialWristPos = { ...wristPosition, time: Date.now() }
        }
      } finally {
        isDetecting = false
      }
    }

    const initializeCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: videoWidth, height: videoHeight },
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

      if (!stream) return

      stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [videoHeight, videoWidth])

  return (
    <>
      <video
        className={isCameraPreviewOn ? 'video-stream' : 'display-none'}
        ref={videoRef}
        width={videoWidth}
        height={videoHeight}
      />
    </>
  )
}
