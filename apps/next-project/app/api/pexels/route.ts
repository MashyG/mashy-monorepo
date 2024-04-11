import { NextRequest, NextResponse } from "next/server";

type MediaType = "photo" | "curated" | "video" | "popular";

function getUrl(params: {
  key: MediaType;
  isSearchModel: boolean;
  query: string;
  perPage: number;
}) {
  const { key, isSearchModel, query, perPage } = params;
  const apiBase = "https://api.pexels.com";
  enum urlMap {
    photo = `${apiBase}/v1/search`,
    curated = `${apiBase}/v1/curated`,
    video = `${apiBase}/videos/search`,
    popular = `${apiBase}/videos/popular`,
  }
  const baseUrl = urlMap[key] ?? "";
  return `${baseUrl}?per_page=${perPage}${
    isSearchModel ? `&query=${query ?? ""}` : ""
  }`;
}
const headers = {
  Authorization: process.env.PEXEL_KEY ?? "",
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const media = (searchParams.get("media") as MediaType) ?? "";
  const query = searchParams.get("query") ?? "";
  const perPage = Number(searchParams.get("per_page") ?? 1);

  const isSearchModel = ["photo", "video"].includes(media);

  const url = getUrl({ key: media, isSearchModel, query, perPage });
  const res = await fetch(url, {
    headers,
  });
  const data = await res.json();
  const isPhotoType = ["photo", "curated"].includes(media);

  return NextResponse.json({ data: data[isPhotoType ? "photos" : "videos"] });
}
