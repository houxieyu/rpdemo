require([
    "esri/map",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/graphic",
    "esri/layers/FeatureLayer",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/_base/event", "esri/tasks/query", "esri/dijit/AttributeInspector", "dojo/dom-construct", "dijit/form/Button",
    "dojo/parser",
    "dojo/domReady!"
], function (
    Map, Draw, Edit, Graphic, FeatureLayer,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, event, Query, AttributeInspector, domConstruct, Button,
    parser
) {
    parser.parse();
    //初始化底图
    var map = new Map("map", {
        basemap: "streets",
        center: [-15.469, 36.428],
        zoom: 3
    });

    //初始化边界、建筑物图层
    var areacode = '370102008015'
    var layerShiBJ = new FeatureLayer(fsurl + "0", new layerpars('1=2'));
    var layerXianBJ = new FeatureLayer(fsurl + "1", new layerpars('1=2'));
    var layerXiangBJ = new FeatureLayer(fsurl + "2", new layerpars('1=2'));
    //依据区划码，过滤村级边界和建筑物图层
    var layerCunBJ = new FeatureLayer(fsurl + "3", new layerpars("AREA_CODE like '" + areacode + "%' or AREA_CODE is null"));
    var layerBuilding = new FeatureLayer(fsurl + "4", new layerpars("BuildCode like '" + areacode + "%' or BuildCode is null"));
    layers = [layerShiBJ, layerXianBJ, layerXiangBJ, layerCunBJ, layerBuilding];
    map.addLayers(layers);
    //建筑物图层加载完成，将地图缩放至建筑物图层范围
    layerBuilding.on('update-end', function () {
        FullExtent();
    });
    //生成绘图工具
    map.on("load", createToolbar);
    //根据按钮属性，激活相应绘图工具
    var curtool = "";
    $('#ui button,[data-type]').click(function () {
        activateDrawTool($(this).attr('data-type'));
        curtool = "";
        // $('#map *').css("cursor", "default");
    });
    //根据按钮属性，激活编辑工具
    $('#ui button,[data-tool]').click(function () {
        curtool = $(this).attr('data-tool');
        // $('#map *').css("cursor", $(this).attr('data-cursor'));
    });
    //点击到建筑物时，激活编辑工具
    layerBuilding.on("click", function (evt) {
        event.stop(evt);
        if (curtool == 'edit')
            activateEditTool(evt.graphic);
        if (curtool == 'attr') {
            event.stop(evt);
            editToolbar.deactivate();
            layerBuilding.clearSelection();
            var selectQuery = new Query();
            selectQuery.objectIds = [evt.graphic.attributes.OBJECTID];
            layerBuilding.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
                if (features.length > 0) {
                    //store the current feature
                    updateFeature = features[0];
                    map.infoWindow.setTitle('属性编辑');
                    map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
                } else {
                    map.infoWindow.hide();
                }
            });
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
                'label': '建筑物编码:'
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
                'fieldName': 'BuildType',
                'isEditable': true,
                'label': '建筑物类型:'
            },
            {
                'fieldName': 'LAYERNUM',
                'isEditable': true,
                'label': '层数:'
            },
            {
                'fieldName': 'STRUCT',
                'isEditable': true,
                'label': '建筑结构:'
            },
            {
                'fieldName': 'UnitCount',
                'isEditable': true,
                'label': '户数:'
            }
        ]
    }];
    var attInspector = new AttributeInspector({
        layerInfos: layerInfos
    }, domConstruct.create("div"));
    // //add a save button next to the delete button
    // var saveButton = new Button({
    //     label: "保存"
    // }, domConstruct.create("button", {
    //     style: {
    //         color: "red"
    //     }
    // }));
    // domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");

    // saveButton.on("click", function () {
    //     updateFeature.getLayer().applyEdits(null, [updateFeature], null);
    //     map.infoWindow.hide();
    // });

    attInspector.on("attribute-change", function (evt) {
        //store the updates to apply when the save button is clicked
        updateFeature.attributes[evt.fieldName] = evt.fieldValue;
    });

    attInspector.on("next", function (evt) {
        updateFeature = evt.feature;
        console.log("Next " + updateFeature.attributes.OBJECTID);
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
            var myFeatureExtent = graphicsUtils.graphicsExtent(layerBuilding.graphics);
            map.setExtent(myFeatureExtent);
        });
    }

    //图层初始化参数
    function layerpars(DefinitionExpression) {
        this.mode = FeatureLayer.MODE_SNAPSHOT;
        this.outFields = ["*"];
        // this.showLabels= true;
        // this.minScale=0;
        // this.maxScale=0;
        this.definitionExpression = DefinitionExpression;
    }

    //激活绘图工具
    function activateDrawTool(tooltype) {
        toolbar.activate(Draw[tooltype]);
        map.hideZoomSlider();
    }

    //生成绘图工具
    function createToolbar(themap) {
        toolbar = new Draw(map);
        toolbar.on("draw-end", addToMap);
        editToolbar = new Edit(map);
        //点击到底图时，取消编辑工具
        map.on("click", function (evt) {
            editToolbar.deactivate();
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
        var graphic = new Graphic(evt.geometry, symbol);
        // map.graphics.add(graphic);

        //var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
        var newGraphic = new Graphic(evt.geometry, null, {});
        layerBuilding.applyEdits([newGraphic], null, null);

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