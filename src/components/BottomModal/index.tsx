import React from 'react';
import { View, Modal } from 'react-native';
import FeatherButton from '../FeatherButton';
import { ICON } from '../../styles/metrics';
import { COPPER_GREY } from '../../styles/colors';
import styles from './styles';

type NiBottomModalProps = {
  visible: boolean,
  header?: JSX.Element,
  children: JSX.Element,
  onRequestClose: () => void,
}

const BottomModal = ({ visible, header, children, onRequestClose }: NiBottomModalProps) => (
  <Modal visible={visible} onRequestClose={onRequestClose} transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        { header || <FeatherButton name='x-circle' onPress={onRequestClose} size={ICON.LG} color={COPPER_GREY[600]}
          style={styles.goBack} /> }
        {children}
      </View>
    </View>
  </Modal>);

export default BottomModal;
