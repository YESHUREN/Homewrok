import json
import os

# We have the 46 titles from the Notion database. Let's create an exhaustive translation mapping.
TRANSLATIONS = {
    "国际化团队介绍": {
        "ko": "국제화팀 소개",
        "en": "Introduction to OIA Team",
        "cat": "info"
    },
    "学年日程指南": {
        "ko": "학사일정 안내",
        "en": "Academic Calendar Guide",
        "cat": "academics"
    },
    "学费": {
        "ko": "등록금",
        "en": "Tuition Fees",
        "cat": "academics"
    },
    "课程注册": {
        "ko": "수강신청",
        "en": "Course Registration",
        "cat": "academics"
    },
    "奖学金": {
        "ko": "장학금",
        "en": "Scholarships",
        "cat": "academics"
    },
    "成绩查询与季节学期课程": {
        "ko": "성적 조회 및 계절학기",
        "en": "Grades Enquiry & Semesters",
        "cat": "academics"
    },
    "学籍变动（休学・复学・警告・退学）": {
        "ko": "학적변동 (휴학/복학/학사경고/자퇴)",
        "en": "Academic Status Changes",
        "cat": "academics"
    },
    "毕业语言要求": {
        "ko": "졸업 어학 조건",
        "en": "Graduation Language Requirements",
        "cat": "academics"
    },
    "未来规划咨询及韩语水平评估": {
        "ko": "진로 상담 및 한국어 능력 평가",
        "en": "Career Counseling & TOPIK",
        "cat": "academics"
    },
    "非课程活动": {
        "ko": "비교과 프로그램",
        "en": "Non-Curricular Activities",
        "cat": "academics"
    },
    "K-Cloud 与 KNU 应用使用指南": {
        "ko": "K-Cloud 및 KNU 앱 사용 안내",
        "en": "K-Cloud & KNU App Guide",
        "cat": "academics"
    },
    "K-Cloud 个人信息更新通知": {
        "ko": "K-Cloud 개인정보 변경 안내",
        "en": "K-Cloud Personal Info Update Notice",
        "cat": "academics"
    },
    "e-루리 사용법/How to use e-루리/e-RURI使用指南 (2)": {
        "ko": "e-루리 사용법",
        "en": "How to use e-RURI",
        "cat": "academics"
    },
    "各类证明文件的申请 with 办理": {
        "ko": "각종 증명서 발급 및 신청",
        "en": "Application & Issuance of Certificates",
        "cat": "info"
    },
    "各类证明文件的申请与办理": {
        "ko": "각종 증명서 발급 및 신청",
        "en": "Application & Issuance of Certificates",
        "cat": "info"
    },
    "图书馆（施工中🔧）": {
        "ko": "도서관 (공사 중🔧)",
        "en": "Library (Under Construction🔧)",
        "cat": "infra"
    },
    "宿舍": {
        "ko": "기숙사",
        "en": "Dormitory",
        "cat": "infra"
    },
    "学校体育设施": {
        "ko": "교내 체육시설",
        "en": "Campus Sports Facilities",
        "cat": "infra"
    },
    "保健室": {
        "ko": "보건실",
        "en": "Health Service Center (Infirmary)",
        "cat": "infra"
    },
    "通勤班车运营指南": {
        "ko": "통학버스 운행 안내",
        "en": "Shuttle Bus Guide",
        "cat": "infra"
    },
    "便利设施": {
        "ko": "편의시설",
        "en": "Convenience Amenities",
        "cat": "infra"
    },
    "Wi-Fi 及 应用程序": {
        "ko": "Wi-Fi 및 애플리케이션",
        "en": "Wi-Fi & Mobile Apps",
        "cat": "infra"
    },
    "校园导览图": {
        "ko": "캠퍼스 안내도",
        "en": "Campus Map",
        "cat": "infra"
    },
    "东海出入境事务所": {
        "ko": "동해출입국사무소",
        "en": "Donghae Immigration Office",
        "cat": "info"
    },
    "外籍人士综合服务中心（1345）": {
        "ko": "외국인 종합안내센터 (1345)",
        "en": "Immigration Contact Center (1345)",
        "cat": "info"
    },
    "海韩国访问预约方法": {
        "ko": "하이코리아 방문 예약 방법",
        "en": "Hi Korea Appointment Booking Guide",
        "cat": "info"
    },
    "Hi Korea 在线电子民愿申请方法指南": {
        "ko": "하이코리아 온라인 전자민원 신청 안내",
        "en": "Hi Korea Online E-Civil Service Guide",
        "cat": "info"
    },
    "签证延期（延长滞留期限）": {
        "ko": "비자 연장 (체류기간 연장)",
        "en": "Visa Extension (Extension of Stay)",
        "cat": "info"
    },
    "兼职工作（打工）": {
        "ko": "시간제 취업 (알바)",
        "en": "Part-time Job (Hourly Work)",
        "cat": "info"
    },
    "居住地变更申报": {
        "ko": "체류지 변경 신고",
        "en": "Change of Residence Report",
        "cat": "info"
    },
    "外国人登录证返还指南": {
        "ko": "외국인등록증 반납 안내",
        "en": "Alien Registration Card (ARC) Return Guide",
        "cat": "info"
    },
    "就业活动滞留资格变更": {
        "ko": "구직활동 체류자격 변경",
        "en": "Change of Status for Job Seeking",
        "cat": "info"
    },
    "外国人登录证补发": {
        "ko": "외국인등록증 재발급",
        "en": "ARC Reissuance",
        "cat": "info"
    },
    "护照信息变更": {
        "ko": "여권 정보 변경",
        "en": "Passport Information Update",
        "cat": "info"
    },
    "保险": {
        "ko": "보험",
        "en": "Insurance",
        "cat": "info"
    },
    "韩国手机开通": {
        "ko": "한국 휴대폰 개통",
        "en": "SIM Card & Phone Activation",
        "cat": "info"
    },
    "开设韩国银行账户": {
        "ko": "한국 은행 계좌 개설",
        "en": "Opening a Korean Bank Account",
        "cat": "info"
    },
    "开设韩国银行账户\n": {
        "ko": "한국 은행 계좌 개설",
        "en": "Opening a Korean Bank Account",
        "cat": "info"
    },
    "住房、自己做饭生活（合租/独居）、搬家": {
        "ko": "주거, 자취생활 및 이사",
        "en": "Housing, Self-Catering & Moving",
        "cat": "infra"
    },
    "对韩国生活有用的应用程序": {
        "ko": "한국 생활에 유용한 앱",
        "en": "Useful Apps for Living in Korea",
        "cat": "info"
    },
    "邮政与快递": {
        "ko": "우편 및 택배",
        "en": "Post & Express Delivery",
        "cat": "infra"
    },
    "医疗设施": {
        "ko": "의료시설",
        "en": "Medical Facilities",
        "cat": "infra"
    },
    "公共设施": {
        "ko": "공공시설",
        "en": "Public Facilities",
        "cat": "infra"
    },
    "主要购物场所": {
        "ko": "주요 쇼핑 장소",
        "en": "Major Shopping Places",
        "cat": "infra"
    },
    "三陟旅游景点": {
        "ko": "삼척 관광명소",
        "en": "Samcheok Tourist Attractions",
        "cat": "infra"
    },
    "三陟餐厅": {
        "ko": "삼척 맛집",
        "en": "Samcheok Restaurants",
        "cat": "infra"
    },
    "三陟节庆": {
        "ko": "삼척 축제",
        "en": "Samcheok Festivals",
        "cat": "infra"
    },
    "如何在三陟租房": {
        "ko": "삼척에서 방 구하는 방법",
        "en": "How to Rent a Room in Samcheok",
        "cat": "infra"
    }
}

