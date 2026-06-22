# 情緒聲量投資交易 📈🗣️

> 機器學習期末專題 — 以 **PTT 股票版 GPT 情緒標註** 預測台積電（2330.TW）隔日漲跌的量化交易策略

用網路討論的「情緒」與「聲量」當作投資訊號，結合機器學習，研究 PTT 散戶情緒能否預測台積電的隔日走勢，並以回測驗證策略價值。

---

## 🎯 專題重點

- **問題型態**：監督式二元分類（預測隔日收盤 漲(1) / 跌(0)）
- **資料**：PTT 股票版貼文經 GPT-3.5-turbo 與 gpt-4o-mini 情緒標註後彙總（2019–2025，1,692 個交易日）+ Yahoo Finance 台積電日線
- **無未來函數**：僅使用「開盤前(09:00)」的情緒聲量，並全程採時間序列分割
- **模型**：
  - 監督式：Logistic Regression、Random Forest（以多數類別 Baseline 對照）
  - 非監督式：K-Means 市場情緒分群、PCA 降維

## 📊 主要成果

| 項目 | 結果 |
|---|---|
| Random Forest 測試集 ROC-AUC | **0.561**（優於隨機 0.5 與線性模型） |
| 回測總報酬（策略 vs 買進持有） | 68.8% vs 73.9% |
| **夏普值 Sharpe（策略 vs 買進持有）** | **2.31 vs 1.46** |
| **最大回撤 Max DD（策略 vs 買進持有）** | **−10% vs −30%** |

**核心結論**：情緒聲量對隔日方向僅有「微弱但真實」的預測力，其真正價值在於 **風險控管 / 擇時避險**——在情緒轉差時離場、躲過大跌。分群也顯示「**聲量爆量是反向指標**」（爆量日隔日上漲率反而最低）。

## 📁 專案結構

```
.
├── 情緒聲量投資交易.ipynb          # 主程式（完整 ML 流程，含執行輸出）
├── 期末書面報告.docx               # 書面報告（含圖表與分析）
├── LLM工具協作記錄.docx            # LLM 協作過程記錄
├── 情緒聲量_2330_前處理資料集.csv   # 前處理後可直接建模的資料集
├── drive_data/                     # 原始情緒聲量 CSV（大型 json 未上傳，見下方連結）
├── figures/                        # 所有產出圖表
├── pyproject.toml / uv.lock        # uv 可重現環境
└── README.md
```

## 🚀 環境重現（uv）

```bash
uv sync
uv run jupyter notebook 情緒聲量投資交易.ipynb
```

## 🔗 資料來源

- **股價**：[Yahoo Finance — 2330.TW](https://finance.yahoo.com/quote/2330.TW)（透過 `yfinance`）
- **情緒聲量原始資料集**（含 2.7GB 原始貼文 json，未納入 repo）：[Google Drive](https://drive.google.com/drive/folders/19Eha3DQJNC2EflvncIwGODKIUdTGg4UX)
- **情緒標註模型**：OpenAI GPT-3.5-turbo、gpt-4o-mini-2024-07-18

## ⚠️ 免責聲明

本專題僅供學術研究與課程作業，非投資建議。資料為公開論壇之每日彙總統計，不含個資。
