import { CSSProperties, FC, ReactNode, forwardRef } from "react";
import useStore from "./utils/useStore";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./index.scss";
import { createPortal } from "react-dom";
import { useTimer } from "./utils/useTimer";

export type Position = "top" | "bottom";

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode | string;
  duration?: number;
  onClose?: (...args: any) => void;
  id?: number;
  position?: Position;
}

const MessageItem: FC<MessageProps> = (item) => {
  const { id, content, onClose } = item;
  const { onMouseEnter, onMouseLeave } = useTimer({
    id,
    duration: 2000,
    remove: onClose,
  });
  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </div>
  );
};

export interface MessageRef {
  add: (messageProps: MessageProps) => number;
  remove: (id: number) => void;
  update: (id: number, messageProps: MessageProps) => void;
  clearAll: () => void;
}

export const MessageProvider = forwardRef<MessageRef, {}>((_, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore("top");

  // let timer: any;
  // useEffect(() => {
  //   timer = setInterval(() => {
  //     add({
  //       content: Math.random().toString().slice(2, 8),
  //     });
  //   }, 2000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  if ("current" in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }

  // useImperativeHandle 并不是立刻修改 ref，而是会在之后的某个时间来修改
  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return {
  //       add,
  //       update,
  //       remove,
  //       clearAll,
  //     };
  //   },
  //   []
  // );

  const positions = Object.keys(messageList) as Position[];

  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup
            className={`message-wrapper-${direction}`}
            key={direction}
          >
            {messageList[direction].map((item) => {
              return (
                <CSSTransition
                  key={item.id}
                  timeout={1000}
                  classNames="message"
                >
                  <MessageItem onClose={remove} {...item} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        );
      })}
    </div>
  );

  return createPortal(messageWrapper, document.body);
});
