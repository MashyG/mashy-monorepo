"use client";

import {
  type MediaType,
  type SelectPropsType,
  SelectComp,
  PhotoMediaItem,
  VideoMediaItem,
} from "./MediaItem";
import { useState } from "react";

// 获取图片
export function PhotoMedia() {
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
    const { data } = await fetch(
      `/api/pexels?per_page=5&media=${selectVal}&query=${photo}`
    ).then((res) => res.json());

    setPhotos(data);
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
export function VideoMedia() {
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
    const { data } = await fetch(
      `/api/pexels?media=${selectVal}&query=${video}`
    ).then((res) => res.json());

    setVideos(data);
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
