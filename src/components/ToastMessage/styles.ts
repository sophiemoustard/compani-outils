import { StyleSheet, Platform } from 'react-native';
import { WHITE } from '../../styles/colors';
import { FIRA_SANS_MEDIUM } from '../../styles/fonts';
import { BORDER_RADIUS, MARGIN, PADDING, SCREEN_HEIGHT } from '../../styles/metrics';

type ToastMessageStyleProps = {
  backgroundColor: string,
};

const TOAST_MESSAGE_HEIGHT = 56;
const iosOffset = Platform.OS === 'ios' ? 20 : 0;
const TOAST_OFFSET = TOAST_MESSAGE_HEIGHT + MARGIN.MD + iosOffset;
const TOAST_POSITION = SCREEN_HEIGHT - TOAST_OFFSET;

const styles = ({ backgroundColor } : ToastMessageStyleProps) => StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    paddingHorizontal: MARGIN.MD,
    top: TOAST_POSITION,
  },
  content: {
    backgroundColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MD,
    height: TOAST_MESSAGE_HEIGHT,
  },
  text: {
    ...FIRA_SANS_MEDIUM.SM,
    color: WHITE,
    paddingLeft: PADDING.LG,
  },
});

export default styles;
export { TOAST_OFFSET };
