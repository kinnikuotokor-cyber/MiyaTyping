console.log("ミヤタイピング.jsが読み込まれやしたぜ");
import { playMissSound } from "./sound.js";
const startScreen = document.getElementById("start-screen");// そのIdを探してきてその定数名で呼ぶことにするねという意味
const settingScreen = document.getElementById("setting-screen");
const readyScreen = document.getElementById("ready-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
//ボタンの取得
const settingsButton = document.getElementById("settings-button");//
const saveButton = document.getElementById("save-button");//セーブして最初の画面に戻るボタン
const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back");
const resultTitleButton = document.getElementById("back-to-start");
//表示部分の取得
const typedPart = document.getElementById("typed-part");
const untypedPart = document.getElementById("untyped-part");
const massege = document.getElementById("massege");
const resultMassage = document.getElementById("result-massage");
//constの分類未定
const questionCountInput = document.getElementById("question-count");
const progressDisplay = document.getElementById("question-count-display");

// 速度表示関連
const speedTime = document.getElementById("speed-time");
const speedKps = document.getElementById("speed-kps");
const speedAccuracy = document.getElementById("speed-accuracy");
const speedMisses = document.getElementById("speed-misses");

const resultSpeed = document.getElementById("result-speed");
//単語リスト
const words = [
    "ambarella",
    "atemoya",
    "bilimbi",
    "blacksapote",
    "breadfruit",
    "canistel",
    "cempedak",
    "cherimoya",
    "cloudberry",
    "cupuacu",
    "dragonfruit",
    "fingerlime",
    "grumichama",
    "jabuticaba",
    "langsat",
    "lucuma",
    "mangosteen",
    "marang",
    "naranjilla",
    "capegooseberry",
    "pulasan",
    "quandong",
    "rambutan",
    "roseapple",
    "saskatoonberry",
    "soursop",
    "tamarillo",
    "velvettamarind",
    "whitesapote",
    "miraclefruit"
];//words配列に単語を入れる

// 標準QWERTY配列
const qwertyKeyMap = {
    KeyQ: "q",
    KeyW: "w",
    KeyE: "e",
    KeyR: "r",
    KeyT: "t",
    KeyY: "y",
    KeyU: "u",
    KeyI: "i",
    KeyO: "o",
    KeyP: "p",

    KeyA: "a",
    KeyS: "s",
    KeyD: "d",
    KeyF: "f",
    KeyG: "g",
    KeyH: "h",
    KeyJ: "j",
    KeyK: "k",
    KeyL: "l",

    KeyZ: "z",
    KeyX: "x",
    KeyC: "c",
    KeyV: "v",
    KeyB: "b",
    KeyN: "n",
    KeyM: "m"
};
// 大西配列のキー変換表
// 左側：物理キーボードの位置
// 右側：ゲーム内部で認識する文字
const onishiKeyMap = {
    // 数字段
    Digit1: "1",
    Digit2: "2",
    Digit3: "3",
    Digit4: "4",
    Digit5: "5",
    Digit6: "6",
    Digit7: "7",
    Digit8: "8",
    Digit9: "9",
    Digit0: "0",
    Minus: "/",
    Equal: "^",
    IntlYen: "¥",

    // QWERTYの上段
    KeyQ: "q",
    KeyW: "l",
    KeyE: "u",
    KeyR: ",",
    KeyT: ".",
    KeyY: "f",
    KeyU: "w",
    KeyI: "r",
    KeyO: "y",
    KeyP: "p",
    BracketLeft: "@",
    BracketRight: "[",

    // QWERTYの中段
    KeyA: "e",
    KeyS: "i",
    KeyD: "a",
    KeyF: "o",
    KeyG: "-",
    KeyH: "k",
    KeyJ: "t",
    KeyK: "n",
    KeyL: "s",
    Semicolon: "h",
    Quote: ":",
    Backslash: "]",

    // QWERTYの下段
    KeyZ: "z",
    KeyX: "x",
    KeyC: "c",
    KeyV: "v",
    KeyB: ";",
    KeyN: "g",
    KeyM: "d",
    Comma: "m",
    Period: "j",
    Slash: "b",
    IntlRo: "¥"
};
//ゲームの変数
let currentWord = "";//現在の単語を格納する変数
let currentIndex = 0;//「今、何文字目を打とうとしているか（何文字目まで正解したか）」を数えるカウンターです。プログラミングでは文字を 0番目 から数えるので、最初は 0（＝1文字目の a を待っている状態）にしてあります。a を打つと 1 に増え、p を打つと 2 に増えていきます。
let wordIndex = 0;//words配列の何番目の単語を使うかを決める変数
let questionLimit = 30;//出題数の上限を決める変数
let activeKeyMap = qwertyKeyMap;// 現在使用している配列
// タイピング速度の記録
let gameStartedAt = null;
// 入力回数
let totalAttempts = 0;
// 正しく入力した文字数
let correctCharacters = 0;
// ミス回数
let mistakeCount = 0;

let gameFinishedAt = null;
let speedTimerId = null;

//単語をらんだむに並び替える関数
function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));//Math.floorは小数点以下を切り捨てるという意味で、Math.random()は0以上1未満のランダムな数を返すという意味
        [words[i], words[j]] = [words[j], words[i]];//配列の要素を入れ替えることでシャッフルするという意味
    }
}
//次の単語をセットする関数
function setWord(){
    progressDisplay.textContent = `${wordIndex + 1}/${questionLimit}`;//progressDisplayに現在の単語数と出題数を表示するという意味
    currentWord = words[wordIndex];//words配列の0番目の単語をcurrentWordに代入するという意味
    currentIndex=0;//currentIndexを0にするという意味
    updateDisplay();
    massege.textContent = "";//massegeの文字を空にするという意味
    untypedPart.classList.remove("miss");//ミスした文字からクラスを削除するという意味
}
//文字の表示を更新する関数
function updateDisplay(){
    typedPart.textContent = currentWord.slice(0,currentIndex);//sliceは文字列の一部を切り取るという意味で、0からcurrentIndexまでの文字を切り取ってtypedPartに表示するという意味
    untypedPart.textContent = currentWord.slice(currentIndex);//currentIndexから最後までの文字を切り取ってuntypedPartに表示するという意味
}
// 速度の計算
// 速度の計算
function getSpeedStats() {

    const endTime =
        gameFinishedAt === null
            ? performance.now()
            : gameFinishedAt;

    const elapsedSeconds = gameStartedAt === null
        ? 0
        : (endTime - gameStartedAt) / 1000;

    // KPS（1秒あたりの打鍵数）
    const kps = elapsedSeconds > 0
        ? totalAttempts / elapsedSeconds
        : 0;

    // 正確率
    const accuracy = totalAttempts > 0
        ? (correctCharacters / totalAttempts) * 100
        : 100;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = Math.floor(elapsedSeconds % 60);

    const time =
        `${minutes}:${String(seconds).padStart(2, "0")}`;

    return {
        elapsedSeconds,
        kps,
        accuracy,
        time
    };
}
// 成績表示の更新
function updateSpeedDisplay() {

    const stats = getSpeedStats();

    speedTime.textContent = stats.time;

    speedKps.textContent =
        `${stats.kps.toFixed(1)}/s(${stats.kps.toFixed(1)}kps)`;

    speedAccuracy.textContent =
        `${stats.accuracy.toFixed(1)}%`;

    speedMisses.textContent = `${mistakeCount}回`;
}
// タイマー開始
function startSpeedTimer() {

    stopSpeedTimer();

    speedTimerId = setInterval(() => {

        if (!gameScreen.classList.contains("hidden")) {
            updateSpeedDisplay();
        }

    }, 250);
}
// タイマー停止
function stopSpeedTimer() {

    if (speedTimerId !== null) {
        clearInterval(speedTimerId);
        speedTimerId = null;
    }
}
// リザルト用の速度情報を作る関数
function createResultSpeed() {

    const stats = getSpeedStats();

    return [
        `経過時間：${stats.time}`,
        `打鍵速度：${stats.kps.toFixed(1)}/s(${stats.kps.toFixed(1)}kps)`,
        `正確率：${stats.accuracy.toFixed(1)}%`,
        `ミス回数：${mistakeCount}回`
    ].join("\n");
}

