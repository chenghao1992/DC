(function () {
    angular.module('app')
        .directive('picView', ['modal', function (modal) {
            return {
                restrict: 'E',
                template:
                '<div class="preview-gl">' +
                '<button class="preview-close icon-close" ng-click="close()"></button>' +
                '<div class=preview-opr-bar ng-class="">' +
                '<div>' +
                '<button ng-repeat="btn in btns" ng-class="btn.className" ng-click="{{btn.opr}}" title="{{btn.title}}"></button>' +
                '</div>' +
                '</div>' +
                '<div class="preview-wrapper" ng-mousedown="mouseDown($event)">' +
                '<img id="view_image" ng-src="{{imgURL}}" />' +
                '</div>' +
                '<div class="preview-mini">' +
                '<a ng-repeat="img in pics.path" ng-class="$index==pics.curIdx?pics.curClass:un-cur" ng-click="{{pics.opr}}({idx:$index, url:img.url, desc:img.desc})"><img ng-src="{{img.url}}" alt="{{img.desc}}"/></a>' +
                '</div>' +
                '<div class="preview-desc" ng-if="desc">{{desc}}</div>' +
                '<div class="preview-opr-go-back" ng-class="opr_go_back" ng-click="slideToLeft()">' +
                '<span class="arrow-left"></span>' +
                '</div>' +
                '<div class="preview-opr-go-ahead" ng-class="opr_go_ahead" ng-click="slideToRight()">' +
                '<span class="arrow-right"></span>' +
                '</div>' +
                '</div>',

                link: function (scope, el, attr) {

                    var wrapper, image, imgH, imgW, reH = 0, reW = 0,
                        osH, osW, osLeft = '50%', osTop = '50%',
                        rsHPercent, rsWPercent;

                    // 外部控制器调用此方法，并初始化控件
                    scope.show = function(pics){
                        el.removeClass('hide');
                        scope.pics = pics;
                        scope.pics.opr = 'link';
                        scope.imgURL = scope.pics.path[scope.pics.curIdx].url;

                        image = document.getElementById('view_image');
                        wrapper = image.parentNode;

                        wrapper.style.top = osTop;
                        wrapper.style.left = osLeft;

                        image.onload = function(){
                            imgH = osH = image.height;
                            imgW = osW = image.width;
                            osLeft = (winW - imgW) / 2;

                            if(imgH > winH * 0.9){
                                imgH = osH = winH * 0.9;
                                image.style.height = imgH + 'px';
                                imgW = osW = image.width;
                                osTop = winH * 0.1 / 2;
                                osLeft = (winW - imgW) / 2;
                            }else{
                                osTop = (winH - imgH) / 2;
                            }

                            wrapper.style.top = osTop + 'px';;
                            wrapper.style.left = osLeft + 'px';

                            rsHPercent = rsWPercent = 0.5;
                        };
                    };

                    window.onresize = function(){
                        if(wrapper){
                            reH += window.innerHeight - winH;
                            reW += window.innerWidth - winW;

                            winH = window.innerHeight;
                            winW = window.innerWidth;

                            if(Math.abs(reH) >= 10){
                                osTop = osTop + reH * rsHPercent;
                                wrapper.style.top = osTop + 'px';
                                reH = 0;
                            }

                            if(Math.abs(reW) >= 10){
                                osLeft = osLeft + reW * rsWPercent;
                                wrapper.style.left = osLeft + 'px';
                                reW = 0;
                            }
                        }
                    };

                    //alert(scope.goods.name)

                    scope.btns = [
                        //{className: 'icon-pin', title: '钉住', opr: 'alertSome()'},
                        {className: 'icon-refresh', title: '回位', opr: 'freshSize()'},
                        {className: 'icon-normal-size', title: '实际大小', opr: 'normalSize()'},
                        {className: 'icon-reload reverse', title: '顺时针旋转', opr: 'rotateClockwise()'},
                        {className: 'icon-reload', title: '逆时针旋转', opr: 'rotateAnticlockwise()'},
                        {className: 'icon-magnifier-remove', title: '缩小', opr: 'shrink()'},
                        {className: 'icon-magnifier-add', title: '放大', opr: 'enlarge()'},
                        {className: 'icon-trash', title: '删除', opr: 'remove()'},
                    ];

                    /*scope.pics = {
                     path: [
                     {url: 'src/img/rtr.jpg', desc: '翠园中学为学生提供虚假成绩？ 罗湖教育局：谣言！', link: 'http//www.baidu1.com/'},
                     {url: 'src/img/c1.jpg', desc: '深圳"高考房"市场冷暖差别大！龙岗"高考房"遭冷落', link: 'http//www.baidu2.com/'},
                     {url: 'src/img/c2.jpg', desc: '西瓜经销商质疑深圳水朗收费站地磅不准致多交路费', link: 'http//www.baidu.com/'},
                     {url: 'src/img/c3.jpg', desc: '深圳16岁少年突发癫痫晕倒车厢 M446线公交车直送医院', link: 'http//www.baidu.com/'},
                     {url: 'src/img/c4.jpg', desc: 'iBATIS一词来源于“internet”和“abatis”的组合，是一个由Clinton Begin在2001年发起的开放源代码项目。最初侧重于密码软件的开发，现在是一个基于Java的持久层框架。iBATIS提供的持久层框架包括SQL Maps和Data Access Objects（DAO），同时还提供一个利用这个框架开发的JPetStore实例。', link: 'http//www.baidu.com/'},
                     {url: 'src/img/c5.jpg', desc: '钉住钉住钉住钉住钉住钉住钉住', link: 'http//www.baidu.com/'},
                     {url: 'src/img/e.jpg', desc: '钉住钉住钉住钉住钉住钉住钉住', link: 'http//www.baidu.com/'}
                     ],
                     curIdx: 0 || 0,
                     opr: 'link',
                     curClass: 'cur'
                     };*/

                    var isMouseDown = false,
                        isMoving = false,
                        target = null,
                        winW = window.innerWidth,
                        winH = window.innerHeight,
                        edgeX = 0,
                        edgeY = 0;

                    scope.mouseDown = function(e){
                        var evt = e || window.event;
                        evt.stopPropagation();
                        evt.preventDefault();

                        isMoving = false;
                        if(target){
                            edgeX = evt.clientX - target.offsetLeft;
                            edgeY = evt.clientY - target.offsetTop;
                            target.style.cursor = '-webkit-grabbing';
                        }

                        isMouseDown = true;

                        if(!target){
                            target = (evt.target || evt.srcElement).parentNode;

                            edgeX = evt.clientX - target.offsetLeft;
                            edgeY = evt.clientY - target.offsetTop;
                            target.style.cursor = '-webkit-grabbing';
                        }

                        scope.opr_go_back = '';
                        scope.opr_go_ahead = '';
                    };

                    document.body.onmousemove = function(e){
                        var evt = e || window.event;
                        evt.stopPropagation();
                        evt.preventDefault();
                        isMoving = true;
                        if(target && isMouseDown){
                            osTop = evt.clientY - edgeY;
                            osLeft = evt.clientX - edgeX;

                            target.style.top = osTop + 'px';
                            target.style.left = osLeft + 'px';
                        }
                        if(!isMouseDown){
                            if(evt.clientX < winW / 4){             // 鼠标移动到屏幕左侧1/4范围
                                scope.opr_go_back = 'animating go-fade-in-left';
                                scope.opr_go_ahead = '';
                            }else if(evt.clientX > winW * 3 / 4){   // 鼠标移动到屏幕右侧1/4范围
                                scope.opr_go_ahead = 'animating go-fade-in-right';
                                scope.opr_go_back = '';
                            }else{
                                scope.opr_go_back = '';
                                scope.opr_go_ahead = '';
                            }

                            /*if(evt.clientY > winH * 3 / 4){
                             scope.opr_go_back = 'animating go-fade-in-left';
                             scope.opr_go_ahead = '';
                             }{
                             scope.opr_go_back = '';
                             scope.opr_go_ahead = '';
                             }*/

                            scope.$apply();
                        }
                    };

                    document.onmouseup = function(){
                        if(target){
                            var top;
                            isMouseDown = false;
                            target.style.cursor = '-webkit-grab';

                            if(osTop < 0){
                                top = -osTop;
                                if(osH <= winH){
                                    rsHPercent = Math.abs(top / (top + winH - osH));
                                }else{
                                    //rsHPercent = Math.abs(top / (top + top + winH - osH));
                                }
                            }else{
                                top = osTop;
                                if(osH <= winH){
                                    rsHPercent = Math.abs(top / (winH - osH));
                                }else{
                                    //rsHPercent = Math.abs(top / (top + top + winH - osH));
                                }
                            }

                        }
                    };

                    scope.link = function(dt){
                        var evt = dt.e || window.event;
                        var target = (evt.target || evt.srcElement).parentNode;
                        scope.imgURL = dt.url;
                        scope.desc = dt.desc;
                        scope.pics.curIdx = dt.idx;
                    };

                    // 关闭图片浏览窗口
                    scope.close = function(){
                        angle = 0;
                        rotate(wrapper, 0);
                        scope.normalSize();
                        el.addClass('hide');
                    };

                    var angle = 0;
                    // 顺时针旋转
                    scope.rotateClockwise = function(){
                        angle += 90;
                        rotate(wrapper, angle);
                    };

                    // 逆时针旋转
                    scope.rotateAnticlockwise= function(){
                        angle -= 90;
                        rotate(wrapper, angle);
                    };

                    function rotate(ele, angle){
                        ele.style.transition = '-webkit-transform 500ms ease-out';
                        ele.style.webkitTransform = 'translate(0px,' + 0 + 'px) rotate(' + angle + 'deg) translateZ(0px)';
                    }

                    var scaleSteps = 8, scaleSizeH, scaleSizeW,
                        shrink = true, enlarge = true;

                    // 缩小
                    scope.shrink = function(){
                        if(scaleSteps > 0){
                            if(shrink){
                                image.style.height = osH * 0.7 + 'px';
                                scaleSizeH = osH - image.height;
                                scaleSizeW = osW - image.width;
                            }else{
                                image.style.height = osH - scaleSizeH + 'px';
                            }

                            wrapper.style.top = osTop + scaleSizeH / 2 + 'px';
                            wrapper.style.left = osLeft + scaleSizeW / 2 + 'px';

                            osH = image.height;
                            osW = image.width;

                            osTop = wrapper.offsetTop;
                            osLeft = wrapper.offsetLeft;

                            scaleSteps --;
                            shrink = true;
                            enlarge = false;
                        }
                        //dispatch(window, "resize");
                    };

                    // 放大
                    scope.enlarge = function(){
                        if(scaleSteps < 20) {
                            if(enlarge){
                                image.style.height = osH * 1.3 + 'px';
                                scaleSizeH = image.height - osH;
                                scaleSizeW = image.width - osW;
                            }else{
                                image.style.height = osH + scaleSizeH + 'px';
                            }

                            wrapper.style.top = osTop - scaleSizeH / 2 + 'px';
                            wrapper.style.left = osLeft - scaleSizeW / 2 + 'px';

                            osH = image.height;
                            osW = image.width;

                            osTop = wrapper.offsetTop;
                            osLeft = wrapper.offsetLeft;

                            scaleSteps ++;
                            enlarge = true;
                            shrink = false;
                        }
                        //image.style.transform = scale(1.1);
                    };

                    // 设置到实际大小
                    scope.normalSize = function(){
                        image.style.height = 'auto';
                        image.style.width = 'auto';

                        imgH = osH = image.height;
                        imgW = osW = image.width;

                        osTop = (winH - imgH) / 2;
                        osLeft = (winW - imgW) / 2;

                        wrapper.style.top = osTop + 'px';;
                        wrapper.style.left = osLeft + 'px';

                        rsHPercent = rsWPercent = 0.5;
                    };

                    // 设置到适合屏幕的尺寸
                    scope.freshSize = function(){
                        image.style.height = 'auto';
                        image.style.width = 'auto';

                        imgH = osH = image.height;
                        imgW = osW = image.width;

                        osLeft = (winW - imgW) / 2;

                        if(imgH > winH * 0.9){
                            imgH = osH = winH * 0.9;
                            image.style.height = imgH + 'px';
                            imgW = osW = image.width;
                            osTop = winH * 0.1 / 2;
                            osLeft = (winW - imgW) / 2;
                        }else{
                            osTop = (winH - imgH) / 2;
                        }

                        wrapper.style.top = osTop + 'px';;
                        wrapper.style.left = osLeft + 'px';

                        rsHPercent = rsWPercent = 0.5;
                    };

                    // 移除当前图片
                    scope.remove = function(){
                        if(modal){
                            modal.confirm(null, '确定要删除吗？', function(){
                                var idx = scope.pics.curIdx,
                                    len = scope.pics.path.length,
                                    url = scope.pics.path[idx].url;
                                scope.pics.path.splice(idx, 1);
                                if(idx < len - 1){
                                    scope.imgURL = scope.pics.path[idx + 1].url;
                                    scope.pics.curIdx = idx + 1;
                                }else if(idx > 0 && idx === len - 1){
                                    scope.imgURL = scope.pics.path[idx - 1].url;
                                    scope.pics.curIdx = idx - 1;
                                }else{
                                    scope.close();
                                }
                                scope.updatePics(url);  // 执行控制器中的移除操作
                            })
                        }
                    };

                    // 向左轮转
                    scope.slideToLeft = function(){
                        if(scope.pics.curIdx > 0) {
                            scope.pics.curIdx --;
                        }else{
                            scope.pics.curIdx = scope.pics.path.length - 1;
                        }
                        scope.imgURL = scope.pics.path[scope.pics.curIdx].url;
                    };

                    // 向右轮转
                    scope.slideToRight = function(){
                        if(scope.pics.curIdx < scope.pics.path.length - 1) {
                            scope.pics.curIdx ++;
                        }else{
                            scope.pics.curIdx = 0;
                        }
                        scope.imgURL = scope.pics.path[scope.pics.curIdx].url;
                    };

                    function scale(){
                        var scalePercent = 1, st = 0.1;
                        if(scalePercent + st <= 10){
                            scalePercent += st;
                        }
                        scalePercent += st;
                        wrapper.style.transition = '-webkit-transform 500ms ease-out';
                        wrapper.style.webkitTransform = 'translate(0px,' + 0 + 'px) scale(' + scalePercent + ') translateZ(0px)';
                        console.log(image.width)
                        console.log(wrapper.offsetWidth)
                    }

                    function dispatch(ele, type){
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent(type, true, true);
                        event.eventType = 'message';
                        ele.dispatchEvent(event);
                    }
                }
            };
        }]);
})();
