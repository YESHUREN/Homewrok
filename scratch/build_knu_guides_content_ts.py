import os
import re
import json

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
ts_file_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_data.ts"
output_ts_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_content.ts"

# Load KNU_GUIDE_ITEMS from ts file
with open(ts_file_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

items = re.findall(r'id:\s*"([a-f0-9]+)",\s*titleZh:\s*"([^"]+)",\s*titleKo:\s*"([^"]+)",\s*titleEn:\s*"([^"]+)",\s*category:\s*"([^"]+)"', ts_content)

print(f"Loaded {len(items)} items from knu_guides_data.ts")

# Dict of all items
items_dict = {item[0]: {"zh": item[1], "ko": item[2], "en": item[3], "cat": item[4]} for item in items}

# Let's map each page_id to its parsed content
guides_content = {}

def clean_text(text):
    text = text.replace('"', "'").replace('\n', ' ').strip()
    return text

for page_id, info in items_dict.items():
    name = info["zh"]
    txt_path = os.path.join(scratch_dir, f"notion_page_{page_id}.txt")
    
    if not os.path.exists(txt_path):
        print(f"WARNING: File {txt_path} does not exist for {name}")
        continue
        
    with open(txt_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Heuristics parsing
    hero_desc_zh = f"获取江原大学三陟校区 {name} 的官方指南与核心信息。"
    hero_desc_ko = f"강원대학교 삼척캠퍼스 {info['ko']}에 대한 공식 가이드 및 핵심 정보를 확인하세요."
    hero_desc_en = f"Check the official guide and core details for KNU Samcheok {info['en']}."
    
    checklist_title_zh = "所需材料与准备工作清单"
    checklist_title_ko = "필요 서류 및 준비 체크리스트"
    checklist_title_en = "Required Checklist & Info"
    
    checklist_items = []
    steps_title_zh = "业务办理步骤与流程说明"
    steps_title_ko = "진행 절차 및 단계 안내"
    steps_title_en = "Processing Steps & Procedures"
    
    steps = []
    faq_title_zh = "重要注意事项与常见问题"
    faq_title_ko = "자주 묻는 질문 및 중요 안내"
    faq_title_en = "Important Notices & FAQ"
    
    faqs = []
    link_text_zh = "前往江原大学官方网站"
    link_text_ko = "강원대학교 공식 사이트 이동"
    link_text_en = "Go to KNU Official Website"
    link_url = "https://www.kangwon.ac.kr"
    
    contact_phone = "033-570-6891"
    contact_name_zh = "三陟校区国际交流处 (OIA)"
    contact_name_ko = "삼척 국제교류과 (OIA)"
    contact_name_en = "Samcheok Office of International Affairs (OIA)"
    
    # Let's extract phones and links from all text first
    all_text = "".join(lines)
    phone_matches = re.findall(r'033-570-\d{4}|033-573-\d{4}|\d{3}-\d{4}-\d{4}', all_text)
    if phone_matches:
        contact_phone = phone_matches[0]
        
    url_matches = re.findall(r'https?://[^\s\]\)\"]+', all_text)
    if url_matches:
        link_url = url_matches[0].strip(".")
        
    # Let's read blocks
    blocks = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("PAGE:"):
            continue
        # Extract block type and content
        m = re.match(r'^(\s*)\[([^\]]+)\](.*)$', line)
        if m:
            btype = m.group(2)
            content = m.group(3).strip()
            blocks.append((btype, content))
        else:
            # Plain text
            blocks.append(("text", line))
            
    # Now let's build sections based on headers/types
    current_section = "intro"
    
    bullet_idx = 1
    step_idx = 1
    faq_idx = 1
    
    # If the file is very short, let's just make list items
    for btype, bcontent in blocks:
        if not bcontent:
            continue
            
        bcontent_clean = clean_text(bcontent)
        
        # Check if we should switch section
        lower_content = bcontent_clean.lower()
        if "材料" in bcontent_clean or "准备" in bcontent_clean or "资格" in bcontent_clean or "필수" in bcontent_clean or "서류" in bcontent_clean or "제출" in bcontent_clean:
            current_section = "checklist"
        elif "步骤" in bcontent_clean or "流程" in bcontent_clean or "方法" in bcontent_clean or "절차" in bcontent_clean or "방법" in bcontent_clean or "단계" in bcontent_clean:
            current_section = "steps"
        elif "注意" in bcontent_clean or "常见问题" in bcontent_clean or "faq" in lower_content or "참고" in bcontent_clean or "警告" in bcontent_clean:
            current_section = "faq"
            
        # Parse based on btype and current_section
        if btype in ["sub_header", "sub_sub_header", "header"]:
            if "intro" in current_section:
                hero_desc_zh = bcontent_clean
                hero_desc_ko = f"강원대 삼척 {info['ko']} 관련: {bcontent_clean}"
                hero_desc_en = f"KNU Samcheok {info['en']}: {bcontent_clean}"
            continue
            
        if btype == "callout" or (btype == "quote" and len(bcontent_clean) > 10):
            hero_desc_zh = bcontent_clean
            hero_desc_ko = f"강원대 삼척 {info['ko']}: {bcontent_clean}"
            hero_desc_en = f"KNU Samcheok {info['en']}: {bcontent_clean}"
            continue
            
        if btype in ["bulleted_list", "table_row", "text"]:
            # If it's a table row or bullet, check what it contains
            if current_section == "checklist" or len(checklist_items) < 4:
                # Add to checklist
                if len(bcontent_clean) > 3 and not bcontent_clean.startswith("http") and bcontent_clean not in [item["name"] for item in checklist_items]:
                    key = f"item_{bullet_idx}"
                    checklist_items.append({
                        "key": key,
                        "name": bcontent_clean,
                        "desc": f"江原大学官方 {name} 相关重要项或说明。"
                    })
                    bullet_idx += 1
            elif current_section == "faq" or len(faqs) < 3:
                if len(bcontent_clean) > 8 and bcontent_clean not in [faq["answer"] for faq in faqs]:
                    # Make a FAQ
                    q_zh = f"关于 {name} 的相关规定/注意事项是什么？" if faq_idx == 1 else f"如何理解 {bcontent_clean[:10]}... 的说明？"
                    faqs.append({
                        "id": f"faq_{faq_idx}",
                        "question": q_zh,
                        "answer": bcontent_clean
                    })
                    faq_idx += 1
                    
        if btype in ["numbered_list"]:
            if len(bcontent_clean) > 4:
                steps.append({
                    "title": f"步骤 {step_idx}: {bcontent_clean[:15]}...",
                    "desc": bcontent_clean
                })
                step_idx += 1

    # Fallbacks if items are empty
    if not checklist_items:
        checklist_items = [
            {"key": "passport", "name": "1. 护照与外国人登录证", "desc": "在学期间办理一切业务的核心有效身份证件。"},
            {"key": "student_id", "name": "2. 江原大学学生证", "desc": "在校内出入图书馆、教学楼或宿舍的身份证明。"},
            {"key": "portal", "name": "3. K-Cloud 门户账号", "desc": "江原大学统一教务系统的登录账号（学号及密码）。"}
        ]
    if not steps:
        steps = [
            {"title": "第一步：仔细阅读本指南核心条款", "desc": f"认真了解江原大学三陟校区关于 {name} 的官方政策与具体要求。"},
            {"title": "第二步：按要求准备相关支撑材料", "desc": "备齐所需的纸质文件、电子证件或申请表单，避免出现遗漏。"},
            {"title": "第三步：前往指定办公室或在线办理", "desc": "在工作时间内前往绿色能源馆910室或登录学校K-Cloud/e-루리门户提交申请并完成办理。"}
        ]
    if not faqs:
        faqs = [
            {"id": "faq_1", "question": f"办理 {name} 业务时，有什么需要特别注意的时限吗？", "answer": f"通常学籍、学费、选课以及签证相关的业务都有严格的申请期限。请务必在学校公布的规定时段内完成办理，逾期将可能产生极其严重的影响（如延期罚款或学籍注销）。"},
            {"id": "faq_2", "question": "如果在办理过程中遇到不明白的专业术语或语言障碍怎么办？", "answer": "您可以直接拨打三陟校区国际交流处咨询热线 033-570-6891。大楼内配有专门支持外国留学生的中文老师和主务官，会全力为您提供细致、无语言障碍的解答。"}
        ]
        
    # Standardize links text
    if "hikorea" in link_url.lower():
        link_text_zh = "前往 HiKorea 在线服务官网"
        link_text_ko = "하이코리아 공식 홈페이지 이동"
        link_text_en = "Go to HiKorea Immigration Portal"
    elif "kcloud" in link_url.lower():
        link_text_zh = "登录 K-Cloud 教务门户网站"
        link_text_ko = "K-Cloud 학사 포털 사이트 이동"
        link_text_en = "Log into K-Cloud Portal"
    elif "library" in link_url.lower():
        link_text_zh = "前往江原大学图书馆官网"
        link_text_ko = "강원대학교 도서관 홈페이지 이동"
        link_text_en = "Go to KNU Library Website"
    elif "dormitory" in link_url.lower():
        link_text_zh = "前往江原大学宿舍管理官网"
        link_text_ko = "강원대학교 생활관 홈페이지 이동"
        link_text_en = "Go to KNU Dormitory Website"

    guides_content[page_id] = {
        "heroDesc": {
            "zh": hero_desc_zh,
            "ko": hero_desc_ko,
            "en": hero_desc_en
        },
        "checklistTitle": {
            "zh": checklist_title_zh,
            "ko": checklist_title_ko,
            "en": checklist_title_en
        },
        "checklistItems": checklist_items,
        "stepsTitle": {
            "zh": steps_title_zh,
            "ko": steps_title_ko,
            "en": steps_title_en
        },
        "steps": steps,
        "faqTitle": {
            "zh": faq_title_zh,
            "ko": faq_title_ko,
            "en": faq_title_en
        },
        "faqs": faqs,
        "linkText": {
            "zh": link_text_zh,
            "ko": link_text_ko,
            "en": link_text_en
        },
        "linkUrl": link_url,
        "contactPhone": contact_phone,
        "contactName": {
            "zh": contact_name_zh,
            "ko": contact_name_ko,
            "en": contact_name_en
        }
    }

# Generate TypeScript code
ts_lines = []
ts_lines.append("// This file is automatically generated by build_knu_guides_content_ts.py")
ts_lines.append("// Do not modify this file manually.")
ts_lines.append("")
ts_lines.append("export interface KnuGuideContentItem {")
ts_lines.append("  heroDesc: string;")
ts_lines.append("  checklistTitle: string;")
ts_lines.append("  checklistItems: { key: string; name: string; desc: string }[];")
ts_lines.append("  stepsTitle: string;")
ts_lines.append("  steps: { title: string; desc: string }[];")
ts_lines.append("  faqTitle: string;")
ts_lines.append("  faqs: { id: string; question: string; answer: string }[];")
ts_lines.append("  linkText: string;")
ts_lines.append("  linkUrl: string;")
ts_lines.append("  contactPhone: string;")
ts_lines.append("  contactName: string;")
ts_lines.append("}")
ts_lines.append("")
ts_lines.append("export const KNU_GUIDE_CONTENT: Record<string, (t: (zh: string, ko: string, en: string) => string) => KnuGuideContentItem> = {")

for page_id, data in guides_content.items():
    ts_lines.append(f'  "{page_id}": (t) => ({{')
    
    # heroDesc
    ts_lines.append(f'    heroDesc: t("{data["heroDesc"]["zh"]}", "{data["heroDesc"]["ko"]}", "{data["heroDesc"]["en"]}"),')
    
    # checklistTitle
    ts_lines.append(f'    checklistTitle: t("{data["checklistTitle"]["zh"]}", "{data["checklistTitle"]["ko"]}", "{data["checklistTitle"]["en"]}"),')
    
    # checklistItems
    ts_lines.append('    checklistItems: [')
    for item in data["checklistItems"]:
        desc_zh = item["desc"]
        desc_ko = f"강원대 삼척 {name} 관련: {item['name']}"
        desc_en = f"Required item for KNU Samcheok: {item['name']}"
        ts_lines.append(f'      {{ key: "{item["key"]}", name: t("{item["name"]}", "{item["name"]}", "{item["name"]}"), desc: t("{desc_zh}", "{desc_ko}", "{desc_en}") }},')
    ts_lines.append('    ],')
    
    # stepsTitle
    ts_lines.append(f'    stepsTitle: t("{data["stepsTitle"]["zh"]}", "{data["stepsTitle"]["ko"]}", "{data["stepsTitle"]["en"]}"),')
    
    # steps
    ts_lines.append('    steps: [')
    for step in data["steps"]:
        title_zh = step["title"]
        title_ko = f"단계: {step['title']}"
        title_en = f"Step: {step['title']}"
        desc_zh = step["desc"]
        desc_ko = f"상세 내용: {step['desc']}"
        desc_en = f"Details: {step['desc']}"
        ts_lines.append(f'      {{ title: t("{title_zh}", "{title_ko}", "{title_en}"), desc: t("{desc_zh}", "{desc_ko}", "{desc_en}") }},')
    ts_lines.append('    ],')
    
    # faqTitle
    ts_lines.append(f'    faqTitle: t("{data["faqTitle"]["zh"]}", "{data["faqTitle"]["ko"]}", "{data["faqTitle"]["en"]}"),')
    
    # faqs
    ts_lines.append('    faqs: [')
    for faq in data["faqs"]:
        q_zh = faq["question"]
        q_ko = f"질문: {faq['question']}"
        q_en = f"Q: {faq['question']}"
        a_zh = faq["answer"]
        a_ko = f"답변: {faq['answer']}"
        a_en = f"A: {faq['answer']}"
        ts_lines.append(f'      {{ id: "{faq["id"]}", question: t("{q_zh}", "{q_ko}", "{q_en}"), answer: t("{a_zh}", "{a_ko}", "{a_en}") }},')
    ts_lines.append('    ],')
    
    # linkText
    ts_lines.append(f'    linkText: t("{data["linkText"]["zh"]}", "{data["linkText"]["ko"]}", "{data["linkText"]["en"]}"),')
    
    # linkUrl
    ts_lines.append(f'    linkUrl: "{data["linkUrl"]}",')
    
    # contactPhone
    ts_lines.append(f'    contactPhone: "{data["contactPhone"]}",')
    
    # contactName
    ts_lines.append(f'    contactName: t("{data["contactName"]["zh"]}", "{data["contactName"]["ko"]}", "{data["contactName"]["en"]}"),')
    
    ts_lines.append('  }),')

ts_lines.append("};")

with open(output_ts_path, "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(ts_lines))

print(f"Successfully generated {output_ts_path}!")
print(f"Total entries: {len(guides_content)}")
