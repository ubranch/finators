'use server';

import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const pb = new PocketBase(process.env.POCKETBASE_URL);

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { token, record: model } = await pb
      .collection('users')
      .authWithPassword(email, password);

    const cookie = JSON.stringify({ token, model });

    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    redirect('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }
}

export async function logout() {
  cookies().delete('pb_auth');
  redirect('/?message=logged_out');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const username = formData.get('username') as string;

  if (password !== passwordConfirm) {
    redirect('/?error=passwords_do_not_match');
  }

  try {
    await pb.collection('users').create({
      email,
      username,
      password,
      passwordConfirm,
    });

    const { token, record: model } = await pb
      .collection('users')
      .authWithPassword(email, password);

    const cookie = JSON.stringify({ token, model });

    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    redirect('/dashboard?message=registered');
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed');
  }
}
