import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import Version from '../src/api/version';
import { ACTIVE_STATE } from '../src/data/constants';
import UpdateAppModal from '../src/components/modals/UpdateAppModal';

const App = () => {
  const [updateAppVisible, setUpdateAppVisible] = useState(false);

  const shouldUpdate = async (nextState: string) => {
    try {
      if (nextState === ACTIVE_STATE) {
        const { mustUpdate } = await Version.shouldUpdate();
        setUpdateAppVisible(mustUpdate);
      }
    } catch (e) {
      setUpdateAppVisible(false);
      console.error(e);
    }
  };

  useEffect(() => {
    shouldUpdate(ACTIVE_STATE);
    AppState.addEventListener('change', shouldUpdate);

    return () => { AppState.removeEventListener('change', shouldUpdate); };
  }, []); // TODO: Pourquoi est-ce que eslint ne casse pas ?

  return (
    <UpdateAppModal visible={updateAppVisible} />
  );
};

export default App;
