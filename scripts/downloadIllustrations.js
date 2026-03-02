const https = require("https");
const fs = require("fs");
const path = require("path");

const ILLUSTRATIONS_DIR = path.join(__dirname, "../illustrations");

if (!fs.existsSync(ILLUSTRATIONS_DIR)) {
  fs.mkdirSync(ILLUSTRATIONS_DIR, { recursive: true });
}

const illustrations = [
  {
    name: "bg1",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg1.png",
  },
  {
    name: "bg2",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg2.png",
  },
  {
    name: "bg3",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg3.png",
  },
  {
    name: "bg4",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg4.png",
  },
  {
    name: "bg5",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg5.png",
  },
  {
    name: "bg6",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg6.png",
  },
  {
    name: "bg7",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg7.png",
  },
  {
    name: "bg8",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg8.png",
  },
  {
    name: "bg10",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg10.png",
  },
  {
    name: "bg11",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg11.png",
  },
  {
    name: "bg12",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg12.png",
  },
  {
    name: "bg13",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg13.png",
  },
  {
    name: "bg14",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg14.png",
  },
  {
    name: "bg15",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/bg15.png",
  },
  {
    name: "character-bg",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/character-bg.png",
  },
  {
    name: "coffee-float",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/coffee-float.png",
  },
  {
    name: "pig-float",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/pig-float.png",
  },
  {
    name: "women-float",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/women-float.png",
  },
  {
    name: "path2",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/path2.png",
  },
  {
    name: "perspective",
    url: "https://raw.githubusercontent.com/ira-design/ira-illustrations/master/assets/img/perspective.png",
  },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          https
            .get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(file);
              file.on("finish", () => {
                file.close();
                resolve();
              });
            })
            .on("error", reject);
        } else if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
        } else {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        }
      })
      .on("error", reject);
  });
}

async function downloadIllustrations() {
  console.log(
    `开始下载 ${illustrations.length} 个插画到 ${ILLUSTRATIONS_DIR}...`,
  );

  let downloaded = 0;
  for (const illustration of illustrations) {
    const filepath = path.join(ILLUSTRATIONS_DIR, `${illustration.name}.png`);
    try {
      await downloadImage(illustration.url, filepath);
      const stats = fs.statSync(filepath);
      if (stats.size > 1000) {
        downloaded++;
        console.log(
          `✓ 下载成功: ${illustration.name} (${Math.round(stats.size / 1024)}KB)`,
        );
      } else {
        fs.unlinkSync(filepath);
        console.error(`✗ 文件太小: ${illustration.name}`);
      }
    } catch (error) {
      console.error(`✗ 下载失败: ${illustration.name} - ${error.message}`);
    }
  }

  console.log(`\n下载完成！成功: ${downloaded}/${illustrations.length}`);
}

downloadIllustrations().catch(console.error);
