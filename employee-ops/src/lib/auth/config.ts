// src/lib/auth/config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface StrapiUser {
  id: number;
  email: string;
  username: string;
  role?: {
    id: number;
    name: string;
    description: string;
  };
  department?: string;
  firstName?: string;
  lastName?: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "strapi-credentials",
      name: "EPG Employee Login",
      credentials: {
        identifier: {
          label: "Email",
          type: "email",
          placeholder: "your.email@epg.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Authenticate with Strapi
          const response = await fetch(
            `${process.env.STRAPI_URL}/api/auth/local`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

          const data: StrapiAuthResponse = await response.json();

          if (!response.ok) {
            console.error("Strapi auth error:", data);
            throw new Error(data?.error?.message || "Authentication failed");
          }

          // Return user object for NextAuth session
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name:
              data.user.firstName && data.user.lastName
                ? `${data.user.firstName} ${data.user.lastName}`
                : data.user.username,
            role: data.user.role?.name || "employee",
            department: data.user.department,
            strapiToken: data.jwt,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store Strapi JWT and user data in NextAuth token
      if (user) {
        token.strapiToken = user.strapiToken;
        token.role = user.role;
        token.department = user.department;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass Strapi data to client session
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
        session.strapiToken = token.strapiToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

// Types for NextAuth session extension
declare module "next-auth" {
  interface User {
    role?: string;
    department?: string;
    strapiToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      department: string;
    };
    strapiToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiToken?: string;
    role?: string;
    department?: string;
    userId?: string;
  }
}
