export function useDebounce(func, wait) {
    let timeOut = null;
    return function (...args) {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
