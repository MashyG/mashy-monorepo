import { Link, useNavigate } from "react-router-dom";
import { myBroadcastChannel } from "../plugins/broadcastChannel";

const handleSendMsg = () => {
  console.log("other page - sendMsg");
  myBroadcastChannel.send("other - sendMsg");
};
myBroadcastChannel.onmessage((event: any) => {
  console.log("other page receive message", event);
});

function Other() {
  const navigate = useNavigate();
  return (
    <>
      <div>other page</div>
      <button onClick={() => handleSendMsg()}>sendMsg</button>
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
