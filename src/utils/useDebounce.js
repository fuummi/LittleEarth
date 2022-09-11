export function useDebounce(func, wait) {
    let timeOut = null;
    return function (...args) {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

let timeRef

export function useThrottle(fn, time) {
    timeRef = { timer: null, firstTime: true }

    return function (...arg) {
        if (timeRef.firstTime) {
            timeRef.firstTime = false
            return fn.apply(this, arg)
        }

        if (timeRef.timer) {
            return
        }
        timeRef.timer = setTimeout(() => {
            fn.apply(this, arg)
            clearTimeout(timeRef.timer)
            timeRef.timer = null
        }, time || 1000)
    }
}
