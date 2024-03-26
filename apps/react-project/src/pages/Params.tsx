import { useSearchParams, useParams } from "react-router-dom";
function Params() {
  const [searchParams] = useSearchParams();
  const searchParamsId = searchParams.get("id");

  const params = useParams();
  const paramsId = params.id;
  const paramsName = params.name;

  return (
    <>
      <div>Params page</div>
      <div>useSearchParams -- 获取到的参数 id：{searchParamsId}</div>
      <div>
        useSearchParams -- 获取到的参数 id：{paramsId}；name：{paramsName}
      </div>
    </>
  );
}

export default Params;
