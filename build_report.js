// 期末書面報告 (Word .docx) — 情緒聲量投資交易
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, Header, Footer, TableOfContents, ExternalHyperlink, VerticalAlign } = require("docx");

const CJK = "Microsoft JhengHei", MONO = "Consolas", FULL_W = 9026;
const gb = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const cb = { top: gb, bottom: gb, left: gb, right: gb };

function h1(t){ return new Paragraph({ heading: HeadingLevel.HEADING_1, children:[new TextRun(t)] }); }
function h2(t){ return new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun(t)] }); }
function p(t){ return new Paragraph({ spacing:{after:120, line:300}, children:[new TextRun({text:t, size:22})] }); }
function bullet(t){ return new Paragraph({ numbering:{reference:"bul", level:0}, spacing:{after:60}, children:[new TextRun({text:t, size:22})] }); }
function numli(t){ return new Paragraph({ numbering:{reference:"num", level:0}, spacing:{after:60}, children:[new TextRun({text:t, size:22})] }); }
function cap(t){ return new Paragraph({ spacing:{after:160}, alignment:AlignmentType.CENTER, children:[new TextRun({text:t, italics:true, size:18, color:"666666"})] }); }
function hc(t,w){ return new TableCell({ borders:cb, width:{size:w,type:WidthType.DXA}, shading:{type:ShadingType.CLEAR,fill:"2E5496"}, verticalAlign:VerticalAlign.CENTER, margins:{top:50,bottom:50,left:90,right:90}, children:[new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:t,bold:true,color:"FFFFFF",size:19})]})] }); }
function bc(t,w,al=AlignmentType.LEFT,fill){ return new TableCell({ borders:cb, width:{size:w,type:WidthType.DXA}, shading:fill?{type:ShadingType.CLEAR,fill}:undefined, verticalAlign:VerticalAlign.CENTER, margins:{top:40,bottom:40,left:90,right:90}, children:[new Paragraph({alignment:al, children:[new TextRun({text:t,size:19})]})] }); }
function row(cells,w,fill){ return new TableRow({children: cells.map((c,i)=> Array.isArray(c)? bc(c[0],w[i],c[1],fill): bc(c,w[i],AlignmentType.LEFT,fill))}); }
function table(widths, header, rows){
  const trs=[ new TableRow({tableHeader:true, children: header.map((t,i)=>hc(t,widths[i]))}) ];
  rows.forEach((r,idx)=> trs.push(row(r, widths, idx%2? "F4F6F9": undefined)));
  return new Table({ width:{size:widths.reduce((a,b)=>a+b,0), type:WidthType.DXA}, columnWidths:widths, rows:trs });
}
// 嵌圖（依原始比例縮放，最大寬 maxW px）
function fig(file, maxW=600){
  const dim = { "backtest.png":[1200,480],"confusion.png":[480,408],"eda_box.png":[1320,432],
    "eda_corr.png":[1200,960],"eda_dist.png":[1320,432],"eda_timeseries.png":[1320,456],
    "importance.png":[840,600],"kmeans_2d.png":[660,540],"kmeans_select.png":[1080,408],
    "pca_2d.png":[660,540],"pca_var.png":[720,432],"pr.png":[600,480],"roc.png":[1200,480] }[file];
  let [w,h]=dim; if(w>maxW){ h=Math.round(h*maxW/w); w=maxW; }
  return new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:80, after:40},
    children:[ new ImageRun({ type:"png", data: fs.readFileSync("figures/"+file),
      transformation:{width:w, height:h}, altText:{title:file, description:file, name:file} }) ] });
}
function codeBlock(code){ return code.split("\n").map(l=> new Paragraph({ spacing:{after:0,line:230},
  shading:{type:ShadingType.CLEAR, fill:"F2F2F2"}, children:[new TextRun({text:l.length?l:" ", font:MONO, size:15})] })); }

