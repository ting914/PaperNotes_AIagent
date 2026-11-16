# 論文筆記站

碩士論文文獻回顧用的論文筆記網站，一篇論文一頁，方便撰寫第二章（文獻探討）時回查、比較與引用。研究方向：電商 × AI。

## 技術

- 純 HTML / CSS / 少量原生 JavaScript，不使用框架或建置工具。
- 部署於 GitHub Pages（`main` 分支 / root）。

## 資料夾

| 路徑 | 說明 |
|---|---|
| `index.html` | 首頁，讀取 `data/notes.json` 自動產生精簡列表，含搜尋、排序與標籤篩選 |
| `assets/style.css` | 全站樣式（森林綠配色） |
| `assets/note.js` | 筆記頁右側抽屜選單（本篇目錄、所有筆記） |
| `data/notes.json` | 筆記清單，每篇論文一筆 |
| `drafts/<slug>.md` | 每篇筆記的 Markdown 草稿 |
| `notes/<slug>.html` | 每篇筆記的網頁 |
| `templates/` | 草稿與筆記頁模板 |

## 新增筆記

1. 複製 `templates/draft-template.md` 為 `drafts/<slug>.md` 並填寫。
2. 複製 `templates/note-template.html` 為 `notes/<slug>.html`，填入草稿內容。
3. 在 `data/notes.json` 陣列末尾加入一筆資料。

slug 格式：`第一作者姓氏-年份-關鍵字`（小寫英文、數字、連字號），例如 `davis-1989-tam`。

詳細規則見 [CLAUDE.md](CLAUDE.md)。

## 本機預覽

```bash
python3 -m http.server 8000
```

開啟 <http://localhost:8000>。
