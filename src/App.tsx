import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonSplitPane, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Journal from './pages/Journal';
import Map from './pages/Map';
import Menu from './pages/Menu';
import SignUp from './pages/SignUp';

import { 
  camera,          
  images,          
  journal,         
  map,   

} from 'ionicons/icons';


import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();
{/** do not remove setupIonicReact its important so ionic things wont fall aparat */}

const App: React.FC = () => {

  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
       
        <Route  path="/login" component={Login} exact />
        <Route path="/signup" component={SignUp} exact />
        <Route path="/tabs" render={() => (
          <IonSplitPane contentId="main">  {/**do not reverse order of ionsplitpane and routeroulet as first is parent */}
             <Menu /> 
             <IonRouterOutlet id="main">
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/home" component={Home} />
                <Route exact path="/tabs/camera" component={Camera} />
                <Route exact path="/tabs/journal" component={Journal} />
                <Route exact path="/tabs/map" component={Map} />
                <Redirect exact from="/tabs" to="/tabs/home" />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/tabs/home">
                  <IonIcon icon={images} />
                  <IonLabel>Feed</IonLabel>
                </IonTabButton>
                
                <IonTabButton tab="camera" href="/tabs/camera">
                  <IonIcon icon={camera} />
                  <IonLabel>Camera</IonLabel>
                </IonTabButton>

                <IonTabButton tab="journal" href="/tabs/journal">
                  <IonIcon icon={journal} />
                  <IonLabel>Journal</IonLabel>
                </IonTabButton>

                <IonTabButton tab="map" href="/tabs/map">
                      <IonIcon icon={map} />
                      <IonLabel>Map</IonLabel>
                    </IonTabButton>


              </IonTabBar>
            </IonTabs>
            </IonRouterOutlet>
            </IonSplitPane>
          )} />

          <Redirect exact from="/" to="/login" />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>

);
};
export default App;
