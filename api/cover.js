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

const WIDTH = 1500;
const HEIGHT = 600;
const BACKGROUND_SVG_URL = 'https://lib.notion.vip/tools/animated-notion-covers/animated-notion-cover_24.svg';

export async function GET(request) {
  try {
    const dayOfMonth = new Date().getDate();
    const quoteIndex = (dayOfMonth - 1) % quotes.length;
    const { text, author } = quotes[quoteIndex];

    let backgroundSvgContent = '';
    try {
      const response = await got(BACKGROUND_SVG_URL);
      // Preserva elementos de animação ao limpar o SVG
      backgroundSvgContent = response.body
        .replace(/<\?xml.*?\?>/gi, '')
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/^<svg[^>]*>/i, '')
        .replace(/<\/svg>$/i, '');
    } catch {
      return new Response('Error fetching background SVG', { status: 503 });
    }

    const finalSvg = `
      <svg
        width="${WIDTH}"
        height="${HEIGHT}"
        viewBox="0 0 ${WIDTH} ${HEIGHT}"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <!-- Incorpora conteúdo animado do SVG de fundo -->
        ${BACKGROUND_SVG_URL}

        <style>
          .quote-text {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 5vw;
            fill: #fff;
            font-weight: bold;
            text-anchor: middle;
            dominant-baseline: middle;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
            letter-spacing: 0.5px;
          }
          .author-text {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 2.5vw;
            fill: #e0e0e0;
            font-weight: normal;
            text-anchor: middle;
            dominant-baseline: middle;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
            letter-spacing: 0.2px;
          }
          @media (max-width: 800px) {
            .quote-text { font-size: 4vw; }
            .author-text { font-size: 2vw; }
          }
        </style>

        <g class="quote-container">
          <text x="50%" y="45%" class="quote-text">
            “${text}”
          </text>
          <text x="50%" y="55%" class="author-text">
            - ${author}
          </text>
        </g>
      </svg>
    `;

    return new Response(finalSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    return new Response('Error generating cover', { status: 500 });
  }
}
