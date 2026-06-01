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
            
    # Now let's extract 100% of the text blocks into checklist_items in chronological order
    checklist_items = []
    bullet_idx = 1
    
    for btype, bcontent in blocks:
        if not bcontent:
            continue
            
        bcontent_clean = clean_text(bcontent)
        
        # Skip structural layout-only blocks that carry no content text
        if btype in ["column_list", "column", "divider", "image"]:
            continue
            
        checklist_items.append({
            "key": f"{btype}_{bullet_idx}",
            "name": bcontent_clean,
            "desc": btype
        })
        bullet_idx += 1
        
    # We will keep steps and faqs empty for KNU guides to let them render as a unified Notion article flow
    steps = []
    faqs = []

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
        "titleZh": name,
        "titleKo": info["ko"],
        "titleEn": info["en"],
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
        desc_ko = f"강원대 삼척 {data['titleKo']} 관련: {item['name']}"
        desc_en = f"Required item for KNU Samcheok {data['titleEn']}: {item['name']}"
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
