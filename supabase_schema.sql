-- ==========================================
-- 在韩留学生服务与社区 - Supabase 数据库初始化 SQL 脚本
-- 请在 Supabase 控制台的 SQL Editor 中粘贴并执行该脚本以建立数据库结构与初始数据
-- ==========================================

-- 1. 清理现有表（如果存在）
DROP TABLE IF EXISTS wallet_history CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS post_bookmarks CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 2. 创建 profiles (用户资料表)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY, -- 对应实名认证学号 (Student ID) or 注册自动生成的 ID
    username TEXT UNIQUE, -- 自定义登录账号
    password TEXT, -- 登录密码
    phone TEXT UNIQUE, -- 手机号 (可为空)
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    avatar TEXT NOT NULL,
    tag TEXT NOT NULL DEFAULT '认证学生',
    university TEXT NOT NULL DEFAULT '首尔大学',
    major TEXT NOT NULL,
    gender TEXT NOT NULL,
    birthday TEXT NOT NULL,
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 1240.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 posts (动态帖子表)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar TEXT,
    area TEXT NOT NULL DEFAULT '首尔',
    category TEXT NOT NULL, -- e.g. "校园生活", "学习交流", "闲置交易", "问答求助"
    text TEXT NOT NULL,
    image TEXT,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建 comments (帖子评论表)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建 post_likes (帖子点赞记录表)
