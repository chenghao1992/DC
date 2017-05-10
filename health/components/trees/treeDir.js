(function() {
    angular.module('app')
        .controller('TreeDirCtrl', funTreeDirCtrl);

    angular.module('app').directive('treeDir', funTreeDir);

    function funTreeDir() {

        var template = '\
                <treecontrol class="tree-xg" \
                    tree-model="treeData" \
                    options="_treeOptions" \
                    on-selection="_onSelection(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path)"\
                    selected-nodes="selectedNodes"\
                    selected-node="selectedNode"\
                    expanded-nodes="_expandedNodes"\
                    >\
                    <div class="clearfix" ng-if="$parent.$isNoTransclude">\
                        <div class="pull-left">\
                            <i class="fa fa-h-square"></i>&nbsp;{{node[\'treeLabelKey\']||node.name||\'请设置显示的key\'}}\
                        </div>\
                    </div>\
                     <ng-transclude ng-if="!$parent.$isNoTransclude"/>\
                <treecontrol/>\
                ';


        return {
            scope: {
                treeData: '=',
                treeOptions: '=?',
                selectedNodes: '=?',
                selectedNode: '=?',
                onSelection: '=?',
                treeLabelKey: '=?',
                expanded: '=?',
                selectedNode: '=?',
                leafArray: '=?'
            },
            transclude: true,
            template: template,
            controller: 'TreeDirCtrl',
            link: function(scope, elem, attr, ctrl, $transclude) {
                $transclude(function(transclude) {
                    // 判断是否已有定义内容
                    if (!transclude.length || transclude.length.length < 1) {
                        scope.$isNoTransclude = true;
                    } else {
                        scope.$isNoTransclude = false;
                    }
                })

            }
        };
    };

    funTreeDirCtrl.$inject = ['$scope', '$templateCache', '$timeout']

    function funTreeDirCtrl($scope, $templateCache, $timeout) {

        // 定义treeScope，方便外部调用
        $scope.$treeScope = $scope;

        if (!$scope.treeOptions || !angular.isObject($scope.treeOptions)) $scope.treeOptions = {};

        var template = '<ul {{options.ulClass}}>\
                            <li ng-repeat="node in node.{{options.nodeChildren}} | filter:filterExpression:filterComparator {{options.orderBy}}"\
                                ng-class="headClass(node)"\
                                {{options.liClass}}\
                                set-node-to-data>\
                                <leaf-mark ng-mouseover="node.$isHover=true" ng-mouseleave="node.$isHover=false" ng-class="[selectedClass(), unselectableClass()]">\
                                    <i class="tree-branch-head" ng-class="iBranchClass()" ng-click="selectNodeHead(node)"></i>\
                                    <i class="tree-leaf-head {{options.iLeafClass}}"></i>\
                                </leaf-mark>\
                                <tree-label \
                                    class="tree-label {{options.labelClass}} {{options.showSelectedBg}}" \
                                    ng-click="selectNodeLabel(node)" \
                                    ng-class="[selectedClass(), unselectableClass()]"\
                                    ng-mouseover="node.$isHover=true"\
                                    ng-mouseleave="node.$isHover=false"\
                                >\
                                    <tree-transclude/>\
                                </tree-label>\
                                <selected-bg ng-class="[selectedClass(), unselectableClass()]">\
                                </selected-bg>\
                                <treeitem \
                                    ng-show="nodeExpanded()">\
                                </treeitem>\
                            </li>\
                        </ul>';
        // 注入模版
        $templateCache.put('$treeDirTpl.html', template);

        // 配置
        $scope._treeOptions = {
            multiSelection: $scope.treeOptions.multiSelection || false, //是否能多选
            nodeChildren: $scope.treeOptions.nodeChildren || 'childs',
            dirSelectable: $scope.treeOptions.dirSelectable || false, //是否能选择父节点
            templateUrl: '$treeDirTpl.html',
            injectClasses: {
                ul: 'a2',
                li: 'a1',
                liSelected: 'a7',
                iExpanded: 'fa fa-caret-down',
                iCollapsed: 'fa fa-caret-right',
                iLeaf: 'a5',
                label: 'a6',
                labelSelected: ({ true: 'labelSelected', undefined: 'labelSelected', null: 'labelSelected' }[$scope.treeOptions.showSelectedBg])
            }
        };

        // 监听树的数据
        $scope.$watch('treeData', function(newValue, oldValue) {

            // if (newValue == oldValue) return;
            $scope._expandedNodes = funSetExpanded(newValue);
            $scope.leafArray = funGetLeafArray(newValue);

        });


        // 设置树节点是否打开
        function funSetExpanded(treeData) {

            var expanded = $scope.expanded || 0;
            var result = [];
            var datas = angular.copy(treeData);


            var _thisObj = {};
            var _key = $scope._treeOptions.nodeChildren;
            _thisObj[_key] = datas;

            // 记录第几层,因为上面添加了一层，所以从－1开始
            var _layer = -1;
            (function funSetEveryOne(_myObj, _layer) {

                // 全关闭
                if (!expanded) {

                    return [];

                }
                // 全打开
                else if (expanded == 1) {

                    result.push(_myObj);

                } else {
                    // 当前层级大于设置的层级则返回
                    if (_layer >= expanded.length) return;

                    // 设置为打开
                    if (expanded[_layer]) {
                        result.push(_myObj);
                    }

                }


                // 是否有子节点
                if (_myObj[_key] != undefined) {

                    // 更改当前层级
                    _layer++;

                    for (var i in _myObj[_key]) {
                        funSetEveryOne(_myObj[_key][i], _layer);
                    }

                }

            })(_thisObj, _layer);

            return result;

        };

        $scope.leafArray = funGetLeafArray($scope.treeData);
        // 获取由每个节点组成的数组
        function funGetLeafArray(treeData) {

            var result = [];
            var datas = treeData;

            var _thisObj = {};
            var _key = $scope._treeOptions.nodeChildren;
            _thisObj[_key] = datas;

            (function funSetEveryOne(_myObj) {

                result.push(_myObj)

                // 是否有子节点
                if (_myObj[_key] != undefined) {


                    for (var i in _myObj[_key]) {
                        funSetEveryOne(_myObj[_key][i]);
                    }

                }

            })(_thisObj);

            return result;
        };

        // 选择回调
        $scope._onSelection = function(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
            // console.log(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path)

            // 选择回调
            if ($scope.onSelection) {
                $scope.onSelection(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path);
            }

            if ($scope._treeOptions.multiSelection) return;
            if (selected) {
                $scope.selectedNode = node;
            } else {
                $scope.selectedNode = undefined;
            }

        };

        // 是否已经选择
        $scope.$funIsSelected = function(node) {
            if (!node) return;

            var index;

            if ($scope._treeOptions.multiSelection) {
                index = $scope.selectedNodes.indexOf(node);
            } else {

                index = $scope.selectedNode == node ? 0 : -1;
            }

            return index > -1;
        };

    };


    angular.module('app')
        .controller('TreeDataBoxCtrl', funTreeDataBoxCtrl);

    angular.module('app').factory('TreeDataBoxFac', funTreeDataBoxFac);


    funTreeDataBoxCtrl.$inject = ['$uibModal'];

    function funTreeDataBoxFac($uibModal) {
        var template = '\
        <div class="treeDataBox">\
            <div class="header">123123</div>\
            <div class="body">\
                <div style="width:50%;float:left;">\
                    <div class="featureBar b-b">\
                        <input autocomplete="off" placeholder="搜索药理类别..." class="form-control">\
                        <span class="searIcon">\
                            <i class="fa icon-magnifier"></i>\
                        </span>\
                    </div>\
                    <div class="searchContent">\
                        <tree-dir \
                        tree-data="treeObj.treeData" \
                        tree-options="treeObj.options" \
                        selected-node="selectedNode" \
                        selected-nodes="selectedNodes" \
                        tree-label-key="treeObj.options.labelKey" \
                        on-selection="onSelection" \
                        expanded="treeObj.options.expanded" \
                        leaf-array="leafArray">\
                                <i class="fa fa-check icheckbox {{$treeScope.$parent.isSupportNoAllCrilds?($treeScope.$parent.funChildsNbr(node)>0?\'fa-square\':\'\'):\'\'}}" \
                                    ng-if="node[$treeScope.$parent.treeObj.options.nodeChildren]&&\
                                            node[$treeScope.$parent.treeObj.options.nodeChildren].length>0?\
                                            $treeScope.$parent.treeObj.options.dirSelectable\
                                            :true"\
                                    ></i>\
                                <i class="fa fa-h-square"></i>&nbsp;{{node[$treeScope.$parent.treeObj.options.labelKey]}}\
                        </tree-dir>\
                    </div>\
                </div>\
                <div style="width:50%;float:left;">\
                    <div class="featureBar b-l b-b">\
                        &nbsp;&nbsp;已选择：{{_selectedNodes.length||0}}\
                    </div>\
                    <div class="searchContent">\
                        <span class="label-btn btn-info" ng-repeat="node in _selectedNodes track by $index">{{node[treeObj.options.labelKey]}}<i ng-click="removeNode(node)" ng-if="isSupportNoAllCrilds&&!funChildsNbr(node)>0" class="fa fa-times"></i></span>\
                    </div>\
                </div>\
            </div>\
            <div class="footer">\
                <div class="row">\
                    <div className="col-xs-12">\
                        <div class="col-xs-4 col-xs-offset-2">\
                            <button type="button" class="btn btn-success btn-block" ng-click="sure()">确 定</button>\
                        </div>\
                        <div class="col-xs-4">\
                            <button type="button" class="btn btn-default btn-block" ng-click="cancel()">取 消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ';

        function openModal(treeObj) {

            if (!treeObj)
                var treeObj = {};

            var modalInstance = $uibModal.open({
                template: template,
                controller: 'TreeDataBoxCtrl',
                windowClass: 'treeDataBoxModal',
                resolve: {
                    treeObj: function() {
                        return treeObj;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                try {
                    treeObj.closeCallBack(data)
                } catch (e) {

                }
            });
        };


        return {
            open: openModal
        };
    };

    funTreeDataBoxCtrl.$inject = ['$scope', '$timeout', '$uibModalInstance', 'treeObj'];

    function funTreeDataBoxCtrl($scope, $timeout, $uibModalInstance, treeObj) {

        // treeDataBox 类型 treeObj.type 默认1
        // 1 无论父子节点都能选择，父子节点是平等关系，结果集包含父子 
        // 2 只能选择子节点，父节点不能选择，点击为打开节点，结果集只包含子
        // 3 无论父子节点都能选择，选择父节点的同时该子节点下全部选择，结果集包含父子

        var multiSelection = null,
            dirSelectable = null;

        if (!treeObj.type || treeObj.type == 1) {
            multiSelection = true;
            dirSelectable = true;
        } else if (treeObj.type == 2) {
            multiSelection = true;
            dirSelectable = false;
        } else if (treeObj.type == 3) {
            multiSelection = true;
            dirSelectable = true;
            $scope.isSupportNoAllCrilds = true;
        }

        // 初始化树
        $scope.treeObj = {
            treeData: treeObj.treeData,
            options: {
                multiSelection: multiSelection,
                dirSelectable: dirSelectable,
                nodeChildren: treeObj.options.nodeChildren,
                labelKey: treeObj.options.labelKey,
                expanded: treeObj.options.expanded,
                showSelectedBg: false
            }
        };

        // 子节点key
        var $childKey = $scope.treeObj.options.nodeChildren;

        // 检查node是否在选中的数组里
        function funCheckNodeSelected(node) {

            if (!node) return null;

            var _node = angular.copy(node);
            _node.$isHover = false;

            var array = angular.copy($scope.selectedNodes) || [];
            for (var i = 0; i < array.length; i++) {

                var item = angular.copy(array[i]);

                item.$isHover = false;

                var _thisJson = JSON.stringify(item);
                var _thatJson = JSON.stringify(_node);

                if (_thisJson == _thatJson) {
                    return i;
                }

            }
            return -1;
        };

        // 递归每个节点
        function funSetEveryOne(_myObj, callback, _parentObj) {

            if (callback) {
                callback(_myObj, _parentObj);
            }

            if (_myObj[$childKey] !== undefined) {

                for (var i in _myObj[$childKey]) {
                    funSetEveryOne(_myObj[$childKey][i], callback, _myObj);
                }

            }

        };

        // 监听已选择的node数组
        $scope.$watch('selectedNodes', function(newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.selectedNodes = funSortSelectedNodes(newValue, $scope.treeObj.treeData) || [];
                $scope._selectedNodes = angular.copy($scope.selectedNodes);

            }
        }, true);



        // 选择回调
        $scope.onSelection = function(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
            // $scope.selectedNodes = funSortSelectedNodes($scope.selectedNodes, $scope.treeObj.treeData);
            if ($scope.isSupportNoAllCrilds) {
                if (selected) {
                    funSelectedAllChilds(node, selected);
                } else {
                    funSelectedAllChilds(node, selected);
                }
            }
        };

        // 移除已选择的节点
        $scope.removeNode = function(node) {

            var index = funCheckNodeSelected(node);
            if (index > -1) {
                $scope.selectedNodes.splice(index, 1);
            }
        };


        // 对选择的节点排序
        function funSortSelectedNodes(selectedNodes, treeData) {

            if (!selectedNodes || selectedNodes.length < 1) return;

            var obj = {},
                newNodes = [],
                jsons = [];
            obj[$childKey] = treeData;

            funSetEveryOne(obj, function(_myObj) {

                for (var i = 0; i < selectedNodes.length; i++) {

                    var myObj = angular.copy(_myObj);
                    var selectedNode = angular.copy(selectedNodes[i]);

                    myObj.$isHover = false;
                    selectedNode.$isHover = false;

                    var _myObjJson = JSON.stringify(myObj);
                    var _nodeJson = JSON.stringify(selectedNode);

                    if (_myObjJson == _nodeJson && jsons.indexOf(_nodeJson) == -1) {
                        newNodes.push(selectedNodes[i]);
                        jsons.push(_nodeJson);
                    }
                }
            })

            return newNodes;

        };

        // 根据父节点获取已选的子节点数量
        $scope.funChildsNbr = function(node) {

            if (!node[$childKey] || node[$childKey].length < 1) return false;

            var result = true,
                selectedNbr = 0;

            funSetEveryOne(node, function(_myObj, _parentObj) {

                // 不计算自己节点
                if (JSON.stringify(node) == JSON.stringify(_myObj)) {
                    return
                }

                var index = funCheckNodeSelected(_myObj);
                if (index == -1) {
                    result = false;
                } else {

                    // 子节点选中，父节点也要选中
                    var pindex = funCheckNodeSelected(_parentObj);

                    if (pindex == -1) {
                        $scope.selectedNodes.push(_parentObj);
                    }

                    selectedNbr++;
                }

            })

            return result ? -1 : (selectedNbr ? selectedNbr : 0);
        };


        // 选择或取消选择子节点
        function funSelectedAllChilds(node, isSelect) {

            funSetEveryOne(node, function(_myObj) {
                var index = funCheckNodeSelected(_myObj);

                // 选择
                if (isSelect) {

                    if (index == -1) {
                        $scope.selectedNodes.push(_myObj);
                    }

                }
                // 移除
                else {
                    if (index > -1) {
                        $scope.selectedNodes.splice(index, 1);
                    }
                }
            })

        };

        // // 过滤已全选的父级下的子节点
        // function filterChilds(selectedNodes) {

        //     var nodes = selectedNodes || [];
        //     // 暂存nodes
        //     var array = [];
        //     // 要过滤的子集
        //     var arrayFilter = [];

        //     for (var i = 0; i < nodes.length; i++) {

        //         var _result = $scope.funChildsNbr(nodes[i]);

        //         var _node = angular.copy(nodes[i]);
        //         _node.$$isHover = false;

        //         array.push(_node);

        //         if (_result == -1) {

        //             arrayFilter.push(nodes[i]);

        //         }

        //     }


        //     for (var j = 0; j < arrayFilter.length; j++) {

        //         funSetEveryOne(arrayFilter[j], function(_myObj) {

        //             if (arrayFilter[j] == _myObj) return;

        //             for (var k = 0; k < array.length; k++) {
        //                 var _itemjson = JSON.stringify(array[k]);
        //                 var __myObj = angular.copy(_myObj)
        //                 __myObj.$$isHover = false;
        //                 var __myObjJson = JSON.stringify(__myObj);
        //                 if (_itemjson == __myObjJson) {
        //                     array.splice(k, 1);
        //                 }
        //             }

        //         })

        //     }
        //     return array;

        // };


        // 设置已选择的节点
        function funSetSelectedNodes(nodes) {
            $scope.selectedNodes = funSortSelectedNodes(nodes, $scope.treeObj.treeData) || [];
            $scope._selectedNodes = angular.copy($scope.selectedNodes);

        };

        //点击确定
        $scope.sure = function() {
            $uibModalInstance.close($scope._selectedNodes || []);
        };

        //点击取消
        $scope.cancel = function() {
            $uibModalInstance.close(false);
        };

        // 打开后回调,返回一些方法
        $timeout(function() {

            try {

                treeObj.openCallBack({
                    leafArray: $scope.leafArray
                }, funSetSelectedNodes);

            } catch (e) {

            }

        }, 0)

    };


})();
