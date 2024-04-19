import { useEffect, useState } from "react";
import "../styles/tailwind.css";

let speechSynthesisWorks: SpeechSynthesisUtterance;
function readText(text: string) {
  if (!text) return;
  if (!speechSynthesisWorks) {
    speechSynthesisWorks = new SpeechSynthesisUtterance(text);
  }
  window.speechSynthesis.speak(speechSynthesisWorks);
}
function stopRead() {
  window.speechSynthesis.cancel();
}
function pauseRead() {
  window.speechSynthesis.pause();
}
function resumeRead() {
  window.speechSynthesis.resume();
}

function SelectContent({ text }: { text: string }) {
  return <div className="rounded p-2 my-2 text-blue-500">{text}</div>;
}

export default function Content() {
  const [selectContexts, setSelectContexts] = useState<string[]>([]);
  useEffect(() => {
    if ("speechSynthesis" in window) {
      document.addEventListener("click", (e: any) => {
        const context = e.target.innerText || "";
        if (context) {
          const list = [...selectContexts, context];
          setSelectContexts(list);
          pauseRead();
          stopRead();
        }
      });

      return () => {
        document.removeEventListener("click", () => {});
      };
    } else {
      alert("暂不支持语音播报~");
    }
  });

  const [isRead, setIsRead] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const playAll = async (e: any) => {
    e.stopPropagation();
    if (isPause) {
      resumeRead();
      return;
    }
    setIsRead(true);
    const allText = selectContexts.join(" ");
    console.log(allText);
    readText(allText);
  };
  const handlePauseRead = (e: any) => {
    e.stopPropagation();
    pauseRead();
    setIsPause(true);
  };
  const handleStopRead = (e: any) => {
    e.stopPropagation();
    stopRead();
    setSelectContexts([]);
    setIsPause(false);
    setIsRead(false);
  };

  const handleRemoveText = (e: any, index: number) => {
    e.stopPropagation();
    const list = [...selectContexts];
    list.splice(index, 1);
    setSelectContexts(list);
  };

  return (
    <>
      <div className="fixed right-0 top-0 text-white p-6 m-4 z-[9999] bg-blue-400 rounded max-w-96 max-h-[600px] overflow-auto">
        <h1 className="text-xl">I'm content</h1>
        <div className="my-2">
          {selectContexts.length ? (
            <div>
              <button onClick={playAll}>播放</button>
              {isRead ? (
                <>
                  <button onClick={handlePauseRead}>暂停</button>
                  <button onClick={handleStopRead}>停止并清除</button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        {selectContexts.map((text, index) => {
          return (
            <div className="bg-gray-100 flex items-start justify-between border-b border-gray-200 border-solid">
              <SelectContent key={index} text={text} />
              <span
                className="px-2 py-1 bg-red-400 hover:bg-red-500 text-white rounded-full cursor-pointer"
                onClick={(e: any) => handleRemoveText(e, index)}
              >
                X
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
