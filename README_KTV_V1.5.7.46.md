# WATCH_VIDEOtu V1.5.7.46 — 手機錄影與相簿流程修正

- 手機開始錄製時，自動進入網站內沉浸式全螢幕；錄製完成自動恢復並開啟預覽（不會強制觸發 iOS 原生全螢幕，因 Safari 有限制）。
- 手機預設使用自拍鏡頭，直接錄製攝影機與原生麥克風串流，避免 AudioContext 合成導致部分 Safari 沒有影片資料。
- 調整錄影 MP4 格式優先序、MediaRecorder 分段輸出。
- 手機「儲存至相簿」使用 iOS/Android 原生分享選單；作業系統不允許網頁不經確認自動寫入相簿。
- 我的作品關閉後返回 KTV，歌詞及錄後視窗狀態清理。
- 原有電腦分頁錄影流程保留不變。

注意：iPhone 實機的 MediaRecorder 編碼支援情況無法在此執行環境驗證；若仍為 0 bytes，請提供 Safari/iOS 版本。背景照片或漸層在 Safari 仍有 Canvas.captureStream 兼容限制。
