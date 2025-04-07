// 変数宣言
let allQuestions = null;
let selectedQuestions = null;
let questionNumber = 0;
let shouldShuffleAnswers = true;
let countAnswers = 0; // 正解数をカウント
let questionAttempted = false; 

// URLパラメータからクイズ設定を取得
function getQuizSetting() {
    const params = new URLSearchParams(window.location.search);
    const count = parseInt(params.get('count')) || 8;
    const shuffle = params.get('shuffle') === true;
    const lang = params.get('lang') || 'en'; 

    return { count, shuffle, lang };
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    const newArray = [...array]; // 元の配列をコピー
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素を入れ替え
    }
    return newArray;
}

// 指定された数の問題をランダムに選択
function selectRandomQuestions(questions, count) {
    // 問題数が指定数より少ない場合は全問題を返す
    if (questions.length <= count) {
        return [...questions];
    }

    // 問題をシャッフルして最初のcount個を選択
    return shuffleArray(questions).slice(0, count);
}

// 選択肢をシャッフルする処理

(function () {
    // クイズ設定を取得
    const { count, shuffle, lang } = getQuizSetting();
    shouldShuffleAnswers = shuffle;
    language = lang
    countAnswers = 0;

    let requestUrl = "./data.json";
    let request = new XMLHttpRequest();

    request.open("GET", requestUrl, false);
    request.send();

    if (request.status === 200) {
        console.log("Data loaded successfully");
        allQuestions = JSON.parse(request.response);
        selectedQuestions = selectRandomQuestions(allQuestions, count);
        console.log(`Selected ${selectedQuestions.length} questions out of ${allQuestions.length}`);

        startTimer();
        resetTimer();
        reset(questionNumber);
    } else {
        console.error("Failed to load data.json:", request.status, request.statusText);
    }
})();

/**
 * 表示のリセット
 * @param {Number} number 
 */
function reset(number) {
    // 選択肢の削除
    removeChoices();

    questionAttempted = false;
    // 現在の問題を取得
    let currentQuestion = selectedQuestions[number];
    const questionLang = language === 'ja' ? 'question_ja' : 'question_en';
    // 問題のセット
    setQuestion(currentQuestion[questionLang], number);

    let choices = [...currentQuestion.choices];

    if (shouldShuffleAnswers) {
        choices = shuffleArray(choices);
    }
    // 選択肢のセット
    setChoices(choices, currentQuestion.answer);
}

/**
 * 問題を設定
 * @param {object} question
 * @param {Number} number
 */
function setQuestion(question, number) {
    document.querySelector(".question_number").innerText = "Question " + (number + 1) + ' of ' + selectedQuestions.length;
    document.querySelector(".question_text").innerHTML = question;
}

/**
 * 選択肢の設定
 * @param {Array} choices
 * @param {String} answer 
 */
function setChoices(choices, answer) {
    let $answerContainer = document.querySelector(".answer_container");
    for (const [index, choice] of choices.entries()) {
        // 選択肢の生成
        let $choice = document.createElement("div");
        $choice.className = 
            choice === answer ? "select_box answer" : "select_box";
        $choice.innerHTML = `
            <div class="select_container">
                <p class="select_number">${index + 1}</p>
                <p class="select_text"><code>${choice}</code></p>
            </div>`;

        // 選択肢boxをクリックしたときの処理
        $choice.addEventListener("click", function(e) {
            let isCorrect = this.classList.contains("answer");
            if (isCorrect) {
                /* 正解処理 */
                // 正解数をカウントアップ
                if (!questionAttempted) {
                    countAnswers++;
                }
                // まだ問題があるか確認する
                if (questionNumber + 1 < selectedQuestions.length) {
                    // 次の問題へ
                    popSidebarMsg("Next Question...", 500);
                    reset(++questionNumber);
                } else {
                    // 結果発表画面を表示する
                    finish();
                }
            } else if (!this.classList.contains("clicked")) {
                /* 不正解処理 */
                this.style.backgroundColor = "gray";
                this.style.cursor = "not-allowed";
                this.classList.add("clicked");
                questionAttempted = true;

                // スコアを減点する（ここでは、計測時間を加算することにする）
                // popSidebarMsg("Miss +10 sec", 500);
                // addTimer(10);
            }
        });
        // 選択肢を追加する
        $answerContainer.appendChild($choice);
    }
}

/**
 * 問題が終了した時の処理
 */
function finish() {
    stopTimer();
    popSidebarMsg("Finish!!");

    // 総問題数と経過時間を表示
    const timeText = document.getElementById("stopwatch").innerText;
    document.querySelector(".sidebar_score").innerHTML = `
        <p>Total Time: ${timeText}</p>
    `;
    document.querySelector(".sidebar_score").innerHTML = `
        <p>Score: ${countAnswers} / ${selectedQuestions.length}</p>
        <a href="index.html" class="replay-btn">Back to Home</a>
    `;

    let resultMessage = "";
    const scorePercentage = (countAnswers / selectedQuestions.length) * 100;

    if (scorePercentage === 100) {
        resultMessage = "Perfect!";
    } else if (scorePercentage >= 80) {
        resultMessage = "Great!";
    } else if (scorePercentage >= 60) {
        resultMessage = "Good!";
    } else {
        resultMessage = "Thank you!";
    }

    document.querySelector(".question_text").innerHTML = resultMessage;
    document.querySelector(".answer_box").remove();
}

/**
 * 選択肢を削除する処理
 */
function removeChoices() {
    let $answerContainer = document.querySelector(".answer_container");
    while ($answerContainer.firstChild) {
        $answerContainer.removeChild($answerContainer.firstChild);
    }
}

/* ポップアップ処理 */
let $sidebarMsg = document.querySelector(".sidebar_msg");
function popSidebarMsg(msg, drawTime = 0) {
    $sidebarMsg.innerText = msg;

    if (drawTime) {
        setTimeout(function() {
            $sidebarMsg.innerHTML = "";
        }, drawTime);
    }
}