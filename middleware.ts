
import { api } from "@/trpc/server";
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const user = await api.user.getAuthedUserWithInstitution.query();

    if (user?.role !== 'STUDENT') {
        const url = req.nextUrl.clone();
        url.pathname = '/dash';
        return NextResponse.redirect(url);
    }

    // Пропустить запрос к следующему middleware или странице
    return NextResponse.next();
}

export const config = {
    matcher: ["/dash/users", "/dash/institutions"] }