import { useWristDetection } from '../../hooks/useWristDetection'

type CameraScrollProps = {
  handleWrist: (direction: 'up' | 'down') => void
}

export const CameraStream = ({ handleWrist }: CameraScrollProps) => {
  const videoRef = useWristDetection({ handleWrist })

  return (
    <div className="camera-container">
      <div>
        <video
          className="video-stream"
          ref={videoRef}
          width={1280}
          height={720}
        />
      </div>
    </div>
  )
}
