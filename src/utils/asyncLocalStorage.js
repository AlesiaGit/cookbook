export const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, JSON.stringify(value));
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return JSON.parse(localStorage.getItem(key));
        });
    }
};