import got from 'got';

const quotes = [
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "I’m not telling you it’s going to be easy. I’m telling you it’s going to be worth it.", author: "Art Williams" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
  { text: "People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed.", author: "Tony Robbins" },
  { text: "All progress takes place outside the comfort zone.", author: "Michael John Bobak" },
  { text: "Good things come to people who wait, but better things come to those who go out and get them.", author: "Anonymous" },
  { text: "There is no chance, no destiny, no fate that can hinder or control the firm resolve of a determined soul.", author: "Ella Wheeler Wilcox" },
  { text: "The first step toward success is taken when you refuse to be a captive of the environment in which you first find yourself.", author: "Mark Caine" },
  { text: "There is no traffic jam along the extra mile.", author: "Roger Staubach" },
  { text: "Trust because you are willing to accept the risk, not because it’s safe or certain.", author: "Anonymous" },
  { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
  { text: "If you wait for perfect conditions, you’ll never get anything done.", author: "Ecclesiastes 11:4" },
  { text: "Others have seen what is and asked why. I have seen what could be and asked why not.", author: "Pablo Picasso" },
  { text: "I have not failed. I’ve just found 10,000 ways that won’t work.", author: "Thomas A. Edison" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Tough times don't last. Tough people do.", author: "Robert H. Schuller" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
  { text: "Believe you can, and you’re halfway there.", author: "Theodore Roosevelt" },
  { text: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings" },
  { text: "Nothing is impossible. The word itself says 'I'm possible!'", author: "Audrey Hepburn" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "Don't sit down and wait for the opportunities to come. Get up and make them.", author: "Madam C.J. Walker" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Never give up on something that you can’t go a day without thinking about.", author: "Winston Churchill" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" }
];

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;
const BACKGROUND_SVG_URL = 'https://lib.notion.vip/tools/animated-notion-covers/animated-notion-cover_24.svg';

export async function GET(request) {
  try {
    const dayOfMonth = new Date().getDate();
    const quoteIndex = (dayOfMonth - 1) % quotes.length;
    const { text, author } = quotes[quoteIndex];

    let backgroundSvgContent = '';
    try {
      const response = await got(BACKGROUND_SVG_URL);
      backgroundSvgContent = response.body
        .replace(/<\?xml.*?\?>/gi, '')
        .replace(/<!DOCTYPE svg[^>]*>/gi, '')
        .replace(/^<svg[^>]*>/i, '')
        .replace(/<\/svg>$/i, '');
    } catch (fetchError) {
      return new Response('Error fetching background SVG', { status: 503 });
    }

    // SVG with IBM Plex Mono font from Google Fonts
    const finalSvg = `
      <svg
        width="${NOTION_COVER_WIDTH}"
        height="${NOTION_COVER_HEIGHT}"
        viewBox="0 0 ${NOTION_COVER_WIDTH} ${NOTION_COVER_HEIGHT}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
          </style>
        </defs>
        <style>
          .quote-text {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 48px;
            fill: #fff;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
            filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.5));
          }
          .author-text {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 28px;
            fill: #e0e0e0;
            font-weight: 400;
            text-anchor: middle;
            dominant-baseline: middle;
            filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.3));
          }
        </style>
        ${backgroundSvgContent}
        <text x="50%" y="45%" class="quote-text">
          ${escapeHtml(text)}
        </text>
        <text x="50%" y="58%" class="author-text">
          - ${escapeHtml(author)}
        </text>
      </svg>
    `;

    const headers = {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    };

    return new Response(finalSvg, { status: 200, headers });

  } catch (error) {
    return new Response('Error generating SVG cover.', { status: 500 });
  }
}

// Simple HTML escape for SVG safety
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}