/*👇settingsButtonに見張りをaddして"click"されたら{}内の処理をするという意味*/
settingsButton.addEventListener("click", () => {
    settingScreen.classList.remove("hidden");//settingScreenを表示
    startScreen.classList.add("hidden");
});
//設定画面からタイトル画面へ戻るボタン
saveButton.addEventListener("click", () => {
    const selectedCount =Number(questionCountInput.value);//puestionCountInputの値をNumber型に変換してselectedCountに代入するという意味
    if(
        !Number.isInteger(selectedCount) ||
        selectedCount < 1 ||
        selectedCount > words.length
    ){
        alert(`出題数は1~${words.length}の整数で入力しろ`);
        return;
    }
    questionLimit = selectedCount;

    applyKeyboardLayout(layoutSelect.value);//layoutSelectの値をapplyKeyboardLayout関数に渡す

    settingScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");//セーブして最初の画面に戻るということ
});
//ゲーム画面からタイトル画面へ戻るボタン
backButton.addEventListener("click", () => {
    stopSpeedTimer();
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});
//結果画面からタイトル画面へ戻るボタン
resultTitleButton.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});
//startボタン
startButton.addEventListener("click", () => {//startを押したらreadyScreenを表示するやつ
    wordIndex = 0;//単語のインデックスを0に戻すという意味
    currentIndex = 0;//currentIndexを0に戻すという意味
    currentWord = "";//currentWordを空にするという意味

    typedPart.textContent = "";//typedPartを空にするという意味
    untypedPart.textContent = "";//untypedPartを空にするという意味
    massege.textContent = "";//massegeを空にするという意味
    resultMassage.textContent = "";//resultMassageを空にするという意味

    untypedPart.classList.remove("miss");//ミスした文字からクラスを削除する
//単語をランダムに並び替える
    shuffleWords();
//画面を切り替える
    untypedPart.classList.remove("miss");//ミスした文字からクラスを削除(?)
    startScreen.classList.add("hidden");
    readyScreen.classList.remove("hidden");

// 速度記録をリセット
gameStartedAt = null;
gameFinishedAt = null;

totalAttempts = 0;
correctCharacters = 0;
mistakeCount = 0;

stopSpeedTimer();

resultSpeed.textContent = "";

updateSpeedDisplay();
});
//キーボード操作
document.addEventListener("keydown",(event) => {
    if(event.altKey && event.key === "ArrowLeft"){//altキーを押しながら左矢印キーを押したらタイトルに戻る
        event.preventDefault();//ブラウザ自体が戻るを無効化するという意味
        gameScreen.classList.add("hidden");
        readyScreen.classList.add("hidden");
        settingScreen.classList.add("hidden");
        resultScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        stopSpeedTimer();
        return;
    }
    //スペースキーのスクロールを防ぐ
    if(event.key === " "&&
        (!readyScreen.classList.contains("hidden") || 
        !gameScreen.classList.contains("hidden"))){
        event.preventDefault();
}
//待機画面でスペースキーを押したときの処理
    if(event.key === " " && 
        !readyScreen.classList.contains("hidden")){//readyScreenが表示されている時にスペースキーを押したら{}内の処理をするという意味
readyScreen.classList.add("hidden");
gameScreen.classList.remove("hidden");

setWord();

// タイマー開始
gameStartedAt = performance.now();
gameFinishedAt = null;

startSpeedTimer();
updateSpeedDisplay();

return;
    }
//タイピング中の処理

// タイピング中の処理
if (!gameScreen.classList.contains("hidden")) {

    // キーを長押ししたときの連続入力を防ぐ
    if (event.repeat) return;

    // 選択中の配列に応じて文字を取得
    const typedChar = activeKeyMap[event.code];

    // 文字に変換できないキーは無視
    if (typedChar === undefined || typedChar.length !== 1) {
        return;
    }

    // 入力試行回数を増やす
    totalAttempts++;

    if (typedChar === currentWord[currentIndex]) {

        // 正解文字数を増やす
        correctCharacters++;

        // MISS表示を消す
        massege.textContent = "";
        untypedPart.classList.remove("miss");

        currentIndex++;

        updateDisplay();

        // 単語を最後まで入力した場合
        if (currentIndex >= currentWord.length) {

            wordIndex++;

            if (wordIndex < questionLimit) {

                setWord();

                }else{

                     // 終了時刻を保存
                     gameFinishedAt = performance.now();

                     // タイマー停止
                     stopSpeedTimer();

                     //最後の成績を確定
                     updateSpeedDisplay();

                     // ゲーム画面を隠す
                     gameScreen.classList.add("hidden");
                     
                     // リザルト画面を表示
                     resultScreen.classList.remove("hidden");

                     // 結果を表示
                     resultMassage.textContent =
                     
                     `全${questionLimit}問のタイプに成功！`;

                     // 最終速度を表示
                     resultSpeed.textContent = createResultSpeed();
}
        }

    } else {

            // ミス回数を増やす
            mistakeCount++;

            // ミス音を再生
            playMissSound();

            massege.textContent = "miss";
            untypedPart.classList.add("miss");
}

    // 速度表示を更新
    updateSpeedDisplay();
}

});