const C = [];
// ===== 封面 =====
C.push(
  new Paragraph({ spacing:{before:2200,after:200}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"機器學習期末專題報告", bold:true, size:40})] }),
  new Paragraph({ spacing:{after:120}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"情緒聲量投資交易", bold:true, size:34, color:"1F3864"})] }),
  new Paragraph({ spacing:{after:600}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"以 PTT 股票版 GPT 情緒標註預測台積電(2330)隔日漲跌之量化交易策略", size:24})] }),
  new Paragraph({ spacing:{after:120}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"Sentiment-Volume Quantitative Trading with Machine Learning", italics:true, size:22, color:"555555"})] }),
  new Paragraph({ spacing:{before:1000,after:80}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"監督式模型：Logistic Regression、Random Forest", size:22})] }),
  new Paragraph({ spacing:{after:80}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"非監督式模型：K-Means 分群、PCA 降維", size:22})] }),
  new Paragraph({ spacing:{before:900,after:80}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"報告日期：2026 年 6 月 22 日", size:24})] }),
  new Paragraph({ children:[new PageBreak()] }),
);
// 目錄
C.push(h1("目錄"), new TableOfContents("Table of Contents",{hyperlink:true, headingStyleRange:"1-2"}), new Paragraph({children:[new PageBreak()]}));

// 組員分工
C.push(h1("組員分工貢獻"));
C.push(p("（請依實際組員填寫姓名與學號）"));
C.push(table([2400,2400,4226],
  ["組員","學號","主要分工貢獻"],
  [["組員 A","（學號）","資料收集、資料清洗與前處理、探索式資料分析(EDA)"],
   ["組員 B","（學號）","特徵工程、特徵選擇與降維、監督式模型訓練與調參"],
   ["組員 C","（學號）","模型評估、非監督分群、回測應用、書面報告與投影片"]]));

// 摘要
C.push(h1("摘要"));
C.push(p("本專題以「情緒聲量」作為投資決策訊號，研究 PTT 股票版的網路討論熱度與情緒，是否能預測台灣權值龍頭台積電（2330.TW）的隔日漲跌。資料結合兩部分：(1) PTT 股票版貼文經大型語言模型（GPT-3.5-turbo 與 gpt-4o-mini）逐篇情緒標註後，依股票與交易日彙總而成的「情緒聲量」資料；(2) 透過 yfinance 取得的台積電日線價格。時間涵蓋 2019 至 2025 年，共 1,692 個建模樣本。"));
C.push(p("本專題完整實作機器學習流程：資料清洗、特徵縮放、EDA、特徵工程（建構／選擇／PCA 降維）、模型訓練（時間序列分割、TimeSeriesSplit 交叉驗證、GridSearch 調參）、效能評估（混淆矩陣、ROC-AUC、PR 曲線、可解釋性）、K-Means 非監督分群，最後以回測驗證策略。結果顯示：隨機森林測試集 ROC-AUC 約 0.56，優於隨機(0.5)與邏輯迴歸；回測中情緒聲量策略的總報酬（68.8%）雖略低於買進持有（73.9%），但夏普值（2.31）遠勝買進持有（1.46）、最大回撤（−10%）也遠優於買進持有（−30%），顯示情緒訊號的核心價值在於風險控管。"));
C.push(new Paragraph({children:[new PageBreak()]}));

// 一、專題簡介
C.push(h1("一、專題簡介與選題動機"));
C.push(p("傳統量化交易多以價格與成交量等技術面資料為主，但近年「行為財務學」指出，散戶情緒與市場關注度（聲量）對短期股價有顯著影響。PTT 股票版是台灣最大的散戶討論社群之一，其貼文情緒與討論熱度可視為市場情緒的即時溫度計。"));
C.push(p("本專題的核心問題是：能否讓機器學習模型從「開盤前」的 PTT 情緒聲量中，學會判斷台積電當日的漲跌方向，並轉化為可回測的交易策略？我們選擇台積電，因其為 PTT 討論度最高（資料中總貼文量達 30,303 篇、居 50 檔之冠）、流動性佳、且具市場代表性。"));

// 二、資料收集
C.push(h1("二、資料收集（Data Collection）"));
C.push(h2("2.1 資料來源"));
C.push(bullet("情緒聲量資料：PTT 股票版貼文，經 GPT-3.5-turbo 與 gpt-4o-mini 兩個大型語言模型逐篇做情緒分類（正面／中性／負面），再依「股票代號 × 交易日」彙總每日的貼文數與情緒分數。提供 0000（全日）與 0900（開盤前 9 點）兩種時間切點。"));
C.push(bullet("股價資料：Yahoo Finance，透過 yfinance 套件下載台積電 2330.TW 日線（開高低收量）。"));
C.push(h2("2.2 資料型態、問題定義與目標變數"));
C.push(table([3000,6026],
  ["項目","說明"],
  [["資料型態","結構化資料（CSV 情緒聲量彙總 + 價格時間序列）"],
   ["任務型態","監督式二元分類"],
   ["目標變數 target","1 = 隔日收盤上漲；0 = 下跌或持平"],
   ["目標分布","跌 50.7% / 漲 49.3%（接近平衡，輕微不平衡）"],
   ["樣本數","1,692 個交易日（2019–2025）"],
   ["特徵時點","採 0900 開盤前版本，避免未來函數(look-ahead bias)"]]));
