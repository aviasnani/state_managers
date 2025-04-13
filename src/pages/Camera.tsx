<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const CameraPage: React.FC = () => {
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    // Load last photo from localStorage on component mount
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    if (photos.length > 0) {
      setPhoto(photos[photos.length - 1].dataUrl);
    }
  }, []);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      setPhoto(image.dataUrl || '');
      
      // Save to localStorage
      const photos = JSON.parse(localStorage.getItem('photos') || '[]');
      photos.push({
        id: Date.now(),
        dataUrl: image.dataUrl,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('photos', JSON.stringify(photos));
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

=======
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
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { camera } from 'ionicons/icons';
import './Camera.css';

const CameraPage: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Only request camera permissions on native platforms
    if (Capacitor.isNativePlatform()) {
      requestCameraPermission();
    }
  }, []);

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
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        await Camera.requestPermissions();
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
        audio: false
      };

      console.log('Constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got stream:', stream);

      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Show camera modal before waiting for video to load
      setShowCamera(true);

      console.log('Waiting for video to load...');
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not found'));
          return;
        }

        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play()
            .then(() => {
              console.log('Video playback started');
              resolve();
            })
            .catch(error => {
              console.error('Video playback failed:', error);
              reject(error);
            });
        };

        // Add timeout to prevent hanging
        setTimeout(() => {
          reject(new Error('Video loading timed out'));
        }, 10000);
      });

    } catch (error) {
      console.error('Web camera error:', error);
      setError('Failed to access camera. Please make sure camera permissions are granted.');
      setShowCamera(false);
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

  const takePicture = async () => {
    if (!Capacitor.isNativePlatform()) {
      // For web platform, start the camera
      await startWebCamera();
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear,
        saveToGallery: true,
      });

      if (image.dataUrl) {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const newPhoto = {
          id: Date.now(),
          dataUrl: image.dataUrl,
          timestamp: new Date().toISOString(),
          userId: currentUser.id
        };

        // Get existing photos from localStorage
        const existingPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
        // Add new photo to the beginning of the array
        const updatedPhotos = [newPhoto, ...existingPhotos];
        // Save back to localStorage
        localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      }
    } catch (error) {
      console.error('Camera error:', error);
      setError('Failed to take photo. Please make sure camera permissions are granted.');
    }
  };

>>>>>>> ea2334a581d62cb6be2c1a06ec3a30cfcbd33810
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

<<<<<<< HEAD
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton expand="block" onClick={takePicture}>
                Take Photo
              </IonButton>
            </IonCol>
            <IonCol size="6">
              {photo && (
                <IonCard>
                  <IonCardContent>
                    <IonImg src={photo} alt="Captured photo" />
                  </IonCardContent>
                </IonCard>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
=======
      <IonContent className="camera-content">
        <div className="camera-container">
          <IonButton 
            onClick={takePicture}
            size="large"
            className="camera-button"
            disabled={isLoading}
          >
            {isLoading ? <IonSpinner name="crescent" /> : (
              <>
                <IonIcon icon={camera} slot="start" />
                Take Photo
              </>
            )}
          </IonButton>
        </div>

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
                ref={videoRef}
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
>>>>>>> ea2334a581d62cb6be2c1a06ec3a30cfcbd33810
      </IonContent>
    </IonPage>
  );
};

<<<<<<< HEAD
export default CameraPage;
=======
export default CameraPage;
>>>>>>> ea2334a581d62cb6be2c1a06ec3a30cfcbd33810
