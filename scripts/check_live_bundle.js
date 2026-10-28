import fetch from 'node-fetch';

async function main() {
  const htmlRes = await fetch('https://apkify-builder.vercel.app');
  const html = await htmlRes.text();
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!match) {
    console.log('No JS bundle match in HTML:', html.slice(0, 300));
    return;
  }
  const jsUrl = 'https://apkify-builder.vercel.app' + match[1];
  console.log('Fetching JS bundle:', jsUrl);
  const jsRes = await fetch(jsUrl);
  const js = await jsRes.text();
  
  const aiStudioMatches = js.match(/https?:\/\/[a-zA-Z0-9.-]*ai\.studio[^",']*/g);
  console.log('Matches for ai.studio:', aiStudioMatches);

  const buildApkMatches = js.match(/.{0,50}\/api\/build-apk.{0,50}/g);
  console.log('Matches for /api/build-apk:', buildApkMatches);
}

main().catch(console.error);
