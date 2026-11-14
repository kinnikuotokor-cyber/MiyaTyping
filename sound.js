// 音声を管理する変数
let audioContext = null;

// ミス音を再生する関数
export async function playMissSound() {

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    // ブラウザが音声に対応していなければ終了
    if (!AudioContextClass) {
        return;
    }

    // AudioContextを初回だけ作成
    if (audioContext === null) {
        audioContext = new AudioContextClass();
    }

    try {

        // 音声が一時停止状態なら再開
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        const now = audioContext.currentTime;

        // 音を作る装置
        const oscillator = audioContext.createOscillator();

        // 音量を調節する装置
        const gainNode = audioContext.createGain();

        // 音色
        oscillator.type = "triangle";

        // 音程を少しずつ下げる
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(
            130,
            now + 0.12
        );

        // 音量を設定
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.exponentialRampToValueAtTime(
            0.10,
            now + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.14
        );

        // 接続
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 再生
        oscillator.start(now);
        oscillator.stop(now + 0.15);

    } catch (error) {
        console.warn("ミス音を再生できませんでした", error);
    }
}