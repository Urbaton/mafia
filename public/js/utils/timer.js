let roleTimer = null;

export function getTimer() {
    return roleTimer;
}

export function setTimer(timer) {
    roleTimer = timer;
}

export function clearTimer() {
    if (roleTimer !== null) {
        clearTimeout(roleTimer);
        roleTimer = null;
    }
}

export function startTimerEvent(countdownMs, serverTime, event, socket) {
    clearTimer()

    let effectiveDelay = countdownMs;
    if (serverTime !== null) {
        const now = Date.now();
        const delta = now - serverTime;
        effectiveDelay = Math.max(0, countdownMs - delta);
        console.log(`Коррекция таймера: прошло ${delta}мс, запускаем таймер на ${effectiveDelay}мс`);
    }

    const timer = setTimeout(() => {
        console.log('Таймер истёк, отправляем screen-change-request');
        socket.emit(event);
        setTimer(null);
    }, effectiveDelay);

    setTimer(timer);
    startProgressBar(effectiveDelay)
}

function startProgressBar(durationMs) {
    const bar = document.getElementById('progress-bar');
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.max(0, 1 - elapsed / durationMs);
        bar.style.width = (progress * 100) + '%';

        if (elapsed < durationMs) {
            requestAnimationFrame(step);
        } else {
            bar.style.width = '0%';
        }
    }

    requestAnimationFrame(step);
}