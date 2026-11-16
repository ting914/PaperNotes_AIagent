---
slug: aggarwal-2024-geo
title: "GEO: Generative Engine Optimization"
authors: Aggarwal, P., Murahari, V., Rajpurohit, T., Kalyan, A., Narasimhan, K., & Deshpande, A.
year: 2024
venue: Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '24)
doi: 10.1145/3637528.3671900
tags: [GEO, SEO, 生成式搜尋]
summary: 提出GEO框架，證實加入引述與統計可使內容在生成式搜尋中可見度提升達40%。
added: 2026-11-16
---

# GEO: Generative Engine Optimization

> 頁碼採 KDD '24 論文集頁碼（PDF 頁尾數字，pp. 5–16）。

## 研究問題

BingChat、Google SGE、Perplexity.ai 這類「生成式引擎」（generative engine, GE）會先搜尋、再用 LLM 把多個來源整合成一段附引用的回答，使用者不必再點進網站。這對網站與內容創作者不利：流量可能下降，而且 GE 是黑盒子，創作者無從得知自己的內容何時、如何被呈現。傳統 SEO 以關鍵字與排名為核心，不一定適用於 GE。

本文要回答：

1. 在 GE 的回答中，一個來源網站的「可見度」該如何定義與衡量？
2. 內容創作者能否只修改自己的網頁內容，就提升在 GE 回答中的可見度？哪些策略有效？
3. 策略的效果是否因查詢領域、網站原始排名而不同？

## 理論與方法

- **GE 的形式化**：把 GE 定義為輸入使用者查詢（與個人化資訊）、輸出自然語言回答的函數，內部由一組生成模型（查詢改寫、摘要、回答生成）加上搜尋引擎組成（p. 7）。
- **可見度（impression）指標**（pp. 7–9）：
  - Word Count：回答中引用該來源的句子字數占全部回答的比例。
  - Position-Adjusted Word Count：再依句子在回答中的位置做指數衰減加權，越前面權重越高。
  - Subjective Impression：用 G-Eval（GPT-3.5 依評分表打分）評估 7 個面向——與查詢的相關性、影響力、獨特性、主觀位置、主觀份量、被點擊可能性、內容多樣性。
- **9 種 GEO 方法**（p. 8）：Authoritative（語氣更權威）、Statistics Addition（加入統計數據）、Keyword Stuffing（關鍵字堆砌，傳統 SEO 做法）、Cite Sources（加入可信來源引用）、Quotation Addition（加入引述）、Easy-to-Understand（簡化語言）、Fluency Optimization（提升流暢度）、Unique Words、Technical Terms。實作上用 LLM 依各方法改寫網頁內容。
- **GEO-bench**（p. 9）：10,000 筆查詢（train/validation/test = 8K/1K/1K），來源包含 MS MARCO、ORCAS-I、Natural Questions、AllSouls、LIMA、Davinci-Debate、Perplexity Discover、ELI5、GPT-4 生成查詢共 9 種；涵蓋 25 個領域，資訊型查詢 80%、交易型與導航型各 10%；每筆附 Google 前 5 名搜尋結果的文字內容。
- **實驗設計**（pp. 9–10）：自建兩步驟 GE（Google 前 5 個來源 + gpt-3.5-turbo 生成回答，temperature 0.7、每題抽 5 個回答）。每題隨機挑一個來源套用 GEO 方法，其餘來源不變，計算該來源可見度的相對提升百分比；以 5 個隨機種子取平均，在 test split 上評估。
- **外部驗證**：在實際上線的 Perplexity.ai 上重複實驗（pp. 12–13）。

## 主要發現

