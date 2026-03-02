const express = require("express");
const router = express.Router();
const {
  createTextImage,
  getAvailableFonts,
} = require("../utils/imageGenerator");

router.post("/text-to-image", async (req, res) => {
  try {
    const {
      text,
      width,
      height,
      format,
      fontSize,
      color,
      backgroundColor,
      fontFile,
    } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "缺少必要参数",
        message: "text 参数是必填的",
      });
    }

    console.log("接收到请求参数:", req.body);
    console.log("text 原始值:", text);
    console.log("text 类型:", typeof text);
    console.log("text 长度:", text.length);
    console.log("text 字节数据:", Buffer.from(text).toString("hex"));
    const options = {
      width: parseInt(width) || 800,
      height: parseInt(height) || 600,
      format: format || "png",
      fontSize: parseInt(fontSize) || 32,
      color: color || "#000000",
      backgroundColor: backgroundColor || "#ffffff",
      fontFile: fontFile || null,
    };

    const result = await createTextImage(text, options);

    const protocol = req.protocol;
    const host = req.get("host");
    const fullUrl = `${protocol}://${host}${result.url}`;

    res.json({
      success: true,
      data: {
        url: fullUrl,
        relativeUrl: result.url,
        width: options.width,
        height: options.height,
        format: options.format,
        fontUsed: result.fontUsed,
        fontName: result.fontName,
      },
    });
  } catch (error) {
    console.error("生成图片失败:", error);
    res.status(500).json({
      error: "生成图片失败",
      message: error.message,
    });
  }
});

router.get("/fonts", (req, res) => {
  try {
    const fonts = getAvailableFonts();
    res.json({
      success: true,
      data: {
        fonts: fonts,
        count: fonts.length,
      },
    });
  } catch (error) {
    console.error("获取字体列表失败:", error);
    res.status(500).json({
      error: "获取字体列表失败",
      message: error.message,
    });
  }
});

module.exports = router;
