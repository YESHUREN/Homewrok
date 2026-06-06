import re

filepath = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_content.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Define the target block start and end patterns
target_guide_key = '"26a39f9906f58077a461ebdd348de93e": (t) => ({'

# Let's locate the target guide block start
guide_start_idx = content.find(target_guide_key)
if guide_start_idx == -1:
    # Try single quotes
    target_guide_key = "'26a39f9906f58077a461ebdd348de93e': (t) => ({"
    guide_start_idx = content.find(target_guide_key)

if guide_start_idx == -1:
    raise Exception("Could not find the target guide key in knu_guides_content.ts")

# From this guide start index, find "checklistItems: [" and the matching ending "]," right before "stepsTitle"
checklist_items_start_str = "checklistItems: ["
checklist_start_pos = content.find(checklist_items_start_str, guide_start_idx)
if checklist_start_pos == -1:
    raise Exception("Could not find checklistItems start in the target guide")

# Now find "stepsTitle" to determine where the block ends
steps_title_pos = content.find("stepsTitle", checklist_start_pos)
if steps_title_pos == -1:
    raise Exception("Could not find stepsTitle after checklistItems start")

# Find the last closing bracket and comma "]," before steps_title_pos
checklist_end_pos = content.rfind("],", checklist_start_pos, steps_title_pos)
if checklist_end_pos == -1:
    raise Exception("Could not find checklistItems closing '],' before stepsTitle")

# We want to replace everything from checklist_items_start_str to checklist_end_pos + 2
old_block = content[checklist_start_pos:checklist_end_pos + 2]

