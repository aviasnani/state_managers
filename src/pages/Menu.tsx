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
    IonToggle
  } from '@ionic/react';
  import {
    homeOutline,
    cameraOutline,
    bookOutline,
    logOutOutline,
    mapOutline,
    logInOutline,
    personAddOutline,
    moonOutline,
  } from 'ionicons/icons';
  import { useLocation } from 'react-router-dom';
  import './Menu.css';
  
  interface AppPage {
    url: string;
    icon: string;
    title: string;
  }
  
  const mainPages: AppPage[] = [
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
        title: 'Map',url:'/tabs/map',icon: mapOutline
    }
  ];
  
  const Menu: React.FC = () => {
    const location = useLocation();
  
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList>
            <IonListHeader>SpotImage</IonListHeader>
            
            {mainPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem 
                    className={location.pathname === appPage.url ? 'selected' : ''} 
                    routerLink={appPage.url} 
                    routerDirection="none" 
                    lines="none" 
                  >
                    <IonIcon slot="start" icon={appPage.icon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>
          <IonList>
            <IonListHeader>Account</IonListHeader>
            <IonMenuToggle autoHide={false}>
                <IonItem routerLink="/login" routerDirection="root" lines='none'>
                    <IonIcon slot="start" icon={logInOutline}/>
                    <IonLabel>Login</IonLabel>
                </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={false}>
                <IonItem routerLink='/signup' routerDirection='root' lines='none'>
                    <IonIcon slot='start' icon={personAddOutline}/>
                    <IonLabel>Sign Up</IonLabel>
                </IonItem>
            </IonMenuToggle>
            <IonItem lines='none'>
                <IonIcon slot='start' icon={moonOutline} />
                <IonLabel>Dark Mode</IonLabel>
                <IonToggle slot="end" />
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    );
  };
  
  export default Menu;