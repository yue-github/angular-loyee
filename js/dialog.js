$("#dialog1").on("click",function(){
  layer.open({
type: 1,
skin: 'layui-layer-rim', //加上边框
area: ['1200px', '550px'], //宽高
title:'每日签到',
content:'<div class="dialog_content">\
   <div class="dialog_content_left">\
     <div class="dialog_content_left_title">2017 <span>年</span> 11 <span>月</span></div>\
     <div class="dialog_content_left_content"> \
     <ul>\
       <li></li><li></li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>\
       <li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li>\
       <li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li>\
       <li-1>20</li-1><li-2>21</li-2><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li>\
       <li>27</li><li>28</li><li>29</li><li>30</li><li></li><li></li><li></li>\
       <li></li><li></li><li></li><li></li><li></li><li></li><li></li>\
     </ul>\
     </div>\
   </div>\
   <div class="dialog_content_right">\
     <div class="dialog_content_right_1">今日积分：<span>0</span> <button type="button" name="button">签到</button> </br></div>\
     <div class="dialog_content_right_2">今日积分：<span>7</span> <button type="button" name="button">我的积分</button> </br></div>\
      <div class="dialog_content_right_3"><span>签到规则：</span>以10天为一周期，第一天签到＋1积分，第二天签到＋2积分，第三天签到＋3积分，以此类推，中断签到则重新计算。连续签到达一个周期可达55积分。灰色未签到，绿色已签到。</div>\
    </div>\
 </div>'
 });
})

$("#dialog2").on("click",function(){
  layer.open({
type: 1,
skin: 'layui-layer-rim', //加上边框
area: ['1200px', '550px'], //宽高
title:'每日签到',
content:'<div class="dialog_content">\
   <div class="dialog_content_left">\
     <div class="dialog_content_left_title">2017 <span>年</span> 11 <span>月</span></div>\
     <div class="dialog_content_left_content"> \
     <ul>\
       <li></li><li></li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>\
       <li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li>\
       <li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li>\
       <li-1>20</li-1><li-2>21</li-2><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li>\
       <li>27</li><li>28</li><li>29</li><li>30</li><li></li><li></li><li></li>\
       <li></li><li></li><li></li><li></li><li></li><li></li><li></li>\
     </ul>\
     </div>\
   </div>\
   <div class="dialog_content_right">\
     <div class="dialog_content_right_4">今日积分：<span>0</span> <button type="button" name="button">已签到</button> </br></div>\
     <div class="dialog_content_right_2">今日积分：<span>7</span> <button type="button" name="button">我的积分</button> </br></div>\
      <div class="dialog_content_right_3"><span>签到规则：</span>以10天为一周期，第一天签到＋1积分，第二天签到＋2积分，第三天签到＋3积分，以此类推，中断签到则重新计算。连续签到达一个周期可达55积分。灰色未签到，绿色已签到。</div>\
    </div>\
 </div>'
 });
})


$("#dialog3").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '500px'], //宽高
    title:'添加银行卡',
    content:'<div class="add_card">\
    <div class="add_card_name">姓名：<input type="text" name="" value="" placeholder="请输入姓名"></div>\
    <div class="add_card_idcard">身份证号：<input type="text" name="" value="" placeholder="请输入身份证号码"></div>\
    <div class="add_card_tel">手机号码：<input type="text" name="" value="" placeholder="请输入手机号码"></div>\
    <div class="add_card_pwd">验证码：<input type="text" name="" value="" placeholder="">  <button type="button" name="button">发送验证码</button>\</div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    <div></div>\
            </div>\
    ',
 });
})



$("#dialog5").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '500px'], //宽高
    title:'修改地址',
    content:'<div class="add_card">\
    <div class="add_card_pwd">收货人：<input type="text" name="" value="" placeholder="请输入姓名"></div>\
    <div class="add_card_addr"><p>收货地址：</p> <textarea name="name" rows="8" cols="80"></textarea></div>\
    <div class="add_card_tel">联系方式：<input type="text" name="" value="" placeholder="请输入手机号码"></div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    <div></div>\
            </div>\
    ',
 });
})

$("#up_ground").on("click",function(){
    layer.msg('下架成功', {
    time: 900, //20s后自动关闭
    icon:1
  });
})