C.push(h2("2.3 資料倫理"));
C.push(p("PTT 為公開論壇，本資料已彙總為每日統計數字，不含使用者帳號或任何可識別個資；情緒標註由 LLM 自動產生，僅供本課程學術研究使用，未作商業用途。"));
C.push(h2("2.4 資料集簡介表"));
C.push(table([3200,1500,4326],
  ["欄位","型態","說明"],
  [["trading_date","日期","交易日"],
   ["sum_count","整數","當日貼文總數（聲量）"],
   ["positive/neutral/negative_count","整數","正／中／負面貼文數"],
   ["daily_mean_score","浮點","當日情緒均分（約 −0.7 ~ +0.8）"],
   ["positive_count/sum_count 等","浮點","各情緒佔比"],
   ["Open/High/Low/Close/Volume","數值","台積電當日開高低收量"]]));

// 三、資料前處理
C.push(h1("三、資料前處理（Data Preprocessing）"));
C.push(h2("3.1 資料清洗（缺失值／重複值／異常值）"));
C.push(bullet("缺失值：情緒彙總資料經檢查無任何缺失值（0 筆）。價格與情緒合併後，因滾動特徵在序列前段產生的 NaN 一併移除。"));
C.push(bullet("重複值：以交易日為主鍵檢查，無重複日期。"));
C.push(bullet("異常值：聲量 sum_count 右偏，以 IQR 法偵測（上界約 41.5），約 5.6% 為高聲量日。我們選擇「保留」，因為爆量日通常對應重大事件，正是策略最關注的訊號，不應刪除；改以 log 轉換降低其對模型的過度影響。"));
C.push(h2("3.2 特徵縮放（Feature Scaling）"));
C.push(p("Logistic Regression 對特徵尺度敏感，採用 StandardScaler 標準化（僅以訓練集 fit，避免資料洩漏）。Random Forest 為樹模型，分裂點不受單調縮放影響，故不需縮放；K-Means 基於歐氏距離則另行標準化。"));
C.push(h2("3.3 類別資料編碼（Categorical Encoding）"));
C.push(p("本資料特徵幾乎全為數值型，無需 One-Hot 或 Label Encoding。唯一的「類別來源」是兩個 GPT 模型，我們未直接編碼，而是將其轉換為「兩模型情緒分歧度」這個有意義的數值特徵（model_disagree）。"));
C.push(h2("3.4 探索式資料分析（EDA）"));
C.push(fig("eda_dist.png")); C.push(cap("圖 1：每日聲量與情緒均分的分布"));
C.push(p("觀察：聲量明顯右偏（多數日 10–20 篇、少數爆量日達 200+），故採 log 轉換；情緒均分集中於 0 附近、略偏正，反映 PTT 對台積電整體情緒中性偏多。"));
C.push(fig("eda_box.png")); C.push(cap("圖 2：聲量／情緒 對隔日漲跌的箱型圖"));
C.push(p("觀察：上漲日的當日情緒均分中位數略高於下跌日，但兩者分布重疊嚴重，顯示單一特徵難以準確預測隔日方向。"));
C.push(fig("eda_corr.png", 480)); C.push(cap("圖 3：特徵相關矩陣熱力圖"));
C.push(p("觀察：所有情緒特徵與 target 的相關係數皆很低（|r| < 0.07），符合「股市隔日方向高雜訊」的金融常識；聲量類特徵彼此高度相關（多重共線性），對線性模型不利、對樹模型影響較小。"));
C.push(fig("eda_timeseries.png")); C.push(cap("圖 4：台積電股價 vs PTT 聲量 時間序列"));
C.push(p("觀察：聲量在大跌或大漲時明顯放大（如 2020 年疫情、2022 年空頭），聲量爆量常伴隨高波動，呼應「聲量＝市場情緒強度」的假設。"));

