# 情緒聲量投資交易

機器學習期末專題。用 PTT 股票版的 GPT 情緒標註資料，預測台積電（2330.TW）的隔日漲跌，並設計成可回測的量化交易策略。

簡單說，就是把網路討論的「情緒」跟「聲量」當成投資訊號，看 PTT 散戶的情緒到底有沒有辦法預測台積電隔天的走勢，最後用回測來驗證這個策略到底有沒有價值。

> 詳細的方法、流程與每一張圖的解讀，整理在 [說明.md](說明.md)。

## 專題重點

- 問題型態：監督式二元分類，預測隔日收盤是漲（1）還是跌（0）。
- 資料：PTT 股票版貼文經 GPT-3.5-turbo 與 gpt-4o-mini 情緒標註後彙總（2019 到 2025），對齊 Yahoo Finance 的台積電日線後，建模樣本共 1,692 個交易日、15 個特徵。
- 避免未來函數：只用「開盤前（09:00）」的情緒聲量，而且全程用時間序列方式切資料、用 `TimeSeriesSplit` 做交叉驗證。
- 模型：
  - 監督式：Logistic Regression、Random Forest，並用多數類別（DummyClassifier）當 baseline 對照。
  - 非監督式：K-Means 做市場情緒分群、PCA 降維。

## 主要成果

> 以下數字都直接取自 `情緒聲量投資交易.ipynb` 的實際執行輸出。

| 項目 | 結果 |
|---|---|
| Random Forest 測試集 ROC-AUC | **0.574**（交叉驗證 0.549，皆優於隨機的 0.5 與 Logistic Regression 的 0.535） |
| 回測總報酬（策略 vs 買進持有） | **104.8% vs 73.9%** |
| 夏普值 Sharpe（策略 vs 買進持有） | **2.61 vs 1.46** |
| 最大回撤 Max DD（策略 vs 買進持有） | **-10.4% vs -30.5%** |
| 做多日勝率 / 做多天數 | 55.9%　/　143 天（測試集共 339 個交易日，其餘空手避險） |

我自己的結論是：情緒聲量對隔日「方向」只有很弱、但確實存在的預測力（ROC-AUC 只比 0.5 高一點點）。它真正有價值的地方在風險控管跟擇時避險——模型在情緒轉差時讓策略空手、躲過大跌，所以最大回撤從買進持有的 -30.5% 收斂到 -10.4%、夏普值幾乎翻倍。也因為避開了測試期間的大跌段，策略的總報酬（104.8%）反而還超過了買進持有（73.9%）。另外分群也看到一個有趣的現象：聲量爆量反而是個反向指標，爆量那群的隔日上漲率（46.0%）是三群裡最低的。

## 專案結構

```
0624/
├── 情緒聲量投資交易.ipynb          # 主程式，完整 ML 流程，含執行輸出
├── 說明.md                         # 方法與結果的詳細說明文件（搭配 figures/）
├── README.md                       # 專案總覽（本檔）
├── 情緒聲量_2330_前處理資料集.csv   # 前處理後可直接拿來建模的資料集（1,696 列 × 26 欄）
├── drive_data/                     # 原始情緒聲量 CSV（2 模型 × 2 時點，共 4 檔）
│   ├── format_result_gpt-4o-mini-2024-07-18_0900.csv   # 主模型・開盤前（實際採用）
│   ├── format_result_gpt-4o-mini-2024-07-18_0000.csv   # 主模型・全日
│   ├── format_result_GPT3_5turbo_emotion_0900.csv      # 對照模型・開盤前
│   └── format_result_GPT3_5turbo_emotion_0000.csv      # 對照模型・全日
├── figures/                        # 所有產出的圖（EDA、ROC、混淆矩陣、回測、分群…）
├── 情緒聲量量化交易策略.pptx        # 期末簡報
├── pyproject.toml / uv.lock        # uv 環境
└── README.md
```

> 原始貼文 json（`drive_data/ptt.stock20260520.json`，約 2.7 GB）跟書面報告（`期末書面報告.docx`）檔案太大、未上傳 GitHub，需要的話見下方連結或另外索取。

## 環境重現（uv）

```bash
uv sync
uv run jupyter notebook 情緒聲量投資交易.ipynb
```

Notebook 由上到下 Run All 就會跑完整條流程：資料收集 → 前處理 → EDA → 特徵工程 → 模型訓練（含交叉驗證與調參）→ 效能評估 → K-Means 分群 → 回測，並把所有圖重新輸出到 `figures/`。

## 資料來源

- 股價：[Yahoo Finance 的 2330.TW](https://finance.yahoo.com/quote/2330.TW)，透過 `yfinance` 抓取（2019-01-01 ~ 2026-01-01、auto-adjust 還原）。
- 情緒聲量原始資料集（含 2.7GB 原始貼文 json，沒放進 repo）：[Google Drive](https://drive.google.com/drive/folders/19Eha3DQJNC2EflvncIwGODKIUdTGg4UX)
- 情緒標註模型：OpenAI GPT-3.5-turbo、gpt-4o-mini-2024-07-18。

## 免責聲明

這個專題只是課程作業跟學術研究，不是投資建議。資料都是公開論壇的每日彙總統計，不含任何個資；情緒標註是 LLM 產生的，只用於學術研究。
