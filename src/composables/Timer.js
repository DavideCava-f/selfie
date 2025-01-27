export async function useTimer(time, callback) {
    const t = setInterval(() => {
        time.value--;
        if (time.value === 0) {
            callback();
            return;
        }
    }, 1000);
    return t;
}