- **加入可信度元素最有效**：Quotation Addition、Statistics Addition、Cite Sources 在 Position-Adjusted Word Count 上相對提升約 30–40%，在 Subjective Impression 上約 15–30%（p. 10）；例如 Quotation Addition 的整體分數 27.2，基準為 19.3（Table 1）。
- **傳統 SEO 的關鍵字堆砌無效**：Keyword Stuffing 分數（17.7）甚至低於未優化（19.3）（p. 10）；在 Perplexity.ai 上比基準差約 10%（p. 13）。單純把語氣改得更權威（Authoritative）整體也沒有顯著提升（p. 11）。
- **呈現方式也重要**：Fluency Optimization、Easy-to-Understand 這類只改寫風格、不加新資訊的方法，也帶來約 15–30% 的提升（p. 10）。
- **對原本排名低的網站幫助最大**：當所有來源都做 GEO 時，Cite Sources 讓搜尋排名第 5 的網站可見度提升 115.1%，排名第 1 的反而下降 30.3%（Table 2，pp. 11–12）。
- **效果因領域而異、組合使用更好**：例如 Statistics Addition 在「法律與政府」、「意見」類查詢最有效，Quotation Addition 在「人物與社會」、「歷史」最有效（Table 3，p. 11）；Fluency Optimization + Statistics Addition 的組合表現最好，比最佳單一方法高出 5.5% 以上（p. 12）。在 Perplexity.ai 上，Quotation Addition 的 Position-Adjusted Word Count 提升約 22%，Statistics Addition 的 Subjective Impression 提升約 37%（p. 13）。

## 研究限制

作者自述（p. 13）：

- GE 會持續演進，GEO 方法也需要跟著調整，就像 SEO 一樣。
- 真實查詢的型態會隨時間改變，GEO-bench 需要持續更新。
- 沒有評估 GEO 修改對傳統搜尋排名的影響。
- 查詢的類別標籤由 GPT-4 標註再人工檢查，仍可能有主觀判斷或標註錯誤。

我觀察到的：

- 主要實驗的 GE 是自建的（gpt-3.5-turbo + 前 5 個來源），與商用 GE 的實際架構可能差距很大；外部驗證只做了 Perplexity.ai 一個平台。
- Subjective Impression 由 GPT-3.5 評分（LLM 當評審），再標準化到與 Position-Adjusted Word Count 相同的平均與變異數，可能帶有 LLM 本身的偏誤。
- 策略組合分析因成本只用了 200 筆樣本（p. 12 註腳）。
- 只衡量「在 AI 回答中的曝光」，沒有衡量使用者是否因此點擊、信任或購買。
- 由 LLM 自動「加入統計數據、引述」可能產生不實內容，文中沒有討論內容真實性與倫理問題。
- 交易型查詢只占 10%，沒有專門針對電商商品頁的分析。

## 可引用重點

- 生成式引擎直接給出整合後的答案，使用者不必進入原網站，可能使網站的自然流量下降，對依賴線上曝光的中小企業與個人創作者造成衝擊（p. 5）。
- 傳統搜尋引擎以「排名」衡量可見度，但生成式引擎把多個來源交織在同一段回答中，來源的可見度取決於被引用的篇幅、位置與呈現方式，因此需要多面向的新指標（pp. 6–7）。
- 傳統 SEO 常用的關鍵字堆砌在生成式引擎中幾乎沒有效果，甚至會降低可見度，顯示 SEO 策略不能直接移植到 AI 搜尋情境（pp. 11, 13）。
- 在內容中加入可信來源的引用、引述與具體統計數據，是提升生成式引擎可見度最有效的策略，可見度相對提升可達約 40%（p. 10）。
- GEO 對原本搜尋排名較低的網站幫助更大，作者認為這可能讓小型創作者與獨立商家有機會與大企業競爭曝光（p. 12）。
- 不同領域適合的優化策略不同，內容優化應依目標領域調整（p. 11）。

## 對我論文的啟發

（AI 草擬，待確認）

- **可借用的依變數**：「品牌／商品在 AI 回答中的可見度」可作為電商 × AI 研究的新結果變數，直接借用本文的 Position-Adjusted Word Count 與 Subjective Impression 定義來操作化。
- **可對應到電商內容的自變數**：商品頁加入具體規格數據或銷售／評價統計（對應 Statistics Addition）、第三方評測或權威來源（Cite Sources）、顧客評論引述（Quotation Addition），檢驗哪些元素會讓商品更常被 AI 購物助理推薦。
- **研究缺口**：GEO-bench 以資訊型查詢為主，交易型查詢只占 10%，購物情境（如「推薦 3000 元以下的降噪耳機」）尚未被系統性研究，可作為我論文的切入點。
- **可借用的實驗設計**：只修改一個來源、其他來源不變的控制方式；多次抽樣（temperature 0.7、5 次）降低生成隨機性；以相對提升百分比比較策略效果。
- **可延伸到消費者端**：本文只測曝光，未測使用者反應；可結合 TAM 或信任相關理論，探討「被 AI 推薦」是否進一步影響消費者的信任與購買意圖。
