import got from 'got';

// Array of 30 motivational quotes
const quotes = [
  "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
  "The secret to getting ahead is getting started. - Mark Twain",
  "I’m not telling you it’s going to be easy. I’m telling you it’s going to be worth it. - Art Williams",
  "If you are not willing to risk the usual, you will have to settle for the ordinary. - Jim Rohn",
  "People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed. - Tony Robbins",
  "All progress takes place outside the comfort zone. - Michael John Bobak",
  "Good things come to people who wait, but better things come to those who go out and get them. - Anonymous",
  "There is no chance, no destiny, no fate that can hinder or control the firm resolve of a determined soul. - Ella Wheeler Wilcox",
  "The first step toward success is taken when you refuse to be a captive of the environment in which you first find yourself. - Mark Caine",
  "There is no traffic jam along the extra mile. - Roger Staubach",
  "Trust because you are willing to accept the risk, not because it’s safe or certain. - Anonymous",
  "Try not to become a person of success, but rather try to become a person of value. - Albert Einstein",
  "If you wait for perfect conditions, you’ll never get anything done. - Ecclesiastes 11:4",
  "Others have seen what is and asked why. I have seen what could be and asked why not. - Pablo Picasso",
  "I have not failed. I’ve just found 10,000 ways that won’t work. - Thomas A. Edison",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Tough times don't last. Tough people do. - Robert H. Schuller",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Pain is temporary. Quitting lasts forever. - Lance Armstrong",
  "Believe you can, and you’re halfway there. - Theodore Roosevelt",
  "It takes courage to grow up and become who you really are. - E.E. Cummings",
  "Nothing is impossible. The word itself says 'I'm possible!' - Audrey Hepburn",
  "Keep your face always toward the sunshine, and shadows will fall behind you. - Walt Whitman",
  "All our dreams can come true, if we have the courage to pursue them. - Walt Disney",
  "Don't sit down and wait for the opportunities to come. Get up and make them. - Madam C.J. Walker",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Never give up on something that you can’t go a day without thinking about. - Winston Churchill",
  "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it. - Henry Ford",
  "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time. - Thomas Edison"
];

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;
const BACKGROUND_SVG_URL = 'https://lib.notion.vip/tools/animated-notion-covers/animated-notion-cover_24.svg';

// This function will be executed by Vercel for requests to /api/cover
export async function GET(request) {
  try {
    // Select a quote based on the day of the month (1-31)
    const dayOfMonth = new Date().getDate();
    // Adjust index to be 0-based and cycle through quotes
    const quoteIndex = (dayOfMonth - 1) % quotes.length;
    const selectedQuote = quotes[quoteIndex];

    // Fetch the background SVG content
    let backgroundSvgContent = '';
    try {
      const response = await got(BACKGROUND_SVG_URL);
      backgroundSvgContent = response.body;
      // Clean the SVG content by removing XML and DOCTYPE declarations
      // This helps prevent issues when embedding it into another SVG
      backgroundSvgContent = backgroundSvgContent
        .replace(/<\?xml.*?\?>/gi, '')
        .replace(/<!DOCTYPE svg[^>]*>/gi, '')
        .replace(/^<svg[^>]*>/i, '') // Remove outer <svg> tag of background
        .replace(/<\/svg>$/i, '');  // Remove closing </svg> tag of background
    } catch (fetchError) {
      console.error('Error fetching background SVG:', fetchError.message);
      // Optionally, you could return a fallback SVG here or re-throw
      return new Response('Error fetching background SVG', { status: 500 });
    }

    // Construct the final SVG
    // The viewBox should match the width and height for a 1:1 mapping of units.
    const finalSvg = `
      <svg
        width="${NOTION_COVER_WIDTH}"
        height="${NOTION_COVER_HEIGHT}"
        viewBox="0 0 ${NOTION_COVER_WIDTH} ${NOTION_COVER_HEIGHT}"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        // Embed the cleaned background SVG content directly.
        // Ensure the background SVG itself is well-formed and doesn't conflict.
        ${backgroundSvgContent}

        // Add custom styling for the text
        <style>
          .quote-text {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 48px; /* Adjusted for 1500px width */
            fill: #FFFFFF; /* White text, assuming background is dark or varied */
            font-weight: bold;
            text-anchor: middle; /* Horizontally center */
            dominant-baseline: middle; /* Vertically center */
            /* Add a subtle shadow for better readability on varied backgrounds */
            text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
          }
          .attribution-text {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 16px;
            fill: #E0E0E0; /* Light gray */
            text-anchor: end;
            dominant-baseline: auto;
          }
        </style>

        // Add the quote text
        // x="50%" y="50%" centers the text block.
        // You might need to implement text wrapping for very long quotes or use multiple tspan elements.
        <text x="50%" y="50%" class="quote-text">
          ${selectedQuote.length > 120 ? selectedQuote.substring(0, 117) + '...' : selectedQuote}
        </text>

        // Optional: Add a small attribution or timestamp
        <text x="${NOTION_COVER_WIDTH - 20}" y="${NOTION_COVER_HEIGHT - 20}" class="attribution-text">
          Daily Notion Cover
        </text>
      </svg>
    `;

    const headers = {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate', // Cache for 1 hour on CDN, revalidate in background
    };

    return new Response(finalSvg, { status: 200, headers });

  } catch (error) {
    console.error('Error generating SVG:', error);
    return new Response('Error generating SVG cover. Check server logs.', { status: 500 });
  }
}
