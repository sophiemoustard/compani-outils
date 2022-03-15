import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isEqual, pick } from 'lodash';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Customers from '../../api/Customers';
import { CustomerType, UserType, FormattedUserType } from '../../types/UserType';
import { formatIdentity, formatPhone } from '../../core/helpers/utils';
import { formatAuxiliary } from '../../core/helpers/auxiliaries';
import NiHeader from '../../components/Header';
import NiInput from '../../components/form/Input';
import NiPersonSelect from '../../components/PersonSelect';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ErrorMessage from '../../components/ErrorMessage';
import { ICON, KEYBOARD_PADDING_TOP } from '../../styles/metrics';
import styles from './style';
import { COPPER, COPPER_GREY } from '../../styles/colors';
import CompaniDate from '../../core/helpers/dates/companiDates';
import Users from '../../api/Users';
import { AUXILIARY, PLANNING_REFERENT } from '../../core/data/constants';
import PopUpTest from '../../components/PopUpTest';

type CustomerProfileProp = {
  route: { params: { customerId: string } },
};

const OBJECTIVES_PLACEHOLDER = 'Précisez les objectifs de l\'accompagnement : lever, toilette, préparation des repas,'
  + ' courses, déplacement véhiculé...';

const ENVIRONMENT_PLACEHOLDER = 'Précisez l\'environnement de l\'accompagnement : entourage de la personne, famille,'
  + ' voisinage, histoire de vie, contexte actuel...';

