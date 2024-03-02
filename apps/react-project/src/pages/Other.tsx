import { Link, useNavigate } from "react-router-dom";

function Other() {
  const navigate = useNavigate();
  return (
    <>
      <div>other page</div>
      {/* 声明式 */}
      <Link to="/">首页</Link>
      {/* 命令式 */}
      <button onClick={() => navigate("/")}>返回首页</button>
      <div>================ 传递参数方式不同 ===============</div>

      <button onClick={() => navigate("/params?id=mashy")}>
        to params page
      </button>
      <button onClick={() => navigate("/params/09/mashy")}>
        to params page{" "}
      </button>
    </>
  );
}

export default Other;
