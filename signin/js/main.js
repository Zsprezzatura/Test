$(function(){
  
$('#Tsubmit').on('click',function getTsubmit() {
    console.log('点击提交');
    $(function() {
      $.ajax({
        type : "post",
        async: true,
        traditional: true,
        data: {//提交的参数
            'name': $("#name001").val(),
            'type': $("#type001").val(),
            'company': $("#company001").val(),
            'position': $("#position001").val(),
            'phone': $("#phone001").val(),
            'email': $("#email001").val(),
            'activity': '人力资源研讨会',
        }, 
        url: changeUrl.address + '/manager/checkIn/add.do', 
        success: function(res) {
            alert(res.msg)
            window.location.reload();
            console.log(res.msg);
        },

        error: function() {
            alert('发生错误，请求数据失败！');
            
        }
      });
    });
})


layui.use('form', function(){
    var form = layui.form;  
    // 监听提交
    form.on('submit(formDemo)', function(data){
        layer.msg(JSON.stringify(data.field));
        return false;
    });
});


layui.use('table', function(){
  var table = layui.table;
  table.on('tool(user)', function(obj){
    var data = obj.data;
      if(obj.event === 'del'){
        layer.confirm('确认删除此项', function(index){
          obj.del();
          layer.close(index);
        });
      }
      // else if(obj.event === 'detail'){
      else if(obj.event === 'lookQR'){           
            $.ajax({
              type : "POST",
              async: true,
              traditional: true,
              data: {//提交的参数
                  'imageUrl': 'http://qr.liantu.com/api.php?text='+data.token+'',       
              }, 
              url: changeUrl.address + '/activity/get_ticket_image.do', 
              success :   function(msg) {
                  // alert('成功')
                  console.log(msg.data);
                  var imgUrl=msg.data
                  console.log("ajax:"+imgUrl);
                  //ES6写法 layer.alert(`<span>${data.name}</span><br><img class="qrcode" src="${imgUrl}"/>`);
                  layer.alert('<span class="Qrtitle">'+data.name+'</span>' + '<img class="qrcode" src="'+imgUrl+'"/>');
              },
              error: function(err) {
                  alert('发生错误，请求数据失败！');
              }
            });


        // console.log(imgUrl);
        

      } 
      else if(obj.event === 'edit'){
        layer.alert('编辑行：<br>'+ JSON.stringify(data))
        $('#test').text(data.id)
      }
  });
});  


//新增参会信息弹窗
$('#J-add').on('click',function () {
  layui.use('layer', function(){
      layer.open({
          type: 1,
          title: '参会信息-新增',
          shadeClose: false,
          maxmin: true, //开启最大化最小化按钮
          area: [$(window).width()*0.7+'px', $(window).height()*0.9+'px'],
          content: $('#layerForm'),
          success:function (layereo,index) {
              layer.full(index)
          }
      });
  });
})



layui.use(['table','layer'], function(){
  var table = layui.table;
  
  //方法级渲染
  table.render({
    elem: '#LAY_table_user'
    ,url: changeUrl.address+'/manager/checkIn/list.do'
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度
    ,limit:20
    // ,initSort: {
    //   field: 'id' //排序字段，对应 cols 设定的各字段名
    //   ,type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
    // }
    ,request:{
      pageName:'pageNum',
      limitName:'pageSize'
    }
    ,height: 'full-200'
    ,cols: [[//表头
      {field:'id', title: '编号', fixed: true, align:'center'}
      ,{field:'name', title: '姓名', width:120, align:'center'}
      ,{field:'type', title: '嘉宾类型', width:100, templet: '#guest',align:'center'}
      ,{field:'company', title: '公司名称', width:180, align:'center'}
      ,{field:'position', title: '职位', width:150, align:'center'}
      ,{field:'phone', title: '电话', width:140, align:'center'}
      ,{field:'email', title: '邮箱', width:200, align:'center'}
      ,{toolbar: '#imgQR', title: '二维码', event:'lookQR', width:120, align:'center'}
      // ,{field:'token', title: '二维码', event:'lookQR'}
      ,{field:'activity', title: '活动明细', width:160, align:'center'}
      ,{field:'createTime', title: '提交时间', width:180, align:'center'}
      ,{field:'checkinTime', title: '签到时间', width:170, fixed:'right',align:'center'}
      // ,{toolbar: '#barDemo', title: '操作',width:180, align:'center',fixed:'right'} 
    ]]
    ,id: 'testReload'
    ,page: true
    ,height: 600
  });
  var $ = layui.$, active = {
    reload: function(){
      var demoReload = $('#demoReload').val();
      //执行重载
      table.reload('testReload', {
        page: {
          curr: 1 //重新从第 1 页开始
        }
        ,where: { //给接口传的字段
           pageSize:1,
           pageNum:1,
           keyword: demoReload
         }
      });
    }
  };

  $('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });
});
})