// HTMLからキーボードを取得
const virtualKeyboard =
    document.getElementById("virtual-keyboard");

// 設定画面から配列選択欄を取得
const layoutSelect =
    document.getElementById("layout-select");
// 指ごとの担当キー
const fingerKeyMap = {

    // 左手
    "finger-left-pinky": [
        "Digit1", "KeyQ", "KeyA", "KeyZ"
    ],

    "finger-left-ring": [
        "Digit2", "KeyW", "KeyS", "KeyX"
    ],

    "finger-left-middle": [
        "Digit3", "KeyE", "KeyD", "KeyC"
    ],

    "finger-left-index": [
        "Digit4", "Digit5",
        "KeyR", "KeyT", "KeyF", "KeyG", "KeyV", "KeyB"
    ],

    // 右手
    "finger-right-index": [
        "Digit6", "Digit7",
        "KeyY", "KeyU", "KeyH", "KeyJ", "KeyN", "KeyM"
    ],

    "finger-right-middle": [
        "Digit8", "KeyI", "KeyK", "Comma"
    ],

    "finger-right-ring": [
        "Digit9","Digit0","Minus","Equal","KeyO", "KeyL", "Period",
    ],

    "finger-right-pinky": [
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Semicolon",
    "Quote",
    "Slash",
    "Backslash",
    "IntlRo",
    "IntlYen"
],

    // 親指
    "finger-thumb": [
        "Space"
    ]

};
// 配列に応じてキーボード表示を変更する関数
function updateVirtualKeyboard() {

    virtualKeyboard.querySelectorAll(".virtual-key").forEach((key) => {

        // 前回の指の色とホームポジションをリセット
        key.classList.remove(
            "home-position",
            ...Object.keys(fingerKeyMap)
        );

        // 元々の文字を保存
        if (key.dataset.originalLabel === undefined) {
            key.dataset.originalLabel = key.textContent;
        }

        const code = key.dataset.code;

        // 現在の配列に割り当てられた文字を取得
        const mappedChar = activeKeyMap[code];

        if (mappedChar !== undefined) {
            key.textContent = mappedChar.toUpperCase();
        } else {
            key.textContent = key.dataset.originalLabel;
        }

        // その物理キーを担当する指の色を付ける
        for (const [fingerClass, codes] of Object.entries(fingerKeyMap)) {

            if (codes.includes(code)) {
                key.classList.add(fingerClass);
                break;
            }

        }

    });

// ホームポジションの下線表示

if (activeKeyMap === qwertyKeyMap) {

    // QWERTY配列：FとJ
    ["KeyF", "KeyJ"].forEach((code) => {

        const key = virtualKeyboard.querySelector(
            `[data-code="${code}"]`
        );

        if (key) {
            key.classList.add("home-position");
        }

    });

} else if (activeKeyMap === onishiKeyMap) {

    // 大西配列：OとTが割り当てられている物理キー
    Object.entries(onishiKeyMap).forEach(([code, char]) => {

        if (char === "o" || char === "t") {

            const key = virtualKeyboard.querySelector(
                `[data-code="${code}"]`
            );

            if (key) {
                key.classList.add("home-position");
            }

        }

    });

}

}

