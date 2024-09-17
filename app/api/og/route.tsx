import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get('title');
    const imageUrl = searchParams.get('image');

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '48px',
                    width: '100%',
                    height: '100%',
                    alignItems: 'start',
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="40"
                        height="40"
                    >
                        <path d="M4 11a9 9 0 0 1 9 9" />
                        <path d="M4 4a16 16 0 0 1 16 16" />
                        <circle cx="5" cy="19" r="1" />
                    </svg>
                    <h1 style={{ marginLeft: '8px', fontSize: '2rem', fontWeight: 'bold' }}>
                        Platven
                    </h1>
                </div>
                <div style={{ flex: 1, padding: '40px 0' }}>
                    <div style={{ fontSize: '50px', fontWeight: 'bold' }}>{title}</div>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.25rem' }}>{siteConfig.url}</div>
                </div>

                {imageUrl && (
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '200px', height: '200px' }}>
                        <img src={imageUrl} alt="Property Image" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
