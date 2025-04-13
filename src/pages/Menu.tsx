import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    useIonToast,
    IonAlert
  } from '@ionic/react';
  import {
    homeOutline,
    cameraOutline,
    bookOutline,
    mapOutline,
    cloudyOutline,
    logOutOutline,
    logInOutline,
    personAddOutline,
  } from 'ionicons/icons';
  import { useLocation, useHistory } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import { App } from '@capacitor/app';
  import { Capacitor } from '@capacitor/core';
  import './Menu.css';
  
  interface AppPage {
    url: string;
    icon: string;
    title: string;
  }
  
  const appPages: AppPage[] = [
    {
      title: 'Photo Feed',
      url: '/tabs/home',
      icon: homeOutline
    },
    {
      title: 'Take Photo',
      url: '/tabs/camera',
      icon: cameraOutline
    },
    {
      title: 'Journal',
      url: '/tabs/journal',
      icon: bookOutline
    },
    {
      title: 'Map',
      url: '/tabs/map',
      icon: mapOutline
    },
    {
      title: 'Weather',
      url: '/tabs/weather',
      icon: cloudyOutline
    }
  ];
  
  const Menu: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [userName, setUserName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
  
    useEffect(() => {
      // Get user name from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser && currentUser.name) {
        setUserName(currentUser.name);
      }
    }, []);
  
    const handleLogout = async () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      
      await presentToast({
        message: 'Logged out successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
  
      // If on native platform (Android/iOS), exit the app
      if (Capacitor.isNativePlatform()) {
        await App.exitApp();
      } else {
        // On web, redirect to login
        history.push('/login');
        window.location.reload(); // Force reload to reset app state
      }
    };
  
    const handleAuthClick = (type: 'login' | 'signup') => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        setAlertMessage(type === 'login' 
          ? 'You are already logged in. Please logout first to access the login page.' 
          : 'You are already registered and logged in. Please logout first to create a new account.');
        setShowAlert(true);
      } else {
        history.push(type === 'login' ? '/login' : '/signup');
      }
    };
  
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>Hi, {userName}!</IonListHeader>
            <IonNote>Welcome to SpotImage</IonNote>
            
            {appPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem 
                    className={location.pathname === appPage.url ? 'selected' : ''} 
                    routerLink={appPage.url} 
                    routerDirection="root" 
                    lines="none" 
                    detail={false}
                  >
                    <IonIcon slot="start" icon={appPage.icon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>

          {!localStorage.getItem('isLoggedIn') && (
            <IonList id="account-list">
              <IonListHeader>Account</IonListHeader>
              <IonItem button onClick={() => handleAuthClick('login')}>
                <IonIcon slot="start" icon={logInOutline} />
                <IonLabel>Login</IonLabel>
              </IonItem>
              <IonItem button onClick={() => handleAuthClick('signup')}>
                <IonIcon slot="start" icon={personAddOutline} />
                <IonLabel>Sign Up</IonLabel>
              </IonItem>
            </IonList>
          )}

          <IonList>
            {localStorage.getItem('isLoggedIn') && (
              <IonItem button onClick={handleLogout}>
                <IonIcon slot="start" icon={logOutOutline} />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            )}
          </IonList>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Notice"
            message={alertMessage}
            buttons={['OK']}
          />
        </IonContent>
      </IonMenu>
    );
  };
  
  export default Menu;
