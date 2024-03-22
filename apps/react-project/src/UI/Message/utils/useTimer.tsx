import { useEffect, useRef } from "react";

export interface UserTimerProps {
  id?: number;
  duration?: number;
  remove?: (id: number) => void;
}

export const useTimer = (props: UserTimerProps) => {
  const { id, duration, remove } = props;

  let timer = useRef<any>(null);
  const removeTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const startTimer = () => {
    timer.current = setTimeout(() => {
      if (remove) {
        remove(id!);
      }
      removeTimer();
    }, duration);
  };

  useEffect(() => {
    startTimer();
    return () => removeTimer();
  }, []);

  const onMouseEnter = () => {
    console.log("enter");
    removeTimer();
  };

  const onMouseLeave = () => {
    console.log("leave");
    startTimer();
  };
  return {
    onMouseEnter,
    onMouseLeave,
  };
};
