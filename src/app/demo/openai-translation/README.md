# Multilingual Markdown Translation of OpenAI

[Demo video on Youtube](https://youtu.be/8sY2eof_tN0)

## Introduction
This program demonstrates the use of Abrotable Sequential Process (Nextspace Utility) to call OpenAI's Chat.Completion API to translate documents (the multilingual documents on this demonstration site are mainly translated by OpenAI for the first time, and then revised by staff).


Using the current ChatGPT interface for translation can achieve small translations, but there are several problems when handling large batch translations, for example:
 * Text that is too long will be truncated and need to be split manually.
 * Translated text has to be exported manually in sections.
 * Markdown result format is converted to HTML by the user interface, making manual export difficult.


The document format I have chosen is the Markdown format, which is easy to pre-process and popular in the IT industry. Since OpenAI has a maximum token limit for each call in all versions, if you simply throw the entire text to OpenAI, any tokens exceeding the maximum limit will be ignored. Therefore, before translation, this program first preprocesses the document, breaks it into small sections (using [`marked`](https://www.npmjs.com/package/marked) format specifications, e.g., 'heading', 'paragraph', 'list', 'table'), and then sends each section to OpenAI in sequence (if a paragraph still exceeds the maximum number, it should be split again - this detail processing is currently on the TODO list).


As the use of OpenAI's API requires a key and incurs a cost, to use this program, you must provide your OpenAI key. You can apply for it at [API keys](https://platform.openai.com/api-keys). (This program does not store this key, and all the translation process is directly communicated between your browser and OpenAI. If you are still concerned, you can create a temporary key and delete it after using this program.)


## Explanation of Operation Options
 1. Enter your API Key.
 2. Select the target language (if the target language is not in the list, please use the `custom instruction` feature).
 3. Paste your Markdown text into the `Markdown` text input area and click `Translate`.
 4. After waiting for the translation to complete, select/copy all of the `translated Markdown` for export.
 5. You can `abort` the translation process at any time, and the parts that have already been translated will still be updated.
 6. You can open `Preview HTML` to preview the result of Markdown converted to HTML.

 
## Advanced Options Explanation
 * `GPT Model`: The GPT model selected when using the API affects the accuracy, the maximum number of tokens per transaction, and the cost.
 * `Conversation`: Determines whether every part of this translation should be connected to OpenAI or executed separately each time. Enabling the conversation option provides more consistent context for translation, but the total token cost will be higher (this is how ChatGPT operates, sending all historical content each time, so it remembers previous chat room content for responses, but tokens also accumulate each time).
 * `Custom Instructions`: You can customize instructions for the system role prompt for the translation. If your target language is not provided in the program's dropdown, you can use the custom instructions to change the target language of your translation.


## Disclaimer
 * The source code of the program can be found at [OpenAI Translation](https://github.com/dennischen/nextspace-demo/tree/master/src/app/demo/openai-translation). The processing logic is straightforward, mainly integrating my translation requirements and filling gaps in the ChatGPT.
 * The quality of the translation results still relies on the results of OpenAI's Chat.Completion API. Various translation errors still need to be corrected by humans. This program does not bear any responsibility.
