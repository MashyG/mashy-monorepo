"use client";
import { useState } from "react";

type MediaType = "photo" | "curated" | "video" | "popular";
function getUrl(key: MediaType) {
  const apiBase = "https://api.pexels.com";
  enum urlMap {
    photo = `${apiBase}/v1/search`,
    curated = `${apiBase}/v1/curated`,
    video = `${apiBase}/videos/search`,
    popular = `${apiBase}/videos/popular`,
  }
  return urlMap[key] ?? "";
}
const headers = {
  Authorization: "dA9vY2bXsXY2hXR3GjKwpFYzO9v4qGsWcpsLuMAeQTRRpuWMrenS8pet",
};

const fetchMedia = async ({
  media,
  query = "",
  onChange,
}: {
  media: MediaType;
  query?: string;
  onChange: (data: any) => void;
}) => {
  const isSearchModel = ["photo", "video"].includes(media);
  const baseUrl = getUrl(media);
  const url = `${baseUrl}?per_page=1${
    isSearchModel ? `&query=${query ?? ""}` : ""
  }`;
  const res = await fetch(url, {
    headers,
  });
  const data = await res.json();
  const isPhotoType = ["photo", "curated"].includes(media);

  onChange(data[isPhotoType ? "photos" : "videos"]);
};

// 图片模块
function PhotoMediaItem({ media }: { media: any }) {
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
function VideoMediaItem({ media }: { media: any }) {
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

type OptionsType = {
  value: string;
  title: string;
};
type SelectPropsType = {
  id: string;
  options: Array<OptionsType>;
  val: string;
  handleSelect: (e: any) => void;
};
function SelectComp({
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

// 获取图片
function PhotoMedia() {
  const [selectVal, SetSelectVal] = useState<"photo" | "curated">("photo");
  const [photo, setPhoto] = useState("Beautiful scenery");
  const [photos, setPhotos] = useState([]);

  const handlePhotoInput = (e: any) => {
    setPhoto(e.target.value);
  };
  const handleSelect = (e: any) => {
    setPhotos([]);
    SetSelectVal(e.target.value);
  };

  const photoProps: SelectPropsType = {
    id: "photo",
    options: [
      {
        value: "photo",
        title: "搜索模式",
      },
      {
        value: "curated",
        title: "精选图片模式",
      },
    ],
    val: selectVal,
    handleSelect,
  };

  const handleClick = async () => {
    await fetchMedia({ media: selectVal, query: photo, onChange: setPhotos });
  };

  return (
    <>
      <div className="p-2 border-b-2 border-white">
        <p className="text-xl">Photo</p>
        <SelectComp {...photoProps} />
        {selectVal === "photo" && (
          <textarea
            rows={3}
            className="text-black"
            value={photo}
            onChange={handlePhotoInput}
          />
        )}
        <button
          className="mx-4 border-gray-200 border rounded bg-white text-blue-800 p-2 hover:text-blue-500 hover:bg-gray-100"
          onClick={handleClick}
        >
          getPhotoMedia
        </button>
        <div className="flex">
          {photos.map((item: any) => (
            <PhotoMediaItem key={item.id} media={item} />
          ))}
        </div>
      </div>
    </>
  );
}

// 获取视频
function VideoMedia() {
  const [selectVal, SetSelectVal] = useState<MediaType>("video");
  const [video, setVideo] = useState("a pink cat is running");
  const [videos, setVideos] = useState([]);

  const handleSelect = (e: any) => {
    setVideos([]);
    SetSelectVal(e.target.value);
  };
  const handleVideoInput = (e: any) => {
    setVideo(e.target.value);
  };
  const videoProps: SelectPropsType = {
    id: "video",
    options: [
      {
        value: "video",
        title: "搜索模式",
      },
      {
        value: "popular",
        title: "热门视频模式",
      },
    ],
    val: selectVal,
    handleSelect,
  };
  const handleClick = async () => {
    await fetchMedia({ media: selectVal, query: video, onChange: setVideos });
  };

  return (
    <>
      <div className="p-2">
        <p className="text-xl">Video</p>
        <SelectComp {...videoProps} />
        {selectVal === "video" && (
          <textarea
            rows={3}
            className="text-black"
            value={video}
            onChange={handleVideoInput}
          />
        )}
        <button
          className="mx-4 border-gray-200 border rounded bg-white text-blue-800 p-2 hover:text-blue-500 hover:bg-gray-100"
          onClick={handleClick}
        >
          getVideoMedia
        </button>
        <div className="flex">
          {videos.map((item: any) => (
            <VideoMediaItem key={item.id} media={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default function PexelsMedia() {
  return (
    <div className="bg-green-400 mt-4 rounded">
      <PhotoMedia />
      <VideoMedia />
    </div>
  );
}
