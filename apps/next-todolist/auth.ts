import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextRequest } from "next/server";
import { login } from "./lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // 处理从用户收到的认证信息
      async authorize(credentials: any): Promise<any> {
        // 默认情况下不对用户输入进行验证，确保使用 Zod 这样的库进行验证
        let user = null;
        const { username, password } = credentials || {};

        // 登陆信息验证
        try {
          user = await login({ username, password });
        } catch (err) {
          return err;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth }: { request: NextRequest; auth: any }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/auth")) return !!auth;
      return true;
    },
  },
});
