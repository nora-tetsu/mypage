
const getToNgram = (text: string, n = 3) => {
    const ret: { [key: string]: number } = {};
    for (let m = 0; m < n; m++) {
        for (let i = 0; i < text.length - m; i++) {
            const c = text.substring(i, i + m + 1);
            ret[c] = ret[c] ? ret[c] + 1 : 1;
        }
    }
    return ret;
};

// valueが数値のobjectの数値の和を求める関数。
const getValuesSum = (object: { [key: string]: number }) => {
    return Object.values(object).reduce((prev, current) => prev + current, 0);
};

export const calcSentenceSimilarity = (a: string, b: string) => {
    const aGram = getToNgram(a);
    const bGram = getToNgram(b);
    const keyOfAGram = Object.keys(aGram);
    const keyOfBGram = Object.keys(bGram);
    // aGramとbGramに共通するN-gramのkeyの配列
    const abKey = keyOfAGram.filter((n) => keyOfBGram.includes(n));

    // aGramとbGramの内積(0と1の掛け算のため、小さいほうの値を足し算すれば終わる。)
    const dot = abKey.reduce(
        (prev, key) => prev + Math.min(aGram[key], bGram[key]),
        0
    );

    // 長さの積(平方根の積は積の平方根)
    const abLengthMul = Math.sqrt(getValuesSum(aGram) * getValuesSum(bGram));
    return dot / abLengthMul;
};
/*
const result = map.map(data=>{
    return {
        title: data.title,
        calc: calculate(map[14].text,data.text),
    }
});
result.sort((a,b)=>b.calc - a.calc);
for (let i = 0; i < 10; i++) {
    console.log(result[i]);
}
*/



// https://www.bugbugnow.net/2020/02/Measure-string-similarity-with-ngram.html
// N-gram化する
const ngramify = function (text: string, set?: Set<string>, n?: number, padding?: string) {
    n = n != null ? n : 3;
    if (text.length < n) {
        padding = padding != null ? padding : ' ';
        text = text + Array(n - text.length + 1).join(padding);
    }

    if (n == 1 && !set) {
        set = new Set(text);
    } else {
        set = set || new Set();
        for (let i = text.length - n + 1; i--;) {
            set.add(text.substring(i, i + n));
        }
    }
    return set;
};

// 3文字づつに分解する
export const trigramify = function (text: string, set?: Set<string>) {
    text = '  ' + text.toLowerCase() + '  ';
    set = set || new Set();
    for (let i = text.length - 2; i--;) {
        set.add(text.substring(i, i + 3));
    }
    return set;
    // trigramify("太郎さんへのgiftです。");
    // ["。  ", "す。 ", "です。", "tです", "ftで", "ift", "gif", "のgi", "へのg", "んへの", "さんへ", "郎さん", "太郎さ", " 太郎", "  太"]
};

// 英語（半角スペース区切り文字）を分割 + 全角文字3文字づつ分解する
// see https://www.bugbugnow.net/2020/02/English-simple-separation.html
const engramify = function (text: string, set?: Set<string>) {
    set = set || new Set();
    const re = /[A-Z]+[a-z]*|[A-Z]*[a-z]+|'[A-Z]*[a-z]*|[0-9]+|[^A-Za-z0-9'"!\?\-:;,\.\s]+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        if (m[0].charCodeAt(0) <= 0xFE) {
            set.add(m[0].toLowerCase());
        } else {
            trigramify(m[0], set);
        }
    }
    return set;
    // engramify("It's a GiftCode for Mr. 太郎. 太郎のGIFTCodeです。");
    // ["it", "'s", "a", "gift", "code", "for", "mr", "郎  ", "太郎 ", " 太郎", "  太", "の  ", "への ", "んへの", "さんへ", "郎さん", "giftcode", "。  ", "す。", "です。", " です", "  で"]
};

// ngramify, trigram, engramifyの関連度を計算する
export const relevance = function (set1: Set<string>, set2: Set<string>) {
    let count = 0;
    set2.forEach(function (value) {
        if (set1.has(value)) {
            count = count + 1;
        }
    });
    return count / (set1.size + set2.size - count);
    // count: 一致数
    // set1.size + set2.size - count: チェック数
    // return: 0-1 (0: 不一致, 1:一致(完全一致とは限らない))
    // 第二引数が小さい方が高速に動作する(set1.size > set2.size)
};

export function calcTrigram(text1: string, text2: string) {
    return relevance(trigramify(text1), trigramify(text2));
}

export const Ngram = {
    trigramify,
    calcRelevance: relevance,
}
