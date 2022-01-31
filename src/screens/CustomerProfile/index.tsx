import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isEqual, pick } from 'lodash';
import Customers from '../../api/Customers';
import { UserType } from '../../types/UserType';
import { formatIdentity } from '../../core/helpers/utils';
import NiHeader from '../../components/Header';
import NiInput from '../../components/form/Input';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ErrorMessage from '../../components/ErrorMessage';
import { KEYBOARD_PADDING_TOP } from '../../styles/metrics';
import styles from './style';
import { COPPER } from '../../styles/colors';

type CustomerProfileProp = {
  route: { params: { customerId: string } },
};

const CustomerProfile = ({ route }: CustomerProfileProp) => {
  const navigation = useNavigation();
  const { customerId } = route.params;
  const [customer, setCustomer] = useState<UserType | null>(null);
  const [editedFollowUp, setEditedFollowUp] = useState<UserType['followUp']>({ environment: '' });
  const initialCustomerFollowUp = useRef<UserType['followUp']>(editedFollowUp);
  const [exitModal, setExitModal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const getCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const currentCustomer = await Customers.getById(customerId);
      setCustomer(currentCustomer);
      setEditedFollowUp({ environment: currentCustomer?.followUp.environment || '' });
      initialCustomerFollowUp.current = currentCustomer?.followUp || {};
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { getCustomer(); }, [getCustomer]);

  const onLeave = () => {
    if (isEqual(pick(editedFollowUp, ['environment']), pick(initialCustomerFollowUp.current, ['environment']))) {
      navigation.goBack();
    } else setExitModal(true);
  };

  const onConfirmExit = () => {
    setExitModal(false);
    navigation.goBack();
  };

  const onSave = async () => {
    try {
      setLoading(true);
      await Customers.updateById(customerId, { followUp: editedFollowUp });
      initialCustomerFollowUp.current = editedFollowUp;
    } catch (e) {
      console.error(e);
      setApiErrorMessage('Une erreur s\'est produite, si le problème persiste, contactez le support technique.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => setApiErrorMessage(''), [setApiErrorMessage, editedFollowUp]);

  return (
    <>
      <NiHeader onPressIcon={onLeave} onPressButton={onSave} loading={loading} />
      <KeyboardAwareScrollView extraScrollHeight={KEYBOARD_PADDING_TOP} enableOnAndroid>
        {loading && <ActivityIndicator style={styles.loader} size="small" color={COPPER[500]} />}
        {!loading &&
          <ScrollView style={styles.screen}>
            <Text style={styles.identity}>{formatIdentity(customer?.identity, 'FL')}</Text>
            <NiInput style={styles.input} caption="Environnement" value={editedFollowUp.environment} multiline
              onChangeText={(value: string) => { setEditedFollowUp({ ...editedFollowUp, environment: value }); }}
              placeholder="Précisez l'environnement de l'accompagnement : entourage de la personne, famille, voisinage,
                histoire de vie, contexte actuel..." />
            <ConfirmationModal onPressConfirmButton={onConfirmExit} onPressCancelButton={() => setExitModal(false)}
              visible={exitModal} contentText="Voulez-vous supprimer les modifications apportées ?"
              cancelText="Poursuivre les modifications" confirmText="Supprimer" />
            <ErrorMessage message={apiErrorMessage || ''} />
          </ScrollView>}
      </KeyboardAwareScrollView>
    </>
  );
};

export default CustomerProfile;
