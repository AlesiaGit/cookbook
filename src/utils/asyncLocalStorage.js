export const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(() => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(() => {
            return JSON.parse(localStorage.getItem(key));
        });
    }
};