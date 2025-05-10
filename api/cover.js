export async function GET(request) {
  try {

const quotes = [
  // Seu array de citações existente...
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou", keywords: "self-love,success,happiness" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain", keywords: "motivation,start,progress" },
  { text: "I’m not telling you it’s going to be easy. I’m telling you it’s going to be worth it.", author: "Art Williams", keywords: "perseverance,challenge,worth" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn", keywords: "risk,opportunity,extraordinary" },
  { text: "People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed.", author: "Tony Robbins", keywords: "momentum,success,drive" },
  { text: "All progress takes place outside the comfort zone.", author: "Michael John Bobak", keywords: "growth,comfort zone,progress" },
  { text: "Good things come to people who wait, but better things come to those who go out and get them.", author: "Anonymous", keywords: "patience,action,success" },
  { text: "There is no chance, no destiny, no fate that can hinder or control the firm resolve of a determined soul.", author: "Ella Wheeler Wilcox", keywords: "destiny,determination,soul" },
  { text: "The first step toward success is taken when you refuse to be a captive of the environment in which you first find yourself.", author: "Mark Caine", keywords: "environment,change,success" },
  { text: "There is no traffic jam along the extra mile.", author: "Roger Staubach", keywords: "effort,determination,success" },
  { text: "Trust because you are willing to accept the risk, not because it’s safe or certain.", author: "Anonymous", keywords: "trust,risk,faith" },
  { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein", keywords: "value,success,character" },
  { text: "If you wait for perfect conditions, you’ll never get anything done.", author: "Ecclesiastes 11:4", keywords: "action,imperfection,progress" },
  { text: "Others have seen what is and asked why. I have seen what could be and asked why not.", author: "Pablo Picasso", keywords: "imagination,possibility,creativity" },
  { text: "I have not failed. I’ve just found 10,000 ways that won’t work.", author: "Thomas A. Edison", keywords: "failure,perseverance,learning" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", keywords: "destiny,choice,self" },
  { text: "Tough times don't last. Tough people do.", author: "Robert H. Schuller", keywords: "resilience,strength,perseverance" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", keywords: "progress,persistence,patience" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", keywords: "fear,courage,achievement" },
  { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong", keywords: "pain,endurance,perseverance" },
  { text: "Believe you can, and you’re halfway there.", author: "Theodore Roosevelt", keywords: "belief,confidence,success" },
  { text: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings", keywords: "courage,growth,authenticity" },
  { text: "Nothing is impossible. The word itself says 'I'm possible!'", author: "Audrey Hepburn", keywords: "possibility,optimism,impossible" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman", keywords: "positivity,optimism,sunshine" },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney", keywords: "dreams,courage,pursuit" },
  { text: "Don't sit down and wait for the opportunities to come. Get up and make them.", author: "Madam C.J. Walker", keywords: "opportunity,action,initiative" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", keywords: "hope,light,darkness" },
  { text: "Never give up on something that you can’t go a day without thinking about.", author: "Winston Churchill", keywords: "perseverance,dreams,determination" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford", keywords: "adversity,strength,success" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison", keywords: "persistence,success,never give up" }
];

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;


    const dayOfMonth = new Date().getDate();
    const quoteIndex = (dayOfMonth - 1) % quotes.length;
    const { text, author } = quotes[quoteIndex];
    const plannerTitle = "Daily Spark";

    // Array com as 5 imagens do diretório fornecido
    const images = [
      "https://dynamic-notion-cover.vercel.app/1.webp",
      "https://dynamic-notion-cover.vercel.app/2.webp",
      "https://dynamic-notion-cover.vercel.app/3.webp",
      "https://dynamic-notion-cover.vercel.app/4.webp",
      "https://dynamic-notion-cover.vercel.app/5.webp"
    ];

    // Selecionar a imagem com base no dia do mês (ciclado entre 0 e 4)
    const imageIndex = (dayOfMonth - 1) % images.length;
    const selectedImageUrl = images[imageIndex];

    // Converter a URL da imagem para Data URI (mantendo a função existente)
    const imageDataUri = await imageUrlToDataUri(selectedImageUrl);

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

    // Mantendo o restante do SVG como no código original
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
              ">“${text}”</div>
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
    console.error('Erro ao gerar capa:', error);
    // Retornar um SVG de erro simples (mantido como no original)
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
