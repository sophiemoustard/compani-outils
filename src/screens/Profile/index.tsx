import React, { useContext, useEffect, useState } from 'react';
import { Text, View, Image, ImageSourcePropType } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NiSecondaryButton from '../../components/form/SecondaryButton';
import { Context as AuthContext } from '../../context/AuthContext';
import commonStyle from '../../styles/common';
import { formatPhone } from '../../core/helpers/utils';
import styles from './styles';

const Profile = () => {
  const { signOut, loggedUser } = useContext(AuthContext);
  const [source, setSource] = useState<ImageSourcePropType>({});

  useEffect(() => {
    if (loggedUser?.picture?.link) setSource({ uri: loggedUser.picture.link });
    else setSource(require('../../../assets/images/default_avatar.png'));
  }, [loggedUser?.picture?.link]);

  return (
    <ScrollView>
      <View style={styles.identityContainer}>
        <Text style={commonStyle.title}>Mon profil</Text>
        <View style={styles.profilView}>
          <Image source={source} style={styles.image} />
          <View style={styles.infosProfilView}>
            <Text style={styles.name}>{loggedUser?.identity?.firstname} {loggedUser?.identity?.lastname}</Text>
            <Text style={styles.company}>{loggedUser?.company?.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionDelimiter} />
      <View style={styles.contactContainer}>
        <Text style={styles.contact}>Contact</Text>
        <Text style={styles.subtitle}>Téléphone</Text>
        <Text style={styles.infos}>{formatPhone(loggedUser?.contact?.phone) || 'Non renseigné'}</Text>
        <Text style={styles.subtitle}>E-mail</Text>
        <Text style={styles.infos}>{loggedUser?.local?.email}</Text>
      </View>
      <View style={styles.sectionDelimiter} />
      <View style={styles.buttonContainer}>
        <NiSecondaryButton title='Me déconnecter' onPress={signOut} />
      </View>
    </ScrollView>
  );
};

export default Profile;
