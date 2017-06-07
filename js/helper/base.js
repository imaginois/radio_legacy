var $ = document.querySelector.bind(document);




/*
////////////////////////////////
/////////// OLD BASE //////////
//////////////////////////////
 */
/**
 *
 */
if (null == window.$$) {
    window['$$'] = function (selector, el) {
        //return (!el ? document : el).querySelectorAll(selector);
        return [].slice.call((!el ? document : el).querySelectorAll(selector));
    }
}

/**
 *
 */
if (null == window.isEmpty) {
    window['isEmpty'] = function (prop) {

        return !isSet(prop) || prop == null || !prop.length;
    }
}

/**
 * Attempt for replacing the widely used and very slow  [ typeof var !== 'undefined' ]
 */
if (null == window.isSet) {
    window['isSet'] = function (prop) {

        return prop !== void 0; // browser independent & fastest possible ... ever !!!
    }
}

if (null == window.isFunc) {
    window['isFunc'] = function (prop) {

        return !!(prop && prop.constructor && prop.call && prop.apply);
    }
}

if (null == window.isNumber) {
    window['isNumber'] = function (prop) {

        return !isNaN(parseFloat(prop)) && isFinite(prop);
    }
}

if (null == window.isObject) {
    window['isObject'] = function (prop) {

        return prop === Object(prop);
    }
}

if (null == window.extend) { // shallow copy!!!
    window['extend'] = function (dst) {
        [].forEach.call(arguments, function (obj) {
            if (obj && obj !== dst) {
                Object.keys(obj).forEach(function (key) {
                    dst[key] = obj[key]
                })
            }
        })

        return dst
    }
}

if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(),    //day
        'h+': toSmallHours(this.getHours()),   //hour
        'H+': this.getHours(),   //hour
        'm+': this.getMinutes(), //minute
        'mi+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3),  //quarter
        'S': this.getMilliseconds(), //millisecond
        'a.': getAmPm(this, true),
        'a': getAmPm(this)

    };

    function getAmPm(date, small) {
        var hours = date.getHours(),
            am = small ? 'a.m.' : 'AM',
            pm = small ? 'p.m.' : 'PM';

        return hours >= 12 ? pm : am;
    }

    function toSmallHours(hours) {
        var smallHours = hours % 12;
        smallHours = smallHours ? smallHours : 12;

        return smallHours;
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    format = format.replace(/[0-9]+/g, '');
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 || k === 'a.' ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            if(k === 'a.'){
                break;
            }
        }
    }

    return format;
};

function now() {
    return new Date().getTime();
}

function applyArgsToObj(obj, mapping, args) {
    mapping.forEach(function (val, i) {
        obj[val] = args[i];
    });
};


Object.extend = function(obj1, obj2) {
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
};


/**
 * A few "hacked" helpers for Array object
 */
if ('function' === typeof Object.defineProperty) {
    var helpers = {
        diff  : function (a) {
//                return this.filter(function(i) {return a.indexOf(i) < 0;}); // it seems to be wrong !!!
            return this.filter(function (i) {

                return !(a.indexOf(i) > -1);
            });
        },
        range : function (length, start) {
            if (!this.length && isSet(length)) {
                while (length--) {
                    this[length] = length + (isSet(start) ? start : 0);
                }
            }

            return this;
        },
        insert: function (i) {
            index = Math.min(i, this.length);
            arguments.length > 1
            && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
            && this.insert.apply(this, arguments);

            return this;
        },
        unique: function () {
            var i, check = {}, result = [];
            for (i = 0; i < this.length; i++) {
                if (!check[this[i]]) {
                    check[this[i]] = true;
                    result.push(this[i]);
                }
            }

            return result;
        }
    }, prop;

    for (prop in helpers) {
        Object.defineProperty(Array.prototype, prop, {value: helpers[prop]});
    }
}

Node.prototype.prependChild = function (el) {
    this.childNodes[1] && this.insertBefore(el, this.childNodes[1]) || this.appendChild(el);
};

