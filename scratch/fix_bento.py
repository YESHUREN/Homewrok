import os

app_path = "src/App.tsx"

with open(app_path, "r", encoding="utf-8") as f:
    content = f.read()

# Target block to replace (from '{/* Asymmetric Bento Layout grid */}' to the end of the mapped services grid container)
target = """                      {/* Asymmetric Bento Layout grid */}
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
                          },
                          {
                            category: "ENTRY_HELPER",
                            name: language === 'zh' ? '入境助手' : language === 'ko' ? '입국 도우미' : 'Entry Assistant',
                            desc: language === 'zh' ? '日程规划与倒数日' : language === 'ko' ? '입국 일정 및 디데이' : 'Entry Schedule & D-Day',
                            color: "bg-violet-50 text-violet-800 border-violet-100",
                            label: language === 'zh' ? '出境准备' : language === 'ko' ? '출국 준비' : 'Pre-departure'
                          }
                        ].map((serv) => (
                          <div 
                            key={serv.category}
                            onClick={() => {
                              if (serv.category === "ENTRY_HELPER") {
                                if (entryDate) {
                                  setScreen(ActiveScreen.ENTRY_HELPER);
                                } else {
                                  setTempEntryDate(entryDate || new Date().toISOString().split('T')[0]);
                                  setShowEntryDateModal(true);
                                }
                              } else {
                                setActiveGuideCategory(serv.category as GuideCategory);
                                setScreen(ActiveScreen.GUIDE_DETAIL);
                              }
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
                      </div>"""

replacement = """                      {/* Asymmetric Bento Layout grid */}
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
                      </div>"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: Bento grid replaced successfully!")
else:
    print("ERROR: Target block not found in src/App.tsx!")
