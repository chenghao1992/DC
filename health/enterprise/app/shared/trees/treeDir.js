(function() {
    angular.module('app')
        .controller('TreeDirCtrl', funTreeDirCtrl)
        .directive('treeDir', funTreeDir);

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
            allowDeselect: $scope.treeOptions.allowDeselect, //
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
            (function setEveryOne(_myObj, _layer) {

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
                        setEveryOne(_myObj[_key][i], _layer);
                    }

                }

            })(_thisObj, _layer);

            return result;

        };

        $scope.leafArray = funGetLeafArray($scope.treeData);
        // 获取由每个节点组成的数组
        function funGetLeafArray(treeData) {

            var result = [];
            var datas = angular.copy(treeData);

            var _thisObj = {};
            var _key = $scope._treeOptions.nodeChildren;
            _thisObj[_key] = datas;

            (function setEveryOne(_myObj) {

                var _obj = angular.copy(_myObj);
                result.push(_obj)

                // 是否有子节点
                if (_myObj[_key] != undefined) {


                    for (var i in _myObj[_key]) {
                        setEveryOne(_myObj[_key][i]);
                    }

                }

            })(_thisObj);

            return result;
        };



        // 选择回调
        $scope._onSelection = function(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
            // console.log(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path)
            if ($scope._treeOptions.multiSelection) return;
            if (selected) {
                $scope.selectedNode = node;
            } else {
                $scope.selectedNode = undefined;
            }
            // 选择回调
            if ($scope.onSelection) {
                $scope.onSelection(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path);
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

})();
