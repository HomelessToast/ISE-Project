import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs';

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }
        const normalizedEmail = String(credentials.email).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
          },
        });
        if (!user || !user.passwordHash) {
          // Avoid leaking whether the email exists
          throw new Error('Incorrect email or password');
        }

        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) {
          throw new Error('Incorrect email or password');
        }

        return { id: user.id, name: user.name ?? user.email, email: user.email } as any;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };


