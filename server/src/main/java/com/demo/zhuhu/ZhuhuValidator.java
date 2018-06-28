package com.demo.zhuhu;

import com.demo.common.model.Zhuhu;
import com.jfinal.core.Controller;
import com.jfinal.validate.Validator;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * BlogValidator.
 */
public class ZhuhuValidator extends Validator {
	
	protected void validate(Controller controller) {
		// validateRequiredString("zhuhu.title", "titleMsg", "请输入zhuhu标题!");
		// validateRequiredString("zhuhu.content", "contentMsg", "请输入zhuhu内容!");
	}
	
	protected void handleError(Controller controller) {
		controller.keepModel(Zhuhu.class);
		
		String actionKey = getActionKey();
		if (actionKey.equals("/zhuhu/save"))
			controller.render("add.html");
		else if (actionKey.equals("/zhuhu/update"))
			controller.render("edit.html");
	}
}
