with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's define the exact block to replace
target = """// 10. Posts: Toggle Bookmark
app.post("/api/posts/:id/bookmark", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "用户未登录" });

  try {
    if (supabase) {
      // Check bookmark
      const { data: existingBM, error: chkErr } = await supabase
        .from("post_bookmarks")
        .select("*")
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("comments")"""

replacement = """// 10. Posts: Toggle Bookmark
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
        .from("comments")"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("FIX APPLIED SUCCESSFULLY!")
else:
    print("TARGET NOT FOUND!")