def generate_ts():
    with open("scratch/knu_pages_list.json", "r", encoding="utf-8") as f:
        pages = json.load(f)
        
    ts_entries = []
    
    for idx, p in enumerate(pages, 1):
        title = p["title"]
        pid = p["id"]
        
        # Fallback category mapping based on their tags
        cat_tag = p["category"]
        mapped_cat = "other"
        if cat_tag == "안내":
            mapped_cat = "info"
        elif cat_tag == "코드베이스":
            mapped_cat = "academics"
        elif cat_tag == "인프라":
            mapped_cat = "infra"
            
        trans = TRANSLATIONS.get(title)
        if trans:
            ko_title = trans["ko"]
            en_title = trans["en"]
            # Overwrite mapped category if we have a better manual override
            mapped_cat = trans["cat"]
        else:
            ko_title = title
            en_title = title
            
        # Clean title for TS string literal
        zh_title = title.replace("\n", "").strip()
        ko_title = ko_title.replace("\n", "").strip()
        en_title = en_title.replace("\n", "").strip()
        
        entry = f"""  {{
    id: "{pid}",
    titleZh: "{zh_title}",
    titleKo: "{ko_title}",
    titleEn: "{en_title}",
    category: "{mapped_cat}"
  }}"""
        ts_entries.append(entry)
        
    ts_array = "export interface KnuGuideItem {\n  id: string;\n  titleZh: string;\n  titleKo: string;\n  titleEn: string;\n  category: 'info' | 'academics' | 'infra' | 'other';\n}\n\nexport const KNU_GUIDE_ITEMS: KnuGuideItem[] = [\n" + ",\n".join(ts_entries) + "\n];"
    
    with open("scratch/knu_guide_items.ts", "w", encoding="utf-8") as f_out:
        f_out.write(ts_array)
        
    print("Successfully generated scratch/knu_guide_items.ts!")

if __name__ == "__main__":
    generate_ts()