$("#delete").on("click",function(){
      layer.msg('删除成功', {
      time: 900, //20s后自动关闭
      icon:2
  });
})
$("#tel_detail").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '460px'], //宽高
    title:'修改手机号码',
    content:'<div class="add_card">\
    <div class="add_card_idcard">旧手机号码：13026115307</div>\
    <div class="add_card_tel">新手机号码：<input type="text" name="" value="" placeholder="请输入手机号码"></div>\
    <div class="add_card_pwd">验证码：<input type="text" name="" value="" placeholder="">  <button type="button" name="button">发送验证码</button>\</div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    <div></div>\
            </div>\
    ',
 });
})
$("#pwd_detail").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '500px'], //宽高
    title:'修改密码',
    content:'<div class="add_card">\
    <div class="new_pwd">新密码：<input type="text" name="" value="" placeholder="请输入新密码" ></div>\
    <div class="add_card_idcard">确认密码：<input type="text" name="" value="" placeholder="再次输入密码"></div>\
    <div class="add_card_tel">手机号码：<input type="text" name="" value="" placeholder="请输入手机号码"></div>\
    <div class="add_card_pwd">验证码：<input type="text" name="" value="" placeholder="">  <button type="button" name="button">发送验证码</button>\</div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    <div></div>\
            </div>\
    ',
 });
})

$("#add_activte").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '500px'], //宽高
    title:'添加促销活动',
    content:'<div class="add_card">\
    <div class="add_card_idcard">活动名称：<input type="text" name="" value="" placeholder="请输入活动名称"></div>\
    <div class="add_card_idcard">开始时间：<input type="text" name="" value="" placeholder="输入开始时间"></div>\
    <div class="add_card_tel">结束时间：<input type="text" name="" value="" placeholder="请输入结束时间"></div>\
    <div class="add_card_addr"><p>活动说明：</p> <textarea name="name" rows="8" cols="80"></textarea></div>\
    <div class="activty">活动图片：<input type="file" name="" value="" placeholder=""> </div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    ',
 });
})
$("#add_express").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '500px'], //宽高
    title:'添加快递',
    content:'<div class="add_card">\
    <div class="add_card_idcard">模板名称：<input type="text" name="" value="" placeholder="请输入模板名称"></div>\
    <div class="goods_addr">商品地址：<select class="" name=""><option value="">湖北</option><option value="">江西</option><option value="">北京</option></select></div>\
    <div class="goods_addr_check">是否包邮：<input type="radio" name="" value="" placeholder=""><span>自定义运费</span><input type="radio" name="" value="" placeholder=""><span>买家承担运费</span></div>\
    <div class="goods_addr_check">计价方式：<input type="radio" name="" value="" placeholder=""><span>按件数</span><input type="radio" name="" value="" placeholder=""><span>按重量</span><input type="radio" name="" value="" placeholder=""><span>按体积</span></div>\
    <div class="goods_addr_check">运送方式：<input type="radio" name="" value="" placeholder=""><span>快递</span><input type="radio" name="" value="" placeholder=""><span>EMS</span><input type="radio" name="" value="" placeholder=""><span>平邮</span></div>\
    <div class="add_card_add"><button type="button" name="button">提交</button></div>\
    ',

 });
})

$("#add_coupn").on("click",function(){
  layer.open({
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['800px', '520px'], //宽高
    title:'添加优惠券',
    content:'<div class="add_coupn">\
    <div class="add_coupn_1">优惠券名称：<input type="text" name="" value="" placeholder="优惠券名称"></div>\
    <div class="add_coupn_1">优惠券类型：<input type="text" name="" value="" placeholder="优惠券名称"></div>\
    <div class="add_coupn_2">优惠劵适用范围：<select class="" name=""><option value="">请选择产品可用范围</option><option value="">江西</option><option value="">北京</option></select></div>\
    <div class="add_coupn_3">可用范围：<select class="" name=""><option value="">请选择优惠劵可用范围</option><option value="">江西</option><option value="">北京</option></select></div>\
    <div class="add_coupn_4">最低购买金额：<input type="text" name="" value="" placeholder="想有折扣的最低购买金额"></div>\
    <div class="add_coupn_1"></div>\
    <div class="add_coupn_5">优惠券开始时间：<input type="text" name="" value="" placeholder="优惠券开始时间"></div>\
    <div class="add_coupn_5">优惠券结束时间：<input type="text" name="" value="" placeholder="优惠券结束时间"></div>\
    <div class="add_coupn_6">PC端领取链接：<input type="text" name="" value="" placeholder="优惠券领取链接"></div>\
    <div class="add_coupn_5">微信端领取链接：<input type="text" name="" value="" placeholder="优惠券领取链接"></div>\
    <div class="add_coupn_1">优惠券数量：<input type="text" name="" value="" placeholder="优惠券名称"></div>\
    <div class="add_coupn_1"></div>\
    <div class="add_coupn_7"> <span>优惠券名称：</span><textarea name="name" rows="8" cols="80"></textarea></div>\
    <button type="button" name="button">提交</button>\
    </div>\
    ',

 });
})
