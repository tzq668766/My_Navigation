$(document).ready(function(){

	if($.cookie('username') =='' || typeof($.cookie("username")) == 'undefined')
	{
		hidd_sc();
	}
	else
	{
		show_sc();
		my_navigation_url();
		get_category();
	}

	$("#register").click(function(){
		$(".reg-div").css('display','');
		$(".user-login-div").css('display','none');
	});

	$("#login-reg").click(function(){
		$(".reg-div").css('display','none');
		$(".user-login-div").css('display','');
	});

	$("#register-reg").click(function(){
		var reg_username = $("#reg_username").val();
		var reg_password = $("#reg_password").val();
		var auth_code = $("#auth_code").val();

		if (reg_username == '' || typeof(reg_username) == 'undefined') 
		{
			$(".username-reg-div").addClass('has-warning');
			$(".user-reg-msg").removeClass('hide');
			$(".user-reg-msg h6").html('请正确填写信息');
			return false;
		}
		else
		{
			$(".username-reg-div").removeClass('has-warning');
			$(".user-reg-msg").addClass('hide');
		}
		if (reg_password == '' || typeof(reg_password) == 'undefined') 
		{
			$(".password-reg-div").addClass('has-warning');
			$(".user-reg-msg").removeClass('hide');
			$(".user-reg-msg h6").html('请正确填写信息');
			return false;
		}
		else
		{
			$(".password-reg-div").removeClass('has-warning');
			$(".user-reg-msg").addClass('hide');
		}

		$.ajax({
			type: "POST",
			dataType:"json",
			url: "http://cikewang.com/index.php?p=navigation&c=default&a=user_reg",
			data: {"username":reg_username,"password":reg_password,"auth_code":auth_code},
			success: function(data){
				if(data.code < 0)
				{
					$(".user-reg-msg").removeClass('hide');
					$(".user-reg-msg h6").html(data.msg);
				}
				else
				{	
					$(".user-reg-msg h6").removeClass('text-danger');
					$(".user-reg-msg h6").addClass('text-primary');
					$(".user-reg-msg").removeClass('hide');
					$(".user-reg-msg h6").html(data.msg);
					setInterval(function(i){
						$(".reg-div").css('display','none');
						$(".user-login-div").css('display','');
					},3000);

				}
			},
			error:function(data){
				console.log(data);
			}
		});
	});

	// 点击登录按钮 登录
	$("#login").click(function(){
		user_login();
	});
	// 按回车键登录
	var inp = $('input'); 
	inp.keypress(function (e) { 
	    var key = e.which;
	    if (key == 13) {
	       user_login();
	    }
	});

	$("#huoqu").click(function(){
		chrome.tabs.getSelected(function(w){
			$("#web_url").val(w.url);
			$("#web_name").val(w.title);
			$("#web_icon_url").val(w.favIconUrl);
		})
	});

	$("#souchang").click(function(){
		var category = $("#category").val();
		var web_name = $("#web_name").val();
		var web_url = $("#web_url").val();
		var web_icon_url = $("#web_icon_url").val();
		var table = $("input[name='table']:checked").val(); 


		if ($.cookie("uid") == '' || typeof($.cookie("uid")) == 'undefined') 
		{
			$(".sc-msg").removeClass('hide');
			$(".sc-msg h6").html('用户没有登录');
			return false;
		};

		if(table == 1)
		{
			$.ajax({
				type: "POST",
				dataType:"json",
				url: "http://cikewang.com/index.php?p=navigation&c=default&a=add_recommend",
				data: {"uid":$.cookie("uid"),"web_url":web_url,"web_name":web_name,'web_icon_url':web_icon_url,"cate_name":category,"table":table},
				success: function(data){
					if (data.code < 0) 
					{
						$(".sc-msg").removeClass('hide');
						$(".sc-msg h6").html(data.msg);
					}
					else
					{
						$(".sc-msg h6").removeClass('text-danger');
						$(".sc-msg h6").addClass('text-primary');
						$(".sc-msg").removeClass('hide');
						$(".sc-msg h6").html(data.msg);
					}
					setTimeout(function(i){
						$(".sc-msg").addClass('hide');
						$("#web_name").val('');
						$("#web_url").val('');
					},3000);
				}
			});

		} else {
			$.ajax({
				type: "POST",
				dataType:"json",
				url: "http://cikewang.com/index.php?p=navigation&c=default&a=add",
				data: {"uid":$.cookie("uid"),"web_url":web_url,"web_name":web_name,'web_icon_url':web_icon_url,"cate_name":category},
				success: function(data){
					if (data.code < 0) 
					{
						$(".sc-msg").removeClass('hide');
						$(".sc-msg h6").html(data.msg);
					}
					else
					{
						$(".sc-msg h6").removeClass('text-danger');
						$(".sc-msg h6").addClass('text-primary');
						$(".sc-msg").removeClass('hide');
						$(".sc-msg h6").html(data.msg);
					}
					setTimeout(function(i){
						$(".sc-msg").addClass('hide');
						$("#web_name").val('');
						$("#web_url").val('');
					},3000);
				}
			});

		}
		
	});
	
	$('#cate_action').click(function(){
		var title= $(this).attr('title');
		if(title == 'add')
		{
			$('#select_cate_div').html('<input type="text" id="category" name="category" width=20 class="form-control" placeholder="网站分类">')
			$('#cate_action').html('选择分类');
			$(this).attr('title','select');
		}
		else
		{
			get_category();
		}
		

		
	});
	

	$("#loginOut").click(function(){
		$.removeCookie('username');
		$.removeCookie('uid');
		$("#username").val('');
		$("#password").val('');
		$(".user-login-msg").addClass('hide');
		$(".user-login-msg h6").html('');
		hidd_sc();
	});
});

