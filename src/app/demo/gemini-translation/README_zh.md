# Gemini 的多語言 Markdown 翻譯

[Youtube上的影片](https://youtu.be/8sY2eof_tN0)

## 前文

本程式展示使用Gemini的API來翻譯Markdown，主要是要跟另一個[OpenAI翻譯的範例](./openai-translation)作對比。
在UI的處理的程式大部份都一樣，只有在呼叫API時及處理建構Pormpt的方式不同。(在本展示的多語文件是靠Gemini作第一次翻譯，再經由人員校稿)。

使用Google AI Studio作翻譯的問題比ChatGPT小很多(主要還是raw markdown輸出)，但介面使用較工程師化，門檻較高，不貼近一般使用者。
而若前處理作markdown文本切割，不知道是不是單次翻譯資料量太小，導致無法得到正確的翻譯結果，會產生過多不必要的AI廢言，就算利用chat history的方式仍無法解決。
所以這裏的實作只能一次性的丟給Gemini來得到正確的結果，因此無法提供可中止翻譯的功能。

因為使用Gemini的API是需要Key跟花費金錢的，所以要使用本程式，你必需要提供一組你的Gemini的key，你可以在[API keys](https://makersuite.google.com/app/apikey)申請。(本程式不會儲存這個key，所有的翻譯過程也是由你的瀏覽器直接跟Gemini溝通，若你仍擔心，可建立暫用的key，並在使用本程式後刪除)

## 操作選項說明

 1. 填入你的API Key。
 2. 選擇目標語言 (若目標語言不在清單中，請使用`自定指令`功能)。
 3. 將你的Markdown文貼進`Markdown`文字輸入區塊，點擊`翻譯`。
 4. 等待翻釋進行及完成後，將`翻譯完的Markdown`全選複製匯出。
 5. 你在可在翻譯進行中途`中止`翻譯，已翻完的部份仍會被更新。
 6. 你可以開啟`預覽HTML`來預覽Markdown轉換成HTML的結果。
 
## 進階選項說明

 * `模型`: 使用API時選定的模型。
 <!-- * `會話`: 是否要將本次的翻譯的每一段翻譯串接給Gemini，或是每次都單獨執行。啟用會話選項翻譯結果前後文會較一致，但花費的總Token會較高(Gemini要達成Chat，都同都要每次都是回傳歷史的所有內容，這樣它才會記得你聊天室之前提的內容來回答，當然Token也會一次一次的疊加) -->
 * `自定指令`: 你可以自定指令來作法翻譯的初始Prompt，若你的目標語言不在本程式提供的選單中，你可以使用自字指令來改你要翻譯的目標語言

## 免責說明

 * 程式原始碼可在[Gemini Translation](https://github.com/dennischen/nextspace-demo/tree/master/src/app/demo/gemini-translation)中取得。
 * 翻譯的質量仍是依靠Gemini的API的結果，各種翻譯錯誤仍需靠人類來校正，本程式不負擔任何責任喲。
