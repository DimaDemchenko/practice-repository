import { WristDetection } from '../wrist-detection/WristDetection'

type CameraStreamProps = {
  handleWrist: (direction: 'up' | 'down') => void
  isCameraPreviewOn?: boolean
  videoWidth?: number
  videoHeight?: number
}

export const CameraStream = ({
  handleWrist,
  isCameraPreviewOn,
  videoWidth,
  videoHeight,
}: CameraStreamProps) => {
  return (
    <div className="camera-container">
      <WristDetection
        handleWrist={handleWrist}
        isCameraPreviewOn={isCameraPreviewOn}
        videoWidth={videoWidth}
        videoHeight={videoHeight}
      />
    </div>
  )
}
