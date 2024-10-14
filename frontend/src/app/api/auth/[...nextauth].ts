import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User } from 'next-auth';

interface CustomUser extends User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'driver' | 'admin';
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const { username, password, role } = credentials;

        // Here, you should implement your actual authentication logic
        // This might involve querying your database or making an API call
        // For demonstration, we'll use a simple check
        if (username === 'demo' && password === 'password') {
          const user: CustomUser = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            role: role as 'user' | 'driver'
          };
          return user;
        }

        // If authentication fails
        return null;
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        (session.user as CustomUser).role = token.role as 'user' | 'driver';
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/signup'
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);