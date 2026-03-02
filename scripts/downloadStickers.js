const https = require('https');
const fs = require('fs');
const path = require('path');

const STICKERS_DIR = path.join(__dirname, '../stickers');

const cuteEmojis = [
  { name: 'heart_eyes', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f60d.png?v8' },
  { name: 'star', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2b50.png?v8' },
  { name: 'sparkles', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2728.png?v8' },
  { name: 'fire', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f525.png?v8' },
  { name: 'heart', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2764.png?v8' },
  { name: 'rocket', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f680.png?v8' },
  { name: 'tada', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f389.png?v8' },
  { name: 'thumbsup', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png?v8' },
  { name: 'clap', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f44f.png?v8' },
  { name: 'muscle', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f4aa.png?v8' },
  { name: 'sunglasses', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f60e.png?v8' },
  { name: 'bulb', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f4a1.png?v8' },
  { name: 'gem', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f48e.png?v8' },
  { name: 'crown', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f451.png?v8' },
  { name: 'gift', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f381.png?v8' },
  { name: 'balloon', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f388.png?v8' },
  { name: 'rainbow', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f308.png?v8' },
  { name: 'sun', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2600.png?v8' },
  { name: 'moon', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f314.png?v8' },
  { name: 'cloud', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2601.png?v8' },
  { name: 'cat', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f431.png?v8' },
  { name: 'dog', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f436.png?v8' },
  { name: 'panda', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f43c.png?v8' },
  { name: 'koala', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f428.png?v8' },
  { name: 'unicorn', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f984.png?v8' },
  { name: 'butterfly', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f98b.png?v8' },
  { name: 'flower', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f337.png?v8' },
  { name: 'rose', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f339.png?v8' },
  { name: 'cherry_blossom', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f338.png?v8' },
  { name: 'apple', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f34e.png?v8' },
  { name: 'pizza', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f355.png?v8' },
  { name: 'cake', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f370.png?v8' },
  { name: 'icecream', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f366.png?v8' },
  { name: 'coffee', url: 'https://github.githubassets.com/images/icons/emoji/unicode/2615.png?v8' },
  { name: 'party', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f973.png?v8' },
  { name: 'confetti', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f38a.png?v8' },
  { name: 'ribbon', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f380.png?v8' },
  { name: 'bell', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f514.png?v8' },
  { name: 'key', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f511.png?v8' },
  { name: 'lock', url: 'https://github.githubassets.com/images/icons/emoji/unicode/1f512.png?v8' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function downloadStickers() {
  console.log(`开始下载 ${cuteEmojis.length} 个贴图到 ${STICKERS_DIR}...`);
  
  if (!fs.existsSync(STICKERS_DIR)) {
    fs.mkdirSync(STICKERS_DIR, { recursive: true });
  }

  let downloaded = 0;
  for (const emoji of cuteEmojis) {
    const filepath = path.join(STICKERS_DIR, `${emoji.name}.png`);
    try {
      await downloadImage(emoji.url, filepath);
      downloaded++;
      console.log(`✓ 下载成功: ${emoji.name}`);
    } catch (error) {
      console.error(`✗ 下载失败: ${emoji.name} - ${error.message}`);
    }
  }

  console.log(`\n下载完成！成功: ${downloaded}/${cuteEmojis.length}`);
}

downloadStickers().catch(console.error);
