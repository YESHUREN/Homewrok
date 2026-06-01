/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  NavigationTab, ActiveScreen, GuideCategory, Post, UserProfile, CalendarReminder, Notification 
} from "./types";
import { 
  INITIAL_PROFILE, INITIAL_POSTS, INITIAL_REMINDERS, MAP_IMAGE_URL 
} from "./data";
import GuideDetail from "./components/GuideDetail";
import { translations } from "./i18n";
import { 
  Home, MessageSquare, User, Menu, Bell, Search, MapPin, ChevronDown, 
  Heart, MessageCircle, Share2, Plus, Calendar, Shield, BookOpen, 
  Trash2, CreditCard, ChevronRight, HelpCircle, Globe, LogOut, Check,
  X, Camera, PlusCircle, ArrowLeft, Send, ArrowRight, Bookmark, RefreshCw, Hash, Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PRESET_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea", // Zhang Wei
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVZTY92E1qzQ-IFLBkGoLw9KtF6Bn4uph_j-ISf1Xvger9ZYUaPqWye1fVWnsT9FA0SzXIV3i2f5POWoHxJH9ysnF2OFcDtvFSXpZoN2pJ1b1_Och7TS6jQYm19uXCsWmu53buFSkQ3JnDSECzurgl41XtDT-mwUjWRQV_NNxuL09CnQDnunlWafknRnd3uAz7yargRcAXobFm50VYUC8cJDdj4j7GVkuOMPqlz_xc3C4ZmUVmsCbMJSIipjZUiIMPLWvU8C31lf1G", // Minji Kim
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6kpYYZIDejvv9BWlKsrzLTShCWeBbVGxM_NCmGebzAXxk4vRvI9VIyNUb_TR4qiy6lgC9QvQDDdFhJaY1rg-Qn2j84mOWfWV5lorxUDFq4SP5TABdbR_mhDIoofFGLkSGYOPtYaOn7bqlIV2BVjKHih7pOawOuArwFOQ1XeunGlEmq5S9LrtLjvPFKpHBbns8lPEQZ5x31koaY_a8dHoC225-tLS8_19vjHF6paU4wUsPRozbO2WRT_MEqORgA96z1sffMniTqzwK", // Wang Qiang
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256", // Female student 1
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256", // Male student 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256", // Female student 2
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256", // Male student 2
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256"  // Female student 3
];

