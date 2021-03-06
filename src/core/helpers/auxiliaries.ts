import pick from 'lodash.pick';
import { UserType, FormattedUserType } from '../../types/UserType';
import { formatIdentity } from './utils';

export const formatAuxiliary = (auxiliary: UserType): FormattedUserType => ({
  _id: auxiliary._id,
  ...pick(auxiliary, ['picture', 'contracts', 'identity', 'local', 'contact']),
  formattedIdentity: formatIdentity(auxiliary.identity, 'FL'),
  administrative: { transportInvoice: { transportType: auxiliary.administrative?.transportInvoice?.transportType } },
});
