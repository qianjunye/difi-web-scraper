# difi-web-scraper
一个接受参数请求指定网站并使用 Cheerio 输出指定内容的 API 服务，yaml可供创建dify的自定义工具|An API service that accepts parameters to request a specified website and uses Cheerio to output specified content. YAML is available for creating custom tools in Dify.

## 安装依赖

```bash
npm install
```

> puppeteer 依赖本地 Chrome 或 Chromium 浏览器。你可以：
> 1. 安装 Chromium（如 Ubuntu 可用 `sudo apt install chromium-browser`，macOS 可用 `brew install --cask chromium`）。
> 2. 需要修改 `dify_request_web.js` 里 puppeteer 的 `executablePath`，指向你本地的 Chrome/Chromium 路径。

## 主要依赖库
- express
- axios
- cheerio
- puppeteer
- swagger-jsdoc
- swagger-ui-express

## 使用方式

1. 启动服务：

```bash
npm start
```

2. 访问 API 文档：

浏览器打开 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

3. 请求示例：

```bash
curl "http://localhost:3000/scrape?url=https://example.com&method=axios&outputFormat=rawText&className=main"
```

4、Dify使用
dify-工具-自定义-创建自定义工具-复制schema.yaml输入框。注意测试与网段配置

- `url`：要抓取的网址（必填）
- `method`：请求方式，可选 `axios` 或 `puppeteer`（默认 axios）
- `outputFormat`：输出格式，可选 `rawHtml` 或 `rawText`（默认 rawText）
- `className`：要提取内容的类名（可选，不填则输出全文）

## 需要替换的内容

- 如需使用 puppeteer，需将 `dify_request_web.js` 里的 `executablePath` 替换为你本地 Chrome/Chromium 的实际路径。
  ```js
  const browser = await puppeteer.launch({
    executablePath: '/snap/bin/chromium' // 替换为你的 Chrome 路径
  });
  ```

