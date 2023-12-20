# Gemini Multi-Language Markdown Translation

[Video on Youtube](https://youtu.be/8sY2eof_tN0)

## Introduction

This app demonstrates the use of Gemini API for markdown translation. It is intended to compare with another [OpenAI translation demo](./openai-translation).

Most of the UI handling is the same; the difference is mainly in the API call and how the prompt is constructed. (The multilingual document in this demo is translated by Gemini first, then proofread manually).

Translating with Google AI Studio suffers less from the problem of ChatGPT (mainly raw markdown output). However, its interface is more engineer-centric and less user-friendly.

If we pre-process to split the markdown text, it seems that the amount of data translated each time is too small to produce a good enough translation. The AI tends to generate too much unnecessary gibberish, and even the chat history method cannot solve this problem. Therefore, in this implementation, we can only pass the entire markdown document to Gemini at once to get a correct result, so there is no way to cancel the translation in the middle.

Since using Gemini's API requires a key and costs money, you need to provide your own Gemini key to use this app. You can apply for one at [API keys](https://makersuite.google.com/app/apikey). (This app will not store your key, and all translations are done directly between your browser and Gemini. If you are still concerned, you can create a temporary key and delete it after using this app.)

## Operation Guide

1. Fill in your API key.
2. Select the target language (if your target language is not on the list, use the `Custom instruction` function).
3. Paste your Markdown text into the `Markdown` textarea and click `Translate`.
4. Wait for the translation to complete, and then select and copy the entire `Translated markdown`.
5. You can `Abort` the translation in the middle, and the completed part will still be updated.
6. You can turn on `Preview HTML` to preview the result of Markdown converted to HTML.

## Advanced Options

* `Model`: The model for using the API.
<!-- * `Conversation`: Whether to concatenate each translation of the current translation to Gemini or execute it separately each time. Enabling the conversation option will make the translation context more consistent, but the total token cost will be higher (Gemini has to return all the historical content each time to achieve chat. In this way, it can remember the content you previously mentioned in the chat room and answer accordingly. Of course, tokens will also accumulate one by one.) -->
* `Custom instruction`: You can customize the instruction for translation. If your target language is not available in the list provided by this app, you can use the custom instruction to change the target language.

## Disclaimer

* The source code of the app can be found at [Gemini Translation](https://github.com/dennischen/nextspace-demo/tree/master/src/app/demo/gemini-translation).
* The quality of the translation still depends on the result of the Gemini API. All kinds of translation errors still need to be corrected by humans. This app does not bear any responsibility.