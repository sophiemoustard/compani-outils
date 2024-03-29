import { useEffect, useState, useRef, useReducer } from 'react';
import { Text, ScrollView, View, Keyboard, KeyboardAvoidingView, BackHandler } from 'react-native';
import FeatherButton from '../FeatherButton';
import NiErrorMessage from '../ErrorMessage';
import NiInput from '../form/Input';
import NiPrimaryButton from '../form/PrimaryButton';
import ConfirmationModal from '../modals/ConfirmationModal';
import { ICON, IS_LARGE_SCREEN, KEYBOARD_AVOIDING_VIEW_BEHAVIOR, MARGIN } from '../../styles/metrics';
import styles from './styles';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../reducers/error';

interface PasswordFormProps {
  goBack: () => void,
  onPress: (password: string) => void,
}

const PasswordForm = ({ goBack, onPress }: PasswordFormProps) => {
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const scrollRef = useRef<ScrollView>(null);
  const [passwordError, dispatchPasswordError] = useReducer(errorReducer, initialErrorState);
  const [confirmationError, dispatchConfirmationError] = useReducer(errorReducer, initialErrorState);
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isValidConfirmation, setIsValidConfirmation] = useState<boolean>(false);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hardwareBackPress = () => {
    setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => {
    const keyboardDidHide = () => Keyboard.dismiss();
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress);
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    setIsValidPassword(password.length >= 6);
  }, [password, setIsValidPassword]);

  useEffect(() => {
    setIsValidConfirmation(password === confirmation);
  }, [confirmation, password, setIsValidConfirmation]);

  useEffect(() => {
    if (!isValidationAttempted || isValidPassword) dispatchPasswordError({ type: RESET_ERROR });
    else dispatchPasswordError({ type: SET_ERROR, payload: 'Le mot de passe doit comporter au minimum 6 caractères' });
  }, [isValidationAttempted, isValidPassword]);

  useEffect(() => {
    if (!isValidationAttempted || isValidConfirmation) dispatchConfirmationError({ type: RESET_ERROR });
    else {
      dispatchConfirmationError({
        type: SET_ERROR,
        payload: 'Votre nouveau mot de passe et sa confirmation ne correspondent pas',
      });
    }
  }, [isValidationAttempted, isValidConfirmation]);

  const toggleModal = () => setExitConfirmationModal(!exitConfirmationModal);

  const handlePressConfirmButton = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    goBack();
  };

  const savePassword = async () => {
    dispatchError({ type: RESET_ERROR });
    setIsValidationAttempted(true);
    if (!isValidConfirmation || !isValidPassword) return;

    try {
      setIsLoading(true);
      await onPress(password);
    } catch (e) {
      dispatchError({
        type: SET_ERROR,
        payload: 'Une erreur s\'est produite, si le problème persiste, contactez le support technique.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_VIEW_BEHAVIOR} style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
      <View style={styles.goBack}>
        <FeatherButton name='x-circle' onPress={toggleModal} size={ICON.MD} />
        <ConfirmationModal onPressConfirmButton={handlePressConfirmButton} visible={exitConfirmationModal}
          title="Êtes-vous sûr(e) de cela ?" contentText="Vos modifications ne seront pas enregistrées."
          onPressCancelButton={toggleModal}/>
      </View>
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Modifier mon mot de passe</Text>
        <NiInput caption="Nouveau mot de passe" value={password} onChangeText={setPassword} type="password"
          validationMessage={passwordError.message} style={styles.input} />
        <NiInput caption="Confirmer mot de passe" value={confirmation} onChangeText={setConfirmation}
          type="password" validationMessage={confirmationError.message} style={styles.input} />
        <View style={styles.footer}>
          {!!error.value && <NiErrorMessage message={error.message} />}
          <NiPrimaryButton title="Valider" onPress={savePassword} loading={isLoading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordForm;
