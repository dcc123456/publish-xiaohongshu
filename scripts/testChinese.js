const PImage = require("pureimage");
const fs = require("fs");
const path = require("path");
const { createTextImage } = require("../utils/imageGenerator");
const FONTS_DIR = path.join(__dirname, "../fonts");
const OUTPUT_DIR = path.join(__dirname, "../output/images");

async function testChineseText() {
  console.log("=== 开始测试中文渲染 ===");

  const fontPath = path.join(FONTS_DIR, "chinese.ttf");
  console.log("字体路径:", fontPath);
  console.log("字体文件存在:", fs.existsSync(fontPath));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    console.log("\n1. 注册字体...");
    const font = PImage.registerFont(fontPath, "TestFont");

    console.log("2. 加载字体...");
    await font.load();
    console.log("✓ 字体加载成功");

    console.log("\n3. 创建画布...");
    const img = PImage.make(400, 200);
    const ctx = img.getContext("2d");

    console.log("4. 设置背景...");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 200);

    console.log("5. 设置字体...");
    ctx.fillStyle = "#000000";
    ctx.font = "32pt TestFont";
    ctx.textBaseline = "top";

    console.log("6. 测试文本: 你好世界");
    const testText = "你好世界";

    console.log("7. 测量文本宽度...");
    let totalWidth = 0;
    for (const char of testText) {
      const metrics = ctx.measureText(char);
      console.log(`  字符 "${char}" 宽度: ${metrics.width}`);
      totalWidth += metrics.width;
    }
    console.log(`  总宽度: ${totalWidth}`);

    console.log("8. 绘制文本...");
    const x = (400 - totalWidth) / 2;
    const y = 84;
    ctx.fillText(testText, x, y);

    console.log("9. 保存图片...");
    const outputPath = path.join(OUTPUT_DIR, "test_chinese.png");
    await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));

    console.log(`\n✓ 测试完成！图片已保存: ${outputPath}`);
    console.log("请查看图片验证中文是否正确显示");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// testChineseText()
createTextImage("你好世界", {})
  .then(() => {
    console.log("\n=== 测试成功 ===");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n=== 测试失败 ===");
    console.error(error);
    process.exit(1);
  });