export default function App() {
  // Language State (Chinese, English, Korean)
  const [language, setLanguage] = useState<'zh' | 'ko' | 'en'>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved === "zh" || saved === "ko" || saved === "en") ? saved : "zh";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  // Translation lookup helper
  const t = (key: string): string => {
    const langData = translations[language];
    if (langData && (langData as any)[key]) {
      return (langData as any)[key];
    }
    const zhData = translations["zh"];
    if (zhData && (zhData as any)[key]) {
      return (zhData as any)[key];
    }
    return key;
  };

  // App General State
  const [navTab, setNavTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [screen, setScreen] = useState<ActiveScreen>(ActiveScreen.MAIN);
  const [activeGuideCategory, setActiveGuideCategory] = useState<GuideCategory>(GuideCategory.INSURANCE);
  
  // Model states
  const [profile, setProfile] = useState<UserProfile>({ ...INITIAL_PROFILE, isLoggedIn: false });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reminders, setReminders] = useState<CalendarReminder[]>(INITIAL_REMINDERS);

  // Notifications states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Community Search & Sort
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  const [communitySortDir, setCommunitySortDir] = useState<"NEWEST" | "POPULAR">("NEWEST");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Live Location State
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState("正在获取实时位置...");
  const [locationLoading, setLocationLoading] = useState(true);

  // Info Drawer (hamburger menu) State
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  // New Post State
  const [newPostCategory, setNewPostCategory] = useState("校园生活");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("#首尔探店");
  const [newPostLocation, setNewPostLocation] = useState("首尔");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topicInputValue, setTopicInputValue] = useState("");
  const [newPostAnonymous, setNewPostAnonymous] = useState(false);
  const [newPostAttachedPhotos, setNewPostAttachedPhotos] = useState<string[]>([
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDzdAyZmAoaXCTEBxwtNg_XRXtYAiXisxA7D8tTRc7CqrLs5uz0PKDyyo0M8bR0vP9s1p3Dg4N5DcDm5nthcjcsFTNhZ9Je5yT5dM6Imaq661EEV5V63E4kjeni5cAbPvlziDwhDwfYjsRO2lZJxlN_OSGlHFjCB3MYNTgE1Vl1rmNGr_XgFDtDDudj68kutfsX1ZtSdwa-f7vTxZT1Fjaac_PMepU1B4lEPxYgMl_qYOEE7xrwkv1QFRN9cmLWIA9a9M4ADgMCjPbg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChcODLVpHGwh85dmEjBwABWx1vCghW23PVZu4LfqO2ckVVriM1YReP5eUyu-UlTu_0lBIzI0o0Jr1HhARCAJL_IqcIsOZOvlGn8i_X0IVkMjp9OHZh8-OaB1czudBRSqUI76Wkw-DdhbAibX-EsjTShff7kCb34UD1E0BbRfaQO8pVmpbi8Pv8sjMtAdKbd24gvqBKyMgbDYSekoePki0mx0a1f0jDI_Dqvvo74HedVnAnXQPIbghjRCV9LpMuHiDgjUywyrL08hT1"
  ]);

  // Publish success alert overlay toggle
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  // DB Diagnostic & Cloud Connection states
  const [dbDiagnostic, setDbDiagnostic] = useState<{
    tested: boolean;
    connected: boolean;
    errorMsg: string | null;
    existingAccounts: string[];
  }>({
    tested: false,
    connected: false,
    errorMsg: null,
    existingAccounts: []
  });
  const [showDbInfoModal, setShowDbInfoModal] = useState(false);

  // Global trending topics state
  const [globalTopics, setGlobalTopics] = useState<string[]>([
    "#首尔探店", "#签证攻略", "#韩语备考", "#租房经验", "#江原大学", "#吃喝玩乐", "#兼职求职"
  ]);
  const [selectedGlobalTopic, setSelectedGlobalTopic] = useState<string | null>(null);
  const [showManageTopics, setShowManageTopics] = useState(false);

  // Custom location typing input in location picker
  const [customLocationText, setCustomLocationText] = useState("");

  // Active Comment Post ID tracker - null when comment drawer is closed
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  // Edit Profile Form States (linked directly to save block)
  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editMajor, setEditMajor] = useState(profile.major);
  const [editGender, setEditGender] = useState(profile.gender);
  const [editBirthday, setEditBirthday] = useState(profile.birthday);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Login & Register Form States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAgreed, setLoginAgreed] = useState(true);
  const [loginError, setLoginError] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUniversity, setRegisterUniversity] = useState("首尔大学");
  const [registerGender, setRegisterGender] = useState("男 (Male)");
  const [registerBirthday, setRegisterBirthday] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Calendar Screen States
  const [calendarYear, setCalendarYear] = useState<number>(2026); // Default to year 2026 for high-fidelity mock alignment
  const [calendarMonth, setCalendarMonth] = useState<number>(5);  // Default to May 2026 for schema alignment
  const [activeCalendarSelectedDate, setActiveCalendarSelectedDate] = useState<string>("2026-05-13");

  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      if (prev === 1) {
        setCalendarYear(y => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      if (prev === 12) {
        setCalendarYear(y => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };
  
  // New Reminder form state
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderNotice, setNewReminderNotice] = useState(true);

  // Active Countdown ID displayed on the home page banner
  const [activeCountdownId, setActiveCountdownId] = useState<string>("rem_visa");



  // Dynamic filter for posts list: "ALL" | "MINE" | "BOOKMARKED"
  const [communityFilter, setCommunityFilter] = useState<"ALL" | "MINE" | "BOOKMARKED">("ALL");

  // ============================================================================
  // FULLSTACK API DATA LOADING HELPERS
  // ============================================================================
  const fetchPosts = (userId?: string) => {
    const url = userId ? `/api/posts?userId=${userId}` : "/api/posts";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch(err => console.error("Error loading posts:", err));
  };

  // Auto-refresh posts every 12 seconds so likes/comments from other users are visible
  React.useEffect(() => {
    const interval = setInterval(() => {
      const storedUserId = localStorage.getItem("service_community_user_id");
      fetchPosts(storedUserId || undefined);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = (userId: string) => {
    fetch(`/api/reminders?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReminders(data);
        }
      })
      .catch(err => console.error("Error loading reminders:", err));
  };



  // Auto-login session recovery on mount
  React.useEffect(() => {
    let storedUserId = localStorage.getItem("service_community_user_id");
    if (!storedUserId) {
      // Keep guest mode (default logged out state)
      setProfile(prev => ({ ...prev, isLoggedIn: false }));
      fetchPosts();
      return;
    }

    fetch(`/api/profile?userId=${storedUserId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          localStorage.setItem("local_cached_profile", JSON.stringify(data));
          setProfile({
            isLoggedIn: true,
            name: data.name,
            nickname: data.nickname,
            avatar: data.avatar,
            tag: data.tag,
            university: data.university,
            major: data.major,
            studentId: data.id,
            gender: data.gender,
            birthday: data.birthday
          });
          setEditNickname(data.nickname);
          setEditMajor(data.major);
          setEditGender(data.gender);
          setEditBirthday(data.birthday);
          setEditAvatar(data.avatar);

          fetchReminders(data.id);
          fetchPosts(data.id);
        } else {
          // Fallback to guest mode
          setProfile(prev => ({ ...prev, isLoggedIn: false }));
          fetchPosts();
        }
      })
      .catch(err => {
        console.warn("Failed to reach API server. Restoring from local cached profile if available.", err);
        
        // Try to restore from local storage cache
        let restored = false;
        const cachedStr = localStorage.getItem("local_cached_profile");
        if (cachedStr) {
          try {
            const cachedData = JSON.parse(cachedStr);
            if (cachedData.id === storedUserId) {
              setProfile({
                isLoggedIn: true,
                name: cachedData.name,
                nickname: cachedData.nickname,
                avatar: cachedData.avatar,
                tag: cachedData.tag,
                university: cachedData.university,
                major: cachedData.major,
                studentId: cachedData.id,
                gender: cachedData.gender,
                birthday: cachedData.birthday
              });
              setEditNickname(cachedData.nickname);
              setEditMajor(cachedData.major);
              setEditGender(cachedData.gender);
              setEditBirthday(cachedData.birthday);
              setEditAvatar(cachedData.avatar);
              restored = true;
            }
          } catch (e) {
            console.error("Failed to parse cached profile", e);
          }
        }
        
        if (!restored) {
          // Fallback: keep mock states
          setProfile({ ...INITIAL_PROFILE, isLoggedIn: true });
          setEditNickname(INITIAL_PROFILE.nickname);
          setEditMajor(INITIAL_PROFILE.major);
          setEditGender(INITIAL_PROFILE.gender);
          setEditBirthday(INITIAL_PROFILE.birthday);
          setEditAvatar(INITIAL_PROFILE.avatar);
        }

        fetchPosts();
      });
  }, []);



  // Fetch real-time user location and reverse-geocode to dynamic description
  const fetchLiveLocation = useCallback(() => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationName(t("browser_no_location"));
      setLocationCoords({ lat: 37.5618, lon: 126.9468 });
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({ lat: latitude, lon: longitude });
        
        // Reverse geocode via OSM Nominatim with localized language headers
        try {
          const acceptLang = language === 'zh' ? 'zh-CN' : language === 'ko' ? 'ko-KR' : 'en-US';
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${acceptLang}`
          );
          if (res.ok) {
            const data = await res.json();
            const displayName = data.display_name || "";
            // Extract clean street or city detail from nominatim data
            const address = data.address;
            let cleanName = "";
            if (address) {
              cleanName = address.road || address.suburb || address.quarter || address.city || address.province || displayName;
            } else {
              cleanName = displayName;
            }
            
            // Shorten if it's too long
            if (cleanName.length > 25) {
              cleanName = cleanName.substring(0, 25) + "...";
            }
            const labelCoords = language === 'zh' ? `经度:${longitude.toFixed(2)}, 纬度:${latitude.toFixed(2)}` : language === 'ko' ? `경도:${longitude.toFixed(2)}, 위도:${latitude.toFixed(2)}` : `Lon:${longitude.toFixed(2)}, Lat:${latitude.toFixed(2)}`;
            setLocationName(cleanName || `Seoul (${labelCoords})`);
          } else {
            const labelCoords = language === 'zh' ? `经度:${longitude.toFixed(2)}, 纬度:${latitude.toFixed(2)}` : language === 'ko' ? `경도:${longitude.toFixed(2)}, 위도:${latitude.toFixed(2)}` : `Lon:${longitude.toFixed(2)}, Lat:${latitude.toFixed(2)}`;
            setLocationName(`${t('current_coords')}: ${labelCoords}`);
          }
        } catch (error) {
          const labelCoords = language === 'zh' ? `经度:${longitude.toFixed(2)}, 纬度:${latitude.toFixed(2)}` : language === 'ko' ? `경도:${longitude.toFixed(2)}, 위도:${latitude.toFixed(2)}` : `Lon:${longitude.toFixed(2)}, Lat:${latitude.toFixed(2)}`;
          setLocationName(`${t('current_coords')}: ${labelCoords}`);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        // Fallback to Ewha Womans University
        setLocationCoords({ lat: 37.5618, lon: 126.9468 });
        setLocationName(t("default_location_desc"));
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [language]);

  // Trigger live location on mount
  useEffect(() => {
    fetchLiveLocation();
  }, [fetchLiveLocation]);

  // DB diagnostic check on mount
  useEffect(() => {
    fetch("/api/debug")
      .then(res => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then(data => {
        if (data.supabaseConfigured && data.dbReadOK && data.dbWriteOK) {
          setDbDiagnostic({
            tested: true,
            connected: true,
            errorMsg: null,
            existingAccounts: data.existingAccounts || []
          });
          console.log("🚀 [ANTIGRAVITY] Cloud Database diagnostic: CONNECTED!");
        } else {
          let err = "配置未完成";
          if (data.supabaseConfigured) {
            err = `数据库读写测试失败: ${data.dbReadError || data.dbWriteError || "权限受限"}`;
          }
          setDbDiagnostic({
            tested: true,
            connected: false,
            errorMsg: err,
            existingAccounts: []
          });
          console.warn("⚠️ [ANTIGRAVITY] Cloud Database diagnostic: RUNNING IN FALLBACK LOCAL MODE!", err);
        }
      })
      .catch(err => {
        setDbDiagnostic({
          tested: true,
          connected: false,
          errorMsg: "无法连接到后端服务器 API 接口",
          existingAccounts: []
        });
        console.warn("⚠️ [ANTIGRAVITY] Cloud Database diagnostic: API OFFLINE!", err);
      });
  }, []);

  // Fetch user notifications
  const fetchNotifications = useCallback(() => {
    if (!profile.studentId) return;
    fetch(`/api/notifications?userId=${profile.studentId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(prev => {
            const hasNew = prev.length !== data.length || 
                           data.some((n, idx) => !prev[idx] || prev[idx].id !== n.id || prev[idx].isRead !== n.isRead);
            if (hasNew) {
              console.log("♻️ [ANTIGRAVITY] New notifications detected, instantly refreshing posts list!");
              fetchPosts(profile.studentId || undefined);
            }
            return data;
          });
        }
      })
      .catch(err => console.error("Error fetching notifications:", err));
  }, [profile.studentId, fetchPosts]);

  // Polling notifications every 3 seconds
  useEffect(() => {
    if (!profile.isLoggedIn || !profile.studentId) {
      setNotifications([]);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, [profile.isLoggedIn, profile.studentId, fetchNotifications]);

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    if (!profile.studentId) return;
    fetch("/api/notifications/read-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to mark all as read");
        return res.json();
      })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        triggerSystemTip(t("update_success"));
      })
      .catch(err => console.error("Error marking all read:", err));
  };

  // Mark a single notification as read
  const handleMarkNotificationAsRead = (id: string) => {
    const notif = notifications.find(n => n.id === id);
    fetch(`/api/notifications/${id}/read`, {
      method: "POST"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to mark notification as read");
        return res.json();
      })
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        if (notif && notif.postId) {
          setActiveCommentPostId(notif.postId);
          setShowNotificationDrawer(false);
          console.log(`🔔 [ANTIGRAVITY] Opened comments drawer for post: ${notif.postId}`);
        }
      })
      .catch(err => console.error("Error marking read:", err));
  };

  // Clear all notifications
  const handleClearAllNotifications = () => {
    if (!profile.studentId) return;
    fetch("/api/notifications/clear-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to clear notifications");
        return res.json();
      })
      .then(() => {
        setNotifications([]);
        triggerSystemTip(t("delete_success"));
      })
      .catch(err => console.error("Error clearing notifications:", err));
  };

  // Toggle dynamic bookmarked state of a post
  const handleToggleBookmark = (postId: string) => {
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行收藏！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }

    fetch(`/api/posts/${postId}/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, isBookmarked: data.isBookmarked } : p));
          triggerSystemTip(data.isBookmarked ? "📌 已成功保存到首尔校区【收藏夹】！" : "🗑️ 已从【收藏夹】中取消收藏！");
        }
      })
      .catch(() => {
        // Fallback if offline
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p));
      });
  };

  // Get active reminder object
  const activeReminder = useMemo(() => {
    const selected = reminders.find(r => r.id === activeCountdownId);
    if (selected) return selected;
    // Fallback to the first one in list, if any
    if (reminders.length > 0) return reminders[0];
    // Ultimate fallback if user deletes everything
    return {
      id: "rem_visa",
      title: "在韩签证到期提醒 (留学生签)",
      date: "2026-12-15",
      time: "23:59",
      enabled: true
    };
  }, [reminders, activeCountdownId]);

  // Notification Banner
  const [systemTip, setSystemTip] = useState<string | null>(null);

  // Helper trigger for notifications
  const triggerSystemTip = (msg: string) => {
    setSystemTip(msg);
    setTimeout(() => {
      setSystemTip(null);
    }, 2500);
  };

  // Share link helper
  const handleShare = () => {
    triggerSystemTip("链接复制成功，快去分享给同学吧！");
  };

  // Derived countdown to next reminder or special date
  const nextReminderCountdownDays = useMemo(() => {
    const remDateStr = activeReminder.date;
    const targetDate = new Date(remDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(targetDate.getTime())) {
      return 45; // fallback
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  }, [activeReminder]);

  // Handle Likes
  const handleLikePost = (postId: string) => {
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行点赞！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }

    fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(prev => prev.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                hasLiked: data.hasLiked,
                likes: data.hasLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
              };
            }
            return p;
          }));
        }
      })
      .catch(() => {
        // Offline fallback
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            const hasLiked = !p.hasLiked;
            return {
              ...p,
              hasLiked,
              likes: hasLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
            };
          }
          return p;
        }));
      });
  };

  // Handle Comments Submit
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再发表回复评论！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }
    if (!newCommentText.trim() || !activeCommentPostId) return;

    fetch(`/api/posts/${activeCommentPostId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.studentId,
        username: profile.name,
        avatar: profile.avatar,
        text: newCommentText
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(prev => prev.map(p => {
            if (p.id === activeCommentPostId) {
              return {
                ...p,
                commentsCount: p.commentsCount + 1,
                commentsList: [...p.commentsList, data.comment]
              };
            }
            return p;
          }));
          setNewCommentText("");
          triggerSystemTip("评论已发布并同步至后台数据库！");
        }
      })
      .catch(() => {
        // Offline Fallback
        const newCommentObj = {
          id: `comment_${Date.now()}`,
          username: profile.name,
          avatar: profile.avatar,
          text: newCommentText,
          time: "刚刚"
        };
        setPosts(prev => prev.map(p => p.id === activeCommentPostId ? {
          ...p,
          commentsCount: p.commentsCount + 1,
          commentsList: [...p.commentsList, newCommentObj]
        } : p));
        setNewCommentText("");
        triggerSystemTip("评论发布成功（本地缓存）");
      });
  };

  // Handle Delete Post
  const handleDeletePost = (postId: string) => {
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行该操作！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }

    fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("删除失败");
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setPosts(prev => prev.filter(p => p.id !== postId));
          triggerSystemTip("您的帖子已成功删除并同步至后台！");
        }
      })
      .catch(() => {
        // Offline Fallback
        setPosts(prev => prev.filter(p => p.id !== postId));
        triggerSystemTip("帖子已成功从本地缓存删除！");
      });
  };

  // Handle Delete Comment
  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行该操作！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }

    fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.studentId })
    })
      .then(res => {
        if (!res.ok) throw new Error("删除评论失败");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setPosts(prev => prev.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                commentsCount: Math.max(0, p.commentsCount - 1),
                commentsList: p.commentsList.filter(c => c.id !== commentId)
              };
            }
            return p;
          }));
          triggerSystemTip("您的评论已成功删除并同步至后台！");
        }
      })
      .catch(() => {
        // Offline Fallback
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              commentsCount: Math.max(0, p.commentsCount - 1),
              commentsList: p.commentsList.filter(c => c.id !== commentId)
            };
          }
          return p;
        }));
        triggerSystemTip("评论已从本地缓存删除！");
      });
  };

  // Handle Publish Post
  const handlePublishPost = () => {
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行发布动态！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }
    if (!newPostText.trim()) {
      triggerSystemTip("请输入内容或向校友提问哦~");
      return;
    }

    // Auto-sync custom topic to globalTopics list
    if (selectedTopic && selectedTopic.startsWith('#') && !globalTopics.includes(selectedTopic)) {
      setGlobalTopics(prev => [...prev, selectedTopic]);
    }

    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.studentId,
        username: profile.name,
        avatar: profile.avatar,
        category: newPostCategory,
        text: `${newPostTitle ? `【${newPostTitle}】` : ""}${newPostText} ${selectedTopic}`,
        image: newPostAttachedPhotos.length > 0 ? newPostAttachedPhotos[0] : undefined,
        area: newPostLocation || "首尔",
        anonymous: newPostAnonymous
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchPosts(profile.studentId);
          setShowPublishSuccess(true);
          setTimeout(() => {
            setShowPublishSuccess(false);
            setScreen(ActiveScreen.MAIN);
            setNavTab(NavigationTab.COMMUNITY);
            setNewPostTitle("");
            setNewPostText("");
            setNewPostAnonymous(false);
          }, 2000);
        }
      })
      .catch(() => {
        // Offline Fallback
        const newPostObj: Post = {
          id: `post_${Date.now()}`,
          userId: profile.studentId,
          username: newPostAnonymous ? "匿名校友" : profile.name,
          avatar: newPostAnonymous ? "" : profile.avatar,
          time: "刚刚",
          area: newPostLocation || "首尔",
          category: newPostCategory,
          text: `${newPostTitle ? `【${newPostTitle}】` : ""}${newPostText} ${selectedTopic}`,
          image: newPostAttachedPhotos.length > 0 ? newPostAttachedPhotos[0] : undefined,
          likes: 0,
          commentsCount: 0,
          commentsList: [],
          hasLiked: false,
          isBookmarked: false
        };
        setPosts(prev => [newPostObj, ...prev]);
        setShowPublishSuccess(true);
        setTimeout(() => {
          setShowPublishSuccess(false);
          setScreen(ActiveScreen.MAIN);
          setNavTab(NavigationTab.COMMUNITY);
          setNewPostTitle("");
          setNewPostText("");
          setNewPostAnonymous(false);
        }, 2000);
      });
  };

  // Handle Save Profile
  const handleSaveProfile = () => {
    if (!profile.isLoggedIn) return;

    fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.studentId,
        nickname: editNickname,
        major: editMajor,
        gender: editGender,
        birthday: editBirthday,
        avatar: editAvatar
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "保存失败");
        }
        return data;
      })
      .then(data => {
        if (data.success) {
          setProfile(prev => ({
            ...prev,
            nickname: editNickname,
            major: editMajor,
            gender: editGender,
            birthday: editBirthday,
            avatar: editAvatar
          }));

          // Update cached profile
          const cachedStr = localStorage.getItem("local_cached_profile");
          if (cachedStr) {
            try {
              const cachedData = JSON.parse(cachedStr);
              if (cachedData.id === profile.studentId) {
                cachedData.nickname = editNickname;
                cachedData.major = editMajor;
                cachedData.gender = editGender;
                cachedData.birthday = editBirthday;
                cachedData.avatar = editAvatar;
                localStorage.setItem("local_cached_profile", JSON.stringify(cachedData));
              }
            } catch (e) {
              console.error("Failed to update local_cached_profile", e);
            }
          }

          setShowSaveMessage(true);
          triggerSystemTip("个人资料保存成功，后台已同步！");
          setTimeout(() => {
            setShowSaveMessage(false);
            setScreen(ActiveScreen.MAIN);
            setNavTab(NavigationTab.PROFILE);
          }, 1500);
        }
      })
      .catch((err) => {
        console.warn("保存资料接口失败，使用本地缓存 fallback", err);
        // Fallback
        setProfile(prev => ({
          ...prev,
          nickname: editNickname,
          major: editMajor,
          gender: editGender,
          birthday: editBirthday,
          avatar: editAvatar
        }));

        // Update cached profile in offline fallback
        const cachedStr = localStorage.getItem("local_cached_profile");
        if (cachedStr) {
          try {
            const cachedData = JSON.parse(cachedStr);
            if (cachedData.id === profile.studentId) {
              cachedData.nickname = editNickname;
              cachedData.major = editMajor;
              cachedData.gender = editGender;
              cachedData.birthday = editBirthday;
              cachedData.avatar = editAvatar;
              localStorage.setItem("local_cached_profile", JSON.stringify(cachedData));
            }
          } catch (e) {
            console.error("Failed to update local_cached_profile in fallback", e);
          }
        }

        setShowSaveMessage(true);
        triggerSystemTip("个人资料保存成功（本地缓存）");
        setTimeout(() => {
          setShowSaveMessage(false);
          setScreen(ActiveScreen.MAIN);
          setNavTab(NavigationTab.PROFILE);
        }, 1500);
      });
  };

  // Handle Login Flow
  const handleLoginSubmit = () => {
    if (!loginUsername.trim()) {
      setLoginError("请输入账号");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("请输入密码");
      return;
    }
    if (!loginAgreed) {
      setLoginError("请阅读并同意各用户服务条款与隐私契约");
      return;
    }

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "登录失败！");
        }
        return data;
      })
      .then(data => {
        setLoginError("");
        const u = data.profile;
        localStorage.setItem("service_community_user_id", u.id);
        localStorage.setItem("local_cached_profile", JSON.stringify(u));
        setProfile({
          isLoggedIn: true,
          name: u.name,
          nickname: u.nickname,
          avatar: u.avatar,
          tag: u.tag,
          university: u.university,
          major: u.major,
          studentId: u.id,
          gender: u.gender,
          birthday: u.birthday
        });
        setEditNickname(u.nickname);
        setEditMajor(u.major);
        setEditGender(u.gender);
        setEditBirthday(u.birthday);
        setEditAvatar(u.avatar);

        fetchReminders(u.id);
        fetchPosts(u.id);

        triggerSystemTip("欢迎回到在韩中国学生服务社区！");
        setScreen(ActiveScreen.MAIN);
        setNavTab(NavigationTab.PROFILE);
      })
      .catch((err: any) => {
        console.warn("登录接口请求失败，尝试本地 Mock 登录", err);

        // Try local cached credentials
        let localLoginSuccess = false;
        const cachedStr = localStorage.getItem("local_cached_profile");
        if (cachedStr) {
          try {
            const cachedData = JSON.parse(cachedStr);
            if (cachedData.username === loginUsername && cachedData.password === loginPassword) {
              setLoginError("");
              localStorage.setItem("service_community_user_id", cachedData.id);
              setProfile({
                isLoggedIn: true,
                name: cachedData.name,
                nickname: cachedData.nickname,
                avatar: cachedData.avatar,
                tag: cachedData.tag,
                university: cachedData.university,
                major: cachedData.major,
                studentId: cachedData.id,
                gender: cachedData.gender,
                birthday: cachedData.birthday
              });
              setEditNickname(cachedData.nickname);
              setEditMajor(cachedData.major);
              setEditGender(cachedData.gender);
              setEditBirthday(cachedData.birthday);
              setEditAvatar(cachedData.avatar);
              triggerSystemTip("本地缓存模式登录成功！");
              setScreen(ActiveScreen.MAIN);
              setNavTab(NavigationTab.PROFILE);
              localLoginSuccess = true;
            }
          } catch (e) {
            console.error("Failed to authenticate offline", e);
          }
        }

        if (localLoginSuccess) return;

        // Fallback offline mock login if username/password matches 张伟
        if (loginUsername === "zhangwei" && loginPassword === "123456") {
          setLoginError("");
          setProfile({
            isLoggedIn: true,
            name: "张伟",
            nickname: "张伟 (Zhang Wei)",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea",
            tag: "认证学生",
            university: "首尔大学",
            major: "计算机科学与工程",
            studentId: "202408151229",
            gender: "男 (Male)",
            birthday: "2002-05-20"
          });
          setEditNickname("张伟 (Zhang Wei)");
          setEditMajor("计算机科学与工程");
          setEditGender("男 (Male)");
          setEditBirthday("2002-05-20");
          setEditAvatar("https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea");
          triggerSystemTip("本地体验模式登录成功！");
          setScreen(ActiveScreen.MAIN);
          setNavTab(NavigationTab.PROFILE);
        } else {
          setLoginError(err.message || "账号或密码错误（本地无此账号）");
        }
      });
  };

  // Handle Register Flow
  const handleRegisterSubmit = () => {
    if (!registerUsername.trim()) {
      setRegisterError("请输入账号");
      return;
    }
    if (!registerPassword.trim()) {
      setRegisterError("请输入密码");
      return;
    }
    if (!registerName.trim()) {
      setRegisterError("请输入姓名");
      return;
    }
    if (!registerUniversity) {
      setRegisterError("请选择就读高校");
      return;
    }
    if (!registerGender) {
      setRegisterError("请选择性别");
      return;
    }
    if (!registerBirthday) {
      setRegisterError("请选择出生年月");
      return;
    }
    if (!loginAgreed) {
      setRegisterError("请阅读并同意各用户服务条款与隐私契约");
      return;
    }

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
        name: registerName,
        university: registerUniversity,
        gender: registerGender,
        birthday: registerBirthday
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "注册失败！");
        }
        return data;
      })
      .then(data => {
        setRegisterError("");
        const u = data.profile;
        localStorage.setItem("service_community_user_id", u.id);
        localStorage.setItem("local_cached_profile", JSON.stringify(u));
        setProfile({
          isLoggedIn: true,
          name: u.name,
          nickname: u.nickname,
          avatar: u.avatar,
          tag: u.tag,
          university: u.university,
          major: u.major,
          studentId: u.id,
          gender: u.gender,
          birthday: u.birthday
        });
        setEditNickname(u.nickname);
        setEditMajor(u.major);
        setEditGender(u.gender);
        setEditBirthday(u.birthday);
        setEditAvatar(u.avatar);

        fetchReminders(u.id);
        fetchPosts(u.id);

        triggerSystemTip("注册成功并已自动登录！");
        
        // Reset fields
        setRegisterUsername("");
        setRegisterPassword("");
        setRegisterName("");
        setRegisterBirthday("");

        setScreen(ActiveScreen.MAIN);
        setNavTab(NavigationTab.PROFILE);
      })
      .catch((err: any) => {
        console.warn("注册接口请求失败，尝试本地 Mock 注册", err);
        // Fallback local registration
        const localId = `stud_${Date.now()}`;
        const newProfile = {
          isLoggedIn: true,
          name: registerName,
          nickname: `${registerName} (Student)`,
          avatar: "",
          tag: "认证学生",
          university: registerUniversity,
          major: "未指定",
          studentId: localId,
          gender: registerGender,
          birthday: registerBirthday
        };
        localStorage.setItem("service_community_user_id", localId);
        
        // Dynamic frontend persistence for offline registration
        const cachedProfileData = {
          id: localId,
          username: registerUsername,
          password: registerPassword,
          name: registerName,
          nickname: `${registerName} (Student)`,
          avatar: "",
          tag: "认证学生",
          university: registerUniversity,
          major: "未指定",
          gender: registerGender,
          birthday: registerBirthday
        };
        localStorage.setItem("local_cached_profile", JSON.stringify(cachedProfileData));

        setProfile(newProfile);
        setEditNickname(newProfile.nickname);
        setEditMajor(newProfile.major);
        setEditGender(newProfile.gender);
        setEditBirthday(newProfile.birthday);
        setEditAvatar(newProfile.avatar);

        // Add default reminder for new user
        const newRem = {
          id: "rem_visa",
          title: "在韩签证到期提醒 (留学生签)",
          date: "2026-12-15",
          time: "23:59",
          enabled: true
        };
        setReminders([newRem]);
        setActiveCountdownId("rem_visa");

        triggerSystemTip("本地体验模式注册成功并自动登录！");
        
        // Reset fields
        setRegisterUsername("");
        setRegisterPassword("");
        setRegisterName("");
        setRegisterBirthday("");

        setScreen(ActiveScreen.MAIN);
        setNavTab(NavigationTab.PROFILE);
      });
  };

  // Handle Adding Reminder
  const handleSaveReminder = () => {
    if (!newReminderTitle.trim()) {
      triggerSystemTip("请先填写倒计时标题，如: TOPIK考试");
      return;
    }

    const newId = `rem_${Date.now()}`;
    
    fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.studentId,
        id: newId,
        title: newReminderTitle,
        date: activeCalendarSelectedDate,
        time: newReminderTime || "12:00",
        enabled: newReminderNotice
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("保存失败！");
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          fetchReminders(profile.studentId);
          setActiveCountdownId(newId);
          triggerSystemTip(`提醒【${newReminderTitle}】保存成功并已标入日历与云端数据库！`);
          setNewReminderTitle("");
          setNewReminderTime("");
        }
      })
      .catch(() => {
        // Offline Fallback
        const newRem: CalendarReminder = {
          id: newId,
          title: newReminderTitle,
          date: activeCalendarSelectedDate,
          time: newReminderTime || "12:00",
          enabled: newReminderNotice
        };
        setReminders(prev => [...prev, newRem]);
        setActiveCountdownId(newId);
        triggerSystemTip(`提醒【${newReminderTitle}】保存成功（本地缓存）！`);
        setNewReminderTitle("");
        setNewReminderTime("");
      });
  };

  // Filter posts based on search query, tab filter, and hot topic
  const filteredPosts = useMemo(() => {
    let result = posts;
    
    if (communityFilter === "MINE") {
      result = result.filter(p => p.username === "张伟" || p.username === profile.name);
    } else if (communityFilter === "BOOKMARKED") {
      result = result.filter(p => p.isBookmarked);
    }

    if (selectedGlobalTopic) {
      result = result.filter(p => (p.text || "").includes(selectedGlobalTopic));
    }

    if (communitySearchQuery.trim()) {
      const query = communitySearchQuery.toLowerCase();
      result = result.filter(p => 
        (p.text || "").toLowerCase().includes(query) || (p.username || "").toLowerCase().includes(query)
      );
    }
    
    if (communitySortDir === "POPULAR") {
      return [...result].sort((a, b) => b.likes - a.likes);
    } else {
      return [...result]; // NEWEST (pre-sorted or manually added)
    }
  }, [posts, communitySearchQuery, communitySortDir, communityFilter, profile.name, selectedGlobalTopic]);

  // Dynamic Calendar Generator based on active calendarYear and calendarMonth states
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth - 1, 0).getDate();

    // Previous month filler days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = calendarMonth - 1 === 0 ? 12 : calendarMonth - 1;
      const y = calendarMonth - 1 === 0 ? calendarYear - 1 : calendarYear;
      const dateString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        dayNum: d,
        isCurrentMonth: false,
        fullDate: dateString,
        hasReminder: reminders.some(r => r.date === dateString),
        isSelected: activeCalendarSelectedDate === dateString
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        dayNum: i,
        isCurrentMonth: true,
        fullDate: dateString,
        hasReminder: reminders.some(r => r.date === dateString),
        isSelected: activeCalendarSelectedDate === dateString
      });
    }

    // Next month filler days to complete grid (pad to 35 or 42 cells total)
    const totalCells = days.length <= 35 ? 35 : 42;
    const nextMonthFillerCount = totalCells - days.length;
    for (let i = 1; i <= nextMonthFillerCount; i++) {
      const m = calendarMonth + 1 === 13 ? 1 : calendarMonth + 1;
      const y = calendarMonth + 1 === 13 ? calendarYear + 1 : calendarYear;
      const dateString = `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        dayNum: i,
        isCurrentMonth: false,
        fullDate: dateString,
        hasReminder: reminders.some(r => r.date === dateString),
        isSelected: activeCalendarSelectedDate === dateString
      });
    }

    return days;
  }, [reminders, activeCalendarSelectedDate, calendarYear, calendarMonth]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row justify-center items-stretch font-sans overflow-x-hidden p-0 md:p-6 text-slate-800">
      
      {/* Main viewport emulation wrapper */}
      <div className="relative w-full max-w-md bg-white border-0 md:border md:border-slate-200/80 rounded-none md:rounded-3xl shadow-none md:shadow-xl flex flex-col min-h-screen md:min-h-[850px] overflow-hidden">

        {/* ===== INFO DRAWER (Hamburger Menu) ===== */}
        <AnimatePresence>
          {showInfoDrawer && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                key="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
                onClick={() => setShowInfoDrawer(false)}
              />
              {/* Drawer panel */}
              <motion.div
                key="drawer-panel"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute top-0 left-0 bottom-0 w-[82%] max-w-xs bg-[#00685f] z-50 flex flex-col overflow-y-auto"
                style={{ borderRadius: "0 24px 24px 0" }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowInfoDrawer(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Drawer content */}
                <div className="flex flex-col flex-1 p-6 pt-8 text-white">
                  {/* Badge */}
                  <div className="flex items-center gap-3 mb-6 bg-teal-800/40 p-4 rounded-2xl border border-teal-700/50">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full animate-ping shrink-0"></span>
                    <div>
                      <h2 className="text-sm font-bold text-yellow-300">{t('cssa_aid')}</h2>
                      <p className="text-[11px] text-teal-100/90 leading-tight">Reliability &amp; Connection</p>
                    </div>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight mb-2">{t('app_title')}</h1>
                  <p className="text-xs text-teal-100/90 leading-relaxed mb-6">
                    {t('app_desc')}
                  </p>

                  {/* Language Switcher Section */}
                  <div className="mb-6 bg-teal-900/40 p-4 rounded-2xl border border-teal-700/50">
                    <label className="text-xs font-bold text-teal-200 block mb-2.5">
                      🌐 切换语言 / Language / 언어
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 bg-teal-950/60 p-1 rounded-xl border border-teal-700/40">
                      <button
                        onClick={() => setLanguage('zh')}
                        className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${
                          language === 'zh' ? 'bg-white text-[#00685f] shadow-md' : 'text-teal-100 hover:bg-white/10'
                        }`}
                      >
                        <span>🇨🇳</span>中文
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${
                          language === 'en' ? 'bg-white text-[#00685f] shadow-md' : 'text-teal-100 hover:bg-white/10'
                        }`}
                      >
                        <span>🇺🇸</span>EN
                      </button>
                      <button
                        onClick={() => setLanguage('ko')}
                        className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${
                          language === 'ko' ? 'bg-white text-[#00685f] shadow-md' : 'text-teal-100 hover:bg-white/10'
                        }`}
                      >
                        <span>🇰🇷</span>한국어
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="bg-teal-900/40 p-3 rounded-xl border border-teal-700/30 text-xs">
                      <span className="font-bold text-yellow-400 block mb-1">{t('feature_guides_title')}</span>
                      <p className="text-teal-200">{t('feature_guides_desc')}</p>
                    </div>

                    <div className="bg-teal-900/40 p-3 rounded-xl border border-teal-700/30 text-xs">
                      <span className="font-bold text-yellow-400 block mb-1">{t('feature_interactive_title')}</span>
                      <ul className="list-disc pl-4 text-teal-200 space-y-1">
                        <li>{t('feature_interactive_desc1')}</li>
                        <li>{t('feature_interactive_desc2')}</li>
                        <li>{t('feature_interactive_desc3')}</li>
                        <li>{t('feature_interactive_desc4')}</li>
                      </ul>
                    </div>

                    <div className="bg-teal-900/40 p-3 rounded-xl border border-teal-700/30 text-xs">
                      <span className="font-bold text-yellow-400 block mb-1">{t('feature_security_title')}</span>
                      <ul className="list-disc pl-4 text-teal-200 space-y-1">
                        <li>{t('feature_security_desc1')}</li>
                        <li>{t('feature_security_desc2')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Drawer footer */}
                <div className="px-6 pb-8 text-[10px] text-teal-200/80">
                  <div className="border-t border-teal-700/40 pt-4">
                    <p className="font-medium">{t('current_version')}</p>
                    <p className="mt-1">{t('student_project')}</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* ===== END INFO DRAWER ===== */}

        {/* ===== NOTIFICATION CENTER DRAWER ===== */}
        <AnimatePresence>
          {showNotificationDrawer && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                key="notification-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
                onClick={() => setShowNotificationDrawer(false)}
              />
              {/* Drawer panel */}
              <motion.div
                key="notification-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-50 z-50 flex flex-col overflow-hidden shadow-2xl"
                style={{ borderRadius: "24px 0 0 24px" }}
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#00685f] to-[#008378] text-white p-5 pb-6 shrink-0 relative">
                  {/* Close button */}
                  <button
                    onClick={() => setShowNotificationDrawer(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2.5 mt-2">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <Bell className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">{t('notifications')}</h2>
                      <p className="text-[11px] text-teal-100/90 leading-tight">
                        {notifications.length > 0 
                          ? (language === 'zh' ? `你有 ${notifications.length} 条通知` : language === 'ko' ? `${notifications.length}개의 알림이 있습니다` : `You have ${notifications.length} notifications`)
                          : t('no_notifications')}
                      </p>
                    </div>
                  </div>

                  {/* Actions Header Bar */}
                  {notifications.length > 0 && (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={handleMarkAllNotificationsAsRead}
                        className="flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold bg-white/15 hover:bg-white/25 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-teal-50"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        {t('mark_all_read')}
                      </button>
                      <button
                        onClick={handleClearAllNotifications}
                        className="py-1.5 px-3 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-rose-500/80 border border-white/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-rose-100 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-300 group-hover:text-white" />
                        {t('clear_all')}
                      </button>
                    </div>
                  )}
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Bell className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">{t('no_notifications')}</p>
                        <p className="text-[11px] text-slate-400 max-w-[200px] leading-normal mx-auto">
                          {language === 'zh' ? '当有其他同学给你的帖子点赞或回复时，通知会在这里显示。' : language === 'ko' ? '다른 학생들이 내 게시글을 좋아하거나 댓글을 달면 여기에 알림이 표시됩니다.' : 'Notifications will appear here when other students like or reply to your posts.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkNotificationAsRead(n.id)}
                        className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-3 group shadow-sm ${
                          n.isRead
                            ? "bg-white border-slate-100 hover:border-slate-200"
                            : "bg-teal-50/40 border-teal-100/70 hover:bg-teal-50/70"
                        }`}
                      >
                        {/* Unread indicator dot */}
                        {!n.isRead && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500 ring-4 ring-teal-100 animate-pulse" />
                        )}

                        {/* Top user row */}
                        <div className="flex items-center gap-3">
                          <img
                            src={n.senderAvatar}
                            alt={n.senderName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-100"
                          />
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{n.senderName}</span>
                              <span className="text-[11px] font-normal text-slate-500">
                                {n.type === "like" ? t('liked_post') : t('commented_post')}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {n.time}
                            </span>
                          </div>
                        </div>

                        {/* Reply content if type is comment */}
                        {n.type === "comment" && n.commentText && (
                          <div className="text-xs text-slate-700 bg-white/95 px-3 py-2.5 rounded-xl border border-slate-150/60 leading-relaxed font-medium">
                            {n.commentText}
                          </div>
                        )}

                        {/* Snippet of original post */}
                        <div className="text-[11px] text-slate-400 bg-slate-50 group-hover:bg-white transition-colors p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            {language === 'zh' ? '原帖片段' : language === 'ko' ? '원본 게시글' : 'Original Post'}
                          </span>
                          <p className="line-clamp-2 text-slate-500 italic font-normal">
                            "{n.postText}"
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* ===== END NOTIFICATION CENTER DRAWER ===== */}

        {/* Real-time Toast Alerts */}
        <AnimatePresence>
          {systemTip && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-4 right-4 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl z-50 shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{systemTip}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* SCREENS CONTROLLER */}
        {/* ---------------------------------------------------- */}
        <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
          
          {screen === ActiveScreen.GUIDE_DETAIL ? (
            // Category Guides Details screen
            <GuideDetail 
              category={activeGuideCategory}
              onBack={() => setScreen(ActiveScreen.MAIN)}
              onNavigateToForum={() => {
                setScreen(ActiveScreen.MAIN);
                setNavTab(NavigationTab.COMMUNITY);
              }}
              onNavigateToSchedule={() => {
                setScreen(ActiveScreen.CALENDAR);
              }}
              language={language}
            />
          ) : screen === ActiveScreen.PUBLISH ? (
            // Create/Publish Post Screen (Mockup 3)
            <div className="flex flex-col bg-[#f8f9ff] min-h-full">
              {/* Header */}
              <nav className="sticky top-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md w-full border-b border-outline-variant/30 flex justify-between items-center px-4 h-16">
                <button onClick={() => setScreen(ActiveScreen.MAIN)} className="flex items-center text-slate-500 hover:text-[#00685f] transition-colors gap-1">
                  <X className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t('cancel')}</span>
                </button>
                <h1 className="font-bold text-sm text-[15px] text-slate-800">{t('publish_title')}</h1>
                <button 
                  onClick={handlePublishPost}
                  className="bg-[#00685f] text-white hover:bg-[#005049] px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95"
                >
                  {t('publish_confirm')}
                </button>
              </nav>

              {/* Form Content */}
              <main className="flex-1 p-4 space-y-4">
                {/* Board Picker */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-bold text-slate-400">{t('select_topic')}</span>
                    <span className="text-[10px] text-[#00685f] bg-teal-50 px-1.5 py-0.5 rounded-full font-bold">{t('publish_confirm') === 'Publish' ? 'Required' : t('publish_confirm') === '게시하기' ? '필수' : '必选'}</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {(language === 'en' ? ["Campus Life", "Study Exchange", "Second-hand", "Q&A Help"] : language === 'ko' ? ["캠퍼스 생활", "학습 교류", "중고 거래", "질문 & 도움"] : ["校园生活", "学习交流", "闲置交易", "问答求助"]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewPostCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                          newPostCategory === cat 
                            ? "bg-[#008378] text-white border-transparent shadow-sm"
                            : "bg-white text-slate-650 border-slate-200/60 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Inputs Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                  <input 
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder={language === 'en' ? 'Title (optional)' : language === 'ko' ? '제목 (선택사항)' : '填写标题（可选）'}
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <hr className="border-slate-100" />
                  <textarea 
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs text-slate-600 placeholder:text-slate-300 resize-none min-h-[140px]"
                    placeholder={t('post_placeholder')}
                    rows={6}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />

                  {/* Thumbnail Preload Array */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {newPostAttachedPhotos.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                        <img 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover" 
                          src={url}
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={() => setNewPostAttachedPhotos(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-slate-900/65 text-white rounded-full p-1 leading-[0] hover:bg-slate-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => document.getElementById("local-photo-input")?.click()}
                      type="button"
                      className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span className="text-[10px]">{language === 'en' ? 'Add Photo' : language === 'ko' ? '사진 추가' : '添加照片'}</span>
                    </button>
                    <input 
                      id="local-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 4 * 1024 * 1024) {
                          triggerSystemTip(language === 'zh' ? "图片体积过大，请选择4MB以内的图片！" : "Image too large, please select under 4MB!");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          setNewPostAttachedPhotos(prev => [...prev, base64String]);
                          triggerSystemTip(language === 'zh' ? "本地照片读取成功，已添加至待上传队列！" : "Photo added successfully!");
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-bold text-slate-400">{language === 'en' ? 'Trending Topics' : language === 'ko' ? '인기 주제' : '热门话题'}</h3>
                    <button
                      onClick={() => setShowTopicInput(v => !v)}
                      className="text-[10px] text-[#008378] font-semibold flex items-center gap-0.5 hover:opacity-75"
                    >
                      <span className="text-sm leading-none font-bold">+</span>&nbsp;{language === 'en' ? 'Custom' : language === 'ko' ? '추가' : '自定义'}
                    </button>
                  </div>
                  {showTopicInput && (
                    <div className="flex gap-2 items-center">
                      <input
                        className="flex-1 border border-slate-200 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#008378]"
                        placeholder={language === 'en' ? '#MyTopic' : language === 'ko' ? '#나의화제' : '#自定义话题'}
                        value={topicInputValue}
                        onChange={e => setTopicInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && topicInputValue.trim()) {
                            const t = topicInputValue.trim().startsWith('#') ? topicInputValue.trim() : '#' + topicInputValue.trim();
                            setCustomTopics(prev => [...prev.filter(x => x !== t), t]);
                            setSelectedTopic(t);
                            setTopicInputValue('');
                            setShowTopicInput(false);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (topicInputValue.trim()) {
                            const t = topicInputValue.trim().startsWith('#') ? topicInputValue.trim() : '#' + topicInputValue.trim();
                            setCustomTopics(prev => [...prev.filter(x => x !== t), t]);
                            setSelectedTopic(t);
                            setTopicInputValue('');
                            setShowTopicInput(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#008378] text-white rounded-full text-[11px] font-medium"
                      >{language === 'en' ? 'Add' : language === 'ko' ? '추가' : '确定'}</button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...(language === 'en' ? ["#Seoul Eats", "#Visa Tips", "#Korean Study", "#Housing Tips"] : language === 'ko' ? ["#서울맛집", "#비자꿀팁", "#한국어공부", "#방구하기"] : ["#首尔探店", "#签证攻略", "#韩语备考", "#租房经验"]),
                      ...customTopics
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                          selectedTopic === topic
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="bg-white rounded-xl border border-slate-105 shadow-sm divide-y divide-slate-100">
                  <div
                    className="flex justify-between items-center p-3 cursor-pointer active:bg-slate-50 hover:bg-slate-50 transition-colors"
                    onClick={() => setShowLocationPicker(true)}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#00685f]" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{language === 'en' ? 'Add Location' : language === 'ko' ? '위치 추가' : '添加位置'}</p>
                        <p className="text-[10px] text-[#008378] mt-1 font-medium">{newPostLocation || (language === 'en' ? 'Tap to select' : language === 'ko' ? '탭하여 선택' : '点击选择')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-[#00685f]" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{language === 'en' ? 'Visibility' : language === 'ko' ? '공개 범위' : '可见范围'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{language === 'en' ? 'Visible to all' : language === 'ko' ? '모든 사람에게 공개' : '所有人公开可见'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">{language === 'en' ? 'Public' : language === 'ko' ? '공개' : '公开'} <ChevronRight className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Anonymous switch Toggle */}
                <div className="flex justify-between items-center p-3 bg-teal-50/40 rounded-xl border border-teal-100/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#00685f]" />
                    <span className="text-xs font-semibold text-slate-700">{language === 'en' ? 'Anonymous Post' : language === 'ko' ? '익명 게시' : '匿名发布'}</span>
                  </div>
                  <button 
                    onClick={() => setNewPostAnonymous(!newPostAnonymous)}
                    className={`w-10 h-6 rounded-full p-0.5 relative transition-colors duration-200 ${
                      newPostAnonymous ? "bg-[#008378]" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transformation transition-all duration-200 ${
                      newPostAnonymous ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </main>

              {/* Location Picker Bottom Sheet */}
              <AnimatePresence>
                {showLocationPicker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end"
                    onClick={() => setShowLocationPicker(false)}
                  >
                    <motion.div
                      initial={{ y: 300 }}
                      animate={{ y: 0 }}
                      exit={{ y: 300 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="w-full bg-white rounded-t-2xl p-5 pb-8 shadow-2xl"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                      <h3 className="font-bold text-sm text-slate-800 mb-4 text-center">
                        {language === 'en' ? 'Select Location' : language === 'ko' ? '위치 선택' : '选择位置'}
                      </h3>

                      {/* Custom Location Text Input */}
                      <div className="mb-4">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={language === 'en' ? 'Type custom location name...' : language === 'ko' ? '직접 위치 입력...' : '✍️ 手动输入任意自定义位置...'}
                            value={customLocationText}
                            onChange={e => setCustomLocationText(e.target.value)}
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#008378]"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && customLocationText.trim()) {
                                setNewPostLocation(customLocationText.trim());
                                setCustomLocationText("");
                                setShowLocationPicker(false);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (customLocationText.trim()) {
                                setNewPostLocation(customLocationText.trim());
                                setCustomLocationText("");
                                setShowLocationPicker(false);
                              }
                            }}
                            className="px-4 py-2 bg-[#008378] text-white rounded-xl text-xs font-semibold hover:bg-[#00685f] shrink-0"
                          >
                            {language === 'en' ? 'Confirm' : language === 'ko' ? '확인' : '确认'}
                          </button>
                        </div>
                      </div>

                      {/* Live Location Shortcut */}
                      <button
                        onClick={() => {
                          if (locationName && locationName !== "正在获取实时位置...") {
                            setNewPostLocation(locationName);
                            setShowLocationPicker(false);
                          } else {
                            triggerSystemTip(language === 'en' ? 'Retrieving live GPS coordinates...' : language === 'ko' ? '실시간 GPS 좌표를 조회 중입니다...' : '正在获取您的实时位置信息...');
                            fetchLiveLocation();
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100/80 mb-3 hover:bg-teal-100/40 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#008378] animate-bounce shrink-0" />
                          {language === 'en' ? 'Use Live Location' : language === 'ko' ? '현재 실시간 위치 사용' : '🌐 使用当前实时定位'}
                        </span>
                        <span className="text-[10px] text-teal-600 max-w-[150px] truncate font-medium">
                          {locationName}
                        </span>
                      </button>

                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {[
                          { label: language === 'en' ? 'Seoul - Sinchon/Yonsei' : language === 'ko' ? '서울 - 신촌/연세' : '首尔 · 新村/延世大学', value: language === 'zh' ? '首尔·新村' : 'Seoul · Sinchon' },
                          { label: language === 'en' ? 'Seoul - Hongik/Hapjeong' : language === 'ko' ? '서울 - 홍대/합정' : '首尔 · 弘大/合井', value: language === 'zh' ? '首尔·弘大' : 'Seoul · Hongik' },
                          { label: language === 'en' ? 'Seoul - Gwanak/SNU' : language === 'ko' ? '서울 - 관악/서울대' : '首尔 · 冠岳/首尔大学', value: language === 'zh' ? '首尔·冠岳' : 'Seoul · Gwanak' },
                          { label: language === 'en' ? 'Seoul - Mapo/Ewha' : language === 'ko' ? '서울 - 마포/이화' : '首尔 · 麻浦/梨花女大', value: language === 'zh' ? '首尔·梨大' : 'Seoul · Ewha' },
                          { label: language === 'en' ? 'Seoul - Gangnam' : language === 'ko' ? '서울 - 강남' : '首尔 · 江南', value: language === 'zh' ? '首尔·江南' : 'Seoul · Gangnam' },
                          { label: language === 'en' ? 'Seoul - Itaewon' : language === 'ko' ? '서울 - 이태원' : '首尔 · 梨泰院', value: language === 'zh' ? '首尔·梨泰院' : 'Seoul · Itaewon' },
                          { label: language === 'en' ? 'Busan' : language === 'ko' ? '부산' : '釜山', value: language === 'zh' ? '釜山' : 'Busan' },
                          { label: language === 'en' ? 'Daejeon/KAIST' : language === 'ko' ? '대전/카이스트' : '大田/KAIST', value: language === 'zh' ? '大田' : 'Daejeon' },
                          { label: language === 'en' ? 'Daegu/Kyungpook' : language === 'ko' ? '대구/경북대' : '大邱/庆北大学', value: language === 'zh' ? '大邱' : 'Daegu' },
                          { label: language === 'en' ? 'Incheon' : language === 'ko' ? '인천' : '仁川', value: language === 'zh' ? '仁川' : 'Incheon' },
                          { label: language === 'en' ? 'Jeju Island' : language === 'ko' ? '제주도' : '济州岛', value: language === 'zh' ? '济州岛' : 'Jeju' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setNewPostLocation(opt.value);
                              setShowLocationPicker(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                              newPostLocation === opt.value
                                ? 'bg-teal-50 text-[#008378] font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                            {newPostLocation === opt.value && <span className="float-right text-[#008378]">✓</span>}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Publish overlay */}
              <AnimatePresence>
                {showPublishSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs text-center border border-slate-100">
                      <div className="w-12 h-12 bg-teal-50 text-[#008378] rounded-full flex items-center justify-center mb-3">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-850 mb-1">{t('publish_success')}</h4>
                      <p className="text-[11px] text-slate-500">{language === 'en' ? 'Your post has been sent to the study community. Others will see it soon!' : language === 'ko' ? '게시물이 유학생 커뮤니티에 발송되었습니다. 곧 다른 분들이 볼 수 있습니다!' : '你的帖子已经火速发送至留学大家庭，其他人很快就能看到啦！'}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : screen === ActiveScreen.CALENDAR ? (
            // Calendar Screen ("日程安排" - Mockup 6)
            <div className="flex flex-col bg-[#f8f9ff] min-h-full">
              {/* Header */}
              <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                  <button onClick={() => setScreen(ActiveScreen.MAIN)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#00685f]" />
                  </button>
                  <h1 className="font-bold text-base text-[#00685f]">{t('calendar_header')}</h1>
                </div>
                <button 
                  onClick={() => {
                    if (!profile.isLoggedIn) {
                      triggerSystemTip(language === 'zh' ? "请先登录查看通知！" : language === 'ko' ? "알림을 확인하려면 먼저 로그인하세요!" : "Please log in to view notifications!");
                      setScreen(ActiveScreen.LOGIN);
                    } else {
                      setShowNotificationDrawer(true);
                    }
                  }}
                  className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
                >
                  <Bell className="w-5 h-5 text-[#00685f]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </header>

              {/* Calendar Grid & Logic */}
              <main className="p-4 space-y-4 flex-1">
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-150/70">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-sm text-slate-800">{language === 'en' ? `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][calendarMonth-1]} ${calendarYear}` : language === 'ko' ? `${calendarYear}년 ${calendarMonth}월` : `${calendarYear}年 ${calendarMonth}月`}</h2>
                    <div className="flex gap-1.5">
                      <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded transition-colors" title={language === 'en' ? 'Previous Month' : language === 'ko' ? '이전 달' : '上一个月'}>
                        <ChevronDown className="w-4 h-4 rotate-90 text-slate-500" />
                      </button>
                      <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded transition-colors" title={language === 'en' ? 'Next Month' : language === 'ko' ? '다음 달' : '下一个月'}>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Weekday */}
                  <div className="grid grid-cols-7 text-center font-bold text-[10px] text-slate-400 mb-2">
                    {(language === 'en' ? ['Su','Mo','Tu','We','Th','Fr','Sa'] : language === 'ko' ? ['일','월','화','수','목','금','토'] : ['日','一','二','三','四','五','六']).map(d => <div key={d}>{d}</div>)}
                  </div>

                  {/* Calendar Grid cells */}
                  <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
                    {calendarDays.map((cell, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActiveCalendarSelectedDate(cell.fullDate);
                        }}
                        className={`h-9 flex flex-col items-center justify-center rounded-xl cursor-pointer relative transition-all ${
                          cell.isSelected ? "bg-[#00685f] text-white font-bold font-semibold shadow-sm" :
                          !cell.isCurrentMonth ? "text-slate-300 hover:bg-slate-50" :
                          "text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {cell.dayNum}
                        {cell.hasReminder && (
                          <span className={`absolute bottom-1 w-1 h-1 rounded-full ${
                            cell.isSelected ? "bg-yellow-300" : "bg-teal-500"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Form to Add Countdown */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-150/70 space-y-4">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-[#00685f]" />
                    <h3 className="font-bold text-sm text-slate-850">{t('add_reminder')}</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 font-bold">{t('event_title')}</span>
                      <input 
                        type="text"
                        placeholder={language === 'en' ? 'E.g. TOPIK Exam Registration' : language === 'ko' ? '예: 토픽 시험 등록' : '例如: TOPIK 考试注册'}
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#00685f] focus:bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1 font-bold">{t('date')}</span>
                        <input 
                          type="text"
                          readOnly
                          value={activeCalendarSelectedDate}
                          className="w-full bg-slate-100 border border-slate-200/85 rounded-xl px-3 py-2 text-xs text-slate-550 select-none cursor-not-allowed font-medium"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1 font-bold">{t('time')}</span>
                        <input 
                          type="time"
                          value={newReminderTime}
                          onChange={(e) => setNewReminderTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    {/* Notice Toggle */}
                    <div className="flex justify-between items-center py-1.5 border-t border-slate-50 mt-2">
                      <div className="text-[11px] leading-tight">
                        <p className="font-semibold text-slate-700">开启通知提醒</p>
                        <p className="text-slate-450 mt-0.5">在事件开始前1小时通知我</p>
                      </div>
                      <button 
                        onClick={() => setNewReminderNotice(!newReminderNotice)}
                        className={`w-10 h-5.5 rounded-full p-0.5 relative transition-colors duration-200 ${
                          newReminderNotice ? "bg-[#008378]" : "bg-slate-350"
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transformation transition-all duration-200 ${
                          newReminderNotice ? "translate-x-4.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button 
                    onClick={handleSaveReminder}
                    className="w-full bg-[#00685f] hover:bg-[#005049] text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-transform active:scale-97 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {language === 'en' ? 'Save Reminder' : language === 'ko' ? '일정 저장' : '保存倒计时'}
                  </button>
                </section>

                {/* Display Reminders List */}
                <section className="space-y-2">
                  <h3 className="text-[11px] font-bold text-slate-400 px-1">{language === 'en' ? 'Current Reminders' : language === 'ko' ? '현재 일정 목록' : '当前倒计时提醒日程'}</h3>
                  <div className="space-y-2.5">
                    {reminders.map((rem) => (
                      <div key={rem.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{rem.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{language === 'en' ? 'Date: ' : language === 'ko' ? '날짜: ' : '指定日期：'}{rem.date} {rem.time}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">{language === 'en' ? 'Active' : language === 'ko' ? '활성' : '未到期'}</span>
                          <button 
                            onClick={() => {
                              fetch(`/api/reminders/${rem.id}`, { method: "DELETE" })
                                .then(res => {
                                  if (!res.ok) {
                                    throw new Error("删除失败！");
                                  }
                                  return res.json();
                                })
                                .then(data => {
                                  if (data.success) {
                                    setReminders(prev => prev.filter(r => r.id !== rem.id));
                                    triggerSystemTip("日历条目已从云端数据库成功删除！");
                                  }
                                })
                                .catch(() => {
                                  setReminders(prev => prev.filter(r => r.id !== rem.id));
                                  triggerSystemTip("日历条目已成功删除（本地缓存）");
                                });
                            }}
                            className="p-1 hover:bg-slate-100 text-slate-350 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          ) : screen === ActiveScreen.EDIT_PROFILE ? (
            // Edit Profile Details screen (Mockup 8)
            <div className="flex flex-col bg-[#f8f9ff] min-h-full">
              <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <button onClick={() => setScreen(ActiveScreen.MAIN)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#00685f]" />
                  </button>
                  <h1 className="font-bold text-base text-[#00685f]">{t('edit_profile')}</h1>
                </div>
                <button 
                  onClick={() => {
                    if (!profile.isLoggedIn) {
                      triggerSystemTip(language === 'zh' ? "请先登录查看通知！" : language === 'ko' ? "알림을 확인하려면 먼저 로그인하세요!" : "Please log in to view notifications!");
                      setScreen(ActiveScreen.LOGIN);
                    } else {
                      setShowNotificationDrawer(true);
                    }
                  }}
                  className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
                >
                  <Bell className="w-5 h-5 text-[#00685f]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </header>

              <main className="p-4 space-y-5 flex-1 max-w-md mx-auto w-full">
                {/* Visual Avatar upload box */}
                <section className="flex flex-col items-center py-2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white ambient-shadow overflow-hidden bg-slate-200 flex items-center justify-center">
                      {editAvatar ? (
                        <img 
                          alt={profile.name} 
                          className="w-full h-full object-cover" 
                          src={editAvatar}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00685f] to-[#009b8d] text-white font-bold text-3xl uppercase">
                          {profile.name ? profile.name.charAt(0) : "校"}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute bottom-1 right-1 bg-[#00685f] text-white p-2 rounded-full shadow border-2 border-white active:scale-90 transition-transform cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-1 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    <Shield className="w-3.5 h-3.5 text-[#00685f] fill-teal-100" />
                    <span className="text-[#00685f] font-bold text-[10px]">{language === 'en' ? 'Student ID Verified' : language === 'ko' ? '학적 실명 인증 완료' : '已通过学籍实名认证'}</span>
                  </div>
                </section>

                {/* Form fields */}
                <section className="space-y-4">
                  {/* Nickname input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 pl-1">{t('nickname')}</label>
                    <input 
                      type="text" 
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#00685f] shadow-sm font-semibold"
                    />
                  </div>

                  {/* University read-only card */}
                  <div className="space-y-1 opacity-85">
                    <label className="text-xs font-bold text-slate-400 pl-1">{t('university')}</label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 flex items-center gap-2 cursor-not-allowed">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold">{profile.university}</span>
                    </div>
                  </div>

                  {/* Major input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 pl-1">{t('major')}</label>
                    <input 
                      type="text" 
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#00685f] shadow-sm font-semibold"
                    />
                  </div>

                  {/* Student ID Non-editable block */}
                  <div className="space-y-1 opacity-85">
                    <label className="text-xs font-bold text-slate-400 pl-1">{t('student_id')}</label>
                    <div className="w-full bg-slate-100 border border-slate-200 border-dashed rounded-xl px-3 py-2.5 text-xs text-slate-500 font-semibold cursor-not-allowed">
                      {profile.studentId}
                    </div>
                    <p className="text-[9px] text-slate-400 pl-1 mt-0.5">{language === 'en' ? '⚠️ Student ID is bound. Contact Seoul Center offline to change.' : language === 'ko' ? '⚠️ 학번이 인증 완료된 정보입니다. 변경을 원하시면 서울센터 담당자에게 문의하세요.' : '⚠️ 留学学籍信息已绑定，若需换绑请线下联系首尔中心顾问人员。'}</p>
                  </div>

                  {/* Gender and Birthday Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">{t('gender')}</label>
                      <select 
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-700 cursor-pointer shadow-sm outline-none"
                      >
                        <option>{language === 'en' ? 'Male' : language === 'ko' ? '남자' : '男 (Male)'}</option>
                        <option>{language === 'en' ? 'Female' : language === 'ko' ? '여자' : '女 (Female)'}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">{t('birthday')}</label>
                      <input 
                        type="date"
                        value={editBirthday}
                        onChange={(e) => setEditBirthday(e.target.value)}
                        className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-700 shadow-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* Save block */}
                <section className="pt-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="w-full bg-[#00685f] hover:bg-[#005049] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-transform active:scale-97"
                  >
                    {t('save_changes')}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">{language === 'en' ? 'Profile changes take effect immediately across all panels.' : language === 'ko' ? '프로필 변경사항은 모든 서비스 패널에 즉시 반영됩니다.' : '资料修改通常在所有服务面板内即时生效'}</p>
                </section>
              </main>

              {/* Curated Illustrated Avatar Selection Modal */}
              <AnimatePresence>
                {showAvatarModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop with blurring effect */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAvatarModal(false)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    {/* Premium Card Container */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="relative bg-white rounded-2xl p-5 shadow-xl w-full max-w-sm overflow-hidden z-10 border border-slate-100 flex flex-col gap-4"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-[#00685f]" />
                          <span>{language === 'en' ? 'Choose Avatar' : language === 'ko' ? '프로필 사진 선택' : '选择个性头像'}</span>
                        </h3>
                        <button 
                          onClick={() => setShowAvatarModal(false)}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Presets Grid */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-[#00685f] uppercase tracking-wide">{language === 'en' ? 'Curated Presets' : language === 'ko' ? '추천 프리셋' : '推荐精美预设'}</p>
                        <div className="grid grid-cols-4 gap-2.5">
                          {PRESET_AVATARS.map((url, idx) => {
                            const isSelected = editAvatar === url;
                            return (
                              <button
                                key={idx}
                                onClick={() => setEditAvatar(url)}
                                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all active:scale-90 shrink-0 ${
                                  isSelected ? 'border-[#00685f] ring-2 ring-[#00685f]/30' : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <img 
                                  src={url} 
                                  alt={`Preset ${idx + 1}`} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#00685f]/15 flex items-center justify-center">
                                    <div className="bg-[#00685f] text-white p-0.5 rounded-full">
                                      <Check className="w-2.5 h-2.5" />
                                    </div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Input */}
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-bold text-[#00685f] uppercase tracking-wide">{language === 'en' ? 'Custom Avatar URL' : language === 'ko' ? '커스텀 URL 입력' : '自定义头像网址'}</p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder={language === 'en' ? 'Enter image URL...' : language === 'ko' ? '이미지 URL 입력...' : '输入外部图片 URL 网址...'}
                            value={editAvatar && !PRESET_AVATARS.includes(editAvatar) ? editAvatar : ""}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-[#00685f] focus:bg-white font-medium"
                          />
                          {editAvatar && !PRESET_AVATARS.includes(editAvatar) && (
                            <button 
                              onClick={() => setEditAvatar("")}
                              className="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                            >
                              清除
                            </button>
                          )}
                        </div>

                        {/* High fidelity image preview */}
                        {editAvatar && !PRESET_AVATARS.includes(editAvatar) && (
                          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-150/60 mt-1.5 animate-fadeIn">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-200 flex-shrink-0">
                              <img 
                                src={editAvatar} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { 
                                  // Fallback placeholder on image load error
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'; 
                                }} 
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{language === 'en' ? 'Live Preview' : language === 'ko' ? '미리보기' : '预览效果'}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-3 pt-2.5 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setEditAvatar(profile.avatar);
                            setShowAvatarModal(false);
                          }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          onClick={() => setShowAvatarModal(false)}
                          className="flex-1 bg-[#00685f] hover:bg-[#005049] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all active:scale-97"
                        >
                          {language === 'en' ? 'Apply' : language === 'ko' ? '적용하기' : '确定使用'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : screen === ActiveScreen.LOGIN ? (
            // Full Login Flow block (Mockup 7)
            <div className="flex flex-col bg-[#f8f9ff] min-h-full">
              {/* Goback header */}
              <header className="w-full h-16 flex items-center px-4 bg-white sticky top-0 z-50 border-b border-slate-100">
                <button 
                  onClick={() => setScreen(ActiveScreen.MAIN)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-800" />
                </button>
              </header>

              <main className="w-full p-6 flex-1 flex flex-col justify-between max-w-sm mx-auto">
                <div className="space-y-6">
                  {/* Headline welcomes */}
                  <div>
                    <h1 className="font-bold text-xl text-slate-900 mb-1.5 font-sans tracking-tight">{t('welcome_back')}</h1>
                    <p className="text-xs text-slate-500">{t('login_subtitle')}</p>
                  </div>

                  {/* Database Cloud Sync Status Diagnostic Banner */}
                  {dbDiagnostic.tested && !dbDiagnostic.connected && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⚠️</span>
                        <div className="flex-1">
                          <span className="text-xs font-black text-amber-800 block">
                            当前运行模式：本地体验版
                          </span>
                          <span className="text-[10px] text-amber-600 block mt-0.5 leading-normal font-medium">
                            由于系统未成功连接到云端数据库，在此模式下注册创建的账号<strong>无法在其他设备登录</strong>。
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDbInfoModal(true)}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[10px] py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🛠️</span> 查看原因与云端配置恢复指引
                      </button>
                    </div>
                  )}

                  {/* Form inputs */}
                  <div className="space-y-4">
                    {/* Username Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">{t('username_label')}</label>
                      <input 
                        type="text" 
                        placeholder={t('username_placeholder')}
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
                    </div>

                    {/* Password Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">{t('password_label')}</label>
                      <input 
                        type="password" 
                        placeholder={t('password_placeholder')}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
                    </div>

                    {loginError && (
                      <p className="text-[11px] text-red-500 leading-none pl-1">⚠️ {loginError}</p>
                    )}

                    {/* Consents checkbox */}
                    <div className="flex items-start gap-2 pt-1 pb-2">
                      <input 
                        type="checkbox"
                        id="agreeTerm"
                        checked={loginAgreed}
                        onChange={(e) => setLoginAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#00685f] focus:ring-[#00685f]" 
                      />
                      <label htmlFor="agreeTerm" className="text-[10px] text-slate-500 leading-tight">
                        {language === 'en' ? (
                          <>I have carefully read and agree to the <a className="text-[#00685f] font-semibold hover:underline" href="#">Terms of Service</a>, <a className="text-[#00685f] font-semibold hover:underline" href="#">Privacy Policy</a> and <a className="text-[#00685f] font-semibold hover:underline" href="#">Student Aid Disclaimer</a>.</>
                        ) : language === 'ko' ? (
                          <>저는 <a className="text-[#00685f] font-semibold hover:underline" href="#">이용 약관</a>, <a className="text-[#00685f] font-semibold hover:underline" href="#">개인정보 체챘</a> 및 <a className="text-[#00685f] font-semibold hover:underline" href="#">유학생 지원 면제 조항</a>을 좋송합니다.</>
                        ) : (
                          <>수인하고 완전히 동의하는 <a className="text-[#00685f] font-semibold hover:underline" href="#">《用户服务协议》</a>、<a className="text-[#00685f] font-semibold hover:underline" href="#">《个人隐私申明政策》</a> 以及在韩应急 <a className="text-[#00685f] font-semibold hover:underline" href="#">《在韩学生援助免责权条款》</a></>
                        )}
                      </label>
                    </div>

                    {/* Submit Login */}
                    <button 
                      onClick={handleLoginSubmit}
                      className="w-full bg-[#00685f] hover:bg-[#005049] text-white font-bold py-3 text-xs rounded-xl shadow-md transition-transform active:scale-97"
                    >
                      {t('login_btn')}
                    </button>

                    {/* Go to Register Link */}
                    <div className="text-center pt-2">
                      <button 
                        onClick={() => {
                          setLoginError("");
                          setRegisterError("");
                          setScreen(ActiveScreen.REGISTER);
                        }}
                        className="text-xs font-bold text-[#00685f] hover:underline"
                      >
                        {t('dont_have_acct')} {t('register_now')}
                      </button>
                    </div>
                  </div>
                </div>

              </main>

              {/* Backing branding logo */}
              <footer className="py-6 text-center select-none opacity-50 text-[11px]">
                <p className="font-bold text-[#00685f] flex items-center justify-center gap-1">{t('student_project')}</p>
                <p className="text-slate-400">Reliability & Connection in Korea</p>
              </footer>
            </div>
          ) : screen === ActiveScreen.REGISTER ? (
            // Full Registration Flow block
            <div className="flex flex-col bg-[#f8f9ff] min-h-full">
              {/* Goback header */}
              <header className="w-full h-16 flex items-center px-4 bg-white sticky top-0 z-50 border-b border-slate-100">
                <button 
                  onClick={() => setScreen(ActiveScreen.LOGIN)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-800" />
                </button>
              </header>

              <main className="w-full p-6 flex-1 flex flex-col justify-between max-w-sm mx-auto">
                <div className="space-y-6">
                  {/* Headline welcomes */}
                  <div>
                    <h1 className="font-bold text-xl text-slate-900 mb-1.5 font-sans tracking-tight">{t('new_user_reg')}</h1>
                    <p className="text-xs text-slate-500">{t('register_subtitle')}</p>
                  </div>

                  {/* Form inputs */}
                  <div className="space-y-4">
                    {/* Username Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">1. {t('username_label')}</label>
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? 'Letters or numbers, e.g. testuser' : language === 'ko' ? '영문 또는 숫자, 예: testuser' : '英文或数字，如 testuser'}
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
                    </div>

                    {/* Password Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">2. {t('password_label')}</label>
                      <input 
                        type="password" 
                        placeholder={language === 'en' ? 'At least 6 characters' : language === 'ko' ? '6자 이상 비밀번호' : '不少于6位密码'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
                    </div>

                    {/* Name Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">3. {t('name')}</label>
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? 'Enter your real name, e.g. Li Hua' : language === 'ko' ? '실명을 입력하세요, 예: 이화' : '请输入真实姓名，如 李华'}
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
                    </div>

                    {/* University Block */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 pl-1">4. {t('university')}</label>
                      <select 
                        value={registerUniversity}
                        onChange={(e) => setRegisterUniversity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f]"
                      >
                        <option value="首尔大学">首尔大学 (Seoul National University)</option>
                        <option value="延世大学">延世大学 (Yonsei University)</option>
                        <option value="高丽大学">高丽大学 (Korea University)</option>
                        <option value="梨花女子大学">梨花女子大学 (Ewha Womans University)</option>
                        <option value="庆熙大学">庆熙大学 (Kyung Hee University)</option>
                        <option value="汉阳大学">汉阳大学 (Hanyang University)</option>
                        <option value="成均馆大学">成均馆大学 (Sungkyunkwan University)</option>
                        <option value="中央大学">中央大学 (Chung-Ang University)</option>
                        <option value="西江大学">西江大学 (Sogang University)</option>
                        <option value="建国大学">建国大学 (Konkuk University)</option>
                        <option value="釜山大学">釜山大学 (Pusan National University)</option>
                        <option value="其他高校">{language === 'en' ? 'Other University' : language === 'ko' ? '기타 대학교' : '其他高校'}</option>
                      </select>
                    </div>

                    {/* Gender and Birthday Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 pl-1">5. {t('gender')}</label>
                        <select 
                          value={registerGender}
                          onChange={(e) => setRegisterGender(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f]"
                        >
                          <option value="男 (Male)">{language === 'en' ? 'Male' : language === 'ko' ? '남자' : '男 (Male)'}</option>
                          <option value="女 (Female)">{language === 'en' ? 'Female' : language === 'ko' ? '여자' : '女 (Female)'}</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 pl-1">6. {t('birthday')}</label>
                        <input 
                          type="date"
                          value={registerBirthday}
                          onChange={(e) => setRegisterBirthday(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f]"
                        />
                      </div>
                    </div>

                    {registerError && (
                      <p className="text-[11px] text-red-500 leading-none pl-1">⚠️ {registerError}</p>
                    )}

                    {/* Consents checkbox */}
                    <div className="flex items-start gap-2 pt-1 pb-2">
                      <input 
                        type="checkbox"
                        id="agreeTermReg"
                        checked={loginAgreed}
                        onChange={(e) => setLoginAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#00685f] focus:ring-[#00685f]" 
                      />
                      <label htmlFor="agreeTermReg" className="text-[10px] text-slate-500 leading-tight">
                        我已认真阅读并完全同意中国学联联手制定的 <a className="text-[#00685f] font-semibold hover:underline" href="#">《用户服务协议》</a> 并在注册完成后自动赠予新会员初始1000.00元电子钱包迎新额度。
                      </label>
                    </div>

                    {/* Submit Register */}
                    <button 
                      onClick={handleRegisterSubmit}
                      className="w-full bg-[#00685f] hover:bg-[#005049] text-white font-bold py-3 text-xs rounded-xl shadow-md transition-transform active:scale-97"
                    >
                      {t('register_btn')}
                    </button>

                    {/* Go to Login Link */}
                    <div className="text-center pt-2">
                      <button 
                        onClick={() => {
                          setLoginError("");
                          setRegisterError("");
                          setScreen(ActiveScreen.LOGIN);
                        }}
                        className="text-xs font-bold text-[#00685f] hover:underline"
                      >
                        {t('already_have_acct')} {language === 'en' ? 'Sign In' : language === 'ko' ? '로그인' : '立即返回登录'}
                      </button>
                    </div>
                  </div>
                </div>
              </main>

              {/* Backing branding logo */}
              <footer className="py-6 text-center select-none opacity-50 text-[11px] mt-6">
                <p className="font-bold text-[#00685f] flex items-center justify-center gap-1">{t('student_project')}</p>
                <p className="text-slate-400">Reliability & Connection in Korea</p>
              </footer>
            </div>
          ) : (
            // MAIN SPA TABS (HOME, COMMUNITY, PROFILE)
            <div>
              
              {/* ----------------- TAB 1: HOME (留学指南) ----------------- */}
              {navTab === NavigationTab.HOME && (
                <div className="space-y-5">
                  {/* Custom Header */}
                  <header className="bg-white px-4 h-16 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <Menu className="w-6 h-6 text-[#00685f] cursor-pointer" onClick={() => setShowInfoDrawer(true)} />
                      <h1 className="font-bold text-lg text-[#00685f] tracking-tight">{t('home_header')}</h1>
                    </div>
                    <button 
                      onClick={() => {
                        if (!profile.isLoggedIn) {
                          triggerSystemTip(language === 'zh' ? "请先登录查看通知！" : language === 'ko' ? "알림을 확인하려면 먼저 로그인하세요!" : "Please log in to view notifications!");
                          setScreen(ActiveScreen.LOGIN);
                        } else {
                          setShowNotificationDrawer(true);
                        }
                      }}
                      className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
                    >
                      <Bell className="w-5 h-5 text-[#00685f]" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </header>

                  <div className="px-4 space-y-5">
                    {/* Visa Warning Alert Banner Card (Mockup 5) */}
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-[#00685f] to-[#008378] p-5 text-white shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="text-[11px] uppercase tracking-wider font-bold text-teal-100 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 inline text-yellow-300" />
                            {reminders.length === 0 ? (language === 'zh' ? "暂无倒数日程" : language === 'ko' ? "디데이 일정 없음" : "No Countdown Schedule") : activeReminder.id === "rem_visa" || activeReminder.title.includes("签证")
                              ? (language === 'zh' ? "在韩签证到期提醒倒计时" : language === 'ko' ? "재한 비자 만료 디데이" : "Visa Expiry D-Day Countdown")
                              : `${activeReminder.title} ${language === 'zh' ? '提醒倒计时' : language === 'ko' ? '디데이' : 'Countdown'}`}
                          </h4>
                          <h2 className="text-xs text-white opacity-95">
                            {reminders.length === 0 ? (language === 'zh' ? "在日历中添加考试、学费缴纳等重要提醒" : language === 'ko' ? "캘린더에서 시험, 학비 납부 등 중요 일정을 추가하세요" : "Add reminders for exams, tuition fees, etc.") : activeReminder.id === "rem_visa"
                              ? `${language === 'zh' ? '到期日：2026年12月15日 (留学生签)' : language === 'ko' ? '만료일: 2026년 12월 15일 (D-2 비자)' : 'Due Date: Dec 15, 2026 (D-2 Visa)'}`
                              : `${language === 'zh' ? '到期日：' : language === 'ko' ? '만료일: ' : 'Due Date: '}${activeReminder.date} (${activeReminder.time})`}
                          </h2>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {reminders.length > 1 && (
                            <div className="flex items-center gap-1 bg-black/15 hover:bg-black/25 rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-all">
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
                          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
                            {language === 'zh' ? '倒数日' : language === 'ko' ? '디데이' : 'D-Day'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black text-white leading-none tracking-tight">
                            {reminders.length === 0 ? "—" : nextReminderCountdownDays}
                          </span>
                          <span className="text-sm font-semibold text-teal-200">{t('days')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setScreen(ActiveScreen.CALENDAR)}
                        className="w-full bg-white hover:bg-slate-50 text-[#00685f] py-3.5 text-xs font-bold rounded-xl transition-all shadow-sm text-center cursor-pointer"
                      >
                        {reminders.length === 0 ? (language === 'zh' ? "去日历添加提醒" : language === 'ko' ? "캘린더로 이동하여 추가" : "Go to Calendar") : t('view_full_calendar')}
                      </button>
                    </section>

                    {/* Grid Core Services tiles (Bento, Asymmetrical) */}
                    <section className="space-y-3">
                      <div className="flex justify-between items-baseline px-1">
                        <h3 className="font-bold text-sm text-slate-800 tracking-tight">{t('core_services')}</h3>
                        <span className="text-[10px] font-bold text-[#00685f] cursor-pointer">
                          {language === 'zh' ? '全套指南' : language === 'ko' ? '전체 가이드' : 'All Guides'}
                        </span>
                      </div>

                      {/* Custom Redesigned KNU Samcheok Premium Entrance Banner */}
                      <div 
                        onClick={() => {
                          setActiveGuideCategory(GuideCategory.KNU);
                          setScreen(ActiveScreen.GUIDE_DETAIL);
                        }}
                        className="bg-gradient-to-br from-[#00685f]/5 via-[#00685f]/8 to-[#fea619]/5 border border-[#00685f]/20 hover:border-[#00685f]/40 p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between min-h-[120px] active:scale-[0.99] shadow-sm"
                      >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#fea619] rounded-full blur-2xl opacity-10 -mr-6 -mt-6"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-300 rounded-full blur-2xl opacity-10 -ml-6 -mb-6"></div>
                        
                        <div className="relative z-10 flex flex-col justify-between h-full gap-2">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00685f] text-white flex items-center gap-1">
                                  <span className="w-1 h-1 bg-[#fea619] rounded-full animate-ping"></span>
                                  {language === 'zh' ? '专属特区' : language === 'ko' ? '삼척 캠퍼스' : 'KNU Samcheok'}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full">
                                  {language === 'zh' ? '官方同步' : language === 'ko' ? '실시간 동기화' : 'Synced'}
                                </span>
                              </div>
                              <h4 className="text-sm font-black text-[#00685f] leading-snug tracking-tight">
                                {language === 'zh' ? '江原大学三陟校区' : language === 'ko' ? '강원대학교 삼척캠퍼스' : 'KNU Samcheok Campus'}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed max-w-[280px]">
                                {language === 'zh' ? '为在韩三陟校区留学生量身定制的46项办事、学校系统与周边生活图文指南。' : language === 'ko' ? '삼척캠퍼스 유학생들을 위해 마련된 46가지 맞춤형 종합 행정 및 대학 생활 정보.' : 'Complete trilingual guide covering 46 academic, administration, and campus life items.'}
                              </p>
                            </div>

                            <div className="w-9 h-9 rounded-full bg-white group-hover:bg-[#00685f] flex items-center justify-center border border-[#00685f]/10 group-hover:border-[#00685f] shrink-0 shadow-sm group-hover:shadow-md transition-all self-center">
                              <span className="text-base font-black text-[#00685f] group-hover:text-white group-hover:translate-x-0.5 transition-all">
                                →
                              </span>
                            </div>
                          </div>

                          {/* Stat Highlights Row */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/40 relative z-10 text-[9px] font-bold text-[#00685f]/80">
                            <span className="bg-[#00685f]/5 px-2 py-0.5 rounded-md">✦ 46项全能图文</span>
                            <span className="bg-[#00685f]/5 px-2 py-0.5 rounded-md">✦ 智能列表勾选</span>
                            <span className="bg-[#00685f]/5 px-2 py-0.5 rounded-md">✦ 原生流畅交互</span>
                          </div>
                        </div>
                      </div>

                      {/* Asymmetric Bento Layout grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { 
                            category: GuideCategory.INSURANCE, 
                            name: t('guide_insurance'), 
                            desc: language === 'zh' ? 'NHI在学机制' : language === 'ko' ? '재학 자동 가입' : 'NHI Auto-Enrollment', 
                            color: "bg-teal-50 text-teal-700 border-teal-100", 
                            label: language === 'zh' ? '保险缴清' : language === 'ko' ? '보험 완납' : 'Paid'
                          },
                          { 
                            category: GuideCategory.BANK, 
                            name: t('guide_bank'), 
                            desc: language === 'zh' ? '存折/借记卡' : language === 'ko' ? '통장/체크카드' : 'Debit Card', 
                            color: "bg-blue-50 text-blue-700 border-blue-100", 
                            label: language === 'zh' ? '开卡指南' : language === 'ko' ? '카드 개설' : 'Open Card'
                          },
                          { 
                            category: GuideCategory.ARC, 
                            name: t('guide_arc'), 
                            desc: language === 'zh' ? 'HiKorea预订' : language === 'ko' ? 'HiKorea 예약' : 'HiKorea Booking', 
                            color: "bg-emerald-50 text-emerald-800 border-emerald-100", 
                            label: language === 'zh' ? '长期必备' : language === 'ko' ? '장기 필수' : 'Required'
                          },
                          { 
                            category: GuideCategory.RECYCLE, 
                            name: t('guide_recycle'), 
                            desc: language === 'zh' ? '食品与一般袋' : language === 'ko' ? '음식물 및 일반 쓰레기' : 'Food & General Bags', 
                            color: "bg-amber-50/50 text-amber-700 border-amber-105", 
                            label: language === 'zh' ? '千万防罚' : language === 'ko' ? '벌금 주의' : 'Penalty Warn'
                          },
                          { 
                            category: GuideCategory.HOUSING, 
                            name: t('guide_housing'), 
                            desc: language === 'zh' ? '月租避坑/不动产' : language === 'ko' ? '월세 팁 및 부동산' : 'Rent Tips & Estate', 
                            color: "bg-indigo-50/60 text-indigo-700 border-indigo-100", 
                            label: language === 'zh' ? '合法迁入' : language === 'ko' ? '전입 신고' : 'Legal Move'
                          },
                          { 
                            category: GuideCategory.TRANSIT, 
                            name: t('guide_transit'), 
                            desc: language === 'zh' ? 'T-Money与换损' : language === 'ko' ? '티머니 및 환승 할인' : 'T-Money & Transfers', 
                            color: "bg-rose-50 text-rose-700 border-rose-100", 
                            label: language === 'zh' ? '出行无阻' : language === 'ko' ? '교통 안내' : 'Transit'
                          },
                          { 
                            category: GuideCategory.SHIPPING, 
                            name: t('guide_shipping'), 
                            desc: language === 'zh' ? 'EMS到包税货代' : language === 'ko' ? '국제 EMS 및 택배' : 'EMS & Shipping Agents', 
                            color: "bg-cyan-50 text-cyan-800 border-cyan-100", 
                            label: language === 'zh' ? '寄送加固' : language === 'ko' ? '포장 배송' : 'Shipping'
                          }
                        ].map((serv) => (
                          <div 
                            key={serv.category}
                            onClick={() => {
                              setActiveGuideCategory(serv.category);
                              setScreen(ActiveScreen.GUIDE_DETAIL);
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between min-h-[104px] relative overflow-hidden group ${serv.color}`}
                          >
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.25 rounded-md bg-white border border-black/5 inline-block mb-1.5 bg-opacity-70">{serv.label}</span>
                              <h4 className="text-xs font-bold leading-normal text-slate-800 group-hover:text-[#00685f]">{serv.name}</h4>
                            </div>
                            <div className="flex justify-between items-center text-[10px] opacity-75 pt-1.5">
                              <span>{serv.desc}</span>
                              <span className="text-base font-black leading-none group-hover:translate-x-1.5 transition-transform">→</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 2: COMMUNITY (社区热点) ----------------- */}
              {navTab === NavigationTab.COMMUNITY && (
                <div className="space-y-4">
                  {/* Top bar community */}
                  <header className="bg-white px-4 h-16 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100/60">
                    <div className="flex items-center gap-3">
                      <Menu className="w-6 h-6 text-[#00685f] cursor-pointer" onClick={() => setShowInfoDrawer(true)} />
                      <h1 className="font-bold text-lg text-[#00685f]">{t('community_header')}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (!profile.isLoggedIn) {
                            triggerSystemTip(language === 'zh' ? "请先登录查看通知！" : language === 'ko' ? "알림을 확인하려면 먼저 로그인하세요!" : "Please log in to view notifications!");
                            setScreen(ActiveScreen.LOGIN);
                          } else {
                            setShowNotificationDrawer(true);
                          }
                        }}
                        className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
                      >
                        <Bell className="w-5 h-5 text-[#00685f]" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </header>

                  <div className="px-4 space-y-4">
                    {/* Simplified Map Preview locator (Mockup 1) */}
                    <section className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm group border border-slate-200 bg-slate-50 flex items-center justify-center">
                      {locationLoading ? (
                        <div className="w-full h-full flex flex-col justify-center items-center bg-slate-50 animate-pulse">
                          <RefreshCw className="w-5 h-5 text-[#00685f] animate-spin mb-2" />
                          <span className="text-[11px] text-slate-500 font-medium tracking-wide">{t('locating')}</span>
                        </div>
                      ) : locationCoords ? (
                        <iframe
                          title="Real-time User Location"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationCoords.lon - 0.005}%2C${locationCoords.lat - 0.003}%2C${locationCoords.lon + 0.005}%2C${locationCoords.lat + 0.003}&layer=mapnik&marker=${locationCoords.lat}%2C${locationCoords.lon}`}
                          className="w-full h-full border-none grayscale-[5%] contrast-[105%] brightness-[98%]"
                        />
                      ) : (
                        <img 
                          className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-300"
                          src={MAP_IMAGE_URL}
                          alt="Korea Map fallback"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent h-12 pointer-events-none"></div>
                      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center z-10">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-bounce" />
                          <span className="text-[10px] font-bold text-white tracking-wide drop-shadow-md">
                            {language === 'en' ? 'Current: ' : language === 'ko' ? '현재: ' : '当前坐标：'}{locationName}
                          </span>
                        </div>
                        <button 
                          onClick={fetchLiveLocation}
                          title={language === 'en' ? 'Refresh Location' : language === 'ko' ? '위치 새로고침' : '刷新定位'}
                          className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 active:scale-90 flex items-center justify-center cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${locationLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </section>

                    {/* 热门话题 (Trending Hot Topics scroll pill bar) */}
                    <section className="space-y-1.5 px-0.5">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1 leading-none">
                          <Hash className="w-3.5 h-3.5 text-[#00685f]" />
                          {language === 'en' ? 'Trending Topics' : language === 'ko' ? '인기 주제' : '热门话题'}
                        </h3>
                        <button 
                          onClick={() => setShowManageTopics(true)}
                          className="text-[9px] text-[#008378] font-bold hover:underline bg-teal-50/50 hover:bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100/40 transition-colors flex items-center gap-0.5"
                        >
                          <span>⚙️</span>&nbsp;{language === 'en' ? 'Manage' : language === 'ko' ? '관리' : '管理话题'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                          onClick={() => setSelectedGlobalTopic(null)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                            selectedGlobalTopic === null
                              ? "bg-[#008378] text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {language === 'en' ? 'All' : language === 'ko' ? '전체' : '全部'}
                        </button>
                        {globalTopics.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedGlobalTopic(selectedGlobalTopic === t ? null : t)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                              selectedGlobalTopic === t
                                ? "bg-[#008378] text-white shadow-xs ring-2 ring-teal-100/80"
                                : "bg-slate-100 text-slate-605 hover:bg-slate-200"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Sorted dropdown filters */}
                    <section className="flex justify-between items-center">
                      {/* Search Bar Input */}
                      <div className="relative flex-1 max-w-[200px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder={t('search_placeholder')}
                          value={communitySearchQuery}
                          onChange={(e) => setCommunitySearchQuery(e.target.value)}
                          className="w-full bg-slate-100 border-none rounded-full pl-8 pr-3 py-1.5 text-[11px] focus:ring-1 focus:ring-[#00685f]"
                        />
                      </div>

                      {/* Sorting filter direction */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowSortDropdown(!showSortDropdown)}
                          className="text-[11px] font-bold text-[#00685f] hover:text-[#005049] flex items-center gap-0.5 cursor-pointer bg-teal-50 px-2.5 py-1.5 rounded-full"
                        >
                          {communitySortDir === "NEWEST" ? (language === 'en' ? 'Latest' : language === 'ko' ? '최신순' : '最新发布') : (language === 'en' ? 'Most Liked' : language === 'ko' ? '인기순' : '最多喜欢')}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {showSortDropdown && (
                          <div className="absolute right-0 top-8 bg-white border border-slate-150/80 rounded-xl shadow-lg z-50 py-1 divide-y divide-slate-50 w-24 text-[10px] font-bold">
                            <button 
                              onClick={() => {
                                setCommunitySortDir("NEWEST");
                                setShowSortDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              {language === 'en' ? 'Latest' : language === 'ko' ? '최신순' : '最新发布'}
                            </button>
                            <button 
                              onClick={() => {
                                setCommunitySortDir("POPULAR");
                                setShowSortDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              {language === 'en' ? 'Most Liked' : language === 'ko' ? '인기순' : '最多喜欢'}
                            </button>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Community dynamic filter pills */}
                    <div className="bg-slate-100/70 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
                      <button
                        onClick={() => {
                          setCommunityFilter("ALL");
                          triggerSystemTip("显示首尔校区【全部校友动态】");
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          communityFilter === "ALL"
                            ? "bg-white text-[#00685f] shadow-xs"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        全部 ({posts.length})
                      </button>
                      <button
                        onClick={() => {
                          if (profile.isLoggedIn) {
                            setCommunityFilter("MINE");
                            triggerSystemTip("已为您筛选出首尔校区【我的发布】");
                          } else {
                            triggerSystemTip("请登录后查看您的发布！");
                            setScreen(ActiveScreen.LOGIN);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          communityFilter === "MINE"
                            ? "bg-white text-[#00685f] shadow-xs"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        我的发布 ({posts.filter(p => p.username === "张伟" || p.username === profile.name).length})
                      </button>
                      <button
                        onClick={() => {
                          setCommunityFilter("BOOKMARKED");
                          triggerSystemTip("已为您筛选出首尔校区【收藏动态】");
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          communityFilter === "BOOKMARKED"
                            ? "bg-white text-[#00685f] shadow-xs"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        收藏夹 ({posts.filter(p => !!p.isBookmarked).length})
                      </button>
                    </div>

                    {/* Posts Feeds list */}
                    <section className="space-y-4 pb-20">
                      {filteredPosts.length === 0 ? (
                        <div className="py-12 text-center text-slate-400">
                          <Search className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                          <p className="text-xs">{language === 'en' ? 'No posts found. Be the first to post!' : language === 'ko' ? '게시물이 없습니다. 첫 번째 게시물을 작성해보세요!' : '未找到符合条件的动态，快自己发一条吧！'}</p>
                        </div>
                      ) : (
                        filteredPosts.map((p) => (
                          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-150/80 flex flex-col gap-3">
                            {/* User details row */}
                            <div className="flex items-center gap-2.5">
                              {p.avatar ? (
                                <img 
                                  src={p.avatar} 
                                  alt="Avatar" 
                                  className="w-10 h-10 rounded-full object-cover border border-[#00685f]/15 p-0.5" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center border border-[#855300]/10 shrink-0">
                                  {(p.username?.[0] || "校").toUpperCase()}
                                </div>
                              )}
                              
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-tight">{p.username}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{p.time} · {p.area || "首尔"}</p>
                              </div>

                              {profile.isLoggedIn && (p.userId === profile.studentId || p.username === profile.name) && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(language === 'en' ? 'Delete this post?' : language === 'ko' ? '이 게시물을 삭제하시겠습니까?' : '确定要删除这条动态吗？')) {
                                      handleDeletePost(p.id);
                                    }
                                  }}
                                  className="ml-auto p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors duration-150 shrink-0"
                                  title={language === 'en' ? 'Delete Post' : language === 'ko' ? '게시물 삭제' : '删除帖子'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <span className={`text-[9px] font-bold text-[#00685f] bg-teal-50/80 px-2 py-0.5 rounded-full border border-teal-100/40 shrink-0 ${
                                profile.isLoggedIn && (p.userId === profile.studentId || p.username === profile.name) ? "ml-1.5" : "ml-auto"
                              }`}>
                                {p.category}
                              </span>
                            </div>

                            {/* Text message */}
                            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">{p.text}</p>

                            {/* Image attached if populated */}
                            {p.image && (
                              <div className="rounded-xl overflow-hidden aspect-video border border-slate-100 bg-slate-50">
                                <img 
                                  src={p.image} 
                                  alt="Post media" 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}

                            {/* Actions toolbar info */}
                            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-500 select-none">
                              {/* Likes upvote */}
                              <div 
                                onClick={() => handleLikePost(p.id)}
                                className={`flex items-center gap-1 cursor-pointer transition-colors hover:text-red-500 ${
                                  p.hasLiked ? "text-red-500" : ""
                                }`}
                              >
                                <Heart className={`w-4 h-4 mt-px ${p.hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                                <span>{p.likes}</span>
                              </div>

                              {/* Comment details drawer toggle */}
                              <div 
                                onClick={() => {
                                  setActiveCommentPostId(p.id);
                                }}
                                className="flex items-center gap-1 cursor-pointer transition-colors hover:text-[#00685f]"
                              >
                                <MessageCircle className="w-4 h-4 mt-px" />
                                <span>{p.commentsCount}</span>
                              </div>

                              {/* Bookmark option */}
                              <div 
                                onClick={() => handleToggleBookmark(p.id)}
                                className={`flex items-center gap-1 cursor-pointer transition-colors hover:text-amber-500 ${
                                  p.isBookmarked ? "text-amber-500 font-bold" : ""
                                }`}
                              >
                                <Bookmark className={`w-4 h-4 mt-px ${p.isBookmarked ? "fill-amber-500 text-amber-500 font-bold" : ""}`} />
                                <span>{p.isBookmarked ? (language === 'en' ? 'Saved' : language === 'ko' ? '저장됨' : '已收藏') : (language === 'en' ? 'Save' : language === 'ko' ? '저장' : '收藏')}</span>
                              </div>

                              {/* Share copy */}
                              <div 
                                onClick={handleShare}
                                className="flex items-center gap-1 cursor-pointer hover:text-[#005049] ml-auto shrink-0"
                              >
                                <Share2 className="w-4 h-4 mt-px" />
                              </div>
                            </div>

                            {/* Comments Expanded preview section */}
                            {p.commentsList.length > 0 && (
                              <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] space-y-2 border border-slate-100/50 mt-1">
                                <span className="font-bold text-slate-400 block pb-1 border-b border-white">{language === 'en' ? `Top Discussions (${p.commentsList.length}):` : language === 'ko' ? `인기 댓글 (${p.commentsList.length}):` : `热门讨论 (${p.commentsList.length})：`}</span>
                                {p.commentsList.slice(0, 3).map((item) => (
                                  <div key={item.id} className="flex gap-1.5 items-start">
                                    <span className="font-bold text-[#00685f] shrink-0">{item.username}:</span>
                                    <span className="text-slate-650 flex-1 leading-normal">{item.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </section>
                  </div>

                  {/* Absolute Floating Action Plus Button (Mockup 1) */}
                  <button 
                    onClick={() => {
                      if (profile.isLoggedIn) {
                        setScreen(ActiveScreen.PUBLISH);
                      } else {
                        triggerSystemTip(language === 'en' ? 'Please sign in to publish a post.' : language === 'ko' ? '게시물을 작성하려면 먼저 로그인하세요.' : '请先登录再进行发布动态！');
                        setScreen(ActiveScreen.LOGIN);
                      }
                    }}
                    className="fixed bottom-24 right-5 w-14 h-14 bg-[#00685f] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#005049] active:scale-95 transition-all duration-200 z-40 group shrink-0"
                    aria-label={language === 'en' ? 'Publish Post' : language === 'ko' ? '새 글 쓰기' : '发布动态'}
                  >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              )}

              {/* ----------------- TAB 3: PROFILE (个人中心) ----------------- */}
              {navTab === NavigationTab.PROFILE && (
                <div className="space-y-4">
                  {/* Top Bar */}
                  <header className="bg-white px-4 h-16 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <Menu className="w-6 h-6 text-[#00685f] cursor-pointer" onClick={() => setShowInfoDrawer(true)} />
                      <h1 className="font-bold text-base text-[#00685f]">{t('profile_header')}</h1>
                    </div>
                    <button 
                      onClick={() => {
                        if (!profile.isLoggedIn) {
                          triggerSystemTip(language === 'zh' ? "请先登录查看通知！" : language === 'ko' ? "알림을 확인하려면 먼저 로그인하세요!" : "Please log in to view notifications!");
                          setScreen(ActiveScreen.LOGIN);
                        } else {
                          setShowNotificationDrawer(true);
                        }
                      }}
                      className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
                    >
                      <Bell className="w-5 h-5 text-[#00685f]" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </header>

                  <div className="px-4 space-y-4 pb-20">
                    
                    {/* Database Cloud Sync Status Diagnostic Banner */}
                    {dbDiagnostic.tested && !dbDiagnostic.connected && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">⚠️</span>
                          <div className="flex-1">
                            <span className="text-xs font-black text-amber-800 block">
                              正在运行：本地体验模式
                            </span>
                            <span className="text-[9px] text-amber-650 block mt-0.5 leading-normal font-medium">
                              云端数据同步未激活。您目前的数据仅储存在当前浏览器中，多设备无法共享。
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowDbInfoModal(true)}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[10px] py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer"
                        >
                          <span>🛠️</span> 诊断详情 & 一键云端同步教程
                        </button>
                      </div>
                    )}

                    {profile.isLoggedIn ? (
                      // 1. LOGGED IN profile block (Mockup 3)
                      <section 
                        onClick={() => setScreen(ActiveScreen.EDIT_PROFILE)}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-100 shrink-0 flex items-center justify-center">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt="Avatar" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00685f] to-[#009b8d] text-white font-bold text-2xl uppercase">
                              {profile.name ? profile.name.charAt(0) : "校"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-sm text-slate-800 leading-none">{profile.name}</h2>
                            <span className="text-[9px] bg-teal-50 border border-teal-200 text-teal-700 font-bold px-1.5 py-0.5 rounded-full leading-none">
                              {profile.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{profile.university} · {profile.major}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">UID: {profile.studentId}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </section>
                    ) : (
                      // 2. LOGGED OUT profile block (Mockup 2 & 7)
                      <section className="bg-white hover:bg-slate-50/50 p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-150 border-2 border-white mb-3 flex items-center justify-center text-slate-450 shadow-sm shrink-0">
                          <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="font-bold text-sm text-slate-800 mb-1">{language === 'en' ? 'Start Your Study Journey' : language === 'ko' ? '유학 생활을 시작하세요' : '开启你的留学之旅'}</h2>
                        <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed mb-4">{language === 'en' ? 'Sign in to sync bookmarks, publish posts, and receive Korean service packages.' : language === 'ko' ? '로그인하여 북마크 동기화, 게시물 작성 및 한국 현지 서비스 혜택을 누리세요.' : '登录后即可同步收藏、发布留学指南动态并领取韩国在地服务礼包。'}</p>
                        <button 
                          onClick={() => setScreen(ActiveScreen.LOGIN)}
                          className="bg-[#00685f] hover:bg-[#005049] text-white font-bold text-xs px-8 py-3 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
                        >
                          {language === 'en' ? 'Sign In / Register' : language === 'ko' ? '로그인 / 가입' : '登录 / 注册'}
                        </button>
                      </section>
                    )}

                    {/* Stats Rows */}
                    <section className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => {
                          if (profile.isLoggedIn) {
                            setCommunityFilter("MINE");
                            setNavTab(NavigationTab.COMMUNITY);
                            triggerSystemTip("📌 已筛选出您的发布（您发布的帖子会在列表置顶）");
                          } else {
                            triggerSystemTip("请先登录再查看发布内容！");
                          }
                        }}
                        className="bg-white p-3.5 rounded-xl border border-slate-101 shadow-sm text-center cursor-pointer hover:bg-slate-50 transition-all active:scale-95 duration-100"
                      >
                        <p className="text-lg font-bold text-[#00685f]">
                          {profile.isLoggedIn ? posts.filter(p => p.username === "张伟" || p.username === profile.name).length : "0"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">{language === 'en' ? 'My Posts' : language === 'ko' ? '내 게시물' : '我的发布'}</p>
                      </div>
                      <div 
                        onClick={() => {
                          if (profile.isLoggedIn) {
                            setCommunityFilter("BOOKMARKED");
                            setNavTab(NavigationTab.COMMUNITY);
                            triggerSystemTip("📌 已筛选出您收藏的校友帖子与生活动态");
                          } else {
                            triggerSystemTip("请先登录再查看您的收藏！");
                          }
                        }}
                        className="bg-white p-3.5 rounded-xl border border-slate-101 shadow-sm text-center cursor-pointer hover:bg-slate-50 transition-all active:scale-95 duration-100"
                      >
                        <p className="text-lg font-bold text-[#00685f]">
                          {profile.isLoggedIn ? posts.filter(p => p.isBookmarked).length : "0"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">{language === 'en' ? 'Saved' : language === 'ko' ? '북마크' : '收藏夹'}</p>
                      </div>
                    </section>

                    {/* Menu items row checklist */}
                    <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                      <div onClick={() => triggerSystemTip(language === 'en' ? 'Need help? Click the top right or dial 1345.' : language === 'ko' ? '도움이 필요하시면 우측 상단을 열거나 1345로 전화하세요.' : '有什么帮助需要，请点击右上角或拨打1345。')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#00685f]">
                            <HelpCircle className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">{language === 'en' ? 'Help & Feedback' : language === 'ko' ? '도움말 및 피드백' : '帮助与反馈'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </section>



                    {/* Log out option */}
                    {profile.isLoggedIn && (
                      <section className="pt-3">
                        <button 
                          onClick={() => {
                            localStorage.removeItem("service_community_user_id");
                            setProfile({ ...INITIAL_PROFILE, isLoggedIn: false });
                            fetchPosts();
                            triggerSystemTip(language === 'en' ? 'Signed out successfully.' : language === 'ko' ? '로그아웃되었습니다.' : '已成功安全退出登录');
                          }}
                          className="w-full bg-white border border-red-200/60 hover:bg-red-50/15 py-3 text-red-500 font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                          {language === 'en' ? 'Sign Out' : language === 'ko' ? '로그아웃' : '退出登录'}
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-2">版本号：v2.4.0 (Stable)</p>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE HOT TOPICS DRAWER MODAL */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {showManageTopics && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col justify-end">
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-white rounded-t-3xl max-h-[85%] flex flex-col pb-8 border-t border-slate-200"
              >
                {/* Header bar of drawer */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 mb-4">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-[#00685f]" />
                    {language === 'en' ? 'Manage Trending Topics' : language === 'ko' ? '인기 주제 관리' : '管理热门话题'}
                  </span>
                  <button 
                    onClick={() => {
                      setShowManageTopics(false);
                      setTopicInputValue("");
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="px-4 space-y-4 flex-1 overflow-y-auto">
                  {/* Add Custom Topic Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'en' ? 'Add New Topic' : language === 'ko' ? '새 주제 추가' : '添加新话题'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'e.g. #StudyTips' : language === 'ko' ? '예: #시험공부' : '例如 #江原大学'}
                        value={topicInputValue}
                        onChange={e => setTopicInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && topicInputValue.trim()) {
                            const trimmed = topicInputValue.trim();
                            const val = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
                            if (!globalTopics.includes(val)) {
                              setGlobalTopics(prev => [...prev, val]);
                              triggerSystemTip(`已成功新增话题标签: ${val}`);
                            } else {
                              triggerSystemTip("该话题已存在于热榜中！");
                            }
                            setTopicInputValue("");
                          }
                        }}
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#008378]"
                      />
                      <button
                        onClick={() => {
                          if (topicInputValue.trim()) {
                            const trimmed = topicInputValue.trim();
                            const val = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
                            if (!globalTopics.includes(val)) {
                              setGlobalTopics(prev => [...prev, val]);
                              triggerSystemTip(`已成功新增话题标签: ${val}`);
                            } else {
                              triggerSystemTip("该话题已存在于热榜中！");
                            }
                            setTopicInputValue("");
                          }
                        }}
                        className="px-4 py-2 bg-[#008378] text-white rounded-xl text-xs font-semibold hover:bg-[#00685f] shrink-0"
                      >
                        {language === 'en' ? 'Add' : language === 'ko' ? '추가' : '添加'}
                      </button>
                    </div>
                  </div>

                  {/* Active Topics List */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'en' ? 'Active Trending Topics' : language === 'ko' ? '현재 활성화된 주제' : '当前热门话题列表'}
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pb-4">
                      {globalTopics.map(t => (
                        <div 
                          key={t}
                          className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 pl-3 pr-2 py-1.5 rounded-full text-xs text-slate-700 font-semibold shadow-xs"
                        >
                          <span>{t}</span>
                          <button
                            onClick={() => {
                              setGlobalTopics(prev => prev.filter(x => x !== t));
                              if (selectedGlobalTopic === t) {
                                setSelectedGlobalTopic(null);
                              }
                              triggerSystemTip(`已移出话题: ${t}`);
                            }}
                            className="p-0.5 hover:bg-slate-200 text-slate-400 hover:text-rose-500 rounded-full transition-colors shrink-0"
                            title={language === 'en' ? 'Remove' : language === 'ko' ? '삭제' : '删除'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* CLOUD DB DIAGNOSTICS & RESTORE GUIDE MODAL */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {showDbInfoModal && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-sm max-h-[85%] flex flex-col shadow-2xl overflow-hidden border border-slate-100"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-black tracking-wide">云端恢复与数据库同步诊断</span>
                  </div>
                  <button 
                    onClick={() => setShowDbInfoModal(false)}
                    className="p-1 hover:bg-white/10 rounded-full text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4 text-slate-700 leading-relaxed text-[11px] font-medium">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex flex-col gap-1 text-[10px] text-amber-850">
                    <span className="font-bold">⚠️ 当前状态：系统正在以“本地体验模式”运行</span>
                    <span>这代表您在当前浏览器注册的账号、发布帖子的数据均储存在本地浏览器缓存中。由于数据未写入云端数据库，所以在其他手机或浏览器上登录会提示“账号不存在”。</span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 text-xs block">💡 什么是云端存储？</span>
                    <p>系统完全支持连接到您的 Supabase 云端数据库进行永久化存储。完成配置后，您的账号、个人资料、提醒事项、帖子及评论将在云端加密存储，实现多设备互通登录。</p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <span className="font-bold text-slate-800 text-xs block">🛠️ 手把手恢复云端教程：</span>
                    
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">注册并创建 Supabase 项目</span>
                        <span>访问 <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold">supabase.com</a> 免费注册一个项目，并在 Settings &rarr; API 中找到您的项目 URL 以及 `anon` public key。</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">在 Vercel 部署后台中配置环境变量</span>
                        <span>打开您的 Vercel 项目控制台，进入 <strong>Settings &rarr; Environment Variables</strong> 面板。</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</div>
                      <div className="space-y-0.5 flex-1">
                        <span className="font-bold text-slate-800 block">添加以下两个环境变量：</span>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-[9px] text-slate-650 select-all space-y-1 block mt-1">
                          <div><strong>SUPABASE_URL</strong> = 你的_Supabase_API_URL</div>
                          <div><strong>SUPABASE_ANON_KEY</strong> = 你的_Supabase_API_Anon_Key</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0">4</div>
                      <div className="space-y-0.5 flex-1">
                        <span className="font-bold text-slate-800 block">重新部署 (Redeploy)</span>
                        <span>保存环境变量后，在 Vercel <strong>Deployments</strong> 选项卡中点击最新部署的右侧三个点，选择 <strong>Redeploy</strong> 进行重新发布以应用环境变量。</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">✓</div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-emerald-850 block">大功告成！</span>
                        <span>重新打开网页，您就会发现本地体验版警告消失，您可以在不同设备上无缝注册和共享同一个账号啦！</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setShowDbInfoModal(false);
                      triggerSystemTip("正在为您自动同步最新缓存数据...");
                    }}
                    className="flex-1 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    我知道了
                  </button>
                  <button
                    onClick={() => {
                      window.open("https://supabase.com", "_blank");
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    前往 Supabase 官网
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE COMMENTS DRAWER MODAL */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {activeCommentPostId && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col justify-end">
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-white rounded-t-3xl max-h-[80%] flex flex-col pb-6 border-t border-slate-200"
              >
                {/* Header bar of drawer */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800">{language === 'en' ? 'Discussions & Comments' : language === 'ko' ? '댓글 및 토론' : '讨论与评论回复'}</span>
                  <button 
                    onClick={() => {
                      setActiveCommentPostId(null);
                      setNewCommentText("");
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* List Comments inside drawer */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px]">
                  {(() => {
                    const matchedPost = posts.find(p => p.id === activeCommentPostId);
                    if (!matchedPost) return null;
                    if (matchedPost.commentsList.length === 0) {
                      return (
                        <div className="text-center py-8 text-slate-400 text-xs">
                          <MessageCircle className="w-6 h-6 mx-auto mb-1 opacity-20" />
                          <p>{language === 'en' ? 'No comments yet. Be the first!' : language === 'ko' ? '댓글이 없습니다. 첫 번째로 댓글을 달아보세요!' : '暂无讨论，发句评论抢占沙发吧！'}</p>
                        </div>
                      );
                    }
                    return matchedPost.commentsList.map((c) => (
                      <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-2.5">
                        {c.avatar ? (
                          <img 
                            src={c.avatar} 
                            alt={c.username} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {(c.username?.[0] || "评").toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-bold text-slate-800">{c.username}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] text-slate-400">{c.time}</span>
                              {profile.isLoggedIn && (c.userId === profile.studentId || c.username === profile.name || matchedPost.userId === profile.studentId || matchedPost.username === profile.name) && (
                                <button 
                                  onClick={() => {
                                    if (confirm(language === 'en' ? 'Delete this comment?' : language === 'ko' ? '이 댓글을 삭제하시겠습니까?' : '确定要删除这条评论吗？')) {
                                      handleDeleteComment(matchedPost.id, c.id);
                                    }
                                  }}
                                  className="text-slate-450 hover:text-red-500 p-0.5 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                                  title={language === 'en' ? 'Delete Comment' : language === 'ko' ? '댓글 삭제' : '删除评论'}
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal">{c.text}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Form comment entry */}
                <form onSubmit={handleAddComment} className="p-4 border-t border-slate-100 flex gap-2 bg-slate-50/80">
                  <input 
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={language === 'en' ? 'Leave a warm message for your classmates...' : language === 'ko' ? '지인들에게 따뜻한 메시지를 남겨보세요...' : '说句温暖的话给校友吧...'}
                    className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#00685f]"
                  />
                  <button 
                    type="submit"
                    className="bg-[#00685f] hover:bg-[#005049] text-white p-2.5 rounded-full shrink-0 shadow-sm leading-[0]"
                  >
                    <Send className="w-4 h-4 transform rotate-45 translate-x-px -translate-y-px" />
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* GLOBAL BOTTOM NAVIGATION BAR (Mockup 1) */}
        {/* ---------------------------------------------------- */}
        {screen === ActiveScreen.MAIN && (
          <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-4 py-2 z-40 shadow-lg shadow-black/5 select-none rounded-t-2xl">
            {/* Tab 1: Home */}
            <button 
              onClick={() => {
                setNavTab(NavigationTab.HOME);
                setScreen(ActiveScreen.MAIN);
              }}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-all relative ${
                navTab === NavigationTab.HOME ? "text-[#00685f] font-bold scale-105" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{t('home')}</span>
              {navTab === NavigationTab.HOME && (
                <span className="absolute bottom-0.5 w-1 h-1 bg-[#00685f] rounded-full"></span>
              )}
            </button>

            {/* Tab 2: Community */}
            <button 
              onClick={() => {
                setNavTab(NavigationTab.COMMUNITY);
                setScreen(ActiveScreen.MAIN);
              }}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-all relative ${
                navTab === NavigationTab.COMMUNITY ? "text-[#00685f] font-bold scale-105" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{t('community')}</span>
              {navTab === NavigationTab.COMMUNITY && (
                <span className="absolute bottom-0.5 w-1 h-1 bg-[#00685f] rounded-full"></span>
              )}
            </button>

            {/* Tab 3: Profile */}
            <button 
              onClick={() => {
                setNavTab(NavigationTab.PROFILE);
                setScreen(ActiveScreen.MAIN);
              }}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-all relative ${
                navTab === NavigationTab.PROFILE ? "text-[#00685f] font-bold scale-105" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{t('profile')}</span>
              {navTab === NavigationTab.PROFILE && (
                <span className="absolute bottom-0.5 w-1 h-1 bg-[#00685f] rounded-full"></span>
              )}
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
