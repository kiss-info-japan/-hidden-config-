require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 📌 診断用の固定質問リスト
const defaultQuestions = [
    "あなたにとって「心が落ち着く瞬間」はどんなときですか？",
    "何か大きな困難に直面したとき、どんなふうに乗り越えようとしますか？",
    "何かを「正しい」「間違っている」と判断するとき、どんな基準を大切にしていますか？"
];

const userSessions = {};

// 📌 確認用エンドポイント
app.get('/', (req, res) => {
    res.send('🚀 サーバーは正常に動作しています！');
});

// 📌 診断テスト開始API（ローカルテスト用）
app.post('/start-diagnosis', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "userId が必要です。" });
    }

    // 固定の質問リストを使用
    userSessions[userId] = { questions: [...defaultQuestions], answers: [] };

    // 最初の質問を送信
    res.json({ reply: `診断を開始します。\n\n${defaultQuestions[0]}` });
});

// 📌 診断テスト進行API（ローカルテスト用）
app.post('/chat', (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) {
        return res.status(400).json({ error: "userIdとmessageが必要です。" });
    }

    if (!userSessions[userId]) {
        return res.status(400).json({ error: "診断がまだ開始されていません。" });
    }

    const session = userSessions[userId];
    session.answers.push(message);

    // 次の質問を送信
    const nextQuestionIndex = session.answers.length;
    if (nextQuestionIndex < session.questions.length) {
        res.json({ reply: `${nextQuestionIndex + 1}番目の質問:\n${session.questions[nextQuestionIndex]}` });
    } else {
        // 診断結果（ダミー）
        res.json({ reply: "診断が完了しました！\n\nあなたの行動原理は「探究心」です。" });
    }
});

// 📌 サーバー起動（ローカル環境用）
app.listen(PORT, () => {
    console.log(`🚀 サーバーが http://localhost:${PORT} で起動しました`);
});
