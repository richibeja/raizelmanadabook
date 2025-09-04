import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Leer el manifest.json desde el directorio public
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    return NextResponse.json(manifest, {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error reading manifest.json:', error);
    
    // Fallback manifest si hay error
    const fallbackManifest = {
      name: "Raízel Manadabook",
      short_name: "Raízel",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#059669",
      description: "Catálogo natural de productos Raízel - PWA optimizada v3.0",
      scope: "/",
      orientation: "portrait-primary",
      categories: ["lifestyle", "shopping", "pets"],
      lang: "es",
      dir: "ltr",
      icons: [
        {
          src: "/icon-32x32.png",
          sizes: "32x32",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        }
      ]
    };

    return NextResponse.json(fallbackManifest, {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}
