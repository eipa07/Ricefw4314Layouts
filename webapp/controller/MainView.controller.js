sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     */

    (Controller, Filter, FilterOperator, JSONModel) => {
        "use strict";

        var _tabs = ["VIRTUAL", "MP", "PT"];

        return Controller.extend("report.ricefw.controller.MainView", {
            onInit() {

                let _requestModel = new JSONModel({
                    "fecha": "",
                    "invoices": "",
                    "matnr": "", // material
                    "po": "", // Purchase Order - Orden de compra
                    "Parnr": "", // Cliente
                    "lifnr": "", // Proveedor
                    "layoutMP": false,
                    "layoutPT": false,
                    "layoutVirtual": true,
                    "visivle_input_invoices": true,
                    "visivle_input_matnr": true,
                    "visivle_input_po": true,
                    "visivle_input_Parnr": true,
                    "visivle_input_lifnr": false,
                    "visivle_input_numParte": false
                });
                this.getView().setModel(_requestModel, "requestModel");

                this._oModelMp = this.getOwnerComponent().getModel("MpLayoutModel");
                this._oModelImpo = this.getOwnerComponent().getModel("ImpoLayoutModel");
                this._oModelPt = this.getOwnerComponent().getModel("PtLayoutModel");

            },

            onSearchFilters: function () {

                let _layoutModel = this.getView().getModel("LayoutModel")
                let _requestModel = this.getView().getModel("requestModel");



            },

            onVHParnrRequest: function (oEvent) {
                let sInputValue_Parnr = oEvent.getSource().getValue();
                this._parnrInputId = oEvent.getSource().getId();
                if (!this._oVHParnrDialog) {
                    this._oVHParnrDialog = sap.ui.xmlfragment(
                        "report.ricefw.view.fragments.ParnrSelectionDialog",
                        this
                    );
                    this.getView().addDependent(this._oVHParnrDialog);
                }

                // Implement filter functionality
                this._oVHParnrDialog.getBinding("items").filter([new Filter(
                    "Parnr", FilterOperator.Contains, sInputValue_Parnr
                )]);

                this._oVHParnrDialog.open(sInputValue_Parnr);
            },

            onVHSearchParnr: function (oEvent) {
                let sValue = oEvent.getParameter("value");

                let _parnr = new Filter(
                    "Parnr", FilterOperator.Contains, sValue
                );
                let _parnrName = new Filter(
                    "ParnrDescription", FilterOperator.Contains, sValue
                );

                var _filters = new Filter({
                    filters: [_parnr, _parnrName], and: false
                });
                oEvent.getSource().getBinding("items").filter([_filters]);


            },

            onVHCloseParnr: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var _parnr = this.getView().byId(this._parnrInputId);
                    _parnr.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onVHPLifnrRequest: function (oEvent) {
                let sInputValue_lifnr = oEvent.getSource().getValue();
                this._lifnrInputId = oEvent.getSource().getId();
                if (!this._oVHLifnrDialog) {
                    this._oVHLifnrDialog = sap.ui.xmlfragment(
                        "report.ricefw.view.fragments.LifnrSelectionDialog",
                        this
                    );
                    this.getView().addDependent(this._oVHLifnrDialog);
                }

                // Implement filter functionality
                 this._oVHLifnrDialog.getBinding("items").filter([ new Filter(
                    "Lifnr", FilterOperator.Contains, sInputValue_lifnr
                )]); 

                this._oVHLifnrDialog.open(sInputValue_lifnr);
            },

            onVHpSearchLifnr: function (oEvent) {
                let sValue = oEvent.getParameter("value");

                let _lifnr = new Filter(
                    "Lifnr", FilterOperator.Contains, sValue
                );
                let _lifnrName = new Filter(
                    "LifnrName", FilterOperator.Contains, sValue
                );

                var _filters = new Filter({
                    filters: [_lifnr, _lifnrName], and: false
                });
                oEvent.getSource().getBinding("items").filter([_filters]);
            },

            onVHCloseLifnr: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var _lifnr = this.getView().byId(this._lifnrInputId);
                    _lifnr.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            _selectLayout: function (oEvent) {
                let _layout = oEvent.getSource().getSelectedKey()
                console.log(_layout);

                if (_tabs.filter(function (e) { return e === _layout }).length > 0) {
                    console.log(true);
                    if (_layout === "VIRTUAL") {
                        /* this.getView().getModel("requestModel").setProperty("/VIRTUAL", true);
                        this.getView().getModel("requestModel").setProperty("/PT", false);
                        this.getView().getModel("requestModel").setProperty("/MP", false); */

                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", false);


                    } else if (_layout === "MP") {
                        /* this.getView().getModel("requestModel").setProperty("/MP", false);
                        this.getView().getModel("requestModel").setProperty("/PT", false);
                        this.getView().getModel("requestModel").setProperty("/VIRTUAL", false); */

                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_numParte", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", false);

                    } else if (_layout === "PT") {
                        /* this.getView().getModel("requestModel").setProperty("/PT", false);
                        this.getView().getModel("requestModel").setProperty("/MP", false);
                        this.getView().getModel("requestModel").setProperty("/VIRTUAL", false); */

                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_numParte", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", false);
                    }

                }
            },

            matnrSelectionFinish: function (oEvent) {

                this.getView().getModel("requestModel").setProperty("/matnr", "");
                var selectedItems = oEvent.getParameter("selectedItems");
                let _matnrSelection = new Array();


                for (var i = 0; i < selectedItems.length; i++) {
                    let _selection = {
                        "matnr": selectedItems[i].getKey(),
                        "matnrrName": selectedItems[i].getText()
                    }
                    _matnrSelection.push(_selection);

                }
                this.getView().getModel("requestModel").setProperty("/matnr", _matnrSelection);
                console.log("fin matnr", this.getView().getModel("requestModel").getProperty("/matnr"));
            },

            invoicesSelectionFinish: function (oEvent) {

                this.getView().getModel("requestModel").setProperty("/invoices", "");
                var selectedItems = oEvent.getParameter("selectedItems");
                let _invoiceSelection = new Array();


                for (var i = 0; i < selectedItems.length; i++) {
                    let _selection = {
                        "invoice": selectedItems[i].getKey(),
                        "invoiceName": selectedItems[i].getText()
                    }
                    _invoiceSelection.push(_selection);

                }
                this.getView().getModel("requestModel").setProperty("/invoices", _invoiceSelection);
                console.log("fin matnr", this.getView().getModel("requestModel").getProperty("/invoices"));
            }


        });




    });