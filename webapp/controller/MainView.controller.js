sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.export.Spreadsheet} Spreadsheet 
     * @param {typeof sap.m.MessageBox} MessageBox
     */

    (Controller, Filter, FilterOperator, JSONModel, Spreadsheet, MessageBox) => {
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
                    "num_parte": "",
                    "visivle_input_invoices": true,
                    "visivle_input_matnr": true,
                    "visivle_input_po": true,
                    "visivle_input_Parnr": true,
                    "visivle_input_lifnr": false,
                    "visivle_input_numParte": false,
                    "tableVirtual": true,
                    "tablePT": false,
                    "tableMP": false

                });
                this.getView().setModel(_requestModel, "requestModel");

                var _mpLayoutModel = new sap.ui.model.json.JSONModel();
                var _ptLayoutModel = new sap.ui.model.json.JSONModel();
                var _virtualLayoutModel = new sap.ui.model.json.JSONModel();
                var _materialesModel = new sap.ui.model.json.JSONModel();
                var _facturasModel = new sap.ui.model.json.JSONModel();

                _mpLayoutModel.loadData("./model/MP_Layout.json", false);
                _ptLayoutModel.loadData("./model/PT_Layout.json", false);
                _virtualLayoutModel.loadData("./model/Virtual_Layout.json", false);
                _materialesModel.loadData("./model/Materiales.json", false);
                _facturasModel.loadData("./model/Facturas.json", false);

                this.getView().setModel(_mpLayoutModel, "_mpLayoutModel");
                this.getView().setModel(_ptLayoutModel, "ptLayoutModel");
                this.getView().setModel(_virtualLayoutModel, "virtualLayoutModel");
                this.getView().setModel(_materialesModel, "materialesModel");
                this.getView().setModel(_facturasModel, "facturasModel");



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
                this._oVHLifnrDialog.getBinding("items").filter([new Filter(
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
                        this.getView().getModel("requestModel").setProperty("/tableVirtual", true);
                        this.getView().getModel("requestModel").setProperty("/tablePT", false);
                        this.getView().getModel("requestModel").setProperty("/tableMP", false);

                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", false);


                    } else if (_layout === "MP") {
                        // Selected Table
                        this.getView().getModel("requestModel").setProperty("/tableMP", true);
                        this.getView().getModel("requestModel").setProperty("/tablePT", false);
                        this.getView().getModel("requestModel").setProperty("/tableVirtual", false);


                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_numParte", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", false);

                    } else if (_layout === "PT") {
                        this.getView().getModel("requestModel").setProperty("/tablePT", true);
                        this.getView().getModel("requestModel").setProperty("/tableMP", false);
                        this.getView().getModel("requestModel").setProperty("/tableVirtual", false);

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
                        "Matnr": selectedItems[i].getKey(),
                        "Text": selectedItems[i].getText()
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
            },

            exportExcel: function (_layoutId) {

                let _validation_flag = this.validations();

                if (_validation_flag) {
                    var _filename;
                    if (!this._oTable) {
                        this._oTable = this.byId(_layoutId);
                    }

                    if (this.getView().getModel("requestModel").getProperty("/tableVirtual")) {
                        _filename = "Layout Expo Virtuales.xlsx";
                    } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {
                        _filename = "Layout MP.xlsx";
                    } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {
                        _filename = "Layout PT.xlsx";
                    }

                    let oTable = this._oTable;
                    let oRowBinding = oTable.getBinding("rows");
                    let aCols = this.getColums(_tabs[0]);
                    let oSettings = {
                        workbook: {
                            columns: aCols,
                            hierarchyLevel: "Level"
                        },
                        dataSource: oRowBinding,
                        fileName: _filename,
                        worker: false // We need to disable worker because we are using a MockServer as OData Service
                    };

                    let oSheet = new Spreadsheet(oSettings);
                    oSheet.build().finally(function () {
                        oSheet.destroy();
                    });
                }




            },


            getColums: function (_layout) {

                if (_layout === _tabs[0]) {
                    let _virtualModel = this.getView().getModel("virtualLayoutModel").getData();
                    var _cols = _virtualModel;
                } else if (_layout === _tabs[1]) {
                    let _mpModel = this.getView().getModel("_mpLayoutModel").getData();
                    _cols = _mpModel;
                } else if (_layout === _tabs[2]) {
                    let _ptModel = this.getView().getModel("ptLayoutModel").getData();
                    _cols = _ptModel;
                }

                return _cols;
            },

            getLayout: function (_layout) {

                var _that = this;
                var _url;
                var _oModelLayout = this.getView().getModel("LayoutModel");

                if (_layout === _tabs[0]) {
                    _url = "/ZZ1_CDS_SEARCH_HELP_LIFNR";
                } else if (_layout === _tabs[1]) {
                    _url = "/ZZ1_CDS_SEARCH_HELP_LIFNR";
                } else if (_layout === _tabs[2]) {
                    _url = "/ZZ1_CDS_SEARCH_HELP_LIFNR";
                }

                _oModelLayout.read(_url, {
                    success: function (oData, Result) {
                        console.log(oData);
                        let _oModel = new JSONModel();
                        _oModel.setData(oData.results);

                        if (_layout === _tabs[0]) {
                            _that.getView().setModel(_oModel, "virtualLayoutModel");
                        } else if (_layout === _tabs[1]) {
                            _that.getView().setModel(_oModel, "mpLayoutModel");
                        } else if (_layout === _tabs[2]) {
                            _that.getView().setModel(_oModel, "ptLayoutModel");
                        }

                        console.log("virtualLayoutModel", _that.getView().getModel("virtualLayoutModel"));
                    }, error: function (oError) {
                        console.log(oError);
                    }
                });



            },


            onSearchFilters: function () {

                let _validation_flag = this.validations();

                if (_validation_flag) {
                    if (this.getView().getModel("requestModel").getProperty("/tableVirtual")) {
                        // clear Model
                        if (this.getView().getModel("mpLayoutModel")) {
                            this.getView().getModel("mpLayoutModel").setData();
                        }
                        if (this.getView().getModel("ptLayoutModel")) {
                            this.getView().getModel("ptLayoutModel").setData();
                        }

                        this.getLayout(_tabs[0]);

                    } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {
                        // clear Model
                        if (this.getView().getModel("virtualLayoutModel")) {
                            this.getView().getModel("virtualLayoutModel").setData();
                        }
                        if (this.getView().getModel("ptLayoutModel")) {
                            this.getView().getModel("ptLayoutModel").setData();
                        }
                        this.getLayout(_tabs[1]);

                    } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {
                        // clear Model
                        if (this.getView().getModel("virtualLayoutModel")) {
                            this.getView().getModel("virtualLayoutModel").setData();
                        }
                        if (this.getView().getModel("mpLayoutModel")) {
                            this.getView().getModel("mpLayoutModel").setData();
                        }
                        this.getLayout(_tabs[2]);
                    }
                }




            },


            validations: function () {

                var _date = this.getView().byId("MainView_DateRangeSelection").getValue();
                var _return = true;

                if (!_date) {
                    _return = false;
                    MessageBox.error("Elegir rango de fecha", {
                        title: "Error",
                        contentWidth: "30%",
                        dependentOn: this.getView()
                    });
                }

                return _return;
            }




        });




    });