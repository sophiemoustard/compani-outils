import React, { useCallback, useEffect, useRef } from 'react';
import { Text, View, Animated } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { WHITE, GREEN, ORANGE } from '../../styles/colors';
import styles, { TOAST_OFFSET } from './styles';

interface ToastMessageProps {
  success: boolean,
  onFinish: (finished: boolean) => void,
}
const ToastMessage = ({ onFinish, success }: ToastMessageProps) => {
  const translation = useRef(new Animated.Value(TOAST_OFFSET)).current;
  const style = styles({ backgroundColor: success ? GREEN[600] : ORANGE[600] });

  const pop = useCallback(() => {
    Animated.sequence([
      Animated.timing(translation, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(translation, {
        toValue: TOAST_OFFSET,
        delay: 2500,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => onFinish(finished));
  }, [onFinish, translation]);

  useEffect(() => { pop(); }, [pop]);

  return (
    <Animated.View style={[style.container, { transform: [{ translateY: translation }] }]}>
      <View style={style.content}>
        {success && <Feather name={'check-circle'} size={24} color={WHITE} />}
        {!success && <AntDesign name={'closecircleo'} size={24} color={WHITE} />}
        <Text style={style.text}>
          {success ? 'Modification enregistrée' : 'L\'évènement n\'a pas pu etre modifié'}
        </Text>
      </View>
    </Animated.View>
  );
};

export default ToastMessage;
