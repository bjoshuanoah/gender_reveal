var app = angular.module("app", []);


function localConstructor() {
    this.write = function (key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
        return this;
    };
    this.get = function (key) {
        var obj = JSON.parse(localStorage.getItem(key));
        return obj;
    };
    this.clear = function () {
        localStorage.clear();
        return this;
    };
    this.remove = function (key) {
        localStorage.removeItem(key);
        return this;
    };
};

var local = new localConstructor();

var formatLargeNumber = function (count) {
    count = count + '';
    console.log(count.length);
    switch (count.length) {
        case 4: 
            return (count / 1000).toFixed(1) + 'k'
            break;
        case 5: 
            return (count / 1000) + 'k'
            break;
        case 6: 
            return (count / 1000000).toFixed(2).substring(1,4) + 'm'
            break;
        default:
            return count;
            break;
    }
};

