/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const { createClient } = require("@supabase/supabase-js");

// ── Supabase ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "";

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY ||
      SUPABASE_URL.includes("your-supabase-project-id") ||
      SUPABASE_KEY.includes("your-key-here")) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const s = Math.floor(d / 1000), m = Math.floor(s / 60),
        h = Math.floor(m / 60), day = Math.floor(h / 24);
  if (s < 60) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  if (h < 24) return `${h}小时前`;
  if (day < 7) return `${day}天前`;
  return iso.split("T")[0];
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const sb = getSupabase();

  // Debug endpoint – visit /api/debug to check env vars
  const rawUrl = req.url || "";
  const path = rawUrl.replace(/^\/api/, "").split("?")[0];
  const method = (req.method || "GET").toUpperCase();

  if (path === "/debug") {
    return res.json({
      supabaseConfigured: !!sb,
      urlSet: !!SUPABASE_URL,
      keySet: !!SUPABASE_KEY,
      urlPrefix: SUPABASE_URL.slice(0, 30) || "(empty)"
    });
  }

  if (!sb) {
    return res.status(503).json({
      error: "数据库未配置：请在 Vercel Dashboard → Settings → Environment Variables 中添加 SUPABASE_URL 和 SUPABASE_ANON_KEY"
    });
  }

  try {
    // ── POST /auth/login ──────────────────────────────────────────────────
    if (path === "/auth/login" && method === "POST") {
      const { username, password } = req.body || {};
      if (!username || !password)
        return res.status(400).json({ error: "请输入账号和密码！" });

      const { data: profile, error } = await sb
        .from("profiles").select("*")
        .eq("username", username).eq("password", password).maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!profile) return res.status(400).json({ error: "账号或密码错误！" });
      return res.json({ profile, isLoggedIn: true });
    }

    // ── POST /auth/register ───────────────────────────────────────────────
    if (path === "/auth/register" && method === "POST") {
      const { username, password, name, university, gender, birthday } = req.body || {};
      if (!username || !password || !name || !university || !gender || !birthday)
        return res.status(400).json({ error: "所有注册信息均不能为空！" });

      const { data: existing } = await sb
        .from("profiles").select("id").eq("username", username).maybeSingle();
      if (existing) return res.status(400).json({ error: "该账号已存在，请换一个用户名！" });

      const newProfile = {
        id: `stud_${Date.now()}`,
        username, password, phone: null, name,
        nickname: `${name} (Student)`,
        avatar: "", tag: "认证学生",
        university, major: "未指定", gender, birthday
      };
      const { data: inserted, error: ie } = await sb
        .from("profiles").insert(newProfile).select().single();
      if (ie) return res.status(500).json({ error: ie.message });
      return res.json({ profile: inserted, isLoggedIn: true });
    }

    // ── GET /profile ──────────────────────────────────────────────────────
    if (path === "/profile" && method === "GET") {
      const userId = (req.query || {}).userId;
      if (!userId) return res.status(400).json({ error: "用户未登录或未指定 userID" });
      const { data, error } = await sb
        .from("profiles").select("*").eq("id", userId).single();
      if (error) return res.status(400).json({ error: "用户数据加载失败" });
      return res.json(data);
    }

    // ── POST /profile/update ──────────────────────────────────────────────
    if (path === "/profile/update" && method === "POST") {
      const { userId, nickname, major, gender, birthday, avatar } = req.body || {};
      if (!userId) return res.status(400).json({ error: "用户未登录" });
      const { data, error } = await sb
        .from("profiles")
        .update({ nickname, major, gender, birthday, avatar })
        .eq("id", userId).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, profile: data });
    }

    // ── GET /posts ────────────────────────────────────────────────────────
    if (path === "/posts" && method === "GET") {
      const q = req.query || {};
      const userId = q.userId;
      const filter = q.filter || "ALL";
      const searchQuery = q.search || "";
      const sortDir = q.sort || "NEWEST";

      const { data: postsRaw, error: pe } = await sb
        .from("posts")
        .select("*, comments_count:comments(count)")
        .order("created_at", { ascending: false });
      if (pe) return res.status(500).json({ error: pe.message });

      const likedIds = new Set();
      const bookmarkedIds = new Set();
      if (userId) {
        const { data: lk } = await sb.from("post_likes").select("post_id").eq("user_id", userId);
        (lk || []).forEach(function(l) { likedIds.add(l.post_id); });
        const { data: bk } = await sb.from("post_bookmarks").select("post_id").eq("user_id", userId);
        (bk || []).forEach(function(b) { bookmarkedIds.add(b.post_id); });
      }

      let postsList = await Promise.all((postsRaw || []).map(async function(p) {
        const { data: cr } = await sb
          .from("comments").select("*").eq("post_id", p.id).order("created_at", { ascending: true });
        const commentsList = (cr || []).map(function(c) {
          return { id: c.id, username: c.username, avatar: c.avatar, text: c.text, time: formatTime(c.created_at) };
        });
        return {
          id: p.id, username: p.username, avatar: p.avatar,
          time: formatTime(p.created_at),
          area: p.area, category: p.category, text: p.text, image: p.image,
          likes: p.likes_count,
          commentsCount: ((p.comments_count || [])[0] || {}).count || 0,
          commentsList,
          hasLiked: likedIds.has(p.id),
          isBookmarked: bookmarkedIds.has(p.id),
          userId: p.user_id
        };
      }));

      if (filter === "MINE" && userId) {
        postsList = postsList.filter(function(p) { return p.userId === userId; });
      } else if (filter === "BOOKMARKED") {
        postsList = postsList.filter(function(p) { return p.isBookmarked; });
      }
      if (searchQuery.trim()) {
        var sq = searchQuery.toLowerCase();
        postsList = postsList.filter(function(p) {
          return (p.text || "").toLowerCase().includes(sq) || (p.username || "").toLowerCase().includes(sq);
        });
      }
      if (sortDir === "POPULAR") postsList.sort(function(a, b) { return b.likes - a.likes; });
      return res.json(postsList);
    }

    // ── POST /posts ───────────────────────────────────────────────────────
    if (path === "/posts" && method === "POST") {
      const { userId, username, avatar, category, text, image, area, anonymous } = req.body || {};
      if (!userId || !text) return res.status(400).json({ error: "内容与发帖人信息均不能为空！" });
      const { data, error } = await sb.from("posts").insert({
        user_id: userId,
        username: anonymous ? "匿名校友" : username,
        avatar: anonymous ? "" : avatar,
        category, text, image: image || null,
        area: area || "首尔", likes_count: 0
      }).select().single();
      if (error) return res.status(500).json({ error: error.message });
      simulateSeed(data.id, data.text, data.user_id);
      return res.json({ success: true, post: data });
    }

    // ── DELETE /posts/:id ─────────────────────────────────────────────────
    var deletePostMatch = path.match(/^\/posts\/([^/]+)$/);
    if (deletePostMatch && method === "DELETE") {
      var postId = deletePostMatch[1];
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "用户未登录，无法删除帖子！" });
      const { error } = await sb.from("posts").delete().eq("id", postId).eq("user_id", userId);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    // ── POST /posts/:id/like ──────────────────────────────────────────────
    var likeMatch = path.match(/^\/posts\/([^/]+)\/like$/);
    if (likeMatch && method === "POST") {
      var postId = likeMatch[1];
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "用户未登录" });
      const { data: el } = await sb.from("post_likes").select("*")
        .eq("user_id", userId).eq("post_id", postId).maybeSingle();
      const isLiking = !el;
      if (isLiking) {
        await sb.from("post_likes").insert({ user_id: userId, post_id: postId });
        const { data: pd } = await sb.from("posts").select("likes_count,user_id,text").eq("id", postId).single();
        await sb.from("posts").update({ likes_count: ((pd && pd.likes_count) || 0) + 1 }).eq("id", postId);
        if (pd && pd.user_id && pd.user_id !== userId) {
          const { data: pr } = await sb.from("profiles").select("name,avatar").eq("id", userId).single();
          await sb.from("notifications").insert({
            user_id: pd.user_id, type: "like",
            sender_name: pr ? pr.name : "有人",
            sender_avatar: pr ? pr.avatar : "",
            post_id: postId, post_text: (pd.text || "").slice(0, 40), is_read: false
          });
        }
      } else {
        await sb.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
        const { data: pd } = await sb.from("posts").select("likes_count").eq("id", postId).single();
        await sb.from("posts").update({ likes_count: Math.max(0, ((pd && pd.likes_count) || 1) - 1) }).eq("id", postId);
      }
      return res.json({ success: true, hasLiked: isLiking });
    }

    // ── POST /posts/:id/bookmark ──────────────────────────────────────────
    var bookmarkMatch = path.match(/^\/posts\/([^/]+)\/bookmark$/);
    if (bookmarkMatch && method === "POST") {
      var postId = bookmarkMatch[1];
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "用户未登录" });
      const { data: eb } = await sb.from("post_bookmarks").select("*")
        .eq("user_id", userId).eq("post_id", postId).maybeSingle();
      const isBM = !eb;
      if (isBM) {
        await sb.from("post_bookmarks").insert({ user_id: userId, post_id: postId });
      } else {
        await sb.from("post_bookmarks").delete().eq("user_id", userId).eq("post_id", postId);
      }
      return res.json({ success: true, isBookmarked: isBM });
    }

    // ── POST /posts/:id/comments ──────────────────────────────────────────
    var commentMatch = path.match(/^\/posts\/([^/]+)\/comments$/);
    if (commentMatch && method === "POST") {
      var postId = commentMatch[1];
      const { userId, username, avatar, text } = req.body || {};
      if (!userId || !text) return res.status(400).json({ error: "内容与评论人不能为空" });
      const { data, error } = await sb.from("comments")
        .insert({ post_id: postId, user_id: userId, username, avatar, text })
        .select().single();
      if (error) return res.status(500).json({ error: error.message });
      const { data: pd } = await sb.from("posts").select("user_id,text").eq("id", postId).single();
      if (pd && pd.user_id && pd.user_id !== userId) {
        await sb.from("notifications").insert({
          user_id: pd.user_id, type: "comment",
          sender_name: username || "有人", sender_avatar: avatar || "",
          post_id: postId, post_text: (pd.text || "").slice(0, 40),
          comment_text: (text || "").slice(0, 60), is_read: false
        });
      }
      return res.json({ success: true, comment: { id: data.id, username: data.username, avatar: data.avatar, text: data.text, time: "刚刚" } });
    }

    // ── GET /reminders ────────────────────────────────────────────────────
    if (path === "/reminders" && method === "GET") {
      const userId = (req.query || {}).userId;
      if (!userId) return res.status(400).json({ error: "userId required" });
      const { data, error } = await sb.from("reminders").select("*").eq("user_id", userId).order("date", { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    }

    // ── POST /reminders ───────────────────────────────────────────────────
    if (path === "/reminders" && method === "POST") {
      const { userId, id, title, date, time, enabled } = req.body || {};
      if (!userId || !title || !date) return res.status(400).json({ error: "日历标题及日期不能为空" });
      const { data, error } = await sb.from("reminders")
        .insert({ id: id || `rem_${Date.now()}`, user_id: userId, title, date, time: time || "12:00", enabled: enabled !== false })
        .select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, reminder: data });
    }

    // ── DELETE /reminders/:id ─────────────────────────────────────────────
    var delRemMatch = path.match(/^\/reminders\/([^/]+)$/);
    if (delRemMatch && method === "DELETE") {
      const { error } = await sb.from("reminders").delete().eq("id", delRemMatch[1]);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    // ── GET /notifications ────────────────────────────────────────────────
    if (path === "/notifications" && method === "GET") {
      const userId = (req.query || {}).userId;
      if (!userId) return res.status(400).json({ error: "userId required" });
      const { data, error } = await sb.from("notifications")
        .select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json((data || []).map(function(n) {
        return {
          id: n.id, userId: n.user_id, type: n.type,
          senderName: n.sender_name, senderAvatar: n.sender_avatar,
          postId: n.post_id, postText: n.post_text, commentText: n.comment_text,
          isRead: n.is_read, time: formatTime(n.created_at), createdAt: n.created_at
        };
      }));
    }

    // ── POST /notifications/read-all ──────────────────────────────────────
    if (path === "/notifications/read-all" && method === "POST") {
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "userId required" });
      const { error } = await sb.from("notifications").update({ is_read: true }).eq("user_id", userId);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    // ── POST /notifications/clear-all ─────────────────────────────────────
    if (path === "/notifications/clear-all" && method === "POST") {
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "userId required" });
      const { error } = await sb.from("notifications").delete().eq("user_id", userId);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    // ── POST /notifications/:id/read ──────────────────────────────────────
    var nrMatch = path.match(/^\/notifications\/([^/]+)\/read$/);
    if (nrMatch && method === "POST") {
      const { error } = await sb.from("notifications").update({ is_read: true }).eq("id", nrMatch[1]);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    return res.status(404).json({ error: `API not found: ${method} ${path}` });

  } catch (err) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ── Seed interaction simulation (fire-and-forget) ─────────────────────────────
