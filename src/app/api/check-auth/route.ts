import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';

export async function GET() {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  const authCookie = cookies().get('pb_auth');

  if (!authCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { token, model } = JSON.parse(authCookie.value);

    // Load the auth store with the token
    pb.authStore.save(token, model);

    // Validate the token
    if (!pb.authStore.isValid) {
      throw new Error('Invalid token');
    }

    // Refresh the token
    const authData = await pb.collection('users').authRefresh();

    // Update the cookie with the new token
    cookies().set('pb_auth', JSON.stringify({
      token: authData.token,
      model: authData.record
    }), {
      secure: true,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Authentication error:', error);
    // Clear the invalid cookie
    cookies().delete('pb_auth');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
