import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /res\.setHeader\('Transfer-Encoding',\s*'chunked'\);/,
  "res.setHeader('Cache-Control', 'no-cache, no-transform');\r\n    res.setHeader('X-Accel-Buffering', 'no');"
);
fs.writeFileSync('server.ts', content, 'utf8');
console.log('Successfully updated server.ts headers!');
