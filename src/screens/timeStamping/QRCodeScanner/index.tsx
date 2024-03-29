import { useState, useReducer, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera } from 'expo-camera';
import { AxiosError } from 'axios';
import styles from './styles';
import { TRANSPARENT_COPPER, WHITE } from '../../../styles/colors';
import { hitSlop, ICON } from '../../../styles/metrics';
import { isIOS, QR_CODE_TIME_STAMPING, TIME_STAMP_SWITCH_OPTIONS } from '../../../core/data/constants';
import CompaniDate from '../../../core/helpers/dates/companiDates';
import FeatherButton from '../../../components/FeatherButton';
import EventInfoCell from '../../../components/EventInfoCell';
import NiErrorCell from '../../../components/ErrorCell';
import NiSwitch from '../../../components/Switch';
import Events from '../../../api/Events';

interface BarCodeType {
  type: string,
  data: string,
}

interface QRCodeScannerProps {
  route: {
    params: {
      event: { _id: string, customer: { _id: string, identity: { title: string, lastname: string } } },
      timeStampStart: boolean,
      startDateTimeStamp: boolean,
    },
  },
}

interface StateType {
  errorMessage: string,
  scanned: boolean,
  loading: boolean,
}
interface ActionType {
  type: string,
  payload?: string,
}

const SCANNING = 'scanning';
const WRONG_QR_CODE = 'wrong_qr_code';
const BAD_REQUEST = 'bad_request';

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case SCANNING:
      return { loading: true, scanned: true, errorMessage: '' };
    case WRONG_QR_CODE:
      return {
        loading: false,
        scanned: false,
        errorMessage: 'Le QR code scanné ne correspond pas au bénéficiaire de l\'intervention',
      };
    case BAD_REQUEST:
      return { loading: false, scanned: true, errorMessage: action.payload || '' };
    default:
      return state;
  }
};

const closerValue = (array: number[], value: number) => {
  let tempCloserValue = array[0];
  for (let i = 1; i < array.length; i += 1) {
    if (Math.abs(array[i] - value) < (Math.abs(tempCloserValue - value))) tempCloserValue = array[i];
  }
  return tempCloserValue;
};

const QRCodeScanner = ({ route }: QRCodeScannerProps) => {
  const [state, dispatch] = useReducer(reducer, { errorMessage: '', scanned: false, loading: false });
  const camera = useRef<Camera | null>(null);
  const [ratio, setRatio] = useState<string | undefined>();
  const [timeStampStart, setTimeStampStart] = useState<boolean>(route.params.timeStampStart);
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => { setTimeStampStart(route.params.timeStampStart); }, [route.params.timeStampStart, isFocused]);

  const handleBarCodeScanned = async ({ data }: BarCodeType) => {
    try {
      dispatch({ type: SCANNING });

      if (data !== route.params.event.customer._id) {
        dispatch({ type: WRONG_QR_CODE });
        return;
      }

      await Events.timeStampEvent(
        route.params?.event?._id,
        {
          action: QR_CODE_TIME_STAMPING,
          ...(timeStampStart && { startDate: CompaniDate().toISO() }),
          ...(!timeStampStart && { endDate: CompaniDate().toISO() }),
        }
      );

      goBack();
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response && [409, 422].includes(e.response.status)) {
          dispatch({ type: BAD_REQUEST, payload: e.response.data.message });
        } else if (e.response && [404, 403].includes(e.response.status)) {
          dispatch({ type: BAD_REQUEST, payload: 'Vous ne pouvez pas horodater cet évènement.' });
        } else {
          dispatch({ type: BAD_REQUEST, payload: 'Erreur, si le problème persiste, contactez le support technique.' });
        }
      }
    }
  };

  const goBack = () => navigation.navigate('Home', { screen: 'Agenda' });

  const goToManualTimeStamping = () => {
    navigation.navigate('ManualTimeStamping', { ...route.params, timeStampStart });
  };

  const setScreenDimension = async () => {
    if (isIOS || !camera.current) return;

    const { height, width } = Dimensions.get('window');
    if (!width) return;
    const screenRatio = height / width;
    const supportedratios = await camera.current.getSupportedRatiosAsync();
    const ratiosNumbers = supportedratios.map((supportedratio) => {
      const values = supportedratio.split(':');
      if (!values[1]) return 0;
      return Number(values[0]) / Number(values[1]);
    });

    const index = ratiosNumbers.indexOf(closerValue(ratiosNumbers, screenRatio));
    setRatio(supportedratios[index]);
  };

  const toggleSwitch = () => {
    if (route.params.startDateTimeStamp) setTimeStampStart(false);
    else setTimeStampStart(previousValue => !previousValue);
  };

  const displayEventInfos = () => (
    <>
      <View>
        <FeatherButton name='x-circle' onPress={goBack} size={ICON.LG} color={WHITE} />
        <EventInfoCell identity={route.params.event.customer.identity} style={styles.cell} />
        <NiSwitch options={TIME_STAMP_SWITCH_OPTIONS} onChange={toggleSwitch} unselectedTextColor={WHITE}
          value={timeStampStart} backgroundColor={TRANSPARENT_COPPER} disabled={state.loading} />
        <View style={styles.limitsContainer}>
          <Image source={{ uri: 'https://storage.googleapis.com/compani-main/qr-code-limiter.png' }}
            style={styles.limits} />
          {!!state.errorMessage && <NiErrorCell style={styles.error} message={state.errorMessage} />}
        </View>
      </View>
      <View>
        {state.loading
          ? <ActivityIndicator color={WHITE} size="small" />
          : <TouchableOpacity onPress={goToManualTimeStamping} hitSlop={hitSlop}>
            <Text style={styles.manualTimeStampingButton}>Je ne peux pas scanner le QR code</Text>
          </TouchableOpacity>}
      </View>
    </>
  );

  return (
    <>
      {isFocused &&
        <Camera onBarCodeScanned={ state.scanned || state.loading ? undefined : handleBarCodeScanned}
          style={styles.container} barCodeScannerSettings={{ barCodeTypes: ['org.iso.QRCode'] }} ratio={ratio}
          ref={camera} onCameraReady={setScreenDimension}>
          {displayEventInfos()}
        </Camera>}
      {!isFocused && <View style={styles.container}>{displayEventInfos()}</View>}
    </>
  );
};

export default QRCodeScanner;