// 配列を切り替える関数
function applyKeyboardLayout(layoutName) {

    if (layoutName === "onishi") {
        activeKeyMap = onishiKeyMap;
    } else {
        activeKeyMap = qwertyKeyMap;
    }

    updateVirtualKeyboard();
}

// 最初はQWERTY配列
applyKeyboardLayout("qwerty");

// キーを押したとき
document.addEventListener("keydown", (event) => {

    if (gameScreen.classList.contains("hidden")) {
        return;
    }

    const code = getVirtualKeyCode(event);

    const pressedKey = virtualKeyboard.querySelector(
        `[data-code="${code}"]`
    );

    if (pressedKey) {
        pressedKey.classList.add("is-pressed");
    }

});
// Shiftキーの左右を判別する関数
function getVirtualKeyCode(event) {

    if (event.key === "Shift") {

        // 左Shift
        if (
            event.code === "ShiftLeft" ||
            event.location === 1
        ) {
            return "ShiftLeft";
        }

        // 右Shift
        if (
            event.code === "ShiftRight" ||
            event.location === 2
        ) {
            return "ShiftRight";
        }

        // ブラウザが右Shiftの位置を判定できない場合
        // 今回の診断結果に合わせて右Shiftとして扱う
        if (event.code === "" && event.location === 0) {
            return "ShiftRight";
        }
    }

    return event.code;
}
// キーを離したとき
document.addEventListener("keyup", (event) => {

    const code = getVirtualKeyCode(event);

    const releasedKey = virtualKeyboard.querySelector(
        `[data-code="${code}"]`
    );

    if (releasedKey) {
        releasedKey.classList.remove("is-pressed");
    }

});
// ブラウザからフォーカスが外れたとき
// 押されたままの表示が残らないようにする
window.addEventListener("blur", () => {

    virtualKeyboard.querySelectorAll(".is-pressed")
        .forEach((key) => {
            key.classList.remove("is-pressed");
        });

});
const wordDisplay = document.getElementById("word-display");