import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import commonStyle from '../../styles/common';
import Events from '../../api/Events';
import { Context as AuthContext } from '../../context/AuthContext';
import styles from './style';
import { INTERVENTION } from '../../core/data/constants';

const TimeStampingProfile = () => {
  const currentDate = new Date();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [startDateEvent, setStartDateEvent] = useState<Date|null>(new Date());
  const [endDateEvent, setEndDateEvent] = useState<Date|null>(new Date());
  const [eventNumber, setEventNumber] = useState<number>(0);

  const { loggedUser } = useContext(AuthContext);

  const formatDate = (date: Date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date: Date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('fr-FR', options);
  };

  const eventData = async () => {
    let events = [];
    let eventsFormat = [];

    try {
      if (loggedUser?._id) {
        const params = {
          auxiliary: loggedUser._id,
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          type: INTERVENTION,
        };
        events = await Events.events(params);
        if (events === undefined || events === null) {
          console.error('Events Error');
        } else {
          eventsFormat = events.map((event : any) => {
            const customerFirstName = event.customer.identity.firstname;
            const customerLastName = event.customer.identity.lastname;
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            return { customerFirstName, customerLastName, startDate, endDate };
          });
          setEventNumber(eventsFormat.length);
          setFirstName(eventsFormat[0].customerFirstName);
          setLastName(eventsFormat[0].customerLastName);
          setEndDateEvent(new Date(eventsFormat[0].endDate));
          setStartDateEvent(new Date(eventsFormat[0].startDate));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    eventData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.view}>
        <Text style={[commonStyle.title, styles.title]}>Horodatage </Text>
        <Text style={styles.date}>{formatDate(currentDate)}</Text>
        <Text style={styles.time}>{formatTime(currentDate)}</Text>
      </View>
      <Text>Aujourd&apos;hui j&apos;ai {eventNumber} interventions</Text>
      <View style={styles.cellEvent}>
        <Text style={styles.cellText}>{firstName} {lastName}</Text>
        <View style={styles.sectionDelimiter} />
        <View>
          <Text style={styles.eventTimeText}>Debut</Text>
          <Text style={styles.scheduledEvent}>{startDateEvent?.getHours()}:{startDateEvent?.getMinutes()}</Text>
        </View>
        <View style={styles.sectionDelimiter} />
        <View>
          <Text style={styles.eventTimeText}>Fin</Text>
          <Text style={styles.scheduledEvent}>{endDateEvent?.getHours()}:{endDateEvent?.getMinutes()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TimeStampingProfile;
