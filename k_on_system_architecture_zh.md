# K-ON (在韩留学生服务与社区) - 系统架构设计说明书

本文档详细阐述了 **K-ON (在韩留学生服务与社区)** 系统的整体技术架构、核心技术栈以及双模自适应数据库的设计实现。

---

## 1. 系统架构概览

K-ON 系统采用现代化的 **PWA 客户端 - API 服务端 - 数据库** 三层架构。其核心设计亮点在于**双模自适应数据库**，系统能根据网络状况和云数据库健康度，自动在“云端持久化模式”和“本地备用模式”之间进行智能切换。

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef pwa fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d;
    classDef server fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;
    classDef db fill:#fffbeb,stroke:#d97706,stroke-width:2px,color:#92400e;
    
    subgraph Client_App ["K-ON 客户端应用 (Vite / React 单页应用)"]
        UI["React UI 界面视图<br>(首页, 论坛, 个人中心, 入境助手, 日历)"]
        SW["Service Worker (sw.js)<br>(离线资源缓存与后台推送通知)"]
        LOCAL["客户端本地存储<br>(localStorage / CacheStorage)"]
    end
    
    subgraph Backend_Server ["K-ON API 后端服务 (Node.js / Express)"]
        ROUT["Express 路由与控制器<br>(/api/posts, /api/reminders, /api/wallet)"]
        DIAG["网络连接诊断引擎<br>(监测云端数据库连接)"]
        LOCAL_DB["本地备用数据库引擎<br>(内存模式 / fallback_db.json)"]
    end
    
    subgraph Data_Storage ["数据存储层"]
        CLOUDDD["Supabase 云端数据库<br>(PostgreSQL: 存储帖子、评论、用户、提醒)"]
    end
    
    %% Connections
    UI <--> ROUT
    UI <--> LOCAL
    SW <--> LOCAL
    ROUT <--> DIAG
    DIAG -- 连接成功 --> CLOUDDD
    DIAG -- 连接超时或离线 --> LOCAL_DB
    
    class UI,LOCAL client;
    class SW pwa;
    class ROUT,DIAG,LOCAL_DB server;
    class CLOUDDD db;
```

### 1.2 系统功能思维脑图 (System Feature Mindmap)

通过直观的思维脑图梳理 K-ON 系统的整体模块与底层自适应交互设计：

```mermaid
mindmap
  root((K-ON 留学生社区))
    技术架构
      React / Vite / TS
      Tailwind CSS 玻璃拟态
      Express.js 后端 API
      Supabase 云数据库
      PWA Service Worker 离线
    核心功能
      7大黄金生活指南
      倒计时与日历日程
      入境助手 D-Day 路线图
      社区论坛交互与置顶
      模拟钱包与电子乘车码
    自适应逻辑
      云端与本地双模切换
      Vite 代理规避 CORS 限制
      Service Worker 离线通知
```

---

## 2. 核心工作流：双模自适应数据库切换

系统在启动或接收客户端请求时，后端的诊断引擎会自动检测与云端数据库的连通性。若云端数据库由于网络波动、证书过期或未配置参数等原因无法访问，系统将以零延迟自动切入“本地备用模式”，查询本地 JSON 数据库 (`fallback_db.json`)，确保前端界面不受干扰，用户体验依然保持丝滑。

```mermaid
sequenceDiagram
    autonumber
    participant Client as K-ON 客户端应用
    participant Server as Express 后端服务器
    participant Diag as 诊断引擎
    participant Supabase as Supabase 云端数据库
    participant Fallback as 本地备用数据库 (fallback_db.json)

    Client->>Server: 发起 HTTP 请求 (例如: GET /api/posts)
    Server->>Diag: 检测数据库连接状态
    
    alt 云端数据库可用 (连接成功)
        Diag->>Supabase: 查询对应数据表
        Supabase-->>Diag: 返回 PostgreSQL 数据记录
        Diag-->>Server: 路由与合并数据
        Server-->>Client: 返回 HTTP 200 JSON 响应 (在线云数据库模式)
    else 云端数据库不可用 (连接超时或离线)
        Diag-->>Server: 返回连接失败 (触发自动备用)
        Server->>Fallback: 查询 fallback_db.json 静态数据或本地内存
        Fallback-->>Server: 返回本地数据记录
        Server-->>Client: 返回 HTTP 200 JSON 响应 (本地备用体验模式)
    end
```

---

## 3. 技术栈细分说明

### 3.1 客户端（Frontend）
*   **Vite + React (SPA)**：采用 Vite 作为构建工具，React 构建单页应用，加载迅速，界面响应即时。
*   **渐进式 Web 应用 (PWA / Service Worker)**：
    *   通过 `sw.js` 实施“网络优先”的资源缓存策略，即便网络中断也能够正常启动应用骨架。
    *   内置 Background Push 事件监听器，接收后台代办事项通知。
*   **Tailwind CSS**：实现高饱和度与玻璃拟态（Glassmorphism）设计，包括卡片悬浮动效、色彩斑斓的图标装饰等。
*   **Lucide React**：为入境助手路线图、日程等功能模块提供统一风格的轻量化矢量图标。

### 3.2 服务端（Backend）
*   **Express.js (TypeScript)**：后端接口服务，默认监听 `5000` 端口。
*   **Vite 反向代理**：在 `vite.config.ts` 中配置反向代理规则，把所有 `/api/*` 请求转发到 Express 后端，从而完全规避跨域限制（CORS）。
*   **业务路由与控制器**：
    *   `/api/posts`：管理社区帖子的发布、喜欢、删除以及置顶。
    *   `/api/reminders`：负责留学生关键倒计时日期的保存、同步与读取。
    *   `/api/wallet`：实现模拟支付流水的划扣、支付宝与微信模拟充值。
    *   `/api/debug`：服务状态健康自检。

### 3.3 数据存储层（Storage）
*   **Supabase (云端 PostgreSQL)**：远程关系型云数据库，建有如下表结构：
    *   `users`：用户账号、密码哈希与身份标签。
    *   `posts` & `comments`：社区论坛的文章 and 评论结构。
    *   `reminders`：用户在日历模块同步的自定义闹钟日程。
    *   `wallet_logs`：存放钱包充值和支付扣款的账单日志。
*   **fallback_db.json (本地备用)**：存放初始 Mock 种子数据的文件，用于在无云端连接时充当后端的数据供应站。
*   **Client localStorage**：客户端本地持久化，用于记录用户当前登录态令牌（token）、语言偏好以及资料修改状态。
