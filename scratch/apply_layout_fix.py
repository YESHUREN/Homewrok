import os

def fix_nicknames():
    print("Fixing nickname generations...")
    
    # 1. Update server.ts
    server_path = "server.ts"
    if os.path.exists(server_path):
        with open(server_path, "r", encoding="utf-8") as f:
            content = f.read()
        target = "const newNickname = `${name} (Student)`;"
        replacement = "const newNickname = `${username} (Student)`;"
        if target in content:
            content = content.replace(target, replacement)
            with open(server_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("  server.ts updated successfully!")
        else:
            print("  server.ts: Target nickname pattern not found!")

    # 2. Update api/index.js
    api_path = "api/index.js"
    if os.path.exists(api_path):
        with open(api_path, "r", encoding="utf-8") as f:
            content = f.read()
        target = "name, nickname: `${name} (Student)`, avatar: \"\", tag: \"认证学生\","
        replacement = "name, nickname: `${username} (Student)`, avatar: \"\", tag: \"认证学生\","
        if target in content:
            content = content.replace(target, replacement)
            with open(api_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("  api/index.js updated successfully!")
        else:
            print("  api/index.js: Target nickname pattern not found!")

    # 3. Update src/App.tsx offline nickname fallback
    app_path = "src/App.tsx"
    if os.path.exists(app_path):
        with open(app_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # We need to replace both occurrences in src/App.tsx
        targets = [
            'nickname: `${registerName} (Student)`,',
            'nickname: `${registerName} (Student)`,'
        ]
        replacement = 'nickname: `${registerUsername} (Student)`,'
        
        count = content.count('nickname: `${registerName} (Student)`,')
        if count > 0:
            content = content.replace('nickname: `${registerName} (Student)`,', replacement)
            with open(app_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  src/App.tsx offline registration nickname updated ({count} replacements)!")
        else:
            print("  src/App.tsx: Offline registration nickname patterns not found!")

def fix_homepage_layout():
    print("Refactoring homepage layout to show Entry Assistant and D-Day side-by-side...")
    app_path = "src/App.tsx"
    if not os.path.exists(app_path):
        print("  Error: src/App.tsx not found!")
        return

    with open(app_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Target block to replace (from Entry Assistant card container to the end of the D-Day card container)
    target_start = '                  <div className="px-4 space-y-5">\n                    {/* Premium Entry Assistant Card/Banner */}'
    target_end = '                    </section>\n\n                    {/* Grid Core Services tiles (Bento, Asymmetrical) */}'
    
    # We will search for a block between the section starting with from-[#4f46e5] and the next grid block.
    # Let's write the exact block we want to replace.
    # We can match from '<div className="px-4 space-y-5">' down to the end of the D-Day section.
    
    # Let's extract the exact start and end in the file by index to be extremely robust.
    idx_start = content.find('                    {/* Premium Entry Assistant Card/Banner */}')
    idx_end = content.find('                    {/* Grid Core Services tiles (Bento, Asymmetrical) */}')
    
    if idx_start == -1 or idx_end == -1:
        print("  Error: Could not locate cards block indexes in src/App.tsx!")
        print(f"  idx_start: {idx_start}, idx_end: {idx_end}")
        return

    # Let's backtrack to find the container div start
    div_start = content.rfind('<div className="px-4 space-y-5">', 0, idx_start)
    if div_start == -1:
        print("  Error: Could not locate outer div container class name in src/App.tsx!")
        return
        
    full_target_block = content[div_start:idx_end]
    
    # Replace layout with the grid cols 2 design
    replacement = """<div className="px-4 space-y-5">
                    {/* Row container for Entry Assistant and D-Day Countdown cards */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {/* Premium Entry Assistant Card/Banner */}
                      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#5b21b6] to-[#7c3aed] text-white shadow-md border border-violet-500/20 p-4 flex flex-col justify-between active:scale-[0.995] transition-all duration-300 h-[220px]">
                        {/* Decorative backdrop glow */}
                        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        
                        {!entryDate ? (
                          /* State A: Date not set */
                          <div className="flex flex-col justify-between h-full">
                            <div className="space-y-1.5">
                              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-violet-100 border border-white/10">
                                <Plane className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
                                <span>{language === 'zh' ? '入境规划' : language === 'ko' ? '입국 플래너' : 'Entry Helper'}</span>
                              </div>
                              <h3 className="text-xs font-extrabold tracking-tight mt-1 leading-snug">
                                {language === 'zh' ? '🛫 留韩入境助手' : language === 'ko' ? '🛫 한국 입국 도우미' : '🛫 Entry Assistant'}
                              </h3>
                              <p className="text-[9.5px] text-violet-100/80 leading-normal font-medium line-clamp-3">
                                {language === 'zh' 
                                  ? '定制您出发前到落地韩国15天的倒数日程，一键同步。' 
                                  : language === 'ko' 
                                  ? '출국 전부터 입국 후 15일까지의 필수 일정을 관리하세요.' 
                                  : 'Plan departure and arrival milestones relative to your entry date.'}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setTempEntryDate(new Date().toISOString().split('T')[0]);
                                setShowEntryDateModal(true);
                              }}
                              className="w-full bg-white hover:bg-slate-50 text-violet-700 py-2 text-[10px] font-black rounded-lg transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-98 mt-2"
                            >
                              <span>{language === 'zh' ? '开启日程 ⚡' : language === 'ko' ? '일정 시작 ⚡' : 'Start ⚡'}</span>
                            </button>
                          </div>
                        ) : (
                          /* State B: Date is set */
                          <div className="flex flex-col justify-between h-full">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-violet-100 border border-white/10">
                                  <Plane className="w-2.5 h-2.5 text-yellow-300" />
                                  <span>{language === 'zh' ? '入境规划' : language === 'ko' ? '입국 플래너' : 'Entry Helper'}</span>
                                </div>
                                <span className="bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-white border border-white/20">
                                  {(() => {
                                    const diff = getDaysDiff(entryDate);
                                    if (diff > 0) return `D-${diff}`;
                                    if (diff === 0) return language === 'zh' ? '今天' : language === 'ko' ? '오늘' : 'Today';
                                    return language === 'zh' ? `已入韩${Math.abs(diff)}天` : language === 'ko' ? `입국${Math.abs(diff)}일` : `D+${Math.abs(diff)}`;
                                  })()}
                                </span>
                              </div>
                              
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-violet-200 font-bold block">
                                  {language === 'zh' ? '预计入境日期' : language === 'ko' ? '예정 입국일' : 'Expected Entry'}
                                </span>
                                <h3 className="text-xs font-black text-yellow-300 tracking-tight font-sans">
                                  {entryDate}
                                </h3>
                              </div>

                              {(() => {
                                const timeline = getTimelineItems(entryDate);
                                const completedCount = timeline.filter(item => getDaysDiff(item.dateStr) < 0).length;
                                const progressPercent = Math.round((completedCount / timeline.length) * 100);
                                return (
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[8.5px] text-violet-100 font-bold">
                                      <span>
                                        {language === 'zh' ? `进度 ${completedCount}/6` : language === 'ko' ? `진행도 ${completedCount}/6` : `Progress ${completedCount}/6`}
                                      </span>
                                      <span>{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                      <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                onClick={() => setScreen(ActiveScreen.ENTRY_HELPER)}
                                className="flex-1 bg-white hover:bg-violet-50 text-violet-700 py-1.5 text-[10px] font-black rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                              >
                                <span>{language === 'zh' ? '路线图 🗺️' : language === 'ko' ? '로드맵 🗺️' : 'Roadmap 🗺️'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setTempEntryDate(entryDate);
                                  setShowEntryDateModal(true);
                                }}
                                className="p-1.5 bg-white/10 hover:bg-white/25 border border-white/10 text-white rounded-lg text-[10px] font-black transition-all cursor-pointer active:scale-98"
                                title="Edit Date"
                              >
                                ⚙️
                              </button>
                            </div>
                          </div>
                        )}
                      </section>

                      {/* D-Day Countdown Card */}
                      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-[#00685f] to-[#008378] p-4 text-white shadow-sm flex flex-col justify-between h-[220px]">
                        {/* Decorative backdrop glow */}
                        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex flex-col justify-between h-full">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <div className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-teal-100 border border-white/10">
                                <Calendar className="w-2.5 h-2.5 text-yellow-300" />
                                <span>{language === 'zh' ? '倒数日' : language === 'ko' ? '디데이' : 'D-Day'}</span>
                              </div>
                              
                              {reminders.length > 1 && (
                                <div className="flex items-center gap-1 bg-black/15 hover:bg-black/25 rounded-md px-1 py-0.25 text-[8px] font-bold transition-all">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const idx = reminders.findIndex(r => r.id === activeReminder.id);
                                      const prevIdx = (idx - 1 + reminders.length) % reminders.length;
                                      setActiveCountdownId(reminders[prevIdx].id);
                                    }}
                                    className="hover:text-amber-200 px-0.5 active:scale-90"
                                    title="prev"
                                  >
                                    ◀
                                  </button>
                                  <span className="text-teal-200/95 tracking-tighter">{(reminders.findIndex(r => r.id === activeReminder.id) + 1)}/{reminders.length}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const idx = reminders.findIndex(r => r.id === activeReminder.id);
                                      const nextIdx = (idx + 1) % reminders.length;
                                      setActiveCountdownId(reminders[nextIdx].id);
                                    }}
                                    className="hover:text-amber-200 px-0.5 active:scale-90"
                                    title="next"
                                  >
                                    ▶
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xs font-extrabold tracking-tight mt-1 leading-snug line-clamp-2">
                              {reminders.length === 0 
                                ? (language === 'zh' ? "暂无倒数日程" : language === 'ko' ? "디데이 일정 없음" : "No Schedule") 
                                : activeReminder.id === "rem_visa" || activeReminder.title.includes("签证")
                                  ? (language === 'zh' ? "在韩签证到期提醒" : language === 'ko' ? "재한 비자 만료 디데이" : "Visa Expiry")
                                  : activeReminder.title}
                            </h3>
                            
                            <span className="text-[8.5px] text-teal-200 block truncate">
                              {reminders.length === 0 
                                ? (language === 'zh' ? "在日历中添加重要日程" : language === 'ko' ? "시험, 학비 등 일정을 추가하세요" : "Add reminders for milestones") 
                                : activeReminder.id === "rem_visa"
                                  ? "2026-12-15 (留学生签证)"
                                  : `${activeReminder.date} (${activeReminder.time})`}
                            </span>
                          </div>

                          <div className="my-1.5">
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-white leading-none tracking-tight">
                                {reminders.length === 0 ? "—" : nextReminderCountdownDays}
                              </span>
                              <span className="text-[10px] font-semibold text-teal-200">{t('days')}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => setScreen(ActiveScreen.CALENDAR)}
                            className="w-full bg-white hover:bg-slate-50 text-[#00685f] py-2 text-[10px] font-black rounded-lg transition-all shadow-sm text-center cursor-pointer mt-1"
                          >
                            {reminders.length === 0 
                              ? (language === 'zh' ? "去添加 ＋" : language === 'ko' ? "추가하기 ＋" : "Add ＋") 
                              : (language === 'zh' ? "查看日历 📅" : language === 'ko' ? "캘린더 보기 📅" : "View Calendar 📅")}
                          </button>
                        </div>
                      </section>
                    </div>
                  """

    new_content = content[:div_start] + replacement + content[idx_end:]
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: Homepage layout refactored side-by-side!")

fix_nicknames()
fix_homepage_layout()
