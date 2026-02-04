import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch favicon URL from settings API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://hylacviet.vn'}/api/settings`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            // Look for favicon_url key (matching admin setting key)
            const faviconSetting = data.data.find((item: { key: string }) => item.key === 'favicon_url');
            if (faviconSetting?.value) {
                // Redirect to the actual favicon URL
                return NextResponse.redirect(faviconSetting.value);
            }
        }
    } catch (e) {
        console.error('Failed to fetch favicon:', e);
    }

    // Fallback to default favicon
    return NextResponse.redirect(new URL('/favicon.svg', process.env.NEXT_PUBLIC_SITE_URL || 'https://hylacviet.vn'));
}
