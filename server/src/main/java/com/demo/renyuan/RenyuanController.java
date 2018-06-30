package com.demo.renyuan;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.mysql.fabric.Response;

import java.io.Console;

import com.demo.common.model.Renyuan;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * BlogController
 * 所有 sql 与业务逻辑写在 Model 或 Service 中，不要写在 Controller 中，养成好习惯，有利于大型项目的开发与维护
 */
@Before(RenyuanInterceptor.class)
public class RenyuanController extends Controller {
	
	RenyuanService service = RenyuanService.me;
	
	public void index() {
		// getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(Renyuan.dao.find("select * from Renyuan where id like '"+getPara("zhuhuid")+"%'"));
		// renderJson(service.paginate(getParaToInt(0, 1), 10).getList());
		// setAttr("blogPage", service.paginate(getParaToInt(0, 1), 10));
		// render("blog.html");
	}
	
	public void add() {
		setAttr("buildcode", getPara("buildcode"));
		renderJson(new Renyuan().setId(getPara("buildcode")));
	}
	
	/**
	 * save 与 update 的业务逻辑在实际应用中也应该放在 serivce 之中，
	 * 并要对数据进正确性进行验证，在此仅为了偷懒
	 */
	@Before(RenyuanValidator.class)
	public void save() {
		// Renyuan Renyuan = getBean(Renyuan.class,"Renyuan");
		Renyuan Renyuan = getModel(Renyuan.class,"");
		Renyuan.setId(Renyuan.getStr("huid")+Renyuan.getStr("R0"));
		Renyuan.save();
		renderJson("{\"msg\":\"ok\"}");
	}
	
	public void edit() {
		renderJson(service.findById(getPara()));
		// setAttr("Renyuan", service.findById(getParaToInt()));
	}
	
	/**
	 * save 与 update 的业务逻辑在实际应用中也应该放在 serivce 之中，
	 * 并要对数据进正确性进行验证，在此仅为了偷懒
	 */
	@Before(RenyuanValidator.class)
	public void update() {
		Renyuan Renyuan = getModel(Renyuan.class,"");
		Renyuan.update();
		// getBean(Renyuan.class).update();
		renderJson("{\"msg\":\"ok\"}");
	}
	
	public void delete() {
		service.deleteById(getParaToInt());
		redirect("/Renyuan");
	}
}


