import React from 'react';
import { ImageBackground, Text, View, useWindowDimensions } from 'react-native';
import NiButton from '../../components/Button';
import styles from './styles';

const Authentication = () => (
  <ImageBackground
    style={{ height: useWindowDimensions().height }}
    source={require('../../../assets/images/authentication_background_image.jpg')}
  >
    <View style={styles.container}>
      <Text style={styles.title}>Identifiez-vous pour accéder aux informations</Text>
      <NiButton title='Se connecter' onPress={() => {}}></NiButton>
    </View>
  </ImageBackground>
);

export default Authentication;