function show_sc()
{
	$(".user-login-div").css("display","none");
	$(".sc-div").css("display","");
}

function hidd_sc()
{
	$(".user-login-div").css("display","");
	$(".sc-div").css("display","none");
}

function my_navigation_url()
{
	url = "http://cikewang.com/"+$.cookie("uid");
	$("#mynavigation").attr("href",url);
}

function user_login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	if(username == '' || typeof(username) == 'undefined')
	{
		$(".username-div").addClass('has-warning');
		$(".user-login-msg").removeClass('hide');
		$(".user-login-msg h6").html('用户名或密码错误');
		return false;
	}
	else
	{
		$(".username-div").removeClass('has-warning');
		$(".user-login-msg").addClass('hide');
	}
	
	if(password == '' || typeof(password) == 'undefined')
	{
		$(".password-div").addClass('has-warning');
		$(".user-login-msg").removeClass('hide');
		$(".user-login-msg h6").html('用户名或密码错误');
		return false;
	}
	else
	{
		$(".password-div").removeClass('has-warning');
		$(".user-login-msg").addClass('hide');
	}
	
	$.ajax({
		type: "POST",
		dataType:"json",
		url: "http://cikewang.com/index.php?p=navigation&c=default&a=user_login",
		data: {"username":username,"password":password},
		success: function(data){
			if (data.code < 0) 
			{
				$(".user-login-msg").removeClass('hide');
				$(".user-login-msg h6").html(data.msg);
			}
			else
			{
				$(".user-login-msg h6").removeClass('text-danger');
				$(".user-login-msg h6").addClass('text-primary');
				$(".user-login-msg").removeClass('hide');
				$(".user-login-msg h6").html('欢迎回来：'+data.msg.username);
				$.cookie('username',data.msg.username, {expires:30});
				$.cookie("uid",data.msg._id, {expires:30});	
				my_navigation_url();

				setTimeout(function(i){
					show_sc();
				},1500);
				
			}
		}
	});
}

function get_category()
{
	$.ajax({
		type: "POST",
		dataType:"json",
		url: "http://cikewang.com/index.php?p=navigation&c=default&a=get_category",
		data: {"uid":$.cookie("uid")},
		success: function(data){
			length = data.length;
			if (length <= 0) 
			{
				return false;
			};
			var str = '<select class="form-control  input-sm select_cate" id="category" name="category">';
			str += "<option value='0'>*请选择已有分类*</option>";
			for (var i = 0; i < length; i++) {
				str += "<option value='"+data[i]['_id']+"'>"+data[i]['cate_name']+"</option>";
			};
			str += '</select>';
			$('#select_cate_div').html(str);
			$('#cate_action').html('添加分类');
			$('#cate_action').attr('title','add');
		}
	});
}