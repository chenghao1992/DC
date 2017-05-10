(function() {
    var Tools = {};

    //获取url参数
    Tools.parameterArry = function() {
        var url = location.search;
        var theRequest = {};
        if (url.indexOf('?') != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = strs.length - 1; i >= 0; i--) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }();

    // ajax post请求：
    Tools.ajax = function() {
        var createAjax = function() {
            var xhr = null;
            try {
                //IE系列浏览器
                xhr = new ActiveXObject("microsoft.xmlhttp");
            } catch (e1) {
                try {
                    //非IE浏览器
                    xhr = new XMLHttpRequest();
                } catch (e2) {
                    window.alert("您的浏览器不支持ajax，请更换！");
                }
            }
            return xhr;
        };
        var _ajax = function(conf) {
            // 初始化
            //type参数,可选
            var type = conf.type;
            //url参数，必填 
            var url = conf.url;
            //data参数可选，只有在post请求时需要
            var data = conf.data;
            //datatype参数可选    
            var dataType = conf.dataType;
            //回调函数可选
            var success = conf.success;

            if (type == null) {
                //type参数可选，默认为get
                type = "get";
            }
            if (dataType == null) {
                //dataType参数可选，默认为text
                dataType = "text";
            }
            // 创建ajax引擎对象
            var xhr = createAjax();
            // 打开
            xhr.open(type, url, true);
            // 发送
            if (type == "GET" || type == "get") {
                xhr.send(null);
            } else if (type == "POST" || type == "post") {
                xhr.setRequestHeader("content-type",
                    "application/x-www-form-urlencoded");
                xhr.send(data);
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (dataType == "text" || dataType == "TEXT") {
                        if (success != null) {
                            //普通文本
                            success(xhr.responseText);
                        }
                    } else if (dataType == "xml" || dataType == "XML") {
                        if (success != null) {
                            //接收xml文档    
                            success(xhr.responseXML);
                        }
                    } else if (dataType == "json" || dataType == "JSON") {
                        if (success != null) {
                            //将json字符串转换为js对象  
                            success(eval("(" + xhr.responseText + ")"));
                        }
                    }
                }
            };
        };

        return _ajax;
    }();

    // 样式class
    Tools.hasClass = function(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false;
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    };

    Tools.addClass = function(elem, cls) {
        if (!hasClass(elem, cls)) {
            elem.className += ' ' + cls;
        }
    };

    Tools.removeClass = function(elem, cls) {
        if (hasClass(elem, cls)) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    };

    //识别设备
    Tools.browseDevice = function() {
        var user = navigator.userAgent.toLowerCase();
        var _dv = {};
        if (user.match(/MicroMessenger/i) == "micromessenger") {
            _dv.weixin = true;
        }
        if (user.match(/QQ/i) == "qq") {
            _dv.qq = true;
        }
        if (user.match(/WeiBo/i) == "weibo") {
            _dv.weibo = true;
        }
        if (user.indexOf('android') != -1) {
            _dv.android = true;
        } else if (user.indexOf('iphone') != -1) {
            _dv.iphone = true;
        } else {
            _dv = null;
        }
        return _dv;
    }();

    window.Tools = Tools;
})();
