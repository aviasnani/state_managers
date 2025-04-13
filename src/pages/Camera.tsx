import React, { useEffect, useRef } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton,
  IonIcon,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonAlert,
  IonModal,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  useIonToast,
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { camera, images } from 'ionicons/icons';
import './Camera.css';

const CameraPage: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [presentToast] = useIonToast();

  useEffect(() => {
    // Only request camera permissions on native platforms
    if (Capacitor.isNativePlatform()) {
      requestCameraPermission();
    }
  }, []);

  useEffect(() => {
    if (showCamera) {
      // Delay to let the modal and video element render
      const timeout = setTimeout(() => {
        startWebCamera();
      }, 300); // You can tweak the delay if needed
  
      return () => clearTimeout(timeout);
    }
  }, [showCamera]);

  useEffect(() => {
    // Cleanup function to stop the camera stream when component unmounts
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const requestCameraPermission = async () => {
    try {
      // For web browsers, explicitly request permission
      if (!Capacitor.isNativePlatform()) {
        const result = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop this test stream immediately
        result.getTracks().forEach(track => track.stop());
      } else {
        const permission = await Camera.checkPermissions();
        if (permission.camera !== 'granted') {
          await Camera.requestPermissions();
        }
      }
    } catch (err) {
      console.error('Permission error:', err);
      setError('Camera permission is required to take photos.');
    }
  };

  const startWebCamera = async () => {
    console.log('Starting web camera...');
    setIsLoading(true);
    setError(null);
    
    try {
      // First ensure any existing streams are stopped
      stopCameraStream();

      console.log('Requesting camera access...');
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: true
      };

      console.log('Constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got stream:', stream);

      if (!videoRef.current) {
        console.warn('Video element not ready yet');
        return;
      }

      videoRef.current.setAttribute('autoplay', '');
      videoRef.current.setAttribute('playsinline', '');
      videoRef.current.setAttribute('muted', '');
      videoRef.current.muted = true;

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Show camera modal before waiting for video to load
      setShowCamera(true);

      console.log('Waiting for video to load...');
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return;
        const handleVideoReady = () => {
          if(videoRef.current) {
            videoRef.current.play()
            .then(() => {
              console.log('Video playback started');
              setIsLoading(false);
              resolve();
            })

            .catch(error => {
              console.error('Video playback failed:', error);
              setIsLoading(false);
            });
          
        }
      };
        

        // Add timeout to prevent hanging
        setTimeout(() => {
          reject(new Error('Video loading timed out'));
        }, 10000);
      });
    
    } catch (error) {
      console.error('Web camera error:', error);
      //setShowCamera(false);
    } finally {
      setIsLoading(false);
    }
  };

  const captureWebPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const newPhoto = {
          id: Date.now(),
          dataUrl,
          timestamp: new Date().toISOString(),
          userId: currentUser.id
        };

        // Get existing photos from localStorage
        const existingPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
        // Add new photo to the beginning of the array
        const updatedPhotos = [newPhoto, ...existingPhotos];
        // Save back to localStorage
        localStorage.setItem('photos', JSON.stringify(updatedPhotos));

        // Stop the camera stream and close the modal
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
      }
    }
  };

  const handlePhotoCapture = async (source: CameraSource) => {
    try {
      console.log('Platform:', Capacitor.getPlatform());
  
      if (Capacitor.getPlatform() === 'web') {
        console.log('Requesting camera permission via getUserMedia...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Camera permission granted via getUserMedia');
      } else {
        const permissions = await Camera.checkPermissions();
        if (permissions.camera !== 'granted') {
          const result = await Camera.requestPermissions();
          if (result.camera !== 'granted') {
            throw new Error('Camera permission not granted');
          }
        }
      }
  
      // JUST OPEN THE MODAL, DO NOT CALL startWebCamera() HERE
      setShowCamera(true);
    } catch (err) {
      console.error('Permission error:', err);
      setError('Camera permission is required to take photos.');
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2">
              <IonCard>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonButton 
                          expand="block" 
                          size="large"
                          onClick={() => handlePhotoCapture(CameraSource.Camera)}
                          className="camera-button"
                        >
                          <IonIcon icon={camera} slot="start" />
                          Take Photo
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal 
          isOpen={showCamera} 
          onDidDismiss={() => {
            setShowCamera(false);
            stopCameraStream();
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Take Photo</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => {
                  setShowCamera(false);
                  stopCameraStream();
                }}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%',
              backgroundColor: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <IonSpinner name="crescent" />
                  <div style={{ color: 'white' }}>Initializing camera...</div>
                </div>
              )}
              <video 
  ref={el => {
    console.log('Video ref set:', el);
    videoRef.current = el;
  }}
  autoPlay 
  playsInline
  muted
  style={{ 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain',
    display: isLoading ? 'none' : 'block'
  }}
/>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {!isLoading && (
                <IonButton
                  onClick={captureWebPhoto}
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  Capture
                </IonButton>
              )}
            </div>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header="Error"
          message={error || ""}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;
