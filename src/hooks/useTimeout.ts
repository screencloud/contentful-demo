import { useEffect, useRef } from "react";

const useTimeout = (
  callback: () => void,
  duration = 0,
  started = true
): void => {
  const timerRef = useRef<undefined | NodeJS.Timeout>(undefined);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    // hold current instance of callback function: https://overreacted.io/making-setinterval-declarative-with-react-hooks/#refs-to-the-rescue
    callbackRef.current = callback;
  });

  const tick = (): void => {
    // clear timeout before calling callback so when callback triggers parent component render it will create a new timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    callbackRef.current();
  };

  useEffect(() => {
    // set timeout if started = true and no other timeout is running (1 setTimeout per hook)
    if (!timerRef.current && started) {
      timerRef.current = setTimeout(tick, duration);
    }
  }); // run on each render/update

  useEffect(() => {
    return () => {
      // clean up timeout if parent component is unmounted
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
};

export default useTimeout;
