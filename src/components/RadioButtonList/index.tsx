import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { BLACK, GREY } from '../../styles/colors';

type RadioButtonOptionsType = { label: string, value: string };

interface RadioButtonProps {
  options: RadioButtonOptionsType[],
  setOption: (option: string | null) => void,
}

interface RenderItemProps {
  item: { label: string, value: string },
  checkedRadioButton: string | null,
  onPressCheckbox: (value: string) => void
}

const renderSeparator = () => <View style={styles.separator} />;

const renderItem = ({ item, checkedRadioButton, onPressCheckbox }: RenderItemProps) => {
  const iconName = checkedRadioButton === item.value ? 'radio-button-checked' : 'radio-button-unchecked';
  const iconColor = checkedRadioButton === item.value ? BLACK : GREY[600];
  const textStyle = checkedRadioButton === item.value ? styles.text : { ...styles.text, color: GREY[600] };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressCheckbox(item.value)}>
      <MaterialIcons style={styles.icon} size={20} name={iconName} color={iconColor} />
      <Text style={textStyle}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const RadioButtonList = ({ options, setOption }: RadioButtonProps) => {
  const [checkedRadioButton, setCheckedRadioButton] = useState<string | null>(null);

  useEffect(() => setOption(checkedRadioButton), [setOption, checkedRadioButton]);

  const onPressCheckbox = (value: string) => setCheckedRadioButton(prevValue => (prevValue === value ? null : value));

  return (
    <FlatList data={options} keyExtractor={item => item.label} ItemSeparatorComponent={renderSeparator}
      renderItem={({ item }) => renderItem({ item, checkedRadioButton, onPressCheckbox })} />
  );
};

export default RadioButtonList;
