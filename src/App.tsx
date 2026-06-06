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
  X, Camera, PlusCircle, ArrowLeft, Send, ArrowRight, Bookmark, RefreshCw, Hash, Database,
  Compass, Smartphone, Plane, Sparkles
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
  const [selectedTopic, setSelectedTopic] = useState("");
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
  const [isPosting, setIsPosting] = useState(false);

  // Entry Helper state hooks
  const [entryDate, setEntryDate] = useState<string>(() => localStorage.getItem("entry_date") || "");
  const [tempEntryDate, setTempEntryDate] = useState<string>("");
  const [showEntryDateModal, setShowEntryDateModal] = useState(false);

  // Notification Permission state
  const [notificationPermission, setNotificationPermission] = useState<string>(
    () => (typeof window !== "undefined" && "Notification" in window) ? (window as any).Notification.permission : "default"
  );

  // Advance notification days setting (how many days before deadline to send push)
  const [notifyAdvanceDays, setNotifyAdvanceDays] = useState<number>(
    () => parseInt(localStorage.getItem("notify_advance_days") || "3", 10)
  );


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
    "#签证攻略", "#韩语备考", "#租房经验", "#江原大学", "#吃喝玩乐", "#兼职求职"
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

  // Hidden file input ref and avatar file reader
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max_size = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setEditAvatar(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Login & Register Form States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAgreed, setLoginAgreed] = useState(true);
  const [loginError, setLoginError] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUniversity, setRegisterUniversity] = useState("");
  const [registerGender, setRegisterGender] = useState("男 (Male)");
  const [registerBirthday, setRegisterBirthday] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Calendar Screen States
  const todayForCalendar = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(todayForCalendar.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(todayForCalendar.getMonth() + 1);
  const [activeCalendarSelectedDate, setActiveCalendarSelectedDate] = useState<string>(
    `${todayForCalendar.getFullYear()}-${String(todayForCalendar.getMonth() + 1).padStart(2, '0')}-${String(todayForCalendar.getDate()).padStart(2, '0')}`
  );

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
  const fetchPosts = useCallback((userId?: string) => {
    const url = userId ? `/api/posts?userId=${userId}` : "/api/posts";
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch(err => console.error("Error loading posts:", err));
  }, []);

  // Auto-refresh posts every 12 seconds so likes/comments from other users are visible
  React.useEffect(() => {
    const interval = setInterval(() => {
      const storedUserId = localStorage.getItem("service_community_user_id");
      fetchPosts(storedUserId || undefined);
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const fetchReminders = useCallback((userId: string) => {
    fetch(`/api/reminders?userId=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setReminders(data);
        }
      })
      .catch(err => console.error("Error loading reminders:", err));
  }, []);

  const getDaysDiff = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const importEntryScheduleToCalendar = async (selectedDate: string) => {
    const baseDate = new Date(selectedDate);
    const offsetDays = [0, 2, 4, 6, 9, 14];
    
    const titles = {
      zh: [
        "【入境第1天】入住校外房源/宿舍 & 向家里报平安",
        "【入境第3天】购买生活分类垃圾袋 & 熟悉校区环境",
        "【入境第5天】办理韩国手机卡 (SIM卡)",
        "【入境第7天】前往银行开户办理存折与借记卡",
        "【入境第10天】HiKorea 线上预约外国人登录证申办",
        "【入境第15天】前往出入境管理事务所录入指纹申办ARC"
      ],
      ko: [
        "[입국 1일차] 기숙사/외부 주거지 입주 및 안전 보고",
        "[입국 3일차] 규격 쓰레기봉투 구매 및 캠퍼스 파악",
        "[입국 5일차] 한국 휴대폰 유심(SIM) 카드 개통",
        "[입국 7일차] 은행 통장 및 체크카드 개설",
        "[입국 10일차] 하이코리아 외국인등록증 신청 온라인 예약",
        "[입국 15일차] 출입국관리사무소 방문 ARC 지문 등록"
      ],
      en: [
        "[Day 1 of Entry] Move into dorm/housing & report safety",
        "[Day 3 of Entry] Purchase garbage bags & explore campus",
        "[Day 5 of Entry] Apply for a Korean SIM card",
        "[Day 7 of Entry] Open bank account & get debit card",
        "[Day 10 of Entry] Book ARC appointment on HiKorea",
        "[Day 15 of Entry] Visit Immigration Office for ARC fingerprinting"
      ]
    };

    const scheduleReminders = offsetDays.map((days, idx) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return {
        title: titles[language][idx] || titles['zh'][idx],
        date: `${yyyy}-${mm}-${dd}`,
        time: "10:00",
        enabled: true
      };
    });

    if (profile.isLoggedIn) {
      try {
        for (const rem of scheduleReminders) {
          await fetch("/api/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: profile.studentId,
              title: rem.title,
              date: rem.date,
              time: rem.time,
              enabled: rem.enabled
            })
          });
        }
        fetchReminders(profile.studentId);
      } catch (err) {
        console.error("Error importing entry schedule to server:", err);
      }
    } else {
      const localReminders = scheduleReminders.map((rem, idx) => ({
        id: `rem_entry_${Date.now()}_${idx}`,
        title: rem.title,
        date: rem.date,
        time: rem.time,
        enabled: rem.enabled
      }));
      setReminders(prev => {
        const cleanPrev = prev.filter(r => !r.id.startsWith("rem_entry_") && !r.title.includes("入境") && !r.title.includes("입국") && !r.title.includes("Entry"));
        return [...cleanPrev, ...localReminders];
      });
    }
  };

  const getTimelineItems = (baseDateStr: string) => {
    const baseDate = new Date(baseDateStr);
    const offsets = [0, 2, 4, 6, 9, 14, 19, 24, 29];
    
    const data = [
      {
        day: 1,
        icon: Home,
        title: {
          zh: "入住校外房源/宿舍 & 向家里报平安",
          ko: "기숙사/외부 주거지 입주 및 안전 보고",
          en: "Move into dorm/housing & report safety"
        },
        desc: {
          zh: "请联系国际交流处（三陟校区国际交流团队）或宿管老师办理入住手续，给父母家人发送信息报平安。别忘了购买当地生活垃圾分类袋，熟悉生活垃圾投放时间与规程。",
          ko: "삼척 캠퍼스 국제교류과나 기숙사 사감실을 통해 입주 절차를 밟으시고, 부모님께 안부 연락을 드리세요. 또한 규격 쓰레기봉투를 구입하여 쓰레기 배출 시간 및 요령을 파악해 두세요.",
          en: "Complete check-in procedures with OIA or the dorm office, and message your family. Don't forget to purchase local authorized sorting trash bags and learn the local waste disposal schedules."
        },
        tips: {
          zh: ["确认宿管老师处登记的个人联系电话", "购买黄色生活垃圾袋与白色厨余垃圾袋", "向父母发送定位及韩国临时联系方式"],
          ko: ["기숙사 등록 연락처 확인", "쓰레기 규격봉투(노란색/하얀색) 구매", "가족에게 위치 및 연락처 전송"],
          en: ["Confirm contact registered with dorm office", "Buy garbage bags (yellow/white)", "Send location & contact to family"]
        }
      },
      {
        day: 3,
        icon: Compass,
        title: {
          zh: "采购生活必需品 & 熟悉校区周边设施",
          ko: "캠퍼스 파악 및 필수 생활용품 구매",
          en: "Explore campus & shop for essentials"
        },
        desc: {
          zh: "熟悉学校周边的超市（如三陟E-Mart、各大便利店）和公交车站等便利生活设施，参加学校的迎新说明会，领取临时校园卡及选课指导手册。",
          ko: "학교 주변 대형마트(삼척 이마트, 마트 등) 및 버스 정류장 등 편의시설을 파악하고, 국제교류과에서 주관하는 오리엔테이션에 참석하여 임시 학생증 및 수강신청 가이드를 수령하세요.",
          en: "Visit nearby supermarkets (like Samcheok E-Mart) and bus stations. Attend the freshman orientation organized by the Office of International Affairs to get your temporary campus ID and course manual."
        },
        tips: {
          zh: ["三陟市中心E-Mart大超市路线规划与采购", "领取临时学生证与选课指南", "关注国际交流处迎新发布会时间并准时参加"],
          ko: ["삼척 시내 이마트 마트 경로 파악", "임시 학생증 및 수강 가이드 수령", "국제교류팀 오리엔테이션 일정 확인"],
          en: ["Route map to local E-Mart", "Get temporary ID & course guide", "Check orientation session schedule"]
        }
      },
      {
        day: 5,
        icon: Smartphone,
        title: {
          zh: "办理韩国手机卡 (SIM卡)",
          ko: "한국 휴대폰 유심(SIM) 카드 개통",
          en: "Apply for a Korean SIM card"
        },
        desc: {
          zh: "携带护照前往学校附近或校内的电信代理店办理预付卡（Prepaid SIM），获取韩国本土手机号码。这是后续在韩国办理银行开户、网络认证及网购的实名基础。",
          ko: "여권을 소지하고 학교 주변 of 통신사 대리점을 방문하여 선불 유심을 개통해 한국 휴대폰 번호를 생성하세요. 이는 향후 은행 업무, 인터넷 본인인증, 쇼핑몰 가입을 위한 필수 조건입니다.",
          en: "Take your passport to a telecom shop nearby to get a prepaid SIM card. Having a local Korean phone number is essential for real-name authentication in bank openings and online platforms."
        },
        tips: {
          zh: ["携带护照原件前往代理店", "推荐使用 Chingu Mobile 或校外 KT/LGU+ 预付套餐", "核对护照拼写与SIM卡实名信息一致，方便后期做实名变更为登陆证实名"],
          ko: ["여권 원본 지참 대리점 방문", "외국인용 선불 요금제(KT/LGU+ 등) 선택", "여권 영문명과 유심 명의 일치 확인"],
          en: ["Bring original passport to telecom store", "Recommended: KT/LGU+ or Chingu Mobile prepaid plan", "Ensure passport name spelling matches exactly"]
        }
      },
      {
        day: 7,
        icon: CreditCard,
        title: {
          zh: "前往银行开户办理存折与借记卡",
          ko: "은행 통장 및 체크카드 개설",
          en: "Open bank account & get debit card"
        },
        desc: {
          zh: "携带护照、在学证明等材料，前往校区内指定的合作银行（如新韩银行等）开通存折（통장）并领取借记卡（체크카드），便于安全地存储生活费与转账缴纳学杂费。",
          ko: "여권, 재학증명서 등을 지참하고 삼척/도계 캠퍼스 내 지정 협력은행을 방문해 계좌(통장)와 체크카드를 발급받으세요. 생활비 수령 및 향후 등록금 납부 등에 필요합니다.",
          en: "Take your passport and enrollment certificate to the partner bank on campus to open an account (Tongjang) and get a debit card. This will make receiving living expenses and paying tuition easier."
        },
        tips: {
          zh: ["携带护照、在学证明 (Certificate of Enrollment) 和韩国手机号", "在校区合作银行营业厅（如新韩银行）办理", "申请开通手机银行 App 并开启网银转账功能"],
          ko: ["여권, 재학증명서 서류 구비", "교내 지정 신한은행 영업점 방문", "스마트 뱅킹 앱 설치 및 이체 한도 설정"],
          en: ["Prepare passport and Enrollment Certificate", "Visit the designated campus Shinhan Bank branch", "Install mobile banking app & enable online transfers"]
        }
      },
      {
        day: 10,
        icon: Globe,
        title: {
          zh: "HiKorea 线上预约外国人登录证申办",
          ko: "하이코리아 외국인등록증 신청 온라인 예약",
          en: "Book ARC appointment on HiKorea"
        },
        desc: {
          zh: "由于申办外国人登录证需要录入指纹，请在 HiKorea 官网（hikorea.go.kr）预约东海出入境管理事务所的线下办理时间，并根据学校要求准备在学证明、在留资格等申请表单。",
          ko: "외국인등록증(ARC) 발급에는 지문 등록이 필요하므로 하이코리아 웹사이트에서 동해출입국사무소 방문예약을 선진행하세요. 학교 공지에 따라 재학증명서, 체류지 입증서류 등을 준비해 두세요.",
          en: "ARC application requires fingerprint collection. Register on the HiKorea website (hikorea.go.kr) to book a visit to the Donghae Immigration Office, and prepare enrollment certificates and housing proof."
        },
        tips: {
          zh: ["登录 hikorea.go.kr 进行'방문예약' (预约访问) 登记", "预约辖区应选择'동해출입국' (东海出入境管理事务所)", "截图保存预约确认书并打印，注意开学季预约名额紧张，建议尽早预订"],
          ko: ["hikorea.go.kr 접속 후 '방문예약' 신청", "관할 사무소를 '동해출입국'으로 지정", "방문예약 접수증 캡처 및 출력"],
          en: ["Go to hikorea.go.kr and choose 'Visit Reservation'", "Select 'Donghae Immigration Office' as jurisdiction", "Screenshot & print your appointment receipt"]
        }
      },
      {
        day: 15,
        icon: Calendar,
        title: {
          zh: "前往出入境事务所录入指纹申办ARC",
          ko: "출입국관리사무소 방문 ARC 지문 등록",
          en: "Visit Immigration Office for ARC fingerprinting"
        },
        desc: {
          zh: "携带护照、两寸白底照片、在留资格证明、在学证明、申请表以及3万韩元的手续费，在预约好的时间段前往东海出入境管理事务所录入指纹并递交申请材料。",
          ko: "예약한 일시에 여권, 사진(흰색 배경), 체류지 입증서류, 재학증명서, 신청서와 수수료 3만 원을 지참하여 동해출입국관리사무소에 방문해 지문 등록을 완료하고 서류를 접수하세요.",
          en: "On your appointment date, bring your passport, white-background photo, housing contract, certificate of enrollment, application form, and 30,000 KRW fee to the Donghae Immigration Office."
        },
        tips: {
          zh: ["带好护照原件 and 3万韩元现金（或卡）缴纳手续费", "准备近6个月内的2寸白底证件照片1张", "向出入境窗口递交完整的学校材料包 and 房屋合同复印件"],
          ko: ["여권 원본 및 수수료 3만 원 지참", "여권용 사진 1장 (흰색 배경) 지참", "학교에서 일괄 배포한 서류 봉투 확인"],
          en: ["Bring original passport & 30,000 KRW cash/card", "Prepare 1 passport-size white-background photo", "Double-check school document pack before going"]
        }
      },
      {
        day: 20,
        icon: Shield,
        title: {
          zh: "申请国民健康保险 (NHIS) 每月自动扣款",
          ko: "국민건강보험(NHIS) 계좌 자동이체 신청",
          en: "Apply for National Health Insurance Auto-Debit"
        },
        desc: {
          zh: "拥有韩国银行卡和外国人登录证后，建议尽快办理健康保险每月自动转账划扣（자동이체）。不仅能免去每月手动缴费的繁琐、防止逾期罚款，还能享受少量的保费减免优惠！",
          ko: "체크카드와 외국인등록증을 발급받은 후, 건강보험료 자동이체를 신청하는 것을 추천합니다. 매달 납부해야 하는 번거로움을 줄이고 연체를 방지할 수 있으며, 소액의 감면 혜택도 받을 수 있습니다.",
          en: "After receiving your ARC and bank card, configure NHIS automatic monthly debit. This avoids overdue fees and offers a small premium discount."
        },
        tips: {
          zh: ["拨打 1345 或健康保险客服 1577-1000 电话申请", "携带银行通账和登录证前往最近的国民健康保险公团分部办理", "确保每月扣款日前账户内有足额生活费防止划扣失败"],
          ko: ["고객센터 1577-1000 또는 1345로 전화 신청", "통장 및 외국인등록증 지참 후 건강보험공단 지사 방문 신청", "매월 이체일 전 통장 잔액 확인"],
          en: ["Call NHIS customer service at 1577-1000 or 1345", "Visit a nearby NHIS branch with ARC & bankbook", "Ensure sufficient balance in account before debit date"]
        }
      },
      {
        day: 25,
        icon: BookOpen,
        title: {
          zh: "激活江原大学 K-Cloud 账号与移动学生证",
          ko: "강원대학교 K-Cloud 활성화 및 모바일 학생증 발급",
          en: "Activate KNU K-Cloud & Get Mobile Student ID"
        },
        desc: {
          zh: "登录江原大学官方门户网站 K-Cloud，激活您的学生账号。下载‘강원대학교 스마트캠퍼스’（江原大学智能校园）App，申请并生成电子移动学生证。这是您进出学校图书馆、自习室、宿舍闸机以及借书的必备电子凭证。",
          ko: "강원대학교 포털 사이트 K-Cloud에 로그인하여 학생 계정을 활성화하세요. '강원대학교 스마트캠퍼스' 앱을 다운로드하여 모바일 학생증을 발급받으면 도서관 출입 및 도서 대출, 기숙사 게이트 통과 시 편리하게 사용할 수 있습니다.",
          en: "Log into KNU's portal (K-Cloud) to activate your student account. Download the 'Kangwon National University Smart Campus' app to generate your mobile student ID for library access and borrowing books."
        },
        tips: {
          zh: ["登录江原大学 K-Cloud 门户网站激活账号并修改初始密码", "在手机应用商店下载 '강원대학교 스마트캠퍼스' App", "生成电子学生证二维码，并核对个人姓名与学号是否正确"],
          ko: ["강원대 K-Cloud 포털 접속 및 계정 초기화/활성화", "'강원대학교 스마트캠퍼스' 앱 다운로드", "모바일 학생증 QR코드 발급 및 정보 확인"],
          en: ["Log in to KNU K-Cloud portal to activate account", "Download 'Kangwon National University Smart Campus' app", "Generate mobile ID QR code & verify student details"]
        }
      },
      {
        day: 30,
        icon: CreditCard,
        title: {
          zh: "领取外国人登录证 (ARC) & 变更手机号实名信息",
          ko: "외국인등록증 수령 및 휴대폰 명의 변경",
          en: "Retrieve ARC & Update SIM Card Registration"
        },
        desc: {
          zh: "前往出入境管理事务所领取您的外国人登录证（或等待邮寄到家）。拿到实体卡后，务必带上卡前往您的手机卡办理代理店，将原先用护照开户的手机号实名认证变更为登录证实名认证。这样您才能完美解锁韩国所有的 App 线上实名认证功能！",
          ko: "출입국관리사무소에서 외국인등록증을 수령하거나 등기 우편으로 받으세요. 실물 카드를 받은 후, 통신사 대리점을 방문하여 여권으로 개통했던 휴대폰 명의를 외국인등록번호로 변경하세요. 그래야 한국 내 모든 온라인 본인인증을 원활하게 사용할 수 있습니다.",
          en: "Collect your physical ARC from the Immigration Office (or receive via mail). Bring it to your telecom agent to change your phone registration from passport to ARC. This is required to unlock online identity verifications."
        },
        tips: {
          zh: ["确认收到出入境自取短信（或确认快递邮寄状态）后获得实体卡", "带上登录证原件与手机前往电信运营商官方营业厅办理实名变更", "完成变更后，尝试绑定 KakaoPay / Toss 等金融和支付软件测试实名认证"],
          ko: ["출입국사무소에서 외국인등록증 실물 카드 수령 (또는 우편 배송 완료 확인)", "등록증 지참 후 통신사 대리점 방문하여 여권 명의를 등록증 명의로 전환", "명의 변경 후 카카오페이/토스 등 본인인증 및 간편결제 연동 테스트"],
          en: ["Retrieve physical ARC card (if self-pickup)", "Visit telecom store with ARC to update your registry from passport to ARC", "Link to KakaoPay or Toss to test identity verification"]
        }
      }
    ];

    return data.map((item, idx) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + offsets[idx]);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return {
        ...item,
        dateStr: `${yyyy}-${mm}-${dd}`
      };
    });
  };

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      triggerSystemTip(language === 'en' ? 'System notifications are not supported on this device/browser.' : language === 'ko' ? '이 기기/브라우저에서는 시스템 알림이 지원되지 않습니다.' : '当前设备或浏览器不支持系统通知。');
      return;
    }
    const BrowserNotification = (window as any).Notification;
    BrowserNotification.requestPermission().then((permission: string) => {
      setNotificationPermission(permission);
      if (permission === "granted") {
        triggerSystemTip(language === 'en' ? 'Notification permission granted! Reminders will show in notification bar.' : language === 'ko' ? '알림 권한이 허용되었습니다! 디데이 당일 알림이 전송됩니다.' : '🎉 通知权限授权成功！当倒数日提醒到期时，您将在手机通知栏收到提醒。');
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(
              language === 'zh' ? '在韩留学生服务社区' : language === 'ko' ? '입국 도우미' : 'Entry Assistant',
              {
                body: language === 'zh' ? '系统推送通知已成功开启！' : language === 'ko' ? '시스템 알림 기능이 활성화되었습니다!' : 'Push notifications successfully enabled!',
                icon: '/logo.svg',
                vibrate: [100, 50, 100]
              } as any
            );
          });
        }
      } else {
        triggerSystemTip(language === 'en' ? 'Notification permission denied. Enable it in browser settings if needed.' : language === 'ko' ? '알림 권한이 거부되었습니다. 설정에서 허용해 주세요.' : '通知权限未被授予。若需提醒，请在手机系统或浏览器设置中允许通知权限。');
      }
    });
  };

  // Background check reminders and trigger system notification
  useEffect(() => {
    if (notificationPermission !== "granted") return;

    const checkRemindersAndNotify = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      const notifiedList = JSON.parse(localStorage.getItem("notified_reminders") || "[]");
      let updated = false;

      reminders.forEach((rem) => {
        if (!rem.enabled) return;
        const remDate = new Date(rem.date);
        remDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((remDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Fire notification on the exact day OR notifyAdvanceDays before
        const shouldNotifyToday = rem.date === todayStr;
        const shouldNotifyAdvance = diffDays === notifyAdvanceDays && notifyAdvanceDays > 0;
        const notifId = shouldNotifyToday ? rem.id : `${rem.id}_adv${notifyAdvanceDays}`;

        if ((shouldNotifyToday || shouldNotifyAdvance) && !notifiedList.includes(notifId)) {
          const title = shouldNotifyToday
            ? (language === 'zh' ? '🕒 今日重要日程提醒' : language === 'ko' ? '🕒 오늘 주요 일정 알림' : '🕒 Today\'s Event Reminder')
            : (language === 'zh' ? `⏰ 倒数日提醒：还有 ${notifyAdvanceDays} 天` : language === 'ko' ? `⏰ 디데이 알림: ${notifyAdvanceDays}일 남음` : `⏰ Countdown: ${notifyAdvanceDays} days left`);
          const body = shouldNotifyToday
            ? rem.title
            : (language === 'zh' ? `【${rem.title}】还有 ${notifyAdvanceDays} 天到期，请提前做好准备！` : language === 'ko' ? `【${rem.title}】${notifyAdvanceDays}일 후 마감입니다. 미리 준비하세요!` : `【${rem.title}】is due in ${notifyAdvanceDays} days. Be prepared!`);

          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification(title, {
                body,
                icon: '/logo.svg',
                tag: notifId,
                renotify: true,
                requireInteraction: true,
                vibrate: [200, 100, 200]
              } as any);
            });
          } else {
            const BrowserNotification = (window as any).Notification;
            new BrowserNotification(title, { body, icon: '/logo.svg' });
          }
          notifiedList.push(notifId);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem("notified_reminders", JSON.stringify(notifiedList));
      }
    };

    checkRemindersAndNotify();
    const interval = setInterval(checkRemindersAndNotify, 15000);
    return () => clearInterval(interval);
  }, [reminders, notificationPermission, language, notifyAdvanceDays]);





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
              return data;
            }
            return prev;
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
          triggerSystemTip(data.isBookmarked ? "📌 已成功保存到【收藏夹】！" : "🗑️ 已从【收藏夹】中取消收藏！");
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
    if (isPosting) return;
    if (!profile.isLoggedIn) {
      triggerSystemTip("请先登录再进行发布动态！");
      setScreen(ActiveScreen.LOGIN);
      return;
    }
    if (!newPostText.trim()) {
      triggerSystemTip("请输入内容或向校友提问哦~");
      return;
    }

    setIsPosting(true);

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
        text: `${newPostTitle ? `【${newPostTitle}】` : ""}${newPostText}${selectedTopic ? ` ${selectedTopic}` : ""}`,
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
            setSelectedTopic("");
            setNewPostAnonymous(false);
            setIsPosting(false);
          }, 2000);
        } else {
          setIsPosting(false);
          triggerSystemTip(data.error || "发布失败，请重试！");
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
          text: `${newPostTitle ? `【${newPostTitle}】` : ""}${newPostText}${selectedTopic ? ` ${selectedTopic}` : ""}`,
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
          setSelectedTopic("");
          setNewPostAnonymous(false);
          setIsPosting(false);
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
            university: "202408151229",
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
      setRegisterError("请输入学号");
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
          nickname: `${registerUsername} (Student)`,
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
          nickname: `${registerUsername} (Student)`,
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
      result = result.filter(p => p.userId === profile.studentId);
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
        <div className="relative w-full max-w-md bg-white border-0 md:border md:border-slate-200/80 rounded-none md:rounded-3xl shadow-none md:shadow-xl flex flex-col h-screen md:h-[900px] overflow-hidden" style={{isolation:'isolate'}}>

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
                className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                onClick={() => setShowInfoDrawer(false)}
              />
              {/* Drawer panel */}
              <motion.div
                key="drawer-panel"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed top-0 left-0 bottom-0 w-[82%] max-w-xs bg-[#00685f] z-[200] flex flex-col overflow-y-auto"
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
                className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                onClick={() => setShowNotificationDrawer(false)}
              />
              {/* Drawer panel */}
              <motion.div
                key="notification-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-50 z-[200] flex flex-col overflow-hidden shadow-2xl"
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {screen === ActiveScreen.GUIDE_DETAIL ? (
            // Category Guides Details screen
            <div className="flex-1 overflow-y-auto overscroll-contain pb-20">
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
            </div>
          ) : screen === ActiveScreen.PUBLISH ? (
            // Create/Publish Post Screen (Mockup 3)
            <div className="flex-1 flex flex-col bg-[#f8f9ff] overflow-hidden">
              {/* Header */}
              <nav className="bg-[#f8f9ff]/90 backdrop-blur-md w-full border-b border-outline-variant/30 flex justify-between items-center px-4 h-16 shrink-0">
                <button onClick={() => setScreen(ActiveScreen.MAIN)} className="flex items-center text-slate-500 hover:text-[#00685f] transition-colors gap-1">
                  <X className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t('cancel')}</span>
                </button>
                <h1 className="font-bold text-sm text-[15px] text-slate-800">{t('publish_title')}</h1>
                <button 
                  onClick={handlePublishPost}
                  disabled={isPosting}
                  className={`${isPosting ? 'bg-slate-400 cursor-not-allowed opacity-75' : 'bg-[#00685f] hover:bg-[#005049] active:scale-95'} text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform`}
                >
                  {isPosting ? (language === 'en' ? 'Publishing...' : language === 'ko' ? '게시 중...' : '发布中...') : t('publish_confirm')}
                </button>
              </nav>

              {/* Form Content */}
              <main className="flex-1 p-4 space-y-4 overflow-y-auto overscroll-contain pb-24">
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
                      ...(language === 'en' ? ["#Visa Tips", "#Korean Study", "#Housing Tips"] : language === 'ko' ? ["#비자꿀팁", "#한국어공부", "#방구하기"] : ["#签证攻略", "#韩语备考", "#租房经验"]),
                      ...customTopics
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(prev => prev === topic ? "" : topic)}
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
            <div className="flex-1 flex flex-col bg-[#f8f9ff] overflow-hidden">
              {/* Header */}
              <header className="bg-white flex justify-between items-center px-4 h-16 border-b border-slate-200/50 shrink-0">
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
              <main className="p-4 space-y-4 flex-1 overflow-y-auto overscroll-contain pb-24">
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
                        <p className="text-slate-450 mt-0.5">在事件开始前24小时通知我</p>
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
          ) : screen === ActiveScreen.ENTRY_HELPER ? (
            // Entry Helper Screen
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Header */}
              <nav className="bg-white/90 backdrop-blur-md w-full border-b border-slate-100 flex justify-between items-center px-4 h-16 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setScreen(ActiveScreen.MAIN)} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#00685f]" />
                  </button>
                  <h1 className="font-bold text-sm text-[15px] text-[#00685f]">
                    {language === 'zh' ? '入境助手' : language === 'ko' ? '입국 도우미' : 'Entry Assistant'}
                  </h1>
                </div>
                <button 
                  onClick={() => {
                    setTempEntryDate(entryDate);
                    setShowEntryDateModal(true);
                  }} 
                  className="text-xs font-bold text-violet-600 hover:text-violet-805 transition-colors bg-violet-50 px-3 py-1.5 rounded-full"
                >
                  {language === 'zh' ? '修改日期' : language === 'ko' ? '날짜 변경' : 'Edit Date'}
                </button>
              </nav>

              {/* Main Content container */}
              <div className="p-4 space-y-4 max-w-md mx-auto w-full flex-1 overflow-y-auto overscroll-contain pb-24">
                {/* Entry Date Info card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-violet-500/5 pointer-events-none" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'zh' ? '入境日程规划' : language === 'ko' ? '입국 일정 플래너' : 'Entry Schedule Planner'}
                      </h2>
                      <p className="text-xs font-black text-slate-800">
                        {language === 'zh' ? '预计入境日期：' : language === 'ko' ? '예정 입국일: ' : 'Expected Entry Date: '}
                        <span className="text-violet-600 font-bold ml-1">{entryDate}</span>
                      </p>
                    </div>
                  </div>

                  {/* Countdown display */}
                  <div className="pt-2 border-t border-slate-50 mt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-450 font-bold">
                      {language === 'zh' ? '距离或已入境天数' : language === 'ko' ? '입국 디데이 상태' : 'Entry D-Day Status'}
                    </span>
                    <span className="px-3 py-1 rounded-full font-black text-xs bg-violet-50 text-violet-700">
                      {(() => {
                        const diff = getDaysDiff(entryDate);
                        if (diff > 0) {
                          return `D - ${diff}`;
                        } else if (diff === 0) {
                          return language === 'zh' ? '今天入境！' : language === 'ko' ? '오늘 입국!' : 'Entry Day!';
                        } else {
                          return language === 'zh' ? `已入境 ${Math.abs(diff)} 天` : language === 'ko' ? `입국 ${Math.abs(diff)}일차` : `Day ${Math.abs(diff)} in Korea`;
                        }
                      })()}
                    </span>
                  </div>
                </div>

                {/* Subtitle description */}
                <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
                  {language === 'zh' 
                    ? '根据您的设定，系统已在主页日历的“倒数日”中添加了以下 9 个关键日程。请按照对应节点依次办理相关手续。' 
                    : language === 'ko' 
                    ? '설정된 날짜를 바탕으로 홈 화면 달력의 "디데이"에 9가지 주요 일정이 자동 등록되었습니다. 각 시기별 할 일을 확인해 보세요.' 
                    : 'The system has synced the following 9 milestones to the "D-Day" section of your homepage calendar. Complete each task as scheduled.'}
                </p>

                {/* Timeline Items List */}
                <div className="relative pl-4 border-l-2 border-slate-200 ml-3.5 space-y-5 py-2">
                  {getTimelineItems(entryDate).map((item, index) => {
                    const daysDiff = getDaysDiff(item.dateStr);
                    const isFuture = daysDiff > 0;
                    
                    return (
                      <div key={index} className="relative">
                        {/* Bullet indicator */}
                        <div className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all z-10 ${
                          daysDiff < 0 
                            ? 'border-emerald-500 text-emerald-500 bg-emerald-50' 
                            : daysDiff === 0 
                            ? 'border-violet-600 text-violet-600 bg-violet-50 scale-110' 
                            : 'border-slate-300 text-slate-350'
                        }`}>
                          {daysDiff < 0 ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        {/* Card item */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] font-bold text-violet-600 uppercase tracking-widest px-2 py-0.5 rounded bg-violet-50">
                              {language === 'zh' ? `第 ${item.day} 天` : language === 'ko' ? `${item.day}일차` : `Day ${item.day}`}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {item.dateStr}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs text-slate-800 mt-0.5 leading-snug">
                            {item.title[language] || item.title['zh']}
                          </h3>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            {item.desc[language] || item.desc['zh']}
                          </p>

                          {/* Synced badge */}
                          <div className="pt-2 border-t border-slate-50 mt-1 flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-400 flex items-center gap-1 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{language === 'zh' ? '已同步至日历倒数日' : language === 'ko' ? '디데이 달력 동기화됨' : 'Synced to D-Day Calendar'}</span>
                            </span>
                            <span className={isFuture ? 'text-slate-400' : daysDiff === 0 ? 'text-violet-600' : 'text-emerald-600'}>
                              {isFuture 
                                ? (language === 'zh' ? `还有 ${daysDiff} 天` : language === 'ko' ? `${daysDiff}일 남음` : `${daysDiff} days left`) 
                                : daysDiff === 0 
                                ? (language === 'zh' ? '今天进行' : language === 'ko' ? '오늘 진행' : 'Today') 
                                : (language === 'zh' ? '已过' : language === 'ko' ? '완료됨' : 'Past')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : screen === ActiveScreen.EDIT_PROFILE ? (
            // Edit Profile Details screen (Mockup 8)
            <div className="flex-1 flex flex-col bg-[#f8f9ff] overflow-hidden">
              <header className="bg-white flex justify-between items-center px-4 h-16 border-b border-slate-200/50 shrink-0">
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

              <main className="p-4 space-y-5 flex-1 max-w-md mx-auto w-full overflow-y-auto overscroll-contain pb-24">
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
                      <Hash className="w-4 h-4 text-slate-400 shrink-0" />
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
                    <label className="text-xs font-bold text-slate-400 pl-1">UID</label>
                    <div className="w-full bg-slate-100 border border-slate-200 border-dashed rounded-xl px-3 py-2.5 text-xs text-slate-500 font-semibold cursor-not-allowed">
                      {profile.studentId}
                    </div>
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

                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        ref={avatarFileInputRef} 
                        accept="image/*" 
                        onChange={handleAvatarFileChange} 
                        className="hidden" 
                      />

                      {/* Custom Upload Block */}
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-bold text-[#00685f] uppercase tracking-wide">
                          {language === 'en' ? 'Custom Avatar' : language === 'ko' ? '커스텀 사진 업로드' : '自定义头像'}
                        </p>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="flex-1 border-2 border-dashed border-slate-200 hover:border-[#00685f] bg-slate-50 hover:bg-teal-50/20 py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                          >
                            <Camera className="w-4 h-4 text-[#00685f]" />
                            <span className="text-xs font-bold text-slate-700">
                              {language === 'en' ? 'Upload from Album' : language === 'ko' ? '앨범에서 선택' : '从相册选择图片'}
                            </span>
                          </button>
                        </div>

                        {/* Optional fallback input for URL */}
                        <div className="pt-2 border-t border-slate-100/50 mt-1">
                          <p className="text-[9px] font-semibold text-slate-400 mb-1">
                            {language === 'en' ? 'Or enter external image URL:' : language === 'ko' ? '또는 외부 이미지 URL 입력:' : '或输入外部图片网址(URL)：'}
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder={language === 'en' ? 'Enter image URL...' : language === 'ko' ? '이미지 URL 입력...' : '输入外部图片 URL 网址...'}
                              value={editAvatar && !PRESET_AVATARS.includes(editAvatar) && !editAvatar.startsWith("data:image") ? editAvatar : ""}
                              onChange={(e) => setEditAvatar(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] text-slate-700 outline-none focus:ring-1 focus:ring-[#00685f] focus:bg-white font-medium"
                            />
                            {editAvatar && !PRESET_AVATARS.includes(editAvatar) && !editAvatar.startsWith("data:image") && (
                              <button 
                                onClick={() => setEditAvatar("")}
                                className="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-[10px] font-bold transition-colors"
                              >
                                {language === 'en' ? 'Clear' : language === 'ko' ? '지우기' : '清除'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* High fidelity image preview */}
                        {editAvatar && !PRESET_AVATARS.includes(editAvatar) && (
                          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-150/60 mt-1.5 animate-fadeIn">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-200 flex-shrink-0 shadow-inner">
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
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-slate-700 font-bold block leading-none">
                                {editAvatar.startsWith("data:image") ? (language === 'en' ? 'Local Album Photo' : language === 'ko' ? '앨범 선택 사진' : '相册选择的图片') : (language === 'en' ? 'Network Image URL' : language === 'ko' ? '웹 이미지 URL' : '自定义网络网址')}
                              </span>
                              <span className="text-[8px] text-slate-400 font-semibold block truncate mt-0.5">
                                {editAvatar.startsWith("data:image") ? `${Math.round(editAvatar.length * 0.75 / 1024)} KB` : editAvatar}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                              {language === 'en' ? 'Preview' : language === 'ko' ? '미리보기' : '预览成功'}
                            </span>
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
            <div className="flex-1 flex flex-col bg-[#f8f9ff] overflow-hidden">
              {/* Goback header */}
              <header className="w-full h-16 flex items-center px-4 bg-white border-b border-slate-100 shrink-0">
                <button 
                  onClick={() => setScreen(ActiveScreen.MAIN)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-800" />
                </button>
              </header>

              <main className="w-full p-6 flex-1 flex flex-col justify-between max-w-sm mx-auto overflow-y-auto overscroll-contain pb-24">
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
              </footer>
            </div>
          ) : screen === ActiveScreen.REGISTER ? (
            // Full Registration Flow block
            <div className="flex-1 flex flex-col bg-[#f8f9ff] overflow-hidden">
              {/* Goback header */}
              <header className="w-full h-16 flex items-center px-4 bg-white border-b border-slate-100 shrink-0">
                <button 
                  onClick={() => setScreen(ActiveScreen.LOGIN)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-800" />
                </button>
              </header>

              <main className="w-full p-6 flex-1 flex flex-col justify-between max-w-sm mx-auto overflow-y-auto overscroll-contain pb-24">
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
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? 'Enter your Student ID, e.g. 202612345' : language === 'ko' ? '학번을 입력하세요, 예: 202612345' : '请输入您的学号，如 202612345'}
                        value={registerUniversity}
                        onChange={(e) => setRegisterUniversity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-350 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all outline-none"
                      />
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
              </footer>
            </div>
          ) : (
            // MAIN SPA TABS (HOME, COMMUNITY, PROFILE)
            <div className="pb-24">
              
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
                                  ? '定制您出发前到落地韩国30天的倒数日程，一键同步。' 
                                  : language === 'ko' 
                                  ? '출국 전부터 입국 후 30일까지의 필수 일정을 관리하세요.' 
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
                                        {language === 'zh' ? `进度 ${completedCount}/9` : language === 'ko' ? `진행도 ${completedCount}/9` : `Progress ${completedCount}/9`}
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
                            label: language === 'zh' ? '保险缴清' : language === 'ko' ? '보험 완납' : 'Paid',
                            gridSpan: "col-span-2",
                            icon: Shield
                          },
                          { 
                            category: GuideCategory.BANK, 
                            name: t('guide_bank'), 
                            desc: language === 'zh' ? '存折/借记卡' : language === 'ko' ? '통장/체크카드' : 'Debit Card', 
                            color: "bg-blue-50 text-blue-700 border-blue-100", 
                            label: language === 'zh' ? '开卡指南' : language === 'ko' ? '카드 개설' : 'Open Card',
                            icon: CreditCard
                          },
                          { 
                            category: GuideCategory.ARC, 
                            name: t('guide_arc'), 
                            desc: language === 'zh' ? 'HiKorea预订' : language === 'ko' ? 'HiKorea 예약' : 'HiKorea Booking', 
                            color: "bg-emerald-50 text-emerald-800 border-emerald-100", 
                            label: language === 'zh' ? '长期必备' : language === 'ko' ? '장기 필수' : 'Required',
                            icon: Globe
                          },
                          { 
                            category: GuideCategory.RECYCLE, 
                            name: t('guide_recycle'), 
                            desc: language === 'zh' ? '食品与一般袋' : language === 'ko' ? '음식물 및 일반 쓰레기' : 'Food & General Bags', 
                            color: "bg-amber-50/50 text-amber-700 border-amber-105", 
                            label: language === 'zh' ? '千万防罚' : language === 'ko' ? '벌금 주의' : 'Penalty Warn',
                            icon: Trash2
                          },
                          { 
                            category: GuideCategory.HOUSING, 
                            name: t('guide_housing'), 
                            desc: language === 'zh' ? '月租避坑/不动产' : language === 'ko' ? '월세 팁 및 부동산' : 'Rent Tips & Estate', 
                            color: "bg-indigo-50/60 text-indigo-700 border-indigo-100", 
                            label: language === 'zh' ? '合法迁入' : language === 'ko' ? '전입 신고' : 'Legal Move',
                            icon: Home
                          },
                          { 
                            category: GuideCategory.TRANSIT, 
                            name: t('guide_transit'), 
                            desc: language === 'zh' ? 'T-Money与换损' : language === 'ko' ? '티머니 및 환승 할인' : 'T-Money & Transfers', 
                            color: "bg-rose-50 text-rose-700 border-rose-100", 
                            label: language === 'zh' ? '出行无阻' : language === 'ko' ? '교통 안내' : 'Transit',
                            icon: Compass
                          },
                          { 
                            category: GuideCategory.SHIPPING, 
                            name: t('guide_shipping'), 
                            desc: language === 'zh' ? 'EMS到包税货代' : language === 'ko' ? '국제 EMS 및 택배' : 'EMS & Shipping Agents', 
                            color: "bg-cyan-50 text-cyan-800 border-cyan-100", 
                            label: language === 'zh' ? '寄送加固' : language === 'ko' ? '포장 배송' : 'Shipping',
                            icon: Plane
                          }
                        ].map((serv) => {
                          const WatermarkIcon = serv.icon;
                          return (
                            <div 
                              key={serv.category}
                              onClick={() => {
                                setActiveGuideCategory(serv.category);
                                setScreen(ActiveScreen.GUIDE_DETAIL);
                              }}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between min-h-[104px] relative overflow-hidden group ${serv.color} ${serv.gridSpan || ""}`}
                            >
                              {/* Background watermark icon */}
                              {WatermarkIcon && (
                                <WatermarkIcon className="absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.11] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 pointer-events-none" />
                              )}
                              
                              <div className="relative z-10">
                                <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.25 rounded-md bg-white border border-black/5 inline-block mb-1.5 bg-opacity-70">{serv.label}</span>
                                <h4 className="text-xs font-bold leading-normal text-slate-800 group-hover:text-[#00685f]">{serv.name}</h4>
                              </div>
                              <div className="flex justify-between items-center text-[10px] opacity-75 pt-1.5 relative z-10">
                                <span>{serv.desc}</span>
                                <span className="text-base font-black leading-none group-hover:translate-x-1.5 transition-transform">→</span>
                              </div>
                            </div>
                          );
                        })}
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
                          triggerSystemTip("显示【全部校友动态】");
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
                            triggerSystemTip("已为您筛选出【我的发布】");
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
                        我的发布 ({profile.isLoggedIn ? posts.filter(p => p.userId === profile.studentId).length : 0})
                      </button>
                      <button
                        onClick={() => {
                          setCommunityFilter("BOOKMARKED");
                          triggerSystemTip("已为您筛选出【收藏动态】");
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

                              {profile.isLoggedIn && (p.userId === profile.studentId || p.username === profile.name || profile.studentId === "202408151229" || profile.username === "zhangwei") && (
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
                        <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed mb-4">{language === 'en' ? 'Sign in to sync bookmarks and publish posts.' : language === 'ko' ? '로그인하여 북마크 동기화 및 게시물을 작성해 보세요.' : '登录后即可同步收藏、发布留学指南动态。'}</p>
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
                          {profile.isLoggedIn ? posts.filter(p => p.userId === profile.studentId).length : "0"}
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
                      <div onClick={() => triggerSystemTip(language === 'en' ? 'Need help? Contact email: kaoyeqwq@gmail.com, tu1975992194@gmail.com' : language === 'ko' ? '도움이 필요하시면 이메일로 연락주세요: kaoyeqwq@gmail.com, tu1975992194@gmail.com' : '如有帮助需要，请联系邮箱：kaoyeqwq@gmail.com, tu1975992194@gmail.com')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#00685f]">
                            <HelpCircle className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">{language === 'en' ? 'Help & Feedback' : language === 'ko' ? '도움말 및 피드백' : '帮助与反馈'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </section>



                    {/* PWA Notifications Settings */}
                    <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-slate-800 block">
                            {language === 'zh' ? '📱 手机后台推送通知' : language === 'ko' ? '📱 모바일 배경 푸시 알림' : '📱 Background Push Notifications'}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-normal max-w-[220px]">
                            {language === 'zh' 
                              ? '开启后，当倒数日提醒到期时，即使在关闭网页的情况下手机系统通知栏也会收到提示。' 
                              : language === 'ko' 
                              ? '활성화하면 웹페이지가 닫혀 있어도 디데이 알림 당일 모바일 알림창에 푸시 메시지가 전송됩니다.' 
                              : 'When enabled, you will receive reminders in your system notification bar even when the app is completely closed.'}
                          </span>
                        </div>
                        
                        <button
                          onClick={requestNotificationPermission}
                          className={`px-3 py-1.5 rounded-full font-bold text-[10px] shadow-sm transition-all active:scale-95 cursor-pointer ${
                            notificationPermission === 'granted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : notificationPermission === 'denied'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-violet-600 hover:bg-violet-700 text-white'
                          }`}
                        >
                          {notificationPermission === 'granted' ? (
                            language === 'zh' ? '已开启' : language === 'ko' ? '활성화됨' : 'Enabled'
                          ) : notificationPermission === 'denied' ? (
                            language === 'zh' ? '已禁用' : language === 'ko' ? '비활성화됨' : 'Blocked'
                          ) : (
                            language === 'zh' ? '点击授权' : language === 'ko' ? '권한 허용' : 'Authorize'
                          )}
                        </button>
                      </div>

                      {/* PWA Install Guide Info */}
                      <div className="p-2.5 bg-violet-50/50 rounded-xl border border-violet-100/50 text-[9px] text-violet-850 leading-relaxed space-y-1">
                        <span className="font-bold block">💡 {language === 'zh' ? '如何安装到手机桌面接收完整推送？' : language === 'ko' ? '전체 푸시 알림 수령을 위한 홈 화면 추가 방법:' : 'How to install on home screen for complete push:'}</span>
                        <div className="pl-1">
                          {language === 'zh' 
                            ? '• iPhone (iOS): 在 Safari 浏览器中打开，点击底部【分享】按钮，选择【添加到主屏幕】。' 
                            : language === 'ko' 
                            ? '• 아이폰 (iOS): Safari 브라우저에서 열고 하단 [공유] 버튼 누른 뒤 [홈 화면에 추가] 선택.' 
                            : '• iPhone (iOS): Open in Safari, tap the [Share] button, then select [Add to Home Screen].'}
                        </div>
                        <div className="pl-1">
                          {language === 'zh' 
                            ? '• Android: 使用 Chrome 浏览器打开，点击右上角【┇】，选择【安装应用】或【添加到主屏幕】。' 
                            : language === 'ko' 
                            ? '• 안드로이드: Chrome 브라우저에서 열고 우측 상단 [┇] 누른 뒤 [앱 설치] 또는 [홈 화면에 추가] 선택.' 
                            : '• Android: Open in Chrome, tap [┇], then select [Install App] or [Add to Home Screen].'}
                        </div>
                      </div>
                    </section>

                    {/* Advance notification days setting */}
                    {notificationPermission === 'granted' && (
                      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="space-y-0.5 flex-1 mr-3">
                            <span className="font-bold text-xs text-slate-800 block">
                              {language === 'zh' ? '⏰ 提前推送天数' : language === 'ko' ? '⏰ 사전 알림 일수' : '⏰ Advance Notice Days'}
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-normal">
                              {language === 'zh' 
                                ? `在到期前第 ${notifyAdvanceDays} 天推送提醒通知（可调 1-14 天）` 
                                : language === 'ko' 
                                ? `마감 ${notifyAdvanceDays}일 전 알림 발송 (1-14일 조정 가능)` 
                                : `Notify ${notifyAdvanceDays} day(s) before deadline (1-14 days)`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                const v = Math.max(1, notifyAdvanceDays - 1);
                                setNotifyAdvanceDays(v);
                                localStorage.setItem('notify_advance_days', String(v));
                              }}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                            >−</button>
                            <span className="text-base font-bold text-[#00685f] w-5 text-center">{notifyAdvanceDays}</span>
                            <button
                              onClick={() => {
                                const v = Math.min(14, notifyAdvanceDays + 1);
                                setNotifyAdvanceDays(v);
                                localStorage.setItem('notify_advance_days', String(v));
                              }}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                            >+</button>
                          </div>
                        </div>
                      </section>
                    )}

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
                        <p className="text-center text-[10px] text-slate-400 mt-2">版本号：v0.01 (测试版)</p>
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
        {/* ENTRY DATE SELECTOR WIZARD MODAL */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {showEntryDateModal && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden border border-slate-100"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-black tracking-wide">
                      {language === 'zh' ? '设定入境时间' : language === 'ko' ? '입국 날짜 설정' : 'Set Entry Date'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowEntryDateModal(false)}
                    className="p-1 hover:bg-white/10 rounded-full text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'zh' 
                      ? '请选择您前往韩国的预计入境日期。系统将自动生成入境关键日程，并将每日任务同步录入您的日历与倒数日中。' 
                      : language === 'ko' 
                      ? '한국 입국 예정일을 선택하세요. 입국 주요 일정이 자동 생성되며 캘린더와 디데이에 매일의 할 일이 등록됩니다.' 
                      : 'Please select your estimated entry date to Korea. The system will automatically generate key pre-departure/entry milestones and sync them to your calendar.'}
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">
                      {language === 'zh' ? '入境日期' : language === 'ko' ? '입국 날짜' : 'Entry Date'}
                    </label>
                    <input 
                      type="date"
                      value={tempEntryDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setTempEntryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-bold text-sm text-slate-700 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-150 flex gap-2">
                  <button
                    onClick={() => setShowEntryDateModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-600 transition-colors cursor-pointer"
                  >
                    {language === 'zh' ? '取消' : language === 'ko' ? '취소' : 'Cancel'}
                  </button>
                  <button
                    onClick={async () => {
                      const dateToSave = tempEntryDate || new Date().toISOString().split('T')[0];
                      setEntryDate(dateToSave);
                      localStorage.setItem("entry_date", dateToSave);
                      setShowEntryDateModal(false);
                      triggerSystemTip(language === 'zh' ? "正在生成入境日程并同步至您的日历..." : language === 'ko' ? "입국 일정을 생성하고 캘린더에 동기화하는 중..." : "Generating schedule and syncing to calendar...");
                      
                      // Clear previous entry schedule reminders first to avoid duplicates
                      if (profile.isLoggedIn) {
                        try {
                          const res = await fetch(`/api/reminders?userId=${profile.studentId}`);
                          const data = await res.json();
                          if (Array.isArray(data)) {
                            // Delete existing entry schedule items on server
                            for (const r of data) {
                              if (r.title.includes("入境") || r.title.includes("입국") || r.title.includes("Entry")) {
                                await fetch(`/api/reminders/${r.id}`, { method: "DELETE" });
                              }
                            }
                          }
                        } catch (err) {
                          console.error("Error clearing old reminders from server:", err);
                        }
                      }
                      
                      // Import schedule reminders
                      await importEntryScheduleToCalendar(dateToSave);
                      
                      triggerSystemTip(language === 'zh' ? "🎉 入境重要日程已成功同步至您的日历！" : language === 'ko' ? "🎉 입국 일정이 성공적으로 캘린더에 동기화되었습니다!" : "🎉 Entry schedule successfully synced to your calendar!");
                      setScreen(ActiveScreen.ENTRY_HELPER);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {language === 'zh' ? '生成并导入' : language === 'ko' ? '생성 및 등록' : 'Import Schedule'}
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
                              {profile.isLoggedIn && (c.userId === profile.studentId || c.username === profile.name || matchedPost.userId === profile.studentId || matchedPost.username === profile.name || profile.studentId === "202408151229" || profile.username === "zhangwei") && (
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
          <nav className="fixed bottom-0 left-0 right-0 md:absolute md:left-auto md:right-auto h-20 bg-white border-t border-slate-100 flex justify-around items-center px-4 py-2 z-50 shadow-lg shadow-black/5 select-none rounded-t-2xl w-full max-w-md mx-auto" style={{transform:'translateZ(0)'}}>
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
