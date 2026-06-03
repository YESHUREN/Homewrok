import express from "express";
import dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-supabase-project-id") && 
  !supabaseAnonKey.includes("your-key-here");

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  console.log("🚀 Supabase is configured! Connecting to database...");
  const tempSupabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    // Try to perform a simple read to check if RLS or permissions are broken
    const { error } = await tempSupabase.from("profiles").select("id").limit(1);
    if (error) {
      throw error;
    }
    console.log("✅ Supabase connection verified successfully! Using real cloud database.");
    supabase = tempSupabase;
  } catch (err: any) {
    console.warn("⚠️  [WARNING] Supabase connection test failed:", err.message || err);
    console.warn("⚠️  The backend server will run in PERSISTENT LOCAL-JSON mode.");
    console.warn("👉 All database operations will be saved locally to 'fallback_db.json'.");
    supabase = null;
  }
} else {
  console.warn("⚠️  [WARNING] Supabase is NOT configured or is using placeholder credentials.");
  console.warn("⚠️  The backend server will run in MEMORY-FALLBACK mode.");
  console.warn("⚠️  All changes will be lost when the server restarts.");
  console.warn("👉 To use database storage, please update '.env' with your real SUPABASE_URL and SUPABASE_ANON_KEY.");
}

// ============================================================================
// IN-MEMORY DATABASE FALLBACK STATE (Matches SQL mock data exactly)
// ============================================================================
let fallbackProfiles = [
  {
    id: "202408151229",
    username: "zhangwei",
    password: "123456",
    phone: "+821012345678",
    name: "张伟",
    nickname: "张伟 (Zhang Wei)",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea",
    tag: "认证学生",
    university: "首尔大学",
    major: "计算机科学与工程",
    gender: "男 (Male)",
    birthday: "2002-05-20"
  }
];

let fallbackPosts: any[] = [];

let fallbackComments: any[] = [];

let fallbackLikes: any[] = [];

let fallbackBookmarks: any[] = [];

let fallbackNotifications: any[] = [];

let fallbackReminders: any[] = [];

// Removed wallet history fallbacks

// Local File Persistence for Memory Fallback Mode
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "fallback_db.json");

function saveFallbackDb() {
  try {
    const data = {
      fallbackProfiles,
      fallbackPosts,
      fallbackComments,
      fallbackLikes,
      fallbackBookmarks,
      fallbackNotifications,
      fallbackReminders
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save fallback database file:", err);
  }
}

function loadFallbackDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf8");
      const data = JSON.parse(content);
      if (data.fallbackProfiles) fallbackProfiles = data.fallbackProfiles;
      if (data.fallbackPosts) fallbackPosts = data.fallbackPosts;
      if (data.fallbackComments) fallbackComments = data.fallbackComments;
      if (data.fallbackLikes) fallbackLikes = data.fallbackLikes;
      if (data.fallbackBookmarks) fallbackBookmarks = data.fallbackBookmarks;
      if (data.fallbackNotifications) fallbackNotifications = data.fallbackNotifications;
      if (data.fallbackReminders) fallbackReminders = data.fallbackReminders;
      console.log("💾 Loaded persisted memory-fallback database successfully!");
    } else {
      saveFallbackDb();
    }
  } catch (err) {
    console.error("Failed to load fallback database file:", err);
  }
}

// Immediately load persisted database
loadFallbackDb();

// Helper to format timestamps dynamically
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

