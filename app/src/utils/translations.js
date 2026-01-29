export const translations = {
    en: {
        nav: {
            login: '1. Login',
            kyc: '2. KYC',
            wallet: '3. Wallet',
            remit: '4. Remit',
            logout: 'Logout'
        },
        auth: {
            welcome: 'Welcome to BitUnion',
            desc: 'Connect your wallet or enter your address to simulate the EIP-712 login process.',
            label: 'Wallet Address',
            autofill: '✨ Auto-fill from Wallet',
            placeholder: '0x...',
            sync: 'Auto-fill',
            btn: 'Sign & Login',
            btnLoading: 'Authenticating...',
            success: 'Successfully Authenticated',
            successDesc: 'Your address:',
            successTip: 'You can now proceed to the next step: KYC Verification.',
            newUser: 'New user? Login will automatically create an account.'
        },
        kyc: {
            title: 'KYC Verification',
            desc: 'Provide your identity information to unlock exchange services.',
            ocrBtn: '✨ Simulate OCR Autofill',
            submitBtn: 'Submit KYC Profile',
            submitting: 'Submitting...',
            success: 'KYC submitted successfully!',
            status: {
                info: 'Info Status',
                photo: 'Photos Status',
                completed: '✓ Completed',
                incomplete: '⚠ Incomplete',
                missing: 'Missing Fields'
            },
            upload: 'Upload Photo',
            change: 'Change File',
            uploading: 'Uploading...'
        },
        wallet: {
            balances: 'Asset Balances',
            receive: 'Receive Funds',
            receiveDesc: 'Send USDT/USDC to your deposit address on Conflux eSpace.',
            addrLabel: 'Deposit Address',
            mockBtn: '⚡ One-Click Mock Deposit (100 USDT)',
            history: 'Transaction History',
            refresh: 'Refresh',
            empty: 'No transactions yet',
            table: {
                type: 'TYPE',
                amount: 'AMOUNT',
                status: 'STATUS',
                date: 'DATE'
            }
        },
        remit: {
            title: 'Express Remittance',
            desc: 'Exchange your crypto for fiat and send it directly to your bank account.',
            pay: 'You Pay',
            receiveLabel: 'You Receive (Est.)',
            balance: 'Balance:',
            rate: 'Rate:',
            updating: 'Updating rate...',
            min: 'Min:',
            max: 'Max:',
            daily: 'Daily Remaining:',
            btn: 'Remit to Bank',
            processing: 'Processing Order...',
            note: 'Important Note',
            noteDesc: 'Actual exchange rate may vary slightly at the time of execution. Funds usually arrive in your bank account within 2-24 hours.'
        },
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success'
        },
        app: {
            required: 'Authentication Required',
            requiredDesc: 'Please log in with your wallet before proceeding to this step.',
            goLogin: 'Go to Login'
        }
    },
    zh: {
        nav: {
            login: '1. 登录',
            kyc: '2. 身份认证',
            wallet: '3. 资金充值',
            remit: '4. 速汇订单',
            logout: '退出'
        },
        auth: {
            welcome: '欢迎使用 BitUnion',
            desc: '连接您的钱包或输入地址，模拟 EIP-712 登录流程。',
            label: '钱包地址',
            autofill: '✨ 从钱包自动填充',
            placeholder: '0x...',
            sync: '自动同步',
            btn: '签名并登录',
            btnLoading: '认证中...',
            success: '认证成功',
            successDesc: '您的地址:',
            successTip: '您现在可以进行下一步：KYC 身份认证。',
            newUser: '新用户？登录后将自动创建账户。'
        },
        kyc: {
            title: 'KYC 身份验证',
            desc: '提交您的身份信息以解锁法币兑换服务。',
            ocrBtn: '✨ 模拟 OCR 自动填充',
            submitBtn: '提交 KYC 资料',
            submitting: '提交中...',
            success: 'KYC 资料提交成功！',
            status: {
                info: '资料状态',
                photo: '照片状态',
                completed: '✓ 已完成',
                incomplete: '⚠ 未完成',
                missing: '缺失字段'
            },
            upload: '上传照片',
            change: '更换文件',
            uploading: '上传中...'
        },
        wallet: {
            balances: '资产余额',
            receive: '获取充值',
            receiveDesc: '向您的 Conflux eSpace 充值地址发送 USDT/USDC。',
            addrLabel: '充值地址',
            mockBtn: '⚡ 一键模拟到账 (100 USDT)',
            history: '交易历史',
            refresh: '刷新',
            empty: '暂无交易记录',
            table: {
                type: '类型',
                amount: '金额',
                status: '状态',
                date: '日期'
            }
        },
        remit: {
            title: '速汇服务',
            desc: '将您的加密货币兑换为法币并直接汇入您的银行账户。',
            pay: '支付金额',
            receiveLabel: '预计到账',
            balance: '余额:',
            rate: '汇率:',
            updating: '汇率更新中...',
            min: '最小限额:',
            max: '最大限额:',
            daily: '今日剩余:',
            btn: '汇款至银行',
            processing: '订单处理中...',
            note: '重要说明',
            noteDesc: '实际汇率在执行时可能有细微变动。资金通常在 2-24 小时内到达您的银行账户。'
        },
        common: {
            loading: '加载中...',
            error: '错误',
            success: '成功'
        },
        app: {
            required: '需要身份认证',
            requiredDesc: '在进行此步骤之前，请先使用您的钱包登录。',
            goLogin: '前往登录'
        }
    }
};