// 四、特徵工程
C.push(h1("四、特徵工程（Feature Engineering）"));
C.push(h2("4.1 特徵建構"));
C.push(p("依領域知識，把原始聲量／情緒轉成更具預測力的 15 個特徵："));
C.push(table([3200,5826],
  ["特徵","意義"],
  [["buzz_log","聲量取 log1p（修正右偏，數學轉換）"],
   ["buzz_ma3 / buzz_ma5","聲量 3 日／5 日移動平均"],
   ["buzz_mom","聲量動能＝今日聲量 / 5 日均（討論熱度突升）"],
   ["score_ma3 / score_mom","情緒 3 日均 / 情緒動能（今日−3日均）"],
   ["pos_ratio / neg_ratio / neu_ratio","正／負／中性貼文佔比"],
   ["pos_neg_diff","正負情緒淨值（pos_ratio − neg_ratio）"],
   ["model_disagree","兩 GPT 模型情緒分數差（標註不確定性）"],
   ["ret_prev / vol_chg","前一日報酬、量能比（價格輔助特徵）"]]));
C.push(h2("4.2 特徵選擇"));
C.push(p("以三種方法交叉檢視：互信息（Filter）、RFE（Wrapper）、樹模型重要性（Embedded）。互信息顯示情緒動能類（score_ma3、pos_neg_diff）資訊量最高；RFE 選出 8 個以情緒為主的特徵。最終保留全部 15 個特徵交給隨機森林（其具內建特徵選擇能力），並以特徵重要性事後檢驗。"));
C.push(h2("4.3 特徵提取／降維（PCA）"));
C.push(fig("pca_var.png", 420)); C.push(cap("圖 5：PCA 累積解釋變異"));
C.push(p("前 2 個主成分解釋約 56% 變異，達 90% 需 7 個主成分；2D 投影中漲／跌樣本高度重疊，印證線性可分性低，故主力採用非線性的隨機森林。"));

// 五、模型訓練
C.push(h1("五、模型訓練（Model Training）"));
C.push(bullet("5.1 模型選擇：以 DummyClassifier（多數類別）為 Baseline；Logistic Regression（線性、可解釋）與 Random Forest（非線性、抗雜訊）為主力模型。"));
C.push(bullet("5.2 資料分割：時間序列資料，依時間順序取前 80%（1,353 筆）訓練、後 20%（339 筆）測試，嚴禁隨機打亂以免「用未來預測過去」。"));
C.push(bullet("5.3 交叉驗證：採 TimeSeriesSplit（5 折），確保每折驗證集都在訓練集之後。"));
C.push(bullet("5.4 超參數調校：GridSearchCV 以 ROC-AUC 為評分。隨機森林最佳參數為 max_depth=3、min_samples_leaf=10、n_estimators=300（淺樹避免過擬合）；邏輯迴歸最佳 C=0.01（強正則化）。"));
C.push(bullet("5.5 類別不平衡：隔日漲跌約 49/51，輕微不平衡，統一設定 class_weight=\"balanced\"。"));
C.push(h2("5.6 實驗記錄"));
C.push(table([3400,2800,2826],
  ["模型","交叉驗證 ROC-AUC","最佳超參數"],
  [["Baseline（多數類別）","0.500","—"],
   ["Logistic Regression","0.502","C = 0.01"],
   ["Random Forest","0.553","depth=3, leaf=10, n=300"]]));

// 六、效能評估
C.push(h1("六、模型效能評估（Model Evaluation）"));
C.push(p("分類任務以 ROC-AUC 為主指標（對門檻不敏感、適合近平衡資料），輔以混淆矩陣、Precision／Recall／F1 與 PR 曲線。"));
C.push(h2("6.1 模型比較"));
C.push(table([3000,1400,1400,1300,1926],
  ["模型","Accuracy","Precision","Recall","F1 / ROC-AUC"],
  [["Baseline（多數類別）","0.507","0.000","0.000","0.000 / 0.500"],
   ["Logistic Regression","0.519","0.516","0.389","0.444 / 0.533"],
   ["Random Forest（最佳）","0.540","0.537","0.473","0.503 / 0.561"]]));
