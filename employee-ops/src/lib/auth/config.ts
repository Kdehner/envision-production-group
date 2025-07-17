// employee-ops/src/lib/auth/config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          // Use internal Strapi URL for API authentication
          const strapiUrl =
            process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

          // Authenticate with Strapi
          const response = await fetch(`${strapiUrl}/api/auth/local`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.jwt) {
            throw new Error(data.error?.message || "Authentication failed");
          }

          // Return user object with Strapi token
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.username || data.user.email,
            strapiToken: data.jwt,
            strapiUser: data.user,
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Store Strapi token in JWT
      if (user) {
        token.strapiToken = (user as any).strapiToken;
        token.strapiUser = (user as any).strapiUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Send Strapi token to the client
      (session as any).strapiToken = token.strapiToken;
      (session as any).strapiUser = token.strapiUser;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // ✅ Fixed: Use correct signin page path
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
