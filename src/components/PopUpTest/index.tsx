import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FIRA_SANS_MEDIUM } from '../../styles/fonts';
import { WHITE } from '../../styles/colors';
import { BORDER_RADIUS, PADDING } from '../../styles/metrics';

interface PopUpTestProps {
  trigger: boolean,
}
const PopUpTest = ({ trigger }: PopUpTestProps) => {
  const windowHeight = useWindowDimensions().height;
  const translation = useRef(new Animated.Value(windowHeight)).current;

  const pop = useCallback(() => {
    Animated.sequence([
      Animated.timing(translation, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(translation, {
        toValue: windowHeight,
        delay: 2000,
        duration: 2500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translation, windowHeight]);

  useEffect(() => { if (trigger) pop(); }, [pop, trigger]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: translation }] }]}>
      <View style={styles.content}>
        <Feather name={'check-circle' } size={24} color={WHITE} />
        <View style={styles.text}>
          <Text style={{ ...FIRA_SANS_MEDIUM.MD, color: WHITE }}>{'Modification enregistrée'}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default PopUpTest;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: PADDING.MD,
    height: 60,
    backgroundColor: '#38A169',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  content: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: BORDER_RADIUS.MD,
  },
  text: {
    width: '70%',
    padding: 2,
  },
});
