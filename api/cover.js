import got from 'got';

const quotes = [
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou", keywords: "self-love,success,happiness" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain", keywords: "motivation,start,progress" },
  { text: "I'm not telling you it's going to be easy. I'm telling you it's going to be worth it.", author: "Art Williams", keywords: "perseverance,challenge,worth" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn", keywords: "risk,opportunity,extraordinary" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison", keywords: "persistence,success,never give up" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", keywords: "passion,work,success" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", keywords: "persistence,motivation,time" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", keywords: "confidence,belief,success" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", keywords: "perseverance,progress,patience" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", keywords: "dreams,hope,future" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", keywords: "challenges,growth,destiny" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", keywords: "opportunity,risk,action" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", keywords: "growth,goals,transformation" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", keywords: "failure,innovation,persistence" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan", keywords: "dreams,courage,ambition" }
];

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;

async function imageUrlToDataUri(imageUrl) {
  try {
    const response = await got(imageUrl, { responseType: 'buffer', timeout: { request: 15000 } });
    const imageBuffer = response.body;
    const contentType = response.headers['content-type'] || 'image/webp';
    const base64Image = imageBuffer.toString('base64');
    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.error('Erro ao converter imagem para Data URI:', error.message);
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}

export async function GET(request) {
  try {
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

    // Converter a URL da imagem para Data URI
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
                font-family: 'iawriter-mono', 'Nitti', 'Menlo', 'Courier', monospace;
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
    console.error('Erro ao gerar capa:', error);
    const errorSvg = `
      <svg width="1500" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="lightgrey"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'iawriter-mono', 'Nitti', 'Menlo', 'Courier', monospace" font-size="40" fill="black">
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