const CustomerProfile = ({ route }: CustomerProfileProp) => {
  const navigation = useNavigation();
  const { customerId } = route.params;
  const customer = {
    _id: '',
    identity: { firstname: '', lastname: '', birthDate: '' },
    contact: { phone: '', primaryAddress: { fullAddress: '', street: '', zipCode: '', city: '' }, accessCodes: '' },
    followUp: { environment: '', objectives: '', misc: '' },
    company: '',
    referent: {
      _id: '',
      identity: { firstname: '', lastname: '' },
      local: { email: '' },
      contact: { phone: '' },
      company: { name: '' },
    },
  };
  const [initialCustomer, setInitialCustomer] = useState<CustomerType>(customer);
  const [editedCustomer, setEditedCustomer] = useState<CustomerType>(customer);
  const [exitModal, setExitModal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [customerBirth, setCustomerBirth] = useState<string>('');
  const [activeAuxiliaries, setActiveAuxiliaries] = useState<FormattedUserType[]>([]);
  const [triggerPopUp, setTriggerPopUp] = useState<boolean>(false);

  useEffect(() => {
    const birthDate = initialCustomer?.identity?.birthDate
      ? `${CompaniDate(initialCustomer?.identity?.birthDate).format('dd LLLL yyyy')}`
        + ` (${CompaniDate().diff(initialCustomer?.identity?.birthDate, 'years').years} ans)`
      : 'non renseigné';
    setCustomerBirth(birthDate);
  }, [initialCustomer?.identity?.birthDate]);

  const getCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const currentCustomer = await Customers.getById(customerId);
      setInitialCustomer({
        ...currentCustomer,
        referent: currentCustomer.referent ? formatAuxiliary(currentCustomer.referent) : {},
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { getCustomer(); }, [getCustomer]);

  useEffect(() => { setEditedCustomer(initialCustomer); }, [initialCustomer]);

  const getActiveAuxiliaries = useCallback(async () => {
    try {
      if (initialCustomer.company) {
        const activeAux = await Users.getActive({
          role: [AUXILIARY, PLANNING_REFERENT],
          company: initialCustomer.company,
        });
        const formattedAux = activeAux.map((aux: UserType) => (formatAuxiliary(aux)));
        setActiveAuxiliaries(formattedAux);
      }
    } catch (e) {
      console.error(e);
      setActiveAuxiliaries([]);
    }
  }, [initialCustomer.company]);

  useEffect(() => { getActiveAuxiliaries(); }, [getActiveAuxiliaries]);

  const onLeave = () => {
    const pickedFields = [
      'followUp.environment',
      'followUp.objectives',
      'followUp.misc',
      'contact.accessCodes',
      'referent._id',
    ];

    if (isEqual(pick(editedCustomer, pickedFields), pick(initialCustomer, pickedFields))) {
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
      const payload = {
        followUp: editedCustomer.followUp,
        contact: { accessCodes: editedCustomer.contact.accessCodes || '' },
        referent: editedCustomer?.referent?._id || '',
      };

      await Customers.updateById(customerId, payload);
      setInitialCustomer(editedCustomer);
      setTriggerPopUp(true);
    } catch (e) {
      console.error(e);
      setApiErrorMessage('Une erreur s\'est produite, si le problème persiste, contactez le support technique.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setApiErrorMessage('');
    setTriggerPopUp(false);
  }, [setApiErrorMessage, editedCustomer]);

  const onChangeFollowUpText = (key: string) => (text: string) => {
    setEditedCustomer({ ...editedCustomer, followUp: { ...editedCustomer.followUp, [key]: text } });
  };

  const onChangeContactText = (text: string) => {
    setEditedCustomer({ ...editedCustomer, contact: { ...editedCustomer.contact, accessCodes: text } });
  };

  const onSelectAuxiliary = (aux: UserType) => {
    setEditedCustomer({ ...editedCustomer, referent: formatAuxiliary(aux) });
  };

  return (
    <>
      <NiHeader onPressIcon={onLeave} onPressButton={onSave} loading={loading}
        title={formatIdentity(initialCustomer?.identity, 'FL')} />
      <KeyboardAwareScrollView extraScrollHeight={KEYBOARD_PADDING_TOP} enableOnAndroid>
        {loading && <ActivityIndicator style={styles.loader} size="small" color={COPPER[500]} />}
        {!loading &&
          <ScrollView>
            <View style={styles.screen}>
              <Text style={styles.identity}>{formatIdentity(initialCustomer?.identity, 'FL')}</Text>
            </View>
            <View style={styles.infosContainer}>
              <Text style={styles.sectionText}>Infos pratiques</Text>
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={ICON.SM} color={COPPER_GREY[400]} />
                <Text style={styles.infoText}>{initialCustomer?.contact?.primaryAddress?.fullAddress}</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="phone" size={ICON.SM} color={COPPER_GREY[400]} />
                <Text style={styles.infoText}>
                  {initialCustomer?.contact?.phone ? formatPhone(initialCustomer?.contact?.phone) : 'non renseigné'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="cake" size={ICON.SM} color={COPPER_GREY[400]} />
                <Text style={styles.infoText}>{customerBirth}</Text>
              </View>
              <NiInput style={styles.input} caption="Accès" value={editedCustomer?.contact?.accessCodes || ''}
                multiline onChangeText={onChangeContactText} />
            </View>
            <View style={styles.separator} />
            <View style={styles.infosContainer}>
              <Text style={styles.sectionText}>Référents</Text>
              <NiPersonSelect title={'Auxiliaire référent(e)'} placeHolder={'Pas d\'auxiliaire référent(e)'}
                person={formatAuxiliary(editedCustomer.referent || customer.referent)}
                personOptions={activeAuxiliaries} style={styles.referent} onSelectPerson={onSelectAuxiliary} />
              {!!editedCustomer?.referent?.contact?.phone &&
                <View style={styles.infoItem}>
                  <MaterialIcons name="phone" size={ICON.SM} color={COPPER[500]} />
                  <Text style={styles.phoneReferent}>{formatPhone(editedCustomer?.referent?.contact?.phone)}</Text>
                </View>}
            </View>
            <View style={styles.separator} />
            <View style={styles.infosContainer}>
              <Text style={styles.sectionText}>Accompagnement</Text>
              <NiInput caption="Environnement" value={editedCustomer?.followUp?.environment}
                multiline onChangeText={onChangeFollowUpText('environment')} placeholder={ENVIRONMENT_PLACEHOLDER} />
              <NiInput style={styles.input} caption="Objectifs" value={editedCustomer?.followUp?.objectives}
                multiline onChangeText={onChangeFollowUpText('objectives')} placeholder={OBJECTIVES_PLACEHOLDER} />
              <NiInput style={styles.input} caption="Autres" value={editedCustomer?.followUp?.misc}
                multiline onChangeText={onChangeFollowUpText('misc')} />
            </View>
            <ConfirmationModal onPressConfirmButton={onConfirmExit} onPressCancelButton={() => setExitModal(false)}
              visible={exitModal} contentText="Voulez-vous supprimer les modifications apportées ?"
              cancelText="Poursuivre les modifications" confirmText="Supprimer" />
            <ErrorMessage message={apiErrorMessage || ''} />
            {triggerPopUp && <PopUpTest onFinish={() => setTriggerPopUp(false)} />}
          </ScrollView>}
      </KeyboardAwareScrollView>
    </>
  );
};

export default CustomerProfile;
