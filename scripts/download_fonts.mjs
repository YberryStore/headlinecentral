import fs from 'fs';
import path from 'path';

const fontsDir = path.resolve('public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

async function run() {
  console.log('Fetching Google Fonts Poppins stylesheet...');
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const url = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  
  const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!res.ok) throw new Error(`Failed to fetch css: ${res.statusText}`);
  const css = await res.text();
  
  // Extract font faces
  const fontFaceRegex = /@font-face\s*{([^}]+)}/g;
  let match;
  let localCss = '';
  let count = 0;

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const weightMatch = block.match(/font-weight:\s*(\d+);/);
    const styleMatch = block.match(/font-style:\s*(\w+);/);
    const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    
    if (weightMatch && urlMatch) {
      const weight = weightMatch[1];
      const style = styleMatch ? styleMatch[1] : 'normal';
      const remoteUrl = urlMatch[1];
      const filename = `poppins-${weight}-${style}.woff2`;
      const localFilePath = path.join(fontsDir, filename);

      console.log(`Downloading Poppins ${weight} ${style} from ${remoteUrl}...`);
      const fontRes = await fetch(remoteUrl);
      if (!fontRes.ok) throw new Error(`Failed to download ${remoteUrl}`);
      const arrayBuf = await fontRes.arrayBuffer();
      fs.writeFileSync(localFilePath, Buffer.from(arrayBuf));
      console.log(`Saved ${filename} (${arrayBuf.byteLength} bytes)`);

      localCss += `@font-face {
  font-family: 'Poppins';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
}
`;
      count++;
    }
  }

  const cssOutDir = path.resolve('assets/css');
  if (!fs.existsSync(cssOutDir)) {
    fs.mkdirSync(cssOutDir, { recursive: true });
  }
  fs.writeFileSync(path.join(cssOutDir, 'fonts.css'), localCss);
  console.log(`Successfully downloaded ${count} Poppins font files and created assets/css/fonts.css!`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