C.push(p("Random Forest 在所有指標皆最佳，明顯優於 Baseline 與線性模型；但 AUC 僅略高於 0.5，說明情緒聲量對隔日方向具備「微弱但真實」的預測力——這在效率市場下其實是合理且誠實的結果。"));
C.push(h2("6.2 混淆矩陣與 ROC／PR 曲線"));
C.push(fig("confusion.png", 320)); C.push(cap("圖 6：Random Forest 混淆矩陣"));
C.push(fig("roc.png")); C.push(cap("圖 7：ROC 曲線（左）與 PR 曲線（右）模型比較"));
C.push(h2("6.3 誤差分析與模型可解釋性"));
C.push(fig("importance.png", 460)); C.push(cap("圖 8：Random Forest 特徵重要性"));
C.push(p("可解釋性：情緒動能（score_ma3）、正面佔比（pos_ratio）、正負差（pos_neg_diff）為最重要特徵，符合「情緒聲量驅動」的領域直覺。誤差分析顯示：模型在盤整期（情緒中性、聲量平淡）近乎隨機，而在情緒或聲量極端的交易日較有把握——這也指引了未來可只在「高聲量」時段啟用策略。"));

// 七、非監督
C.push(h1("七、非監督學習：情緒聲量市場狀態分群（K-Means）"));
C.push(p("以聲量（log）、情緒均分、正負差、聲量動能對交易日分群，觀察不同「市場情緒狀態」的隔日表現。以肘部法則與輪廓係數決定 k=3（輪廓係數 0.29）。"));
C.push(fig("kmeans_select.png")); C.push(cap("圖 9：K-Means 分群數選擇（肘部法則與輪廓係數）"));
C.push(table([1500,2000,2000,2026,1500],
  ["群","平均聲量","平均情緒","隔日上漲率","樣本數"],
  [["群0","31.6","0.066","46.0%","478"],
   ["群1","12.9","−0.117","47.4%","496"],
   ["群2","12.2","0.253","52.8%","718"]]));
C.push(fig("kmeans_2d.png", 380)); C.push(cap("圖 10：K-Means 情緒聲量分群（PCA 投影）"));
C.push(p("分群洞察：三群分別對應「高聲量中性（群0）」「低聲量偏空（群1）」「正面情緒（群2）」狀態。正面情緒群隔日上漲率最高（52.8%），而高聲量爆量群最低（46.0%）——印證「聲量爆量常見於恐慌追高、屬反向訊號」的市場經驗，也與隨機森林學到的規律一致。"));

// 八、回測
C.push(h1("八、回測應用與結果討論"));
C.push(p("將隨機森林的預測轉為交易訊號：預測隔日上漲則持有一日、否則空手，在測試集（後 20%，約 2024–2025）回測，並與買進持有對照。"));
C.push(fig("backtest.png")); C.push(cap("圖 11：回測權益曲線（測試集）— 情緒聲量策略 vs 買進持有"));
C.push(table([3400,2800,2826],
  ["指標","情緒聲量策略","買進持有"],
  [["總報酬率","68.76%","73.85%"],
   ["夏普值 (Sharpe)","2.31","1.46"],
   ["最大回撤 (Max DD)","−10.10%","−30.51%"],
   ["做多日勝率","53.7%","—"],
   ["持有天數","147 / 339 天","339 / 339 天"]]));
C.push(p("討論：策略總報酬略低於買進持有，但僅用 43% 的時間在場內，卻換得更高的風險調整後報酬（夏普值 2.31 vs 1.46）與大幅縮小的最大回撤（−10% vs −30%）。這代表情緒聲量訊號的真正價值在於「擇時避險」——在情緒轉差時離場、躲過大跌，而非單純追求最高報酬。"));

// 九、結論
C.push(h1("九、結論與未來改進方向"));
C.push(numli("情緒聲量對台積電隔日漲跌具備微弱但真實的預測力（Random Forest 測試集 ROC-AUC≈0.56，優於隨機與線性模型）。"));
C.push(numli("風險控管價值大於方向預測：策略夏普值與最大回撤顯著優於買進持有，適合作為避險擇時訊號。"));
C.push(numli("聲量為反向指標：分群顯示爆量日隔日上漲率反而偏低，符合散戶追高殺低行為。"));
C.push(numli("過程困難與克服：情緒分數雜訊高 → 以動能／比例／滾動特徵強化訊號；時間序列易資料洩漏 → 全程採時間分割、TimeSeriesSplit，並僅使用開盤前資料。"));
C.push(numli("未來改進：擴大到多檔股票面板資料、納入新聞與三大法人買賣超、改預測 5 日報酬、加入交易成本與停損機制。"));

