package com.demo.zhuhu;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.mysql.fabric.Response;

import java.io.Console;

import com.demo.common.model.Zhuhu;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * BlogController
 * 所有 sql 与业务逻辑写在 Model 或 Service 中，不要写在 Controller 中，养成好习惯，有利于大型项目的开发与维护
 */
@Before(ZhuhuInterceptor.class)
public class ZhuhuController extends Controller {
	
	ZhuhuService service = ZhuhuService.me;
	
	public void index() {
		// getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(Zhuhu.dao.find("select * from zhuhu where id like '"+getPara("bdcode")+"%'"));
		// renderJson(service.paginate(getParaToInt(0, 1), 10).getList());
		// setAttr("blogPage", service.paginate(getParaToInt(0, 1), 10));
		// render("blog.html");
	}
	
	public void add() {
		setAttr("buildcode", getPara("buildcode"));
		renderJson(new Zhuhu().setId(getPara("buildcode")));
	}
	
	/**
	 * save 与 update 的业务逻辑在实际应用中也应该放在 serivce 之中，
	 * 并要对数据进正确性进行验证，在此仅为了偷懒
	 */
	@Before(ZhuhuValidator.class)
	public void save() {
		// Zhuhu zhuhu = getBean(Zhuhu.class,"zhuhu");
		Zhuhu zhuhu = getModel(Zhuhu.class,"");
		zhuhu.setId(zhuhu.getBdcode()+zhuhu.getH1());
		zhuhu.save();
		renderJson("{\"msg\":\"ok\"}");
	}
	
	public void edit() {
		renderJson(service.findById(getPara()));
		// setAttr("zhuhu", service.findById(getParaToInt()));
	}
	
	/**
	 * save 与 update 的业务逻辑在实际应用中也应该放在 serivce 之中，
	 * 并要对数据进正确性进行验证，在此仅为了偷懒
	 */
	@Before(ZhuhuValidator.class)
	public void update() {
		Zhuhu zhuhu = getModel(Zhuhu.class,"");
		zhuhu.update();
		// getBean(Zhuhu.class).update();
		renderJson("{\"msg\":\"ok\"}");
	}
	
	public void delete() {
		service.deleteById(getParaToInt());
		redirect("/zhuhu");
	}
}


