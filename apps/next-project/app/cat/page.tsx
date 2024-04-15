// 关掉数据缓存
// 强制 fetch 不缓存
export const fetchCache = "force-no-store";

async function getData() {
  const { signal } = new AbortController(); // 关闭请求记忆
  const res = await fetch("https://api.thecatapi.com/v1/images/search", {
    signal,
  });
  return res.json();
}

export async function generateMetadata() {
  const data = await getData();
  return {
    title: data[0].id,
  };
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <h1>图片 ID：{data[0].id}</h1>
      <img src={data[0].url} width="300" />
      <CatDetail />
    </>
  );
}

async function CatDetail() {
  const data = await getData();
  return (
    <>
      <h1>图片 ID：{data[0].id}</h1>
      <img src={data[0].url} width="300" />
    </>
  );
}
