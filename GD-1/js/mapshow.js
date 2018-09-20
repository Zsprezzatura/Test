window.onload = function(){
	//自定义弹框
	function alert(e){
		$("body").append("<div id='msg'><span>"+e+"</span></div>");
		clearmsg();
		function clearmsg(){
			var t = setTimeout(function(){
	    		$("#msg").remove();//2秒后移除msg
			},2000)

		var freeze = document.getElementById('msg');
		freeze.addEventListener('mouseover', function(){
	  		clearTimeout(t);
		},false);

		freeze.addEventListener('mouseout',function(){
	  		t = setTimeout(function(){
	    		freeze.remove();
	  		}, 1000);
		})
	  }
	}





	//固定导航栏
	$(document).ready(function() {
	    var navOffset=$("#topbar").offset().top;
	    $(window).scroll(function(){
	        var scrollPos=$(window).scrollTop();
	        if(scrollPos >=navOffset){
	            $("#topbar").addClass("fixed");
	            $("#banner").addClass("full");
	        }else{
	            $("#topbar").removeClass("fixed");
	            $("#banner").removeClass("full");
	        }
	    });
	});


	//意见反馈按钮
	$('.box-feed').on('click', function(){
		window.open('http://data.xinxueshuo.cn/nsi/user/feedback.html');
	})
//*************************************************************************************
	//初始化地图
	var lnglat = [107.000923,31.675807];
	// var cluster,markers = [];
    var map = new AMap.Map('container', {
    	key: 'c737f6ccf394887656c97b0c4b0c9b48',
	    mapStyle: 'amap://styles/9e53a5fba6a3cba689cb072a1a9df5c5',
	    center:lnglat,
	    zoom:16
    });
    map.setDefaultCursor("crosshair");

	let address = new Array();
	let schools = new Array();
	let cour = new Array();
	let sys = new Array();
	let prop = new Array();
	let kk = new Array();
	let lng = new Array();
	let lat = new Array();
	let pic = [];
	//获取数据
    $.ajax({
        type : "get",
        async:false,
        url:changeUrl.address+ '/visualization/get_school_list.do', //'/school/list.do',
        data:{
            data:''
        },
        dataType : "json",//数据类型为json
        jsonp: "Callback",//服务端用于接收callback调用的function名的参数  
        success : function(ev){
            var xx = ev.data;
            console.log(xx);
            for (let i = 0; i < xx.length; i++) {
            	address[i] = xx[i].areas + xx[i].areas02 + xx[i].areas03;//学校地址
            	schools[i] = xx[i].schoolName;//学校名
            	sys[i] = xx[i].schoolSystem;//学段
            	cour[i] = xx[i].course;//国际课程
            	prop[i] = xx[i].schoolProperties;//办学类型
            	kk[i] = xx[i].id;//学校id
            	lng[i] = xx[i].longitude;//经度
            	lat[i] = xx[i].latitude;//纬度
            	pic[i] = xx[i].schoolLogo;//学校logo
            	if (lng[i] == null) {
            		geocoder(address[i],schools[i],kk[i], function(resData,school,id){
            			geocoder_CallBack(resData,school,id)
            		});           	
            	}else{
            		addMarker(i, [lng[i],lat[i]], schools[i]);

            	}
            }
            // console.log(address);
        },//success结束
    });//Ajax结束

    function geocoder(name,school,id,callback) {
        var geocoder = new AMap.Geocoder({
            city: "100", //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(name, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result,school,id);
                // console.log(result);		                
            }		                    
        });
    }

    function geocoder_CallBack(data,school,id) {

    	var geocode = data.geocodes;
    	for (var i = 0; i < geocode.length; i++) {

    		setLnglat(id, geocode[i].location.getLng(), geocode[i].location.getLat());

    		addMarker(i, geocode[i],school);
    	}
    }

    function setLnglat(id, lng, lat){
    	$.ajax({
    	  type : "post",
    	  async: true,
    	  traditional: true,
    	  data: {//提交的参数
    	      'schoolId': id,
      	      'longitude': lng,
    	      'latitude': lat
    	  }, 
    	  url: changeUrl.address + '/visualization/add.do', 
    	  success: function(res) {

    	      console.log(res.msg);
    	  },

    	  error: function() {
    	      console.log('发生错误，请求数据失败！');
    	      
    	  }
    	});
    }
    console.log(map.getZoom());

	function addMarker(i, n,school,id) {
		var marker = new AMap.Marker({
			map: map,
			position: [lng[i],lat[i]],
			// position: [n.location.getLng(), n.location.getLat()],
			content: '<div class="contter"></div>',
			offset: new AMap.Pixel(0,0)
		});
		
		// function refresh() {

		//     var zoom = map.getZoom();
		    
		//     //获取 pointStyle
		//     var markerPoint = $('#contter');

		//     //根据当前zoom调整点的尺寸
		//     markerPoint.width = markerPoint.height = 2 * Math.pow(1.2, map.getZoom() - 3);
		// }
		// map.on('zoomend', function() {
		//     refresh();
		// });
		// refresh();

		//实例化信息窗体
	    var title = school, content = [];
	    if (pic[i] == null) {
	    	content.push("<img src='http://data.xinxueshuo.cn/nsi/assets/img/schoolNoPic.png'><div id='content-box'>地址：" + address[i]);
	    }else{
	    	content.push("<img src='' class='img'><div id='content-box'>地址：" + address[i]);
	    }
	    // content.push("电话：");
	    content.push("类型：" + prop[i])
	    content.push("学制：" + sys[i])
	    content.push("国际课程：" + cour[i]+'</div>')
	    content.push("<a target='_blank' href='http://data.xinxueshuo.cn/nsi/school/detail.html?School_name= " + kk[i] + "&whereFrom=search'>查看详情</a>");

	    var infoWindow = new AMap.InfoWindow({
	        isCustom: true,  //使用自定义窗体
	        content: createInfoWindow(title, content.join("<br/>")),
	        offset: new AMap.Pixel(20, -8)
	    });

	    //构建自定义信息窗体
	    function createInfoWindow(title, content) {
	        var info = document.createElement("div");
	        info.className = "info";

	        // 定义顶部标题
	        var top = document.createElement("div");
	        var titleD = document.createElement("div");
	        var closeX = document.createElement("img");
	        top.className = "info-top";
	        titleD.innerHTML = title;
	        closeX.src = "./images/close.svg"
	        closeX.onclick = closeInfoWindow;
	        top.appendChild(titleD);
	        top.appendChild(closeX);
	        info.appendChild(top);

	        // 定义中部内容
	        var middle = document.createElement("div");
	        middle.className = "info-middle";
	        middle.innerHTML = content;
	        info.appendChild(middle);

	        // 定义底部内容
	        var bottom = document.createElement("div");
	        bottom.className = "info-bottom";
	        bottom.style.position = 'relative';
	        var sharp = document.createElement("img");
	        // sharp.className = "info-bottom-arrow";
	        var sharp = document.createElement("img");
	        sharp.src = "./images/sharp.png";
	        bottom.appendChild(sharp);
	        info.appendChild(bottom);
	        return info;
	    }
	    //打开信息窗体
		marker.on("mouseover", function(e) {
			// debugger;
			var imgSrc = 'http://data.xinxueshuo.cn'+pic[i]
			
			infoWindow.open(map, marker.getPosition());
			pic[i] && setTimeout(function(){//需异步存储，不然同步不能加载
				$('.img').attr('src',imgSrc);
			}, 0);
			
		});
	    //关闭信息窗体
        function closeInfoWindow() {
            map.clearInfoWindow();
        }

	}



	
	
    var colors = [
    	'#9e9e9e', '#efc47e', '#f3ad6a', '#f7945d', '#f97b57', '#f66356', '#ee4d5a', "#3366cc", 
    	"#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", 
    	"#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", 
    	// "#329262", "#5574a6", "#3b3eac"
        ];
    AMapUI.load(['ui/geo/DistrictExplorer','ui/geo/DistrictCluster', 'lib/$'], function(DistrictExplorer,DistrictCluster,$) {
	    //创建实例
	    var districtExplorer = new DistrictExplorer({
	        eventSupport: true,//启用事件支持
	        map: map
	    });
	    //当前聚焦的区域
	    var currentAreaNode = null;

	    //创建一个辅助Marker，鼠标hover提示内容
	    var tipMarkerContent = $('#tipMarker');

	    var tipMarker = new AMap.Marker({
	        content: tipMarkerContent.get(0),
	        offset: new AMap.Pixel(0, 0),
	        bubble: true //启用冒泡，否则click事件会被marker自己拦截
	    });

	    //根据Hover状态设置相关样式
	    function toggleHoverFeature(feature, isHover, position) {

	        tipMarker.setMap(isHover ? map : null);

	        if (!feature) {
	            return;
	        }

	        var props = feature.properties;
	        
	        if (isHover) {
	            //更新提示内容
	            // tipMarkerContent.html(props.adcode + ': ' + props.name);
	            tipMarkerContent.html(props.name);
	            //更新位置
	            tipMarker.setPosition(position || props.center);
	        }

	        //更新相关多边形的样式,鼠标划到地图上区域样式透明度改变
	        var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
	        for (var i = 0, len = polys.length; i < len; i++) {

	            polys[i].setOptions({
	            	fillOpacity: isHover ? 0.2 : 0.5
	            });
	        }
	    }

	    //监听feature的hover事件
	    districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
	        toggleHoverFeature(feature, e.type === 'featureMouseover',
            e.originalEvent ? e.originalEvent.lnglat : null);
	    });

	    //监听鼠标在feature上滑动
	    districtExplorer.on('featureMousemove', function(e, feature) {
	        //更新提示位置
	        tipMarker.setPosition(e.originalEvent.lnglat);
	    });

	    //feature被点击*****************************************************************************
	    districtExplorer.on('featureClick', function(e, feature) {
	    	var props = feature.properties;

	            //如果存在子节点
	            if (props.childrenNum > 0) {
	                //切换聚焦区域
	                switch2AreaNode(props.adcode);
	            }	        
	    });
	    //*****************************************************************点击绘制后区域，绑定事件

	    //外部区域被点击
	    // districtExplorer.on('outsideClick', function(e) {

	    //     alert('区域外点击');
	    // });
	    districtExplorer.on('outsideClick', function(e) {

	        districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

	            if (routeFeatures && routeFeatures.length > 1) {
	                //切换到省级区域
	                switch2AreaNode(routeFeatures[1].properties.adcode);
	            } else {
	                //切换到全国
	                switch2AreaNode(100000);
	            }
	        }, 
	        {
	            levelLimit: 2
	        });
	        alert('区域外点击');
	    });

	    //绘制某个区域的边界
	    function renderAreaPolygons(areaNode) {
	        //更新地图视野
	        map.setBounds(areaNode.getBounds(), null, null, true);
	        //清除已有的绘制内容
	        districtExplorer.clearFeaturePolygons();

	        
	        
	        //绘制子区域
            districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                // var fillColor = colors[i%colors.length];
                var fillColor = colors[0];
                // var strokeColor = colors[colors.length - 1 - i % colors.length];//线颜色               
                return {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 0.2, //线宽
                    fillColor: fillColor, //填充色
                    fillOpacity: 0.5, //填充透明度
                };
            });

	        //绘制父区域
	        districtExplorer.renderParentFeature(areaNode, {
	            cursor: 'default',
	            bubble: true,
	            strokeColor: 'black', //线颜色
	            strokeOpacity: 0.8, //线透明度
	            strokeWeight: 0.3, //线宽
	            fillColor: null, //填充色
	            fillOpacity: 0.2, //填充透明度
	        });
		}
		//切换区域后刷新显示内容
		function refreshAreaNode(areaNode) {

		    districtExplorer.setHoverFeature(null);

		    renderAreaPolygons(areaNode);
		}

		//切换区域
		function switch2AreaNode(adcode, callback) {

		    if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
		        return;
		    }

		    loadAreaNode(adcode, function(error, areaNode) {

		        if (error) {

		            if (callback) {
		                callback(error);
		            }

		            return;
		        }

		        currentAreaNode = window.currentAreaNode = areaNode;

		        //设置当前使用的定位用节点
		        districtExplorer.setAreaNodesForLocating([currentAreaNode]);

		        refreshAreaNode(areaNode);

		        if (callback) {
		            callback(null, areaNode);
		        }
		    });
		}

		//加载区域
		function loadAreaNode(adcode, callback) {

		    districtExplorer.loadAreaNode(adcode, function(error, areaNode) {

		        if (error) {

		            if (callback) {
		                callback(error);
		            }

		            console.error(error);

		            return;
		        }

		        // renderAreaPanel(areaNode);

		        if (callback) {
		            callback(null, areaNode);
		        }
		    });
		}
		//全国
		map.setFitView(districtExplorer.getAllFeaturePolygons());//调整地图视野
		switch2AreaNode(100000);
	});

	// 	},//success结束
	// });//Ajax结束



			//**************************************************************************************************
	

	




}

