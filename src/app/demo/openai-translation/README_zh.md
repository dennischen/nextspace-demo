# OpenAI 的多語言 Markdown 翻譯

[Youtube上的影片](https://youtu.be/8sY2eof_tN0)

## 前文

本程式展示使用Abrotable Sequential Process(Nextspace Utiltiy)來呼叫OpenAI的Chat.Completion API來翻譯文件(在這個展示網站中的多語文件也主要是靠OpenAI作第一次翻譯，再經由人員校稿)。

使用現在的ChatGPT使用介面來進行翻譯已經可以作到小幅的翻譯，但要進行大量批次的翻譯會有不少問題，例如:
 * 文本太長會被截斷，要手動截斷。
 * 翻譯完的文本要一段一段手動匯出。
 * Markdown結果格式會被使用介面轉換成HTML，要手動匯出很難。

我選中的文件格示為較昜作前處理、也是目前在IT界歡迎的Markdown格式，因為OpenAI在各版本中皆有每次呼叫時的Token最大數的限制，當你單純的把整份文字丟給OpenAI後，超過最大限制的Token將被乎略，所以在翻譯時，本程式每先前處理文件，將文件切成小段落(利用[`marked`](https://www.npmjs.com/package/marked)的格式規範, e.g. 'heading', 'paragraph', 'list', 'table')，再將每個段落依序傳送給OpenAI(paragraph若仍超過最大數量應要再進行切，這個細節處理目前例在TODO中)。

因為使用OpenAI的API是需要Key跟花費金錢的，所以要使用本程式，你必需要提供一組你的OpenAI的key，你可以在[API keys](https://platform.openai.com/api-keys)申請。(本程式不會儲存這個key，所有的翻譯過程也是由你的瀏覽器直接跟OpenAI溝通，若你仍擔心，可建立暫用的key，並在使用本程式後刪除)

## 操作選項說明

 1. 填入你的API Key。
 2. 選擇目標語言 (若目標語言不在清單中，請使用`自定指令`功能)。
 3. 將你的Markdown文貼進`Markdown`文字輸入區塊，點擊`翻譯`。
 4. 等待翻釋進行及完成後，將`翻譯完的Markdown`全選複製匯出。
 5. 你在可在翻譯進行中途`中止`翻譯，已翻完的部份仍會被更新。
 6. 你可以開啟`預覽HTML`來預覽Markdown轉換成HTML的結果。
 
## 進階選項說明

 * `GPT模型`: 使用API時選定的GPT模型，這會關系到精準度，單次TOKEN最大數量及費用，
 * `會話`: 是否要將本次的翻譯的每一段翻譯串接給OpenAI，或是每次都單獨執行。啟用會話選項翻譯結果前後文會較一致，但花費的總Token會較高(ChatGPT官方就是使用這種方式，每次都是回傳歷史的所有內容，所以它才會記得你聊天室之前提的內容來回答，但Token也會一次一次的疊加)
 * `自定指令`: 你可以自定指令來作法翻譯的系統角色Prompt，若你的目標語言不在本程式提供的選單中，你可以使用自字指令來改你要翻譯的目標語言

## 免責說明

 * 程式原始碼可在[OpenAI Translation](https://github.com/dennischen/nextspace-demo/tree/master/src/app/demo/openai-translation)中取得，處理邏輯也很簡單，主要是整合我的翻譯需求及補足ChatGPT系統中的不足。
 * 翻譯的質量仍是依靠OpenAI的Chat.Completion API的結果，各種翻譯錯誤仍需靠人類來校正，本程式不負擔任何責任喲。
