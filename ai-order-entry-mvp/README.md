# AI 录单 L0 交互验证 Demo

本项目是一个本地可运行的企业 AI 录单 L0 交互验证 Demo，用于验证传统行业单据录入的页面流程、字段设计、人工审核流程和用户交互体验。

当前项目不是已完成的 AI 录单 MVP，不代表真实 OCR、LLM、生产效率或业务自动化收益。

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react

## 启动命令

```bash
npm install
npm run dev
```

启动后访问终端输出的本地地址，通常是：

```text
http://localhost:5173
```

## 页面功能

- Dashboard：首页展示示例处理数量、待人工校验数量、示例识别状态和最近处理记录；数据均为 Mock。
- 单据上传：提供图片 / PDF 上传 UI，显示文件名，点击“开始识别”后展示假识别结果。
- 人工校验：左侧单据预览占位，右侧结构化字段表单；日期、客户、品类、重量、单价、总价、批次号、备注均可编辑，并展示高 / 中 / 低置信度。
- 记录列表：展示已处理单据，支持待校验 / 已确认 / 有异常筛选；“导出 Excel”仅为 UI 按钮。
- 审计日志：展示谁上传、谁修改、何时确认、修改了什么字段。

## 当前 Demo 边界说明

- 不接后端服务。
- 不接真实 OCR API。
- 不接真实 LLM。
- 不接真实数据库。
- 上传文件不会离开浏览器当前状态，也不会被持久化。
- 识别结果、记录列表、审计日志全部来自 mock data。
- 导出 Excel 只做按钮和提示，不生成真实文件。
- 审计日志只用于演示追溯形态，不具备真实合规能力。

## 目录结构

```text
ai-order-entry-mvp/
  src/
    App.tsx
    index.css
    main.tsx
  DESIGN.md
  PRODUCT.md
  README.md
  package.json
  tailwind.config.js
  vite.config.ts
```
