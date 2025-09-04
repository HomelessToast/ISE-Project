import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({ data: { email: normalizedEmail, name, passwordHash } });
    return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
  } catch (e) {
    console.error('Register error', e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
}


