# Pinyin to Ukrainian Web Annotator

A set of browser tools to facilitate learning Chinese for Ukrainian speakers. This project automatically converts Pinyin annotations on web pages into the **Ukrainian Academic Transcription** system (Krymsky Institute of Oriental Studies).

It works in conjunction with the [Pinyin Annotator](https://chromewebstore.google.com/detail/pinyin-annotator/jbedjnkbkklcffefhmhadejccadkinjn) extension (or any extension that uses HTML5 `<ruby>` and `<rt>` tags).

## Features

-   **Automatic Transliteration**: Detects Pinyin in `<rt>` tags and converts it to Ukrainian immediately.
-   **Academic Standard**: Uses the official Academic transcription system (not the Palladium system used in Russian).
-   **Visual Improvements**: Custom CSS to make the annotation text readable and distinct from the Hanzi characters.
-   **Hover Support**: Hovering over the Ukrainian text reveals the original Pinyin.

## Installation

### Prerequisites
You need a browser (Chrome, Edge, Firefox, etc.) and the following extensions:
1.  **Pinyin Annotator** (or similar) - To generate the Pinyin ruby text.
2.  **Tampermonkey** - To run the translation script.
3.  **Stylus** - To apply the visual improvements.

### Step 1: The Userscript (Translation)
1.  Click on the `Tampermonkey` icon and select "Create a new script".
2.  Copy the content of [userscript/pinyin-to-ukr.user.js](./userscript/pinyin-to-ukr.user.js).
3.  Paste it into the editor and hit `Ctrl+S` to save.

### Step 2: The Styles (CSS)
1.  Click on the `Stylus` icon and select "Write new style".
2.  Copy the content of [styles/improved-pinyin.css](./styles/improved-pinyin.css).
3.  Paste it into the editor.
4.  Give it a name (e.g., "Pinyin Tweaks") and save.

## How it Works

The script uses a `MutationObserver` to watch the webpage. Whenever the *Pinyin Annotator* extension injects `<ruby>` tags into the DOM, this script intercepts the `<rt>` (ruby text) tags, looks up the syllable in a pre-compiled dictionary, and replaces the text with the Ukrainian equivalent.

### Dictionary Generation
The translation map is generated programmatically from the Ukrainian Wikipedia comparison table.
-   **Source**: `tools/wiki.txt` (Raw MediaWiki table syntax).
-   **Generator**: `tools/parse.py` (Python script).

If you want to regenerate the map (e.g., to switch to the Kirnosova-Tsisar system):
1.  Update `tools/wiki.txt`.
2.  Run `python tools/parse.py`.
3.  Copy the output into the Userscript.

## Transcription Reference
This project uses the **Academic System** (Академічна система транскрибування китайських слів).

| Pinyin | Ukrainian | Example |
| :--- | :--- | :--- |
| **ji** | **цзі** | 几 |
| **xi** | **сі** | 西 |
| **ri** | **жи** | 日 |
| **hui** | **хуей** | 会 |

## License
MIT License