import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE SETUP
// ============================================================================
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-supabase-project-id") &&
  !supabaseAnonKey.includes("your-key-here");

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function formatTimeDifference(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHr < 24) return `${diffHr}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  return isoString.split("T")[0];
}

function cors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Parse the path after /api/
  const url = req.url || "";
  const pathAfterApi = url.replace(/^\/api/, "").replace(/\?.*$/, "");

  // ── AUTH ──────────────────────────────────────────────────────────────────

  // POST /api/auth/login
  if (pathAfterApi === "/auth/login" && req.method === "POST") {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "请输入账号和密码！" });
    }
    if (!supabase) return res.status(503).json({ error: "数据库未配置，请联系管理员" });
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!profile) return res.status(400).json({ error: "账号或密码错误！" });
    return res.json({ profile, isLoggedIn: true });
  }

  // POST /api/auth/register
  if (pathAfterApi === "/auth/register" && req.method === "POST") {
    const { username, password, name, university, gender, birthday } = req.body || {};
    if (!username || !password || !name || !university || !gender || !birthday) {
      return res.status(400).json({ error: "所有注册信息均不能为空！" });
    }
    if (!supabase) return res.status(503).json({ error: "数据库未配置，请联系管理员" });
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (existingUser) return res.status(400).json({ error: "该账号已存在，请换一个用户名！" });
    const studentId = `stud_${Date.now()}`;
    const newProfile = {
      id: studentId,
      username,
      password,
      phone: null,
      name,
      nickname: `${name} (Student)`,
      avatar: "",
      tag: "认证学生",
      university,
      major: "未指定",
      gender,
      birthday,
    };
    const { data: inserted, error: insertErr } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();
    if (insertErr) return res.status(500).json({ error: insertErr.message });
    return res.json({ profile: inserted, isLoggedIn: true });
  }

  // ── PROFILE ───────────────────────────────────────────────────────────────

  // GET /api/profile
  if (pathAfterApi === "/profile" && req.method === "GET") {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "用户未登录或未指定 userID" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return res.status(400).json({ error: "用户数据加载失败" });
    return res.json(data);
  }

  // POST /api/profile/update
  if (pathAfterApi === "/profile/update" && req.method === "POST") {
    const { userId, nickname, major, gender, birthday, avatar } = req.body || {};
    if (!userId) return res.status(400).json({ error: "用户未登录" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data, error } = await supabase
      .from("profiles")
      .update({ nickname, major, gender, birthday, avatar })
      .eq("id", userId)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, profile: data });
  }

  // ── POSTS ─────────────────────────────────────────────────────────────────

  // GET /api/posts
  if (pathAfterApi === "/posts" && req.method === "GET") {
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const userId = req.query.userId as string;
    const filter = (req.query.filter || "ALL") as string;
    const searchQuery = (req.query.search || "") as string;
    const sortDir = (req.query.sort || "NEWEST") as string;

    const { data: postsRaw, error: postErr } = await supabase
      .from("posts")
      .select("*, comments_count:comments(count)")
      .order("created_at", { ascending: false });
    if (postErr) return res.status(500).json({ error: postErr.message });

    let likedPostIds = new Set<string>();
    let bookmarkedPostIds = new Set<string>();
    if (userId) {
      const { data: likesRaw } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId);
      likesRaw?.forEach((l: any) => likedPostIds.add(l.post_id));
      const { data: bmsRaw } = await supabase
        .from("post_bookmarks")
        .select("post_id")
        .eq("user_id", userId);
      bmsRaw?.forEach((b: any) => bookmarkedPostIds.add(b.post_id));
    }

    let postsList = await Promise.all(
      (postsRaw || []).map(async (p: any) => {
        const { data: commentsRaw } = await supabase!
          .from("comments")
          .select("*")
          .eq("post_id", p.id)
          .order("created_at", { ascending: true });
        const commentsList = commentsRaw?.map((c: any) => ({
          id: c.id,
          username: c.username,
          avatar: c.avatar,
          text: c.text,
          time: formatTimeDifference(c.created_at),
        })) || [];
        return {
          id: p.id,
          username: p.username,
          avatar: p.avatar,
          time: formatTimeDifference(p.created_at),
          area: p.area,
          category: p.category,
          text: p.text,
          image: p.image,
          likes: p.likes_count,
          commentsCount: p.comments_count[0]?.count || 0,
          commentsList,
          hasLiked: likedPostIds.has(p.id),
          isBookmarked: bookmarkedPostIds.has(p.id),
          userId: p.user_id,
        };
      })
    );

    if (filter === "MINE" && userId) {
      const { data: userProfile } = await supabase.from("profiles").select("name").eq("id", userId).single();
      postsList = postsList.filter((p: any) => p.userId === userId);
    } else if (filter === "BOOKMARKED") {
      postsList = postsList.filter((p: any) => p.isBookmarked);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      postsList = postsList.filter((p: any) => p.text?.toLowerCase().includes(q) || p.username?.toLowerCase().includes(q));
    }
    if (sortDir === "POPULAR") {
      postsList.sort((a: any, b: any) => b.likes - a.likes);
    }
    return res.json(postsList);
  }

  // POST /api/posts
  if (pathAfterApi === "/posts" && req.method === "POST") {
    const { userId, username, avatar, category, text, image, area, anonymous } = req.body || {};
    if (!userId || !text) return res.status(400).json({ error: "内容与发帖人信息均不能为空！" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const postAuthor = anonymous ? "匿名校友" : username;
    const postAvatar = anonymous ? "" : avatar;
    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        username: postAuthor,
        avatar: postAvatar,
        category,
        text,
        image: image || null,
        area: area || "首尔",
        likes_count: 0,
      })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    // Fire-and-forget simulated interaction (non-blocking)
    simulateSeedInteraction(supabase, data.id, data.text, data.user_id);
    return res.json({ success: true, post: data });
  }

  // DELETE /api/posts/:id
  const deletePostMatch = pathAfterApi.match(/^\/posts\/([^/]+)$/);
  if (deletePostMatch && req.method === "DELETE") {
    const postId = deletePostMatch[1];
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "用户未登录，无法删除帖子！" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { error } = await supabase.from("posts").delete().eq("id", postId).eq("user_id", userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // POST /api/posts/:id/like
  const likeMatch = pathAfterApi.match(/^\/posts\/([^/]+)\/like$/);
  if (likeMatch && req.method === "POST") {
    const postId = likeMatch[1];
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "用户未登录" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data: existingLike } = await supabase
      .from("post_likes").select("*").eq("user_id", userId).eq("post_id", postId).maybeSingle();
    const isLiking = !existingLike;
    if (isLiking) {
      await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
      const { data: postData } = await supabase.from("posts").select("likes_count, user_id, text").eq("id", postId).single();
      await supabase.from("posts").update({ likes_count: (postData?.likes_count || 0) + 1 }).eq("id", postId);
      if (postData?.user_id && postData.user_id !== userId) {
        const { data: profileData } = await supabase.from("profiles").select("name, avatar").eq("id", userId).single();
        await supabase.from("notifications").insert({
          user_id: postData.user_id, type: "like",
          sender_name: profileData?.name || "有人",
          sender_avatar: profileData?.avatar || "",
          post_id: postId, post_text: (postData.text || "").slice(0, 40), is_read: false,
        });
      }
    } else {
      await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
      const { data: postData } = await supabase.from("posts").select("likes_count").eq("id", postId).single();
      await supabase.from("posts").update({ likes_count: Math.max(0, (postData?.likes_count || 0) - 1) }).eq("id", postId);
    }
    return res.json({ success: true, hasLiked: isLiking });
  }

  // POST /api/posts/:id/bookmark
  const bookmarkMatch = pathAfterApi.match(/^\/posts\/([^/]+)\/bookmark$/);
  if (bookmarkMatch && req.method === "POST") {
    const postId = bookmarkMatch[1];
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "用户未登录" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data: existingBM } = await supabase
      .from("post_bookmarks").select("*").eq("user_id", userId).eq("post_id", postId).maybeSingle();
    const isBookmarking = !existingBM;
    if (isBookmarking) {
      await supabase.from("post_bookmarks").insert({ user_id: userId, post_id: postId });
    } else {
      await supabase.from("post_bookmarks").delete().eq("user_id", userId).eq("post_id", postId);
    }
    return res.json({ success: true, isBookmarked: isBookmarking });
  }

  // POST /api/posts/:id/comments
  const commentMatch = pathAfterApi.match(/^\/posts\/([^/]+)\/comments$/);
  if (commentMatch && req.method === "POST") {
    const postId = commentMatch[1];
    const { userId, username, avatar, text } = req.body || {};
    if (!userId || !text) return res.status(400).json({ error: "内容与评论人不能为空" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: userId, username, avatar, text })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    const { data: postDetail } = await supabase.from("posts").select("user_id, text").eq("id", postId).single();
    if (postDetail?.user_id && postDetail.user_id !== userId) {
      await supabase.from("notifications").insert({
        user_id: postDetail.user_id, type: "comment",
        sender_name: username || "有人", sender_avatar: avatar || "",
        post_id: postId, post_text: (postDetail.text || "").slice(0, 40),
        comment_text: (text || "").slice(0, 60), is_read: false,
      });
    }
    return res.json({ success: true, comment: { id: data.id, username: data.username, avatar: data.avatar, text: data.text, time: "刚刚" } });
  }

  // ── REMINDERS ─────────────────────────────────────────────────────────────

  // GET /api/reminders
  if (pathAfterApi === "/reminders" && req.method === "GET") {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "userId required" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data, error } = await supabase.from("reminders").select("*").eq("user_id", userId).order("date", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST /api/reminders
  if (pathAfterApi === "/reminders" && req.method === "POST") {
    const { userId, id, title, date, time, enabled } = req.body || {};
    if (!userId || !title || !date) return res.status(400).json({ error: "日历标题及日期不能为空" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const reminderId = id || `rem_${Date.now()}`;
    const { data, error } = await supabase
      .from("reminders")
      .insert({ id: reminderId, user_id: userId, title, date, time: time || "12:00", enabled: enabled ?? true })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, reminder: data });
  }

  // DELETE /api/reminders/:id
  const deleteReminderMatch = pathAfterApi.match(/^\/reminders\/([^/]+)$/);
  if (deleteReminderMatch && req.method === "DELETE") {
    const remId = deleteReminderMatch[1];
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { error } = await supabase.from("reminders").delete().eq("id", remId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────

  // GET /api/notifications
  if (pathAfterApi === "/notifications" && req.method === "GET") {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "userId required" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { data, error } = await supabase
      .from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data.map((n: any) => ({
      id: n.id, userId: n.user_id, type: n.type,
      senderName: n.sender_name, senderAvatar: n.sender_avatar,
      postId: n.post_id, postText: n.post_text, commentText: n.comment_text,
      isRead: n.is_read, time: formatTimeDifference(n.created_at), createdAt: n.created_at,
    })));
  }

  // POST /api/notifications/read-all
  if (pathAfterApi === "/notifications/read-all" && req.method === "POST") {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // POST /api/notifications/clear-all
  if (pathAfterApi === "/notifications/clear-all" && req.method === "POST") {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { error } = await supabase.from("notifications").delete().eq("user_id", userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // POST /api/notifications/:id/read
  const notifReadMatch = pathAfterApi.match(/^\/notifications\/([^/]+)\/read$/);
  if (notifReadMatch && req.method === "POST") {
    const notifId = notifReadMatch[1];
    if (!supabase) return res.status(503).json({ error: "数据库未配置" });
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notifId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // ── DEFAULT ───────────────────────────────────────────────────────────────
  return res.status(404).json({ error: `API route not found: ${req.method} ${pathAfterApi}` });
}

// ============================================================================
// SEED INTERACTION SIMULATION (fire-and-forget, best-effort)
// ============================================================================
function simulateSeedInteraction(
  sb: SupabaseClient,
  postId: string,
  postText: string,
  postOwnerId: string
) {
  const seeds = [
    { name: "Minji Kim (김민지)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { name: "박서준 (Park Seo-jun)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { name: "Li Wei (李伟)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
  ];
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  const commentsPool = [
    "太有用了，感谢分享！🙌 在韩国就需要这种指南！",
    "我也在纠结这个问题，学长解答得太及时了！",
    "哇，这个信息太棒了，收藏了！✨",
    "Great post! Thanks for sharing this useful guide. 👍",
    "진짜 유용한 정보네요! 공유해주셔서 감사합니다~ 😊",
  ];
  const commentText = commentsPool[Math.floor(Math.random() * commentsPool.length)];

  // Like after 5s
  setTimeout(async () => {
    try {
      const { data: existingLike } = await sb.from("post_likes").select("*")
        .eq("user_id", `seed_${seed.name}`).eq("post_id", postId).maybeSingle();
      if (!existingLike) {
        await sb.from("post_likes").insert({ user_id: `seed_${seed.name}`, post_id: postId });
        const { data: postData } = await sb.from("posts").select("likes_count").eq("id", postId).single();
        await sb.from("posts").update({ likes_count: (postData?.likes_count || 0) + 1 }).eq("id", postId);
        await sb.from("notifications").insert({
          user_id: postOwnerId, type: "like",
          sender_name: seed.name, sender_avatar: seed.avatar,
          post_id: postId, post_text: (postText || "").slice(0, 40), is_read: false,
        });
      }
    } catch { /* best-effort */ }
  }, 5000);

  // Comment after 8s
  setTimeout(async () => {
    try {
      await sb.from("comments").insert({
        post_id: postId, user_id: `seed_${seed.name}`,
        username: seed.name, avatar: seed.avatar, text: commentText,
      });
      await sb.from("notifications").insert({
        user_id: postOwnerId, type: "comment",
        sender_name: seed.name, sender_avatar: seed.avatar,
        post_id: postId, post_text: (postText || "").slice(0, 40),
        comment_text: commentText, is_read: false,
      });
    } catch { /* best-effort */ }
  }, 8000);
}
