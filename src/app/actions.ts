'use server';

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const pb = new PocketBase(process.env.POCKETBASE_URL);

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { token, record: model } = await pb.collection('users').authWithPassword(email, password);

    const cookie = JSON.stringify({ token, model });

    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Login failed:', error);
    let errorMessage = 'Login failed';

    if (error.response?.data) {
      const { identity, password } = error.response.data;
      if (identity && identity.message) {
        errorMessage = `Email: ${identity.message}`;
      } else if (password && password.message) {
        errorMessage = `Password: ${password.message}`;
      }
    }

    return { success: false, error: errorMessage };
  }
}

export async function logout() {
  cookies().delete('pb_auth');
  return { success: true, message: 'logged_out' };
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const username = formData.get('username') as string;

  try {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      username,
    });

    // After successful registration, log the user in
    const { token, record: model } = await pb.collection('users').authWithPassword(email, password);

    const cookie = JSON.stringify({ token, model });

    cookies().set('pb_auth', cookie, {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Registration failed:', error);
    let errorMessage = 'Registration failed';

    if (error.response?.data) {
      const { email, username } = error.response.data;
      if (email && email.message) {
        errorMessage = `Email: ${email.message}`;
      } else if (username && username.message) {
        errorMessage = `Username: ${username.message}`;
      }
    }

    return { success: false, error: errorMessage };
  }
}
