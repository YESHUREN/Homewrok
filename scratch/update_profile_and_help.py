filepath = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Target: "已通过学籍实名认证" badge removal
target1 = """                  <div className="mt-3 flex items-center gap-1 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    <Shield className="w-3.5 h-3.5 text-[#00685f] fill-teal-100" />
                    <span className="text-[#00685f] font-bold text-[10px]">{language === 'en' ? 'Student ID Verified' : language === 'ko' ? '학적 실명 인증 완료' : '已通过学籍实名认证'}</span>
                  </div>"""

if target1 in content:
    content = content.replace(target1, "")
    print("Verification badge removed successfully.")
else:
    # Try normalized newlines
    content_norm = content.replace("\r\n", "\n")
    target1_norm = target1.replace("\r\n", "\n")
    if target1_norm in content_norm:
        content = content_norm.replace(target1_norm, "")
        print("Verification badge removed successfully (normalized).")
    else:
        print("Warning: Verification badge target NOT found.")

# 2. Target: Update help feedback message
target2 = "triggerSystemTip(language === 'en' ? 'Need help? Click the top right or dial 1345.' : language === 'ko' ? '도움이 필요하시면 우측 상단을 열거나 1345로 전화하세요.' : '有什么帮助需要，请点击右上角或拨打1345。')"

new_trigger = "triggerSystemTip(language === 'en' ? 'Need help? Contact email: kaoyeqwq@gmail.com, tu1975992194@gmail.com' : language === 'ko' ? '도움이 필요하시면 이메일로 연락주세요: kaoyeqwq@gmail.com, tu1975992194@gmail.com' : '如有帮助需要，请联系邮箱：kaoyeqwq@gmail.com, tu1975992194@gmail.com')"

if target2 in content:
    content = content.replace(target2, new_trigger)
    print("Help contact email updated successfully.")
else:
    content_norm = content.replace("\r\n", "\n")
    target2_norm = target2.replace("\r\n", "\n")
    if target2_norm in content_norm:
        content = content_norm.replace(target2_norm, new_trigger.replace("\r\n", "\n"))
        print("Help contact email updated successfully (normalized).")
    else:
        print("Warning: Help contact email target NOT found.")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("App.tsx modified successfully!")
