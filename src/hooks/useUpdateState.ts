import { useState, useCallback } from 'react';

const useUpdateState = <T extends object>(initState: T) => {
  const [state, setState] = useState(initState);

  const updateState = useCallback((payload: T) => {
    setState(prevState => ({
      ...prevState,
      ...payload,
    }));
  }, []);

  const resetState = useCallback(() => setState(initState), []);

  return [state, { setState: updateState, resetState }] as const;
};

export default useUpdateState;
