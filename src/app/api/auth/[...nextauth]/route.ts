import NextAuth, { NextAuthOptions, Account, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

interface BackendAuthResponse {
  status: number;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function authenticateWithBackend(
  provider: 'google' | 'github',
  providerAccessToken: string
): Promise<BackendAuthResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/login/provider`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      token: providerAccessToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Backend auth failed: ${response.status}`);
  }

  return response.json();
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.access_token) {
        return false;
      }
      return true;
    },
    async jwt({ token, account, user }): Promise<JWT> {
      if (account && user) {
        const provider = account.provider as 'google' | 'github';
        
        try {
          const backendAuth = await authenticateWithBackend(
            provider,
            account.access_token!
          );

          token.accessToken = backendAuth.access_token;
          token.refreshToken = backendAuth.refresh_token;
          token.provider = provider;
          token.providerAccountId = account.providerAccountId;
        } catch (error) {
          console.error('Backend authentication failed:', error);
          token.error = 'BackendAuthError';
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.provider = token.provider as string;
      session.error = token.error as string | undefined;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
