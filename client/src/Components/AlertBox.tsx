import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { killAlertByID, removeAlertByID } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { ZIndices } from '../types';

interface Props {}

const AlertRegistry: string[] = [];

const AlertBox = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.app.alerts);

  const alertLifetimeMS = 10000;
  const alertTransitionTimeMS = 250;

  for (const alert of alerts) {
    if (!AlertRegistry.includes(alert.id)) {
      AlertRegistry.push(alert.id);
      setTimeout(() => {
        dispatch(killAlertByID(alert.id));
        setTimeout(() => {
          dispatch(removeAlertByID(alert.id));
        }, alertTransitionTimeMS);
      }, alertLifetimeMS);
    }
  }

  const closeAlert = (id: string) => {
    dispatch(killAlertByID(id));
    setTimeout(() => {
      dispatch(removeAlertByID(id));
    }, alertTransitionTimeMS);
  };

  return (
    <div className="alert-wrapper" style={{ zIndex: `${ZIndices.Alerts}` }}>
      <div className="alert-relative">
        {alerts.map((alert, i) => {
          return (
            <div
              key={alert.id}
              className={`alert ${alert.alive ? 'slide-up' : 'slide-down'}`}
              style={
                {
                  '--alert-transition-time': `${alertTransitionTimeMS}ms`,
                  '--alert-primary': `${alert.severity}`,
                } as React.CSSProperties
              }
            >
              <div className="alert-content" dangerouslySetInnerHTML={{ __html: alert.content }}></div>
              <div className="alert-control">
                <div className="alert-close-button" onClick={() => closeAlert(alert.id)}>
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertBox;