function simulateSeed(postId, postText, ownerId) {
  var seeds = [
    { name: "Minji Kim (김민지)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { name: "박서준", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { name: "Li Wei (李伟)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" }
  ];
  var seed = seeds[Math.floor(Math.random() * seeds.length)];
  var comments = [
    "太有用了，感谢分享！🙌", "Great post! Thanks! 👍",
    "진짜 유용한 정보네요! 😊", "哇，收藏了！✨"
  ];
  var commentText = comments[Math.floor(Math.random() * comments.length)];
  var sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  setTimeout(async function() {
    try {
      var seedId = "seed_" + seed.name;
      var el = await sb.from("post_likes").select("*").eq("user_id", seedId).eq("post_id", postId).maybeSingle();
      if (!el.data) {
        await sb.from("post_likes").insert({ user_id: seedId, post_id: postId });
        var pd = await sb.from("posts").select("likes_count").eq("id", postId).single();
        await sb.from("posts").update({ likes_count: ((pd.data && pd.data.likes_count) || 0) + 1 }).eq("id", postId);
        await sb.from("notifications").insert({
          user_id: ownerId, type: "like",
          sender_name: seed.name, sender_avatar: seed.avatar,
          post_id: postId, post_text: (postText || "").slice(0, 40), is_read: false
        });
      }
    } catch(e) {}
  }, 6000);

  setTimeout(async function() {
    try {
      await sb.from("comments").insert({
        post_id: postId, user_id: "seed_" + seed.name,
        username: seed.name, avatar: seed.avatar, text: commentText
      });
      await sb.from("notifications").insert({
        user_id: ownerId, type: "comment",
        sender_name: seed.name, sender_avatar: seed.avatar,
        post_id: postId, post_text: (postText || "").slice(0, 40),
        comment_text: commentText, is_read: false
      });
    } catch(e) {}
  }, 10000);
}
