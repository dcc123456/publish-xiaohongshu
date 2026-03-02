const express = require("express");
const cors = require("cors");
const path = require("path");
const textToImageRouter = require("./routes/textToImage");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ charset: "utf-8" }));
app.use(express.urlencoded({ extended: true, charset: "utf-8" }));

app.use((req, res, next) => {
  res.charset = "utf-8";
  next();
});

app.use("/images", express.static(path.join(__dirname, "output/images")));

app.use("/api", textToImageRouter);

app.get("/", (req, res) => {
  res.json({
    message: "文字转图片 API 服务",
    endpoints: {
      "POST /api/text-to-image": "生成文字图片",
    },
  });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
