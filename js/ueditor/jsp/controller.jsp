<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="com.baidu.ueditor.ActionEnter"
	import="com.alibaba.fastjson.JSON"
	import="java.util.HashMap"
    pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%

    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	String rootPath = application.getRealPath("/");
	


	System.out.println("url1:"+request.getServerName() );
	System.out.println("url2:"+request.getContextPath() );
	
	String s = new ActionEnter( request, rootPath ).exec();
	
	HashMap<String, Object> r = JSON.parseObject(s, HashMap.class);  
	//r.put("url", "http://"+request.getServerName() + ":" +request.getServerPort() + request.getContextPath() + "/" + r.get("url"));
	r.put("url", "http://"+request.getServerName() + ":" +request.getServerPort() + "/" + r.get("url"));

	out.write(JSON.toJSONString(r));
	
%>