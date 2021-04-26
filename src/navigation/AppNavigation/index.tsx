import React, { useContext, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Context as AuthContext } from '../../context/AuthContext';
import { navigationRef } from '../../navigationRef';
import Authentication from '../../screens/Authentication';
import ForgotPassword from '../../screens/ForgotPassword';
import Analytics from '../../core/helpers/analytics';
import Home from '../HomeNavigation';

const MainStack = createStackNavigator();

const AppNavigation = () => {
  const { alenviToken, appIsReady, tryLocalSignIn } = useContext(AuthContext);
  const routeNameRef = useRef<string>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { tryLocalSignIn(); }, []);

  const handleOnReadyNavigation = () => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name || '';
    routeNameRef.current = currentRouteName;
    Analytics.logScreenView(currentRouteName);
  };

  const handleNavigationStateChange = () => {
    const prevRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name || '';

    if (prevRouteName !== currentRouteName) {
      Analytics.logScreenView(currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  };

  const authScreens = { Authentication, ForgotPassword };
  const userScreens = { Home };

  if (!appIsReady) return null;

  return (
    <NavigationContainer ref={navigationRef} onReady={handleOnReadyNavigation}
      onStateChange={handleNavigationStateChange}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {Object.entries(alenviToken ? userScreens : authScreens)
          .map(([name, component]) => <MainStack.Screen key={name} name={name} component={component} />)}
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;