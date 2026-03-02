const PImage = require("pureimage");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../output/images");
const FONTS_DIR = path.join(__dirname, "../fonts");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const fontCache = new Map();

function getAvailableFonts() {
  const files = fs.readdirSync(FONTS_DIR);
  return files.filter((file) => file.endsWith(".ttf"));
}

function getRandomFont() {
  const fonts = getAvailableFonts();
  if (fonts.length === 0) {
    throw new Error("fonts 文件夹中没有找到 .ttf 字体文件");
  }
  const randomIndex = Math.floor(Math.random() * fonts.length);
  return fonts[randomIndex];
}

async function loadFont(fontFileName) {
  const cacheKey = fontFileName;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey);
  }

  const fontPath = path.join(FONTS_DIR, fontFileName);

  if (!fs.existsSync(fontPath)) {
    console.error(`❌ 未找到字体文件: ${fontPath}`);
    throw new Error(`字体文件不存在: ${fontPath}`);
  }

  try {
    console.log(`正在加载字体: ${fontPath}`);

    const fontName = path.basename(fontFileName, ".ttf");
    const font = PImage.registerFont(fontPath, fontName);
    await font.load();

    fontCache.set(cacheKey, { font, fontName, fileName: fontFileName });
    console.log(`✓ 成功加载字体: ${fontFileName} (名称: ${fontName})`);
    return { font, fontName, fileName: fontFileName };
  } catch (error) {
    console.error(`加载字体失败:`, error);
    throw error;
  }
}

async function createTextImage(text, options) {
  const {
    width = 800,
    height = 600,
    format = "png",
    fontSize = 32,
    color = "#000000",
    backgroundColor = "#ffffff",
    fontFile = null,
  } = options;

  console.log("开始生成图片，文本:", text);
  console.log("参数:", {
    width,
    height,
    format,
    fontSize,
    color,
    backgroundColor,
    fontFile,
  });

  let selectedFontFile = fontFile || getRandomFont();
  let fontData = null;
  let attempts = 0;
  const maxAttempts = 5;
  const triedFonts = new Set();

  while (attempts < maxAttempts) {
    try {
      console.log(`选择的字体文件: ${selectedFontFile}`);
      triedFonts.add(selectedFontFile);

      fontData = await loadFont(selectedFontFile);

      const img = PImage.make(width, height);
      const ctx = img.getContext("2d");

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}pt ${fontData.fontName}`;
      ctx.textBaseline = "top";

      const optimalFontSize = calculateOptimalFontSize(
        ctx,
        text,
        width,
        height,
        0.6,
      );
      console.log(
        `计算的最佳字体大小: ${optimalFontSize}pt (原始: ${fontSize}pt)`,
      );

      ctx.font = `${optimalFontSize}pt ${fontData.fontName}`;
      console.log("设置的字体:", ctx.font);

      const lines = wrapText(ctx, text, width - 40);
      console.log("文本行数:", lines.length, "内容:", lines);

      const lineHeight = optimalFontSize * 1.5;
      const totalTextHeight = lines.length * lineHeight;
      const startY = (height - totalTextHeight) / 2;

      lines.forEach((line, index) => {
        const textWidth = measureTextWidth(ctx, line);
        const x = (width - textWidth) / 2;
        const y = startY + index * lineHeight;

        console.log(
          `绘制第 ${index + 1} 行: "${line}" at (${x}, ${y}), 宽度: ${textWidth}`,
        );
        ctx.fillText(line, x, y);
      });

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const filename = `${timestamp}_${randomStr}.${format}`;
      const filepath = path.join(OUTPUT_DIR, filename);

      if (format === "jpeg" || format === "jpg") {
        await PImage.encodeJPEGToStream(
          img,
          fs.createWriteStream(filepath),
          90,
        );
      } else {
        await PImage.encodePNGToStream(img, fs.createWriteStream(filepath));
      }

      console.log(`✓ 图片已保存: ${filepath}`);

      return {
        url: `/images/${filename}`,
        fontUsed: selectedFontFile,
        fontName: fontData.fontName,
      };
    } catch (error) {
      console.error(`使用字体 ${selectedFontFile} 失败:`, error.message);
      attempts++;

      if (attempts < maxAttempts) {
        const availableFonts = getAvailableFonts().filter(
          (f) => !triedFonts.has(f),
        );
        if (availableFonts.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableFonts.length);
          selectedFontFile = availableFonts[randomIndex];
          console.log(`尝试使用下一个字体: ${selectedFontFile}`);
        } else {
          throw new Error("所有字体都尝试失败");
        }
      } else {
        throw new Error(`尝试了 ${maxAttempts} 个字体都失败: ${error.message}`);
      }
    }
  }
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let currentLine = "";

  for (const char of text) {
    const testLine = currentLine + char;
    const testWidth = measureTextWidth(ctx, testLine);

    if (testWidth > maxWidth && currentLine !== "") {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine !== "") {
    lines.push(currentLine);
  }

  return lines;
}

function measureTextWidth(ctx, text) {
  let width = 0;
  for (const char of text) {
    const metrics = ctx.measureText(char);
    width += metrics.width;
  }
  return width;
}

function calculateOptimalFontSize(
  ctx,
  text,
  width,
  height,
  targetCoverage = 0.6,
) {
  const imageArea = width * height;
  const targetArea = imageArea * targetCoverage;
  const charCount = text.length;

  if (charCount === 0) return 32;

  const minFontSize = 12;
  const maxFontSize = Math.min(width, height) / 2;

  const estimatedFontSize = Math.sqrt(targetArea / (charCount * 1.8));
  let fontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, estimatedFontSize),
  );

  const maxIterations = 20;
  let iteration = 0;
  let bestFontSize = fontSize;
  let bestDiff = Infinity;

  while (iteration < maxIterations) {
    ctx.font = `${fontSize}pt ${ctx.font.split(" ")[1] || "sans-serif"}`;

    const maxWidth = width - 40;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.5;
    const totalTextHeight = lines.length * lineHeight;

    let totalTextWidth = 0;
    lines.forEach((line) => {
      const lineWidth = measureTextWidth(ctx, line);
      totalTextWidth = Math.max(totalTextWidth, lineWidth);
    });

    const textArea = totalTextWidth * totalTextHeight;
    const coverage = textArea / imageArea;
    const diff = Math.abs(coverage - targetCoverage);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestFontSize = fontSize;
    }

    if (diff < 0.05) {
      break;
    }

    if (coverage < targetCoverage) {
      fontSize = fontSize * 1.1;
    } else {
      fontSize = fontSize * 0.9;
    }

    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));
    iteration++;
  }

  return Math.round(bestFontSize);
}

module.exports = {
  createTextImage,
  loadFont,
  getAvailableFonts,
  getRandomFont,
  calculateOptimalFontSize,
};
