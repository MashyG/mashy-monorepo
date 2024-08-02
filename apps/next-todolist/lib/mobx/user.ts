class UserStore {
  info = {};
  token = "";
  getUserInfo() {
    return this.info;
  }
  setUserInfo(info: any) {
    this.info = info;
  }

  getToken() {
    return this.token;
  }
  setToken(token: string) {
    this.token = token;
    sessionStorage.setItem("token", token);
  }
}

// 创建实例并自动使其可观察
const userStore = new UserStore();
export default userStore;
