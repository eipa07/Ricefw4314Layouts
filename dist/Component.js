sap.ui.define(["sap/ui/core/UIComponent","report/ricefw/model/models","sap/ui/model/json/JSONModel"],(e,t,i)=>{"use strict";return e.extend("report.ricefw.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");this.getRouter().initialize();this.setModel(t.buildMpModel(),"mpModel")}})});
//# sourceMappingURL=Component.js.map