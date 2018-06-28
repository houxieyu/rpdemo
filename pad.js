require([
    "esri/map", "esri/dijit/BasemapToggle",
    "dojo/dom", "esri/layers/LabelClass", "esri/symbols/TextSymbol",
    "esri/dijit/Measurement", "esri/dijit/InfoWindow",
    "esri/toolbars/draw","esri/symbols/Font",
    "esri/toolbars/edit",
    "esri/graphic", "esri/Color",
    "esri/tasks/GeometryService",
    "esri/layers/FeatureLayer",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/_base/event", "esri/tasks/query", "esri/dijit/AttributeInspector", "dojo/dom-construct", "dijit/form/Button",
    "dojo/parser",
    "dojo/domReady!"
], function (
    Map, BasemapToggle,
    dom, LabelClass, TextSymbol,
    Measurement, InfoWindow,Draw,Font,
    Edit, Graphic, Color, GeometryService,
    FeatureLayer, UniqueValueRenderer, PictureMarkerSymbol,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, event, Query, AttributeInspector, domConstruct, Button,
    parser
) {
    parser.parse();
    esriConfig.defaults.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    // var infoWindow = new InfoWindow({}, domConstruct.create("div"));
    // infoWindow.startup();
    //初始化底图
    var map = new Map("map", {
        basemap: "streets",
        // infoWindow: infoWindow,
        center: [117.05, 36.7],
        zoom: 15,
        showLabels: true
    });
    //测量工具
    var measurement = new Measurement({
        map: map
    }, dom.byId("measurementDiv"));
    measurement.startup();
    //底图切换工具
    var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    //初始化边界、建筑物图层
    var areacode = '370102008015';
    var layerShiBJ = new FeatureLayer(fsurl + "0", new layerpars('1=2'));
    var layerXianBJ = new FeatureLayer(fsurl + "1", new layerpars('1=2'));
    var layerXiangBJ = new FeatureLayer(fsurl + "2", new layerpars('1=2'));
    //依据区划码，过滤村级边界和建筑物图层
    var layerCunBJ = new FeatureLayer(fsurl + "3", new layerpars("AREA_CODE like '" + areacode + "%' or AREA_CODE is null"));
    layerCunBJ.setShowLabels(true);
    var buildfilter = "BuildCode like '" + areacode + "%' or BuildCode is null";
    var layerBuilding = new FeatureLayer(fsurl + "4", new layerpars(buildfilter));
    //设置选中样式
    //要素拾取
    var symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 255, 255]),
            1
        ),
        new Color([255, 0, 0, 0.5])
    );
    layerBuilding.setSelectionSymbol(symbol);
    //设置标签
    var statesLabel = new TextSymbol().setColor(new Color("#666"));
    statesLabel.font.setSize("10pt");
    statesLabel.font.setFamily("Microsoft YaHei");
    var json = {
        "labelExpressionInfo": {
            "value": "{NAME}"
        }
    };
    var labelClass = new LabelClass(json);
    labelClass.symbol = statesLabel;
    layerBuilding.setLabelingInfo([labelClass]);
    //建筑图标渲染图层
    var layerbuildingicon = new FeatureLayer(fsurl + "4", new layerpars(buildfilter));
    //符号渲染器
    var iconrenderer = new UniqueValueRenderer(new PictureMarkerSymbol('img/建筑.png', 20, 20), "btype");
    iconrenderer.addValue('0', new PictureMarkerSymbol('img/住宅.png', 20, 20));
    iconrenderer.addValue('1', new PictureMarkerSymbol('img/商业.png', 20, 20));
    iconrenderer.addValue('2', new PictureMarkerSymbol('img/公用.png', 20, 20));
    layerbuildingicon.setRenderer(iconrenderer);
    //标注渲染图层
    var layerbuildinglabel = new FeatureLayer(fsurl + "4", new layerpars(buildfilter));
    function renderLabelLayer(showlabel){
        if(!showlabel){
            layerbuildinglabel.hide();
            return;
        }else{
            layerbuildinglabel.show();
        }
        //标注渲染器
        var labelrenderer = new UniqueValueRenderer(new TextSymbol(''), "OBJECTID");
        //查询图层属性
        // var queryTask = new QueryTask(fsurl+"4");
        // var query = new Query();
        // query.outFields = ["*"];
        // query.where = buildfilter;
        // queryTask.execute(query,function(fts){
        // });
        layerBuilding.graphics.forEach(ft => {
            // console.log(ft)
            labelrenderer.addValue({
                value:ft.attributes.OBJECTID,
                label:ft.attributes.rzhushu,
                symbol:new TextSymbol((ft.attributes.NAME?(ft.attributes.NAME + ":"):"")+"入住户数"+(ft.attributes.rzhushu?ft.attributes.rzhushu:"0")).setColor(new Color("red")).setFont(new Font("12px"))
            });
        });
        layerbuildinglabel.setRenderer(labelrenderer);
        layerbuildinglabel.setShowLabels(true);
        layerbuildinglabel.show();
    }

    // var layerBuilding = new FeatureLayer(fsurl + "4");
    layers = [layerShiBJ, layerXianBJ, layerXiangBJ, layerCunBJ, layerBuilding, layerbuildingicon,layerbuildinglabel];
    map.addLayers(layers);
    // map.addLayer(layerBuilding)
    //建筑物图层加载完成，将地图缩放至建筑物图层范围
    layerBuilding.on('update-end', function () {
        FullExtent();

    });
    //生成绘图工具
    map.on("load", createToolbar);
    //根据按钮属性，激活相应绘图工具
    var curtool = "";
    $('#ui button[data-type]').click(function () {
        activateDrawTool($(this).attr('data-type'));
        curtool = "";
        // $('#map *').css("cursor", "default");
    });
    //根据按钮属性，激活编辑工具
    var selft;
    $('#ui button[data-tool]').click(function () {
        curtool = $(this).attr('data-tool');
        if (curtool == 'edit')
            activateEditTool(selft);
        else if (curtool == 'attr') {
            // event.stop(evt);
            // editToolbar.deactivate();
            // layerBuilding.clearSelection();
            // var selectQuery = new Query();
            // selectQuery.objectIds = [evt.graphic.attributes.OBJECTID];
            // layerBuilding.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
            //     if (features.length > 0) {
            //store the current feature
            // updateFeature = features[0];
            updateFeature = selft;
            map.infoWindow.setTitle('属性编辑');
            map.infoWindow.show(curpoint, map.getInfoWindowAnchor(curpoint));
            $('.atiDeleteButton').removeClass('atiButton');
            $('.atiDeleteButton').addClass('dijitButton');
            // } else {
            //     map.infoWindow.hide();
            // }
            // });
        }
        // else
        // $('#map *').css("cursor", $(this).attr('data-cursor'));
    });
    var showlabel = false;
    //标注开关
    $('#bt_label').click(function () {
        // layerBuilding.setShowLabels(showlabel = !showlabel);
        renderLabelLayer(showlabel = !showlabel);
    });
    //点击到建筑物时，激活编辑工具
    layerBuilding.on("click", function (evt) {
        {
            haslayerclick = true;
            curpoint = evt.screenPoint;
            layerBuilding.clearSelection();
            var selectQuery = new Query();
            selectQuery.objectIds = [evt.graphic.attributes.OBJECTID];
            layerBuilding.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {});
            var selfts = layerBuilding.getSelectedFeatures();
            if (selfts.length > 0) selft = selfts[0];
        }
    });
    //属性编辑工具
    var layerInfos = [{
        'featureLayer': layerBuilding,
        'showAttachments': false,
        'isEditable': true,
        'fieldInfos': [{
                'fieldName': 'BuildCode',
                'isEditable': true,
                'label': '建筑编码:'
            },
            {
                'fieldName': 'ADDRESS',
                'isEditable': true,
                'label': '地址:'
            },
            {
                'fieldName': 'NAME',
                'isEditable': true,
                'label': '建筑名称:'
            },
            {
                'fieldName': 'btype',
                'isEditable': true,
                'label': '建筑类型:'
            },
            {
                'fieldName': 'LAYERNUM',
                'isEditable': true,
                'label': '层数:'
            },
            {
                'fieldName': 'UnitCount',
                'isEditable': true,
                'label': '房屋套数:'
            },
            {
                'fieldName': 'rzhushu',
                'isEditable': true,
                'label': '入住户数:'
            }
        ]
    }];
    var attInspector = new AttributeInspector({
        layerInfos: layerInfos
    }, domConstruct.create("div"));
    //添加保存按钮
    var saveButton = new Button({
        label: "保存"
    }, domConstruct.create("button", {
        style: {
            color: "red"
        }
    }));
    domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");
    // console.log(attInspector.editButtons)

    saveButton.on("click", function () {
        updateFeature.getLayer().applyEdits(null, [updateFeature], null);
        layerbuildingicon.applyEdits(null, [updateFeature], null);
        map.infoWindow.hide();
        layerbuildingicon.redraw();
    });
    //添加采集住户信息按钮
    // var huButton = new Button({
    //     label: "采集住户信息"
    // }, domConstruct.create("button", {
    //     style: {
    //         color: "red"
    //     }
    // }));
    // domConstruct.place(huButton.domNode, saveButton.domNode, "after");
    // console.log(attInspector.editButtons)
    $('#bt_caiji').click(function () {
        layui.use(['layer', 'table'], function () {
            var layer = layui.layer;
            layer.open({
                type: 1,
                area: '500px',
                shade: 0,
                offset: 'auto',
                title: '住户列表',
                content: $('#huinfo') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            try {
                $('#labeldbcode').text(selft.attributes.BuildCode);
            } catch (e) {
                console.log(e.message)
            }
            //渲染住户列表
            loadZhuhuTable();
        });
    });
    //渲染住户列表
    function loadZhuhuTable() {
        //从服务器读取数据
        $.ajax(serveraddr+"zhuhu/", {
            type: "POST",
            dataType: 'json',
            data: {
                bdcode: selft.attributes.BuildCode
            },
            success: function (ret) {
                layui.table.render({
                    elem: '#tablehu',
                    data: ret,
                    page: true, //开启分页
                    done: function (res, curr, count) {},
                    cols: [
                        [
                            {field:'fangwuhao',
                        title:'房号'},
                            {
                                field: 'H1',
                                title: '户编码'
                            }, {
                                field: 'H2',
                                title: '户类别'
                            }, {
                                field: 'H3_1',
                                title: '应登记人数'
                            }, {
                                fixed: 'right',
                                width: 150,
                                align: 'center',
                                toolbar: '#zhuhubar'
                            } //这里的toolbar值是模板元素的选择器
                        ]
                    ]
                });
            }
        });
    }
    //住户列表编辑删除按钮
    layui.use(['table'], function () {
        layui.table.on('tool(tablehu)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            if (obj.event === 'detail') { //查看
                //do somehing
            } else if (obj.event === 'del') { //删除
                layer.confirm('真的删除行么', function (index) {
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                });
            } else if (obj.event === 'edit') { //编辑
                //do something
                $.ajax({
                    //几个参数需要注意一下
                    type: "GET", //方法类型
                    dataType: "json", //预期服务器返回的数据类型
                    url: serveraddr+"zhuhu/edit/" + obj.data.id, //url
                    success: function (result) {
                        openZhuhuDialog(result,updateZhuhu);
                    },
                    error: function (p1, p2) {
                        layui.layer.msg(p1.responseText);
                    }
                });
                //同步更新缓存对应的值
                //   obj.update({
                //     username: '123'
                //     ,title: 'xxx'
                //   });
            }
        });
    });
    //新增住户
    $('#addhu').click(function () {
        layui.use(['layer', 'table'], function () {
            openZhuhuDialog({
                "fangwuhao":'',
                "H1": '001',
                "H2": 2,
                "H3_1": 1,
                "H4_1": 0,
                "H4_2": 0,
                "H4_3": 0,
                "H4_4": 0,
                "H5": 1,
                "H6": 1,
                "bdcode": selft.attributes.BuildCode
            }, addZhuhu);
            // $.get('zhuhu.htm', {}, function (str) {
            // layui.layer.full(idx);
            // });
        });
    });

    //住户编辑对话框
    function openZhuhuDialog(initdata, yesfunc) {
        var idx = layui.layer.open({
            type: 1,
            shade: 0,
            title: '住户信息',
            area: '450px',
            offset: 'auto',
            content: $('#huedit'),
            success: function () {
                layui.use('form', function () {
                    var form = layui.form;
                    try {
                        form.val("huform", initdata);
                    } catch (e) {
                        console.log(e.message)
                    }
                    form.render();
                });
            },
            btn: ['保存', '关闭'],
            yes: yesfunc,
            btn2: function () { //关闭按钮
            }
        });
    }
    //提交住户数据
    function commitZhuhu(method,msg){
       //处理表单字段
       var formdata = $('#huform').serialize();
       // formdata += '&id='+$('#bdcode').val()+$('input[name="H1"]').val();
       $.ajax({
           //几个参数需要注意一下
           type: "POST", //方法类型
           dataType: "json", //预期服务器返回的数据类型
           url: serveraddr+method, //url
           data: formdata,
           success: function (result) {
               // console.log(result);//打印服务端返回的数据(调试用)
               layui.layer.msg(msg);
               loadZhuhuTable();
           },
           error: function (p1, p2) {
               // console.log(p1);
               layui.layer.msg(p1.responseText);
           }
       });
       layui.layer.close(layui.layer.index);
    }
    //保存新增住户数据
    function addZhuhu() {
        commitZhuhu("zhuhu/save",'添加成功');
    }
    //更新住户数据
    function updateZhuhu(){
        commitZhuhu("zhuhu/update",'更新成功');
    }
    //修改属性
    attInspector.on("attribute-change", function (evt) {
        //store the updates to apply when the save button is clicked
        updateFeature.attributes[evt.fieldName] = evt.fieldValue;
    });

    attInspector.on("next", function (evt) {
        updateFeature = evt.feature;
        // console.log("Next " + updateFeature.attributes.OBJECTID);
    });

    attInspector.on("delete", function (evt) {
        if (confirm("确定删除？") == true) {
            evt.feature.getLayer().applyEdits(null, null, [evt.feature]);
            map.infoWindow.hide();
        }
    });

    map.infoWindow.setContent(attInspector.domNode);
    //地图缩放至建筑物图层
    function FullExtent() {
        //map.setExtent(featureLayer.fullExtent);
        require([
            "esri/graphicsUtils", "dojo/domReady!"
        ], function (graphicsUtils) {
            if (layerBuilding.graphics.length > 0) {
                var myFeatureExtent = graphicsUtils.graphicsExtent(layerBuilding.graphics);
                map.setExtent(myFeatureExtent);
            }
        });
    }

    //图层初始化参数
    function layerpars(DefinitionExpression) {
        this.mode = FeatureLayer.MODE_SNAPSHOT;
        this.outFields = ["*"];
        this.showLabels = false;
        this.minScale = 0;
        this.maxScale = 0;
        this.definitionExpression = DefinitionExpression;
    }

    //激活绘图工具
    function activateDrawTool(tooltype) {
        toolbar.activate(Draw[tooltype]);
        map.hideZoomSlider();
    }
    var haslayerclick = false;
    //生成绘图工具
    function createToolbar(themap) {
        toolbar = new Draw(map);
        toolbar.on("draw-end", addToMap);
        editToolbar = new Edit(map);
        //点击到底图时，取消编辑工具
        map.on("click", function (evt) {
            editToolbar.deactivate();
            if (!haslayerclick) {
                layerBuilding.clearSelection();
            }
            layui.use(['layer'], function () {
                layui.layer.closeAll();
            });
            haslayerclick = false;
        });

        editToolbar.on("deactivate", function (evt) {
            layerBuilding.applyEdits(null, [evt.graphic], null);
        });
    }
    //将绘制完的图形添加到图层
    function addToMap(evt) {
        var symbol;
        toolbar.deactivate();
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
            case "multipoint":
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol();
                break;
        }
        // var graphic = new Graphic(evt.geometry, symbol);
        // map.graphics.add(graphic);

        //var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
        var newGraphic = new Graphic(evt.geometry, null, {
            BuildCode: areacode,
            btype: 0
        });
        layerBuilding.applyEdits([newGraphic], null, null, function () {
            layerbuildingicon.refresh();
        });

        // newGraphic = new Graphic(evt.geometry, null, {BuildCode:areacode,btype:0});
        // layerbuildingicon.applyEdits([newGraphic], null, null);

    }
    //激活编辑工具
    function activateEditTool(graphic) {
        var tool = 0;
        tool = tool | Edit.MOVE;
        tool = tool | Edit.EDIT_VERTICES;
        tool = tool | Edit.SCALE;
        tool = tool | Edit.ROTATE;
        var options = {
            //   allowAddVertices: registry.byId("vtx_ca").checked,
            //   allowDeleteVertices: registry.byId("vtx_cd").checked,
            //   uniformScaling: registry.byId("uniform_scaling").checked
        };
        editToolbar.activate(tool, graphic, options);
    }


});