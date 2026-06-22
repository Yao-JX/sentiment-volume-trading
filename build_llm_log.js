// LLM 工具協作記錄 (Word .docx)
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
  LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, Header, Footer } = require("docx");
const CJK="Microsoft JhengHei", FULL_W=9026;
const gb={style:BorderStyle.SINGLE,size:1,color:"BBBBBB"}, cb={top:gb,bottom:gb,left:gb,right:gb};
function h1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function h2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun(t)]});}
function p(t){return new Paragraph({spacing:{after:120,line:300},children:[new TextRun({text:t,size:22})]});}
function bullet(t){return new Paragraph({numbering:{reference:"bul",level:0},spacing:{after:60},children:[new TextRun({text:t,size:22})]});}
function hc(t,w){return new TableCell({borders:cb,width:{size:w,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:"2E5496"},margins:{top:50,bottom:50,left:90,right:90},children:[new Paragraph({children:[new TextRun({text:t,bold:true,color:"FFFFFF",size:19})]})]});}
function bcell(t,w,fill){return new TableCell({borders:cb,width:{size:w,type:WidthType.DXA},shading:fill?{type:ShadingType.CLEAR,fill}:undefined,margins:{top:40,bottom:40,left:90,right:90},children: t.split("\n").map(line=>new Paragraph({children:[new TextRun({text:line,size:19})]}))});}
function table(widths,header,rows){const trs=[new TableRow({tableHeader:true,children:header.map((t,i)=>hc(t,widths[i]))})];rows.forEach((r,idx)=>trs.push(new TableRow({children:r.map((c,i)=>bcell(c,widths[i],idx%2?"F4F6F9":undefined))})));return new Table({width:{size:widths.reduce((a,b)=>a+b,0),type:WidthType.DXA},columnWidths:widths,rows:trs});}

const C=[];
C.push(new Paragraph({spacing:{before:200,after:120},alignment:AlignmentType.CENTER,children:[new TextRun({text:"LLM 工具協作記錄",bold:true,size:36})]}));
C.push(new Paragraph({spacing:{after:300},alignment:AlignmentType.CENTER,children:[new TextRun({text:"機器學習期末專題：情緒聲量投資交易",size:24,color:"555555"})]}));

C.push(h1("一、使用的 LLM 工具"));
C.push(bullet("Claude（Anthropic Claude Code）：本專題主要協作工具，用於程式撰寫、機器學習流程設計、除錯、資料分析與報告撰寫。"));
C.push(bullet("GPT-3.5-turbo 與 gpt-4o-mini（OpenAI）：用於資料集前期的 PTT 貼文情緒標註（屬資料來源端，非本組直接呼叫）。"));
C.push(p("以下記錄本組與 Claude 協作的主要過程，包含提示(prompt)內容、AI 產出，以及我們如何檢核、修正與整合。"));

C.push(h1("二、協作階段與提示記錄"));

C.push(h2("階段 1：初版價格策略報告"));
C.push(table([2400,3300,3326],
  ["提示(Prompt)摘要","AI 產出","我們的修正與整合"],
  [["請依現有的『隨機森林＋Backtrader 回測台積電』Notebook，產出書面報告與資料集說明。",
    "Claude 產生 Word 報告，並用 yfinance 重新抓取台積電一年資料存成 CSV。",
    "檢視後發現主題太單薄、未涵蓋老師要求的完整 ML 流程，決定提供老師的要求文件重新規劃。"]]));

C.push(h2("階段 2：需求落差分析"));
C.push(table([2400,3300,3326],
  ["提示(Prompt)摘要","AI 產出","我們的修正與整合"],
  [["提供老師的期末要求 PDF，請 Claude 對照現況找出落差。",
    "Claude 解析 PDF，列出落差表：缺第二個模型、EDA、特徵選擇、交叉驗證、調參、完整評估指標、可解釋性、LLM 協作記錄、uv 環境等。",
    "確認原專題遠不符合要求，據此決定『完整重建』，並選定第二、三個模型（邏輯迴歸 + K-Means/PCA）。"]]));

C.push(h2("階段 3：主題轉向情緒聲量 + 資料集整合"));
C.push(table([2400,3300,3326],
  ["提示(Prompt)摘要","AI 產出","我們的修正與整合"],
  [["提供 PTT 情緒聲量 Google Drive 資料集連結，說明想做『情緒聲量投資交易』，且程式需用 .ipynb。",
    "Claude 用 gdown 下載資料、解析出 50 檔股票 × 1700 日的情緒聲量結構，建議以台積電(聲量最高)為主案例，並設計『開盤前情緒 → 隔日漲跌』的分類問題。",
    "認同以台積電為主、採 0900 開盤前版避免未來函數的設計，確認特徵與標籤定義。"]]));

C.push(h2("階段 4：完整 ML pipeline 與報告產出"));
C.push(table([2400,3300,3326],
  ["提示(Prompt)摘要","AI 產出","我們的修正與整合"],
  [["請建立涵蓋完整流程的 .ipynb，並更新書面報告、建立 uv 環境與本協作記錄。",
    "Claude 撰寫並實際執行 Notebook（EDA、特徵工程、PCA、TimeSeriesSplit、GridSearch、完整評估、K-Means、回測），產生真實圖表與指標；同步產出 Word 報告、pyproject.toml/uv.lock。",
    "逐一檢核：確認無資料洩漏、指標合理（AUC≈0.56）、回測結論誠實（風險控管優於買進持有），並填入組員分工。"]]));

C.push(h1("三、典型提示範例（節錄）"));
C.push(bullet("「這個期末需要五個部分…你現在幫我弄好書面報告與資料集。」"));
C.push(bullet("「這是老師給的期末要求，你可以幫我改到完美符合他要求嗎？」"));
C.push(bullet("「我有一個資料集或許你可以參考，注意 code 需要用 ipynb 去寫，我想做的是情緒聲量投資交易。」"));

C.push(h1("四、如何驗證與修正 AI 產出"));
C.push(bullet("資料正確性：實際執行程式、檢查樣本數(1,692)、缺失值(0)、目標分布(約 49/51)是否合理。"));
C.push(bullet("方法論把關：要求全程使用時間序列分割與 TimeSeriesSplit、僅用開盤前資料，避免用未來預測過去。"));
C.push(bullet("結果合理性：對 ROC-AUC 僅約 0.56 不誇大，誠實說明情緒對隔日方向僅有微弱預測力，重點放在風險控管。"));
C.push(bullet("可重現性：以 uv 鎖定套件版本(uv.lock)，確保助教能重現執行環境。"));

C.push(h1("五、協作心得"));
C.push(p("LLM 工具大幅加速了程式撰寫與報告排版，但關鍵的『判斷』仍須由我們把關：包含選題方向、避免資料洩漏的實驗設計、以及對結果的誠實解讀。AI 提出的初版常需要我們依老師要求與金融常識調整，最終成果是人機協作、反覆檢核後的產物。"));

const doc=new Document({
  styles:{default:{document:{run:{font:CJK,size:22}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,font:CJK,color:"1F3864"},paragraph:{spacing:{before:260,after:140},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:23,bold:true,font:CJK,color:"2E5496"},paragraph:{spacing:{before:180,after:100},outlineLevel:1}}]},
  numbering:{config:[{reference:"bul",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:600,hanging:300}}}}]}]},
  sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"第 ",size:18}),new TextRun({children:[PageNumber.CURRENT],size:18}),new TextRun({text:" 頁",size:18})]})]})},
    children:C}]});
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync("LLM工具協作記錄.docx",buf);console.log("已產生：LLM工具協作記錄.docx",buf.length,"bytes");});
