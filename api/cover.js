import { readFile } from 'fs/promises';
import { extname, join } from 'path';

// Array with the paths of the 5 local images
const LOCAL_BACKGROUNDS = [
  '/1.webp',
  '/2.webp',
  '/3.webp',
  '/4.webp',
  '/5.webp'
];

const quotes = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    keywords: ["future", "creation"]
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    keywords: ["life", "planning"]
  },
];

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;

// Function to fetch image directly from public URL instead of file system
async function fetchImageAsDataUri(imagePath) {
  try {
    // For Vercel deployment, we need to use the full URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const imageUrl = `${baseUrl}${imagePath}`;
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine content-type from file extension
    const ext = extname(imagePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';
    
    const base64Image = buffer.toString('base64');
    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to Data URI:', error.message);
    // Transparent 1x1 pixel placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}

export async function GET(request) {
  try {
    // Safely calculate the quote index
    const dayOfMonth = new Date().getDate();
    // Ensure the index is within valid bounds
    const safeQuotesLength = quotes.length || 1; // Prevent division by zero
    const quoteIndex = ((dayOfMonth - 1) % safeQuotesLength + safeQuotesLength) % safeQuotesLength;
    
    // Use default values to prevent destructuring errors
    const { 
      text = "Daily inspiration awaits you.", 
      author = "Daily Spark", 
      keywords = [] 
    } = quotes[quoteIndex] || {};
    
    const plannerTitle = "Daily Spark";

    // Select the image of the day
    const imageIndex = (dayOfMonth - 1) % LOCAL_BACKGROUNDS.length;
    const localImagePath = LOCAL_BACKGROUNDS[imageIndex];

    // Convert the local image to Data URI by fetching it from the public URL
    const imageDataUri = await fetchImageAsDataUri(localImagePath);

    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

    const [width, height] = isMobile 
      ? [1170, 445] 
      : [NOTION_COVER_WIDTH, NOTION_COVER_HEIGHT];

    const titleFontSize = isMobile ? 22 : 36;
    const baseFontSize = isMobile ? 20 : 32;
    const authorFontSize = isMobile ? 16 : 24;
    const lineHeight = isMobile ? 1.25 : 1.35;
    const maxTextWidth = width * 0.85;

    const finalSvg = `
      <svg 
        width="${width}" 
        height="${height}"
        viewBox="0 0 ${width} ${height}"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <image 
          xlink:href="${imageDataUri}" 
          width="100%" 
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />

        <rect 
          width="100%" 
          height="100%" 
          fill="rgba(0,0,0,0.45)"
        />

        <g transform="translate(${width/2}, ${height/2})">
          <foreignObject 
            width="${maxTextWidth}" 
            height="${height * 0.7}"
            x="-${maxTextWidth/2}" 
            y="-${height * 0.35}"
          >
            <div xmlns="http://www.w3.org/1999/xhtml"
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-family: 'Arial', sans-serif;
                color: white;
                text-align: center;
              ">
              <div style="
                font-size: ${titleFontSize}px;
                font-weight: bold;
                margin-bottom: 15px; 
                text-shadow: 0 1px 3px rgba(0,0,0,0.6);
              ">${plannerTitle}</div>
              <div style="
                font-size: ${baseFontSize}px;
                font-style: italic;
                line-height: ${lineHeight};
                margin-bottom: 10px;
                text-shadow: 0 1px 3px rgba(0,0,0,0.6);
              ">"${text}"</div>
              <div style="
                font-size: ${authorFontSize}px;
                font-style: normal;
                opacity: 0.9;
                text-shadow: 0 1px 3px rgba(0,0,0,0.6);
              ">- ${author}</div>
            </div>
          </foreignObject>
        </g>
      </svg>
    `;

    return new Response(finalSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${60*60*6}`,
      },
      status: 200
    });

  } catch (error) {
    console.error('Error generating cover:', error);
    const errorSvg = `
      <svg width="1500" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="lightgrey"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="black">
          Error generating cover image.
        </text>
      </svg>
    `;
    return new Response(errorSvg, { 
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 500 
    });
  }
}
