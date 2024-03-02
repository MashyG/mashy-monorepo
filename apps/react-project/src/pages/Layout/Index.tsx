import { Link, Outlet } from "react-router-dom";

function Index() {
  return (
    <>
      <div>Layout Page</div>
      <Link to="/layout">左边</Link> | <Link to="/layout/right">右边</Link>
      {/* 配置二级路由 */}
      <Outlet />
    </>
  );
}

export default Index;