CREATE TABLE post_likes (
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- 6. 创建 post_bookmarks (帖子收藏记录表)
CREATE TABLE post_bookmarks (
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- 7. 创建 reminders (日程提醒表)
CREATE TABLE reminders (
    id TEXT PRIMARY KEY, -- 可以是前端生成的 rem_visa 或是时间戳
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- 'YYYY-MM-DD'
    time TEXT NOT NULL, -- 'HH:MM'
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建 wallet_history (钱包账单记录表)
CREATE TABLE wallet_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount TEXT NOT NULL, -- '+¥ 100.00' 或 '-¥ 25.05'
    type TEXT NOT NULL, -- 'plus' 或 'minus'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 创建 notifications (通知消息表)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like' 或 'comment'
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    post_text TEXT,
    comment_text TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 插入初始用户张伟的认证数据 (密码默认学号)
INSERT INTO profiles (id, username, password, phone, name, nickname, avatar, tag, university, major, gender, birthday, wallet_balance)
VALUES (
    '202408151229',
    'zhangwei',
    '123456',
    '+821012345678',
    '张伟',
    '张伟 (Zhang Wei)',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea',
    '认证学生',
    '首尔大学',
    '计算机科学与工程',
    '男 (Male)',
    '2002-05-20',
    1240.00
);

-- 10. 插入初始帖子数据 (为保持和前端 ID 匹配，我们可以使用固定的 UUID 或在接口中做映射)
-- 这里我们先为 profiles 里张伟之外的虚拟发帖人注册一个基础 profile 或允许 posts 表直接独立存储名字与头像。
-- 为了支持外键约束，我们先注册几个发帖人的 profile
-- (其他初始用户已移除，数据账号只保留张伟，帖子和评论通过外键指向张伟的 ID '202408151229')

-- 插入帖子 (手动指定 UUID 方便点赞评论的关联)
-- 帖子 1
INSERT INTO posts (id, user_id, username, avatar, area, category, text, image, likes_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '202408151229',
    'Minji Kim',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVZTY92E1qzQ-IFLBkGoLw9KtF6Bn4uph_j-ISf1Xvger9ZYUaPqWye1fVWnsT9FA0SzXIV3i2f5POWoHxJH9ysnF2OFcDtvFSXpZoN2pJ1b1_Och7TS6jQYm19uXCsWmu53buFSkQ3JnDSECzurgl41XtDT-mwUjWRQV_NNxuL09CnQDnunlWafknRnd3uAz7yargRcAXobFm50VYUC8cJDdj4j7GVkuOMPqlz_xc3C4ZmUVmsCbMJSIipjZUiIMPLWvU8C31lf1G',
    '梨大商圈',
    '校园生活',
    '今天在校门口发现了一家超好吃的拌饭店！老板对留学生特别友好，还有专门的中文菜单，推荐给新来的学弟学妹们~ 🍚🍱',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOb4W8aLyR0lKwEnRKnb202qUu6YxWKh8ksAF8Rr1if6XA-ZLhfYl03mHPs7Q_-pQykbrlCUkQtWtXJbFYufadMiWy-TrKtr4BJa1QUeWk5oPHjVjtTwmrUkIVSwNu6CGt5V1emN_ujHu-qb7dLQ-Le5VzPeaaxeR-M1dYcRgH4SfEyEF1zC-nYKc28ZFtsBaesENJ7HShUi0tFtmPQgQy3JzhyVySsCYmL7bi5VhzLtdNLr_gVDZH4o7mabhoKgbCRucl08C76Rd0',
    128
);

-- 帖子 2
INSERT INTO posts (id, user_id, username, avatar, area, category, text, image, likes_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '202408151229',
    'Li Wei',
    '',
    '延大校区',
    '学习交流',
    '求问大家，延世大学附近哪里有比较安静、适合备考的咖啡馆？星光咖啡馆最近人太多了，排不到位置 😭',
    NULL,
    45
);

-- 帖子 3
INSERT INTO posts (id, user_id, username, avatar, area, category, text, image, likes_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '202408151229',
    '新村生活指南',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5VM6jNr3eiQYgbwiL9M9HKBaIBN_Rer3s6IAaemgNiVq8qgc7gCrQrIMhLztIPToLv0owCkl4GIAHck_62PjCToCweyIagqfi_668pIv2jIgmbJp4lZPIFDOir6fTmHHYjrqDc3r10gvjN9b7W55Ul4G2HMHSg5YTm9NMCDbuk6KrXWf4yTuCceeeOt6zc5n7fiAqfqKPqxPbf1F9zx2N4gE2oYr8kUl5pyvYh4kerioTT4PkMNzK79PloE5yKNwB9u1b6i0UgtQY',
    '新村',
    '闲置交易',
    '本周末新村会有大型的创意市集，有很多设计师作品 and 好吃的街头小吃，大家记得去打卡呀！✨',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5VM6jNr3eiQYgbwiL9M9HKBaIBN_Rer3s6IAaemgNiVq8qgc7gCrQrIMhLztIPToLv0owCkl4GIAHck_62PjCToCweyIagqfi_668pIv2jIgmbJp4lZPIFDOir6fTmHHYjrqDc3r10gvjN9b7W55Ul4G2HMHSg5YTm9NMCDbuk6KrXWf4yTuCceeeOt6zc5n7fiAqfqKPqxPbf1F9zx2N4gE2oYr8kUl5pyvYh4kerioTT4PkMNzK79PloE5yKNwB9u1b6i0UgtQY',
    312
);

-- 帖子 4 (张伟发布的帖子)
INSERT INTO posts (id, user_id, username, avatar, area, category, text, image, likes_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '202408151229',
    '张伟',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea',
    '首尔大学',
    '学习交流',
    '终于顺利拿到了首尔大学计算机科学系的奖学金！超级感谢一路上给我解答签证和租房问题的学长学姐们。大家有关于在韩留学生签延期、材料准备的问题也可以随时在下面问我哈 🎓✨ #签证攻略',
    NULL,
    42
);

-- 帖子 5 (张伟发布的另一篇帖子)
INSERT INTO posts (id, user_id, username, avatar, area, category, text, image, likes_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '202408151229',
    '张伟',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea',
    '冠岳校区',
    '校园生活',
    '建大集装箱那边有组团这周末去汉江公园野餐吃炸鸡的吗？目前3男2女，还差两个名额，可以一起聊天玩桌游~ 🍗🥤 #首尔探店',
    NULL,
    18
);

-- 11. 插入评论数据
-- 帖子 1 评论
INSERT INTO comments (post_id, user_id, username, avatar, text, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', '202408151229', '王强', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6kpYYZIDejvv9BWlKsrzLTShCWeBbVGxM_NCmGebzAXxk4vRvI9VIyNUb_TR4qiy6lgC9QvQDDdFhJaY1rg-Qn2j84mOWfWV5lorxUDFq4SP5TABdbR_mhDIoofFGLkSGYOPtYaOn7bqlIV2BVjKHih7pOawOuArwFOQ1XeunGlEmq5S9LrtLjvPFKpHBbns8lPEQZ5x31koaY_a8dHoC225-tLS8_19vjHF6paU4wUsPRozbO2WRT_MEqORgA96z1sffMniTqzwK', '真的吗？能不能分享下具体的店名和地址？好想本周末去试试！', NOW() - INTERVAL '1.5 hours'),
('550e8400-e29b-41d4-a716-446655440001', '202408151229', 'Minji Kim', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVZTY92E1qzQ-IFLBkGoLw9KtF6Bn4uph_j-ISf1Xvger9ZYUaPqWye1fVWnsT9FA0SzXIV3i2f5POWoHxJH9ysnF2OFcDtvFSXpZoN2pJ1b1_Och7TS6jQYm19uXCsWmu53buFSkQ3JnDSECzurgl41XtDT-mwUjWRQV_NNxuL09CnQDnunlWafknRnd3uAz7yargRcAXobFm50VYUC8cJDdj4j7GVkuOMPqlz_xc3C4ZmUVmsCbMJSIipjZUiIMPLWvU8C31lf1G', '就在梨大正门左转第一个巷子里，叫作“奶奶的石锅饭”！', NOW() - INTERVAL '1 hour');

-- 帖子 2 评论
INSERT INTO comments (post_id, user_id, username, avatar, text, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440002', '202408151229', '陈静', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea', '延世大学正门对面往里面走两个街角有一家Study Cafe，隔音特别棒，还有免费手冲咖啡，叫Dreamer Study Room。', NOW() - INTERVAL '4 hours');

-- 帖子 4 评论
INSERT INTO comments (post_id, user_id, username, avatar, text, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440004', '202408151229', '王强', '', '恭喜大佬！首尔大奖学金太强了！能问下GPA要达到多少吗？', NOW() - INTERVAL '12 hours');

-- 12. 插入初始点赞与收藏数据 (使张伟的初始状态和 Mock 完全吻合)
-- 帖子 1 默认被张伟收藏
INSERT INTO post_bookmarks (user_id, post_id) VALUES ('202408151229', '550e8400-e29b-41d4-a716-446655440001');
-- 帖子 2 默认被张伟收藏
INSERT INTO post_bookmarks (user_id, post_id) VALUES ('202408151229', '550e8400-e29b-41d4-a716-446655440002');
-- 帖子 5 默认被张伟收藏
INSERT INTO post_bookmarks (user_id, post_id) VALUES ('202408151229', '550e8400-e29b-41d4-a716-446655440005');

-- 13. 插入初始日程倒计时提醒
INSERT INTO reminders (id, user_id, title, date, time, enabled)
VALUES 
('rem_visa', '202408151229', '在韩签证到期提醒 (留学生签)', '2026-12-15', '23:59', TRUE),
('rem_1', '202408151229', 'TOPIK 考试注册截止', '2026-05-13', '18:00', TRUE),
('rem_2', '202408151229', '学费缴纳截止提醒', '2026-05-16', '14:00', TRUE),
('rem_3', '202408151229', '签证延期HiKorea在线材料提交', '2026-05-06', '10:30', TRUE);

-- 14. 插入钱包初始流水
INSERT INTO wallet_history (user_id, title, amount, type, created_at)
VALUES 
('202408151229', '系统初始赠予', '+¥ 1,000.00', 'plus', '2026-05-20 14:30:00+09'),
('202408151229', '韩元法币极速兑换', '+¥ 300.00', 'plus', '2026-05-21 09:15:00+09'),
('202408151229', '校巴电子乘车码扣款', '-¥ 60.00', 'minus', '2026-05-21 16:40:00+09');
