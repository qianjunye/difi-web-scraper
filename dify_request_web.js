const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

// OpenAPI 配置
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Scraper API",
      version: "1.0.0",
      description:
        "一个接受参数请求指定网站并使用 Cheerio 输出指定内容的 API 服务",
    },
  },
  apis: ["./app.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /scrape:
 *   get:
 *     summary: 请求指定网站并输出指定内容
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: 要请求的网站 URL
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [axios, puppeteer]
 *         description: 请求方法，默认为 axios
 *       - in: query
 *         name: outputFormat
 *         schema:
 *           type: string
 *           enum: [rawHtml, rawText]
 *         description: 输出格式，可选值为 rawHtml、rawText，默认为 rawText
 *       - in: query
 *         name: className
 *         schema:
 *           type: string
 *         description: 要提取内容的类名，若未提供则输出全文
 *     responses:
 *       200:
 *         description: 成功获取内容
 *       400:
 *         description: 缺少必要参数
 *       500:
 *         description: 服务器错误
 */
app.get("/scrape", async (req, res) => {
  const {
    url,
    method = "axios",
    outputFormat = "rawText",
    className,
  } = req.query;
  console.log(url, method, outputFormat, className);
  if (!url) {
    return res.status(400).send("缺少必要参数: url");
  }

  try {
    let html;
    if (method === "axios") {
      const response = await axios.get(url);
      html = response.data;
    } else if (method === "puppeteer") {
      // 使用指定的 Chrome 地址启动浏览器
      const browser = await puppeteer.launch({
        executablePath: "/snap/bin/chromium",
      });
      const page = await browser.newPage();
      await page.goto(url);
      html = await page.content();
      await browser.close();
    }

    const $ = cheerio.load(html);
    let result;
    let targetElement;

    if (className) {
      targetElement = $(`.${className}`);
    } else {
      targetElement = $("body");
    }

    if (outputFormat === "rawHtml") {
      result = targetElement.html();
    } else if (outputFormat === "rawText") {
      result = targetElement.text();
    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
