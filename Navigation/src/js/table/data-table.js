layui.use('table', function(){
    var table = layui.table;
    var data = window._MockData.data;
    console.log(data);
    table.render({
        data:data
        ,elem: '#test'
        ,page:true
        // ,url: '/demo/table/user/'
        // ,url:'http://www.layui.com/demo/table/user'
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,id:'renderReload'
        ,height: 'full-200'
        ,cols: [[
            {field:'id',fixed:true, width:120, title: 'ID',align:'center', sort: true}
            ,{field:'username', width:140, title: '用户名',align:'center'}
            ,{field:'sex', width:100, title: '性别', align:'center',templet: '#sexTpl',sort: true}
            ,{field:'city', width:120, title: '城市',align:'center'}
            ,{field:'sign', title: '签名', align:'center',width: 200, minWidth: 100} //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
            ,{field:'experience', title: '积分', align:'center',sort: true}
            ,{field:'score', title: '评分', align:'center',sort: true,}
            ,{field:'classify', title: '职业',align:'center'}
            ,{field:'wealth', width:140, title: '财富',align:'center', sort: true}
            ,{field:'##', width:200,title: '备注',align:'center'}
            ,{fixed:'right',width:140, align:'center', title:'操作',toolbar:'#barList'}
        ]]
    });
    var $ = layui.$, active = {
        reload: function(){
          // alert(1);
          var demoReload = $('#demoReload').val();

          //执行重载
          table.reload('renderReload', {
            page: {
              curr: 1 //重新从第 1 页开始
            }
            ,where: {
              key: {
                id: demoReload
              }
            }
          });
        }
      };
      
      $('#searchBtn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
      });
});

