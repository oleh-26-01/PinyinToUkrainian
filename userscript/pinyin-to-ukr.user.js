// ==UserScript==
// @name         Pinyin to Ukrainian (Wiki Academic + Toucan support)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Converts Pinyin to Ukrainian with correct alignment, greedy segmentation, and tooltips
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Generated from wiki.txt "Академічна" column
    const pinyinMap = {
        'a': 'а', 'ai': 'ай', 'an': 'ань', 'ang': 'ан', 'ao': 'ао',
        'ba': 'ба', 'bai': 'бай', 'ban': 'бань', 'bang': 'бан', 'bao': 'бао', 'bei': 'бей', 'ben': 'бень', 'beng': 'бен', 'bi': 'бі', 'bian': 'бянь', 'biao': 'бяо', 'bie': 'бє', 'bin': 'бінь', 'bing': 'бін', 'bo': 'бо', 'bu': 'бу',
        'ca': 'ца', 'cai': 'цай', 'can': 'цань', 'cang': 'цан', 'cao': 'цао', 'ce': 'це', 'cen': 'цень', 'ceng': 'цен', 'cha': 'ча', 'chai': 'чай', 'chan': 'чань', 'chang': 'чан', 'chao': 'чао', 'che': 'че', 'chen': 'чень', 'cheng': 'чен', 'chi': 'чи', 'chong': 'чун', 'chou': 'чоу', 'chu': 'чу', 'chua': 'чуа', 'chuai': 'чуай', 'chuan': 'чуань', 'chuang': 'чуан', 'chui': 'чуй', 'chun': 'чунь', 'chuo': 'чо', 'ci': 'ци', 'cong': 'цун', 'cou': 'цоу', 'cu': 'цу', 'cuan': 'цуань', 'cui': 'цуй', 'cun': 'цунь', 'cuo': 'цо',
        'da': 'да', 'dai': 'дай', 'dan': 'дань', 'dang': 'дан', 'dao': 'дао', 'de': 'де', 'dei': 'дей', 'den': 'день', 'deng': 'ден', 'di': 'ді', 'dia': 'дя', 'dian': 'дянь', 'diang': 'дян', 'diao': 'дяо', 'die': 'дє', 'ding': 'дін', 'diu': 'дю', 'dong': 'дун', 'dou': 'доу', 'du': 'ду', 'duan': 'дуань', 'dui': 'дуй', 'dun': 'дунь', 'duo': 'до',
        'e': 'е', 'ei': 'ей', 'en': 'ень', 'eng': 'ен', 'er': 'ер',
        'fa': 'фа', 'fan': 'фань', 'fang': 'фан', 'fei': 'фей', 'fen': 'фень', 'feng': 'фен', 'fo': 'фо', 'fou': 'фоу', 'fu': 'фу',
        'ga': 'ґа', 'gai': 'ґай', 'gan': 'ґань', 'gang': 'ґан', 'gao': 'ґао', 'ge': 'ґе', 'gei': 'ґей', 'gen': 'ґень', 'geng': 'ґен', 'gong': 'ґун', 'gou': 'ґоу', 'gu': 'ґу', 'gua': 'ґуа', 'guai': 'ґуай', 'guan': 'ґуань', 'guang': 'ґуан', 'gui': 'ґуй', 'gun': 'ґунь', 'guo': 'ґо',
        'ha': 'ха', 'hai': 'хай', 'han': 'хань', 'hang': 'хан', 'hao': 'хао', 'he': 'хе', 'hei': 'хей', 'hen': 'хень', 'heng': 'хен', 'hm': 'хм', 'hng': 'хн', 'hong': 'хун', 'hou': 'хоу', 'hu': 'ху', 'hua': 'хуа', 'huai': 'хуай', 'huan': 'хуань', 'huang': 'хуан', 'hui': 'хуей', 'hun': 'хунь', 'huo': 'хо',
        'ji': 'цзі', 'jia': 'цзя', 'jian': 'цзянь', 'jiang': 'цзян', 'jiao': 'цзяо', 'jie': 'цзє', 'jin': 'цзінь', 'jing': 'цзін', 'jiong': 'цзюн', 'jiu': 'цзю', 'ju': 'цзюй', 'juan': 'цзюань', 'jue': 'цзюе', 'jun': 'цзюнь',
        'ka': 'ка', 'kai': 'кай', 'kan': 'кань', 'kang': 'кан', 'kao': 'као', 'ke': 'ке', 'kei': 'кей', 'ken': 'кень', 'keng': 'кен', 'kong': 'кун', 'kou': 'коу', 'ku': 'ку', 'kua': 'куа', 'kuai': 'куай', 'kuan': 'куань', 'kuang': 'куан', 'kui': 'куй', 'kun': 'кунь', 'kuo': 'ко',
        'la': 'ла', 'lai': 'лай', 'lan': 'лань', 'lang': 'лан', 'lao': 'лао', 'le': 'ле', 'lei': 'лей', 'leng': 'лен', 'li': 'лі', 'lia': 'ля', 'lian': 'лянь', 'liang': 'лян', 'liao': 'ляо', 'lie': 'лє', 'lin': 'лінь', 'ling': 'лін', 'liu': 'лю', 'lo': 'ло', 'long': 'лун', 'lou': 'лоу', 'lu': 'лу', 'luan': 'луань', 'lun': 'лунь', 'luo': 'ло', 'lü': 'люй', 'lüe': 'люe', 'lün': 'люнь',
        'm': 'м', 'ma': 'ма', 'mai': 'май', 'man': 'мань', 'mang': 'ман', 'mao': 'мао', 'me': 'ме', 'mei': 'мей', 'men': 'мень', 'meng': 'мен', 'mi': 'мі', 'mian': 'мянь', 'miao': 'мяо', 'mie': 'мє', 'min': 'мінь', 'ming': 'мін', 'miu': 'мю', 'mm': 'мм', 'mo': 'мо', 'mou': 'моу', 'mu': 'му',
        'n': 'н', 'na': 'на', 'nai': 'най', 'nan': 'нань', 'nang': 'нан', 'nao': 'нао', 'ne': 'не', 'nei': 'ней', 'nen': 'нень', 'neng': 'нен', 'ng': 'нг', 'ni': 'ні', 'nia': 'ня', 'nian': 'нянь', 'niang': 'нян', 'niao': 'няо', 'nie': 'нє', 'nin': 'нінь', 'ning': 'нін', 'niu': 'ню', 'nong': 'нун', 'nou': 'ноу', 'nu': 'ну', 'nuan': 'наунь', 'nun': 'нунь', 'nuo': 'но', 'nü': 'нюй', 'nüe': 'нюе',
        'o': 'о', 'ou': 'оу',
        'pa': 'па', 'pai': 'пай', 'pan': 'пань', 'pang': 'пан', 'pao': 'пао', 'pei': 'пей', 'pen': 'пень', 'peng': 'пен', 'pi': 'пі', 'pian': 'пянь', 'piao': 'пяо', 'pie': 'пє', 'pin': 'пінь', 'ping': 'пін', 'po': 'по', 'pou': 'поу', 'pu': 'пу',
        'qi': 'ці', 'qia': 'ця', 'qian': 'цянь', 'qiang': 'цян', 'qiao': 'цяо', 'qie': 'цє', 'qin': 'цінь', 'qing': 'цін', 'qiong': 'цюн', 'qiu': 'цю', 'qu': 'цюй', 'quan': 'цюань', 'que': 'цюе', 'qun': 'цюнь',
        'ran': 'жань', 'rang': 'жан', 'rao': 'жао', 're': 'же', 'ren': 'жень', 'reng': 'жен', 'ri': 'жи', 'rong': 'жун', 'rou': 'жоу', 'ru': 'жу', 'ruan': 'жуань', 'rui': 'жуй', 'run': 'жунь', 'ruo': 'жо',
        'sa': 'са', 'sai': 'сай', 'san': 'сань', 'sang': 'сан', 'sao': 'сао', 'se': 'се', 'sei': 'сей', 'sen': 'сень', 'seng': 'сен', 'sha': 'ша', 'shai': 'шай', 'shan': 'шань', 'shang': 'шан', 'shao': 'шао', 'she': 'ше', 'shei': 'шей', 'shen': 'шень', 'sheng': 'шен', 'shi': 'ши', 'shou': 'шоу', 'shu': 'шу', 'shua': 'шуа', 'shuai': 'шуай', 'shuan': 'шуань', 'shuang': 'шуан', 'shui': 'шуй', 'shun': 'шунь', 'shuo': 'шо', 'si': 'си', 'song': 'сун', 'sou': 'соу', 'su': 'су', 'suan': 'суань', 'sui': 'суй', 'sun': 'сунь', 'suo': 'со',
        'ta': 'та', 'tai': 'тай', 'tan': 'тань', 'tang': 'тан', 'tao': 'тао', 'te': 'те', 'ten': 'тень', 'teng': 'тен', 'ti': 'ті', 'tian': 'тянь', 'tiao': 'тяо', 'tie': 'тє', 'ting': 'тін', 'tong': 'тун', 'tou': 'тоу', 'tu': 'ту', 'tuan': 'туань', 'tui': 'туй', 'tun': 'тунь', 'tuo': 'то',
        'wa': 'ва', 'wai': 'вай', 'wan': 'вань', 'wang': 'ван', 'wei': 'вей', 'wen': 'вень', 'weng': 'вен', 'wo': 'во', 'wu': 'у',
        'xi': 'сі', 'xia': 'ся', 'xian': 'сянь', 'xiang': 'сян', 'xiao': 'сяо', 'xie': 'сє', 'xin': 'сінь', 'xing': 'сін', 'xiong': 'сюн', 'xiu': 'сю', 'xu': 'сюй', 'xuan': 'сюань', 'xue': 'сюе', 'xun': 'сюнь',
        'ya': 'я', 'yan': 'янь', 'yang': 'ян', 'yao': 'яо', 'ye': 'є', 'yi': 'ї', 'yin': 'їнь', 'ying': 'їн', 'yo': 'йо', 'yong': 'юн', 'you': 'ю', 'yu': 'юй', 'yuan': 'юань', 'yue': 'юе', 'yun': 'юнь',
        'za': 'цза', 'zai': 'цзай', 'zan': 'цзань', 'zang': 'цзан', 'zao': 'цзао', 'ze': 'цзе', 'zei': 'цзей', 'zen': 'цзень', 'zeng': 'цзен', 'zha': 'чжа', 'zhai': 'чжай', 'zhan': 'чжань', 'zhang': 'чжан', 'zhao': 'чжао', 'zhe': 'чже', 'zhei': 'чжей', 'zhen': 'чжень', 'zheng': 'чжен', 'zhi': 'чжи', 'zhong': 'чжун', 'zhou': 'чжоу', 'zhu': 'чжу', 'zhua': 'чжуа', 'zhuai': 'чжуай', 'zhuan': 'чжуань', 'zhuang': 'чжуан', 'zhui': 'чжуй', 'zhun': 'чжунь', 'zhuo': 'чжо', 'zi': 'цзи', 'zong': 'цзун', 'zou': 'цзоу', 'zu': 'цзу', 'zuan': 'цзуань', 'zui': 'цзуй', 'zun': 'цзунь', 'zuo': 'цзо',
    };

    const sortedKeys = Object.keys(pinyinMap).sort((a, b) => b.length - a.length);

    // --- Helpers ---

    const normalizePinyin = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };

    const matchCase = (original, translated) => {
        if (original && original[0] === original[0].toUpperCase()) {
            return translated.charAt(0).toUpperCase() + translated.slice(1);
        }
        return translated;
    };

    const translateWord = (word) => {
        const cleanWord = normalizePinyin(word);

        if (pinyinMap[cleanWord]) {
            return matchCase(word, pinyinMap[cleanWord]);
        }

        let remaining = cleanWord;
        let result = [];
        let failed = false;

        while (remaining.length > 0) {
            let matchFound = false;
            for (const key of sortedKeys) {
                if (remaining.startsWith(key)) {
                    result.push(pinyinMap[key]);
                    remaining = remaining.slice(key.length);
                    if (remaining.startsWith("'")) remaining = remaining.slice(1);
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                failed = true;
                break;
            }
        }

        if (!failed && result.length > 0) {
            let translatedStr = result.join(' ');
            return matchCase(word, translatedStr);
        }

        return word;
    };

    const convertPinyinString = (text) => {
        return text.split(/\s+/).map(word => translateWord(word)).join(' ');
    };

    // --- Processors ---

    const processRt = (rtNode) => {
        if (rtNode.dataset.ukrProcessed) return;
        const originalText = rtNode.innerText;
        if (!originalText) return;

        const translated = translateWord(originalText);
        if (translated !== originalText) {
            rtNode.innerText = translated;
            rtNode.dataset.ukrProcessed = "true";
            rtNode.title = originalText;
        }
    };

    const processToucanNode = (toucanHost) => {
        if (toucanHost.dataset.ukrProcessed) return;

        const shadow = toucanHost.shadowRoot;
        if (!shadow) return;

        const injectStyles = () => {
            if (shadow.getElementById('ukr-pinyin-styles')) return;

            const style = document.createElement('style');
            style.id = 'ukr-pinyin-styles';
            style.textContent = `
                /* Use inline-grid to size container to the widest text (original vs new) */
                #inline-translation-highlight, .inline-translation-highlight {
                    display: inline-grid !important;
                    vertical-align: baseline !important;
                    text-decoration: none !important;
                }

                /* Hide original text visually, but keep it in the DOM for logic */
                #inline-translation-highlight > *, .inline-translation-highlight > * {
                    grid-area: 1 / 1;
                    opacity: 0 !important;
                    pointer-events: auto;
                }

                /* Display Ukrainian text via pseudo-element */
                #inline-translation-highlight::after, .inline-translation-highlight::after {
                    content: attr(data-ukr);
                    grid-area: 1 / 1;
                    pointer-events: none;
                    text-align: center;
                    white-space: nowrap;
                    
                    /* FIX: Inherit color from Toucan's container instead of forcing dark grey */
                    color: inherit !important; 
                    font-weight: inherit !important;
                    font-style: inherit !important;
                }
            `;
            shadow.appendChild(style);
        };

        const translateToucanContent = () => {
            const textContainer = shadow.getElementById('inline-translation-highlight') ||
                                  shadow.querySelector('.tou-body') ||
                                  shadow.querySelector('.inline-translation-highlight');

            if (textContainer && textContainer.innerText) {
                const originalText = textContainer.innerText.trim();

                if (/[a-zA-Z]/.test(originalText)) {
                    if (textContainer.getAttribute('data-ukr-source') === originalText) return;

                    const translatedText = convertPinyinString(originalText);

                    if (translatedText !== originalText) {
                        textContainer.setAttribute('data-ukr', translatedText);
                        textContainer.setAttribute('data-ukr-source', originalText);

                        // Set title for native browser tooltip (Alt Text) on hover
                        textContainer.title = originalText;

                        injectStyles();
                        toucanHost.dataset.ukrProcessed = "true";
                    }
                }
            }
        };

        translateToucanContent();

        const shadowObserver = new MutationObserver(() => {
            translateToucanContent();
        });

        shadowObserver.observe(shadow, { childList: true, subtree: true, characterData: true });
    };

    // --- Main Observer ---

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.tagName === 'RT') {
                        processRt(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('rt').forEach(processRt);
                    }

                    if (node.classList && node.classList.contains('tou-node')) {
                        processToucanNode(node);
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();