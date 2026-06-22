# 情緒聲量投資交易

機器學習期末專題。用 PTT 股票版的 GPT 情緒標註資料，預測台積電（2330.TW）的隔日漲跌，並設計成可回測的量化交易策略。

簡單說，就是把網路討論的「情緒」跟「聲量」當成投資訊號，看 PTT 散戶的情緒到底有沒有辦法預測台積電隔天的走勢，最後用回測來驗證這個策略到底有沒有價值。

## 專題重點

- 問題型態：監督式二元分類，預測隔日收盤是漲（1）還是跌（0）。
- 資料：PTT 股票版貼文經 GPT-3.5-turbo 與 gpt-4o-mini 情緒標註後彙總（2019 到 2025，共 1,692 個交易日），再加上 Yahoo Finance 的台積電日線。
- 避免未來函數：只用「開盤前（09:00）」的情緒聲量，而且全程用時間序列方式切資料。
- 模型：
  - 監督式：Logistic Regression、Random Forest，並用多數類別當 baseline 對照。
  - 非監督式：K-Means 做市場情緒分群、PCA 降維。

## 主要成果

| 項目 | 結果 |
|---|---|
| Random Forest 測試集 ROC-AUC | 0.561（比隨機的 0.5 與線性模型好） |
| 回測總報酬（策略 vs 買進持有） | 68.8% vs 73.9% |
| 夏普值 Sharpe（策略 vs 買進持有） | 2.31 vs 1.46 |
| 最大回撤 Max DD（策略 vs 買進持有） | -10% vs -30% |

我自己的結論是：情緒聲量對隔日方向只有很弱、但確實存在的預測力，它真正有用的地方其實是在風險控管跟擇時避險，也就是情緒轉差的時候先離場、躲過大跌。另外分群也看到一個有趣的現象，聲量爆量反而是個反向指標，爆量那天的隔日上漲率反而是最低的。

## 專案結構

```
.
├── 情緒聲量投資交易.ipynb          # 主程式，完整 ML 流程，含執行輸出
├── 情緒聲量_2330_前處理資料集.csv   # 前處理後可直接拿來建模的資料集
├── drive_data/                     # 原始情緒聲量 CSV（大型 json 沒上傳，連結見下方）
├── figures/                        # 所有產出的圖
├── pyproject.toml / uv.lock        # uv 環境
└── README.md
```

書面報告（期末書面報告.docx）沒有放進 repo，需要的話可以另外索取。

## 環境重現（uv）

```bash
uv sync
uv run jupyter notebook 情緒聲量投資交易.ipynb
```

## 資料來源

- 股價：[Yahoo Finance 的 2330.TW](https://finance.yahoo.com/quote/2330.TW)，透過 `yfinance` 抓取。
- 情緒聲量原始資料集（含 2.7GB 原始貼文 json，沒放進 repo）：[Google Drive](https://drive.google.com/drive/folders/19Eha3DQJNC2EflvncIwGODKIUdTGg4UX)
- 情緒標註模型：OpenAI GPT-3.5-turbo、gpt-4o-mini-2024-07-18。

## 免責聲明

這個專題只是課程作業跟學術研究，不是投資建議。資料都是公開論壇的每日彙總統計，不含任何個資。
