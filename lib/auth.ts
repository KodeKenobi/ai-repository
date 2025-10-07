import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "@/lib/supabase";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabaseAdmin = getSupabaseAdmin();

          // Use Supabase Auth to sign in the user
          const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          if (authError || !authData.user) {
            return null;
          }

          // Get user metadata
          const { first_name, last_name, company_name } =
            authData.user.user_metadata || {};

          return {
            id: authData.user.id,
            email: authData.user.email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || null,
            firstName: first_name,
            lastName: last_name,
            companyName: company_name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.companyName = user.companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.companyName = token.companyName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
