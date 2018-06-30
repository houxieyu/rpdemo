package com.demo.renyuan;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * RenyuanInterceptor
 * 此拦截器仅做为示例展示，在本 demo 中并不需要
 */
public class RenyuanInterceptor implements Interceptor {
	
	public void intercept(Invocation inv) {
		System.out.println("Before invoking " + inv.getActionKey());
		try{
		inv.invoke();}
		catch(Exception e){
			inv.getController().renderText(e.getMessage());
		}
		System.out.println("After invoking " + inv.getActionKey());
	}
}
