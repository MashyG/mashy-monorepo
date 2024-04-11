export type MediaType = "photo" | "curated" | "video" | "popular";

type OptionsType = {
  value: string;
  title: string;
};
export type SelectPropsType = {
  id: string;
  options: Array<OptionsType>;
  val: string;
  handleSelect: (e: any) => void;
};

export function SelectComp({
  id = "model",
  options,
  val,
  handleSelect,
}: SelectPropsType) {
  return (
    <>
      <label id={id}> 模式 </label>
      <select
        name={id}
        value={val}
        className="text-black mr-4"
        onChange={handleSelect}
      >
        {options.map((item: OptionsType) => {
          return (
            <option key={item.value} value={item.value}>
              {item.title}
            </option>
          );
        })}
      </select>
    </>
  );
}

// 图片模块
export function PhotoMediaItem({ media }: { media: any }) {
  const imgSrc = media.src?.original || "";
  return (
    <div>
      {imgSrc ? (
        <img src={imgSrc} />
      ) : (
        <span className="text-red">no photo</span>
      )}
    </div>
  );
}

// 视频模块
export function VideoMediaItem({ media }: { media: any }) {
  const videoFiles = media?.video_files || "";
  return (
    <div>
      {videoFiles ? (
        <video width="320" height="240" controls>
          {videoFiles.map((item: any) => (
            <source key={item.id} src={item.link} type={item.file_type} />
          ))}
        </video>
      ) : (
        <span>no videoFiles</span>
      )}
    </div>
  );
}
