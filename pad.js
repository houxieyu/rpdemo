require([
    "esri/map", 
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/graphic",
    "esri/layers/FeatureLayer",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/_base/event",
    "dojo/parser", 
     "dojo/domReady!"
  ], function(
    Map, Draw, Edit,Graphic,FeatureLayer,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,event,
    parser
  ) {
    parser.parse();
    var map = new Map("map", {
        basemap: "streets",
        center: [-15.469, 36.428],
        zoom: 3
      });
      var fsurl = 'http://124.133.27.90:6080/arcgis/rest/services/sdbj/FeatureServer/';
      var areacode = '370102001001'
      var layerShiBJ = new FeatureLayer(fsurl+"0", new layerpars(''));
      var layerXianBJ = new FeatureLayer(fsurl+"1",  new layerpars('1=2'));
      var layerXiangBJ = new FeatureLayer(fsurl+"2", new layerpars('1=2'));
      var layerCunBJ = new FeatureLayer(fsurl+"3",  new layerpars('1=2'));
      var layerBuilding = new FeatureLayer(fsurl+"4",  new layerpars('1=2'));
      layers = [ layerShiBJ, layerXianBJ, layerXiangBJ, layerCunBJ,layerBuilding];
      layerCunBJ.setDefinitionExpression("AREA_CODE like '"+areacode+"%' or AREA_CODE is null");
      layerBuilding.setDefinitionExpression("AREA_CODE like '"+areacode+"%' or AREA_CODE is null");
      map.addLayers(layers);

      
    map.on("load", createToolbar);
    $('#ui button').click(function(){
        activateTool($(this).attr('data-type'));
    });

    function layerpars(DefinitionExpression) {
        this.mode = FeatureLayer.MODE_SNAPSHOT;
        this.outFields= ["*"];
        this.showLabels= true;
        this.minScale=0;
        this.maxScale=0;
        this.definitionExpression=DefinitionExpression;
    }

    function activateTool(tooltype) {
        toolbar.activate(Draw[tooltype]);
        map.hideZoomSlider();
      }

      function createToolbar(themap) {
        toolbar = new Draw(map);
        toolbar.on("draw-end", addToMap);
        editToolbar = new Edit(map);
        //Activate the toolbar when you click on a graphic
        map.graphics.on("click", function(evt) {
        event.stop(evt);
        activateToolbar(evt.graphic);
        });
        
        //deactivate the toolbar when you click outside a graphic
        map.on("click", function(evt){
        editToolbar.deactivate();
        });
      }

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

      function activateToolbar(graphic) {
        var tool = 0;
        
        // if (registry.byId("tool_move").checked) {
          tool = tool | Edit.MOVE; 
        // }
        // if (registry.byId("tool_vertices").checked) {
          tool = tool | Edit.EDIT_VERTICES; 
        // }
        // if (registry.byId("tool_scale").checked) {
          tool = tool | Edit.SCALE; 
        // }
        // if (registry.byId("tool_rotate").checked) {
          tool = tool | Edit.ROTATE; 
        // }
        // enable text editing if a graphic uses a text symbol
        if ( graphic.symbol.declaredClass === "esri.symbol.TextSymbol" ) {
          tool = tool | Edit.EDIT_TEXT;
        }
        //specify toolbar options        
        var options = {
        //   allowAddVertices: registry.byId("vtx_ca").checked,
        //   allowDeleteVertices: registry.byId("vtx_cd").checked,
        //   uniformScaling: registry.byId("uniform_scaling").checked
        };
        editToolbar.activate(tool, graphic, options);
      }
    });