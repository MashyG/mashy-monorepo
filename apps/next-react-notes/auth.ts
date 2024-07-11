import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "./lib/prisma";

/**
 *
 * GET    /api/auth/signin
 * POST   /api/auth/signin/:provider
 * GET    /POST/api/auth/callback/:provider
 * GET    /api/auth/signout
 * POST   /api/auth/signout
 * GET    /api/auth/session
 * GET    /api/auth/csrf
 * GET    /api/auth/providers
 */

class CustomError extends CredentialsSignin {
  code = "custom_error";
  constructor(message: string) {
    super();
    this.code = message;
  }
}

/**
 * ② 不使用中间件时：
 * 如果是服务端组件，通过对 auth()返回的 session 进行判断，根据 session.user 是否存在来区分登录和未登录状态
 * 如果是客户端组件，可以通过 useSession() 返回的 status 来判断
 * */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // 显示按钮文案 (e.g. "Sign in with...")
      name: "密码登录",
      // `credentials` 用于渲染登录页面表单
      credentials: {
        username: { label: "账号", type: "text", placeholder: "输入您的账号" },
        password: {
          label: "密码",
          type: "password",
          placeholder: "输入您的密码",
        },
      },
      // 处理从用户收到的认证信息
      async authorize(
        credentials: any
        // 默认情况下，此参数是 undefined，除非在配置中传递了 `session` 配置。
        // 如果传递了 `session` 配置，则此参数将包含 `session` 配置中传递的参数。
        // req
      ) {
        // 默认情况下不对用户输入进行验证，确保使用 Zod 这样的库进行验证
        let user: any;
        // 登陆信息验证
        user = await getUser(
          credentials?.username ?? "",
          credentials?.password ?? ""
        );
        // 密码错误
        if (user === 1) {
          throw new CustomError("密码错误");
        }
        // 用户注册
        if (user === 0) {
          user = await addUser(
            credentials?.username ?? "",
            credentials?.password ?? ""
          );
        }
        if (!user) {
          throw new CustomError("User was not found and could not be created.");
        }
        return user;
      },
    }),
    GitHub,
  ],
  // pages: {
  //   signIn: "/auth/signin",
  // },
  callbacks: {
    // // ① 与中间件配合使用，判断是否登录
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl;
    //   if (pathname.startsWith("/note/edit")) return !!auth;
    //   return true;
    // },
    async jwt({ token, user, account }: any) {
      if (account && account.type === "credentials" && user) {
        token.userId = user?.userId ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});