new_block = """checklistItems: [
      { key: "text_1", name: t("※ 新生必须仔细阅读以下项目，并按顺序完成。", "※ 신입생은 아래 항목을 주의 깊게 읽고 순서대로 완료해야 합니다.", "※ New students must read the following items carefully and complete them in order."), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ※ 新生必须仔细阅读以下项目，并按顺序完成。", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ※ 新生必须仔细阅读以下项目，并按顺序完成。") },
      { key: "text_2", name: t("한국어", "한국어", "Korean"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: 한국어", "Required item for KNU Samcheok K-Cloud & KNU App Guide: Korean") },
      { key: "text_3", name: t("中国", "중국", "Chinese"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: 中国", "Required item for KNU Samcheok K-Cloud & KNU App Guide: Chinese") },
      { key: "text_4", name: t("English", "영어", "English"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: English", "Required item for KNU Samcheok K-Cloud & KNU App Guide: English") },
      { key: "sub_header_5", name: t("首先要确认的事项", "우선 확인해야 할 사항", "Items to Check First"), desc: t("sub_header", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: 首先要确认的事项", "Required item for KNU Samcheok K-Cloud & KNU App Guide: Items to Check First") },
      { key: "text_6", name: t("① 在电脑上登录 K-Cloud", "① PC에서 K-Cloud 로그인", "① Log into K-Cloud on PC"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ① 在电脑上登录 K-Cloud", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ① Log into K-Cloud on PC") },
      { key: "text_7", name: t("② 在电脑 K-Cloud 完成首次认证（仅一次）", "② PC K-Cloud에서 최초 인증 완료 (1회만)", "② Complete first-time verification on PC K-Cloud (Once)"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ② 在电脑 K-Cloud 完成首次认证（仅一次）", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ② Complete first-time verification on PC K-Cloud") },
      { key: "text_8", name: t("③ 在电脑 K-Cloud 修改 两项个人信息（韩国银行账户 / 韩国手机号）", "③ PC K-Cloud에서 개인정보 2가지 수정 (한국 은행 계좌 / 한국 휴대폰 번호)", "③ Update two personal info on PC K-Cloud (Korean Bank Account / Korean Phone Number)"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ③ 在电脑 K-Cloud 修改 两项个人信息（韩国银行账户 / 韩国手机号）", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ③ Update two personal info on PC K-Cloud") },
      { key: "text_9", name: t("④ 在智能手机上安装 KNU 应用", "④ 스마트폰에 KNU 앱 설치", "④ Install KNU App on Smartphone"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ④ 在智能手机上安装 KNU 应用", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ④ Install KNU App on Smartphone") },
      { key: "text_10", name: t("⑤ 登录 KNU 应用并完成邮箱认证", "⑤ KNU 앱 로그인 및 이메일 인증 완료", "⑤ Log into KNU App and complete email verification"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ⑤ 登录 KNU 应用并完成邮箱认证", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ⑤ Log into KNU App and complete email verification") },
      { key: "text_11", name: t("⑥ 在 KNU 应用中查看课程表", "⑥ KNU 앱에서 시간표 확인", "⑥ View timetable in KNU App"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ⑥ 在 KNU 应用中查看课程表", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ⑥ View timetable in KNU App") },
      { key: "text_12", name: t("⑦ 熟悉 KNU 应用中的 4种考勤方式 [点名, AP(Wi-Fi), 验证码, QR码]", "⑦ KNU 앱의 4가지 출석 방식 확인 [호명, AP(Wi-Fi), 인증번호, QR코드]", "⑦ Learn 4 attendance methods in KNU App [Roll call, AP(Wi-Fi), Verification code, QR code]"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ⑦ 熟悉 KNU 应用中的 4种考勤方式 [点名, AP(Wi-Fi), 验证码, QR码]", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ⑦ Learn 4 attendance methods in KNU App") },
      { key: "text_13", name: t("⑧ 在 e-루리 查看在线课程学习方法", "⑧ e-루리에서 온라인 강의 수강 방법 확인", "⑧ Check online class methods on e-RURI"), desc: t("text", "강원대 삼척 K-Cloud 및 KNU 앱 사용 안내 관련: ⑧ 在 e-루리 查看在线课程学习方法", "Required item for KNU Samcheok K-Cloud & KNU App Guide: ⑧ Check online class methods on e-RURI") },
      
      { key: "sub_header_14", name: t("① 在电脑上登录 K-Cloud", "① PC에서 K-Cloud 로그인", "① Log into K-Cloud on PC"), desc: t("sub_header", "step1", "step1") },
      { key: "image_101", name: "/knu_app_img1.png", desc: t("image", "K-Cloud 登录页面", "K-Cloud Login Page") },
      { key: "bulleted_list_15", name: t("地址: https://kcloud.kangwon.ac.kr/login", "주소: https://kcloud.kangwon.ac.kr/login", "URL: https://kcloud.kangwon.ac.kr/login"), desc: t("bulleted_list", "step1_url", "step1_url") },
      { key: "bulleted_list_16", name: t("第一次必须使用电脑登录。", "최초 로그인은 반드시 PC에서 진행해야 합니다.", "First login must be done on PC."), desc: t("bulleted_list", "step1_pc_only", "step1_pc_only") },
      { key: "bulleted_list_17", name: t("必须先在电脑上登录，才能正常使用校园 Wi-Fi “KNU-WLAN-Secure”", "PC에서 먼저 로그인을 해야 교내 Wi-Fi 'KNU-WLAN-Secure'를 정상적으로 사용할 수 있습니다.", "Must log in on PC first to use campus Wi-Fi 'KNU-WLAN-Secure' properly."), desc: t("bulleted_list", "step1_wifi", "step1_wifi") },
      { key: "image_102", name: "/knu_app_img2.jpg", desc: t("image", "电脑 K-Cloud 登录页面及指南", "PC K-Cloud Login Portal & Info") },
      { key: "bulleted_list_18", name: t("ID: 学号 / PW: 出生日期6位数 (YYMMDD)", "ID: 학번 / PW: 생년월일 6자리 (YYMMDD)", "ID: Student ID / PW: 6-digit Birth Date (YYMMDD)"), desc: t("bulleted_list", "step1_id_pw", "step1_id_pw") },
      
      { key: "sub_header_19", name: t("② 在电脑 K-Cloud 完成认证（首次）", "② PC K-Cloud에서 인증 완료 (최초)", "② Complete verification on PC K-Cloud (First-time)"), desc: t("sub_header", "step2", "step2") },
      { key: "image_103", name: "/knu_app_img3.jpg", desc: t("image", "PC K-Cloud 首次认证界面", "PC K-Cloud First-time Verification") },
      { key: "numbered_list_20", name: t("点击 “메일ˮ", "'메일' 클릭", "Click 'Mail'"), desc: t("numbered_list", "step2_click_mail", "step2_click_mail") },
      { key: "numbered_list_21", name: t("点击 “인증번호 발송ˮ", "'인증번호 발송' 클릭", "Click 'Send Verification Code'"), desc: t("numbered_list", "step2_send_code", "step2_send_code") },
      { key: "numbered_list_22", name: t("在邮箱中确认验证码并输入", "이메일에서 인증번호 확인 후 입력", "Check verification code in email and enter it"), desc: t("numbered_list", "step2_enter_code", "step2_enter_code") },
      { key: "numbered_list_23", name: t("点击 “인증ˮ", "'인증' 클릭", "Click 'Verify'"), desc: t("numbered_list", "step2_verify", "step2_verify") },
      
      { key: "sub_header_24", name: t("③ 在电脑 K-Cloud 修改两项个人信息(1. 输入韩国银行账户)", "③ PC K-Cloud에서 개인정보 2가지 수정 (1. 한국 은행 계좌 입력)", "③ Update personal info on PC K-Cloud (1. Enter Korean Bank Account)"), desc: t("sub_header", "step3_1", "step3_1") },
      { key: "bulleted_list_25", name: t("登录 https://kcloud.kangwon.ac.kr/login", "https://kcloud.kangwon.ac.kr/login 로그인", "Log into https://kcloud.kangwon.ac.kr/login"), desc: t("bulleted_list", "step3_1_login", "step3_1_login") },
      { key: "image_104", name: "/knu_app_img1.png", desc: t("image", "K-Cloud 登录页面", "K-Cloud Login Page") },
      { key: "image_105", name: "/knu_app_img4.jpg", desc: t("image", "点击 교과", "Click Academic Affairs (교과)") },
      { key: "bulleted_list_26", name: t("点击 “学步生服务” - “교과”", "'학부생서비스' - '교과' 클릭", "Click 'Undergraduate Service' - 'Academic Affairs (교과)'"), desc: t("bulleted_list", "step3_1_menu", "step3_1_menu") },
      { key: "image_106", name: "/knu_app_img5.jpg", desc: t("image", "点击 신상정보변경", "Click Change Personal Info (신상정보변경)") },
      { key: "bulleted_list_27", name: t("点击 “신상정보변경”", "'신상정보변경' 클릭", "Click 'Change Personal Info (신상정보변경)'"), desc: t("bulleted_list", "step3_1_submenu", "step3_1_submenu") },
      { key: "image_107", name: "/knu_app_img6.jpg", desc: t("image", "输入银行账户信息", "Enter Bank Account Info") },
      { key: "numbered_list_28", name: t("选择您开设的韩国银行", "개설한 한국 은행 선택", "Select the Korean bank you registered with"), desc: t("numbered_list", "step3_1_bank", "step3_1_bank") },
      { key: "numbered_list_29", name: t("在 “예금주” 中输入护照英文姓名", "'예금주'에 여권 영문 이름 입력", "Enter passport name in 'Account Holder (예금주)'"), desc: t("numbered_list", "step3_1_holder", "step3_1_holder") },
      { key: "numbered_list_30", name: t("输入您开设的韩国银行账号", "개설한 한국 은행 계좌번호 입력", "Enter your Korean bank account number"), desc: t("numbered_list", "step3_1_account", "step3_1_account") },
      { key: "image_108", name: "/knu_app_img7.jpg", desc: t("image", "点击 저장", "Click Save (저장)") },
      { key: "bulleted_list_31", name: t("点击 “저장”", "'저장' 클릭", "Click 'Save (저장)'"), desc: t("bulleted_list", "step3_1_save", "step3_1_save") },
      
      { key: "sub_header_32", name: t("③ 在电脑 K-Cloud 修改两项个人信息(2. 输入韩国手机号)", "③ PC K-Cloud에서 개인정보 2가지 수정 (2. 한국 휴대폰 번호 입력)", "③ Update personal info on PC K-Cloud (2. Enter Korean Phone Number)"), desc: t("sub_header", "step3_2", "step3_2") },
      { key: "bulleted_list_33", name: t("登录 https://kcloud.kangwon.ac.kr/login", "https://kcloud.kangwon.ac.kr/login 로그인", "Log into https://kcloud.kangwon.ac.kr/login"), desc: t("bulleted_list", "step3_2_login", "step3_2_login") },
      { key: "image_109", name: "/knu_app_img1.png", desc: t("image", "K-Cloud 登录页面", "K-Cloud Login Page") },
      { key: "image_110", name: "/knu_app_img4.jpg", desc: t("image", "点击 교과", "Click Academic Affairs (교과)") },
      { key: "bulleted_list_34", name: t("点击 “学步生服务” - “교과”", "'학부생서비스' - '교과' 클릭", "Click 'Undergraduate Service' - 'Academic Affairs (교과)'"), desc: t("bulleted_list", "step3_2_menu", "step3_2_menu") },
      { key: "image_111", name: "/knu_app_img5.jpg", desc: t("image", "点击 신상정보변경", "Click Change Personal Info (신상정보변경)") },
      { key: "bulleted_list_35", name: t("点击 “신상정보변경”", "'신상정보변경' 클릭", "Click 'Change Personal Info (신상정보변경)'"), desc: t("bulleted_list", "step3_2_submenu", "step3_2_submenu") },
      { key: "image_112", name: "/knu_app_img8.jpg", desc: t("image", "修改韩国手机号码", "Change to Korean Phone Number") },
      { key: "bulleted_list_36", name: t("删除原有（中国）号码，输入新的韩国手机号 (010-0000-0000)", "기존(중국) 번호를 삭제하고 신규 한국 휴대폰 번호 입력 (010-0000-0000)", "Delete old (Chinese) number and enter new Korean mobile number (010-0000-0000)"), desc: t("bulleted_list", "step3_2_phone", "step3_2_phone") },
      { key: "image_113", name: "/knu_app_img7.jpg", desc: t("image", "点击 저장", "Click Save (저장)") },
      { key: "bulleted_list_37", name: t("点击 “저장”", "'저장' 클릭", "Click 'Save (저장)'"), desc: t("bulleted_list", "step3_2_save", "step3_2_save") },
      
      { key: "sub_header_38", name: t("④ 在智能手机上安装 KNU 应用", "④ 스마트폰에 KNU 앱 설치", "④ Install KNU App on Smartphone"), desc: t("sub_header", "step4", "step4") },
      { key: "image_114", name: "/knu_app_img9.png", desc: t("image", "Android 版 KNU 应用下载 QR", "KNU App for Android Download QR") },
      { key: "image_115", name: "/knu_app_img10.png", desc: t("image", "iOS 版 KNU 应用下载 QR", "KNU App for iOS Download QR") },
      
      { key: "sub_header_39", name: t("⑤ 登录 KNU 应用（需邮箱认证）", "⑤ KNU 앱 로그인 (이메일 인증 필요)", "⑤ Log into KNU App (Requires Email Verification)"), desc: t("sub_header", "step5", "step5") },
      { key: "image_116", name: "/knu_app_img11.png", desc: t("image", "KNU 앱 로그인 화면", "KNU App Login Portal") },
      { key: "bulleted_list_40", name: t("ID: 学号 / PW: 出生日期6位数", "ID: 학번 / PW: 생년월일 6자리", "ID: Student ID / PW: 6-digit Birth Date"), desc: t("bulleted_list", "step5_id_pw", "step5_id_pw") },
      { key: "image_117", name: "/knu_app_img12.jpg", desc: t("image", "선택 E-Mail로 인증", "Select E-Mail Verification") },
      { key: "bulleted_list_41", name: t("点击 “E-Mail로 인증”", "'E-Mail로 인증' 클릭", "Click 'Verify by E-Mail (E-Mail로 인증)'"), desc: t("bulleted_list", "step5_verify_btn", "step5_verify_btn") },
      { key: "image_118", name: "/knu_app_img13.jpg", desc: t("image", "인증 요청", "Request Verification") },
      { key: "numbered_list_42", name: t("确认邮箱是否正确", "이메일 주소 일치 여부 확인", "Confirm your email address"), desc: t("numbered_list", "step5_confirm_email", "step5_confirm_email") },
      { key: "numbered_list_43", name: t("点击 “인증 요청”", "'인증 요청' 클릭", "Click 'Request Verification (인증 요청)'"), desc: t("numbered_list", "step5_request_btn", "step5_request_btn") },
      { key: "numbered_list_44", name: t("在邮箱中确认验证码并输入", "이메일에서 인증번호 확인 후 입력", "Check code in email and enter it"), desc: t("numbered_list", "step5_enter_code", "step5_enter_code") },
      { key: "image_119", name: "/knu_app_img14.jpg", desc: t("image", "인증 확인 및 완료", "Confirm Verification") },
      { key: "bulleted_list_45", name: t("点击 “확인”", "'확인' 클릭", "Click 'Confirm (확인)'"), desc: t("bulleted_list", "step5_confirm_btn", "step5_confirm_btn") },
      
      { key: "sub_header_46", name: t("⑥ 在 KNU 应用中查看课程表", "⑥ KNU 앱에서 시간표 확인", "⑥ View Timetable in KNU App"), desc: t("sub_header", "step6", "step6") },
      
      { key: "sub_header_47", name: t("⑦ KNU 应用中的四种考勤方式 [ 1. 点名 ]", "⑦ KNU 앱 4가지 출결 방식 [ 1. 호명 ]", "⑦ 4 Attendance Methods in KNU App [ 1. Roll Call ]"), desc: t("sub_header", "step7_1", "step7_1") },
      { key: "text_48", name: t("※ 每位教授方式不同，请务必熟悉所有方法。", "※ 교수님마다 출결 방식이 다르므로 반드시 모든 방식을 숙지하시기 바랍니다.", "※ Attendance check methods vary by professor; please make sure to learn all methods."), desc: t("text", "step7_note", "step7_note") },
      { key: "image_120", name: "/knu_app_img15.png", desc: t("image", "KNU 앱 출결 안내", "KNU App Attendance Guide") },
      { key: "bulleted_list_49", name: t("点名: 教授叫到名字时举手或回答 “네ˮ。", "호명: 교수님이 이름을 부를 때 손을 들거나 '네'라고 답변합니다.", "Roll Call: Raise your hand or answer 'Yes (네)' when the professor calls your name."), desc: t("bulleted_list", "step7_1_desc", "step7_1_desc") },
      
      { key: "sub_header_50", name: t("⑦ KNU 应用中的四种考勤方式 [ 2. AP(Wi-Fi) ]", "⑦ KNU 앱 4가지 출결 방식 [ 2. AP(Wi-Fi) ]", "⑦ 4 Attendance Methods in KNU App [ 2. AP(Wi-Fi) ]"), desc: t("sub_header", "step7_2", "step7_2") },
      { key: "sub_header_51", name: t("⑦ KNU 应用中的四种考勤方式 [ 3. 验证码 ]", "⑦ KNU 앱 4가지 출결 방식 [ 3. 인증번호 ]", "⑦ 4 Attendance Methods in KNU App [ 3. Verification Code ]"), desc: t("sub_header", "step7_3", "step7_3") },
      { key: "sub_header_52", name: t("⑦ KNU 应用中的四种考勤方式 [ 4. QR码 ]", "⑦ KNU 앱 4가지 출결 방식 [ 4. QR코드 ]", "⑦ 4 Attendance Methods in KNU App [ 4. QR Code ]"), desc: t("sub_header", "step7_4", "step7_4") },
      
      { key: "sub_header_53", name: t("⑧ 在 e-루리 上学习在线课程", "⑧ e-루리에서 온라인 강의 수강", "⑧ Learn Online Courses on e-RURI"), desc: t("sub_header", "step8", "step8") },
      { key: "text_54", name: t("※ 请参考 “查看及下载ˮ 文件确认上课步骤", "※ '보기 및 다운로드' 파일에서 강의 수강 단계를 확인하세요.", "※ Please refer to the 'View & Download' file to verify lecture steps."), desc: t("text", "step8_note", "step8_note") },
    ],"""

modified_content = content.replace(old_block, new_block)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(modified_content)

print("knu_guides_content.ts successfully updated with single-underscore image keys!")