// 附錄
C.push(new Paragraph({children:[new PageBreak()]}));
C.push(h1("附錄 A：引用出處與資料下載"));
C.push(bullet("股價資料：Yahoo Finance（透過 yfinance 套件），台積電行情頁："));
C.push(new Paragraph({ spacing:{after:80}, children:[ new ExternalHyperlink({ link:"https://finance.yahoo.com/quote/2330.TW", children:[new TextRun({text:"https://finance.yahoo.com/quote/2330.TW", style:"Hyperlink"})] }) ] }));
C.push(bullet("情緒聲量資料集（PTT 股票版 + GPT 情緒標註）下載連結（Google Drive）："));
C.push(new Paragraph({ spacing:{after:80}, children:[ new ExternalHyperlink({ link:"https://drive.google.com/drive/folders/19Eha3DQJNC2EflvncIwGODKIUdTGg4UX", children:[new TextRun({text:"https://drive.google.com/drive/folders/19Eha3DQJNC2EflvncIwGODKIUdTGg4UX", style:"Hyperlink"})] }) ] }));
C.push(bullet("情緒標註模型：OpenAI GPT-3.5-turbo、gpt-4o-mini-2024-07-18。"));
C.push(bullet("程式環境以 uv 管理（pyproject.toml + uv.lock），完整程式碼見 情緒聲量投資交易.ipynb。"));
C.push(p("註：LLM 工具協作記錄另見「LLM工具協作記錄.docx」。"));

// 附錄 B：核心程式碼
C.push(h1("附錄 B：核心程式碼節錄"));
C.push(p("完整可執行程式碼請見隨附的 情緒聲量投資交易.ipynb，以下節錄特徵工程與模型訓練核心："));
codeBlock(`# 特徵工程（情緒聲量 → 模型特徵）
df["buzz_log"]   = np.log1p(df["sum_count"])           # 聲量取 log
df["buzz_mom"]   = df["sum_count"] / df["sum_count"].rolling(5).mean()   # 聲量動能
df["score_mom"]  = df["daily_mean_score"] - df["daily_mean_score"].rolling(3).mean()
df["pos_neg_diff"] = df["pos_ratio"] - df["neg_ratio"]
df["model_disagree"] = (df["daily_mean_score"] - df["score_gpt35"]).abs()

# 時間序列分割（嚴禁打亂）
split = int(len(df)*0.8)
Xtr, Xte = X.iloc[:split], X.iloc[split:]

# TimeSeriesSplit 交叉驗證 + GridSearch 調參
tscv = TimeSeriesSplit(n_splits=5)
rf = GridSearchCV(RandomForestClassifier(class_weight="balanced", random_state=42),
        {"n_estimators":[100,300], "max_depth":[3,5,8,None], "min_samples_leaf":[1,5,10]},
        cv=tscv, scoring="roc_auc").fit(Xtr, ytr)

# 回測：預測隔日漲 -> 持有一日
test["signal"]    = rf.best_estimator_.predict(Xte)
test["strat_ret"] = test["signal"] * test["ret_next"]`).forEach(c=>C.push(c));

// ===== 文件 =====
const doc = new Document({
  styles:{ default:{document:{run:{font:CJK,size:22}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true, run:{size:30,bold:true,font:CJK,color:"1F3864"}, paragraph:{spacing:{before:280,after:160},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true, run:{size:24,bold:true,font:CJK,color:"2E5496"}, paragraph:{spacing:{before:200,after:110},outlineLevel:1}} ] },
  numbering:{ config:[
    {reference:"bul", levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:600,hanging:300}}}}]},
    {reference:"num", levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:600,hanging:300}}}}]} ] },
  sections:[{
    properties:{ page:{ size:{width:11906,height:16838}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers:{ default:new Header({children:[ new Paragraph({alignment:AlignmentType.RIGHT, border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"BBBBBB",space:4}}, children:[new TextRun({text:"機器學習期末專題 — 情緒聲量投資交易", size:16, color:"888888"})]}) ]}) },
    footers:{ default:new Footer({children:[ new Paragraph({alignment:AlignmentType.CENTER, children:[ new TextRun({text:"第 ",size:18}), new TextRun({children:[PageNumber.CURRENT],size:18}), new TextRun({text:" 頁 / 共 ",size:18}), new TextRun({children:[PageNumber.TOTAL_PAGES],size:18}), new TextRun({text:" 頁",size:18}) ]}) ]}) },
    children: C }] });
Packer.toBuffer(doc).then(buf=>{ fs.writeFileSync("期末書面報告.docx", buf); console.log("報告已產生：期末書面報告.docx", buf.length, "bytes"); });
