import { StyleSheet } from 'react-native';
import { GREEN, GREY, WHITE } from '../../styles/colors';
import { FIRA_SANS_BOLD, FIRA_SANS_MEDIUM, FIRA_SANS_REGULAR, NUNITO_REGULAR } from '../../styles/fonts';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN, PADDING, BUTTON_INTERVENTION_WIDTH } from '../../styles/metrics';

export default StyleSheet.create({
  sectionDelimiter: {
    borderTopWidth: BORDER_WIDTH,
    borderColor: GREY[200],
  },
  cell: {
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    backgroundColor: WHITE,
    marginHorizontal: MARGIN.MD,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING.LG,
  },
  title: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[900],
    marginVertical: MARGIN.SM,
    marginHorizontal: MARGIN.MD,
  },
  timeTitle: {
    ...FIRA_SANS_REGULAR.SM,
    color: GREY[700],
    marginBottom: MARGIN.SM,
  },
  scheduledTime: {
    ...NUNITO_REGULAR.XXL,
    color: GREY[900],
  },
  button: {
    width: BUTTON_INTERVENTION_WIDTH,
  },
  timeStamping: {
    ...FIRA_SANS_MEDIUM.MD,
    color: GREEN[600],
    marginLeft: MARGIN.SM,
  },
  timeStampingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: GREEN[200],
  },
  icon: {
    borderWidth: BORDER_WIDTH,
    borderColor: GREEN[200],
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
