# BitUnion API 模拟器演示手册

本项目成功构建了一个基于 BitUnion 测试环境 API 的 Web 功能模拟器。用户可以直观地体验从注册登录到速汇订单生成的完整业务闭环。

## 🚀 核心功能亮点

### 1. Web3 安全认证 (Auth)
*   **模拟 EIP-712 签名**: 真实模拟了通过钱包签名 Nonce 进行登录的流程。
*   **自动注册**: 接口支持“地址即账户”，登录即完成初始化工作。

### 2. 动态 KYC 与模拟 OCR
*   **动态字段渲染**: 根据 API 定义实时拉取必填资料项。
*   **✨ OCR 一键填充**: 为了优化演示效果，我们实现了模拟 OCR 按钮，点击后自动填充证件信息，无需手动输入。
*   **文件上传模拟**: 接入了真实的 KYC 文件上传接口。

### 3. 本地化资产管理 (Wallet)
*   **多币种看板**: 实时展示 USDT, USDC, CFX 等资产余额。
*   **⚡ 一键模拟充值**: 为了演示后续的速汇流程，模拟器提供了一键到账 100 USDT 的功能。
*   **交易溯源**: 展示充值、提取、兑换的详细历史记录。

### 4. 实时速汇 (Express Remit)
*   **实时牌价**: 接入 Oracle 价格接口，展示真实的兑换比例。
*   **限额风控**: 自动检测用户当天的兑换限额剩余量。
*   **闭环操作**: 支持从计算估算额到最终创建订单的完整交互。

## 🛠 技术实现

*   **设计风格**: 采用 Vanilla CSS 打造的现代 Web3 深色玻璃拟态 (Glassmorphism) UI。
*   **数据驱动**: 深度集成 `axios` 并封装了完整的 API 服务层。
*   **状态控制**: 利用 React Context (AuthContext) 管理 Token 注入与全局登录态。

## 📂 交付文件清单

1.  **前端代码**: 位于 `app/` 目录下。
2.  **实施计划**: [implementation_plan.md](file:///c:/Users/haido/Desktop/HexPay/3.AI/Google%20antigravity/34.conflux/文档/implementation_plan.md)
3.  **任务执行记录**: [task.md](file:///c:/Users/haido/Desktop/HexPay/3.AI/Google%20antigravity/34.conflux/任务和测试过程/task.md)
4.  **演示手册**: [walkthrough.md](file:///c:/Users/haido/Desktop/HexPay/3.AI/Google%20antigravity/34.conflux/任务和测试过程/walkthrough.md)

---
**提示**: 由于环境限制暂时无法生成录屏，但您可以直接在本地运行 `cd app && npm install && npm run dev` 来查看实际效果。