// 0. DB Diagnostics check
app.get("/api/debug", async (req, res) => {
  try {
    if (supabase) {
      const { data: profiles, error: readErr } = await supabase
        .from("profiles")
        .select("username")
        .limit(100);

      if (readErr) {
        return res.json({
          supabaseConfigured: true,
          dbReadOK: false,
          dbWriteOK: false,
          dbReadError: readErr.message,
          dbWriteError: "Read failed, write skipped",
          existingAccounts: []
        });
      }

      const existingAccounts = profiles ? profiles.map((p: any) => p.username) : [];
      return res.json({
        supabaseConfigured: true,
        dbReadOK: true,
        dbWriteOK: true,
        dbReadError: null,
        dbWriteError: null,
        existingAccounts
      });
    } else {
      const existingAccounts = fallbackProfiles.map(p => p.username);
      return res.json({
        supabaseConfigured: false,
        dbReadOK: false,
        dbWriteOK: false,
        dbReadError: "Supabase not configured on backend",
        dbWriteError: "Supabase not configured on backend",
        existingAccounts
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 1. Auth: Account/Password Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "请输入账号和密码！" });
  }

  try {
    if (supabase) {
      // Supabase Query
      let { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!profile) {
        return res.status(400).json({ error: "账号或密码错误！" });
      }

      return res.json({ profile, isLoggedIn: true });
    } else {
      // Memory Fallback Query
      let profile = fallbackProfiles.find(p => p.username === username && p.password === password);
      if (!profile) {
        return res.status(400).json({ error: "账号或密码错误！" });
      }
      return res.json({ profile, isLoggedIn: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 1.1 Auth: Account/Password Registration
app.post("/api/auth/register", async (req, res) => {
  const { username, password, name, university, gender, birthday } = req.body;
  if (!username || !password || !name || !university || !gender || !birthday) {
    return res.status(400).json({ error: "所有注册信息均不能为空！" });
  }

  try {
    const studentId = `stud_${Date.now()}`;
    const newNickname = `${name} (Student)`;
    const newProfile = {
      id: studentId,
      username,
      password,
      phone: null,
      name,
      nickname: newNickname,
      avatar: "",
      tag: "认证学生",
      university,
      major: "未指定",
      gender,
      birthday
    };

    if (supabase) {
      // Check if username already exists in Supabase
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: "该账号已存在，请换一个用户名！" });
      }

      const { data: inserted, error: insertErr } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (insertErr) return res.status(500).json({ error: insertErr.message });

      return res.json({ profile: inserted, isLoggedIn: true });
    } else {
      // Memory Fallback
      const existing = fallbackProfiles.find(p => p.username === username);
      if (existing) {
        return res.status(400).json({ error: "该账号已存在，请换一个用户名！" });
      }

      fallbackProfiles.push(newProfile);

      saveFallbackDb();

      return res.json({ profile: newProfile, isLoggedIn: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. Profile: Fetch user details
app.get("/api/profile", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "用户未登录或未指定 userID" });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) return res.status(400).json({ error: "用户数据加载失败" });
      return res.json(data);
    } else {
      const profile = fallbackProfiles.find(p => p.id === userId);
      if (!profile) return res.status(404).json({ error: "用户不存在" });
      return res.json(profile);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Profile: Update profile details
app.post("/api/profile/update", async (req, res) => {
  const { userId, nickname, major, gender, birthday, avatar } = req.body;
  if (!userId) return res.status(400).json({ error: "用户未登录" });

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ nickname, major, gender, birthday, avatar })
        .eq("id", userId)
        .select()
        .single();
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, profile: data });
    } else {
      const profile = fallbackProfiles.find(p => p.id === userId);
      if (!profile) return res.status(404).json({ error: "用户档案不存在" });
      
      profile.nickname = nickname;
      profile.major = major;
      profile.gender = gender;
      profile.birthday = birthday;
      if (avatar !== undefined) {
        profile.avatar = avatar;
      }

      saveFallbackDb();

      return res.json({ success: true, profile });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});



// 7. Posts: Retrieve posts with filter options and joined states
app.get("/api/posts", async (req, res) => {
  const userId = req.query.userId as string;
  const filter = (req.query.filter || "ALL") as "ALL" | "MINE" | "BOOKMARKED";
  const searchQuery = (req.query.search || "") as string;
  const sortDir = (req.query.sort || "NEWEST") as "NEWEST" | "POPULAR";

  try {
    let postsList: any[] = [];

    if (supabase) {
      // 1. Fetch raw posts and count comments
      const { data: postsRaw, error: postErr } = await supabase
        .from("posts")
        .select(`
          *,
          comments_count:comments(count)
        `)
        .order("created_at", { ascending: false });

      if (postErr) return res.status(500).json({ error: postErr.message });
      postsList = postsRaw || [];

      // 2. Apply likes and bookmarks markers if userId exists
      let likedPostIds = new Set<string>();
      let bookmarkedPostIds = new Set<string>();

      if (userId) {
        const { data: likesRaw } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", userId);
        
        likesRaw?.forEach(l => likedPostIds.add(l.post_id));

        const { data: bmsRaw } = await supabase
          .from("post_bookmarks")
          .select("post_id")
          .eq("user_id", userId);
        
        bmsRaw?.forEach(b => bookmarkedPostIds.add(b.post_id));
      }

      // 3. Construct rich UI post data
      const parsedPosts = await Promise.all(postsList.map(async (p: any) => {
        // Fetch matching comments for expanded display
        const { data: commentsRaw } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", p.id)
          .order("created_at", { ascending: true });

        const commentsList = commentsRaw?.map((c: any) => ({
          id: c.id,
          username: c.username,
          avatar: c.avatar,
          text: c.text,
          time: formatTimeDifference(c.created_at)
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
          commentsList: commentsList,
          hasLiked: likedPostIds.has(p.id),
          isBookmarked: bookmarkedPostIds.has(p.id),
          userId: p.user_id
        };
      }));

      postsList = parsedPosts;
    } else {
      // Memory Fallback Logic
      postsList = fallbackPosts.map(p => {
        const postComments = fallbackComments
          .filter(c => c.post_id === p.id)
          .map(c => ({
            id: c.id,
            username: c.username,
            avatar: c.avatar,
            text: c.text,
            time: formatTimeDifference(c.created_at)
          }));

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
          commentsCount: postComments.length,
          commentsList: postComments,
          hasLiked: userId ? fallbackLikes.some(l => l.user_id === userId && l.post_id === p.id) : false,
          isBookmarked: userId ? fallbackBookmarks.some(b => b.user_id === userId && b.post_id === p.id) : false,
          userId: p.user_id
        };
      });
    }

    // Apply Client filters
    if (filter === "MINE" && userId) {
      // In high-fidelity we map Zhang Wei or actual login user ID
      const userProfile = supabase 
        ? await supabase.from("profiles").select("name").eq("id", userId).single().then(r => r.data)
        : fallbackProfiles.find(pf => pf.id === userId);
      
      const uName = userProfile?.name || "张伟";
      postsList = postsList.filter(p => p.userId === userId || p.username === uName || p.username === "张伟");
    } else if (filter === "BOOKMARKED") {
      postsList = postsList.filter(p => p.isBookmarked);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      postsList = postsList.filter(p => 
        p.text.toLowerCase().includes(q) || 
        p.username.toLowerCase().includes(q)
      );
    }

    if (sortDir === "POPULAR") {
      postsList.sort((a, b) => b.likes - a.likes);
    }

    return res.json(postsList);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 8. Posts: Create a post
app.post("/api/posts", async (req, res) => {
  const { userId, username, avatar, category, text, image, area, anonymous } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ error: "内容与发帖人信息均不能为空！" });
  }

  const postAuthor = anonymous ? "匿名校友" : username;
  const postAvatar = anonymous ? "" : avatar;

  try {
    if (supabase) {
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
          likes_count: 0
        })
        .select()
        .single();
      
      if (error) return res.status(500).json({ error: error.message });
      
      // Trigger simulation after a successful post creation
      simulateSeedInteraction(data.id, data.text, data.user_id);

      return res.json({ success: true, post: data });
    } else {
      const newPost = {
        id: `post_${Date.now()}`,
        user_id: userId,
        username: postAuthor,
        avatar: postAvatar,
        area: area || "首尔",
        category,
        text,
        image: image || null,
        likes_count: 0,
        created_at: new Date().toISOString()
      };

      fallbackPosts.unshift(newPost);
      saveFallbackDb();

      // Trigger simulation after a successful post creation
      simulateSeedInteraction(newPost.id, newPost.text, newPost.user_id);

      return res.json({ success: true, post: newPost });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 8.1 Posts: Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "用户未登录，无法删除帖子！" });
  }

  const isAdmin = userId === "202408151229";

  try {
    if (supabase) {
      let query = supabase.from("posts").delete().eq("id", postId);
      if (!isAdmin) {
        query = query.eq("user_id", userId);
      }
      const { error } = await query;
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    } else {
      const idx = fallbackPosts.findIndex(p => p.id === postId && (isAdmin || p.user_id === userId));
      if (idx !== -1) {
        fallbackPosts.splice(idx, 1);
        saveFallbackDb();
        return res.json({ success: true });
      }
      return res.status(404).json({ error: "帖子不存在或无权删除！" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// 9. Posts: Toggle Like
app.post("/api/posts/:id/like", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "用户未登录" });

  try {
    if (supabase) {
      // 1. Check if liked
      const { data: existingLike, error: chkErr } = await supabase
        .from("post_likes")
        .select("*")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      if (chkErr) return res.status(500).json({ error: chkErr.message });

      const isLiking = !existingLike;

      if (isLiking) {
        // Add Like
        await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
        // Increment post likes_count
        const { data: postData } = await supabase
          .from("posts")
          .select("likes_count, user_id, text")
          .eq("id", postId)
          .single();

        const count = (postData?.likes_count || 0) + 1;
        await supabase.from("posts").update({ likes_count: count }).eq("id", postId);

        // Notification logic
        if (postData && postData.user_id && postData.user_id !== userId) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name, avatar")
            .eq("id", userId)
            .single();

          const senderName = profileData?.name || "有人";
          const senderAvatar = profileData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

          try {
            await supabase.from("notifications").insert({
              user_id: postData.user_id,
              type: "like",
              sender_name: senderName,
              sender_avatar: senderAvatar,
              post_id: postId,
              post_text: postData.text ? postData.text.slice(0, 40) : "",
              is_read: false
            });
          } catch (notifErr) {
            fallbackNotifications.push({
              id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              userId: postData.user_id,
              type: "like",
              senderName,
              senderAvatar,
              postId,
              postText: postData.text ? postData.text.slice(0, 40) : "",
              isRead: false,
              createdAt: new Date().toISOString()
            });
            saveFallbackDb();
          }
        }
      } else {
        // Remove Like
        await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
        // Decrement post likes_count
        const { data: postData } = await supabase
          .from("posts")
          .select("likes_count")
          .eq("id", postId)
          .single();
        
        const count = Math.max(0, (postData?.likes_count || 0) - 1);
        await supabase.from("posts").update({ likes_count: count }).eq("id", postId);
      }

      return res.json({ success: true, hasLiked: isLiking });
    } else {
      const idx = fallbackLikes.findIndex(l => l.user_id === userId && l.post_id === postId);
      const isLiking = idx === -1;

      const post = fallbackPosts.find(p => p.id === postId);

      if (isLiking) {
        fallbackLikes.push({ user_id: userId, post_id: postId });
        if (post) {
          post.likes_count += 1;
          
          // Generate notification locally for fallback DB
          if (post.user_id && post.user_id !== userId) {
            const likerProfile = fallbackProfiles.find(p => p.id === userId);
            fallbackNotifications.push({
              id: `notif_like_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              userId: post.user_id,
              type: "like",
              senderName: likerProfile?.name || "有人",
              senderAvatar: likerProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              postId: postId,
              postText: post.text ? post.text.slice(0, 40) : "",
              isRead: false,
              createdAt: new Date().toISOString()
            });
          }
        }
      } else {
        fallbackLikes.splice(idx, 1);
        if (post) post.likes_count = Math.max(0, post.likes_count - 1);
      }

      saveFallbackDb();

      return res.json({ success: true, hasLiked: isLiking });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 10. Posts: Toggle Bookmark
app.post("/api/posts/:id/bookmark", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "用户未登录" });

  try {
    if (supabase) {
      const { data: existingBM, error: chkErr } = await supabase
        .from("post_bookmarks")
        .select("*")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      if (chkErr) return res.status(500).json({ error: chkErr.message });

      const isBookmarking = !existingBM;

      if (isBookmarking) {
        await supabase.from("post_bookmarks").insert({ user_id: userId, post_id: postId });
      } else {
        await supabase.from("post_bookmarks").delete().eq("user_id", userId).eq("post_id", postId);
      }

      return res.json({ success: true, isBookmarked: isBookmarking });
    } else {
      const idx = fallbackBookmarks.findIndex(b => b.user_id === userId && b.post_id === postId);
      const isBookmarking = idx === -1;

      if (isBookmarking) {
        fallbackBookmarks.push({ user_id: userId, post_id: postId });
      } else {
        fallbackBookmarks.splice(idx, 1);
      }

      saveFallbackDb();

      return res.json({ success: true, isBookmarked: isBookmarking });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 11. Comments: Submit a comment
app.post("/api/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { userId, username, avatar, text } = req.body;
  if (!userId || !text) return res.status(400).json({ error: "内容与评论人不能为空" });

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: userId,
          username,
          avatar,
          text
        })
        .select()
        .single();
      
      if (error) return res.status(500).json({ error: error.message });

      // Fetch post author details for comment notification
      const { data: postDetail } = await supabase
        .from("posts")
        .select("user_id, text")
        .eq("id", postId)
        .single();

      if (postDetail && postDetail.user_id && postDetail.user_id !== userId) {
        try {
          await supabase.from("notifications").insert({
            user_id: postDetail.user_id,
            type: "comment",
            sender_name: username || "有人",
            sender_avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            post_id: postId,
            post_text: postDetail.text ? postDetail.text.slice(0, 40) : "",
            comment_text: text ? text.slice(0, 60) : "",
            is_read: false
          });
        } catch (notifErr) {
          fallbackNotifications.push({
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: postDetail.user_id,
            type: "comment",
            senderName: username || "有人",
            senderAvatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            postId,
            postText: postDetail.text ? postDetail.text.slice(0, 40) : "",
            commentText: text ? text.slice(0, 60) : "",
            isRead: false,
            createdAt: new Date().toISOString()
          });
          saveFallbackDb();
        }
      }
      
      const formatted = {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        text: data.text,
        time: "刚刚"
      };

      return res.json({ success: true, comment: formatted });
    } else {
      const newComment = {
        id: `comment_${Date.now()}`,
        post_id: postId,
        user_id: userId,
        username,
        avatar,
        text,
        created_at: new Date().toISOString()
      };

      fallbackComments.push(newComment);

      // Local comment notification
      const post = fallbackPosts.find(p => p.id === postId);
      if (post && post.user_id && post.user_id !== userId) {
        fallbackNotifications.push({
          id: `notif_${Date.now()}`,
          userId: post.user_id,
          type: "comment",
          senderName: username || "有人",
          senderAvatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          postId: postId,
          postText: post.text ? post.text.slice(0, 40) : "",
          commentText: text ? text.slice(0, 60) : "",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      saveFallbackDb();

      const formatted = {
        id: newComment.id,
        username: newComment.username,
        avatar: newComment.avatar,
        text: newComment.text,
        time: "刚刚"
      };

      return res.json({ success: true, comment: formatted });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 12. Comments: Delete a comment
app.delete("/api/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "用户未登录，无法删除评论！" });
  }

  const isAdmin = userId === "202408151229";

  try {
    if (supabase) {
      let query = supabase.from("comments").delete().eq("id", commentId);
      if (!isAdmin) {
        query = query.eq("user_id", userId);
      }
      const { error } = await query;
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    } else {
      const idx = fallbackComments.findIndex(c => c.id === commentId && (isAdmin || c.user_id === userId));
      if (idx !== -1) {
        fallbackComments.splice(idx, 1);
        saveFallbackDb();
        return res.json({ success: true });
      }
      return res.status(404).json({ error: "评论不存在或无权删除！" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 12. Calendar: Get Reminders
app.get("/api/reminders", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    } else {
      const reminders = fallbackReminders.filter(r => r.user_id === userId);
      return res.json(reminders);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 13. Calendar: Save Reminder
app.post("/api/reminders", async (req, res) => {
  const { userId, id, title, date, time, enabled } = req.body;
  if (!userId || !title || !date) {
    return res.status(400).json({ error: "日历标题及日期不能为空" });
  }

  const reminderId = id || `rem_${Date.now()}`;

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("reminders")
        .insert({
          id: reminderId,
          user_id: userId,
          title,
          date,
          time: time || "12:00",
          enabled: enabled ?? true
        })
        .select()
        .single();
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, reminder: data });
    } else {
      const newRem = {
        id: reminderId,
        user_id: userId,
        title,
        date,
        time: time || "12:00",
        enabled: enabled ?? true
      };

      fallbackReminders.push(newRem);
      saveFallbackDb();
      return res.json({ success: true, reminder: newRem });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 14. Calendar: Delete Reminder
app.delete("/api/reminders/:id", async (req, res) => {
  const remId = req.params.id;

  try {
    if (supabase) {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", remId);
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    } else {
      const idx = fallbackReminders.findIndex(r => r.id === remId);
      if (idx !== -1) {
        fallbackReminders.splice(idx, 1);
        saveFallbackDb();
      }
      return res.json({ success: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// NOTIFICATIONS API ENDPOINTS & LIVE INTERACTION SIMULATION
// ============================================================================

// Simulated interaction helper to make the community feel alive
function simulateSeedInteraction(postId: string, postText: string, postOwnerId: string) {
  // Wait 5 seconds to simulate another user reading the post
  setTimeout(() => {
    // Choose a random seed user from Korea or China
    const seeds = [
      { name: "Minji Kim (김민지)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      { name: "박서준 (Park Seo-jun)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { name: "Li Wei (李伟)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
      { name: "Sarah Smith (交换生)", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" }
    ];
    const seed = seeds[Math.floor(Math.random() * seeds.length)];

    // Choose random comments pool
    const commentsPool = [
      "太有用了，感谢分享！🙌 在韩国就需要这种指南！",
      "我也在纠结这个问题，学长解答得太及时了！",
      "哇，这个信息太棒了，收藏了！✨",
      "学弟/学妹加油，有什么韩国生活问题随时交流！",
      "赞一个，在韩留学生同舟共济！💖",
      "Great post! Thanks for sharing this useful guide. 👍",
      "진짜 유용한 정보네요! 공유해주셔서 감사합니다~ 😊",
      "한국 생활 꿀팁이네요! 잘 보고 갑니다."
    ];
    const commentText = commentsPool[Math.floor(Math.random() * commentsPool.length)];

    // Perform simulated like in 100ms
    setTimeout(async () => {
      try {
        if (supabase) {
          // Check if already liked (precaution)
          const { data: existingLike } = await supabase
            .from("post_likes")
            .select("*")
            .eq("user_id", `seed_${seed.name}`)
            .eq("post_id", postId)
            .maybeSingle();

          if (!existingLike) {
            await supabase.from("post_likes").insert({ user_id: `seed_${seed.name}`, post_id: postId });
            const { data: postData } = await supabase.from("posts").select("likes_count").eq("id", postId).single();
            const count = (postData?.likes_count || 0) + 1;
            await supabase.from("posts").update({ likes_count: count }).eq("id", postId);
            
            // Insert like notification
            await supabase.from("notifications").insert({
              user_id: postOwnerId,
              type: "like",
              sender_name: seed.name,
              sender_avatar: seed.avatar,
              post_id: postId,
              post_text: postText ? postText.slice(0, 40) : "",
              is_read: false
            });
          }
        } else {
          const post = fallbackPosts.find(p => p.id === postId);
          if (post) {
            post.likes_count += 1;
            fallbackLikes.push({ user_id: `seed_${seed.name}`, post_id: postId });
            fallbackNotifications.push({
              id: `notif_seed_like_${Date.now()}`,
              userId: postOwnerId,
              type: "like",
              senderName: seed.name,
              senderAvatar: seed.avatar,
              postId: postId,
              postText: postText ? postText.slice(0, 40) : "",
              isRead: false,
              createdAt: new Date().toISOString()
            });
            saveFallbackDb();
          }
        }
      } catch (err) {
        console.error("Simulated seed like failed:", err);
      }
    }, 100);

    // Perform simulated comment in 2.5 seconds
    setTimeout(async () => {
      try {
        if (supabase) {
          await supabase.from("comments").insert({
            post_id: postId,
            user_id: `seed_${seed.name}`,
            username: seed.name,
            avatar: seed.avatar,
            text: commentText
          });

          // Insert comment notification
          await supabase.from("notifications").insert({
            user_id: postOwnerId,
            type: "comment",
            sender_name: seed.name,
            sender_avatar: seed.avatar,
            post_id: postId,
            post_text: postText ? postText.slice(0, 40) : "",
            comment_text: commentText,
            is_read: false
          });
        } else {
          const post = fallbackPosts.find(p => p.id === postId);
          if (post) {
            const newComment = {
              id: `comment_seed_${Date.now()}`,
              post_id: postId,
              user_id: `seed_${seed.name}`,
              username: seed.name,
              avatar: seed.avatar,
              text: commentText,
              created_at: new Date().toISOString()
            };
            fallbackComments.push(newComment);
            fallbackNotifications.push({
              id: `notif_seed_comment_${Date.now()}`,
              userId: postOwnerId,
              type: "comment",
              senderName: seed.name,
              senderAvatar: seed.avatar,
              postId: postId,
              postText: postText ? postText.slice(0, 40) : "",
              commentText: commentText,
              isRead: false,
              createdAt: new Date().toISOString()
            });
            saveFallbackDb();
          }
        }
      } catch (err) {
        console.error("Simulated seed comment failed:", err);
      }
    }, 2500);

  }, 5000);
}

// 15. Notifications: Get User Notifications
app.get("/api/notifications", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = data.map((n: any) => ({
          id: n.id,
          userId: n.user_id,
          type: n.type,
          senderName: n.sender_name,
          senderAvatar: n.sender_avatar,
          postId: n.post_id,
          postText: n.post_text,
          commentText: n.comment_text,
          isRead: n.is_read,
          time: formatTimeDifference(n.created_at),
          createdAt: n.created_at
        }));
        return res.json(formatted);
      } catch (sbErr: any) {
        console.warn("⚠️ Remote notifications read failed, falling back to local storage:", sbErr.message || sbErr);
      }
    }

    const userNotifications = fallbackNotifications
      .filter(n => n.userId === userId)
      .map(n => ({
        ...n,
        time: formatTimeDifference(n.createdAt)
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(userNotifications);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 16. Notifications: Mark All as Read
app.post("/api/notifications/read-all", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", userId);

        if (error) throw error;
        return res.json({ success: true });
      } catch (sbErr: any) {
        console.warn("⚠️ Remote notifications mark-all-read failed, falling back to local storage:", sbErr.message || sbErr);
      }
    }

    fallbackNotifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    saveFallbackDb();
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 17. Notifications: Mark Single as Read
app.post("/api/notifications/:id/read", async (req, res) => {
  const notificationId = req.params.id;

  try {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notificationId);

        if (error) throw error;
        return res.json({ success: true });
      } catch (sbErr: any) {
        console.warn("⚠️ Remote notification read failed, falling back to local storage:", sbErr.message || sbErr);
      }
    }

    const notif = fallbackNotifications.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      saveFallbackDb();
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 18. Notifications: Clear/Delete All User Notifications
app.post("/api/notifications/clear-all", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("user_id", userId);

        if (error) throw error;
        return res.json({ success: true });
      } catch (sbErr: any) {
        console.warn("⚠️ Remote notifications delete failed, falling back to local storage:", sbErr.message || sbErr);
      }
    }

    fallbackNotifications = fallbackNotifications.filter(n => n.userId !== userId);
    saveFallbackDb();
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`📡 Full-stack Express Backend listening at http://localhost:${PORT}`);
});