function zeroPad(number) {
    return (number < 10 ? ('0' + number).substr(-number.length) : number);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/**
 * Polyfill for non-ES6 browsers
 * Object.is() is a proposed addition to the ECMA-262 standard; as such it may not be present in all browsers.
 * You can work around this by using the following code at the beginning of your scripts.
 * This will allow you to use Object.is() when there is no built–in support.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is}
 */
if (!Object.is) {
    Object.is = function (x, y) {
        // SameValue algorithm
        if (x === y) { // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    };
}

function lazyEval() {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
            arguments[i] = arguments[i]();
        }
        if (arguments[i] instanceof Array) {
            lazyEval.apply(this, arguments[i]);
        }
    }
    return arguments;
}

Function.prototype.partial = function () {
    var fn   = this,
        args = [].slice.call(arguments);

    return function () {
        var arg = 0;
        for (var i = 0; i < args.length; i++) {
            if (args[i] === undefined) {
                args[i] = arguments[arg];
            }
            if (arguments[i] !== undefined) {
                args[i] = arguments[arg];
            }
            arg++;
            lazyEval(args[i]);
        }
        return fn.apply(this, args);
    };
};

Function.prototype.defaultNameSpace       = 'App';
Function.prototype.defaultNameSpacePrefix = '_';

Function.prototype.setDefaultNameSpace = function (name) {
    this.defaultNameSpace = name;
};

Function.prototype.getParent =
    Function.prototype.getParent ||
    function (obj, path) {
        return path.split('.').reduce(function (o, x, currentIndex, array) {
            return o[x] && typeof o[x] === 'function' ? o[x] : o;
        }, obj);
        //}
    }

Function.prototype.getPathToParent =
    Function.prototype.getPathToParent ||
    function (obj, key, path) {
        var path      = path || [Function.defaultNameSpace],
            keys      = Object.keys(obj),
            result    = [],
            namespace = [];

        if (obj.hasOwnProperty(key)) {
            path.push(key);
            return path;
        }

        if (keys.length > 0) {
            // Originally used to remove the object keys that don't start
            // with the default prefix, since they are not need in the
            // namespace tree structure and iterations on those objects are excessive

            //var filtered = keys.filter(function (i) {
            //    return true;
            //    return !!~i.indexOf(Function.defaultNameSpacePrefix);
            //})
            //.map(function (j) {
// console.log(keys);
            keys.map(function (j) {
                if (typeof obj[j] === 'function') {
                    result = Function.getPathToParent(obj[j], key, [j]);
                    if (result) {
                        namespace = namespace.concat(result); // because of opera....
                    }
                } else {
                    return false;
                }
            });
        }
        return namespace.length > 0 ? path.concat(namespace) : false;
    };

Function.prototype.addModule =
    Function.prototype.addModule ||
    function (module) {
        //TODO: mderibanov Redefine the function argumnes so that the key annotations come before the module definition in the following fashion:
        //baseObject.addModule(['baseObject', 'childObject'], childObject, optional[true,false]))
        window[Function.defaultNameSpace] = window[Function.defaultNameSpace] || {};
        var prefix                        = Function.defaultNameSpacePrefix || '_';
        var root                          = window[Function.defaultNameSpace];
        var args                          = [].slice.call(arguments, 1);
        var base                          = new this();
        var instanceObj                   = false;
        //var child   = args[2] || new module();
        var baseName                      = args[1] // || base.sectionName;
        var childName                     = args[2] // || child.sectionName;
        var path                          = args[3] || Function.getPathToParent(root, baseName);
        module.prototype                  = base;

        path = path ? path.join('.') : "App";

        //console.log('##### path is: ', path);

        if (typeof this === 'function' && this.name == "Function") {
            instanceObj              = new module();
            root[childName]          = module;
            //root[childName] = Object.assign(root[childName], new module());
            root[childName]['props'] = instanceObj;
            return module;
        }

        if (parent = this.getParent(root, path)) {
            instanceObj = new module();

            parent[childName] = module;
            //parent[baseName][childName] = Object.assign(parent[baseName][childName], new module());
            //parent[childName] = Object.assign(parent[childName], new module());
            parent[childName]['props'] = instanceObj;
        }

        //this will return an object or a function depending on the second paramater of addModule. In order for the invocation to be able to return a function, this has to be
        return (instanceObj instanceof module && args[0]) ? instanceObj : module;
    }

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'function':
                    bytes += 48;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
        else return (bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

function memoize(fn) {
    return function () {
        var args = [].slice.call(arguments),
            hash = '',
            i = args.length;

        currentArg = null;
        while (i--) {
            currentArg = args[i];
            hash += (currentArg === Object(currentArg)) ? JSON.stringify(currentArg) : currentArg;
            fn.memoize || (fn.memoize = {});
        }

        return (hash in fn.memoize) ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args);
    };
};


// var cfg = require("config");

// (function (open, getAllResponseHeaders) {
//
//     XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
//         var data = {
//             method : method,
//             url : url,
//             async : async
//         };
//
//         this.addEventListener("readystatechange", function (response) {
//             //log.xhr(data)
//         }, false);
//
//         open.call(this, method, url, async, user, pass);
//     };
//
//     XMLHttpRequest.prototype.getAllResponseHeaders = function (method, url, async, user, pass) {
//
//         this.addEventListener("readystatechange", function (response) {
//             //console.log(this.readyState); // this one I changed
//         }, false);
//
//         getAllResponseHeaders.call(this, method, url, async, user, pass);
//     };
//
// })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.getAllResponseHeaders);
