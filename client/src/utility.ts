import { v4 as uuid } from 'uuid';
import { Alert, AlertSeverity } from './types';

export const createAlert = (content: string, severity?: AlertSeverity): Alert => {
  const alert: Alert = {
    id: uuid(),
    content: content,
    severity: severity ? severity : AlertSeverity.info,
    alive: true,
  };
  return alert;
};
