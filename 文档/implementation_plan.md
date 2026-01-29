# BitUnion API 模拟器实施方案

本项目旨在开发一个前端模拟器，用于演示和测试 BitUnion 的核心业务流程。模拟器将基于 BitUnion 测试环境 API 进行开发。

## 核心业务流程

1.  **用户注册与登录**
    *   获取 Nonce: `GET /user/sign/nonce`
    *   EIP-712 签名（模拟或通过 Web3 钱包）
    *   登录/注册: `POST /user/login` (用户不存在时自动注册)
2.  **KYC 信息提交**
    *   获取必填字段: `GET /v1/fields/kyc`
    *   上传证件照片: `POST /v1/files/kyc`
    *   设置 KYC 资料: `POST /v1/user/kyc/fiat`
    *   查询状态: `GET /v1/user/kyc/fiat/completed`
3.  **资金充值 (Deposit)**
    *   **接口现状**: 经过深度扫描 `doc.json`，未发现直接的“获取充值地址”接口。
    *   **模拟方案**: 
        *   在模拟器中提供“一键模拟到账”功能，直接调用 Mock 数据或预期余额变更逻辑。
        *   界面展示用户的登录钱包地址作为接收地址（常见于非托管方案）。
    *   资金看板: `GET /v1/user/balance`
4.  **发起速汇 (Express Remit)**
    *   获取支持的法币/代币: `GET /v1/card/orders/exchange/supported`
    *   获取实时汇率: `GET /v1/oracle/price`
    *   创建兑换订单: `POST /v1/card/orders/exchange/fiat`
    *   (若需要) 提交合规信息: `POST /v1/card/orders/exchange/compliance`

## OCR 模拟方案

由于生产环境的 OCR 校验在前端无法直接调用，我们将采取以下模拟方案：
*   **交互逻辑**: 用户在 KYC 页面上传证件照后，点击“模拟 OCR 识别”按钮。
*   **功能实现**: 前端解析或随机生成一套符合规格的个人信息（如：姓名、证件号、地址等），自动填入表单字段。
*   **技术点**: 模拟 `POST /v1/user/kyc/fiat` 接口在 OCR 后的“已验证”状态反馈。

*   **框架**: Vite + React
*   **样式**: Vanilla CSS (遵循用户 global rule: "使用 Vanilla CSS 除非用户明确要求 TailwindCSS")
*   **API 交互**: Axios
*   **状态管理**: React Context / Hooks
*   **Web3 交互**: ethers.js / viem (用于 EIP-712 签名)

## 页面设计

1.  **Dashboard**: 显示用户登录状态、余额以及四个主要步骤的快速访问。
2.  **Auth 模块**: 模拟钱包连接与登录流程。
3.  **KYC 表单**: 动态渲染 KYC 所需字段，支持文件上传预览。
4.  **Wallet 模块**: 显示充值地址与历史记录。
5.  **Remit 模块**: 货币换算器与订单提交界面。

## 验证计划

### 自动化测试
*   使用 Vitest 测试 API 封装逻辑。
*   使用 Playwright 模拟用户完成完整的“注册-KYC-充值-速汇”流程。

### 手动验证
*   按顺序操作 UI，验证各步骤的 API 调用与响应处理情况。
*   检查 UI 在不同屏幕尺寸下的适配。

## 用户审批点
*   [x] 充值地址接口确认：文档中缺乏直接接口，已确定采用“模拟充值”UI 进行演示。
*   [x] KYC 资料内容：已确定采用“模拟 OCR”按钮，自动填充表单以优化用户体验。
