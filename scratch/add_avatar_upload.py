import os

filepath = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. First target: state declaration for refs and handleAvatarFileChange
target1_old = """  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);"""

target1_new = """  const [editAvatar, setEditAvatar] = useState(profile.avatar);
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
  };"""

# 2. Second target: custom uploader in the modal
target2_old = """                      {/* Custom Input */}
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
                      </div>"""

target2_new = """                      {/* Hidden File Input */}
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
                      </div>"""

# Replace target 1
if target1_old in content:
    content = content.replace(target1_old, target1_new)
    print("State declarations replacement successful.")
else:
    # Try with different line endings
    content_normalized = content.replace("\r\n", "\n")
    target1_old_normalized = target1_old.replace("\r\n", "\n")
    if target1_old_normalized in content_normalized:
        content_normalized = content_normalized.replace(target1_old_normalized, target1_new.replace("\r\n", "\n"))
        content = content_normalized
        print("State declarations replacement successful (normalized line endings).")
    else:
        print("Warning: State declarations target NOT found.")

# Replace target 2
if target2_old in content:
    content = content.replace(target2_old, target2_new)
    print("Modal custom input replacement successful.")
else:
    # Try with normalized line endings
    content_normalized = content.replace("\r\n", "\n")
    target2_old_normalized = target2_old.replace("\r\n", "\n")
    if target2_old_normalized in content_normalized:
        content_normalized = content_normalized.replace(target2_old_normalized, target2_new.replace("\r\n", "\n"))
        content = content_normalized
        print("Modal custom input replacement successful (normalized line endings).")
    else:
        print("Warning: Modal custom input target NOT found.")

# Write back
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("App.tsx successfully updated for custom image uploading!")
