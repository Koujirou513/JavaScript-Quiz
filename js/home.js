document.addEventListener('DOMContentLoaded', function() {
    // スタートボタンにイベントリスナーを追加
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startQuiz);
    
    // クイズのスタートボタン押下時の処理
    function startQuiz() {
        // 選択された問題数を取得
        const questionCount = document.getElementById('question-count').value;
        
        // 選択肢をシャッフルするかどうかのフラグを取得
        const shuffleAnswers = document.getElementById('shuffle-answers').checked;

        // 選択された言語を取得
        const language = document.getElementById('language-select').value;
        
        // URLパラメータを作成
        const params = new URLSearchParams();
        params.append('count', questionCount);
        params.append('shuffle', shuffleAnswers);
        params.append('lang', language);
        
        // クイズページへリダイレクト
        window.location.href = `quiz.html?${params.toString()}`;
    }
});