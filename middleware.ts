import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 1000; // 1 second cooldown

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/check-auth')) {
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    const authCookie = request.cookies.get('pb_auth');

    if (!authCookie) {
      if (request.nextUrl.pathname.startsWith('/api/check-auth')) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
      return handleRedirect(request);
    }

    try {
      const { token, model } = JSON.parse(authCookie.value);
      pb.authStore.save(token, model);

      if (!pb.authStore.isValid) {
        throw new Error('Invalid token');
      }

      const authData = await pb.collection('users').authRefresh();
      const response = NextResponse.next();
      response.cookies.set('pb_auth', JSON.stringify({
        token: authData.token,
        model: authData.record
      }), {
        secure: true,
        path: '/',
        sameSite: 'strict',
        httpOnly: true,
      });

      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      if (request.nextUrl.pathname.startsWith('/api/check-auth')) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
      return handleRedirect(request);
    }
  }
}

function handleRedirect(request: NextRequest) {
  const currentTime = Date.now();
  if (currentTime - lastRedirectTime < REDIRECT_COOLDOWN) {
    return NextResponse.next();
  }
  lastRedirectTime = currentTime;
  return NextResponse.redirect(new URL('/?error=auth_required', request.url));
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/check-auth'],
};
