import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    const authCookie = request.cookies.get('pb_auth');

    if (!authCookie) {
      return NextResponse.redirect(new URL('/?error=auth_required', request.url));
    }

    try {
      const { token, model } = JSON.parse(authCookie.value);
      pb.authStore.save(token, model);

      if (!pb.authStore.isValid) {
        throw new Error('Invalid token');
      }

      // Refresh the token
      await pb.collection('users').authRefresh();
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.redirect(new URL('/?error=auth_required', request.url));
    }
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
