FamilyTube V1.0
================
用途：家庭 / 兒童使用的 YouTube 嵌入式播放器介面。

上傳 GitHub Pages：
1. 建立新的 GitHub repository。
2. 把本資料夾全部檔案上傳到 repository 根目錄。
3. GitHub → Settings → Pages。
4. Source 選 Deploy from a branch。
5. Branch 選 main / root，儲存。
6. 用 GitHub Pages 網址在 iPad Safari 開啟。
7. Safari 分享 → 加入主畫面。

使用：
- 點「＋」貼入 YouTube 網址。
- 可設定影片名稱、分類。
- 影片資料存在該裝置瀏覽器 localStorage。
- 可匯出 / 匯入 JSON 備份影片清單。
- YouTube 影片本體必須連網，離線快取不包含 YouTube 影片。

注意：
- 本系統使用 YouTube 官方 IFrame Player API，不能移除 YouTube 廣告或規避平台限制。
- 某些影片若發布者禁止外部嵌入，會無法在本播放器播放。


【重要：YouTube 錯誤 153】
YouTube 現在要求嵌入播放器帶有網站來源識別（HTTP Referer / client identity）。
請勿直接雙擊 index.html 以 file:// 方式播放。
請上傳到 GitHub Pages，並從 https://你的帳號.github.io/你的專案/ 開啟。
V1.0.1 已加入 strict-origin-when-cross-origin 與動態 origin，並在本機檔案模式直接提示原因。
