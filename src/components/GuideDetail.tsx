/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GuideCategory } from "../types";
import { KNU_GUIDE_ITEMS } from "./knu_guides_data";
import { KNU_GUIDE_CONTENT } from "./knu_guides_content";
import { 
  ArrowLeft, Bell, Share2, Shield, FileText, CheckCircle2, AlertTriangle, Info, Map, 
  Bus, CreditCard, ShoppingBag, Trash2, HelpCircle, ChevronRight, Key, Smartphone,
  Layers, Package, Sparkles, Send, PhoneCall, Gift, Search, RefreshCw, Home,
  MapPin, Clock, GraduationCap, Award, Coins, BookOpen
} from "lucide-react";

interface GuideDetailProps {
  category: GuideCategory;
  onBack: () => void;
  onNavigateToForum?: () => void;
  onNavigateToSchedule?: () => void;
  language?: "zh" | "ko" | "en";
}

export default function GuideDetail({ 
  category, 
  onBack, 
  onNavigateToForum, 
  onNavigateToSchedule,
  language = "zh"
}: GuideDetailProps) {
  const t = (zh: string, ko: string, en: string) => {
    if (language === 'ko') return ko;
    if (language === 'en') return en;
    return zh;
  };
  // Share prompt
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  
  // KNU Campus guide states
  const [knuSearch, setKnuSearch] = useState("");
  const [knuTab, setKnuTab] = useState<'all' | 'info' | 'academics' | 'infra'>('all');
  const [activeKnuItemId, setActiveKnuItemId] = useState<string | null>(null);
  const [knuChecks, setKnuChecks] = useState<Record<string, boolean>>({});
  // Checklist states
  const [arcChecks, setArcChecks] = useState<Record<string, boolean>>({
    form: false,
    photo: false,
    address: false,
    enrollment: false
  });
  const [bankChecks, setBankChecks] = useState<Record<string, boolean>>({
    arc: false,
    passport: false,
    phone: false
  });
  
  // Accordion states for Insurance
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({
    delay: true,
    discount: false
  });

  const [busTab, setBusTab] = useState<'samcheok' | 'dogye' | 'shuttle'>('samcheok');

  const handleShare = () => {
    setShowShareAlert(true);
    setTimeout(() => {
      setShowShareAlert(false);
    }, 2000);
  };

  const toggleArcCheck = (key: string) => {
    setArcChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBankCheck = (key: string) => {
    setBankChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFaq = (key: string) => {
    setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. ARC (外国人登陆证办理指南)
  if (category === GuideCategory.ARC) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        {/* Top App Bar */}
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label={t("返回", "뒤로가기", "Back")}>
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("外国人登陆证办理指南", "외국인등록증 발급 가이드", "Alien Registration Card (ARC) Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero Section */}
          <section className="mb-6 relative rounded-2xl overflow-hidden bg-[#008378] h-48 flex flex-col justify-end p-4 text-white shadow-sm">
            <div className="absolute inset-0 opacity-20">
              <img 
                alt="Guide Hero" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOzZ6hcD7uy1xFbWoW74WZWv_vaMEQLvvZTcdad6kpG1i3pzvBrIkI1UyP1rrR6FdoROUSQZlQoyERYpH5UIAk6Vr2x5vo0fo8APuxqRbflGCNIfuJxJQiNqCIxOEbzK9qvX5i6zLhIDndptK3CuNy6o8DRncCd9a9X96Y1Ztxg-sXX_T6zBKMt0qINxh7TlMaxvmdRFigVYiHBgoJxJIFeL8KjcGJ1jEga9iPWiszSaht8d6YAfbSIwQXXUpW9_wpB4xH0ZlAiDL"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <span className="bg-[#fea619] text-[#2a1700] px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 inline-block">{t("核心指南", "핵심 가이드", "Core Guide")}</span>
              <h2 className="text-xl font-bold mb-1">{t("外国人登陆证 (ARC) 办理全攻略", "외국인등록증 (ARC) 발급 완전 정복", "Alien Registration Card (ARC) Comprehensive Guide")}</h2>
              <p className="text-xs text-white/95 leading-relaxed">{t("在韩长期居留的必备证件，通过本指南轻松完成办理流程。", "한국에 장기 체류하기 위해 필수적인 증명서입니다. 이 가이드를 통해 쉽게 발급 절차를 완료하세요.", "Essential identity card for long-term residence in Korea. Complete the process easily with this guide.")}</p>
            </div>
          </section>

          {/* Step 1: Appointment */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#00685f]">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">{t("第一步：HiKorea 在线预约", "1단계: 하이코리아(HiKorea) 온라인 예약", "Step 1: HiKorea Online Appointment")}</h3>
              </div>
              <span className="text-xs font-semibold text-[#00685f] bg-teal-50 px-2 py-0.5 rounded-full">{t("必需项", "필수 사항", "Required")}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t("所有出入境业务均实行100%预约制，未经预约无法办理。建议在入境后尽早进行预约，由于开学季高峰期，通常需要提前3-4周预约。", "모든 출입국 업무는 100% 예약제로 운영되며, 예약 없이는 방문 처리가 불가능합니다. 입국 후 가능한 한 빨리 예약하는 것을 권장하며, 학기 초 피크 기간에는 보통 3~4주 전에 예약해야 합니다.", "All immigration services operate on a 100% appointment system; walk-ins are not accepted. We recommend booking as soon as possible after arrival. During peak school seasons, you usually need to book 3-4 weeks in advance.")}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-1">{t("访问官网", "공식 홈페이지 방문", "Visit Website")}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t("访问 www.hikorea.go.kr 选择“방문예约”（访问预约）。", "www.hikorea.go.kr에 접속하여 '방문예약'을 선택하세요.", "Visit www.hikorea.go.kr and select 'Appointment Reservation' (방문예약).")}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-1">{t("打印预约单", "예약증 출력", "Print Confirmation")}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t("成功后务必打印或截图保存预约时间与序列号回执单。", "예약이 완료되면 예약 시간과 일련번호가 적힌 접수증을 반드시 인쇄하거나 화면을 캡처해 두세요.", "Be sure to print or take a screenshot of your appointment time and receipt number once successful.")}</p>
              </div>
            </div>

            <a 
              href="https://www.hikorea.go.kr" 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center bg-[#00685f] text-white hover:bg-[#005049] text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-sm text-center"
            >
              {t("前往 HiKorea 官网预约", "하이코리아 공식 홈페이지로 이동", "Go to HiKorea Website")}
            </a>
          </section>

          {/* Info Block: Cycle */}
          <section className="bg-[#2170e4] text-white rounded-2xl p-4 shadow-sm mb-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              {t("办理周期估计", "발급 예상 기간", "Estimated Processing Time")}
            </h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-xs opacity-90">{t("审核时长", "심사 기간", "Review Duration")}</span>
                <span className="text-xs font-bold">{t("约 2-3 周", "약 2~3주", "About 2-3 weeks")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-xs opacity-90">{t("制证耗时", "카드 제작 기간", "Card Production Time")}</span>
                <span className="text-xs font-bold">{t("约 1 周", "약 1주", "About 1 week")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-90">{t("总计预计时间", "예상 소요 시간 합계", "Total Estimated Time")}</span>
                <span className="text-sm font-bold text-teal-200">{t("3-4 周", "3~4주", "3-4 weeks")}</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-white/10 rounded-lg text-[11px] flex gap-1 items-center">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {t("寒暑假前后是办理绝对的高峰期，时间可能大幅延长。", "방학 전후는 발급 업무가 매우 밀리는 절대적인 피크 기간이므로 처리 시간이 크게 늘어날 수 있습니다.", "Before and after winter/summer breaks are peak periods, and processing times may be significantly extended.")}
            </div>
          </section>

          {/* Step 2: Checklist */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">{t("第二步：材料准备清单", "2단계: 필요 서류 준비 체크리스트", "Step 2: Document Checklist")}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">{t("※ 点击可勾选或取消，方便跟踪准备进度：", "※ 클릭하여 체크하거나 취소할 수 있어 준비 상태를 쉽게 추적할 수 있습니다:", "* Tap to check or uncheck items to track your preparation progress:")}</p>

            <div className="space-y-2.5">
              {[
                { key: "form", name: t("1. 综合申请表", "1. 통합신청서", "1. Integrated Application Form"), desc: t("在出入境大厅现场提供，建议提前在线下载并填写完毕。", "출입국관리사무소에 비치되어 있으나, 온라인으로 다운로드받아 미리 작성해 가는 것을 권장합니다.", "Available at the immigration office, but recommended to download and fill it out in advance online.") },
                { key: "photo", name: t("2. 白底证件照", "2. 흰색 배경 여권용 사진", "2. Passport Photo (White Background)"), desc: t("规格3.5cm x 4.5cm，近6个月内拍摄的白底照片。", "규격 3.5cm x 4.5cm, 최근 6개월 이내 촬영한 흰색 배경 사진입니다.", "Size 3.5cm x 4.5cm, taken within the last 6 months with a white background.") },
                { key: "address", name: t("3. 滞留地证明文件", "3. 체류지 입증 서류", "3. Proof of Residence"), desc: t("房屋租赁合同复印件，或者学校给出的宿舍入住证明。", "임대차계약서 사본 또는 학교에서 발급받은 기숙사 거주확인서 등입니다.", "Copy of rental lease agreement, or dormitory residence certificate issued by your university.") },
                { key: "enrollment", name: t("4. 在学证明书", "4. 재학증명서", "4. Certificate of Enrollment"), desc: t("到学校行政处/留学生处机器或前台开具的官方带有防伪章的在学书。", "학교 행정실이나 무인발급기 또는 유학생 담당 부서에서 발급받은 방지 도장이 찍힌 공식 재학증명서입니다.", "Official certificate with anti-counterfeiting stamp issued from your university office or automated kiosks.") }
              ].map((doc) => (
                <div 
                  key={doc.key}
                  onClick={() => toggleArcCheck(doc.key)}
                  className={`border p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-colors ${
                    arcChecks[doc.key] ? "border-emerald-200 bg-emerald-50/20" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${
                    arcChecks[doc.key] ? "text-emerald-500 fill-emerald-100" : "text-slate-300"
                  }`} />
                  <div>
                    <h4 className={`text-xs font-bold leading-none ${arcChecks[doc.key] ? "text-emerald-800" : "text-slate-850"}`}>
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 3: Pick up */}
          <section className="bg-amber-50/10 border border-amber-200/50 rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">{t("第三步：领取方式选择", "3단계: 수령 방식 선택", "Step 3: Choose Pickup Method")}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00685f] text-white text-[11px] font-bold flex items-center justify-center shrink-0">A</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t("现场领取", "방문 수령", "In-person Pickup")}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{t("收到成功制证的短信通知后，持“受理证”及护照原件重回预约大厅对应的快速服务窗口，无需重新预约号直接领取。", "카드 제작 완료 문자 메시지를 받은 후, 접수증과 여권 원본을 지참하고 예약 없이 출입국관리사무소의 빠른 서비스 창구로 방문하여 수령합니다.", "After receiving the SMS notice of completion, bring your filing receipt and original passport back to the fast-track service window. No booking required.")}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00685f] text-white text-[11px] font-bold flex items-center justify-center shrink-0">B</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t("快递邮寄", "우편 택배 수령", "Express Mail Delivery")}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{t("在大厅交材料按指纹时提前告知，填写快递单并现场交纳约4000-5000韩元快递费（只收现金），制证完毕后直接派送至您的居住地。", "창구에서 서류를 제출하고 지문을 등록할 때 택배 수령을 신청하고, 현장에서 배송비 4,000~5,000원(현금만 가능)을 납부하면 집으로 직접 배송됩니다.", "Inform the officer when submitting documents and fingerprints. Fill out the courier slip and pay ~4,000-5,000 KRW in cash. It will be delivered directly to your home.")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Small details */}
          <section className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#fea619]/10 p-3 rounded-xl border border-[#fea619]/20">
              <CreditCard className="w-4 h-4 text-[#855300] mb-1.5" />
              <h4 className="text-xs font-bold text-[#855300] mb-1">{t("工本费用", "수수료", "Processing Fee")}</h4>
              <p className="text-[11px] text-[#855300]/80 leading-normal mt-1">{t("3万韩元（仅收现金），邮寄另付约5000韩元邮费。", "3만 원 (현금만 가능), 등기 우편 시 약 5,000원 추가.", "30,000 KRW (cash only), plus ~5,000 KRW for mail.")}</p>
            </div>
            <div className="bg-[#00685f]/10 p-3 rounded-xl border border-[#00685f]/20">
              <Info className="w-4 h-4 text-[#00685f] mb-1.5" />
              <h4 className="text-xs font-bold text-[#00685f] mb-1">{t("办理周期", "처리 기간", "Processing Time")}</h4>
              <p className="text-[11px] text-[#00685f]/80 leading-normal mt-1">{t("通常需要3-4周，请在此期间保持电话畅通。", "보통 3~4주 소요되며, 이 기간 동안 전화를 잘 받아주세요.", "Usually takes 3-4 weeks. Please keep your phone reachable.")}</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (category === GuideCategory.TRANSIT) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label={t("返回", "뒤로가기", "Back")}>
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("公共交通完全手册", "대중교통 이용 가이드", "Public Transit Comprehensive Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-44 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover brightness-[0.7]" 
                alt="Subway"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIRLvgZtnh3HeszxEtXMwNbbHPOAwQfJqE3xo6QfILyGooM_eObqh0sk9sAt8ZvebHIlybACX_WrOGbLRs6ej_5ymNE3pSwUYUToeIPVCFyHpr8aR7K99snM4avHpPNtgd1wFr10Ogq22otByCc3y5iGAi3TxT7Ad8gLU4_fUxty1p80NtdT_PemUTezndEM7Qu4zXsYrHGL0iQLqCgISD1r2Ac2hpIgk04gWimTrAH91bV_dAFh6Q9OiUOpjYxQCEdrqZ4VEcVUQl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00685f]/90 to-transparent"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-amber-950 rounded-lg backdrop-blur-sm mb-1 inline-block">{t("生活向导", "생활 가이드", "Life Guide")}</span>
              <h2 className="text-xl font-bold">{t("公共交通完全手册", "대중교통 이용 가이드", "Public Transit Comprehensive Guide")}</h2>
              <p className="text-xs text-teal-100 opacity-90">{t("轻松掌握韩国留学出行的必备技能", "한국 유학 생활 중 이동을 위한 필수 기술을 쉽게 습득하세요.", "Easily master the essential skills for getting around during your study in Korea")}</p>
            </div>
          </section>

          {/* Subway */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#00685f]">
                <Bus className="w-5 h-5" />
                <h3 className="font-bold text-sm">{t("地铁 (Subway)", "지하철 (Subway)", "Subway")}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{t("韩国地铁覆盖极广，准时、干净且十分安全。所有大城市站点基本均有中、英、韩、日四语标识。", "한국의 지하철은 전 노선이 잘 발달되어 있으며 정시성, 청결성, 안전성 면에서 매우 뛰어납니다. 대도시의 모든 역에는 중국어, 영어, 한국어, 일본어로 안내가 되어 있습니다.", "Korea's subway covers a wide network, is punctual, clean, and highly safe. All major city stations have signage in Chinese, English, Korean, and Japanese.")}</p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-slate-600 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <span><strong>{t("颜色和指示：", "색상 및 지시선:", "Colors & Signs:")}</strong>{t("根据地面或圆柱颜色线条，或沿天花板悬挂的标牌轻松寻找换乘路线。", "바닥이나 기둥의 유도선 또는 천장의 이정표를 보고 환승 경로를 쉽게 찾을 수 있습니다.", "Follow colored lines on floors or pillars, or ceiling-hung signage, to easily find transfer paths.")}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <span><strong>{t("爱心专座：", "교통약자 배려석:", "Priority Seating:")}</strong>{t("车厢两端两排三个座位是爱心专座，通常即使车厢站满了也要将其空出。", "열차 객실 양쪽 끝에 있는 3인용 좌석은 교통약자 배려석입니다. 객실이 꽉 차더라도 비워두는 것이 일반적입니다.", "Seats at the ends of carriages are priority seats, usually kept empty even when the train is crowded.")}</span>
                </li>
              </ul>
            </div>
            <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-100">
              <img 
                className="w-full h-full object-cover"
                alt="Map Subway"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARWTOOMNYcFfrT5PJ5VolufTZp1vOsnzKAv5mJelD7bp05m4v6eSlSBNCx3GbHtq5kWArC77rC_KEWqeS1z7yQaGsJIOqAXFClKbWEXFNRVtBjhuLYgsxyzgdFnHW8woNUtjpeii0HLOKJQaREevHC13FuiB0hl0Th1cQDLNti73ErSVPwljghUEr1vr5wWsxOyQ6MB9T5ZmJn7Ztrl5CResCg3tuTmKcIavSBOVx2ZSsoc-tDqlxAnZ-yg1cPUoWgSqGrT2Joi2zo"
                referrerPolicy="no-referrer"
              />
            </div>
          </section>

          {/* Samcheok Bus Map */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#00685f]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-sm">{t("三陟市公交运行图", "삼척시 시내버스 노선도", "Samcheok Bus Map")}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {t(
                  "江原大学三陟校区和道溪校区均位于三陟市。以下为方便留学生通勤的市区公交与校园校车主要线路及运行图。",
                  "강원대학교 삼척캠퍼스와 도계캠퍼스가 위치한 삼척시의 시내버스 노선 및 캠퍼스 간 셔틀버스 운행 안내도입니다.",
                  "Kangwon National University's Samcheok and Dogye campuses are in Samcheok-si. Here is the bus route map and key routes for students."
                )}
              </p>
              
              <div 
                onClick={() => setZoomImage("/samcheok_bus_map.png")}
                className="w-full h-44 rounded-lg overflow-hidden border border-slate-100 cursor-zoom-in group relative"
              >
                <img 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="Samcheok Bus Map"
                  src="/samcheok_bus_map.png"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                  🔍 {t("点击查看大图", "클릭하여 크게 보기", "Click to enlarge")}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-[#00685f] pl-2 mb-2">
                  {t("核心通勤线路 & 实时系统", "핵심 통학 노선 및 실시간 시스템", "Key Routes & Real-time Info")}
                </h4>

                {/* Tab Switcher */}
                <div className="flex border-b border-slate-100 mb-3 bg-slate-50 p-1 rounded-lg">
                  <button
                    onClick={() => setBusTab('samcheok')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md text-center transition-all ${
                      busTab === 'samcheok'
                        ? 'bg-white text-[#00685f] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t("三陟市区", "삼척 시내권", "Samcheok City")}
                  </button>
                  <button
                    onClick={() => setBusTab('dogye')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md text-center transition-all ${
                      busTab === 'dogye'
                        ? 'bg-white text-[#00685f] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t("道溪校区", "도계 캠퍼스", "Dogye Campus")}
                  </button>
                  <button
                    onClick={() => setBusTab('shuttle')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md text-center transition-all ${
                      busTab === 'shuttle'
                        ? 'bg-white text-[#00685f] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t("免费校车/攻略", "무료 셔틀/꿀팁", "Shuttles & Tips")}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-3">
                  {busTab === 'samcheok' && (
                    <>
                      {/* Route 21-1 to 21-4 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-[#00685f] text-xs">21-1 / 21-2 / 21-3 / 21-4 {t("路", "번", "Bus")}</span>
                          <span className="bg-teal-50 text-teal-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("三陟-东海跨市", "삼척-동해 광역", "Samcheok-Donghae")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要站点：", "주요 경유지:", "Key Stops:")}</strong>
                          {t("三陟综合客运站 ↔ 三陟中央市场 ↔ 江原大学三陟校区 ↔ 增山 ↔ 北坪 ↔ 东海站 ↔ 东海客运站 ↔ 发한", "삼척종합버스터미널 ↔ 삼척중앙시장 ↔ 강원대 삼척캠퍼스 ↔ 증산 ↔ 북평 ↔ 동해역 ↔ 동해종합버스터미널 ↔ 발한", "Samcheok Terminal ↔ Central Market ↔ KNU Samcheok Campus ↔ Jeungsan ↔ Bukpyeong ↔ Donghae Station ↔ Donghae Terminal")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 班次：约 30-40 分钟一班。是往返邻市东海和高铁火车站的最核心骨干线路。", "⏱ 배차 간격: 약 30~40분. 동해시와 기차역(KTX)을 연결하는 핵심 광역 노선.", "⏱ Interval: Approx. 30-40 mins. Crucial intercity link to Donghae and Donghae KTX Station.")}
                        </p>
                      </div>

                      {/* Route 100/101/102 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-teal-850 text-xs">100 / 101 / 102 {t("路", "번", "Bus")}</span>
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("市区循环", "시내 순환", "City Circular")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要站点：", "주요 경유지:", "Key Stops:")}</strong>
                          {t("三陟客运站 ↔ 医疗院 ↔ 中央市场 ↔ 各大住宅区 (如Coaroo, G-Well等) ↔ 三陟中学", "삼척터미널 ↔ 삼척의료원 ↔ 삼척중앙시장 ↔ 주요 아파트 단지(코아루, 지웰 등) ↔ 삼척중학교", "Samcheok Terminal ↔ Medical Center ↔ Central Market ↔ Main Apartments (Coaroo, G-Well) ↔ Samcheok Middle School")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 覆盖市区所有生活圈与大型超市，适合日常买菜、购物及通勤。", "⏱ 삼척 시내의 모든 주거·상업 지역과 대형마트를 연결하여 일상 쇼핑과 시내 이동에 편리.", "⏱ Connects all residential/commercial hubs and supermarkets, ideal for daily shopping and local transit.")}
                        </p>
                      </div>

                      {/* Route 70/70-1 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-amber-700 text-xs">70 / 70-1 {t("路", "번", "Bus")}</span>
                          <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("三陟-道溪直通", "삼척-도계 직통", "Samcheok-Dogye")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要站点：", "주요 경유지:", "Key Stops:")}</strong>
                          {t("三陟综合客运站 ↔ 美老 ↔ 神基 ↔ 幻仙窟 (部分车次) ↔ 道溪客运站", "삼척종합버스터미널 ↔ 미로 ↔ 신기 ↔ 환선굴 (일부) ↔ 도계버스터미널", "Samcheok Terminal ↔ Miro ↔ Singi ↔ Hwanseongul (Some) ↔ Dogye Terminal")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 班次：每天仅 4 班。连接三陟市区与道溪校区所在城镇的唯一市内公交直达线，车程约50分钟。", "⏱ 배차 간격: 1일 4회 운행. 삼척 시내와 도계읍을 잇는 유일한 시내버스 직통 노선.", "⏱ Interval: 4 times/day. The only direct city bus connecting Samcheok center and Dogye, ~50 mins.")}
                        </p>
                      </div>
                    </>
                  )}

                  {busTab === 'dogye' && (
                    <>
                      {/* Route 43-1 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-[#00685f] text-xs">43-1 / 43-2 {t("路", "번", "Bus")}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("校区专线", "대학 전용", "Campus Dedicated")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要站点：", "주요 경유지:", "Key Stops:")}</strong>
                          {t("道溪客运站/火车站 ↔ 道溪校区宿舍（道源馆） ↔ 道溪校区教学楼（黄条馆）", "도계버스터미널/도계역 ↔ 도계캠퍼스 기숙사(도원관) ↔ 도계캠퍼스 본관(황조관)", "Dogye Terminal/Station ↔ Dogye Campus Dorms (Doweongwan) ↔ Lecture Hall (Hwangjogwan)")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 专为道溪校区学生设计的通勤公交，随教学时间表进行频次调整。", "⏱ 도계역/터미널에서 산꼭대기 캠퍼스(황조관/도원관)까지 운행하는 학생들을 위한 핵심 통학 버스.", "⏱ Connects Dogye Station/Terminal to the hilltop campus (Hwangjogwan/Doweongwan) for students.")}
                        </p>
                      </div>

                      {/* Route 70/70-1 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-amber-700 text-xs">70 / 70-1 {t("路", "번", "Bus")}</span>
                          <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("道溪-三陟直通", "도계-삼척 직통", "Dogye-Samcheok")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要站点：", "주요 경유지:", "Key Stops:")}</strong>
                          {t("道溪客运站 ↔ 进兴 / 神基 ↔ 美老 ↔ 三陟综合客运站", "도계버스터미널 ↔ 신기 ↔ 미로 ↔ 삼척종합버스터미널", "Dogye Terminal ↔ Singi ↔ Miro ↔ Samcheok Terminal")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 班次：每天仅 4 班。可直达三陟综合客运站或中途换乘至三陟校区。", "⏱ 배차 간격: 1일 4회 운행. 삼척 시내로 직접 갈 수 있는 유일한 노선.", "⏱ Interval: 4 times/day. Direct line to Samcheok Terminal, from where you can transfer to Samcheok Campus.")}
                        </p>
                      </div>

                      {/* Route 40/41/45 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-slate-800 text-xs">40 / 41 / 45 {t("路", "번", "Bus")}</span>
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("镇内/周边支线", "도계 읍내/지선", "Town/Local Branch")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          <strong>{t("主要区域：", "주요 경유지:", "Key Areas:")}</strong>
                          {t("道溪 ↔ 兴前里 / 占里 / 新里 / 古士里", "도계 ↔ 흥전리 / 점리 / 신리 / 고사리", "Dogye ↔ Heungjeon-ri / Jeom-ri / Sin-ri / Gosa-ri")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t("⏱ 方便在道溪城镇内部、周边的居住点 or 乡村景点穿梭出行。", "⏱ 도계 읍내 주변 마을과 주요 지선을 운행하여 지역 주민과 학생들의 근거리 이동을 지원.", "⏱ Runs to neighborhoods and villages around Dogye town, supporting short-distance travel.")}
                        </p>
                      </div>
                    </>
                  )}

                  {busTab === 'shuttle' && (
                    <>
                      {/* Free Shuttle */}
                      <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-indigo-800 text-xs">{t("两校区免费校车", "캠퍼스 간 무료 셔틀", "Free Inter-Campus Shuttle")}</span>
                          <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {t("在校生免费", "학생 무료", "Free for Students")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1 leading-normal">
                          {t("学期中周一至周五运营，直达往返于三陟校区（学生会馆前）与道溪校区之间，上车时必须出示手机端移动学生证。", "학기 중 월~금요일 운행하며 삼척캠퍼스(학생회관 앞) ↔ 도계캠퍼스를 직통 연결합니다. 탑승 시 모바일 학생증 제시 필수.", "Runs Mon-Fri during semesters directly between Samcheok (in front of Student Hall) and Dogye campus. Mobile student ID required.")}
                        </p>
                        <p className="text-[10px] text-indigo-600">
                          {t("💡 寒暑假期间停运，具体发车班次和时刻表请登录学校官网查询最新版。", "💡 방학 중에는 운행하지 않으며, 상세 시간표는 대학 홈페이지 공지사항에서 확인해야 합니다.", "💡 Suspended during vacations. Check university website notices for the latest timetable details.")}
                        </p>
                      </div>

                      {/* Real-time tools */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <h5 className="font-bold text-slate-800 text-[11px] mb-1.5 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-[#00685f]" />
                          {t("如何查询实时到站信息与班次？", "실시간 버스 도착 정보 조회 방법", "How to query real-time bus info")}
                        </h5>
                        <ul className="text-[10px] text-slate-600 space-y-1 pl-1 leading-relaxed">
                          <li>• {t("使用 Naver Map 或 KakaoMap 搜索公交路线或站点，即可直观查阅车辆当前所在位置和预计进站时间。", "Naver 지도 또는 KakaoMap 앱에서 버스 번호나 정류장을 검색하면 실시간 차량 위치와 도착 예정 시간을 알 수 있습니다.", "Search bus numbers or stop names in Naver Map or KakaoMap to view real-time location and ETA.")}</li>
                          <li>• {t("三陟公交系统无固定秒级排班，发车受当天路况和运力影响，极易产生几分钟的前后波动，建议提前 5-10 分钟到站候车。", "삼척 시내버스는 고정된 초 단위 배차가 아니므로 기상 및 도로 상황에 따라 지연될 수 있어 5~10분 전 정류장 대기가 안전합니다.", "Samcheok buses have flexible intervals. Traffic and weather can affect ETAs, so arriving at the stop 5-10 mins early is highly recommended.")}</li>
                        </ul>
                        <div className="mt-3">
                          <a 
                            href="https://its.samcheok.go.kr/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-1.5 bg-[#00685f] hover:bg-[#00574f] text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>{t("访问三陟市交通信息中心官网", "삼척시 버스정보시스템(BIS) 바로가기", "Visit Samcheok Bus Info System (BIS)")}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-white" />
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Transfer details */}
          <section className="bg-[#00685f] text-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-teal-200" />
              <h3 className="font-bold text-sm">{t("换乘优惠 (Transfer Discount)", "환승 할인 혜택 (Transfer Discount)", "Transfer Discount")}</h3>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {t("在地铁与公交、公交与公交间换乘（通常限制在30分钟内，晚间21:00之后限制延至60分钟内），可获得多次免费或超低差额换乘。多乘甚至有完全免首付卡。", "지하철-버스 또는 버스-버스 환승 시(보통 30분 이내, 저녁 9시 이후부터 다음날 오전 7시까지는 60분 이내), 환승 할인이 적용되어 무료 또는 저렴한 금액으로 이동할 수 있습니다.", "Transfers between subway and bus, or between buses (within 30 mins, extended to 60 mins after 21:00), qualify for multiple free or low-fare transfers.")}
            </p>
            <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
              <span className="opacity-85">{t("基本单次节省：", "1회 기본 절약 액수:", "Basic Savings per Trip:")}</span>
              <span className="font-bold text-sm text-yellow-300">{t("约 1,250 KRW (约合￥6.8)", "약 1,250 KRW", "Approx. 1,250 KRW")}</span>
            </div>
          </section>

          {/* T-Money Card */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-bold text-sm">{t("T-Money 交通卡", "T-Money 교통카드", "T-Money Transport Card")}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">{t("全韩国最普及的通用电子钱包卡，无论是地铁、巴士及特定出租车、便利店购物都可以支付。", "한국에서 가장 대중적인 선불 교통카드로 지하철, 버스, 일부 택시 탑승과 편의점 결제까지 가능합니다.", "Korea's most popular transit smartcard, usable on subways, buses, taxis, and at convenience stores.")}</p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
              <span className="text-slate-400 block mb-1.5">{t("购买与充值网点：", "구매 및 충전소:", "Purchase & Recharge Locations:")}</span>
              <div className="flex gap-2">
                <span className="bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm font-bold text-teal-700">GS25 / CU / 7-11</span>
                <span className="bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm font-bold text-teal-700">{t("各大地铁站自助机", "지하철역 무인 충전기", "Subway Station Kiosks")}</span>
              </div>
            </div>
          </section>


          {/* Essential Apps */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3">{t("推荐安装装机神器 APP", "필수 추천 앱 설치", "Recommended Transit Apps")}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0">Map</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t("Naver Map (Naver地图)", "네이버 지도 (Naver Map)", "Naver Map")}</h4>
                  <p className="text-[10px] text-slate-500">{t("最全，支持中文流利搜索、中文语音播报、步行导航。", "가장 종합적이며, 중국어 검색 및 내비게이션, 음성 안내를 지원합니다.", "Comprehensive maps, supports smooth Chinese search, voice prompts, and walking guides.")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-850 font-bold flex items-center justify-center shrink-0">Bus</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t("KakaoBus", "카카오버스 (KakaoBus)", "KakaoBus")}</h4>
                  <p className="text-[10px] text-slate-500">{t("超准公交车实时跟踪，定位在哪个具体站牌还差几分钟进站。", "매우 정확한 실시간 버스 도착 조회 서비스로 특정 정류소 도달 남은 시간을 제공합니다.", "Extremely accurate real-time bus tracking. Tells you which station it's at and arrival minutes.")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-teal-50 border border-teal-100 rounded-xl p-3">
            <h4 className="text-xs font-bold text-teal-800 mb-1.5 uppercase leading-none">{t("小贴士 (Tips)", "꿀팁 & 주의사항 (Tips)", "Tips & Reminders")}</h4>
            <div className="space-y-1.5 text-slate-500 text-[11px] leading-relaxed">
              <p>📍 <strong>{t("必须上下车均刷卡：", "승하차 시 반드시 카드 태그:", "Always Tag On & Off:")}</strong>{t("乘坐公交车必须在“上车”和“下车时”都触碰闸机刷卡。若下车遗忘刷卡，不但彻底会扣除超额换乘折扣，还可能面临在下一次上车扣划两倍最远距离惩罚。", "버스를 타고 내릴 때 단말기에 반드시 카드를 대야 합니다. 하차 태그를 누락하면 환승 혜택이 상실될 뿐만 아니라 다음 승차 시 최대 요금이 부과될 수 있습니다.", "You must tag your transit card when both boarding and alighting. Forgetting to tag off voids transfer discounts and incurs maximum fare penalty.")}</p>
              <p>📍 <strong>{t("注意末班车收车时间：", "지하철 막차 시간 확인:", "Check Last Train Time:")}</strong>{t("地铁通常在接近凌晨23:50开始断流备战，节假假日和周六日提前收尾，因此千万不要贪玩错过回家末班车。", "지하철은 보통 밤 11시 50분 전후로 막차가 마감되며 공휴일과 주말에는 더 일찍 운행이 중단되므로 주의하세요.", "Subways usually start winding down around 23:50, and end earlier on weekends and holidays. Don't miss your last train home.")}</p>
            </div>
          </section>
        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
    }

  // 3. RECYCLE (Waste Sorting)
  if (category === GuideCategory.RECYCLE) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("垃圾分类指南", "쓰레기 분리배출 안내", "Waste Sorting Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-44 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover brightness-[0.7]" 
                alt="Bins"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Sfy7lT5rCtiLXTR4ZwU0qYuu9A7ZyAIDdKpesxqDO_01jjXVZUDDZKiw4h-7LNoj19hTpQQYrUwuzBC7O35ZbO0K4Xc_bOme01E3kvDVbTX6pSlrir93stdlwn4OfM892u2lwl4qFdV9Vox9VKiM3z-2caMg7BJxuxVhjopEBDY5zQEyEwOer_0gnEwAsmKToAMgQzYvAQELttutXvOXhRP4m52qLBfwNGchmSEOWQ9Fp_GdsmncGwCBdUisyAMfKbYBLTcqZT3L"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10 w-full text-center">
              <h2 className="text-xl font-bold">{t("韩国垃圾分类完全攻略", "한국 쓰레기 분리배출 완전 공략", "Korea Waste Sorting Guide")}</h2>
              <p className="text-xs text-teal-100 opacity-90 mt-1">{t("韩语：쓰레기 분리배출 안내", "한국어: 쓰레기 분리배출 안내", "Korean: 쓰레기 분리배출 안내")}</p>
            </div>
          </section>

          {/* Standards */}
          <section className="mb-5">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <Trash2 className="w-5 h-5 text-[#00685f]" />
              {t("垃圾分类及处理标准", "쓰레기 분리배출 및 처리 표준", "Waste Sorting & Disposal Standards")}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* General */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm border-t-4 border-[#00685f]">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#00685f] mb-2">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850 mb-1">{t("一般垃圾", "일반 쓰레기", "General Waste")}</h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-3 leading-relaxed">{t("卫生纸巾、尿布、不可生化再生的硬质、脏塑料外壳包装等。", "화장지, 기저귀, 재활용 불가능한 경질 및 오염된 플라스틱 포장재 등.", "Toilet paper, diapers, non-recyclable rigid or contaminated plastic packaging, etc.")}</p>
                <div className="bg-teal-50/10 border border-teal-100 p-1.5 rounded text-[10px] text-[#00685f]">
                  <strong>{t("必需：", "필수: ", "Required: ")}</strong>{t("一般垃圾袋 (종량제봉투)", "일반 쓰레기 봉투 (종량제봉투)", "General Waste Bag (Standard Trash Bag)")}
                </div>
              </div>

              {/* Food */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm border-t-4 border-[#855300]">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850 mb-1">{t("食物垃圾", "음식물 쓰레기", "Food Waste")}</h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-3 leading-relaxed">{t("纯剩饭菜。原则是“动物能吃才可以作为食物垃圾处理”。", "순수 음식물 쓰레기. 원칙은 '동물이 먹을 수 있어야 음식물 쓰레기로 처리 가능'입니다.", "Pure leftover food. The rule of thumb: 'If animals can eat it, it is food waste.'")}</p>
                <div className="bg-amber-50/30 border border-amber-100 p-1.5 rounded text-[10px] text-amber-800">
                  <strong>{t("提示：", "팁: ", "Tip: ")}</strong>{t("排干水分，去坚硬骨头、贝壳。", "물기를 짜고 단단한 뼈나 조개껍데기는 제거하세요.", "Drain water, remove hard bones and shells.")}
                </div>
              </div>

              {/* Recyclables */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm border-t-4 border-[#0058be]">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0058be] mb-2">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850 mb-1">{t("可回收物", "재활용품", "Recyclables")}</h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-3 leading-relaxed">{t("纸类、易拉罐、玻璃啤酒瓶、透明及有色塑料、快餐泡沫餐盒。", "종이류, 캔류, 맥주병, 투명 및 유색 플라스틱, 스티로폼 식기.", "Paper, cans, beer bottles, clear & colored plastics, styrofoam containers.")}</p>
                <div className="bg-blue-50/30 border border-blue-100 p-1.5 rounded text-[10px] text-blue-700">
                  <strong>{t("要求：", "요구사항: ", "Requirements: ")}</strong>{t("倒空食物残留物，撕掉外侧标签。", "내용물을 비우고 외부 라벨을 떼어내세요.", "Empty residues and tear off outer labels.")}
                </div>
              </div>

              {/* Large */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm border-t-4 border-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 mb-2">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850 mb-1">{t("大件垃圾", "대형 폐기물", "Large Waste")}</h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-3 leading-relaxed">{t("废弃大件床垫、桌椅、旧电视电器等大件高层居民垃圾等。", "가구류(매트리스, 책상, 의자 등) 및 폐가전제품.", "Large items such as mattresses, tables, chairs, and old home appliances.")}</p>
                <div className="bg-slate-100 border border-slate-200 p-1.5 rounded text-[10px] opacity-95 text-slate-700">
                  <strong>{t("流程：", "절차: ", "Process: ")}</strong>{t("向管理员申报，购买专用贴纸贴上。", "경비실/관리사무소 신고 후 전용 스티커 부착.", "Report to office/security, buy and paste dedicated sticker.")}
                </div>
              </div>
            </div>
          </section>

          {/* Guide & Rules */}
          <section className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-[#00685f]" />
              {t("垃圾袋(종량제봉투)购买与使用指南", "쓰레기 봉투(종량제봉투) 구매 및 사용 안내", "Waste Bag (Standard Trash Bag) Purchase & Use Guide")}
            </h3>
            <div className="space-y-3 font-medium text-slate-500 text-xs">
              <p>📍 <strong>{t("必须在所属市（三陟市）内购买和使用：", "반드시 해당 지자체(삼척시) 봉투를 구매해야 합니다: ", "Must buy bags of your resident city (Samcheok-si): ")}</strong>{t("一般垃圾袋（通常为白色/淡蓝色）与食物垃圾袋（通常为黄色）有严格的地域管辖，例如买成了“东海市”或“江陵市”的袋子是不允许在“三陟市”（包括三陟及道溪校区）使用的。去便利店（CU/GS25等）向店员说明您需要“三陟市”（Samcheok-si）的垃圾袋购买即可。", "일반 쓰레기 봉투(대체로 흰색/연청색)와 음식물 쓰레기 봉투(대체로 노란색)는 엄격한 지역 제한이 있습니다. 예컨대 '동해시'나 '강릉시' 봉투는 '삼척시'(삼척 및 도계 캠퍼스 포함)에서 사용할 수 없습니다. 인근 편의점(CU, GS25 등)에서 '삼척시' 종량제 봉투를 달라고 하고 구매하면 됩니다.", "General waste bags (white/blue) and food waste bags (yellow) have strict city boundaries. For example, Donghae-si or Gangneung-si bags cannot be used in Samcheok-si (including Samcheok and Dogye campuses). Simply tell the clerk at a convenience store (CU, GS25, etc.) that you need 'Samcheok-si' trash bags.")}</p>
              <p>📍 <strong>{t("规格选择：", "규격 선택: ", "Size choices: ")}</strong>{t("一般一个人生活的话，一般垃圾袋建议买 10L 或 20L；食物垃圾袋由于非常容易发臭，建议买 1L 或 2L，勤满勤丢。", "1인 가구의 경우, 일반 쓰레기 봉투는 10L 또는 20L를 추천하며, 음식물 쓰레기는 쉽게 냄새가 나므로 1L 또는 2L를 구매하여 자주 버리는 것을 추천합니다.", "For single households, 10L or 20L general bags are recommended. Since food waste smells easily, we recommend 1L or 2L bags to discard frequently.")}</p>
            </div>
          </section>




        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  // 4. INSURANCE (保险缴纳指南)
  if (category === GuideCategory.INSURANCE) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("保险缴纳指南", "건강보험 납부 안내", "Health Insurance Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-44 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover brightness-[0.7]" 
                alt="Medical help"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPZP2l9o05oQ9mYOB5LZxaoS4jp3k9Ka0vB0IEdX093QkuoKhW-vDuY53kxAuvm_lSMS-iwgwHDqvhyEYfLNNeTmx4mdaEXIvXQJ3MRhDEuzlRu8qmBRBuLckKalYpH2iZJ0dtR_vLNGi2ZrrC2ZmxA_DjjljH6DO74KYShOBy9zE6EsS2_EK9dEjr4O_HT6-vv9oshWp-mfDjQszb2zznzj84NMf7172oi6dfr8Nayvh-JZAOsQrp5OC5FrDcpaROlF0s8i6qTtYg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00685f] via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#fea619] text-[#2a1700] rounded-full inline-block mb-1.5">{t("留学生必看", "유학생 필수", "Must-Read for Students")}</span>
              <h2 className="text-xl font-bold">{t("韩国国民健康保险 (NHI)", "한국 국민건강보험 (NHI)", "National Health Insurance (NHI)")}</h2>
              <p className="text-xs text-teal-100 opacity-90">{t("为您在韩留学生活保驾护航，详细缴纳流程全掌握。", "한국 유학 생활의 동반자, 상세 납부 절차를 알아보세요.", "Safeguard your study life in Korea, master the detailed payment process.")}</p>
            </div>
          </section>

          {/* Requirements Grid */}
          <section className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#00685f] mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">{t("所需材料清单", "필수 서류 체크리스트", "Required Documents Checklist")}</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500 leading-none">
                <li className="flex items-center gap-1">✅ {t("护照原件 (Passport)", "여권 원본 (Passport)", "Original Passport")}</li>
                <li className="flex items-center gap-1">✅ {t("登录证原件 (ARC)", "외국인등록증 원본 (ARC)", "Original ARC")}</li>
                <li className="flex items-center gap-1">✅ {t("学校在学证明书", "재학증명서", "Certificate of Enrollment")}</li>
              </ul>
            </div>

            <div className="bg-[#00685f] p-4 rounded-xl text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-teal-100 mb-1">{t("自动加入机制", "자동 가입 제도", "Automatic Enrollment")}</h4>
                <p className="text-[10px] text-white/90 leading-normal leading-relaxed">
                  {t("持留学D-2签证的学生在成功办理出外国人登录证后，无需单独填报加入，韩国健康保险公会会自动帮您加入，并将保费单邮寄送达。", "D-2 유학 비자 소지자는 외국인등록증 발급 후 별도 신청 없이 국민건강보험공단에 자동 가입되며, 보험료 고지서가 거주지로 우편 발송됩니다.", "D-2 visa holders are automatically enrolled in the National Health Insurance after getting their ARC. Bills will be sent to their registered address.")}
                </p>
              </div>
              <div className="text-[9px] text-yellow-300 font-bold mt-2 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                {t("第一笔费用将于次月合并计算下发", "첫 보험료는 다음 달에 합산되어 청구됩니다", "The first payment will be combined and billed next month")}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-5">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-[#00685f]" />
              {t("支付方面", "보험료 납부 방법", "Payment Methods")}
            </h3>

            <div className="relative pl-4 border-l border-slate-200 space-y-5 ml-2">
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-[18px] h-[18px] rounded-full bg-[#00685f] text-white text-[9px] font-bold flex items-center justify-center">1</div>
                <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">{t("邮寄到家去银行支付", "지로 고지서 수령 후 은행 납부", "Mail to Home and Pay at Bank")}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t("纸质账单每个月会邮寄到您外国人登录证上的居住地址，账单上附带专属虚拟账户。您可以带着账单直接去银行柜台/ATM缴费，或者通过手机银行向账单上的虚拟账户转账。", "매월 외국인등록증상 거주지로 지로 고지서가 발송되며, 고지서에는 전용 가상계좌번호가 적혀 있습니다. 고지서를 지참하여 은행 창구 또는 ATM에서 납부하거나, 폰뱅킹을 통해 고지서의 가상계좌로 이체하여 납부할 수 있습니다.", "A paper bill with a dedicated virtual account will be mailed to your registered address each month. You can bring the bill to pay at a bank counter/ATM, or transfer money to the virtual account via mobile banking.")}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-[18px] h-[18px] rounded-full bg-[#00685f] text-white text-[9px] font-bold flex items-center justify-center">2</div>
                <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">{t("选择最省心支付（卡内自动扣除）", "편리한 자동이체 설정 (계좌/카드 자동 납부)", "Worry-Free Auto-Debit (Automatic Deduction)")}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t("拿着通帐存折/银行卡，直接去健康保险办公室前台，或者给1345打电话用中文客服，申请“账户每月自动转账划扣 (자동이체)”。每个月卡内有足额就会自动扣，还可以享受少量扣税优惠！", "통장 또는 카드를 지참하여 건강보험공단 지사를 방문하거나, 1345에 전화하여 외국인 상담원을 통해 계좌 자동이체를 신청하세요. 매월 자동 인출되며 소액 감면 혜택도 받을 수 있습니다!", "Take your bankbook/card to an NHIS branch, or call 1345 to apply for Automatic Debit. NHIS will deduct premiums each month automatically, with a small discount!")}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-[18px] h-[18px] rounded-full bg-[#00685f] text-white text-[9px] font-bold flex items-center justify-center">3</div>
                <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">{t("下载健康保险app在app内缴费", "'The건강보험' 앱 다운로드 후 앱 내 납부", "Download Health Insurance App and Pay in App")}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t("下载国民健康保险公团官方手机APP“The 건강보험”（The Health Insurance）。登录后，您可以在APP内直接使用银行卡、转账等方式在线缴纳每月的健康保险费，并实时查询缴费明细与清算状态。", "국민건강보험공단 공식 모바일 앱인 'The 건강보험'을 다운로드하세요. 앱에 로그인한 후 신용카드나 계좌이체 등을 통해 편리하게 보험료를 즉시 납부할 수 있으며, 실시간으로 납부 내역 및 청구 금액을 조회할 수 있습니다.", "Download the official National Health Insurance Service app 'The 건강보험' (The Health Insurance). After logging in, you can easily pay your monthly insurance premiums via card or bank transfer directly in the app, and view your payment history in real time.")}</p>
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3">{t("常见热点问题 FAQ", "자주 묻는 질문 FAQ", "Frequently Asked Questions FAQ")}</h3>
            
            <div className="space-y-2">
              {/* FAQ 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq("delay")}
                >
                  <h4 className="text-xs font-bold text-slate-850">{t("Q：欠费了会导致外国人登录证延期受阻吗？", "Q: 보험료 연체 시 외국인등록증 연장에 지장이 있나요?", "Q: Will unpaid premiums block my ARC visa extension?")}</h4>
                  <span className="text-slate-400 font-bold transition-transform duration-200">
                    {faqOpen.delay ? "▲" : "▼"}
                  </span>
                </div>
                {faqOpen.delay && (
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border-l-2 border-[#00685f]">
                    <strong>{t("是的，决定性影响！", "네, 중대한 영향을 미칩니다!", "Yes, absolutely!")}</strong>{t("如果欠费次数超过三次，或者累计欠费金额过大，在延期登录证或者变更签证时，机器过审会将你红名单拦截。出入境事务所会给出缴费大厅地址，命令你缴清方可重新排队盖章过审，甚至拒绝延期！因此绝不能置之不理。", "3회 이상 연체하거나 연체 금액이 클 경우, 비자 연장 또는 자격 변경 시 출입국관리사무소 심사에서 제한을 받게 됩니다. 출입국에서는 건강보험료 완납 증명서를 제출하도록 요구하며 납부 전까지 비자 업무를 보류하거나 연장을 불허할 수 있으므로 체납하지 않는 것이 매우 중요합니다.", "If you fall behind on payments (especially over 3 times) or have a high unpaid balance, your visa extension or status change will be blocked by immigration. Officers will hold your extension until you pay in full. Do not ignore it.")}
                  </p>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq("discount")}
                >
                  <h4 className="text-xs font-bold text-slate-850">{t("Q：留学生可以申请保费优惠打折减免吗？", "Q: 유학생도 보험료 감면이나 할인 혜택을 받을 수 있나요?", "Q: Can students apply for premium discounts or reductions?")}</h4>
                  <span className="text-slate-400 font-bold transition-transform duration-200">
                    {faqOpen.discount ? "▲" : "▼"}
                  </span>
                </div>
                {faqOpen.discount && (
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border-l-2 border-[#00685f]">
                    <strong>{t("会自动按折扣打折！", "자동으로 감면 적용됩니다!", "Automatically applied!")}</strong>{t("韩国针对全日制D-2和D-4国际留学生其实已经给予了接近50%的国民健保降额优惠（正常工作职员或居民需要每月交纳十四万以上，而学生一般优惠价格每月约在六万到七万五韩元之间）。只要你正常注册在学、没有校外非法打工巨额申报，都将直接享受该学费折扣。", "한국은 정규 D-2 학위유학생 및 D-4 일반연수생에게 이미 약 50%의 보험료 감면 혜택을 자동 제공하고 있습니다 (일반 지역가입자는 매월 14만 원 이상 납부하는 반면, 유학생은 보통 6만 ~ 7만 5천 원 선입니다). 정상 등록된 학생이며 신고된 거액의 불법 소득이 없다면 혜택이 직접 적용됩니다.", "Korea already provides an automatic 50% premium reduction for full-time international students on D-2/D-4 visas. While general subscribers pay over 140,000 KRW/month, students enjoy a reduced rate of about 60,000-75,000 KRW. As long as you are enrolled and have no illegal high-income reports, you'll receive this discount automatically.")}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Forum CTA */}
          <section className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">{t("还有别的关于报销缴费细节？", "기타 보상 청구 및 납부 세부 사항이 궁금하신가요?", "Have more questions about reimbursement or payments?")}</h4>
              <p className="text-[10px] text-slate-550 leading-normal">{t("别急，有很多热心老资格老学长学姐在社群提供实战踩坑指南。", "걱정 마세요! 커뮤니티에 선배들이 남긴 실전 경험담과 팁이 가득합니다.", "Don't worry! Experienced seniors in the community have shared their real-world tips and guides.")}</p>
            </div>
            <button 
              onClick={onNavigateToForum} 
              className="bg-[#0058be] hover:bg-[#004395] shrink-0 text-white font-semibold text-xs px-4 py-2 rounded-full cursor-pointer shadow-sm"
            >
              {t("进入论坛", "포럼 바로가기", "Enter Forum")}
            </button>
          </section>
        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  // 5. HOUSING (留韩住房指南)
  if (category === GuideCategory.HOUSING) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("留韩住房指南", "유학 주거 안내", "Housing Guide for Students")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-52 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover" 
                alt="Apartment"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIX12Z8Wu6Y4ZYqgfsT_VyG_GzzCF6b7wddhloDtlFuGhVN9pzN2srQDwt7dH-mVYI-NSu-slpyqPPaZEQtdq_HJkGZojCZbJnzAXcXzgxfZ-yjl4PWMoCI8SFrVA-5mrJTA5XA9VOFlIBf53rN7RpQCnYo72clzQOkfpQZG3IKUcOsNbC5mo5gBVuUp9q8CIgylofzm3XoFEaIBdFOABkX4Z-OJYNN5xtSPwI87nmHaUn556Gd-F8giA8clSnaNgpnxZXi3yJpMUR"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00685f] via-slate-900/40 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-xs">
              <h2 className="text-xl font-bold leading-tight mb-1">{t("留韩住房全指南", "유학 주거 종합 가이드", "Complete Study in Korea Housing Guide")}</h2>
              <p className="text-xs text-teal-100 opacity-90 leading-relaxed">{t("为中国学生量身定制。从房型解析、避坑、合同审查，到搬家后14天申报变更，确保安家顺利。", "유학생을 위한 맞춤형 가이드. 방 유형 분석, 주의 사항, 계약 검토부터 이사 후 14일 이내 주소 변경 신고까지 완벽 정리.", "Tailored for international students. Covering room types, contract review, and the mandatory 14-day address change report.")}</p>
            </div>
          </section>

          {/* Types */}
          <section className="mb-5">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="bg-[#fea619] text-[#2a1700] px-2 py-0.5 rounded-full text-[10px] font-bold">HOT</span>
              <h3 className="font-bold text-sm text-slate-800">{t("主流房型精选对比", "주요 주거 유형 비교", "Comparison of Main Housing Types")}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#00685f]">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850">{t("1. 宿舍 (Dormitory)", "1. 기숙사 (Dormitory)", "1. Dormitory")}</h4>
                <p className="text-[10px] text-slate-500 leading-normal leading-relaxed">{t("通常包含水电网暖和基础桌床设施。优点是绝对安全省钱；缺点是限制多，宵禁管理严格，抽签极其难抽中。", "보통 공과금, 인터넷이 포함되며 기본 가구가 제공됩니다. 장점은 안전하고 비용이 저렴하다는 것이며, 단점은 통금시간 등 규칙이 엄격하고 경쟁률이 매우 높다는 점입니다.", "Usually includes utilities, internet, and basic furniture. Pros: safe and economical; Cons: strict curfew/rules and highly competitive lottery.")}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#00685f]">
                  <Home className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-850">{t("2. 一居室 (One-room)", "2. 원룸 (One-room)", "2. One-room (Studio)")}</h4>
                <p className="text-[10px] text-slate-500 leading-normal leading-relaxed">{t("独立卫浴和微型厨房。优点是隐私自由度绝佳；缺点是需要支付高额押金（保证金）并需要亲自支付水电和管理费、网费等。", "개인 욕실과 전용 주방이 있습니다. 장점은 완벽한 프라이버시와 자유로움이며, 단점은 거액의 보증금이 필요하고 공과금, 관리비, 인터넷 요금 등을 직접 납부해야 한다는 점입니다.", "Private bathroom and mini kitchen. Pros: excellent privacy and freedom; Cons: requires a high deposit (key money) and paying all utilities/fees yourself.")}</p>
              </div>
            </div>
          </section>

          {/* Contract Guide */}
          <section className="bg-emerald-50/10 border border-emerald-200/50 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-[#00685f]" />
              {t("租房避坑核心要点", "부동산 계약 필수 체크포인트", "Key Tips to Avoid Housing Traps")}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00685f] text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850">{t("必须分清 Jeonse (全税) 与 Wolse (月租)", "전세와 월세의 확실한 구분", "Understand Jeonse vs Wolse")}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 leading-relaxed">{t("韩国拥有独特的“传税 (Jeonse)”机制，不需要付房租而是向房东抵押巨额巨多押金。留学生通常推荐选择“月租 (Wolse)”：交纳相对大几百万到一千万韩元的保证金，按月付租。签约时必须写清退还保障。", "한국에는 매월 월세를 내는 대신 거액의 보증금을 맡기는 독특한 '전세' 제도가 있습니다. 유학생에게는 보통 수백만 원에서 천만 원 선의 보증금을 내고 월세를 내는 '월세'를 추천합니다. 계약 시 보증금 반환 보장을 명시해야 합니다.", "Korea has a unique 'Jeonse' (key money) system where a massive deposit is paid instead of monthly rent. We recommend 'Wolse' (monthly rent) for students: a smaller deposit (usually 5M-10M KRW) plus monthly payments. Guarantee of deposit return must be written clearly.")}</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00685f] text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850">{t("亲自核查不动产登记簿 (등기부등본)", "등기부등본 직접 확인", "Verify Certified Register of Real Estate (등기부등본)")}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 leading-relaxed">{t("通过可靠的“正规不动产中介”查实房东契约真伪，绝不能和无牌二房东直接微信签。最重要的是务必看上面是否有银行的“大额抵押贷款担保 (융자)”，提防房东破产导致你的保证金血本无归！", "신뢰할 수 있는 공인중개사를 통해 소유주 본인 여부를 확인하고, 무면허 전대업자와 직접 계약하지 마세요. 특히 등기부등본 상 근저당권 설정(융자) 금액을 확인하여 보증금을 떼일 위험이 없는지 점검해야 합니다!", "Check the landlord's identity through a registered agent; never sign directly with an unlicensed sub-lessor. Most importantly, check for large mortgages (융자) on the register to protect your deposit in case of landlord bankruptcy!")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transfer report */}
          <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-150/80 mb-4">
            <h4 className="text-xs font-bold text-slate-800 mb-2">{t("迁入申报 (Transfer Report)", "전입신고 (체류지 변경신고)", "Transfer Report (Change of Residence)")}</h4>
            <div className="bg-yellow-50 text-amber-900 border border-yellow-100 p-3 rounded-xl text-xs gap-1.5 flex flex-col">
              <div className="flex items-center gap-1 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t("搬家后 **14天内** 必须申报地址变更！", "이사 후 **14일 이내** 반드시 주소 변경 신고!", "Must report address change within **14 days** of moving!")}</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">{t("这是一个常常被忽略的法律问题。如果不幸逾期，将遭到数万到数十万韩币的严厉罚款。更严重的是，过迟未报将直接阻碍你的出入境签证延期！", "자주 소홀히 하는 법적 의무 사항입니다. 기한을 넘길 경우 수만 원에서 수십만 원의 과태료가 부과됩니다. 더 중요한 것은, 신고 지연 시 출입국 비자 연장이 제한될 수 있습니다!", "This is a frequently ignored legal requirement. Failure to do so will result in fines of tens to hundreds of thousands of KRW. Even worse, late reporting will directly block your immigration visa extension!")}</p>
              
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                {t("办理方式：", "신고 방법:", "How to Report:")}
                <br/>1. {t("亲去新房所属的“住民中心(동주민센터)”窗口直接提交合同。", "신 거주지 관할 주민센터를 방문하여 임대차계약서 제출.", "Visit the local Community Center (동주민센터) of your new home and submit your lease agreement.")}
                <br/>2. {t("登录政府外国人官网 HiKorea 提交扫描件材料进行线上极速办理。", "외국인 종합지원 포털 하이코리아(HiKorea)에 로그인하여 계약서 스캔본 업로드 후 온라인 간편 신청.", "Log in to HiKorea and upload a scan of your lease agreement for quick online processing.")}
              </p>
            </div>
          </section>

          {/* Hotlines */}
          <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-xs text-slate-800 mb-3">{t("韩国法律和生活救济热线", "생활 민원 및 외국인 핫라인", "Life and Legal Hotline in Korea")}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs">
                <span className="font-medium text-slate-600">{t("出入境外国人综合中心", "출입국 외국인 종합 안내 센터", "Immigration & Foreigner Center")}</span>
                <span className="font-bold text-[#00685f]">1345</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs">
                <span className="font-medium text-slate-600">{t("首尔全球多语服务交流中心", "서울 글로벌 센터", "Seoul Global Center")}</span>
                <span className="font-bold text-[#00685f]">02-2075-4180</span>
              </div>
            </div>
          </section>

          {/* Search realtor banner */}
          <section className="relative overflow-hidden rounded-xl h-40 flex items-center justify-center text-center p-4">
            <img 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.6]" 
              alt="Street"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHusC8orlZdoFI1JR9OorIhinQhNf5ThlXVlQYj4-ox0opiLxZoG6Fodmdq4WZEQCmAFmgb4d4PwSlFtA_ePXv9qWJGlb6W48YNvY3SGNbai8NSwEOBeR5BEwtiKlmyGzcyOsL9jy8Wdt6rOkaVAjq78BilTGPaZcZWvmBYKiRvbm1_oo8QiaYsQh0dgLm9kWDdcifkIgYHeMwZO6MauWtw2vzNjf1pZMr6CMKWD_U_Ejpec0LciXIi5aIHwFabpEfaCl2uOKpoSNS"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 text-white">
              <h3 className="font-bold text-xs mb-1">{t("寻找可靠的住房资源？", "신뢰할 수 있는 주거 정보를 찾으시나요?", "Looking for reliable housing resources?")}</h3>

              <button 
                onClick={onNavigateToForum}
                className="px-6 py-1.5 bg-[#fea619] hover:bg-amber-500 text-amber-950 rounded-full font-bold text-xs cursor-pointer inline-block"
              >
                {t("前往社区寻求帮助", "커뮤니티에서 도움 청하기", "Go to Community for Help")}
              </button>
            </div>
          </section>
        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  // 6. BANK (银行卡办理指南)
  if (category === GuideCategory.BANK) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("银行卡办理指南", "체크카드 및 통장 개설 안내", "Bank Card & Account Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-44 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover" 
                alt="Bank Counter"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvAnAmIhXZTlOmgw003ei_iU9UR3-6XR8KP7P7aggZDrpd8OuTrHD27A9kyvlCyM3CJ-v4W39R5kLlDC1uXhGLqfYiPlmktPEHRmE2NXzJ1E1e3y1ST4Bq5BauiLK1VHTFVg7ZcYUhhUcgrV004O9FUCTwDxMU_NBfVcW7BrJHniqzvak4__wtifI-Mu_2oCi6aZuXbE24NiEgahKFCFjPuXpO5fHHszcHxbDJXKjXqxX0_4Mjy7zOw6pP0rk_mqPI0yuBmUVYQQGK"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00685f]/90 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-xs">
              <h2 className="text-lg font-bold mb-1">{t("留学银行卡办理指南", "유학생을 위한 은행 업무 가이드", "Study Abroad Bank Card Guide")}</h2>
              <p className="text-xs text-white/90">{t("为在韩留学生提供最实用的金融服务开户指引，一步到位。", "한국 유학생들을 위한 가장 실용적인 금융 계좌 개설 가이드.", "The most practical financial service setup guide for students in Korea.")}</p>
            </div>
          </section>

          {/* Documents CHECKLIST (Interactive) */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#00685f]" />
              {t("开户时携带关键材料", "계좌 개설 필수 지참 서류", "Key Documents to Bring")}
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">{t("※ 大堂柜员非常严格，务必逐一自查（可点击标记）：", "※ 은행 창구 심사가 엄격하니 사전에 체크리스트를 확인해 주세요 (선택 시 체크 표시):", "※ Bank tellers are very strict. Check all items carefully (tap to mark):")}</p>

            <div className="space-y-2">
              <div 
                onClick={() => toggleBankCheck("arc")}
                className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer ${
                  bankChecks.arc ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  bankChecks.arc ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                }`}>
                  {bankChecks.arc && "✓"}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{t("1. 外国人登录证 (ARC)", "1. 외국인등록증 (ARC)", "1. Alien Registration Card (ARC)")}</h4>
                  <p className="text-[10px] text-slate-400">{t("目前韩国原则上只给完成了外国人合法登录登记的学生开卡。如果尚未下来，极少特定支行配合学校入学证明可能开出极其受额度限制的护照限定折。", "현재 한국은 원칙적으로 외국인 등록이 완료된 학생에게만 계좌 및 카드 발급을 허용합니다. 등록증 발급 전이라면, 아주 일부 지점에서 입학 허가 서류 확인 후 이체 한도가 엄격히 제한된 전용 통장만 개설할 수 있습니다.", "In principle, Korean banks only open accounts for students with a completed ARC. If your ARC is not yet issued, a few specific campus branches might open a highly restricted account with your passport and admission documents.")}</p>
                </div>
              </div>

              <div 
                onClick={() => toggleBankCheck("passport")}
                className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer ${
                  bankChecks.passport ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  bankChecks.passport ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                }`}>
                  {bankChecks.passport && "✓"}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{t("2. 护照原件 (Passport)", "2. 여권 원본 (Passport)", "2. Original Passport")}</h4>
                  <p className="text-[10px] text-slate-400">{t("核对身份、签字及入境签证记录使用。", "신원 확인, 본인 서명 및 입국 비자 확인용.", "Used to verify identity, signatures, and entry visa records.")}</p>
                </div>
              </div>

              <div 
                onClick={() => toggleBankCheck("phone")}
                className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer ${
                  bankChecks.phone ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  bankChecks.phone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                }`}>
                  {bankChecks.phone && "✓"}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{t("3. 本人实名认证的电话卡（必背！）", "3. 본인 명의 휴대폰 번호 (필수!)", "3. Mobile SIM Registered in Your Legal Name (Crucial!)")}</h4>
                  <p className="text-[10px] text-slate-400">{t("韩国在注册网络银行(Internet banking)或者绑定移动支付（KakaoPay、NaverPay）时，会触发极其死板的实名姓名及电话比对校验。字母拼写必须和登录证英文名大小写、空格一模一样！", "한국에서 인터넷뱅킹 가입 및 간편결제(KakaoPay, NaverPay 등) 연동 시 본인 실명 및 전화번호 일치 여부를 대단히 엄격히 대조합니다. 영문 철자 및 공백이 외국인등록증 영문 성명과 대소문자, 띄어쓰기까지 완벽히 일치해야 합니다!", "When registering for online banking or linking mobile payments (KakaoPay, NaverPay), strict real-name matches are performed. Your spelling and spaces must exactly match your ARC English name (case and spacing)!")}</p>
                </div>
              </div>
            </div>

            <div className="mt-3.5 p-3 bg-teal-50 border border-teal-100 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-[#00685f] shrink-0" />
              <p className="text-[10px] text-teal-800 leading-normal font-medium">{t("※ 多数柜员银行通常需要你出示学校盖章开出的在学证明书 (재학증명서) 作为留学生正当开卡申请理由配合，否则会直接不批。", "※ 대부분의 은행 창구에서는 유학생 계좌 개설을 위해 학교에서 발급받아 직인이 찍힌 재학증명서 제출을 필수로 요구합니다. 서류 미비 시 개설이 거절될 수 있습니다.", "※ Most bank tellers require a university-stamped Certificate of Enrollment (재학증명서) as proof of student status, otherwise opening an account may be rejected.")}</p>
            </div>
          </section>

          {/* Banks */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-[#00685f]" />
              {t("推荐银行", "추천 은행", "Recommended Banks")}
            </h3>

            <div className="space-y-2">
              {[
                { name: t("韩亚银行 (Hana Bank)", "하나은행 (Hana Bank)", "Hana Bank"), desc: t("其面向外国人的“Hana EZ”手机银行软件体验全韩数一数二顺。支持完全高速度跨境低手续费汇款中韩，汇率服务好。", "외국인 전용 'Hana EZ' 모바일 뱅킹 앱은 한국 최고의 유학 송금 편의성을 자랑하며, 빠른 해외 송금과 우수한 환율 우대 혜택을 제공합니다.", "Its foreign-oriented 'Hana EZ' app offers the best mobile banking experience. Supports fast cross-border remittance with low fees and excellent rates."), color: "bg-emerald-100 text-[#00685f]", label: t("韩亚", "하나", "Hana") },
                { name: t("国民银行 (KB Kookmin Bank)", "KB국민은행 (KB Kookmin Bank)", "KB Kookmin Bank"), desc: t("拥有全韩超级稠密的ATM和营业网点分布，安全性有绝对保障，办卡也十分严格。", "한국 전역에 매우 조밀한 ATM망과 지점을 보유하여 편리하며, 높은 자산 안전성을 보장하나 신규 통장 개설 절차가 꼼꼼합니다.", "Boasts an extremely dense ATM and branch network across Korea with top security, though card issuance is very strict."), color: "bg-yellow-100 text-yellow-700", label: t("国民", "국민", "KB") }
              ].map((b, idx) => (
                <div key={idx} className="flex gap-3 items-center border border-slate-100 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${b.color} font-bold text-xs shrink-0 flex items-center justify-center`}>
                    {b.label}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 leading-tight">{b.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Flow */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3">{t("标准开卡到手五部曲：", "체크카드 발급 5단계 가이드:", "5 Steps to Open Your Bank Account:")}</h3>
{/* ... */}
            <ul className="space-y-3 pl-3 text-xs text-slate-600 list-decimal">
              <li><strong>{t("前往对应支行：", "가까운 지점 방문: ", "Visit the Designated Branch: ")}</strong>{t("最好挑选大学校园内或者大学正门口对应的支行支店，其柜员极有处理留学生材料经验（其余极远偏僻区柜员常常不熟悉而造成多番为难审查）。", "대학 캠퍼스 내부 또는 정문 앞 지점을 선택하여 방문하는 것이 가장 좋습니다. 이곳 직원들은 유학생 업무 처리에 매우 능숙하지만, 외곽 지역 지점 직원들은 유학생 계좌 개설에 익숙하지 않아 심사가 한층 더 까다로울 수 있습니다.", "We highly recommend choosing the branch inside your university campus or right in front of the main gate. Their tellers are experienced with student documents, whereas far-away residential branches might raise unnecessary difficulties.")}</li>
              <li><strong>{t("说明目的：", "업무 목적 설명: ", "Explain Your Purpose: ")}</strong>{t("告知“我想办理一个一手的通折(Tongjang/存折)以及一张Check Card(借记卡)”。", "창구 직원에게 입출금 통장(통장)과 체크카드를 신규로 개설하고 싶다고 말씀하세요.", "Tell the teller: 'I would like to open a savings account with a Bankbook (통장) and apply for a Check Card (체크카드).'")}</li>
              <li><strong>{t("选择国际双币：", "해외 결제 기능 선택: ", "Select Payment Brand: ")}</strong>{t("借记卡建议要求开通带有银联(UnionPay)或Master/Visa标志，方便爸妈在国内直接划账或者自己网购。", "체크카드 신청 시 유니온페이(UnionPay) 또는 마스터/비자(Master/Visa) 브랜드 탑재를 요청하여, 부모님이 국내에서 송금하시거나 온라인 해외 결제가 편리하도록 설정하세요.", "It is recommended to request a check card with a UnionPay or Master/Visa logo, so parents can transfer money easily or you can shop online.")}</li>
              <li><strong>{t("设置六位密码：", "비밀번호 설정: ", "Set Your Password: ")}</strong>{t("通常在密码键盘上亲自按好，并牢记，不要写在纸片上被人偷看。", "비밀번호 입력기에 본인이 직접 4자리 혹은 6자리 비밀번호를 입력하고 기억해 두세요.", "Enter it yourself on the keypad. Memorize it and never write it down where others can see.")}</li>
              <li><strong>{t("开通网银：", "인터넷/모바일 뱅킹 신청: ", "Activate Mobile Banking: ")}</strong>{t("极重要！务必要求柜员替你连同开户一起注册 Mobile Banking 手机网银。并给你一张“安全卡(OTP/保安卡)”，方便你在手机上打钱给他人。", "대단히 중요합니다! 반드시 창구 직원에게 모바일 뱅킹 서비스 연동 등록을 요청하고, 이체 거래에 필요한 보안카드(OTP 또는 보안카드)를 수령해 모바일 이체가 수월하도록 하세요.", "Very important! Be sure to request the teller to activate Mobile Banking and issue a Security Card (OTP or 보안카드) so you can make wire transfers on your phone.")}</li>
            </ul>
          </section>

          {/* Quick tips */}
          <section className="bg-amber-50/20 shadow-inner p-4.5 rounded-2xl border border-amber-100">
            <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t("银行卡使用加分小神技：", "카드 사용을 더 편리하게 해줄 꿀팁:", "Bonus Tips for Using Your Bank Card:")}
            </h4>
            <div className="space-y-2 text-[10px] text-amber-800 leading-normal font-medium">
              <p>📍 <strong>{t("绑定 KakaoPay：", "카카오페이 연동: ", "Link KakaoPay: ")}</strong>{t("类似于国内支付宝微信支付，将你的借记卡极其简单顺水连通 KakaoTalk 的 KakaoPay 绑定，付款时展示条形码秒扫即可！", "모바일 메신저 카카오톡에 내장된 '카카오페이' 서비스에 체크카드를 연동하면 바코드 혹은 QR코드를 사용해 지갑 없이 스마트한 결제가 가능합니다!", "Similar to WeChat Pay or Alipay, link your check card to KakaoPay in KakaoTalk. Simply show your barcode/QR code to pay instantly!")}</p>
              <p>📍 <strong>{t("注意账户长期不用会锁定：", "미사용 계좌 잠금 주의: ", "Avoid Inactive Account Lock: ")}</strong>{t("韩国为了提防电信诈骗空户租借和洗钱。新卡通常配有极低每日 30万韩元 的限额限制，只要后期连续三个月有大额流水如房租、话费即可撤销额度限制。", "한국 금융 당국은 전기통신금융사기 및 차명 대여 방지를 위해 엄격한 규제를 적용합니다. 신규 개설 카드는 일일 이체 한도가 30만 원으로 제한되며, 향후 3개간 월세나 통신비 자동이체 등 대형 고정 거래 이력을 증빙해 제한을 해제할 수 있습니다.", "To prevent voice phishing and money laundering, new cards usually start with a low daily limit of 300,000 KRW. You can lift this limit after 3 months of consistent transactions, such as rent auto-debits or phone bill payments.")}</p>
            </div>
          </section>
        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  // 7. SHIPPING (物品邮寄最全攻略)
  if (category === GuideCategory.SHIPPING) {
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-semibold text-lg text-[#00685f]">{t("最全邮寄攻略", "해외 배송 종합 가이드", "Complete Shipping Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Hero */}
          <section className="mb-5 relative rounded-2xl overflow-hidden h-44 shadow-sm text-white flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                alt="Logistics background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXkiic7etavhLGox1mDy6Xp-otSKYxdjIx5M_HzjCazxmQDrGODdi42ZS3WWhjeDwlSpibsT4pAGyxhwSePEqOvmQfrtA8DutSD4tC8W3dkMSazWh9wIeLvKOOvlmN7dql4eQ1wkf4ZZL97HC867UnvfKVCMvYSh_TO-dbOrkLtLhCBGnPlUYHR2DiVlkiFynoELnZjPrWWyvre-lGVJwfnrJ2jBwQrptC0s5D5SgpTo5lnX8ihTrD_wvBYhzkiNqf_liwpDOWwop1"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-slate-900/10 to-transparent"></div>
            </div>
            <div className="relative z-10">
              <span className="bg-[#fea619] text-[#2a1700] px-3 py-1 rounded-full text-[10px] font-bold mb-1 inline-block">{t("留学生活指南", "유학 생활 가이드", "Student Life Guide")}</span>
              <h2 className="text-lg font-bold leading-none mb-1">{t("韩国寄中国：最全邮寄攻略", "한국에서 중국으로: 해외 배송 종합 가이드", "Korea to China: Complete Shipping Guide")}</h2>
              <p className="text-[11px] text-white/90 opacity-95">{t("从官方网点EMS到性价比极高的私人集运包税专线，教你清关技巧、保包装加固要点。", "공식 우체국 EMS부터 가성비 좋은 사설 택배 세금포함 노선까지, 통관 노하우 및 꼼꼼한 포장 요령을 안내합니다.", "From official EMS to highly cost-effective private logistics lines. Learn customs clearance tips and packaging reinforcement rules.")}</p>
            </div>
          </section>

          {/* Logistics channel comparisons */}
          <section className="mb-5">
            <h3 className="font-bold text-sm text-slate-800 mb-3">{t("选择合适靠谱的物流通道", "나에게 맞는 물류 채널 선택하기", "Select a Reliable Logistics Channel")}</h3>
            
            <div className="space-y-3">
              {/* EMS */}
              <div className="bg-white/95 p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-950">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    {t("1. 韩国邮政 EMS (首通推荐)", "1. 우체국 EMS (기본 추천)", "1. Korea Post EMS (Highly Recommended)")}
                  </div>
                  <span className="bg-[#f4fffc] text-[#00685f] border border-teal-100 text-[10px] font-bold px-2 py-0.5 rounded">{t("官方背景", "공식 채널", "Official Channel")}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-normal">
                  {t("直接由全韩最普及的大韩邮局（우체국）派送承揽。非常适合寄送个人急用重要文件和衣物杂项。", "한국에서 가장 흔히 볼 수 있는 우체국(우체국)을 통해 직접 접수 및 발송합니다. 급한 중요 서류나 개인 의류 및 잡화를 보내기에 가장 적합합니다.", "Operated directly by Korea Post (우체국). Highly suitable for sending urgent documents, clothes, and personal effects.")}
                </p>
                <div className="space-y-1.5 text-[10px] text-slate-500">
                  <p className="flex items-center gap-1 text-emerald-700">✓ <strong>{t("超高效率：", "매우 빠른 속도: ", "High Efficiency: ")}</strong>{t("清关通常仅需 3-7 天。可在邮局网站简单录机并预约上门收箱。", "통관이 대개 3~7일 이내에 완료됩니다. 우체국 웹사이트에서 간편하게 접수하고 방문 수거를 신청할 수 있습니다.", "Customs clearance usually takes only 3–7 days. Easily book on the website and schedule home pickup.")}</p>
                  <p className="flex items-center gap-1 text-emerald-700">✓ <strong>{t("通关放宽：", "원활한 통관: ", "Easy Clearance: ")}</strong>{t("多采取抽检制度，被税率极度可控。", "무작위 샘플링 검사 방식을 적용하여 관세 부과율이 비교적 낮고 예측 가능합니다.", "Uses a random sampling system; the tariff rate is highly controllable.")}</p>
                  <p className="flex items-center gap-1 text-red-700">✗ <strong>{t("硬伤：", "치명적 단점: ", "Drawback: ")}</strong>{t("首重大，续重价格极其高昂。", "기본 무게 요금이 높고, 추가 무게당 요금이 매우 비쌉니다.", "High base weight rate, and subsequent weight rates are extremely expensive.")}</p>
                </div>
              </div>

              {/* Private */}
              <div className="bg-white/95 p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-950">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                    {t("2. 华商私人国际集运/包税路线", "2. 사설 국제 물류 / 관세 포함 노선", "2. Private Logistics / Tax-Inclusive Line")}
                  </div>
                  <span className="bg-[#ffddb8] text-[#855300] text-[10px] font-bold px-2 py-0.5 rounded">{t("极惠高配", "높은 가성비", "Cost-Effective")}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-normal">
                  {t("由华人在大林、东大门、仁川周边开设的私人保税清关大庄承揽。", "대림, 동대문, 인천 등지에 위치한 사설 통관 업체를 통해 발송합니다.", "Operated by private customs clearance providers located around Daerim, Dongdaemun, or Incheon.")}
                </p>
                <div className="space-y-1.5 text-[10px] text-slate-500">
                  <p className="flex items-center gap-1 text-[#00685f]">✓ <strong>{t("超级划算：", "최고의 가성비: ", "Very Economical: ")}</strong>{t("低廉运费开支，很多口岸线路配有“完全保税打包通过制度”。", "배송 비용이 훨씬 저렴하며, 일부 채널은 세금이 미리 포함된 일괄 통관 혜택을 제공합니다.", "Low shipping costs; many channels come with tax-inclusive delivery packages.")}</p>
                  <p className="flex items-center gap-1 text-[#00685f]">✓ <strong>{t("打包贴心：", "꼼꼼한 서비스: ", "Helpful Packaging: ")}</strong>{t("全程全中文微信大堂经理沟通，免费上真空包装、防震膜包裹。", "중국어 또는 메신저(위챗 등)를 통한 소통이 가능하며 진공 포장, 충격 방지 에어캡 포장을 무료로 지원하기도 합니다.", "Chinese-speaking support on WeChat. Free vacuum packing and bubble wraps are often provided.")}</p>
                  <p className="flex items-center gap-1 text-red-700">✗ <strong>{t("劣势：", "단점: ", "Downside: ")}</strong>{t("相比EMS略慢，可能需要 10-20 天周期。", "EMS에 비해 조금 느린 편이며 보통 10~20일 정도 소요됩니다.", "Slower than EMS; usually takes about 10–20 days.")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Packaging standard */}
          <section className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
            <h3 className="font-bold text-sm text-slate-800 mb-2.5">{t("大韩打包与标准包装规范", "표준 안심 포장 가이드", "Standard Packaging Specifications")}</h3>
            
            <div className="space-y-3 mb-4">
              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#00685f] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold leading-none mb-1">{t("使用原配五层加厚瓦楞纸箱", "5중 고강도 박스 사용", "Use 5-Layer Double-Wall Corrugated Boxes")}</h4>
                  <p className="text-[10px] text-slate-500">{t("推荐直接在邮局前台零卖购买邮局5号或6号超厚纸箱，国际海运空运重力和抛掷极其残酷，一般单款单薄纸箱一压即碎。", "우체국 창구에서 판매하는 우체국 5호 또는 6호 규격 박스를 구매하는 것을 적극 권장합니다. 국제 배송 및 수하물 하역 과정에서 박스가 무거운 짐에 깔려 파손될 가능성이 큽니다.", "We highly recommend buying a No. 5 or No. 6 heavy-duty box directly at the post office. International transit involves heavy stacking and throwing; standard single-wall boxes easily collapse.")}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-3">
                <Package className="w-5 h-5 text-[#00685f] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold leading-none mb-1">{t("重体力填充气垫物", "빈 공간 충전재 사용", "Fill Empty Spaces with Cushioning")}</h4>
                  <p className="text-[10px] text-slate-500">{t("塞满大量旧报纸、废纸屑，或者包裹好气泡膜防震装箱。必须做到用力摇晃纸箱时，内部无任何松散晃动摩擦异响才能成功封印。", "신문지나 에어캡 등으로 박스 안을 빈틈없이 채우세요. 박스를 잡고 흔들었을 때 내부 물건이 움직이거나 덜컹거리는 소리가 들리지 않아야 안전합니다.", "Fill gaps with newspapers or bubble wrap. Ensure that when you shake the box, nothing shifts or makes noise inside.")}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00685f] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold leading-none mb-1">{t("“王字型”严密胶带防潮", "'H자형' 또는 '왕(王)자형' 안심 테이핑", "Secure Tape Coding ('H-Tape' Method)")}</h4>
                  <p className="text-[10px] text-slate-500">{t("海关查验和港内集卡往往露天运输。建议在纸箱内部严密罩一层超级大保护防水塑料垃圾袋，外层用特大强力封箱胶带按“王”字封印牢固。", "수출입 물류창고는 실외 노출 환경일 수 있으므로 박스 안에 큰 방수 비닐을 씌워 내용물을 넣은 후 박스 외관은 내마모 테이프로 단단히 밀봉하는 것이 좋습니다.", "Customs inspection and logistics yards are often exposed to elements. Line your box with a large waterproof plastic bag, and seal the outside thoroughly with heavy-duty shipping tape.")}</p>
                </div>
              </div>
            </div>

            <div className="relative h-44 rounded-xl overflow-hidden shadow-sm">
              <img 
                className="w-full h-full object-cover"
                alt="Pack layout"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwXRPKTRqC2WsIUPOa6j0smIt6wf2E8LcSdQWourdQ_BSTLBYguv22nL2Gd20ow7Kr8ER7pakQsSnNVjuLuXBvAWI19Nc71CbJg8XuB580MChw6jloQ0kiPEzC4_uPlBYObC1wgJLL9VcTTxHSYzZ6Z997v-Ktiv_d3-CWVv3Nl9TXc3LnTtKMiamMLJL2T7lE9oe7k5MTQDI8SazM3XSxM1y7jGbjcnZU6-HYFw42-Rl1kEh0ujR7ED9FZShA8SypMlei2tDK4rqN"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3">
                <p className="text-white text-xs font-semibold">{t("标准国际快递打包与密封材料示范", "국제 택배 표준 포장 및 밀봉 예시", "Standard International Courier Packaging Demonstration")}</p>
              </div>
            </div>
          </section>

          {/* Customs declarations rules */}
          <section className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
            <h3 className="font-bold text-sm text-[#00685f] mb-3 flex items-center gap-1">
              <Gift className="w-4 h-4 text-emerald-600" />
              {t("重中之重：海关和申报大公开", "가장 중요한 점: 세관 통관 및 신고 요령", "Most Important: Customs & Declarations")}
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-600">
              <div>
                <span className="font-bold text-[#005049] block">01. {t("价值申报不超1000元RMB：", "신고 가액 1,000위안 이하 유지:", "Declared Value Under 1,000 RMB:")}</span>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{t("我国海关对个人小包快递有严格货值限额限制，个人物品总原价不建议在通关单中写出跨过 1000 RMB。否则极高机率需要额外改派作为“普通商业一般报关”审查造成缴天价税。", "중국 세관은 개인 수하물에 대한 면세 제한 규정이 엄격하여 수하물 총 가액이 1,000 RMB를 초과하지 않도록 신고하는 것이 좋습니다. 초과 시 상업 통관으로 전환되어 높은 세금이나 반송 조치가 발생할 수 있습니다.", "China Customs has strict value limits for personal packages. We recommend keeping the total declared value under 1,000 RMB. Otherwise, it may be categorized as commercial cargo, incurring heavy taxes or return protocols.")}</p>
              </div>

              <div>
                <span className="font-bold text-[#005049] block">02. {t("申报清单必须精细不敷衍：", "품목 리스트는 세부적으로 기재:", "Itemized Packing List, No Vague Descriptions:")}</span>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{t("通关单上万不可图轻快仅仅描写“大批中国生活自用物品”。而要细数交代：“旧长袖T恤 x5, 使用旧教材运动鞋 x1, 二手旧书籍 x2”。描述得越具象越真实，海关开箱的几率就会大幅收缩。", "세관 신고서에 단순 '개인 물품 일체' 등으로 모호하게 적지 마세요. '헌 셔츠 5벌, 헌 전공책 2권, 중고 운동화 1켤레'처럼 상세 품명과 수량을 구체적이고 정직하게 기재해야 개장 검사 확률이 줄어듭니다.", "Do not write vague phrases like 'personal items'. Instead, list item details: 'Used long-sleeve T-shirt x5, Used textbooks x2, Used sneakers x1'. Specific and honest listings significantly reduce the chances of inspection.")}</p>
              </div>

              <div>
                <span className="font-bold text-[#005049] block">03. {t("性质必勾“Gift（礼物）”：", "배송 목적은 'Gift(선물)' 또는 '개인 용품' 선택:", "Mark as 'Gift' or 'Personal Effects':")}</span>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{t("一律勾选个人自用“Personal effects”或者是赠予礼物“Gift”。并在申报备注单里顺便写下英文：“Used clothes for personal return”等，大涨过审效率。", "배송 목적 항목에서 개인 물품(Personal effects) 또는 선물(Gift)을 체크하세요. 영문 비고란에 'Used clothes for personal return' 등을 기재하면 통관 속도가 훨씬 빨라집니다.", "Tick 'Personal effects' or 'Gift' for the shipping purpose. Adding a note like 'Used clothes for personal return' in the comments will speed up clearance.")}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-bold leading-normal border-l-4 border-emerald-600">
              {t("💡 专家大招传授：如果是用过的旧衣服或者学习教材，由于本来就没有完整市场新产品定价标签，请在清单详细追加“Used item”或“Used clothes”标注。海关在抽样扫描时基本会免予征税。", "💡 전문가 꿀팁: 입던 옷이나 중고 교재의 경우 원래 시장 판매 가치가 모호하므로 리스트에 'Used item' 또는 'Used clothes'를 추가로 명시해 주세요. 세관 검사 시 대개 면세로 통과됩니다.", "💡 Professional Tip: For used clothes or textbooks, since they lack brand-new retail price tags, be sure to append 'Used item' or 'Used clothes' to the description. Customs usually exempts these from duties.")}
            </div>
          </section>
        </main>
        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  // 8. KNU (江原大学三陟校区留学生指南)
  if (category === GuideCategory.KNU) {
    const getKnuItemContent = (title: string, id: string) => {
      if (id && KNU_GUIDE_CONTENT[id]) {
        return KNU_GUIDE_CONTENT[id](t);
      }
      
      const lowerTitle = title.toLowerCase();
      

      // Scenario 1: Bank
      if (lowerTitle.includes("銀行") || lowerTitle.includes("은행") || lowerTitle.includes("账户") || lowerTitle.includes("bank")) {
        return {
          heroDesc: t("办理韩国銀行账户，享受在韩便捷的快捷支付与转账汇款功能。",
                      "한국 은행 계좌 개설을 통해 간편한 송금 및 결제 서비스를 이용하세요.",
                      "Open a Korean bank account for seamless transfers and payments."),
          checklistTitle: t("开户所需材料清单", "은행 개설 필요 서류", "Required Documents"),
          checklistItems: [
            { key: "passport", name: t("1. 护照原件", "1. 여권 원본", "1. Original Passport"), desc: t("有效期内的护照原件。", "유효기간이 남은 여권 실물입니다.", "A valid physical passport.") },
            { key: "arc", name: t("2. 外国人登录证", "2. 외국인등록증", "2. Alien Registration Card (ARC)"), desc: t("如果还未发证，可到社区中心开具外国人登录事实证明书。", "등록증 발급 전인 경우 외국인등록사실증명서로 대체 가능합니다.", "Original card. If pending, Alien Registration Fact Certificate is accepted.") },
            { key: "enrollment", name: t("3. 在学证明书", "3. 재학증명서", "3. Certificate of Enrollment"), desc: t("学校印发的官方在学证明，一般需在30天内开具。", "학교에서 발급받은 30일 이내의 공식 재학증명서입니다.", "Official enrollment paper issued within the last 30 days.") },
            { key: "phone", name: t("4. 韩国手机号", "4. 한국 휴대폰 번호", "4. Korean Mobile Number"), desc: t("用于开通短信验证与网銀认证。", "본인 명의의 휴대폰 인증이 필요합니다.", "An active phone number for verification.") }
          ],
          stepsTitle: t("开户办理步骤", "은행 개설 단계", "Account Opening Steps"),
          steps: [
            { title: t("第一步：选择学校周边的銀行网点", "1단계: 학교 주변 은행 방문", "Step 1: Visit a Branch Near Campus"), desc: t("推荐选择江原大学校内的合作銀行（如新韩銀行 Shinhan Bank 或 韩亚銀行 Hana Bank）。", "강원대 교내 은행이나 하나은행, 신한은행 방문을 추천합니다.", "We recommend Hana Bank or Shinhan Bank.") },
            { title: t("第二步：排队取号并提交开户申请", "2단계: 번호표 발행 및 서류 제출", "Step 2: Submit Application & Form"), desc: t("告诉柜台职员需要办理留学生储蓄账户 (Check Card)，填写个人信息确认表并设定交易密码。", "창구 직원에게 계좌 개설 및 체크카드 발급을 요청하고 서류를 작성합니다.", "Request a check card and active mobile banking system. Fill out forms.") },
            { title: t("第三步：下载网銀 App 并完成首次激活", "3단계: 모바일 뱅킹 앱 설치 및 활성화", "Step 3: Activate Mobile Banking App"), desc: t("在柜台职员指导下下载手机銀行APP，激活网上銀行并进行首次小额转账测试。", "은행원 안내에 따라 뱅킹 앱을 설치하고 모바일 뱅킹을 연동하여 활성화합니다.", "Install the banking app with the clerk's help and configure passwords.") }
          ],
          faqTitle: t("开户常见问题", "은행 개설 자주 묻는 질문", "Frequently Asked Questions"),
          faqs: [
            { id: "limit", question: t("开户有转账额度限制吗？", "계좌 개설 시 이체 한도 제한이 있나요?", "Are there transfer limits on new accounts?"), answer: t("是的，留学生新开账户每日ATM取现和转账额度一般限制在30万韩元以内。后期可申请提升。", "네, 유학생 신규 계좌는 일일 이체 한도가 30만 원으로 제한됩니다. 추후 상향 가능합니다.", "Yes, new accounts are initially limited to 300,000 KRW daily. You can request an upgrade later.") },
            { id: "card", question: t("銀行卡可以直接当交通卡坐地铁公交吗？", "체크카드로 대중교통 이용이 가능한가요?", "Can my check card be used for public transit?"), answer: t("可以的，开卡时请明确向柜员提出需要包含“后付费交通卡” (후불교통카드) 功能。", "네, 발급 신청 시 반드시 '후불교통카드' 기능 추가를 요청하세요.", "Yes, ensure you ask the clerk to enable the 'Postpaid Transportation' function.") }
          ],
          linkText: t("前往韩亚銀行官方网站", "하나은행 공식 홈페이지 이동", "Go to Hana Bank Website"),
          linkUrl: "https://www.kebhana.com",
          contactPhone: "1599-1111",
          contactName: t("韩亚銀行客服热线", "하나은행 고객센터", "Hana Bank Customer Service")
        };
      }

      // Scenario 2: Visa / ARC
      if (lowerTitle.includes("外国") || lowerTitle.includes("登录") || lowerTitle.includes("arc") || lowerTitle.includes("등록증") ||
          lowerTitle.includes("签证") || lowerTitle.includes("비자") || lowerTitle.includes("出入境") || lowerTitle.includes("滞留") ||
          lowerTitle.includes("hikorea") || lowerTitle.includes("预约") || lowerTitle.includes("电子民愿")) {
        return {
          heroDesc: t("外国人登录证是您在韩长期合法停留的身份证件，入境90天内必须完成办理。",
                      "외국인등록증은 한국 장기 체류 유학생의 법적 신분증이며, 입국 후 90일 이내에 반드시 발급받아야 합니다.",
                      "The Alien Registration Card (ARC) is your legal ID for long-term stay in Korea. Must apply within 90 days of arrival."),
          checklistTitle: t("出入境业务所需材料清单", "출입국 필요 서류", "Required Documents"),
          checklistItems: [
            { key: "form", name: t("1. 综合申请表", "1. 통합신청서", "1. Integrated Application Form"), desc: t("可在HiKorea官网下载填写，或现场领取。", "하이코리아에서 출력하거나 현장에서 수령합니다.", "Available on HiKorea or at office.") },
            { key: "passport", name: t("2. 护照原件及复印件", "2. 여권 원본 및 사본", "2. Passport & Copy"), desc: t("护照原件必须带去，复印件请提前印好。", "여권 실물과 인적사항 페이지 사본입니다.", "Original passport and copy.") },
            { key: "photo", name: t("3. 白底证件照", "3. 흔언색 배경 사진", "3. Passport Photo"), desc: t("近6个月内拍摄的白底彩色免冠照片。", "최근 6개월 이내 흔언색 배경 사진입니다.", "White background photo, last 6 months.") },
            { key: "enrollment", name: t("4. 在学证明与缴费证明", "4. 재학증명서 및 납부 확인서", "4. Certificate of Enrollment & Tuition Receipt"), desc: t("证明您是合法注册的学生。", "정식 학생임을 증명하는 서류입니다.", "Official document proving active student status.") },
            { key: "residence", name: t("5. 滞留地证明文件", "5. 체류지 입증서류", "5. Proof of Residence"), desc: t("宿舍入住证明书，或房屋租赁合同书。", "기숙사 거주확인서 또는 임대차계약서입니다.", "Dorm certificate or rent contract.") },
            { key: "fee", name: t("6. 手续费 (3万韩元现金)", "6. 수수료 (3만 원 현금)", "6. Processing Fee (30,000 KRW cash)"), desc: t("现场ATM用现金缴纳。", "현장에서 ATM을 통해 납부합니다.", "Pay by cash via ATM at the lobby.") }
          ],
          stepsTitle: t("出入境业务办理步骤", "출입국 업무 단계", "Visa & ARC Processing Steps"),
          steps: [
            { title: t("第一步：HiKorea 在线访问预约", "1단계: 하이코리아 방문 예약", "Step 1: Online Appointment Reservation"), desc: t("登录 HiKorea 官网预约管辖校区的出入境事务所。", "하이코리아에서 관할 출입국사무소를 선택하여 방문 예약합니다.", "Visit HiKorea.go.kr, reserve an appointment.") },
            { title: t("第二步：整理纸质材料并准时出发", "2단계: 필요 서류 준비 및 방문", "Step 2: Gather Documents & Visit Office"), desc: t("备好所有材料。当天提前15分钟到达出入境大楼。", "서류를 준비하여 예약 시간 15분 전까지 도착합니다.", "Gather paper files, arrive 15 mins early.") },
            { title: t("第三步：柜台递交并等待制证", "3단계: 서류 제출 및 등록증 수령", "Step 3: Document Submission & Waiting"), desc: t("向窗口职员提交文件，录入指纹。发证时间一般需要3-4周。", "창구에 서류를 제출하고 지문을 등록합니다.", "Submit papers and register fingerprints. Processing takes 3-4 weeks.") }
          ],
          faqTitle: t("签证及登录证常见问题", "출입국 자주 묻는 질문", "Visa & ARC FAQ"),
          faqs: [
            { id: "period", question: t("入境多久内必须申请外国人登录证？", "외국인등록증은 언제까지 신청해야 하나요?", "When must I apply for my ARC?"), answer: t("必须在入境之日赧90天内办理好。", "입국 후 90일 이내에 반드시 신청해야 합니다.", "Must apply within 90 days of arrival.") },
            { id: "outside", question: t("未拿到实体卡前可以出境吗？", "등록증 카드가 나오기 전에 출국할 수 있나요?", "Can I travel outside before getting the ARC?"), answer: t("绝对不能！出境等同于自愿放弃滞留资格。", "안 됩니다! 출국 시 기존 유학 비자가 소멸될 수 있습니다.", "No. Exiting before finalizing ARC cancels your stay status.") }
          ],
          linkText: t("前往 HiKorea 在线预约官网", "하이코리아 공식 사이트 이동", "Go to HiKorea Website"),
          linkUrl: "https://www.hikorea.go.kr",
          contactPhone: "1345",
          contactName: t("外籍综合客服热线", "외국인종합안내센터", "Immigration Hotline")
        };
      }

      // Scenario 3: Housing / Dorm
      if (lowerTitle.includes("宿舍") || lowerTitle.includes("기숙사") || lowerTitle.includes("租房") || lowerTitle.includes("住房") || lowerTitle.includes("居住") || lowerTitle.includes("dormitory") || lowerTitle.includes("housing")) {
        return {
          heroDesc: t("妙善安置住所是良好留学生涯的第一步，了解宿舍规定与租房流程极其关键。",
                      "기숙사 규칙 및 방 구하기 팀을 확인하여 아늘한 내 집을 구해보세요.",
                      "Securing a safe home is key. Check dormitory guidelines and renting procedures."),
          checklistTitle: t("入住/租房准备材料清单", "주거 준비 필요 서류", "Required Documents"),
          checklistItems: [
            { key: "contract", name: t("1. 房屋合同或入住证明", "1. 거주 확인서 또는 계약서", "1. Contract or Residence Certificate"), desc: t("宿舍入住证明书，或房屋租赁合同。", "기숙사 거주확인서 또는 임대차계약서입니다.", "Dorm certificate or signed lease contract.") },
            { key: "xray", name: t("2. 结核诊断报告书", "2. 결핵진단서", "2. Tuberculosis Diagnosis Report"), desc: t("校内宿舍入住必备，需到保健所检查。", "기숙사 입사 필수 서류로, 보건소에서 발급받습니다.", "Mandatory for campus dorms via health center.") },
            { key: "passport", name: t("3. 护照与学生证复印件", "3. 여권 및 학생증 사본", "3. Passport & Student ID Copies"), desc: t("用于核对身份。", "신원 확인을 위해 제출합니다.", "Required for identity verification.") }
          ],
          stepsTitle: t("校内外住宿办理步骤", "주거 신청 및 입주 단계", "Housing Steps"),
          steps: [
            { title: t("第一步：按时进行在线申请与缴费", "1단계: 입사 신청 및 기숙사비 납부", "Step 1: Application & Fee Payment"), desc: t("在官网 K-Cloud 系统申请，选好宿舍后按时汇款。", "K-Cloud에서 신청하고 선발 후 기숙사비를 납부합니다.", "Apply on K-Cloud portal and pay fees.") },
            { title: t("第二步：去当地保健所开具结核证明", "2단계: 결핵 검사 진행 및 진단서 수령", "Step 2: Take Tuberculosis Test"), desc: t("前往当地保健所做胸透，拿到阴性结果证明。", "보건소에서 흘부 X-ray 촬영 후 음성 진단서를 수령합니다.", "Visit health center for X-ray and report.") },
            { title: t("第三步：现场登记领取鑰匙入住", "3단계: 행정실 거주 등록 및 입주", "Step 3: Registration & Check-in"), desc: t("携带材料到宿舍行政室登记入舍。", "결핵진단서와 신분증을 지참하여 사감실에 등록합니다.", "Bring docs to dorm manager for check-in.") }
          ],
          faqTitle: t("住宿及租房常见问题", "주거 관련 자주 묻는 질문", "Housing & Rent FAQ"),
          faqs: [
            { id: "vacation", question: t("假期期间可以继续住吗？", "방학 기간에도 거주 가능한가요?", "Can I stay during vacations?"), answer: t("需额外申请假期入舍并支付舍费。", "방학 연장 신청과 추가 비용 납부가 필요합니다.", "Requires a separate application and fee.") },
            { id: "agency", question: t("校外租房避坑指南", "원룸 구할 때 주의할 점", "Rent tips?"), answer: t("通过公认中介签约，核对登记簿訊本，并办理确定日期。", "공인중개사를 통해 계약하고 등기부등본 확인 및 확정일자를 받으세요.", "Use licensed agents, check registry, and get 확정일자.") }
          ],
          linkText: t("前往江原大学三陟宿舍官网", "강원대학교 삼첩생활관 공식 홈페이지", "Go to KNU Dormitory Website"),
          linkUrl: "https://dormitory.kangwon.ac.kr",
          contactPhone: "033-570-6471",
          contactName: t("三陟校区生活办", "삼첩생활관 행정실", "Samcheok Dorm Administration Office")
        };
      }

      // Scenario 4: Academics / Portal / e-RURI
      if (lowerTitle.includes("课程") || lowerTitle.includes("注册") || lowerTitle.includes("수강") || lowerTitle.includes("k-cloud") ||
          lowerTitle.includes("루리") || lowerTitle.includes("ruri") || lowerTitle.includes("成绩") || lowerTitle.includes("学籍") ||
          lowerTitle.includes("毕业") || lowerTitle.includes("韩语") || lowerTitle.includes("topik") ||
          lowerTitle.includes("学费") || lowerTitle.includes("등록금") || lowerTitle.includes("日程")) {
        return {
          heroDesc: t("掌握 K-Cloud 与 e-루리，完成选课、成绩查询与网课学习。",
                      "학사 시스템과 이러닝 플랫폼 사용법을 익혀 수강신청 및 온라인 학습을 원활히 하세요.",
                      "Master K-Cloud and e-RURI for registrations, grades, and learning."),
          checklistTitle: t("教务学习系统准备工作", "학사 시스템 준비 사항", "System Preparation Checklist"),
          checklistItems: [
            { key: "account", name: t("1. 门户账号", "1. 통합 로그인 계정", "1. Portal ID"), desc: t("初次登录需重设密码。", "첫 로그인 시 비밀번호를 재설정하세요.", "Reset password on first login.") },
            { key: "app", name: t("2. 官方 App", "2. 공식 모바일 앱", "2. Official App"), desc: t("接收重要教务通知。", "중요 학사 공지를 확인합니다.", "Receive important notifications.") },
            { key: "schedule", name: t("3. 时间表", "3. 수강 대상 시간표", "3. Schedule"), desc: t("提前检索课程编号。", "학수번호를 미리 검색해 둥니다.", "Search for course codes ahead of time.") }
          ],
          stepsTitle: t("教务学期核心事务", "학사 업무 단계", "Academic Tasks Flow"),
          steps: [
            { title: t("第一步：预存课程", "1단계: 관심과목 등록", "Step 1: Save Desired Courses"), desc: t("通过 K-Cloud 把课程加入购物车。", "K-Cloud에서 희망 과목을 장바구니에 담습니다.", "Add courses to cart in K-Cloud.") },
            { title: t("第二步：选课提交", "2단계: 수강신청 진행", "Step 2: Course Submission"), desc: t("选课开放后快速点击提交。", "수강신청 오픈 시 신속히 클릭합니다.", "Click submit when registration opens.") },
            { title: t("第三步：网课学习", "3단계: 이러닝 참여", "Step 3: Online Lectures"), desc: t("在 e-루리 观看视频并提交作业。", "e-루리에서 강의 영상 시청 및 과제를 제출합니다.", "Watch videos and submit work in e-RURI.") }
          ],
          faqTitle: t("选课常见问题", "수강신청 자주 묻는 질문", "Academics FAQ"),
          faqs: [
            { id: "drop", question: t("选课已满怎么办？", "수강 인원 초과 시 대처법", "What if course is full?"), answer: t("申请追加选课或关注变更周。", "증원 신청 혽은 변경 기간을 활용하세요.", "Request extra seat or wait for Add/Drop week.") },
            { id: "eruri", question: t("课程不同步怎么办？", "e-루리 동기화 문제", "Sync issues?"), answer: t("通常次日凌晨会自动同步。", "익일 새벽에 자동 연동됩니다.", "Data syncs early next morning.") }
          ],
          linkText: t("前往 K-Cloud 官网", "K-Cloud 포털 이동", "Go to K-Cloud Portal"),
          linkUrl: "https://kcloud.kangwon.ac.kr",
          contactPhone: "033-570-6014",
          contactName: t("三陟校区教务支援处", "삼첩교무지원팀", "Samcheok Academic Support Office")
        };
      }

      // Scenario 5: Shuttle / Bus — narrowed to prevent shadowing other scenarios
      if (lowerTitle.includes("班车") || lowerTitle.includes("통학버스") || lowerTitle.includes("셔틀") || lowerTitle.includes("shuttle") || lowerTitle.includes("통학")) {
        return {
          heroDesc: t("探索校园与三陟市区无忧出行，掌握免费班车时刻、市内公交路线与本地景点交通攻略。",
                      "캠퍼스와 삼척 시내를 편리하게 오가는 무료 셔틀버스 시간표, 시내버스 노선 및 주요 관광지 교통 정보를 안내해 드립니다.",
                      "Explore campus and Samcheok city easily. Learn about shuttle schedules, public buses, and local attractions."),
          checklistTitle: t("出行与生活配套准备清单", "교통 및 생활 편의 준비", "Transit Preparation Checklist"),
          checklistItems: [
            { key: "tmoney", name: t("1. T-Money 交通卡", "1. 티머니 교통카드", "1. T-Money Transportation Card"), desc: t("可在便利店随时购买和充值，乘坐公交和地铁换乘可打折。", "편의점에서 구매 및 충전하여 대중교통 탑승 시 환승 할인을 받습니다.", "Purchase and recharge at any convenience store for discount transfers.") },
            { key: "mapapp", name: t("2. Naver Map 导航 App", "2. 네이버 지도 / 카카오 맵 앱", "2. Naver Map or Kakao Map App"), desc: t("韩国境内出行千万不要用谷歌地图，Naver Map能精确到公交几点到站。", "국내 실시간 대중교통 및 길찾기 경로 조회를 위해 필요합니다.", "Essential navigation map apps. Precise schedule and path queries.") },
            { key: "schedule", name: t("3. 班车时刻表截图", "3. 셔틀버스 운행 시간표", "3. School Shuttle Timetable"), desc: t("保存到相册，寒暑假和学期期间的班车安排略有不同。", "학기 중과 방학 중 운행 스케줄이 다르므로 시간표 저장을 권장합니다.", "Keep a copy of shuttle bus timetable. Vacation schedules differ from semesters.") }
          ],
          stepsTitle: t("通勤班车及出行乘坐指南步骤", "통학 셔틀버스 및 교통 이용 단계", "Transit Procedures"),
          steps: [
            { title: t("第一步：定位校内免费班车站台", "1단계: 교내 셔틀버스 정류장 확인", "Step 1: Find Shuttle Stop on Campus"), desc: t("在学校主校门大牌坊一侧或图书馆前的广场，可以找到免费校车集结点。前往三陟站、客运站和工科校区的免费校车均在此集合。", "정문 셔틀버스 대기소나 운동장 앞 정류장에서 목적지(삼척역, 터미널 등)로 가는 버스에 탑승합니다.", "Find free shuttle stops at Main Gate or in front of the main library. Buses depart here for station and dorms.") },
            { title: t("第二步：核对发车时间并准时登车", "2단계: 운행 시간 조회 및 정시 탑승", "Step 2: Check Schedule & Board Bus"), desc: t("比对当天的班车时间表，校车发车非常精准，准点发车过时不候。无需出示硬卡，留学生均可直接免票乘车。", "운행 시간표를 확인하고 정시에 탑승하세요. 기사님께 별도의 신분증 제시 없이 무료로 탑승할 수 있습니다.", "Confirm the correct timeline. Buses start strictly on time. No payment or ticketing card is required for students.") },
            { title: t("第三步：购买交通卡换乘当地公交", "3단계: 로컬 시내버스 연동 탑승", "Step 3: Use Local Town Buses"), desc: t("需要前往三陟更远的地方（如孟芳海滩、三陟海滨等景区），可刷 T-Money 坐当地7xx路普通市内公交，40分钟内换乘免费。", "관광지(삼척해변, 맹방해변 등)로 가기 위해 시내버스 탑승 시 티머니 교통카드를 태그하여 이용합니다.", "To visit scenic beaches (e.g. Samcheok Beach, Maengbang Beach), take local town buses (7xx). Tap card for transfer discount.") }
          ],
          faqTitle: t("出行交通常见问题", "교통 관련 자주 묻는 질문", "Transit FAQ"),
          faqs: [
            { id: "free", question: t("学校免费校车所有人都能坐吗？", "교내 셔틀버스는 누구나 무료로 탈 수 있나요?", "Is the campus shuttle free for all students?"), answer: t("是的，江原大学所有在读留学生、教职工都可以直接免费乘坐校内的多条通勤班车，不需要支付任何乘车费用。", "네, 강원대학교 소속 유학생 및 교직원은 별도 탑승 요금 없이 무료로 이용할 수 있습니다.", "Yes, all registered international students, exchange students, and staff can ride all campus shuttle lines completely free of charge.") },
            { id: "taxi", question: t("在三陟打车（出租车）方便吗？", "삼척에서 택시를 타기 편리한가요?", "Is it easy to hail a taxi in Samcheok?"), answer: t("在市区直接在路边招手打车即可。如果在校区深处或偏远景点，推荐下载Kakao T打车软件，随时叫车并能看到预估路费，非常简单便利。", "시내에서는 길가에서 택시를 쉽게 잡을 수 있으며, 교내나 외곽에서는 'Kakao T' 어플을 이용하여 택시를 호출하는 것이 편리합니다.", "In downtown, you can hail a taxi easily on the road. On campus or remote beaches, download Kakao T app to call taxis immediately with estimated price.") }
          ],
          linkText: t("前往江原大学三陟校区班车介绍页", "강원대학교 통학버스 운행 안내 페이지", "Go to KNU Shuttle Bus Page"),
          linkUrl: "https://www.kangwon.ac.kr/www/selectBbsNttView.do?key=259&bbsNo=38&nttNo=153406",
          contactPhone: "033-570-6211",
          contactName: t("三陟校区学生支援处", "삼척학생지원팀", "Samcheok Student Affairs Office")
        };
      }

      // Scenario 6: Medical / Insurance / Health Center
      if (lowerTitle.includes("医疗") || lowerTitle.includes("保健") || lowerTitle.includes("보건") || lowerTitle.includes("hospital") || 
          lowerTitle.includes("医院") || lowerTitle.includes("保险") || lowerTitle.includes("보험")) {
        return {
          heroDesc: t("留学生医疗健康有保障，足不出校享受免费基础诊疗，校外就医享受国民健康保险高额报销。", 
                      "유학생 건강 수호! 교내 무료 보건실과 국민건강보험을 통한 저렴한 병의원 진료 혜택을 완벽 활용하세요.", 
                      "Comprehensive health support for students. Enjoy free basic care on campus and 50-70% discount under National Health Insurance off-campus."),
          checklistTitle: t("就医与保险理赔材料清单", "보건 및 병원 진료 필요 서류", "Required Documents"),
          checklistItems: [
            { key: "arc", name: t("1. 外国人登录证 / 护照", "1. 외국인등록증 / 여권", "1. ARC or Passport"), desc: t("出示身份后系统会自动拉取您的健康保险状态。", "신원 확인 및 건강보험 조회를 위해 반드시 지참해야 합니다.", "Required for registration and looking up your active NHI insurance.") },
            { key: "receipt", name: t("2. 诊疗收据与处方笺", "2. 진료비 계산서 및 처방전", "2. Hospital Receipt & Prescription"), desc: t("在医院付费后开具的纸质凭证，去药店拿药的必备单据。", "병원 수납 후 처방전을 받아 약국에 제출하여 약을 구매합니다.", "Official documents from hospital billing for claims and pharmacy dispensing.") }
          ],
          stepsTitle: t("校内外就医及保险报销步骤", "보건실 및 교외 병원 이용 단계", "Medical Steps"),
          steps: [
            { title: t("第一步：轻微不适前往校内保健室", "1단계: 가벼운 증상은 교내 보건실 방문", "Step 1: Visit Campus Health Clinic (Free)"), desc: t("如果只是轻微的感冒、发烧、擦伤或消化不良，可携带学生证前往校内图书馆一侧的保健室 (Infirmary)。保健医生会提供免费的基础治疗和常备药。", "가벼운 두통, 소화불량 등은 학생증을 지참하여 도서관 근처 보건실에 가면 무료로 일반 의약품 처방을 받을 수 있습니다.", "For cold, headache, or small wounds, bring Student ID to the campus Infirmary (보건실) for free basic treatment and pills.") },
            { title: t("第二步：严重疾病前往三陟医疗院", "2단계: 전문 진료는 삼척의료원 방문", "Step 2: Visit Samcheok Medical Center"), desc: t("如需详细化验检查或牙科、外科专业诊疗，可携带外国人登录证前往市中心的三陟医疗院 (Samcheok Medical Center)。系统自动扣减，只需缴纳 30%-50% 的个人自付部分。", "정밀 검사나 전문의 진료가 필요한 경우 삼척의료원을 방문하세요. 외국인등록을 마쳤다면 건강보험이 즉시 자동 적용됩니다.", "For professional tests, go to Samcheok Medical Center (삼척의료원) with your ARC. The NHI deduction applies automatically.") },
            { title: t("第三步：持处方笺在附近药店取药", "3단계: 처방전을 통한 약국 조제", "Step 3: Collect Medicine at Pharmacy"), desc: t("到医院附近的任意药店 (약국) 递交医生开具的处方笺，缴纳药费并拿取处方药。国民健康保险同样会对处方药进行高比例报销。", "의사에게 받은 처방전을 가지고 병원 인근 약국에 가서 약을 구매합니다. 약값 또한 건강보험 혜택이 적용됩니다.", "Take prescription to any pharmacy (약국). Pay highly subsidized fee and collect your medicines.") }
          ],
          faqTitle: t("就医健康常见问题", "의료/보험 자주 묻는 질문", "Medical & Insurance FAQ"),
          faqs: [
            { id: "nhi", question: t("国民健康保险是留学生强制必须交的吗？", "국민건강보험은 유학생 의무 가입인가요?", "Is National Health Insurance mandatory?"), answer: t("是的，根据韩国法律，所有入境长期学习的留学生在完成外国人登录后，会被出入境和健康保险公团强制自动加入国民健康保险 (NHI)。按月交纳保费，逾期将影响未来的签证延期申请！", "네, 한국에 장기 체류하는 유학생은 국민건강보험에 의무적으로 가입하게 되며 매달 보험료를 납부해야 합니다. 체납 시 비자 연장이 불가능할 수 있습니다.", "Yes, under Korean law, all foreign students with D-2 visa are automatically enrolled in the National Health Insurance (NHI) upon registering their ARC. Timely payment is mandatory, as delinquency will impact visa extensions.") },
            { id: "pharmacy", question: t("韩国可以直接买到消炎药和退烧药吗？", "처방전 없이 약국에서 소염진통제 등을 살 수 있나요?", "Can I buy prescription pills over-the-counter?"), answer: t("感冒药、退烧药、止痛药属于一般药品 (일반의약품)，可以直接在任意药店或 24小时便利店 直接免处方购买。但强效抗生素和消炎药必须由医生开具处方笺才能在药店拿取。", "일반 감기약, 진통제는 약국이나 편의점에서 처방전 없이 구매할 수 있습니다. 다만 항생제나 강력 소염제 등은 의사 처방이 필수적입니다.", "Basic cold pills, fevers reducers, and pain killers can be bought over-the-counter at pharmacies or 24h convenience stores. Strong antibiotics and anti-inflammatories strictly require a doctor's prescription.") }
          ],
          linkText: t("前往韩国国民健康保险官网", "국민건강보험공단 공식 사이트 이동", "Go to NHI Website"),
          linkUrl: "https://www.nhis.or.kr",
          contactPhone: "033-811-2000",
          contactName: t("国民健康保险公团客服中心", "국민건강보험공단 고객센터", "National Health Insurance Service (NHIS)")
        };
      }

      // Scenario 7: Wifi / SIM / Mobile Apps
      if (lowerTitle.includes("手机") || lowerTitle.includes("开通") || lowerTitle.includes("sim") || lowerTitle.includes("wi-fi") || 
          lowerTitle.includes("应用") || lowerTitle.includes("应用程序") || lowerTitle.includes("app") || lowerTitle.includes("应用程序")) {
        return {
          heroDesc: t("畅享校园高速免费 Wi-Fi，极速完成电话卡开通，掌握韩国生活核心 App 玩转日常社交。", 
                      "교내 초고속 무료 Wi-Fi 연동, 알뜰한 선불폰/요금제 개통 방법 및 한국 생활 필수 앱들을 완벽히 활용하세요.", 
                      "Connect to campus Wi-Fi instantly, choose the right mobile SIM card, and install the most helpful apps for life in Korea."),
          checklistTitle: t("网络与智能设备准备清单", "인터넷 및 스마트폰 개통 준비", "Network & Phone Checklist"),
          checklistItems: [
            { key: "passport", name: t("1. 护照或 ARC 实物", "1. 여권 또는 외국인등록증 실물", "1. Passport or ARC"), desc: t("办理电话卡签约的唯一法定证明材料。", "전화카드 개통을 위해 신분 증명이 필수적입니다.", "Required legal ID for mobile carrier registration.") },
            { key: "phone", name: t("2. 智能手机", "2. 언락 스마트폰", "2. Unlocked Smartphone"), desc: t("确保手机是解锁的（没有网络锁），能够直接插上韩国卡使用。", "해외 유심 사용 제한(컨트리락)이 해제된 단말기여야 합니다.", "Ensure your mobile device has country lock disabled and supports global LTE bands.") }
          ],
          stepsTitle: t("网络连接与电话卡办理步骤", "인터넷 및 휴대폰 개통 단계", "Mobile Setup Steps"),
          steps: [
            { title: t("第一步：连接校内 eduroam 或者是 KNU_WiFi", "1단계: 교내 와이파이 연결", "Step 1: Connect to KNU Free Wi-Fi"), desc: t("在校园无线网络列表中，选择‘KNU_WiFi’或‘eduroam’。用户名输入您的“K-Cloud 学号”，密码为您的门户网站登录密码，即可享受全校覆盖的极速无线网。", "와이파이 목록에서 KNU_WiFi를 선택하고, K-Cloud 포털 학번과 비밀번호를 입력하여 연결합니다.", "Select 'KNU_WiFi' or 'eduroam' in Wi-Fi list. Log in using your K-Cloud portal student ID and password.") },
            { title: t("第二步：去校外专营店开通预付费电话卡", "2단계: 알뜰 요금제/유심 개통", "Step 2: Purchase Mobile SIM Card"), desc: t("尚未拿到外国人登录证前，可凭“护照原件”前往校外的手机专营店或 Chingu Mobile ( 친구통신 ) 开通临时预付费电话卡 (Prepaid SIM card / 선불카드)。等登录证拿到后，可免费将实名认证升级为绑定登录证（从而支持在韩网上实名认证与网购支付）。", "외국인등록증 발급 전에는 여권으로 선불 유심을 개통하고, 추후 외국인등록증으로 명의를 변경하여 인증을 진행합니다.", "Before getting your ARC, buy a prepaid SIM card using your passport. Once you receive your ARC, upgrade registration at store to enable online identity check.") },
            { title: t("第三步：下载韩国日常必备 App 工具群", "3단계: 한국 생활 필수 앱 설치", "Step 3: Install Essential Applications"), desc: t("去应用商店集齐四大金刚 App：KakaoTalk（韩版微信）、Naver Map（地图导航）、Kakao T（快速叫出租车）以及 Baemin/배달의민족（外卖）。这些会让您的日常生活质量成倍飞跃！", "카카오톡, 네이버 지도, 카카오 T, 배달의민족 등 필수 생활 편의 앱을 다운로드합니다.", "Go to App store and download KakaoTalk (messenger), Naver Map (navigation), Kakao T (taxi call), and Baemin (food delivery).") }
          ],
          faqTitle: t("网络与软件常见问题", "IT 및 통신 자주 묻는 질문", "IT & Mobile FAQ"),
          faqs: [
            { id: "cert", question: t("为什么用护照办理的手机号无法进行网络实名认证？", "여권으로 개통한 전화번호로 실명인증이 안 되는 이유는 무엇인가요?", "Why can't I pass online verification using a passport phone number?"), answer: t("是的，韩国互联网实名制高度发达。在韩网网购、登录外卖APP以及网银转账时，实名系统只支持绑定了“外国人登录证” (ARC) 的手机卡来进行本人验证。护照开卡的手机号仅能用于电话接听和普通流量上网。请务必在拿到外国人登录证后，带上旧手机卡前往专营店进行“名义/实名认证信息变更”！", "한국의 대다수 인터넷 실명인증은 여권 번호로 처리할 수 없고, 오로지 외국인등록증 명의로 개통된 회선으로만 본인 확인 절차가 동작합니다. 매장에 방문하여 정보를 변경해야 합니다.", "Yes, online identity check in Korea requires the phone number's owner name to match your ARC profile. Passport registered numbers are limited to calls and data. Update your subscription info at store immediately upon receiving ARC card.") },
            { id: "wifi", question: t("宿舍房间里也有免费的无线网可以用吗？", "기숙사 방 안에서도 무선 인터넷을 쓸 수 있나요?", "Is there free Wi-Fi in the dorm rooms?"), answer: t("可以的，江原大学三陟校区的所有宿舍楼（如雄飞馆等）均全面实现了无线网络覆盖。您同样可以使用学号 and 密码，通过‘KNU_WiFi’或‘eduroam’高速免费连网。", "네, 기숙사 내에서도 KNU_WiFi 및 eduroam 신호가 강하게 잡히므로, 학번과 비밀번호를 이용하여 데이터 제한 없이 무료로 이용할 수 있습니다.", "Yes, high-speed Wi-Fi covers all study tables and rooms inside the dormitory buildings. You can enjoy free, unlimited connectivity using portal credentials.") }
          ],
          linkText: t("前往江原大学信息网介绍页", "강원대학교 정보화본부 공식 사이트", "Go to KNU Information & IT Center"),
          linkUrl: "https://ict.kangwon.ac.kr",
          contactPhone: "033-570-6215",
          contactName: t("三陟校区信息化支援团队", "삼척정보화지원팀", "Samcheok IT Support Team")
        };
      }

      // Scenario 8: Library
      if (lowerTitle.includes("图书馆") || lowerTitle.includes("도서관") || lowerTitle.includes("library")) {
        return {
          heroDesc: t("三陟校区图书馆大楼（建筑物编号104）正在进行全面数字化升级改造，为师生打造集“知识、文化、休息”于一体的现代化智能复合型学习中心。", 
                      "삼척캠퍼스 도서관(104호 건물)은 전면적인 디지털 공간 리모델링을 통해 학생들을 위한 지식, 문화, 휴식이 융합된 복합 문화 학습 공간을 구축하고 있습니다.", 
                      "The Samcheok Campus Library (Building 104) is undergoing a digital renovation, building a modern composite learning center integration of knowledge, culture, and rest."),
          checklistTitle: t("临时阅览室与借阅准备清单", "임시 열람실 및 대출 준비 사항", "Infirmary & Library Preparation Checklist"),
          checklistItems: [
            { key: "card", name: t("1. 电子学生证 App", "1. 모바일 학생증 앱", "1. Mobile Student ID App"), desc: t("用于刷卡进入临时阅览大厅和借书登记。", "임시 열람실 출입 및 도서 대출 등록 시 필요합니다.", "Required for gate access to the temporary reading hall and checkouts.") },
            { key: "rule", name: t("2. 确认施工公告与临时借书规范", "2. 공사 기간 도서 대출 수칙 확인", "2. Confirm Temporary Library Rules"), desc: t("施工期间，部分藏书和自学室移至临时地点，需提早知晓。", "공사 중에는 도서 소장 위치 및 열람 좌석이 변경되므로 사전 확인이 필요합니다.", "During renovation, some collections and study rooms are relocated; check online updates.") }
          ],
          stepsTitle: t("临时借阅与图书馆服务步骤", "임시 도서 대출 및 도서관 서비스 단계", "Library Service Steps"),
          steps: [
            { title: t("第一步：通过官网/App 查询书籍与馆藏位置", "1단계: 도서관 홈페이지/앱을 통한 도서 검색", "Step 1: Search Books on Library Website or App"), desc: t("登录江原大学图书馆官方网站或手机APP，检索所需图书，并确认目前该书在施工期间的临时存放大楼。", "강원대 도서관 홈페이지나 모바일 앱에 로그인하여 도서를 검색하고 현재 보관 중인 임시 위치를 조회합니다.", "Log into KNU library website or app, search for the target book, and check its temporary storage building during construction.") },
            { title: t("第二步：在线提交临时借阅申请", "2단계: 모바일 도서 대출 사전 신청", "Step 2: Submit Temporary Checkout Request Online"), desc: t("若图书处于临时封闭库房，可直接在线点击“申请临时借阅”，由馆员手动调拨分派至临时服务台。", "리모델링 기간에는 대출 신청 시 도서관 직원이 임시 데스크로 도서를 배달해 주는 신청 절차가 진행됩니다.", "If books are in sealed stacks, click 'Temporary Checkout Application' online. Staff will deliver the book to temporary counters.") },
            { title: t("第三步：前往临时服务台刷卡取书", "3단계: 임시 서비스 데스크 방문 및 도서 수령", "Step 3: Collect at Temporary Desk with Student ID"), desc: t("收到调拨成功的短信提醒后，在工作日携带电子学生证前往工科5号馆一楼的临时图书馆服务台，刷卡办理出库拿书。", "도서 준비 완료 알림을 받으면 학생증을 소지하고 공학5호관에 마련된 임시 데스크에서 수령합니다.", "Upon receiving SMS notice, bring your mobile student ID to temporary desk in Engineering Building 5 during weekdays to collect.") }
          ],
          faqTitle: t("图书馆施工常见问题", "도서관 리모델링 자주 묻는 질문", "Library Construction FAQ"),
          faqs: [
            { id: "study", question: t("施工期间，校内还有自习室可以用吗？", "공사 기간에 공부할 수 있는 대체 열람실이 있나요?", "Are there alternative study rooms during construction?"), answer: t("有的，学校在工科5号馆及宿舍区一楼大堂设置了多处临时自学阅览室，配备了高速无线 Wi-Fi、舒适自习课桌与充足的电源插座，开放时间为每日 09:00 - 22:00。", "네, 학교는 공학5호관 및 기숙사 1층 등에 초고속 무료 Wi-Fi와 전원 콘센트가 완비된 임시 열람실을 마련하여 매일 09:00부터 22:00까지 운영합니다.", "Yes, the university has prepared temporary study rooms in Engineering Building 5 and Dorm lobby, equipped with free high-speed Wi-Fi and power plugs, open daily 09:00 - 22:00.") },
            { id: "return", question: t("借阅的图书怎么归还？", "빌린 도서는 어떻게 반납하나요?", "How do I return borrowed books?"), answer: t("您可直接前往临时借阅点服务台进行人工归还；在非工作时段，可直接将图书投入设置在图书馆大楼正门一侧的 24小时自助图书归还箱 (Book Drop) 中即可。", "임시 데스크에 반납하거나, 일과 시간 외에는 도서관 정문에 비치된 24시간 도서 반납함을 이용하여 반납할 수 있습니다.", "You can return them at the temporary desk, or drop them in the 24-hour self-service Book Drop box located beside the Library main gate during off-hours.") }
          ],
          linkText: t("前往江原大学图书馆官方网站", "강원대학교 도서관 공식 홈페이지 이동", "Go to KNU Library Website"),
          linkUrl: "https://library.kangwon.ac.kr",
          contactPhone: "033-570-6241",
          contactName: t("三陟图书馆学能支援组", "삼척도서관 학술지원팀", "Samcheok Library Academic Support Team")
        };
      }

      // Scenario 9: Sports Facilities
      if (lowerTitle.includes("体育") || lowerTitle.includes("체육") || lowerTitle.includes("sports") || lowerTitle.includes("运动") || lowerTitle.includes("健身")) {
        return {
          heroDesc: t("畅享三陟校区一流的室内外运动场地，包括综合体育中心健身房、室外大操场、网球场与篮球场，享受健康活力的在韩留学生涯。", 
                      "삼척캠퍼스의 종합체육관 헬스장, 운동장, 테니스장, 농구장 등 최고 수준의 실내외 체육시설을 이용하여 건강한 대학 생활을 즐기세요.", 
                      "Enjoy first-class indoor and outdoor sports facilities on Samcheok Campus, including gym, athletics field, tennis courts, and basketball courts."),
          checklistTitle: t("体育设施使用准备清单", "체육시설 이용 준비 사항", "Sports Facilities Checklist"),
          checklistItems: [
            { key: "shoes", name: t("1. 干净的室内运动鞋", "1. 깨끗한 실내 운동화", "1. Clean Indoor Athletic Shoes"), desc: t("使用综合体育馆和健身房的硬性规定，防止磨损地板，禁止穿室外鞋进入。", "실내 체육관 및 헬스장 입장 시 실내 전용 운동화 착용이 필수입니다.", "Mandatory for indoor gym and stadium to protect floors; outdoor shoes are strictly prohibited.") },
            { key: "id", name: t("2. 携带实体或电子学生证", "2. 실물 또는 모바일 학생증", "2. Original or Mobile Student ID"), desc: t("进入健身房刷卡验证，或租借羽毛球拍、篮球时的法定质押身份证明。", "체육관 입장 시 신원 확인과 장비 대여를 위한 학생증이 필요합니다.", "Required for gym entry check and renting balls or rackets as legal ID.") }
          ],
          stepsTitle: t("体育场馆场地预约步骤", "체육시설 예약 및 이용 단계", "Venue Booking Steps"),
          steps: [
            { title: t("第一步：线上 K-Cloud 申请或线下递交预约单", "1단계: K-Cloud 예약 또는 학생지원팀 오프라인 신청", "Step 1: Apply via K-Cloud or Visit Student Affairs"), desc: t("如果需要使用操场、网球场等大型场地，需提前 3 天在 K-Cloud 系统的“设施使用申请”栏预约，或者到本馆学生支援处递交纸质申请书。", "운동장이나 테니스장 등 단체 시설은 이용 3일 전 K-Cloud 포털을 통해 예약하거나 학생지원팀에 신청서를 제출합니다.", "For large fields (athletics, tennis), apply 3 days early via K-Cloud portal 'Facility Booking' or hand in paper form at admin office.") },
            { title: t("第二步：活动当天前台出示学生证实名签到", "2단계: 이용 당일 체육관 데스크 학생증 확인", "Step 2: Present ID Card for Check-in on Activity Day"), desc: t("携带学生证准时到达现场。若是使用室内综合体育馆或健身房，必须在大门服务台进行条码刷卡登记，测量体温并换上室内运动鞋。", "예약 시간에 맞춰 체육관에 도착해 학생증을 태그하고 실내 운동화로 갈아신은 후 입장합니다.", "Arrive on time, tap your student ID at front desk, swap to clean indoor sneakers, and complete sign-in.") },
            { title: t("第三步：协助管理员清理场地并归还器材", "3단계: 이용 후 뒷정리 및 장비 반납", "Step 3: Cleanup Venue & Return Rented Gear"), desc: t("运动结束后，必须协助管理员将羽毛球网、球拍等归还原位，自觉清理垃圾、带走随身物品并闭灯离开。", "체육 활동이 끝난 후 사용한 장비를 정리하여 반납하고 쓰레기 분리수거 및 소등 후 퇴실합니다.", "Clean up the field/court, place badminton nets or rackets back in storage, dispose of trash, and ensure lights are off before exiting.") }
          ],
          faqTitle: t("体育设施使用常见问题", "체육시설 자주 묻는 질문", "Sports Facilities FAQ"),
          faqs: [
            { id: "free_gym", question: t("校内的健身房是对学生完全免费开放的吗？", "교내 헬스장(체력단련실)은 무료인가요?", "Is the campus fitness gym completely free?"), answer: t("是的，江原大学三陟校区的在校留学生、交换生持电子或实体学生证，即可在周一至周五的指定开放时段免费进入综合体育馆内的健身房锻炼，无需交纳额外费用。", "네, 강원대 삼척캠퍼스 재학생은 학생증만 지참하면 체육관 내 체력단련실을 무료로 자유롭게 이용할 수 있습니다.", "Yes, all registered international and exchange students can use the campus gym inside the sports center completely free during weekday open slots with a valid ID.") },
            { id: "rent", question: t("可以免费借羽毛球拍或篮球吗？", "농구공이나 배드민턴 라켓 대여가 가능한가요?", "Can I rent basketballs or badminton rackets for free?"), answer: t("可以。在综合体育馆一楼器材室出示学生证，即可免费租借篮球、排球和羽毛球拍，使用完毕后在当日闭馆前半小时归还即可。", "네, 체육관 1층 관리실에 학생증을 맡기면 농구공, 축구공, 라켓 등을 무료로 대여받아 사용할 수 있습니다.", "Yes, present your student ID at equipment desk on the 1st floor to borrow basketballs, soccer balls, or rackets for free. Return them before closing.") }
          ],
          linkText: t("查看三陟校区体育设施介绍页", "강원대학교 삼척캠퍼스 체육시설 안내", "View KNU Sports Center Page"),
          linkUrl: "https://www.kangwon.ac.kr/www/selectBbsNttView.do?key=259&bbsNo=38&nttNo=153406",
          contactPhone: "033-570-6211",
          contactName: t("三陟校区学生支援处", "삼척학생지원팀", "Samcheok Student Affairs Office")
        };
      }

      // Scenario 10: Convenience Amenities
      if (lowerTitle.includes("便利") || lowerTitle.includes("편의") || lowerTitle.includes("amenities") || lowerTitle.includes("convenience") || lowerTitle.includes("学生会馆")) {
        return {
          heroDesc: t("轻松熟悉三陟校区内部及周边的便利店、文印复印室、自动取款机（ATM）与咖啡馆，提升日常校园生活品质。", 
                      "학생회관 내 편의점, 복사실, ATM 기기, 북카페 등 교내 편의시설 위치와 이용 요령을 파악해 편리한 대학 생활을 누리세요.", 
                      "Get familiar with convenience store, photocopy center, ATMs, and cafe inside the Student Hall to enjoy a high-quality campus life."),
          checklistTitle: t("使用文印与金融便利准备清单", "인쇄 및 금융 편의 이용 준비", "Convenience Setup Checklist"),
          checklistItems: [
            { key: "card", name: t("1. 准备韩国卡或手机极速支付", "1. 한국 체크카드 또는 카카오페이 준비", "1. Korean Bank Card or Mobile Pay"), desc: t("用于便利店购买小商品、复印文件时的自助电子结账。", "매점 및 무인 복사기 이용 시 간편한 결제를 위해 체크카드가 편리합니다.", "Required for swift payments at convenience stores, cafes, and self-service printing kiosks.") },
            { key: "usb", name: t("2. 打印文件存入 U 盘或网盘", "2. 출력용 파일 USB 저장 또는 메일 전송", "2. Save PDF Files to USB or Web Drive"), desc: t("自助复印机支持插入 U 盘直接打印，或者临时登录网页微信下载。", "무인 복사 컴퓨터에 문서를 미리 연동해 두면 인쇄 속도가 빨라집니다.", "Save PDF files to USB or upload to cloud. Self-service printer PCs support USB or instant web login.") }
          ],
          stepsTitle: t("文印与便利设施使用步骤", "복사실 및 교내 편의시설 이용 단계", "Campus Amenities Steps"),
          steps: [
            { title: t("第一步：前往校园便利核心“学生会馆” (Student Hall)", "1단계: 캠퍼스 생활의 중심 '학생회관' 방문", "Step 1: Visit the Student Hall"), desc: t("三陟校区绝大多数生活便利设施均集中在学生会馆（二号饭堂旁大楼）。大楼内配备了 CU 超市、校友咖啡厅以及自助取款机。", "삼척캠퍼스 복지관/학생회관 건물로 이동합니다. 대부분의 편의점, 서점, 카페가 이곳에 몰려 있습니다.", "Go to the Student Hall, which is the main logistics hub. CU mart, bookstore, cafe, and ATMs are located here.") },
            { title: t("第二步：自助文印室进行资料复印和打印", "2단계: 복사실에서 인쇄 및 복사 진행", "Step 2: Use Self-Service Kiosks at Photocopy Center"), desc: t("如果需要打印在学证明、选课表或学习资料，可前往学生会馆二楼自助复印室。将电脑连接打印机，点击打印，使用信用卡刷卡即可。", "과제 인쇄 및 증명서 출력을 위해 학생회관 2층에 있는 무인 복사실 PC에서 결제 후 인쇄를 수행합니다.", "To print assignments or timetables, head to photocopy room on the 2nd floor. Open files on PC, select print, and tap card to pay.") },
            { title: t("第三步：使用校内 ATM 办理金融储蓄与存取现", "3단계: 은행 ATM을 통한 예금 및 출금", "Step 3: Handle Cash/Deposit at KNU ATMs"), desc: t("如果临时需要韩元现金付账，可在学生会馆一楼大堂两侧的新韩银行 (Shinhan Bank) 或 韩亚银行 (Hana Bank) 自助 ATM 存取款。", "현금이 급히 필요할 때 1층 복도에 있는 하나은행/신한은행 ATM기를 통해 신속히 출금합니다.", "If cash KRW is required, use Shinhan or Hana Bank ATMs in the 1st floor lobby. KNU cooperative banking fees apply.") }
          ],
          faqTitle: t("便利设施常见问题", "편의시설 자주 묻는 질문", "Amenities FAQ"),
          faqs: [
            { id: "overseas_card", question: t("校内的 ATM 支持使用国内借记卡或国际信用卡取韩元吗？", "교내 ATM에서 해외 카드(VISA 등) 출금이 가능한가 / 글로벌 ATM", "Do campus ATMs support international cards or UnionPay?"), answer: t("可以的。学生会馆一楼的新韩银行和韩亚银行 ATM 机配有支持“Global ATM”字样的机器。插入银联卡（UnionPay）或 VISA、Master 信用卡即可直接按照实时汇率提取韩元现金，会有少许手续费。", "네, 학생회관 1층에 설치된 ATM 중 'Global ATM' 기능이 탑재된 기기에서는 해외 VISA, Master 카드 및 유니온페이(은련) 카드로 한국 원화를 출금할 수 있습니다.", "Yes, Shinhan and Hana Bank ATMs labeled 'Global ATM' support UnionPay, VISA, and MasterCard. Select English to withdraw KRW at real-time rates.") },
            { id: "print_fee", question: t("自助打印文印一页大概需要花费多少钱？", "복사 및 인쇄 비용은 얼마인가요?", "How much does it cost to copy or print?"), answer: t("在学校自助文印室内，普通的黑白 A4 打印与复印一般收费 50 韩元/张；彩色 A4 打印收费 200 韩元/张。支持各类韩国信用卡、Check Card 以及 Kakao Pay 闪付付款。", "무인 프린트 기기 기준으로 A4 흑백 복사/인쇄는 장당 50원, 컬러 인쇄는 장당 200원 내외이며 모바일 결제 및 카드 태그로 자동 수납됩니다.", "Self-service black-and-white A4 printing is 50 KRW per page, while color A4 is 200 KRW. Pay smoothly using bank check cards or KakaoPay.") }
          ],
          linkText: t("前往江原大学官方网站", "강원대학교 공식 홈페이지 이동", "Go to KNU Website"),
          linkUrl: "https://www.kangwon.ac.kr",
          contactPhone: "033-570-6218",
          contactName: t("学生会馆管理办公室", "학생회관 관리행정실", "Student Hall Office")
        };
      }

      // Scenario 11: Campus Map & Buildings
      if (lowerTitle.includes("地图") || lowerTitle.includes("导览") || lowerTitle.includes("지도") || lowerTitle.includes("map")) {
        return {
          heroDesc: t("轻松熟稔三陟校区立体建筑分布与内部通勤图，精准定位教学大楼、行政本馆、生活馆（宿舍）与校门口便利生活圈。", 
                      "삼척캠퍼스의 종합 건물 배치도 및 길찾기 안내를 통해 대학본부, 강의동, 기숙사 등 각 주요 건물을 헤매지 않고 신속하게 찾아가세요.", 
                      "Quickly master Samcheok Campus building layouts. Easily locate lecture halls, administrative buildings, dorms, and campus gates."),
          checklistTitle: t("校园地图与建筑查阅准备清单", "캠퍼스 맵 및 길찾기 준비", "Campus Map Setup Checklist"),
          checklistItems: [
            { key: "map", name: t("1. 手机安装 Naver Map App", "1. 네이버 지도 또는 카카오맵 앱 설치", "1. Install Naver Map or Kakao Map"), desc: t("韩国出行圣器，能精确搜索校内具体建筑位置和导航路径。", "국내 실시간 보행 경로 및 건물 위치 파악을 위해 네이버 지도가 절대적으로 편리합니다.", "Essential tools. Precise pedestrian route guidance and KNU building number query.") },
            { key: "pdf", name: t("2. 下载高清版三陟校区 PDF 导览图", "2. 삼척캠퍼스 건물 배치 PDF 다운로드", "2. Download KNU Samcheok Map PDF"), desc: t("在学校官网下载并保存高清校园地图，查找建筑代码更方便。", "학교 홈페이지에서 다운로드하여 소장하면 학년 초 유용하게 쓰입니다.", "Keep a copy of KNU official building list PDF. Helps look up classroom locations in first weeks.") }
          ],
          stepsTitle: t("定位校园建筑通勤步骤", "캠퍼스 건물 길찾기 단계", "Campus Navigation Steps"),
          steps: [
            { title: t("第一步：登录官网下载“三陟校区校园导览图”", "1단계: 홈페이지에서 공식 캠퍼스 맵 이미지 다운로드", "Step 1: Download Official Campus Map from Website"), desc: t("在江原大学校官网的“学校介绍” ➔ “校园导览”栏目中，选择“三陟校区 (Samcheok Campus)”，将完整的建筑代码鸟瞰图保存到手机相册中。", "강원대 포털 내 캠퍼스 안내 페이지에 접속하여 삼척캠퍼스 조감도 및 건물 번호 번역본을 다운로드합니다.", "Access KNU website 'About' section, select 'Campus Maps' and click Samcheok Campus. Save bird's-eye map to photos.") },
            { title: t("第二步：比对课程表上的“建筑编号-教室代码”", "2단계: 수강신청 학사 시스템의 건물 번호 매칭", "Step 2: Match Classroom Codes from Timetable"), desc: t("江原大学选课表上的教室一般格式为“105-302”，代表“105号楼（工科五号馆）302室”。可在导览图中找出该建筑物的具体物理位置。", "강의 시간표의 '105-302' 등 강의실 표기는 '105번 건물(공학5호관) 302호'를 뜻하므로 맵에서 위치를 매칭합니다.", "KNU class codes look like '105-302', meaning 'Building 105 (Engineering 5), Room 302'. Locate Building 105 on the map first.") },
            { title: t("第三步：步行游览一遍校园，熟悉主校门到大楼路线", "3단계: 정문/후문에서 주요 강의동 도보 경로", "Step 3: Walk Campus Paths to Plan Commute"), desc: t("建议在开学前夕，花半小时沿着宿舍（雄飞馆、原木房等）到教学大楼步行一遍，熟悉坡道、无障碍电梯，精准预估通勤步程与耗时。", "개강 전에 기숙사나 자취방에서 강의실 건물까지 직접 걸어보며 오르막길, 계단 등 실제 소요 시간을 계산합니다.", "Before semester starts, spend 30 minutes walking from your dorm/rented room to class. Plan shortcuts to avoid late attendance.") }
          ],
          faqTitle: t("校园建筑设施常见问题", "캠퍼스 건물 시설 자주 묻는 질문", "Campus Facilities FAQ"),
          faqs: [
            { id: "disabled", question: t("各教学楼内有电梯和无障碍斜坡设施吗？", "강의동 내 엘리베이터 및 무장애 휠체어 경사로가 있나요?", "Are there elevators and wheelchair ramps in buildings?"), answer: t("有的。江原大学三陟校区高度重视师生便利，校内全部现代化教学大楼（如工科馆、人文社会馆等）、图书馆和宿舍楼均全面配备了平滑的无障碍通行斜坡与全功能升降电梯。", "네, 강원대 삼척캠퍼스의 주요 단과대학 강의동, 도서관, 기숙사는 장애인 휠체어 램프 시설 및 엘리베이터가 완전히 완비되어 있습니다.", "Yes, KNU Samcheok ensures full convenience. All major lecture halls, library, and dorms are fully equipped with wheelchair ramps and elevators.") },
            { id: "scooter", question: t("可以在校园里骑行共享单车或电动滑板车吗？", "캠퍼스 내에서 공유 전동 킥보드나 자전거 이용이 가능한가요?", "Can I ride shared bikes or electric scooters on campus?"), answer: t("可以的。三陟市内的“Gcooter (지쿠터)”等共享电动车在学校正门、后门和生活区均设有专门停放桩。使用手机 App 扫码即可骑行通勤，但必须佩戴头盔并禁止在教学大楼内部使用。", "네, 교내 정문과 기숙사 주변에 전동 킥보드(지쿠터) 및 자전거 주차구역이 지정되어 있어 모바일 앱으로 렌탈하여 오르막길 이동 시 요긴하게 탈 수 있습니다.", "Yes. Shared electric scooters (Gcooter) are available at gates and dorm parking zones. You can rent them using apps for hill climbs; wear helmets.") }
          ],
          linkText: t("前往江原大学官方校园导览网页", "강원대학교 공식 캠퍼스 안내 지도", "Go to KNU Campus Map Web Page"),
          linkUrl: "https://www.kangwon.ac.kr/www/contents.do?key=416",
          contactPhone: "033-570-6215",
          contactName: t("三陟校区设施管理处", "삼척시설관리팀", "Samcheok Facilities Support Team")
        };
      }

      // Scenario 12: Major Shopping Places
      if (lowerTitle.includes("购物") || lowerTitle.includes("超市") || lowerTitle.includes("大创") || lowerTitle.includes("daiso") || lowerTitle.includes("마트") || lowerTitle.includes("쇼핑")) {
        return {
          heroDesc: t("轻松采购生活百货与生鲜食材，玩转三陟市区大型综合超市（Homeplus）、留学生省钱圣地 Daiso（大创）以及中央传统市场。", 
                      "삼척 시내에 위치한 대형 할인마트(홈플러스), 다이소, 전통시장을 파악하여 유학생 정착에 필요한 가구, 생활용품, 식자재를 합리적으로 쇼핑하세요.", 
                      "Shop smart in Samcheok. Discover Homeplus hypermarket, Daiso budget store, and local traditional markets for daily groceries and relocation essentials."),
          checklistTitle: t("市区大宗采购准备清单", "시내 쇼핑 및 마트 방문 준비", "Shopping Preparation Checklist"),
          checklistItems: [
            { key: "bag", name: t("1. 自备大号环保购物袋", "1. 개인 장바구니/에코백 준비", "1. Bring Large Eco Shopping Bags"), desc: t("韩国超市不免费提供塑料袋，纸质袋或纸箱需要支付几百韩元购买。", "대형마트에서는 일회용 비닐봉투가 유료이므로 개인 장바구니나 에코백 소지를 권장합니다.", "Korean supermarkets charge extra for single-use plastic/paper bags. Bring your own.") },
            { key: "arc", name: t("2. 外国人登录证原件", "2. 외국인등록증 실물 (택스리펀용)", "2. Alien Registration Card (ARC)"), desc: t("在 Homeplus 结账，单笔满 3 万韩元可现场出示 ARC 申请“退税/免税”(Tax Refund)。", "단일 결제금액이 3만 원을 초과할 때 즉석 면세 혜택을 받기 위해 신분증이 필요합니다.", "Required if you spend over 30,000 KRW. Present ARC to cashier for on-site Tax Refund/Tax Free savings.") },
            { key: "coin", name: t("3. 准备 100 韩元硬币", "3. 100원 동전 지참 (카트 대여용)", "3. Prepare a 100 KRW Coin"), desc: t("用于解锁超市手推购物车，使用完毕归还推车时会退还硬币。", "마트 카트 대여용으로 100원 동전 1개가 유용하게 쓰이며 카트 반납 시 돌려받습니다.", "Required to unlock shopping carts. The coin is returned automatically when you place the cart back.") }
          ],
          stepsTitle: t("市区大型超市购物结算步骤", "마트 쇼핑 및 택스리펀 신청 단계", "Supermarket Shopping Steps"),
          steps: [
            { title: t("第一步：学校门口搭乘 7xx 市内公交车前往市中心", "1단계: 정문 시내버스(7xx) 탑승 후 홈플러스 삼척점 이동", "Step 1: Take Local Bus (7xx) to Downtown"), desc: t("在学校正门或后门公交站，搭乘 7xx 路市内巴士，仅需 8-12 分钟即可直达三陟市中心的 Homeplus 大型超市和大创三陟店。", "학교 정문 버스정류장에서 시내버스를 타면 10분 내에 시내 중심 홈플러스(삼척점)와 대형 다이소 매장 앞에 하차합니다.", "Take a 7xx town bus from Main/Back Gate. Arrive in downtown Homeplus or Daiso building in about 10 minutes.") },
            { title: t("第二步：大创采购便宜日用品，Homeplus 采买生鲜", "2단계: 다이소 가성비 물품 및 마트 식자재 골고루 장보기", "Step 2: Daiso for Cheap Relocation Ware, Homeplus for Groceries"), desc: t("建议先去大创 (Daiso) 买便宜的收纳盒、锅碗瓢盆和晾衣架；随后进入 Homeplus 超市采买冷冻食品、新鲜蔬菜、水果及乳制品。", "가구를 비롯한 이불, 주방용품은 다이소에서 사고 식재료 및 신선 식품은 홈플러스에서 대량으로 묶음 구매하는 것이 유리합니다.", "Shop at Daiso first for budget pots, storage boxes, and hangers. Then hit Homeplus for fresh eggs, vegetables, meat, and milk.") },
            { title: t("第三步：结账时向收银员提出“现场免税” (Tax Refund)", "3단계: 계산대에서 즉시 택스리펀(Tax Free) 신청", "Step 3: Present ARC for Instant Tax Refund"), desc: t("在 Homeplus 收银台结账，如果商品金额满 3 万韩元，直接将护照或外国人登录证递给收银员并说“Tax Refund”，可当场享受附加税减免优惠。", "카운터나 셀프 계산대에서 결제 전 직원에게 외국인등록증을 보여주며 면세를 요청하여 현장 할인을 받습니다.", "When paying at the cash counter, show your ARC and ask the clerk for 'Tax Refund' to deduct the 10% VAT instantly.") }
          ],
          faqTitle: t("市区购物商圈常见问题", "삼척 쇼핑 자주 묻는 질문", "Shopping & Supermarket FAQ"),
          faqs: [
            { id: "closed", question: t("三陟的 Homeplus 超市有每月的公休日吗？", "홈플러스 대형마트는 매월 쉬는 날이 있나요?", "Are there scheduled closed days for Homeplus?"), answer: t("是的。根据韩国大型商业法，三陟 Homeplus 大型超市在每月的 第二个和第四个星期三 实行强制公休闭店，营业时间为 10:00 - 22:00。请避开公休日出行。", "네, 유통산업발전법에 의거하여 삼척 홈플러스 매장은 매월 둘째, 넷째 주 수요일에 의무 휴업하므로 방문 전 스케줄 확인이 필요합니다.", "Yes. Under Korean retail laws, Samcheok Homeplus is closed on the 2nd and 4th Wednesday of every month. Open daily 10:00 - 22:00.") },
            { id: "market", question: t("三陟当地的传统农贸市场有什么好玩好买的？", "삼척 중앙 전통시장에는 무엇이 유명한가요?", "What is famous in Samcheok Central Traditional Market?"), answer: t("学校周边的“三陟中央传统市场”是买新鲜应季水果（草莓、苹果等）、本地特产海鲜刺身的绝佳去处。价格通常比大超市便宜 20%-30%，并且许多小吃摊（如炸鸡、荞麦煎饼）深受留学生欢迎，支持使用现金和温流通券付款。", "삼척 중앙시장은 산지 직송 신선 과일이나 싱싱한 수산물이 대형마트보다 20% 이상 저렴하며, 메밀전, 닭강정 등 전통 야식거리가 풍부합니다.", "Samcheok Central Traditional Market offers fresh seasonal fruits and local seafood at 20-30% cheaper rates than hypermarkets. Great street snacks.") }
          ],
          linkText: t("前往 Homeplus 官方网站", "홈플러스 공식 홈페이지 이동", "Go to Homeplus Website"),
          linkUrl: "https://company.homeplus.co.kr",
          contactPhone: "033-570-8000",
          contactName: t("三陟 Homeplus 客服热线", "홈플러스 삼척점 고객센터", "Samcheok Homeplus Customer Center")
        };
      }

      // Scenario 13: Samcheok Tourist Attractions
      if (lowerTitle.includes("景点") || lowerTitle.includes("旅游") || lowerTitle.includes("관광") || lowerTitle.includes("attractions") || lowerTitle.includes("海滩") || lowerTitle.includes("庄湖港")) {
        return {
          heroDesc: t("尽情游历美丽的滨海之城三陟，打卡全韩著名的海洋铁路自行车、庄湖港（韩国的那不勒斯）、孟芳海滩与神秘的幻仙窟。", 
                      "삼척의 대표 관광명소인 해양레일바이크, 한국의 나폴리라 불리는 장호항, BTS 앨범 촬영지 맹방해변, 환선굴 등의 교통편과 예약 요령을 전해 드립니다.", 
                      "Explore the breathtaking coast of Samcheok. Plan trips to the Ocean Railbike, Jangho Harbor, Maengbang Beach, and Hwanseongul Cave."),
          checklistTitle: t("景区出行预约准备清单", "삼척 관광명소 방문 준비", "Attractions Setup Checklist"),
          checklistItems: [
            { key: "ticket", name: t("1. 提前预订海洋铁路自行车门票", "1. 해양레일바이크 티켓 사전 인터넷 예매", "1. Book Ocean Railbike Ticket Online"), desc: t("全韩超级大热门项目，周末门票极易售罄，通常需要提前 1-2 周在线抢购。", "인기 관광 코스로 주말에는 전석 매진되므로 방문 10일 전 공식 사이트 예약을 권장합니다.", "Extremely popular project; tickets sell out quickly for weekends. Book 1-2 weeks in advance online.") },
            { key: "card", name: t("2. 携带在读证明或学生证", "2. 재학증명서 또는 학생증 지참 (할인용)", "2. Bring Student ID or Enrollment Paper"), desc: t("部分国家级景区和森林公园（如幻仙窟、大金窟）对本地大学生或江原道居民提供半价折扣优惠。", "일부 시립 관광지(환선굴 등)는 학생증 제시 시 할인 혜택이 주어집니다.", "Many city/state parks (e.g., Hwanseongul Cave) offer 30-50% discounts to local university students.") }
          ],
          stepsTitle: t("三陟景区探索游览步骤", "삼척 주요 관광지 여행 단계", "Attractions Travel Steps"),
          steps: [
            { title: t("第一步：登录“三陟市文化旅游官网”查阅最新信息", "1단계: 삼척시 문화관광 홈페이지 코스 검색", "Step 1: Check Routes on Samcheok Cultural Tourism Website"), desc: t("登录三陟市文化旅游官网，查看各景点的开放时间、气象安全提示以及门票价格（部分海滩仅在夏季 7-8 月正式开放水上项目）。", "삼척시 관광 포털에 접속하여 버스 노선, 관광지 운영 정보 및 실시간 해변 개장 여부를 확인합니다.", "Visit Samcheok tourism portal. Verify opening hours, tickets, and weather alerts (swimming beaches open only in July-August).") },
            { title: t("第二步：推荐打卡庄湖港透明皮划艇与海上缆车", "2단계: 장호항 투명카누 체험 및 해상 케이블카 탑승", "Step 2: Visit Jangho Harbor for Kayaking & Marine Cable Car"), desc: t("推荐乘坐五十川水边公园到三陟海滨的高空海上索道缆车，随后去被称为“韩国那不勒斯”的庄湖港体验透明皮划艇与清澈浮潜。", "장호항 어촌체험마을에서 투명 카누를 렌탈해 즐기고, 용화리부터 장호리까지 동해 바다를 횡단하는 케이블카를 탑승합니다.", "We highly recommend riding the Marine Cable Car between Yonghwa and Jangho, and enjoying crystal-clear snorkeling or glass-kayaking at Jangho Harbor.") },
            { title: t("第三步：使用 Kakao T 叫车或乘坐市内观光巴士", "3단계: 카카오 T 택시 호출 및 시내 관광버스 연계", "Step 3: Call a Taxi via Kakao T or Take Tour Buses"), desc: t("由于景区多分布在海岸沿线，推荐三五好友共同出行，在学校正门使用手机 Kakao T APP 呼叫出租车拼车，价格划算且省时。", "관광지가 외곽 해안가에 분산되어 있어 친구들과 함께 카카오 택시를 이용해 요금을 N분의 1로 분담해 이동하는 편이 빠르고 경제적입니다.", "Since scenic spots are distributed along the outer coast, call a taxi via Kakao T at the KNU Main Gate to split fares with classmates.") }
          ],
          faqTitle: t("三陟景区常见问题", "관광지 여행 자주 묻는 질문", "Samcheok Attractions FAQ"),
          faqs: [
            { id: "railbike", question: t("海洋铁路自行车 (Ocean Railbike) 需要预约吗？哪条路线风景最好？", "레일바이크는 현장 예매가 가능한가요? 추천 코스는?", "Can I buy Railbike tickets on-site? Which route is recommended?"), answer: t("基本必须提前线上预约，现场窗口仅出售极少量的退票。推荐选择“宫村站 ➔ 龙化站” (궁촌역 ➔ 용화역) 路线，沿途会穿过五彩斑斓的激光梦幻隧道，一路紧贴太平洋海岸线，风景无与伦比。", "현장 발권은 잔여석이 거의 없으므로 불가능합니다. 바다 터널 경관이 웅장한 궁촌역 출발 코스를 강력 추천합니다.", "On-site ticket box rarely has remaining slots. Online booking is mandatory. Book the 'Gungchon ➔ Yonghwa' route for magnificent coastline scenery.") },
            { id: "bts", question: t("孟芳海滩 (Maengbang Beach) 为什么那么出名？", "맹방해변이 왜 유명하며 어떻게 가나요?", "Why is Maengbang Beach famous and how do I get there?"), answer: t("孟芳海滩是世界顶级天团 BTS（防弹少年团）经典单曲《Butter》专辑封面的官方拍摄场地。沙滩上原汁原味地保留了标志性的彩色遮阳伞、橙绿沙滩躺椅以及裁判椅，是留学生拍照打卡的绝对圣地。可在学校搭乘市内公交直达。", "맹방해변은 세계적인 아티스트 BTS의 앨범 커버 촬영지입니다. 현장에는 주황색 비치 베드 등 촬영 소품이 그대로 보존되어 있어 포토존으로 대인기입니다.", "Maengbang Beach is the official photo shoot location for BTS single 'Butter' album cover. The iconic orange parasols and green sunbeds are kept open for public.") }
          ],
          linkText: t("前往三陟市官方文化旅游网", "삼척시 공식 문화관광 홈페이지 이동", "Go to Samcheok Tourism Website"),
          linkUrl: "https://www.samcheok.go.kr/tour.web",
          contactPhone: "033-570-3846",
          contactName: t("三陟市旅游咨询大厅", "삼척시 관광안내소", "Samcheok Tourism Information Desk")
        };
      }

      // Scenario 14: Samcheok Restaurants & Dining
      if (lowerTitle.includes("餐厅") || lowerTitle.includes("美食") || lowerTitle.includes("맛집") || lowerTitle.includes("식당") || lowerTitle.includes("restaurants") || lowerTitle.includes("后门")) {
        return {
          heroDesc: t("寻味地道的三陟美食与本地海鲜，打卡江原大学后门性价比极高的小吃街、炭火韩国烤肉店与本地传统海鲜市场。", 
                      "삼척의 명물인 막국수, 홍게 짬뽕, 싱싱한 활어회와 더불어 강원대 삼척캠퍼스 후문의 저렴한 대학가 맛집, 삼겹살, 치킨 집 정보를 공유합니다.", 
                      "Savor authentic Samcheok food and local seafood. Discover high-quality student dining streets at KNU Back Gate, Korean BBQ, and fresh fish markets."),
          checklistTitle: t("美食探店与结算准备清单", "삼척 식도락 및 맛집 방문 준비", "Dining & Payment Setup Checklist"),
          checklistItems: [
            { key: "map", name: t("1. 用 Naver Map 检索高分店铺", "1. 네이버 지도 '삼척 맛집' 검색 및 저장", "1. Search High-Rating Shops on Naver Map"), desc: t("自备手机导航，参考本地韩国网民真实的食客评分（推荐 4.3 分以上的店铺）。", "현지인들의 실제 리뷰와 별점을 체크하여 평점이 높은 한식/일식/중식당을 정리합니다.", "Use Naver Map to check real restaurant reviews. Choose places rated 4.3 stars or above.") },
            { key: "card", name: t("2. 准备韩国银行卡或 Toss 转账 App", "2. 체크카드 또는 은행 송금 수단 확보", "2. Bring Bank Card or Toss App"), desc: t("韩国绝大多数餐饮店只支持刷卡或网上银行转账，结账时常用手机网银直接 AA 支付。", "현금 결제보다 체크카드 결제가 보편화되어 있으며 더치페이용 토스 앱 연동을 추천합니다.", "Check cards are universally accepted. Bring your banking card or active Toss app to split bills with peers.") }
          ],
          stepsTitle: t("电大美食探店步骤", "삼척 맛집 탐색 및 이용 단계", "Foodie Dining Steps"),
          steps: [
            { title: t("第一步：首选定位江原大学后门学生美食街", "1단계: 가성비 으뜸인 강원대 삼척 후문 먹자골목 탐방", "Step 1: Locate Student Food Street at KNU Back Gate"), desc: t("学校后门附近聚集了数十家专门服务留学生和本地学子的平价餐厅，如猪肉汤饭、炸鸡店、便宜韩式烤肉店等，人均价格极为亲民。", "학교 후문에 몰려 있는 저렴한 국밥집, 양식당, 삼겹살 뷔페 식당들의 위치를 파악합니다.", "Walk around KNU Back Gate street where dozens of student-friendly pork soup rice, fried chicken, and buffet BBQ shops are clustered.") },
            { title: t("第二步：打卡三陟特产“东海冷面” (막국수) 与“红蟹” (홍게)", "2단계: 삼척 대표 로컬 푸드 '막국수'와 '홍게' 시식", "Step 2: Try Local Specialty 'Makguksu' and 'Red Crab'"), desc: t("前往市区特色餐厅，尝试江原道最负盛名的“荞麦冷面/幕冷面” (막국수)，或前往三陟港口水产市场挑选便宜新鲜的野生“红蟹”进行加工。", "여름철에는 삼척의 3대 막국수 집 중 한 곳을 방문하거나, 수산시장에서 살아있는 대게/홍게를 저렴하게 쪄서 먹는 체험을 해 봅니다.", "Visit local diners to taste 'Makguksu' (buckwheat cold noodles) or buy fresh 'Hong-ge' (red snow crab) directly at the port fish market.") },
            { title: t("第三步：聚餐结算使用 Toss 或网银极速 AA 转账", "3단계: 모바일 앱을 이용한 깔끔한 더치페이 정산", "Step 3: Pay by Card & Split Bill Using Toss"), desc: t("在韩国餐厅就餐完毕后，可在柜台由一人刷卡结算全款，随后大家使用 Toss 或者是新韩网银的“AA/더치페이”功能一键转账清算。", "식사 후 결제는 한 명이 카드로 긁은 후, 스마트폰 뱅킹 앱을 사용해 실시간으로 깔끔하게 더치페이 정산을 진행합니다.", "Pay using one card at the counter. Open Toss or Shinhan Sol banking app, select 'Split Bill' (더치페이), and transfer shares instantly.") }
          ],
          faqTitle: t("三陟美食与餐饮常见问题", "삼척 맛집 자주 묻는 질문", "Dining & Restaurants FAQ"),
          faqs: [
            { id: "backgate", question: t("学校后门有什么高性价比的学生聚会烤肉店推荐吗？", "대학가 가성비 높은 삼겹살 추천 식당이 있나요?", "Are there cheap student-friendly BBQ buffets near campus?"), answer: t("后门有多家主打“无限续添” (무한리필 / Unlimited Refill) 的炭火五花肉自助餐厅，人均仅需 13,000 - 15,000 韩元即可无限大快朵颐五花肉、大酱汤和沙拉，是留学生周末聚餐的绝对首选。", "캠퍼스 후문에는 1인당 14,000원대 가격으로 두툼한 통삼겹살을 무제한으로 구워 먹을 수 있는 무한리필 삼겹살 맛집들이 여럿 성업 중입니다.", "Yes, there are several unlimited pork belly buffets (무한리필) near KNU Back Gate. Unlimited BBQ, stew, and salads cost only 13,000-15,000 KRW per person.") },
            { id: "seafood", question: t("三陟市区买海鲜去哪里最便宜？", "싱싱한 회나 해산물은 어디서 사는 것이 가장 저렴한가요?", "Where is the cheapest place to buy fresh raw fish or seafood?"), answer: t("首推“三陟临港活鱼回中心” (삼척항 활어회센터)。这里的海鲜全部是当天捕捞出海的，价格比普通高档日料店便宜 50% 以上。买好后可以直接带去楼上的餐厅缴纳加工费（人均约 5,000 韩元）享用野生刺身拼盘与热腾腾的辣鱼汤。", "삼척항 인근의 활어회센터를 방문하면 갓 잡은 싱싱한 횟감을 정가로 싸게 구매할 수 있으며 인근 초장집에서 양념값을 내고 바로 취식 가능합니다.", "Visit Samcheok Port Live Fish Center. Seafood caught daily is sold 50% cheaper than fancy restaurants. Have it prepared on the 2nd floor for 5,000 KRW.") }
          ],
          linkText: t("查看三陟市官方美食专栏推介", "삼척시 공식 로컬 맛집 컬럼 안내", "View Samcheok Food Guide Column"),
          linkUrl: "https://www.samcheok.go.kr/tour.web",
          contactPhone: "033-570-4061",
          contactName: t("三陟餐饮联合协会", "삼척시 보건소 위생관리팀", "Samcheok Hygiene & Dining Administration Office")
        };
      }

      // Scenario 15: Samcheok Festivals & Culture
      if (lowerTitle.includes("节庆") || lowerTitle.includes("节日") || lowerTitle.includes("庆典") || lowerTitle.includes("축제") || lowerTitle.includes("festivals") || lowerTitle.includes("油菜花") || lowerTitle.includes("玫瑰")) {
        return {
          heroDesc: t("深度融入韩国本土的民俗文化，参加三陟著名的年度大盛会，包括孟芳油菜花节、五十川玫瑰花海节与元宵大祭。", 
                      "삼척의 연중 축제인 맹방 유채꽃 축제, 오십천 삼척 장미 축제, 정월대보름제 등의 일정과 유학생 축제 참여 팁을 알려드립니다.", 
                      "Deeply immerse in local Korean traditions. Participate in Samcheok's major annual festivals: Canola Flower Festival and Rose Festival."),
          checklistTitle: t("参加庆典活动出行准备清单", "삼척 축제 참여 및 방문 준비", "Festivals Participation Checklist"),
          checklistItems: [
            { key: "schedule", name: t("1. 确认最新的庆典时间表", "1. 최신 축제 프로그램 및 일정표 모바일 저장", "1. Keep Festival Schedules in Mobile"), desc: t("密切关注三陟市官网每年发布的官方宣传日程，避开恶劣天气并挑好明星歌手演出的黄金时间点出行。", "매년 계절 및 기상 상황에 따라 축제 날짜가 일부 변동되므로 사전 조회가 좋습니다.", "Verify official schedules released on Samcheok city portal. Pick days with great concerts or fireworks.") },
            { key: "camera", name: t("2. 手机或相机充足电量", "2. 스마트폰 카메라 충전 및 보조배터리 지참", "2. Fully Charge Phone & Bring Powerbank"), desc: t("各大庆典布置了极其华丽的油菜花海、樱花隧道与数百万朵盛开红玫瑰，是绝对的拍照打卡胜地。", "야간 불꽃놀이 및 꽃밭 포토존이 아름답기 때문에 보조배터리를 꼭 챙겨가세요.", "Dazzling canola fields, cherry blossom tunnels, and rose parks are perfect photo spots. Bring a portable charger.") }
          ],
          stepsTitle: t("参加三陟本地重大庆典步骤", "삼척 축제 참여 및 대중교통 이용 단계", "Festivals Participation Steps"),
          steps: [
            { title: t("第一步：登录市官网“庆典日程表”专栏查看安排", "1단계: 시청 홈페이지 축제 일정 및 라인업 확인", "Step 1: Check Lineups on City Festival Webpage"), desc: t("每年春季（4月）或初夏（5-6月）开幕前，登录三陟市政府官网或应用社区看板查看具体的庆典主会场布置和歌手演出的出场顺序安排。", "삼척시청 관광과가 게시하는 공식 라인업 포스터 및 개막식 불꽃쇼 시간을 점검합니다.", "Visit Samcheok city portal before April (Canola) or May-June (Rose) starts. Check event coordinates, lineup lists, and fireworks shows.") },
            { title: t("第二步：春季前往孟芳赏樱赏油菜花，初夏前往玫瑰公园", "2단계: 봄철 맹방 유채꽃 및 초여름 오십천 장미공원 방문", "Step 2: Visit Canola Fields in April, Rose Park in May-June"), desc: t("春季推荐和同学乘公交前往孟芳，那里有海风轻拂的万里金黄油菜花田与樱花隧道；初夏前往五十川水边公园，观赏数百万株红玫瑰盛开的浪漫美景。", "봄에는 벚꽃과 유채꽃이 동시에 만개하는 상맹방리로 가고, 5월에는 수백만 송이 붉은 장미가 가득한 오십천 장미공원으로 떠납니다.", "Enjoy ocean-breeze canola fields and cherry blossom arches in Maengbang during spring; stroll through million rose gardens at Oshipcheon in early summer.") },
            { title: t("第三步：乘坐学校免费庆典摆渡班车或 7xx 公交前往", "3단계: 축제 셔틀버스 또는 시내버스 연동 방문", "Step 3: Ride Free School Shuttle or Town Buses"), desc: t("庆典期间，学校国际处或正门常常会开行免费的留学生专用观光摆渡大巴；您也可以刷交通卡搭乘市内普通 7xx 公交车直达庆典大门口。", "축제 대개막 시기에는 교내에서 출발하는 임시 셔틀버스가 간헐적으로 운행되며, 상시 노선인 시내버스로도 바로 갈 수 있습니다.", "During major opening weeks, KNU OIA often organizes free international student shuttle buses. Standard 7xx town buses also run directly.") }
          ],
          faqTitle: t("三陟重大节庆常见问题", "삼척 축제 자주 묻는 질문", "Samcheok Festivals FAQ"),
          faqs: [
            { id: "festival_fee", question: t("进入油菜花田和玫瑰公园游玩需要门票费用吗？", "축제 입장료나 행사 구경 요금이 따로 드나요?", "Are there entry fees for Canola or Rose festivals?"), answer: t("完全不需要。孟芳油菜花节、五十川玫瑰公园都是三陟市对市民 and 在校留学生完全免费开放的标志性公园与市政工程。现场的大型明星演唱会、夜间水幕投影及烟花大秀均完全免费免票入场观赏。", "아닙니다! 유채꽃 축제, 장미공원 축제 및 수변 무대에서 열리는 연예인 공연은 모두 무료입장이 가능한 지자체 주관 행사입니다.", "Absolutely NOT. Canola fields and Rose park are public parks open free to all citizens and students. Open-air star concerts and fireworks are totally free.") },
            { id: "shuttle", question: t("如果错过了校内大巴，自己怎么去油菜花田？", "맹방 유채꽃 축제장까지 버스로 가려면?", "How do I get to Canola field if I miss the school bus?"), answer: t("非常简单。在学校正门一侧的公交站搭乘市内 730路 或 712路 巴士，在“上孟芳” (상맹방) 站下车，步行 3 分钟即可直接看到漫天金黄色的油菜花海洋。", "삼척 시내버스 730번이나 712번을 이용해 '상맹방' 정류장에 내리면 눈 앞에 대규모 유채꽃밭이 펼쳐집니다.", "Take local town bus 730 or 712 from KNU Main Gate. Get off at 'Sang-Maengbang' (상맹방) stop, and walk 3 mins into the gold flower sea.") }
          ],
          linkText: t("前往三陟市重大庆典日程介绍页", "삼척시 공식 축제 및 축제일정 안내", "Go to Samcheok Festivals Info Page"),
          linkUrl: "https://www.samcheok.go.kr/tour.web",
          contactPhone: "033-570-3224",
          contactName: t("三陟市庆典运营团队", "삼척시 관광정책과 축제담당", "Samcheok City Tourism Department Festival Team")
        };
      }

      // Scenario 16: Public & Government Facilities
      if (lowerTitle.includes("公共") || lowerTitle.includes("주민") || lowerTitle.includes("住民") || lowerTitle.includes("办事") || lowerTitle.includes("邮局") || lowerTitle.includes("경찰") || lowerTitle.includes("public")) {
        return {
          heroDesc: t("掌握三陟市内的核心政府公共服务机构，轻松在城北洞住民中心办理外国人地址变更、外国人登录事实证明，或去邮局邮寄国际包裹。", 
                      "삼척 시청, 행정복지센터(주민센터), 우체국, 경찰서 등 유학생 행정 신고와 우편 송부를 위한 핵심 공공기관 정보를 안내합니다.", 
                      "Navigate crucial public offices in Samcheok. Manage address changes at local community center, mail packages at Post Office, and locate police hubs."),
          checklistTitle: t("办理公共民愿事务准备清单", "공공업무 및 서류 대행 준비", "Public Services Checklist"),
          checklistItems: [
            { key: "arc", name: t("1. 外国人登录证 / 护照原件", "1. 외국인등록증 / 여권 원본 필수", "1. Original ARC or Passport"), desc: t("在住民中心和邮局办理一切法定公共事务的基石身份证件，千万不能忘带。", "외국인 신원 증명과 행정 처리를 위한 가장 기본적이고 강력한 신분증입니다.", "The ultimate ID for any administrative workflows at community center or post office. Must bring.") },
            { key: "contract", name: t("2. 房屋租赁合同书原件", "2. 원룸 임대차계약서 또는 거주확인서 원본", "2. Original Housing Lease Contract"), desc: t("在校外搬家租房后，办理“确定日期”(保护保证金)与“地址变更”时的绝对关键审查材料。", "전입 신고 및 보증금 확정일자 부여 신청 시 임대차계약서가 필요합니다.", "Required when registering address change or getting lease deposit stamp (확정일자) for security.") }
          ],
          stepsTitle: t("公共服务机构业务办理步骤", "행정복지센터 및 공공업무 처리 단계", "Public Office Steps"),
          steps: [
            { title: t("第一步：定位离校园最近的“城北洞住民中心”", "1단계: 학교 인근 '성북동 행정복지센터' 방문", "Step 1: Visit nearby Seongbuk-dong Community Center"), desc: t("如果需要在校外租房搬家、办理滞留地地址变更，需前往离校园最近的 Seongbuk-dong 住民自治中心（行政福利中心）。", "원룸 이사 등으로 주소지 변경 신고를 위해 학교 근처 성북동 주민센터를 찾아갑니다.", "Go to Seongbuk-dong Administrative Welfare Center (주민센터) located near campus for address changes.") },
            { title: t("第二步：带齐资料在 14 天内递交地址变更申请", "2단계: 계약서 소지 후 14일 이내 전입신고 및 주소 변경", "Step 2: Submit Address Change Request within 14 Days"), desc: t("搬入校外新居后，必须在 14 天内，带上外国人登录证和新房屋合同原件递交变更。窗口职员会当场打印最新地址条贴在登录证背面。", "임대차계약서와 외국인등록증을 제출하면 직원이 카드 뒷면에 새 주소를 출력해 줍니다. 14일 초과 시 벌금이 있습니다.", "Present your ARC and lease contract. The clerk will print the new address label on the back of your ARC. Done inside 14 days.") },
            { title: t("第三步：邮寄包裹前往“三陟邮政局”", "3단계: 국제 우편(EMS)은 '삼척우체국' 방문 접수", "Step 3: Go to Samcheok Post Office for Shipping Packages"), desc: t("如果需要寄送大箱衣服回国，可带上物品前往市中心的三陟邮局 (Samcheok Post Office)。现场购买箱子、打包并寄送高安全性 EMS 航空大包。", "중국으로 짐을 보낼 때 박스를 챙겨 삼척우체국(시내)을 찾아가면 EMS 국제택배 포장 및 접수가 가능합니다.", "For sending packages home, visit Samcheok Post Office downtown. Buy boxes, wrap items at wrapping tables, and dispatch via EMS.") }
          ],
          faqTitle: t("公共设施办事常见问题", "공공기관 업무 자주 묻는 질문", "Public Facilities FAQ"),
          faqs: [
            { id: "address_fine", question: t("搬家后不办理外国人地址变更会有什么后果？罚款多少？", "체류지 전입신고 기한을 놓치면 어떻게 되나요? 과태료는?", "What happens if I miss the 14-day address change limit?"), answer: t("根据韩国出入境管理法，变更地址后必须在 14天以内 前往住民中心或出入境事务所完成地址申报变更。若超出14天未申报，将被视为违反出入境管理法，面临最低 10万 至最高 100万 韩元的巨额行政罚款，并严重阻碍未来签证延期的申请！", "체류지 변경 후 14일 이내에 신고하지 않으면 출입국관리법 위반으로 최소 10만 원에서 최대 100만 원까지 과태료가 부과됩니다.", "Under Korean immigration law, failing to report address changes within 14 days is a violation. You will face fines from 100,000 to 1,000,000 KRW and negative records on extensions.") },
            { id: "post_fee", question: t("在三陟邮局可以购买纸箱进行打包和封装吗？", "우체국에서 박스나 테이프 제공 및 포장이 가능한가요?", "Can I buy packaging boxes at the Post Office?"), answer: t("是的。三陟邮局的大堂一侧设有专门的自助打包区，常备了特厚 1 号到 5 号的不同尺寸邮政纸箱，现场刷卡购买（每个价格从 500 到 2300 韩元不等）。封箱胶带、气泡膜防震垫和剪刀都是完全免费提供给寄件人自理使用的。", "우체국 내 포장 코너에서 다양한 규격의 상자를 유료로 판매하며, 뽁뽁이(에어캡), 테이프, 가위 등은 무료로 구비되어 있어 자유롭게 포장할 수 있습니다.", "Yes. The Post Office lounge has a wrapping zone. Heavy boxes (No. 1 to No. 5) are sold from 500 to 2300 KRW. Bubble wrap, scissors, and packing tape are free.") }
          ],
          linkText: t("前往三陟市政府官方网站", "삼척시청 공식 홈페이지 이동", "Go to Samcheok City Hall Website"),
          linkUrl: "https://www.samcheok.go.kr",
          contactPhone: "033-570-4411",
          contactName: t("城北洞住民中心办事大厅", "삼척시 성북동 행정복지센터", "Seongbuk-dong Community Center")
        };
      }

      // Default Scenario
      return {
        heroDesc: t("查阅三陟校区留学生指南，开启精彩纷呈、安全顺遂的在韩留学生活。", 
                    "삼척캠퍼스 유학생을 위한 맞춤형 가이드북을 통해 성공적인 한국 유학 생활을 시작해 보세요.", 
                    "Read the custom Samcheok guide directory to prepare for a successful and enjoyable stay in Korea."),
        checklistTitle: t("日常事务准备材料清单", "생활 준비 필요 서류", "Required Items Checklist"),
        checklistItems: [
          { key: "passport", name: t("1. 护照与外国人登录证", "1. 여권 및 외국인등록증", "1. Passport & ARC"), desc: t("一切韩国日常办事与民愿申请的基石身份证件。", "한국 생활 중 모든 행정 업무 처리를 위해 가장 필요한 신분증입니다.", "The absolute core identification files for all administrative workflows.") },
          { key: "portal", name: t("2. 大学 K-Cloud 账号", "2. 대학 K-Cloud 포털 계정", "2. KNU Portal Account"), desc: t("用于登录选课、成绩、宿舍与缴费教务功能。", "학사, 수강, 장학, 생활관 업무 처리를 위한 단일 계정입니다.", "Single unified account for course registration, dorm application, and grades.") }
        ],
        stepsTitle: t("留学生生活起航步骤", "유학생 정착 안내 단계", "Daily Relocation Steps"),
        steps: [
          { title: t("第一步：到校在国际交流处登记报到", "1단계: 교내 국제교류처 방문 및 등록", "Step 1: Visit OIA Office on Campus"), desc: t("到达三陟校区后，第一时间前往大学行政大楼的国际交流处进行报到登记，提交护照信息，领取新生手册与欢迎资料。", "입국 후 가장 먼저 대학본부 4층에 위치한 국제교류처를 찾아 유학생 신원 등록을 완료하고 안내 책자를 받습니다.", "Visit Office of International Affairs (OIA) at admin building immediately upon arrival, submit details and collect guide kits.") },
          { title: t("第二步：尽快预约并办理外国人登录证", "2단계: 하이코리아 방문 예약 및 등록증 신청", "Step 2: Apply for ARC as Early as Possible"), desc: t("入境90天内，到 HiKorea 在线预约东海出入境事务所，准时前往录入指纹提交纸质文件办理外国人登录证。", "입국 90일 이내에 하이코리아를 통해 동해출입국사무소 방문 예약을 진행하고 서류를 제출합니다.", "Book slot on HiKorea for Donghae immigration office. File paper documents and register fingerprints inside 90 days.") },
          { title: t("第三步：加入CSSA同乡会并关注官方通知", "3단계: CSSA 학우회 가입 및 공지 확인", "Step 3: Join Student Unions & Subscribe Announcements"), desc: t("加入校内CSSA学联微信群与社群板块，跟学长学姐交流生活经验；定期登录官网留意出入境政策和奖学金的最新动态通知。", "중국인 유학생회(CSSA)에 가입하여 선배들의 생활 노하우를 공유하고 기숙사, 학사 공지를 정기적으로 조회합니다.", "Join campus student organizations (CSSA) to get student peer advice. Check KNU and OIA web announcements for rules updates.") }
        ],
        faqTitle: t("留学生综合指导常见问题", "유학생 종합 안내 자주 묻는 질문", "General Campus FAQ"),
        faqs: [
          { id: "oia", question: t("遇到任何困难我应该向谁求助？", "유학 생활 중 어려운 점이 생기면 어디에 도움을 요청하나요?", "Who can I consult when encountering difficulties?"), answer: t("您可以直接到大学本馆行政楼4楼的 国际交流处 寻求官方老师的协助，或者关注我们的 App 社区论坛，在线发帖询问同学和学长学姐，大家都会热情为您答疑！", "대학본부 4층 국제교류과를 방문하여 전담 지도 선생님께 자문을 구하거나, 앱 내 커뮤니티 게시판을 통해 질문을 남겨보세요.", "Visit the Office of International Affairs (OIA) on the 4th floor of the Main Administration Building to consult coordinators, or post a question inside our Community tab to ask student peers.") },
          { id: "parttime", question: t("留学生可以在三陟打工兼职吗？", "유학생도 삼척에서 아르바이트를 할 수 있나요?", "Can international students take part-time jobs?"), answer: t("可以，但必须满足在校出勤率及 TOPIK 韩语成绩要求，并在打工开始前向国际交流处提交申请，获得出入境事务所签发的“时间制就业许可” (시간제취업허가)。未经申报许可私自打工属于严重非法就业，会面临遣返回国或高额罚款的严厉惩罚！", "출석률 및 한국어(TOPIK) 성적 기준을 충족해야 하며, 반드시 사전 신청을 거쳐 출입국사무소의 '시간제 취업 허가'를 받아야 합니다. 무단 취업 시 법적 제한이 따릅니다.", "Yes, but you must satisfy grade and TOPIK score requirements, apply at OIA, and receive a formal 'Part-time Work Permit' before starting. Working without permit is strictly illegal.") }
        ],
        linkText: t("前往江原大学官方网站", "강원대학교 공식 홈페이지 이동", "Go to KNU Website"),
        linkUrl: "https://www.kangwon.ac.kr",
        contactPhone: "033-570-6891",
        contactName: t("三陟校区国际交流处 (OIA)", "삼척 국제교류과 (OIA)", "Samcheok Office of International Affairs (OIA)")
      };
    };

    if (activeKnuItemId) {
      // Render native guide sub-detail page view!
      const currentItem = KNU_GUIDE_ITEMS.find(item => item.id === activeKnuItemId);
      if (!currentItem) {
        setActiveKnuItemId(null);
        return null;
      }
      
      const content = getKnuItemContent(currentItem.titleZh, currentItem.id);
      const activeTitle = t(currentItem.titleZh, currentItem.titleKo, currentItem.titleEn);
      
      // Category colors
      let catLabel = t("日常", "안내", "Guides");
      let catStyle = "bg-teal-50 text-teal-800 border-teal-100";
      if (currentItem.category === "academics") {
        catLabel = t("系统", "학사", "Academics");
        catStyle = "bg-blue-50 text-blue-800 border-blue-100";
      } else if (currentItem.category === "infra") {
        catLabel = t("生活", "인프라", "Infra");
        catStyle = "bg-amber-50 text-amber-800 border-amber-100";
      }

      // Filter out redundant template placeholder steps & FAQs
      const realSteps = content.steps.filter(step => {
        const title = step.title;
        return !(
          title.includes("仔细阅读本指南") || 
          title.includes("准备相关支撑材料") || 
          title.includes("前往指定办公室") ||
          title.includes("단계:") ||
          title.includes("Step:")
        );
      });

      const realFaqs = content.faqs.filter(faq => {
        const q = faq.question;
        return !(
          q.includes("相关规定/注意事项是什么") || 
          q.includes("如何理解") ||
          q.includes("질문:") ||
          q.includes("Q:")
        );
      });

      // Helper to parse name into icon and text, and identify block style
      const parseNotionBlock = (nameStr: string) => {
        let text = nameStr.trim();
        let icon = "•";
        let isCallout = false;
        let calloutType: 'info' | 'warning' | 'default' = 'default';
        
        // Match emoji at the beginning of the string
        const emojiMatch = text.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\u260e|[\u2700-\u27BF]|[\u2000-\u3300])/);
        if (emojiMatch) {
          icon = emojiMatch[1];
          text = text.substring(icon.length).trim();
          
          if (icon.trim() === "🚨" || icon.trim() === "※" || icon.trim() === "🚫") {
            isCallout = true;
            calloutType = 'warning';
          } else if (icon.trim() === "📌" || icon.trim() === "💡" || icon.trim() === "📢" || icon.trim() === "★" || icon.trim() === "✦") {
            isCallout = true;
            calloutType = 'info';
          }
        } else {
          // Dynamic fallback emojis based on keywords
          const lowerText = text.toLowerCase();
          if (lowerText.includes("位置") || lowerText.includes("地址") || lowerText.includes("室") || lowerText.includes("관할")) {
            icon = "📍";
          } else if (lowerText.includes("时间") || lowerText.includes("时段") || lowerText.includes("일정") || lowerText.includes("기간") || lowerText.includes("诊疗")) {
            icon = "🕒";
          } else if (lowerText.includes("电话") || lowerText.includes("号码") || lowerText.includes("문의") || lowerText.includes("연락")) {
            icon = "☎";
          } else if (lowerText.includes("材料") || lowerText.includes("文件") || lowerText.includes("证") || lowerText.includes("서류") || lowerText.includes("증명")) {
            icon = "📄";
          } else if (lowerText.includes("学费") || lowerText.includes("费用") || lowerText.includes("奖学金") || lowerText.includes("비용")) {
            icon = "💵";
          } else if (lowerText.includes("运行") || lowerText.includes("班车") || lowerText.includes("公交") || lowerText.includes("버스")) {
            icon = "🚌";
          } else if (lowerText.includes("注意事项") || lowerText.includes("警告") || lowerText.includes("주의") || lowerText.startsWith("※")) {
            icon = "🚨";
            isCallout = true;
            calloutType = 'warning';
          }
        }
        
        // Format labels (split by first colon ： or :)
        let label = "";
        let val = text;
        const colonIdx = text.indexOf("：") !== -1 ? text.indexOf("：") : text.indexOf(":");
        if (colonIdx > 0 && colonIdx < 30) {
          label = text.substring(0, colonIdx).trim();
          val = text.substring(colonIdx + 1).trim();
        }
        
        return { icon, text, label, val, isCallout, calloutType };
      };

      return (
        <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
          {/* Top App Bar */}
          <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveKnuItemId(null)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors" 
                aria-label={t("返回", "뒤로가기", "Back")}
              >
                <ArrowLeft className="w-5 h-5 text-[#00685f]" />
              </button>
              <h1 className="font-bold text-base text-[#00685f] truncate max-w-[200px]">{activeTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-[#00685f]" />
              </button>
            </div>
          </header>

          {/* Content Main Body */}
          <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
            {/* Guide Welcome / Hero card */}
            <section className="mb-6 relative rounded-2xl overflow-hidden bg-[#00685f] min-h-[140px] flex flex-col justify-end p-5 text-white shadow-sm border border-[#005049]">
              <div className="absolute inset-0 opacity-15">
                <img 
                  alt="Guide Hero" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOzZ6hcD7uy1xFbWoW74WZWv_vaMEQLvvZTcdad6kpG1i3pzvBrIkI1UyP1rrR6FdoROUSQZlQoyERYpH5UIAk6Vr2x5vo0fo8APuxqRbflGCNIfuJxJQiNqCIxOEbzK9qvX5i6zLhIDndptK3CuNy6o8DRncCd9a9X96Y1Ztxg-sXX_T6zBKMt0qINxh7TlMaxvmdRFigVYiHBgoJxJIFeL8KjcGJ1jEga9iPWiszSaht8d6YAfbSIwQXXUpW9_wpB4xH0ZlAiDL"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mb-2 inline-block ${catStyle}`}>
                  {catLabel}
                </span>
                <h2 className="text-lg font-black mb-1 leading-tight">{activeTitle}</h2>
                <p className="text-[11px] text-white/90 leading-relaxed font-medium">{content.heroDesc}</p>
              </div>
            </section>

            {/* Notion-style Page Canvas */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 mb-4">
              {activeKnuItemId === "22439f9906f581c38390dc0d87bfbeab" && (
                <div className="space-y-4 mb-6 pb-5 border-b border-slate-100">
                  <div 
                    onClick={() => setZoomImage("/map_samcheok.png")}
                    className="group rounded-xl overflow-hidden border border-slate-150 shadow-sm bg-slate-50 cursor-zoom-in transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                  >
                    <img 
                      src="/map_samcheok.png" 
                      alt="Samcheok Campus Map" 
                      className="w-full h-auto object-cover max-h-[300px]"
                    />
                    <div className="p-3 bg-white border-t border-slate-100 text-center">
                      <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                        <span>🗺️</span>
                        <span>{t("三陟校区地图", "삼척캠퍼스 안내도", "Samcheok Campus Map")}</span>
                      </p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setZoomImage("/map_dogye.png")}
                    className="group rounded-xl overflow-hidden border border-slate-150 shadow-sm bg-slate-50 cursor-zoom-in transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                  >
                    <img 
                      src="/map_dogye.png" 
                      alt="Dogye Campus Map" 
                      className="w-full h-auto object-cover max-h-[300px]"
                    />
                    <div className="p-3 bg-white border-t border-slate-100 text-center">
                      <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                        <span>🗺️</span>
                        <span>{t("道溪校区地图", "도계캠퍼스 안내도", "Dogye Campus Map")}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                {(() => {
                  // 1. Group consecutive table_row items
                  const blocks: { type: string; key: string; items: any[] }[] = [];
                  let currentTableRows: any[] = [];
                  
                  content.checklistItems.forEach((doc, idx) => {
                    const blockType = doc.key.includes('_') 
                      ? doc.key.substring(0, doc.key.lastIndexOf('_'))
                      : 'text';
                      
                    if (blockType === 'table_row') {
                      currentTableRows.push(doc);
                    } else {
                      if (currentTableRows.length > 0) {
                        blocks.push({
                          type: 'table',
                          key: `table_${idx - currentTableRows.length}`,
                          items: currentTableRows
                        });
                        currentTableRows = [];
                      }
                      blocks.push({
                        type: blockType,
                        key: doc.key,
                        items: [doc]
                      });
                    }
                  });
                  
                  if (currentTableRows.length > 0) {
                    blocks.push({
                      type: 'table',
                      key: `table_end`,
                      items: currentTableRows
                    });
                  }
                  
                  // 2. Render each block type with beautiful typography
                  return blocks.map((block) => {
                    if (block.type === 'table') {
                      if (block.items.length === 0) return null;
                      
                      // The first row of table items acts as headers
                      const headerRaw = block.items[0].name;
                      const headers = headerRaw.split(' | ').map((h: string) => h.trim());
                      
                      const dateIdx = headers.findIndex(h => h.includes('日期'));
                      const monthIdx = headers.findIndex(h => h.includes('月份'));
                      const contentIdx = headers.findIndex(h => h.includes('内容'));
                      
                      const isCalendarTable = dateIdx !== -1 && monthIdx !== -1 && contentIdx !== -1;
                      
                      const finalHeaders = isCalendarTable 
                        ? [t('月份', '월', 'Month'), t('日期', '날짜', 'Date'), t('内容', '내용', 'Content')]
                        : headers;
                      
                      let lastSeenMonth = "";
                      
                      // Helper to translate months on the fly
                      const formatCell = (cellValue: string, isMonthCol: boolean) => {
                        if (!cellValue) return "";
                        if (isMonthCol) {
                          const monthNumMatch = cellValue.match(/^(\d+)月$/);
                          if (monthNumMatch) {
                            const num = parseInt(monthNumMatch[1], 10);
                            if (num >= 1 && num <= 12) {
                              if (language === 'ko') return `${num}월`;
                              if (language === 'en') {
                                const engMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                return engMonths[num - 1];
                              }
                            }
                          }
                        }
                        return cellValue;
                      };
                      
                      const rows = block.items.slice(1).map(item => {
                        const rawCells = item.name.split(' | ').map((c: string) => c.trim());
                        const alignedCells = new Array(headers.length).fill("");
                        
                        if (rawCells.length === headers.length) {
                          rawCells.forEach((c, idx) => {
                            alignedCells[idx] = c;
                          });
                        } else if (!isCalendarTable) {
                          // For normal tables, just fill in whatever columns exist in order
                          rawCells.forEach((c, idx) => {
                            if (idx < alignedCells.length) {
                              alignedCells[idx] = c;
                            }
                          });
                        } else {
                          // Self-healing cell alignment heuristics
                          rawCells.forEach((cell) => {
                            if (/^\d+月$/.test(cell) || cell.endsWith('月')) {
                              if (monthIdx !== -1) alignedCells[monthIdx] = cell;
                            } else if (cell.length < 15 && (/^\d+/.test(cell) || cell.includes('-') || cell.includes('.'))) {
                              if (dateIdx !== -1) alignedCells[dateIdx] = cell;
                            } else {
                              if (contentIdx !== -1) alignedCells[contentIdx] = cell;
                            }
                          });
                        }
                        
                        // Inherit last seen month if this row's month cell is empty
                        if (monthIdx !== -1) {
                          if (alignedCells[monthIdx]) {
                            lastSeenMonth = alignedCells[monthIdx];
                          } else if (lastSeenMonth) {
                            alignedCells[monthIdx] = lastSeenMonth;
                          }
                        }
                        
                        // Map alignedCells to the finalHeaders order if isCalendarTable
                        const finalCells = isCalendarTable
                          ? [
                              formatCell(alignedCells[monthIdx], true), 
                              alignedCells[dateIdx], 
                              alignedCells[contentIdx]
                            ]
                          : alignedCells;
                        
                        return {
                          key: item.key,
                          cells: finalCells
                        };
                      });
                      
                      return (
                        <div key={block.key} className="overflow-x-auto rounded-xl border border-slate-150/70 shadow-sm my-4 bg-white">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-[#00685f]/5 border-b border-slate-200 text-[#00685f]">
                                {finalHeaders.map((h, i) => (
                                  <th key={i} className="px-3 py-2.5 font-extrabold whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, rIdx) => (
                                <tr key={row.key || rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                  {row.cells.map((cell, cIdx) => {
                                    let cellStyle = "px-3 py-2.5 font-semibold text-slate-700 whitespace-pre-wrap";
                                    if (isCalendarTable) {
                                      if (cIdx === 0) { // Month
                                        cellStyle = "px-3 py-2.5 font-extrabold text-[#00685f] whitespace-nowrap text-xs bg-teal-50/20";
                                      } else if (cIdx === 1) { // Date
                                        cellStyle = "px-3 py-2.5 font-bold text-amber-700 whitespace-nowrap bg-amber-50/10";
                                      } else { // Content
                                        cellStyle = "px-3 py-2.5 font-medium text-slate-800 whitespace-pre-wrap leading-relaxed";
                                      }
                                    }
                                    return (
                                      <td key={cIdx} className={cellStyle}>{cell}</td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    
                    const doc = block.items[0];
                    if (!doc) return null;
                    
                    const blockType = block.type;
                    const { icon, text, label, val, isCallout, calloutType } = parseNotionBlock(doc.name);
                    
                    // A. Callout blocks
                    if (isCallout || blockType === 'callout') {
                      const calloutBg = calloutType === 'warning' 
                        ? 'bg-amber-50/40 border-amber-250/50 text-amber-950' 
                        : 'bg-teal-50/40 border-teal-200/50 text-[#00685f]';
                      return (
                        <div key={block.key} className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-[11px] font-semibold my-2.5 ${calloutBg}`}>
                          <span className="text-sm shrink-0 leading-none mt-0.5">{icon || "💡"}</span>
                          <div className="leading-relaxed">
                            {label ? (
                              <>
                                <strong className="font-extrabold text-slate-900">{label}</strong>: {val}
                              </>
                            ) : (
                              val
                            )}
                          </div>
                        </div>
                      );
                    }
                    
                    // B. Heading 1 (header)
                    if (blockType === 'header') {
                      return (
                        <h2 key={block.key} className="text-sm font-black text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-100 flex items-center gap-2">
                          <span className="text-[#00685f] text-sm shrink-0">{icon || "📌"}</span>
                          <span className="font-extrabold">{text}</span>
                        </h2>
                      );
                    }
                    
                    // C. Heading 2 (sub_header)
                    if (blockType === 'sub_header') {
                      return (
                        <h3 key={block.key} className="text-xs font-black text-slate-800 mt-4 mb-2 flex items-center gap-1.5">
                          <span className="text-[#fea619] shrink-0">{icon || "🔸"}</span>
                          <span className="font-bold">{text}</span>
                        </h3>
                      );
                    }
                    
                    // D. Heading 3 (sub_sub_header)
                    if (blockType === 'sub_sub_header') {
                      return (
                        <h4 key={block.key} className="text-[11px] font-bold text-[#00685f] mt-3.5 mb-1.5 flex items-center gap-1">
                          <span className="shrink-0">{icon || "🔹"}</span>
                          <span className="font-bold">{text}</span>
                        </h4>
                      );
                    }
                    
                    // E. Divider
                    if (blockType === 'divider') {
                      return <hr key={block.key} className="border-slate-100 my-4" />;
                    }
                    
                    // F. Blockquote (quote)
                    if (blockType === 'quote') {
                      return (
                        <div key={block.key} className="border-l-4 border-[#00685f]/40 bg-slate-50/40 p-3 rounded-r-xl my-3 text-[11px] text-slate-650 leading-relaxed font-semibold italic pl-4">
                          {doc.name}
                        </div>
                      );
                    }
                    
                    // G. Bulleted list
                    if (blockType === 'bulleted_list') {
                      return (
                        <div key={block.key} className="flex items-start gap-2 pl-1.5 py-0.5 text-[11px] leading-relaxed group">
                          <span className="text-[#00685f] font-extrabold mt-0.5 shrink-0">•</span>
                          <span className="text-slate-700 font-semibold">{doc.name}</span>
                        </div>
                      );
                    }
                    
                    // H. Numbered list
                    if (blockType === 'numbered_list') {
                      const numMatch = doc.name.match(/^(\d+)[\.\s]/);
                      let listNum = "";
                      let listText = doc.name;
                      if (numMatch) {
                        listNum = numMatch[1];
                        listText = doc.name.substring(numMatch[0].length).trim();
                      }
                      
                      return (
                        <div key={block.key} className="flex items-start gap-2 pl-1.5 py-0.5 text-[11px] leading-relaxed group">
                          {listNum ? (
                            <span className="w-4 h-4 rounded-full bg-teal-50 text-[#00685f] border border-teal-200 font-extrabold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                              {listNum}
                            </span>
                          ) : (
                            <span className="text-[#00685f] font-extrabold mt-0.5 shrink-0">#</span>
                          )}
                          <span className="text-slate-700 font-bold pt-0.5">{listText}</span>
                        </div>
                      );
                    }
                    
                    // I. Image blocks
                    if (blockType === 'image') {
                      return (
                        <div key={block.key} className="rounded-xl overflow-hidden border border-slate-150 shadow-sm bg-slate-50 my-3">
                          <img 
                            src={doc.name} 
                            alt={t("插图", "이미지", "Illustration")} 
                            className="w-full h-auto object-contain max-h-[350px]"
                          />
                        </div>
                      );
                    }
                    
                    // J. File blocks
                    if (blockType === 'file') {
                      return (
                        <a 
                          key={block.key}
                          href="https://kcloud.kangwon.ac.kr/login"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors my-3"
                        >
                          <span className="text-xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              {t("e-루리 使用指南手册 (PDF)", "e-루리 사용법 매뉴얼 (PDF)", "e-RURI User Guide Manual (PDF)")}
                            </p>
                            <p className="text-[9px] text-slate-400 font-semibold">{doc.name}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md">
                            {t("下载", "다운로드", "Download")}
                          </span>
                        </a>
                      );
                    }
                    
                    // K. Text blocks (fallback)
                    return (
                      <p key={block.key} className="text-[11px] text-slate-500 leading-relaxed pl-1 py-0.5 font-medium whitespace-pre-wrap">
                        {doc.name}
                      </p>
                    );
                  });
                })()}
              </div>

              {/* Render custom steps only if they are not dummy placeholders */}
              {realSteps.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="font-bold text-xs text-[#00685f] mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {content.stepsTitle}
                  </h3>
                  
                  <div className="relative pl-6 before:absolute before:left-[14px] before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-100 space-y-4">
                    {realSteps.map((step, idx) => (
                      <div key={idx} className="relative flex flex-col pl-1">
                        <span className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-[#00685f]/10 text-[#00685f] font-extrabold text-[10px] flex items-center justify-center border border-white shadow-sm shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-normal">{step.title}</h4>
                        {step.desc && <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">{step.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render custom FAQs only if they are not dummy placeholders */}
              {realFaqs.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="font-bold text-xs text-[#00685f] mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    {content.faqTitle}
                  </h3>
                  
                  <div className="space-y-3">
                    {realFaqs.map((faq) => {
                      const faqKey = `${activeKnuItemId}-${faq.id}`;
                      const isOpen = !!faqOpen[faqKey];
                      return (
                        <div 
                          key={faq.id} 
                          className={`rounded-xl overflow-hidden border transition-all ${
                            isOpen 
                              ? "border-[#00685f]/25 bg-white shadow-sm" 
                              : "border-slate-150/70 bg-white hover:border-slate-300"
                          }`}
                        >
                          <button
                            onClick={() => toggleFaq(faqKey)}
                            className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-800 transition-colors ${
                              isOpen ? "bg-[#00685f]/5 text-[#00685f]" : "bg-slate-50/30 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 pr-4 min-w-0">
                              <span className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center shrink-0 border ${
                                isOpen 
                                  ? "bg-[#00685f] text-white border-[#00685f]" 
                                  : "bg-teal-50 text-[#00685f] border-teal-200"
                              }`}>
                                Q
                              </span>
                              <span className="truncate leading-normal">{faq.question}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                              isOpen ? "rotate-90 text-[#00685f]" : "text-slate-400"
                            }`} />
                          </button>
                          
                          {isOpen && (
                            <div className="p-4 bg-white text-[10px] text-slate-650 leading-relaxed border-t border-slate-50/80 font-medium relative pl-9">
                              <span className="absolute left-3 top-4 w-4 h-4 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black flex items-center justify-center">
                                A
                              </span>
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Actions: Add to Schedule and Ask in Forum */}
            <section className="grid grid-cols-2 gap-3 mb-4">
              {onNavigateToSchedule && (
                <button
                  onClick={onNavigateToSchedule}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl text-center text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 animate-bounce" />
                  {t("添加到倒计时提醒", "캘린더 알림 추가", "Add to Calendar")}
                </button>
              )}
              {onNavigateToForum && (
                <button
                  onClick={onNavigateToForum}
                  className="bg-[#00685f] hover:bg-[#005049] text-white p-3.5 rounded-xl text-center text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {t("在社区发帖询问", "커뮤니티 질문하기", "Ask in Forum")}
                </button>
              )}
            </section>

            {/* Official Link and Hotline contacts card */}
            <section className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fea619] rounded-full blur-2xl opacity-15 -mr-8 -mt-8"></div>
              
              <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center gap-1.5 relative z-10">
                <Smartphone className="w-4 h-4 text-amber-500" />
                {t("官方服务与咨询热线", "공식 지원 및 문의처", "Official Support Contact")}
              </h3>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-[11px] opacity-80">{t("负责机构", "담당 부서", "Department")}</span>
                  <span className="text-xs font-bold">{content.contactName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-[11px] opacity-80">{t("联系电话", "문의 전화", "Hotline Phone")}</span>
                  <span className="text-xs font-bold text-emerald-450 hover:underline">{content.contactPhone}</span>
                </div>
                
                <a
                  href={content.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-sm text-center mt-3"
                >
                  {content.linkText}
                </a>
              </div>
            </section>
          </main>
          
          {showShareAlert && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
              {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
            </div>
          )}

          {zoomImage && (
            <div 
              className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center p-4 cursor-zoom-out"
              onClick={() => setZoomImage(null)}
            >
              <div className="absolute top-4 right-4 text-white text-[10px] bg-white/10 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm">
                {t("点击任意处关闭", "닫기", "Click anywhere to close")}
              </div>
              <img 
                src={zoomImage} 
                alt="Zoomed Map" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
              />
            </div>
          )}
        </div>
      );
    }

    // Counts
    const totalCount = KNU_GUIDE_ITEMS.length;
    const infoCount = KNU_GUIDE_ITEMS.filter(item => item.category === 'info').length;
    const academicsCount = KNU_GUIDE_ITEMS.filter(item => item.category === 'academics').length;
    const infraCount = KNU_GUIDE_ITEMS.filter(item => item.category === 'infra').length;

    // Search and Filter
    const filteredItems = KNU_GUIDE_ITEMS.filter(item => {
      if (knuTab !== 'all' && item.category !== knuTab) {
        return false;
      }
      if (knuSearch.trim()) {
        const q = knuSearch.toLowerCase();
        return (
          item.titleZh.toLowerCase().includes(q) ||
          item.titleKo.toLowerCase().includes(q) ||
          item.titleEn.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Otherwise render the directory LISTING view!
    return (
      <div className="flex flex-col bg-[#f8f9ff] min-h-screen">
        {/* Top App Bar with elegant brand forest-green */}
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-4 h-16 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label={t("返回", "뒤로가기", "Back")}>
              <ArrowLeft className="w-5 h-5 text-[#00685f]" />
            </button>
            <h1 className="font-bold text-base text-[#00685f]">{t("江原大学三陟校区指南", "강원대 삼척캠퍼스 안내", "KNU Samcheok Guide")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-[#00685f]" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 pt-4">
          {/* Brand Welcome Hero Banner in official KNU forest green and gold */}
          <section className="mb-6 relative rounded-2xl overflow-hidden bg-[#00685f] h-48 flex flex-col justify-end p-5 text-white shadow-md border border-[#005049]">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fea619] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-300 rounded-full blur-2xl opacity-15 -ml-8 -mb-8"></div>
            
            <div className="relative z-10">
              <span className="bg-[#fea619] text-[#2a1700] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider mb-2.5 inline-block uppercase">
                {t("校区专属", "캠퍼스 전용", "Campus Dedicated")}
              </span>
              <h2 className="text-xl font-black mb-1.5 leading-tight text-teal-50">
                {t("江原大学三陟校区", "강원대학교 삼척캠퍼스", "KNU Samcheok Campus")}
              </h2>
              <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
                {t("为在韩三陟校区留学生量身定制的46项办事指南、学校系统与周边生活图文手册。", 
                   "삼척캠퍼스 유학생들을 위해 마련된 46가지 행정 업무, 대학 시스템 및 생활 인프라 맞춤형 가이드북입니다.", 
                   "Customized handbook covering 46 administration, academic system, and local life guides for Samcheok Campus international students.")}
              </p>
            </div>
          </section>

          {/* Dynamic Search Box with interactive icons */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 mb-5 flex flex-col gap-3">
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={knuSearch}
                onChange={(e) => setKnuSearch(e.target.value)}
                placeholder={t("输入关键词搜索指南...", "가이드 검색...", "Search guides...")}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] transition-all text-slate-800"
              />
              {knuSearch && (
                <button 
                  onClick={() => setKnuSearch("")} 
                  className="absolute right-3 flex items-center text-slate-400 hover:text-slate-655 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Notion Info Disclaimer Banner */}
            <div className="bg-slate-55 rounded-xl p-3 border border-slate-200/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {t("※ 本指南指南数据同步自江原大学三陟校区 Notion，无需打开外部浏览器，点击下方卡片即可直接在 App 内部以极富设计感的原生页面查看全部办事细节。", 
                   "※ 본 안내는 삼척캠퍼스 노션과 연동되며, 외부 브라우저 이동 없이 앱 내에서 원주민처럼 아늑하고 상세한 안내를 한국어로 확인하실 수 있습니다.", 
                   "* This guide directory is synced with Samcheok Notion. Click any card below to view detailed procedures natively inside the app without opening external browsers.")}
              </p>
            </div>
          </div>

          {/* Interactive Category Filter Tabs with count badges */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none mb-4">
            {[
              { id: 'all', label: t('全部', '전체', 'All'), count: totalCount },
              { id: 'info', label: t('日常指南', '안내', 'Guides'), count: infoCount },
              { id: 'academics', label: t('学校系统', '학사·시스템', 'Academics'), count: academicsCount },
              { id: 'infra', label: t('生活设施', '생활·인프라', 'Life & Infra'), count: infraCount }
            ].map((tab) => {
              const isActive = knuTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setKnuTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all border ${
                    isActive
                      ? "bg-[#00685f] text-white border-[#00685f] shadow-sm shadow-[#00685f]/20"
                      : "bg-white text-slate-600 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.25 rounded-full ${
                    isActive ? "bg-white/20 text-teal-100" : "bg-slate-100 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Guides directory list */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredItems.map((item) => {
                // Get category label details
                let catLabel = t("其他", "기타", "Other");
                let catStyle = "bg-slate-100 text-slate-700 border-slate-200";
                if (item.category === "info") {
                  catLabel = t("日常", "안내", "Guides");
                  catStyle = "bg-teal-50 text-teal-800 border-teal-100";
                } else if (item.category === "academics") {
                  catLabel = t("系统", "학사", "Academics");
                  catStyle = "bg-blue-50 text-blue-800 border-blue-100";
                } else if (item.category === "infra") {
                  catLabel = t("生活", "인프라", "Infra");
                  catStyle = "bg-amber-50 text-amber-800 border-amber-100";
                }

                // Render matching dynamic titles
                const activeTitle = t(item.titleZh, item.titleKo, item.titleEn);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveKnuItemId(item.id)}
                    className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-[#00685f]/50 hover:shadow-md transition-all group active:scale-[0.99]"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${catStyle}`}>
                          {catLabel}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-normal group-hover:text-[#00685f] transition-colors truncate">
                        {activeTitle}
                      </h4>
                    </div>
                    
                    <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center border border-slate-100 group-hover:border-teal-100 shrink-0 transition-colors">
                      <span className="text-xs font-black text-slate-400 group-hover:text-[#00685f] group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Search zero matching state */
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center mt-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">
                {t("没有找到匹配的指南", "검색 결과가 없습니다", "No Matching Guides Found")}
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal max-w-[200px]">
                {t("试着输入其他关键词，或者清除搜索框展示全部内容。", 
                   "다른 검색어를 입력하거나 검색어를 비워 모든 가이드를 확인하세요.", 
                   "Try typing another keyword or clear the search input to view all guides.")}
              </p>
            </div>
          )}
        </main>

        {showShareAlert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 shadow-lg">
            {t("链接复制成功，快去分享给同学吧！", "링크가 복사되었습니다! 친구들에게 공유해 보세요.", "Link copied successfully! Share with your classmates.")}
          </div>
        )}
      </div>
    );
  }

  return null;
}
