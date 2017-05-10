// utils
'use strict';
(function(){
    app.factory('utils', ['$rootScope', '$http', '$compile', function ($rootScope, $http, $compile) {
        //polyfill，处理toBlob的兼容
        if (!HTMLCanvasElement.prototype.toBlob) {
            Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function (callback, type, quality) {

                    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                        len = binStr.length,
                        arr = new Uint8Array(len);

                    for (var i=0; i<len; i++ ) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    callback(new Blob( [arr], {type: type || 'image/png'} ) );
                }
            });
        }
        return {
            getData: function (u, d, m, h) {
                var args = arguments;
                $http({
                    url: u,
                    data: typeof d !== 'function' ? d || {} : {},
                    method: typeof m !== 'function' ? m || 'POST' : 'POST',
                    headers: typeof h !== 'function' ? h || {} : {}
                }).then(function (dt) {
                    if ((dt.data.dataList && dt.data.dataList.length !== 0) || dt.data.code == 1) {
                        for (var i = 0; i < args.length; i++) {
                            if (typeof args[i] === 'function') {
                                args[i].call(null, dt.data.dataList);
                            }
                            ;
                        }
                    } else {
                        console.warn(dt.statusText);
                    }
                }, function (x) {
                    console.error(x.statusText);
                });
            },
            getDataByKey: function (data, key, val) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (data[i][key] === val) {
                        return data[i];
                    }
                }
            },
            getDataByVal: function (data, key, val) {
                var value = [];
                if (!data) {
                    return null;
                }

                getArrVal(data);

                function getArrVal(dt) {
                    if (dt.constructor === Array && dt.length > 0) {
                        var len = dt.length;
                        for (var i = 0; i < len; i++) {
                            getArrVal(dt[i]);
                        }
                    } else {
                        for (var k in dt) {
                            if (dt[k].constructor === Array && dt[k].length > 0) {
                                getArrVal(dt[k]);
                            }
                        }
                        if (dt[key] === val) {
                            value.push(dt);
                        }
                    }
                }

                return value;
            },
            localData: function (key, val) {
                if (window.localStorage) {
                    if (val || val == '0') {
                        localStorage.setItem(key, val);
                        return true;
                    } else if (val === null) {
                        localStorage.removeItem(key)
                    } else {
                        var dt = localStorage.getItem(key);
                        if (dt) {
                            return dt;
                        } else {
                            return null;
                        }
                    }
                } else {
                    return false;
                }
            },

            /**
             * data: 被检索的数据集
             * key: 检索关键字
             * only: 是否只返回第一条检索到的数据
             * exclude: 被排除在检索之外的属性名
             * types: 只被检索的属性名，若不指定则检索exclude之外的所有属性
             * depth: 被检索的层次深度
             */
            queryByKey: function (data, key, only, exclude, types, depth) {
                var value = [], dep = 0, exp_str = '', keys = (key + '').replace(/\\+/, '\\\\').split(/\s+/g), lng = keys.length;
                if (!data) {
                    return null;
                }

                for (var i = 0; i < lng; i++) {
                    if (i != lng - 1)
                        exp_str += keys[i] + '.*';
                    else
                        exp_str += keys[i];
                }

                getArrVal(data);

                function getArrVal(dt) {
                    if (dt.constructor === Array) {
                        if (dt.length > 0) {
                            var len = dt.length;
                            for (var i = 0; i < len; i++) {
                                if(!dt[i] && dt[i] != '0' && dt[i] != '') break;

                                if (dt[i].constructor === Object) {
                                    getArrVal(dt[i]);
                                } else {
                                    if(depth && depth.indexOf(dep) == -1) break;
                                    if ((dt[i] + '').search(new RegExp(exp_str, 'ig')) !== -1) {
                                        if(only) {
                                            value = dt[i];
                                            return;
                                        }else{
                                            value.push(dt[i]);
                                        }
                                    }
                                }
                            }
                        } else {
                            return;
                        }
                    } else if (dt.constructor === Object) {
                        if (types) {
                            var len = types.length;
                            for (var i = 0; i < len; i++) {
                                var type = types[i].split('.');
                                if (type.length === 1) {
                                    var _dt = dt[type[0]];
                                } else if (type.length === 2) {
                                    if(dt[type[0]]){
                                        var _dt = dt[type[0]][type[1]];
                                    }
                                } else {
                                    if(dt[type[0]] && dt[type[0]][type[1]]){
                                        var _dt = dt[type[0]][type[1]][type[2]];
                                    }
                                }
                                if(!_dt && _dt != '0') continue;
                                if (_dt.constructor === Array) {
                                    if (_dt.length > 0) {
                                        dep ++;
                                        getArrVal(_dt);
                                        dep --;
                                    }
                                } else {
                                    if(depth && depth.indexOf(dep) == -1) break;
                                    if ((_dt + '').search(new RegExp(exp_str, 'ig')) !== -1) {
                                        if(only) {
                                            value = dt;
                                            return;
                                        }else{
                                            value.push(dt);
                                        }
                                    }
                                }
                            }
                        }

                        var isExcluded = false;
                        for (var k in dt) {
                            if(!dt[k] && dt[k] != '0' && dt[k] != '') break;
                            if(exclude && exclude.length > 0){
                                for(var i=0; i<exclude.length; i++){
                                    if(k === exclude[i]) {
                                        isExcluded = true;
                                        break;
                                    }
                                }
                            }

                            if(isExcluded) continue;

                            if (dt[k].constructor === Array) {
                                if (dt[k].length > 0) {
                                    dep ++;
                                    getArrVal(dt[k]);
                                    dep --;
                                }
                            } else if (dt[k].constructor === Object) {
                                getArrVal(dt[k]);
                            } else {
                                if (!types) {
                                    if(depth && depth.indexOf(dep) == -1) break;
                                    if ((dt[k] + '').search(new RegExp(exp_str, 'ig')) !== -1) {
                                        if(only) {
                                            value = dt;
                                            return;
                                        }else{
                                            value.push(dt);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if(depth && depth.indexOf(dep) == -1) return;
                        if ((dt + '').search(new RegExp(exp_str, 'ig')) !== -1) {
                            if(only) {
                                value = dt;
                                return;
                            }else{
                                value.push(dt);
                            }
                        }
                    }
                }

                return value;
            },
            serialize: function (dt) {
                var str = '';

                toSerializedString(dt);

                function toSerializedString(obj, name, idx) {
                    if (obj.constructor === Object) {
                        for (var key in obj) {
                            if ((obj[key] && obj[key].constructor !== Object) && obj[key].constructor !== Array) {
                                str += '&' + ((name || name == '0' ? name : '') + (idx || idx == '0' ? '[' + idx + '].' : '') + key + '=' + obj[key]);
                            } else if (obj[key] && obj[key].constructor === Object) {
                                toSerializedString(obj[key]);
                            } else if(!obj[key] && obj[key] === null){
                                str += '&' + ((key || key == '0' ? key : '') + '=' + obj[key]);
                            } else {
                                toSerializedString(obj[key], key);
                            }
                        }
                    } else if (obj.constructor === Array) {
                        var len = obj.length;
                        /*                    if(len === 0){
                         str += '&' + (name ? name : '') + '=[]';
                         return;
                         }*/
                        for (var i = 0; i < len; i++) {
                            if ((obj[i] && obj[i].constructor !== Object) && obj[i].constructor !== Array) {
                                str += '&' + ((name ? name : '') + '[' + i + ']=' + obj[i]);
                            } else if (obj[i] && obj[i].constructor === Object) {
                                toSerializedString(obj[i], name ? name : '', i);
                            } else{
                                toSerializedString(obj[i]);
                            }
                        }
                    } else {
                        return dt;
                    }
                }

                return str.slice(1);
            },
            extendHash: function (dt, keys, val) {
                if (!dt) {
                    //console.warn("数据无效！ In function 'extendHash'.");
                    dt = {};
                }
                if (dt.constructor === Array && dt.length > 0) {
                    var len = dt.length;
                    for (var i = 0; i < len; i++) {
                        var l = keys.length;
                        for (var n = 0; n < l; n++) {
                            if (!dt[i][keys[n]]) {
                                dt[i][keys[n]] = '';
                            }
                        }
                    }
                } else {
                    var len = keys.length;
                    for (var i = 0; i < len; i++) {
                        if (!dt[keys[i]] && dt[keys[i]] != '0' && dt[keys[i]] != 'null') {
                            dt[keys[i]] = val && val[i] ? val[i] : [];
                        }
                    }
                }
            },
            dateFormat: function (date, format) {
                var datas = ['2015-04-23', '2015-04-23 16:03:45', '2015/04/23 16:03:45', '2015年4月23日', '2015年4月23日16点3分45秒', '2015年4月23日,16点3分45秒', '2015年4月23日下午4点3分45秒'];
                var formats = ['yyyy-MM-dd', 'yyyy-MM-dd hh:mm:ss', 'yyyy/MM/dd hh:mm:ss', 'yyyy|MM|dd', 'yyyy|MM|dd hh|mm|ss', 'yyyy年MM月dd日,hh点mm分ss秒', 'yyyy|MM|dd&hh|mm|ss'];

                format = format || 'yyyy-MM-dd hh:mm:ss';
                var _date;
                date = date.constructor === Date ? date : (_date = new Date(date)) != 'Invalid Date' ? _date : (typeof date === 'string') ? new Date(date.replace(/-/g, '/')) : 'Invalid Date';
                if(date === 'Invalid Date') return '';

                var segments = {
                    'y+': date.getFullYear(),
                    'M+': date.getMonth() + 1,
                    'd+': date.getDate(),
                    'h+': date.getHours(),
                    'm+': date.getMinutes(),
                    's+': date.getSeconds(),
                    'S+': date.getMilliseconds()
                };

                for (var k in segments) {
                    var exp = new RegExp(k);
                    var len = (segments[k] + '').length;
                    if (!exp.exec(format)) continue;
                    var segLen = exp.exec(format)[0].length;
                    if (len < segLen) {
                        segments[k] = '0' + segments[k];
                        len = (segments[k]).length;
                    }
                    format = format.replace(exp, (segments[k] + '').substring(len - segLen));
                }

                return format;
            },
            keyHandler: function(dom, handleObj){
                //if(!dom) return;
                dom = dom || window.document;
                $(dom).bind('keydown', function(e){
                    var evt = e || window.event;
                    var keyCode = evt.keyCode;
                    var fun = handleObj['key'+ keyCode];
                    switch (keyCode){
                        case 13:
                            evt.preventDefault();
                            fun && fun(evt);
                            break;

                        case 37:    // 左
                            fun && fun(evt);
                            break;

                        case 38:    // 上
                            fun && fun(evt);
                            break;

                        case 39:    // 右
                            fun && fun(evt);
                            break;

                        case 40:    // 下
                            fun && fun(evt);
                            break;

                        default: break;
                    }
                });
            },

            // 深度拷贝
            deepClone: function (obj) {
                if(!obj || (typeof obj !== 'object')) return obj;

                function clone(obj){
                    if(obj.constructor === Object){
                        var _obj = {};
                        for(var k in obj){
                            if(obj[k] && (obj[k].constructor === Object || obj[k].constructor === Array)){
                                _obj[k] = clone(obj[k]);
                            }else{
                                _obj[k] = obj[k];
                            }
                        }
                    }else if(obj.constructor === Array){
                        var _obj = [],
                            len = obj.length;

                        for(var i=0; i<len; i++){
                            if(obj[i] && (obj[i].constructor === Array || obj[i].constructor === Object)){
                                _obj.push(clone(obj[i]));
                            }else{
                                _obj.push(obj[i]);
                            }
                        }
                    }else{
                        var _obj = obj;
                    }

                    return _obj;
                }

                return clone(obj);
            },

            // 数组去重
            unique: function (obj, idxs){
                if(!obj || obj.constructor !== Array){
                    return obj;
                }

                var dt = {};
                var arr = [];
                var len = obj.length;
                for(var i=0; i<len; i++){
                    if(idxs && idxs.constructor === Array && dt['key_' + obj[i]] === obj[i]){
                        idxs.push(i);
                    }
                    dt['key_' + obj[i]] = obj[i];
                }

                for(var k in dt){
                    arr.push(dt[k]);
                }

                return arr;
            },

            getBinLength: function (str) {
                if(!str || !str.length) return 0;
                var l = str.length, lng = 0, idx;
                for(var i=0; i<l; i++){
                    idx = str.charCodeAt(i);
                    if(idx >= 19968 && idx <= 40869){
                        lng += 2;
                    }else{
                        lng ++;
                    }
                }
                return lng;
            },

            searchSuggest: function(ipt, item, source, fun){
                var //ipt = $('<input class="form-control" autocomplete="off"/>'),
                    ulEle = $('<ul></ul>').addClass('bank-name-list none'),
                    isFocus = false,
                    idx = 0,
                    n = 1,
                    sclHeight = 0,
                    cur_item = $(),
                    dt = null;

                if(typeof source === 'object'){
                    dt = source;
                }

                //wrapper.append(ipt).append(ulEle);
                ulEle.insertAfter(ipt);

                function insertSelectItems(dt, key) {
                    var len = dt.length;
                    ulEle.html('');
                    for (var i = 0; i < len; i++) {
                        var str = dt[i][item.name];
                        if (key) {
                            var keys = key.split(/\s+/g),
                                lng = keys.length;
                            for (var j = 0; j < lng; j++) {
                                str = str.replace(new RegExp(keys[j], 'ig'), '<span>' + keys[j] + '</span>');
                            }
                        }
                        var li = $('<li data-id="' + dt[i][item.id] + '" data-name="' + dt[i][item.name] + '">' + str + '</li>');
                        ulEle.append(li);

                        li.off().click(function(e) {
                            isFocus = false;
                            fun && fun({
                                id: $(this).data('id'),
                                name: $(this).data('name')
                            });
                            ipt.val($(this).data('name'));
                            ulEle.addClass('none');
                        });
                    }

                    cur_item = ulEle.children().first().addClass('cur-item');
                }

                function mUp(evt) {
                    var prev_item = cur_item.prev(),
                        lis = ulEle.children(),
                        ulHeight = ulEle.height(),
                        sclTop = ulEle.scrollTop();

                    evt.preventDefault();
                    if (prev_item.length > 0) {
                        cur_item.removeClass('cur-item');
                        cur_item = prev_item.addClass('cur-item');
                    }

                    idx = lis.index(cur_item);

                    if (idx * 30 < (ulHeight * (n - 1)) && sclTop > idx * 30) {
                        sclHeight -= ulHeight;
                        ulEle.scrollTop(sclHeight);
                        n--;
                    }
                }

                function mDown(evt) {
                    var next_item = cur_item.next(),
                        lis = ulEle.children(),
                        ulHeight = ulEle.height();

                    evt.preventDefault();
                    if (next_item.length > 0) {
                        cur_item.removeClass('cur-item');
                        cur_item = next_item.addClass('cur-item');
                    }

                    idx = lis.index(cur_item);

                    if ((idx) * 30 >= ulHeight * n) {
                        sclHeight += ulHeight;
                        ulEle.scrollTop(sclHeight);
                        n++;
                    }
                }

                function confirm() {
                    idx = 0;
                    n = 1;
                    sclHeight = 0;

                    isFocus = false;
                    fun && fun({
                        id: cur_item.data('id'),
                        name: cur_item.data('name')
                    });
                    ipt.val(cur_item.data('name'));
                    ipt.trigger('blur');
                    /*setTimeout(function() {
                     ulEle.addClass('none');
                     }, 60);*/
                    //idx = lis.index(cur_item);
                }

                this.keyHandler(ipt, {
                    'key13': confirm,   // 回车确认
                    'key38': mUp,       // 向上选择
                    'key40': mDown      // 向下选择
                });

                var timer, tempKey, sourceData = [];

                ipt.on('focus', function() {
                    timer = setInterval(function() {
                        var _key = $.trim(ipt.val());

                        if (!/\S/.test(_key)) {
                            var len = sourceData.length;
                            if (tempKey === _key) {
                                if (len > 0) ulEle.removeClass('none');
                            } else {
                                if (len > 0) ulEle.removeClass('none');
                                if(typeof source === 'object'){
                                    insertSelectItems(sourceData, _key); // 默认选择列表
                                }else{
                                    source(_key, function(dt){
                                        var data = dt;
                                        sourceData = dt;
                                        len = data.length;
                                        if (len > 0) ulEle.removeClass('none');
                                        insertSelectItems(data, _key);          // 检索后的选择列表
                                    });
                                }
                            }
                            tempKey = _key;
                        } else {
                            var len = 0;
                            if (tempKey === _key) {
                                ulEle.removeClass('none');
                            } else {
                                var data;
                                if(typeof source === 'object'){
                                    data = this.queryByKey(dt, _key, false, false, [item.name]); // 模糊检索相关字段
                                    sourceData = data;
                                    len = data.length;
                                    if (len > 0) ulEle.removeClass('none');
                                    insertSelectItems(data, _key);              // 检索后的选择列表
                                }else{
                                    source(_key, function(dt){
                                        data = dt;
                                        sourceData = data
                                        len = data.length;
                                        if (len > 0) ulEle.removeClass('none');
                                        insertSelectItems(data, _key);          // 检索后的选择列表
                                    });
                                }

                                //var data = this.queryByKey(dt, _key, false, false, ['bankName']); // 模糊检索相关字段

                                //len = data.length;
                                //if (len > 0) ulEle.removeClass('none');
                                //insertSelectItems(data, _key); // 检索后的选择列表
                            }
                            tempKey = _key;
                        }
                    }, 60);
                });

                ipt.on('blur', function() {
                    clearInterval(timer);
                    //tempKey = '';
                    if (!isFocus) {
                        setTimeout(function() {
                            ulEle.addClass('none');
                        }, 100);
                    }
                });
                ulEle.on('mousedown', function() {
                    isFocus = true;
                });
                ulEle.on('mouseup', function() {
                    isFocus = false;
                });
            },

            // 设置Cookie
            setCookie: function(name, value) {
                var argv = arguments;
                var argc = arguments.length;
                var expires = (argc > 2) ? argv[2] : null;
                if (expires != null) {
                    var LargeExpDate = new Date();
                    LargeExpDate.setTime(LargeExpDate.getTime() + (expires * 1000 * 3600 * 24));
                }
                document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + LargeExpDate.toGMTString()));
            },

            // 获取Cookie
            getCookie: function(Name) {
                var search = Name + "=";
                if (document.cookie.length > 0) {
                    var offset = document.cookie.indexOf(search);
                    if (offset != -1) {
                        offset += search.length;
                        var end = document.cookie.indexOf(";", offset);
                        if (end == -1) end = document.cookie.length;
                        return unescape(document.cookie.substring(offset, end));
                    }
                    else return "";
                }
            },

            // 删除Cookie
            deleteCookie: function(name) {
                var expdate = new Date();
                expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
                this.setCookie(name, "", expdate);
            },

            //quality处于0和1之间，和图片的大小并不是线性关系，而是和图片的质量。
            fileCompressToImg:function(source_file_obj,quality,callback){
                var reader=new FileReader();
                reader.onload=function(e){
                    var imgObj=new Image();
                    imgObj.src= e.target.result;
                    imgObj.onload=function(){
                        var cvs=document.createElement('canvas');
                        cvs.width = imgObj.naturalWidth;
                        cvs.height = imgObj.naturalHeight;
                        var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
                        console.log('image quality is'+quality);
                        var newImageData = cvs.toDataURL('image/jpeg', quality);
                        var result_image_obj = new Image();
                        result_image_obj.src = newImageData;
                        callback(result_image_obj);
                    }
                };
                reader.readAsDataURL(source_file_obj);
            },

            //quality永远传1，max_size的单位为B
            fileCompressToBlob:function(source_file_obj,quality,max_size,callback){
                var that=this;

                var reader=new FileReader();

                if(source_file_obj.size<max_size||quality<0.1){
                    reader.onload=function(e){
                        var imgObj=new Image();
                        imgObj.src=e.target.result;
                        imgObj.onload=function(){
                            var cvs=document.createElement('canvas');
                            cvs.width = imgObj.naturalWidth;
                            cvs.height = imgObj.naturalHeight;
                            var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
                            cvs.toBlob(function(blob){
                                console.log('quality is:'+quality);
                                console.log('blob size is'+blob.size);
                                callback(blob);
                            },'image/jpeg',quality);
                        };
                    };
                }
                else{
                    quality=(quality-0.1).toFixed(2);
                    reader.onload=function(e){
                        var imgObj=new Image();
                        imgObj.src=e.target.result;
                        imgObj.onload=function(){
                            var cvs=document.createElement('canvas');
                            cvs.width = imgObj.naturalWidth;
                            cvs.height = imgObj.naturalHeight;
                            var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
                            cvs.toBlob(function(blob){
                                console.log('quality is:'+quality);
                                console.log('blob size is'+blob.size);
                                if(blob.size<max_size){
                                    callback(blob);
                                }
                                else{
                                    console.log(that);
                                    that.fileCompressToBlob(source_file_obj,quality,max_size,callback)
                                }
                            },'image/jpeg',quality);
                        };
                    };

                }
                reader.readAsDataURL(source_file_obj);
            }
        };
    }]);
    // app.factory('utils');
    // utils.$inject=['$rootScope', '$http', '$compile'];
    // function utils($rootScope, $http, $compile){
    //     if (!HTMLCanvasElement.prototype.toBlob) {
    //         Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    //             value: function (callback, type, quality) {
    //
    //                 var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
    //                     len = binStr.length,
    //                     arr = new Uint8Array(len);
    //
    //                 for (var i=0; i<len; i++ ) {
    //                     arr[i] = binStr.charCodeAt(i);
    //                 }
    //
    //                 callback(new Blob( [arr], {type: type || 'image/png'} ) );
    //             }
    //         });
    //     }
    //     return {
    //         getData: function (u, d, m, h) {
    //             var args = arguments;
    //             $http({
    //                 url: u,
    //                 data: typeof d !== 'function' ? d || {} : {},
    //                 method: typeof m !== 'function' ? m || 'POST' : 'POST',
    //                 headers: typeof h !== 'function' ? h || {} : {}
    //             }).then(function (dt) {
    //                 if ((dt.data.dataList && dt.data.dataList.length !== 0) || dt.data.code == 1) {
    //                     for (var i = 0; i < args.length; i++) {
    //                         if (typeof args[i] === 'function') {
    //                             args[i].call(null, dt.data.dataList);
    //                         }
    //                         ;
    //                     }
    //                 } else {
    //                     console.warn(dt.statusText);
    //                 }
    //             }, function (x) {
    //                 console.error(x.statusText);
    //             });
    //         },
    //         getDataByKey: function (data, key, val) {
    //             var len = data.length;
    //             for (var i = 0; i < len; i++) {
    //                 if (data[i][key] === val) {
    //                     return data[i];
    //                 }
    //             }
    //         },
    //         getDataByVal: function (data, key, val) {
    //             var value = [];
    //             if (!data) {
    //                 return null;
    //             }
    //
    //             getArrVal(data);
    //
    //             function getArrVal(dt) {
    //                 if (dt.constructor === Array && dt.length > 0) {
    //                     var len = dt.length;
    //                     for (var i = 0; i < len; i++) {
    //                         getArrVal(dt[i]);
    //                     }
    //                 } else {
    //                     for (var k in dt) {
    //                         if (dt[k].constructor === Array && dt[k].length > 0) {
    //                             getArrVal(dt[k]);
    //                         }
    //                     }
    //                     if (dt[key] === val) {
    //                         value.push(dt);
    //                     }
    //                 }
    //             }
    //
    //             return value;
    //         },
    //         localData: function (key, val) {
    //             if (window.localStorage) {
    //                 if (val || val == '0') {
    //                     localStorage.setItem(key, val);
    //                     return true;
    //                 } else if (val === null) {
    //                     localStorage.removeItem(key)
    //                 } else {
    //                     var dt = localStorage.getItem(key);
    //                     if (dt) {
    //                         return dt;
    //                     } else {
    //                         return null;
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //         },
    //
    //         /**
    //          * data: 被检索的数据集
    //          * key: 检索关键字
    //          * only: 是否只返回第一条检索到的数据
    //          * exclude: 被排除在检索之外的属性名
    //          * types: 只被检索的属性名，若不指定则检索exclude之外的所有属性
    //          * depth: 被检索的层次深度
    //          */
    //         queryByKey: function (data, key, only, exclude, types, depth) {
    //             var value = [], dep = 0, exp_str = '', keys = (key + '').replace(/\\+/, '\\\\').split(/\s+/g), lng = keys.length;
    //             if (!data) {
    //                 return null;
    //             }
    //
    //             for (var i = 0; i < lng; i++) {
    //                 if (i != lng - 1)
    //                     exp_str += keys[i] + '.*';
    //                 else
    //                     exp_str += keys[i];
    //             }
    //
    //             getArrVal(data);
    //
    //             function getArrVal(dt) {
    //                 if (dt.constructor === Array) {
    //                     if (dt.length > 0) {
    //                         var len = dt.length;
    //                         for (var i = 0; i < len; i++) {
    //                             if(!dt[i] && dt[i] != '0' && dt[i] != '') break;
    //
    //                             if (dt[i].constructor === Object) {
    //                                 getArrVal(dt[i]);
    //                             } else {
    //                                 if(depth && depth.indexOf(dep) == -1) break;
    //                                 if ((dt[i] + '').search(new RegExp(exp_str, 'ig')) !== -1) {
    //                                     if(only) {
    //                                         value = dt[i];
    //                                         return;
    //                                     }else{
    //                                         value.push(dt[i]);
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     } else {
    //                         return;
    //                     }
    //                 } else if (dt.constructor === Object) {
    //                     if (types) {
    //                         var len = types.length;
    //                         for (var i = 0; i < len; i++) {
    //                             var type = types[i].split('.');
    //                             if (type.length === 1) {
    //                                 var _dt = dt[type[0]];
    //                             } else if (type.length === 2) {
    //                                 if(dt[type[0]]){
    //                                     var _dt = dt[type[0]][type[1]];
    //                                 }
    //                             } else {
    //                                 if(dt[type[0]] && dt[type[0]][type[1]]){
    //                                     var _dt = dt[type[0]][type[1]][type[2]];
    //                                 }
    //                             }
    //                             if(!_dt && _dt != '0') continue;
    //                             if (_dt.constructor === Array) {
    //                                 if (_dt.length > 0) {
    //                                     dep ++;
    //                                     getArrVal(_dt);
    //                                     dep --;
    //                                 }
    //                             } else {
    //                                 if(depth && depth.indexOf(dep) == -1) break;
    //                                 if ((_dt + '').search(new RegExp(exp_str, 'ig')) !== -1) {
    //                                     if(only) {
    //                                         value = dt;
    //                                         return;
    //                                     }else{
    //                                         value.push(dt);
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //
    //                     var isExcluded = false;
    //                     for (var k in dt) {
    //                         if(!dt[k] && dt[k] != '0' && dt[k] != '') break;
    //                         if(exclude && exclude.length > 0){
    //                             for(var i=0; i<exclude.length; i++){
    //                                 if(k === exclude[i]) {
    //                                     isExcluded = true;
    //                                     break;
    //                                 }
    //                             }
    //                         }
    //
    //                         if(isExcluded) continue;
    //
    //                         if (dt[k].constructor === Array) {
    //                             if (dt[k].length > 0) {
    //                                 dep ++;
    //                                 getArrVal(dt[k]);
    //                                 dep --;
    //                             }
    //                         } else if (dt[k].constructor === Object) {
    //                             getArrVal(dt[k]);
    //                         } else {
    //                             if (!types) {
    //                                 if(depth && depth.indexOf(dep) == -1) break;
    //                                 if ((dt[k] + '').search(new RegExp(exp_str, 'ig')) !== -1) {
    //                                     if(only) {
    //                                         value = dt;
    //                                         return;
    //                                     }else{
    //                                         value.push(dt);
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 } else {
    //                     if(depth && depth.indexOf(dep) == -1) return;
    //                     if ((dt + '').search(new RegExp(exp_str, 'ig')) !== -1) {
    //                         if(only) {
    //                             value = dt;
    //                             return;
    //                         }else{
    //                             value.push(dt);
    //                         }
    //                     }
    //                 }
    //             }
    //
    //             return value;
    //         },
    //         serialize: function (dt) {
    //             var str = '';
    //
    //             toSerializedString(dt);
    //
    //             function toSerializedString(obj, name, idx) {
    //                 if (obj.constructor === Object) {
    //                     for (var key in obj) {
    //                         if ((obj[key] && obj[key].constructor !== Object) && obj[key].constructor !== Array) {
    //                             str += '&' + ((name || name == '0' ? name : '') + (idx || idx == '0' ? '[' + idx + '].' : '') + key + '=' + obj[key]);
    //                         } else if (obj[key] && obj[key].constructor === Object) {
    //                             toSerializedString(obj[key]);
    //                         } else if(!obj[key] && obj[key] === null){
    //                             str += '&' + ((key || key == '0' ? key : '') + '=' + obj[key]);
    //                         } else {
    //                             toSerializedString(obj[key], key);
    //                         }
    //                     }
    //                 } else if (obj.constructor === Array) {
    //                     var len = obj.length;
    //                     /*                    if(len === 0){
    //                      str += '&' + (name ? name : '') + '=[]';
    //                      return;
    //                      }*/
    //                     for (var i = 0; i < len; i++) {
    //                         if ((obj[i] && obj[i].constructor !== Object) && obj[i].constructor !== Array) {
    //                             str += '&' + ((name ? name : '') + '[' + i + ']=' + obj[i]);
    //                         } else if (obj[i] && obj[i].constructor === Object) {
    //                             toSerializedString(obj[i], name ? name : '', i);
    //                         } else{
    //                             toSerializedString(obj[i]);
    //                         }
    //                     }
    //                 } else {
    //                     return dt;
    //                 }
    //             }
    //
    //             return str.slice(1);
    //         },
    //         extendHash: function (dt, keys, val) {
    //             if (!dt) {
    //                 //console.warn("数据无效！ In function 'extendHash'.");
    //                 dt = {};
    //             }
    //             if (dt.constructor === Array && dt.length > 0) {
    //                 var len = dt.length;
    //                 for (var i = 0; i < len; i++) {
    //                     var l = keys.length;
    //                     for (var n = 0; n < l; n++) {
    //                         if (!dt[i][keys[n]]) {
    //                             dt[i][keys[n]] = '';
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 var len = keys.length;
    //                 for (var i = 0; i < len; i++) {
    //                     if (!dt[keys[i]] && dt[keys[i]] != '0' && dt[keys[i]] != 'null') {
    //                         dt[keys[i]] = val && val[i] ? val[i] : [];
    //                     }
    //                 }
    //             }
    //         },
    //         dateFormat: function (date, format) {
    //             var datas = ['2015-04-23', '2015-04-23 16:03:45', '2015/04/23 16:03:45', '2015年4月23日', '2015年4月23日16点3分45秒', '2015年4月23日,16点3分45秒', '2015年4月23日下午4点3分45秒'];
    //             var formats = ['yyyy-MM-dd', 'yyyy-MM-dd hh:mm:ss', 'yyyy/MM/dd hh:mm:ss', 'yyyy|MM|dd', 'yyyy|MM|dd hh|mm|ss', 'yyyy年MM月dd日,hh点mm分ss秒', 'yyyy|MM|dd&hh|mm|ss'];
    //
    //             format = format || 'yyyy-MM-dd hh:mm:ss';
    //             var _date;
    //             date = date.constructor === Date ? date : (_date = new Date(date)) != 'Invalid Date' ? _date : (typeof date === 'string') ? new Date(date.replace(/-/g, '/')) : 'Invalid Date';
    //             if(date === 'Invalid Date') return '';
    //
    //             var segments = {
    //                 'y+': date.getFullYear(),
    //                 'M+': date.getMonth() + 1,
    //                 'd+': date.getDate(),
    //                 'h+': date.getHours(),
    //                 'm+': date.getMinutes(),
    //                 's+': date.getSeconds(),
    //                 'S+': date.getMilliseconds()
    //             };
    //
    //             for (var k in segments) {
    //                 var exp = new RegExp(k);
    //                 var len = (segments[k] + '').length;
    //                 if (!exp.exec(format)) continue;
    //                 var segLen = exp.exec(format)[0].length;
    //                 if (len < segLen) {
    //                     segments[k] = '0' + segments[k];
    //                     len = (segments[k]).length;
    //                 }
    //                 format = format.replace(exp, (segments[k] + '').substring(len - segLen));
    //             }
    //
    //             return format;
    //         },
    //         keyHandler: function(dom, handleObj){
    //             //if(!dom) return;
    //             dom = dom || window.document;
    //             $(dom).bind('keydown', function(e){
    //                 var evt = e || window.event;
    //                 var keyCode = evt.keyCode;
    //                 var fun = handleObj['key'+ keyCode];
    //                 switch (keyCode){
    //                     case 13:
    //                         evt.preventDefault();
    //                         fun && fun(evt);
    //                         break;
    //
    //                     case 37:    // 左
    //                         fun && fun(evt);
    //                         break;
    //
    //                     case 38:    // 上
    //                         fun && fun(evt);
    //                         break;
    //
    //                     case 39:    // 右
    //                         fun && fun(evt);
    //                         break;
    //
    //                     case 40:    // 下
    //                         fun && fun(evt);
    //                         break;
    //
    //                     default: break;
    //                 }
    //             });
    //         },
    //
    //         // 深度拷贝
    //         deepClone: function (obj) {
    //             if(!obj || (typeof obj !== 'object')) return obj;
    //
    //             function clone(obj){
    //                 if(obj.constructor === Object){
    //                     var _obj = {};
    //                     for(var k in obj){
    //                         if(obj[k] && (obj[k].constructor === Object || obj[k].constructor === Array)){
    //                             _obj[k] = clone(obj[k]);
    //                         }else{
    //                             _obj[k] = obj[k];
    //                         }
    //                     }
    //                 }else if(obj.constructor === Array){
    //                     var _obj = [],
    //                         len = obj.length;
    //
    //                     for(var i=0; i<len; i++){
    //                         if(obj[i] && (obj[i].constructor === Array || obj[i].constructor === Object)){
    //                             _obj.push(clone(obj[i]));
    //                         }else{
    //                             _obj.push(obj[i]);
    //                         }
    //                     }
    //                 }else{
    //                     var _obj = obj;
    //                 }
    //
    //                 return _obj;
    //             }
    //
    //             return clone(obj);
    //         },
    //
    //         // 数组去重
    //         unique: function (obj, idxs){
    //             if(!obj || obj.constructor !== Array){
    //                 return obj;
    //             }
    //
    //             var dt = {};
    //             var arr = [];
    //             var len = obj.length;
    //             for(var i=0; i<len; i++){
    //                 if(idxs && idxs.constructor === Array && dt['key_' + obj[i]] === obj[i]){
    //                     idxs.push(i);
    //                 }
    //                 dt['key_' + obj[i]] = obj[i];
    //             }
    //
    //             for(var k in dt){
    //                 arr.push(dt[k]);
    //             }
    //
    //             return arr;
    //         },
    //
    //         getBinLength: function (str) {
    //             if(!str || !str.length) return 0;
    //             var l = str.length, lng = 0, idx;
    //             for(var i=0; i<l; i++){
    //                 idx = str.charCodeAt(i);
    //                 if(idx >= 19968 && idx <= 40869){
    //                     lng += 2;
    //                 }else{
    //                     lng ++;
    //                 }
    //             }
    //             return lng;
    //         },
    //
    //         searchSuggest: function(ipt, item, source, fun){
    //             var //ipt = $('<input class="form-control" autocomplete="off"/>'),
    //                 ulEle = $('<ul></ul>').addClass('bank-name-list none'),
    //                 isFocus = false,
    //                 idx = 0,
    //                 n = 1,
    //                 sclHeight = 0,
    //                 cur_item = $(),
    //                 dt = null;
    //
    //             if(typeof source === 'object'){
    //                 dt = source;
    //             }
    //
    //             //wrapper.append(ipt).append(ulEle);
    //             ulEle.insertAfter(ipt);
    //
    //             function insertSelectItems(dt, key) {
    //                 var len = dt.length;
    //                 ulEle.html('');
    //                 for (var i = 0; i < len; i++) {
    //                     var str = dt[i][item.name];
    //                     if (key) {
    //                         var keys = key.split(/\s+/g),
    //                             lng = keys.length;
    //                         for (var j = 0; j < lng; j++) {
    //                             str = str.replace(new RegExp(keys[j], 'ig'), '<span>' + keys[j] + '</span>');
    //                         }
    //                     }
    //                     var li = $('<li data-id="' + dt[i][item.id] + '" data-name="' + dt[i][item.name] + '">' + str + '</li>');
    //                     ulEle.append(li);
    //
    //                     li.off().click(function(e) {
    //                         isFocus = false;
    //                         fun && fun({
    //                             id: $(this).data('id'),
    //                             name: $(this).data('name')
    //                         });
    //                         ipt.val($(this).data('name'));
    //                         ulEle.addClass('none');
    //                     });
    //                 }
    //
    //                 cur_item = ulEle.children().first().addClass('cur-item');
    //             }
    //
    //             function mUp(evt) {
    //                 var prev_item = cur_item.prev(),
    //                     lis = ulEle.children(),
    //                     ulHeight = ulEle.height(),
    //                     sclTop = ulEle.scrollTop();
    //
    //                 evt.preventDefault();
    //                 if (prev_item.length > 0) {
    //                     cur_item.removeClass('cur-item');
    //                     cur_item = prev_item.addClass('cur-item');
    //                 }
    //
    //                 idx = lis.index(cur_item);
    //
    //                 if (idx * 30 < (ulHeight * (n - 1)) && sclTop > idx * 30) {
    //                     sclHeight -= ulHeight;
    //                     ulEle.scrollTop(sclHeight);
    //                     n--;
    //                 }
    //             }
    //
    //             function mDown(evt) {
    //                 var next_item = cur_item.next(),
    //                     lis = ulEle.children(),
    //                     ulHeight = ulEle.height();
    //
    //                 evt.preventDefault();
    //                 if (next_item.length > 0) {
    //                     cur_item.removeClass('cur-item');
    //                     cur_item = next_item.addClass('cur-item');
    //                 }
    //
    //                 idx = lis.index(cur_item);
    //
    //                 if ((idx) * 30 >= ulHeight * n) {
    //                     sclHeight += ulHeight;
    //                     ulEle.scrollTop(sclHeight);
    //                     n++;
    //                 }
    //             }
    //
    //             function confirm() {
    //                 idx = 0;
    //                 n = 1;
    //                 sclHeight = 0;
    //
    //                 isFocus = false;
    //                 fun && fun({
    //                     id: cur_item.data('id'),
    //                     name: cur_item.data('name')
    //                 });
    //                 ipt.val(cur_item.data('name'));
    //                 ipt.trigger('blur');
    //                 /*setTimeout(function() {
    //                  ulEle.addClass('none');
    //                  }, 60);*/
    //                 //idx = lis.index(cur_item);
    //             }
    //
    //             this.keyHandler(ipt, {
    //                 'key13': confirm,   // 回车确认
    //                 'key38': mUp,       // 向上选择
    //                 'key40': mDown      // 向下选择
    //             });
    //
    //             var timer, tempKey, sourceData = [];
    //
    //             ipt.on('focus', function() {
    //                 timer = setInterval(function() {
    //                     var _key = $.trim(ipt.val());
    //
    //                     if (!/\S/.test(_key)) {
    //                         var len = sourceData.length;
    //                         if (tempKey === _key) {
    //                             if (len > 0) ulEle.removeClass('none');
    //                         } else {
    //                             if (len > 0) ulEle.removeClass('none');
    //                             if(typeof source === 'object'){
    //                                 insertSelectItems(sourceData, _key); // 默认选择列表
    //                             }else{
    //                                 source(_key, function(dt){
    //                                     var data = dt;
    //                                     sourceData = dt;
    //                                     len = data.length;
    //                                     if (len > 0) ulEle.removeClass('none');
    //                                     insertSelectItems(data, _key);          // 检索后的选择列表
    //                                 });
    //                             }
    //                         }
    //                         tempKey = _key;
    //                     } else {
    //                         var len = 0;
    //                         if (tempKey === _key) {
    //                             ulEle.removeClass('none');
    //                         } else {
    //                             var data;
    //                             if(typeof source === 'object'){
    //                                 data = this.queryByKey(dt, _key, false, false, [item.name]); // 模糊检索相关字段
    //                                 sourceData = data;
    //                                 len = data.length;
    //                                 if (len > 0) ulEle.removeClass('none');
    //                                 insertSelectItems(data, _key);              // 检索后的选择列表
    //                             }else{
    //                                 source(_key, function(dt){
    //                                     data = dt;
    //                                     sourceData = data
    //                                     len = data.length;
    //                                     if (len > 0) ulEle.removeClass('none');
    //                                     insertSelectItems(data, _key);          // 检索后的选择列表
    //                                 });
    //                             }
    //
    //                             //var data = this.queryByKey(dt, _key, false, false, ['bankName']); // 模糊检索相关字段
    //
    //                             //len = data.length;
    //                             //if (len > 0) ulEle.removeClass('none');
    //                             //insertSelectItems(data, _key); // 检索后的选择列表
    //                         }
    //                         tempKey = _key;
    //                     }
    //                 }, 60);
    //             });
    //
    //             ipt.on('blur', function() {
    //                 clearInterval(timer);
    //                 //tempKey = '';
    //                 if (!isFocus) {
    //                     setTimeout(function() {
    //                         ulEle.addClass('none');
    //                     }, 100);
    //                 }
    //             });
    //             ulEle.on('mousedown', function() {
    //                 isFocus = true;
    //             });
    //             ulEle.on('mouseup', function() {
    //                 isFocus = false;
    //             });
    //         },
    //
    //         // 设置Cookie
    //         setCookie: function(name, value) {
    //             var argv = arguments;
    //             var argc = arguments.length;
    //             var expires = (argc > 2) ? argv[2] : null;
    //             if (expires != null) {
    //                 var LargeExpDate = new Date();
    //                 LargeExpDate.setTime(LargeExpDate.getTime() + (expires * 1000 * 3600 * 24));
    //             }
    //             document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + LargeExpDate.toGMTString()));
    //         },
    //
    //         // 获取Cookie
    //         getCookie: function(Name) {
    //             var search = Name + "=";
    //             if (document.cookie.length > 0) {
    //                 var offset = document.cookie.indexOf(search);
    //                 if (offset != -1) {
    //                     offset += search.length;
    //                     var end = document.cookie.indexOf(";", offset);
    //                     if (end == -1) end = document.cookie.length;
    //                     return unescape(document.cookie.substring(offset, end));
    //                 }
    //                 else return "";
    //             }
    //         },
    //
    //         // 删除Cookie
    //         deleteCookie: function(name) {
    //             var expdate = new Date();
    //             expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    //             this.setCookie(name, "", expdate);
    //         },
    //
    //         //quality处于0和1之间，和图片的大小并不是线性关系，而是和图片的质量。
    //         fileCompressToImg:function(source_file_obj,quality,callback){
    //             var reader=new FileReader();
    //             reader.onload=function(e){
    //                 var imgObj=new Image();
    //                 imgObj.src= e.target.result;
    //                 imgObj.onload=function(){
    //                     var cvs=document.createElement('canvas');
    //                     cvs.width = imgObj.naturalWidth;
    //                     cvs.height = imgObj.naturalHeight;
    //                     var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
    //                     console.log('image quality is'+quality);
    //                     var newImageData = cvs.toDataURL('image/jpeg', quality);
    //                     var result_image_obj = new Image();
    //                     result_image_obj.src = newImageData;
    //                     callback(result_image_obj);
    //                 }
    //             };
    //             reader.readAsDataURL(source_file_obj);
    //         },
    //
    //         //quality永远传1，max_size的单位为B
    //         fileCompressToBlob:function(source_file_obj,quality,max_size,callback){
    //             var that=this;
    //
    //             var reader=new FileReader();
    //
    //             if(source_file_obj.size<max_size||quality<0.1){
    //                 reader.onload=function(e){
    //                     var imgObj=new Image();
    //                     imgObj.src=e.target.result;
    //                     imgObj.onload=function(){
    //                         var cvs=document.createElement('canvas');
    //                         cvs.width = imgObj.naturalWidth;
    //                         cvs.height = imgObj.naturalHeight;
    //                         var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
    //                         cvs.toBlob(function(blob){
    //                             console.log('quality is:'+quality);
    //                             console.log('blob size is'+blob.size);
    //                             callback(blob);
    //                         },'image/jpeg',quality);
    //                     };
    //                 };
    //             }
    //             else{
    //                 quality=(quality-0.1).toFixed(2);
    //                 reader.onload=function(e){
    //                     var imgObj=new Image();
    //                     imgObj.src=e.target.result;
    //                     imgObj.onload=function(){
    //                         var cvs=document.createElement('canvas');
    //                         cvs.width = imgObj.naturalWidth;
    //                         cvs.height = imgObj.naturalHeight;
    //                         var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
    //                         cvs.toBlob(function(blob){
    //                             console.log('quality is:'+quality);
    //                             console.log('blob size is'+blob.size);
    //                             if(blob.size<max_size){
    //                                 callback(blob);
    //                             }
    //                             else{
    //                                 console.log(that);
    //                                 that.fileCompressToBlob(source_file_obj,quality,max_size,callback)
    //                             }
    //                         },'image/jpeg',quality);
    //                     };
    //                 };
    //
    //             }
    //             reader.readAsDataURL(source_file_obj);
    //         }
    //     };
    // }
    Date.prototype.format = function (format) {
        if (!format) {
            format = 'yyyy-MM-dd'
        }
        var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
            // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
})()
