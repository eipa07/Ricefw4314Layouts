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

        /**
         * Ordenamiento en cabecera de tablas
         * Filtrar por cabecera
         * Filtrar Proveedores por sociedad
         * 
         * 
         */

        return Controller.extend("report.ricefw.controller.MainView", {
            onInit() {


                let _requestModel = new JSONModel({
                    "fecha": "",
                    "dateFrom": "",
                    "dateTo": "",
                    "invoices": {},
                    "matnr": "", // material
                    "po": "", // Purchase Order - Orden de compra
                    "parnr": "", // Numero de parte
                    "lifnr": "", // Proveedor
                    "visivle_input_invoices": true,
                    "visivle_input_matnr": true,
                    "visivle_input_po": true,
                    "visivle_input_parnr": true,
                    "visivle_input_lifnr": false,
                    "visivle_input_numParte": false,
                    "visivle_input_cliente": false,
                    "tableVE": true,
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
                //_materialesModel.loadData("./model/Materiales.json", false);
                _facturasModel.loadData("./model/Facturas.json", false);

                this.getView().setModel(_mpLayoutModel, "mpColumsModel");
                this.getView().setModel(_ptLayoutModel, "ptColumnsModel");
                this.getView().setModel(_virtualLayoutModel, "veColumnsModel");
                this.getView().setModel("materialesModel");
                this.getView().setModel(_facturasModel, "facturasModel");



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

            onVHLifnrRequest: function (oEvent) {
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

            onVHSearchLifnr: function (oEvent) {
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
                        this.getView().getModel("requestModel").setProperty("/tableVE", true);
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
                        this.getView().getModel("requestModel").setProperty("/tableVE", false);


                        // Show valid Value Help
                        this.getView().getModel("requestModel").setProperty("/visivle_input_lifnr", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_numParte", true);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_po", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_invoices", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_matnr", false);
                        this.getView().getModel("requestModel").setProperty("/visivle_input_Parnr", false);

                    } else if (_layout === "PT") {

                        this._loadRemoteOdataServices();
                        this.getView().getModel("requestModel").setProperty("/tablePT", true);
                        this.getView().getModel("requestModel").setProperty("/tableMP", false);
                        this.getView().getModel("requestModel").setProperty("/tableVE", false);

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
                let _selectedLayout;

                if (_validation_flag) {
                    var _filename;
                    if (!this._oTable) {
                        this._oTable = this.byId(_layoutId);
                    }

                    if (this.getView().getModel("requestModel").getProperty("/tableVE")) {
                        _filename = "Layout Expo Virtuales.xlsx";
                        _selectedLayout = _tabs[0];
                    } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {
                        _filename = "Layout MP.xlsx";
                        _selectedLayout = _tabs[1];
                    } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {
                        _filename = "Layout PT.xlsx";
                        _selectedLayout = _tabs[2];
                    }

                    let oTable = this._oTable;
                    let oRowBinding = oTable.getBinding("rows");
                    let aCols = this.getColums(_selectedLayout);
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

                var _cols;

                if (_layout === _tabs[0]) {
                    _cols = this.getView().getModel("veColumnsModel").getData();

                } else if (_layout === _tabs[1]) {
                    _cols = this.getView().getModel("mpColumsModel").getData();

                } else if (_layout === _tabs[2]) {
                    _cols = this.getView().getModel("ptColumnsModel").getData();
                }

                return _cols;
            },

            getLayout: function (_layout, _oModelLayout) {

                var _that = this;
                var _params = this.getUrlFilters(_layout);

                _oModelLayout.read(_params[0].url, {
                    filters: _params[0].filters,
                    success: function (oData, Result) {
                        console.log(oData);
                        let _oModel = new JSONModel();
                        _oModel.setData(oData.results);

                        if (_layout === _tabs[0]) {
                            _that.getView().setModel(_oModel, "veLayoutModel");
                        } else if (_layout === _tabs[1]) {
                            _that.getView().setModel(_oModel, "mpLayoutModel");
                        } else if (_layout === _tabs[2]) {
                            _that.getView().setModel(_oModel, "ptLayoutModel");
                        }
                    }, error: function (oError) {
                        console.log(oError);
                    }
                });
            },

            /**
             * Building url for request
             * Building filters for request
             * This function returns two objects: 
             * URL => Entity with range of date
             * Filters => selected data to filter the content of tables
             */

            getUrlFilters: function (_layout) {
                var _requestModel = this.getView().getModel("requestModel").getData();
                var _params = [];
                var _url;

                // Calculate p_fecha Param
                let _dateFrom = new Date(_requestModel.dateFrom);
                let _monthFrom = parseInt(_dateFrom.getMonth()) + 1;
                _monthFrom = _monthFrom <= 9 ? "0" + _monthFrom.toString() : _monthFrom.toString();
                let _dayFrom = parseInt(_dateFrom.getDate());
                _dayFrom = _dayFrom <= 9 ? "0" + _dayFrom.toString() : _dayFrom.toString();
                let _dFrom = _dateFrom.getFullYear().toString() + _monthFrom.toString() + _dayFrom;

                let _dateTo = new Date(_requestModel.dateTo);
                let _monthTo = parseInt(_dateTo.getMonth()) + 1;
                _monthTo = _monthTo <= 9 ? "0" + _monthTo.toString() : _monthTo.toString();
                let _dayTo = parseInt(_dateTo.getDate());
                _dayTo = _dayTo <= 9 ? "0" + _dayTo.toString() : _dayTo.toString();
                let _dTo = _dateTo.getFullYear().toString() + _monthTo.toString() + _dayTo;

                let _dateParam = _dFrom + "|" + _dTo;


                // Filters
                var aFilters = [];

                if (_layout === _tabs[0]) {
                    _url = "/ZZ1_CDS_LAYOUT_EV(p_fecha='" + _dateParam + "')/Set?";


                } else if (_layout === _tabs[1]) {
                    _url = "/ZZ1_CDS_LAYOUT_MP(p_fecha='" + _dateParam + "')/Set?";

                    if (_requestModel.parnr) {
                        aFilters.push(new Filter("Parnr", FilterOperator.EQ, _requestModel.parnr));
                    }
                    if (_requestModel.lifnr) {
                        aFilters.push(new Filter("Lifnr", FilterOperator.EQ, _requestModel.lifnr));
                    }


                } else if (_layout === _tabs[2]) {
                    _url = "/ZZ1_CDS_LAYOUT_PT(p_fecha='" + _dateParam + "')/Set?";
                    var _parnrItems = this.getView().byId("MainView_MultiComboBox_01").getSelectedItems();
                    if (_parnrItems.length > 0) {
                        _parnrItems.forEach((element) =>
                            aFilters.push(new Filter("Parnr", FilterOperator.EQ, element.getKey()))
                        );
                    }

                }

                _params.push([{
                    "url": _url,
                    "filters": aFilters
                }]);

                return _params[0];


            },


            onSearchButton: function () {

                let _validation_flag = this.validations();
                var _oModelLayout;

                if (_validation_flag) {
                    if (this.getView().getModel("requestModel").getProperty("/tableVE")) {
                        // set Model features
                        _oModelLayout = this.getView().getModel("VE_LayoutService");
                        if (this.getView().getModel("mpLayoutModel")) {
                            this.getView().getModel("mpLayoutModel").setData();
                        }
                        if (this.getView().getModel("ptLayoutModel")) {
                            this.getView().getModel("ptLayoutModel").setData();
                        }

                        this.getLayout(_tabs[0], _oModelLayout);

                    } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {
                        // set Model features
                        _oModelLayout = this.getView().getModel("MP_LayoutService");

                        if (this.getView().getModel("veLayoutModel")) {
                            this.getView().getModel("veLayoutModel").setData();
                        }
                        if (this.getView().getModel("ptLayoutModel")) {
                            this.getView().getModel("ptLayoutModel").setData();
                        }
                        this.getLayout(_tabs[1], _oModelLayout);

                    } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {
                        // set Model features
                        _oModelLayout = this.getView().getModel("PT_LayoutService");
                        if (this.getView().getModel("veLayoutModel")) {
                            this.getView().getModel("veLayoutModel").setData();
                        }
                        if (this.getView().getModel("mpLayoutModel")) {
                            this.getView().getModel("mpLayoutModel").setData();
                        }
                        this.getLayout(_tabs[2], _oModelLayout);
                    }
                }




            },


            validations: function () {

                var _date = this.getView().byId("MainView_DateRangeSelection").getValue();
                var _return = true;

                if (!_date) {
                    _return = false;
                    MessageBox.error("Elegir rango de fecha valido", {
                        title: "Error",
                        contentWidth: "30%",
                        dependentOn: this.getView()
                    });
                }

                return _return;
            },


            /**
             * set filters by selected layout
             */
            setFilters: function () {

                var aFilters = this.setFilters();



                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, "1"));
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, "2"));
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, "11"));


                if (this.getView().getModel("requestModel").getProperty("/tableVE")) {



                } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {


                    let _lifnr = this.getView().getModel("requestModel").getProperty("/lifnr");
                    if (_lifnr) {
                        aFilters.push(new Filter("Lifnr", FilterOperator.EQ, _lifnr));
                    }


                } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {




                }

            },

            onDateChange: function (oEvent) {
                var sFrom = oEvent.getParameter("from"),
                    sTo = oEvent.getParameter("to"),
                    bValid = oEvent.getParameter("valid"),
                    oEventSource = oEvent.getSource();

                if (oEvent.getParameter("valid")) {
                    this.getView().getModel("requestModel").setProperty("/dateFrom", sFrom);
                    this.getView().getModel("requestModel").setProperty("/dateTo", sTo);
                } else {
                    MessageBox.error("Elegir rango de fecha valido", {
                        title: "Error",
                        contentWidth: "30%",
                        dependentOn: this.getView()
                    });
                }

            },

            /**
             * Call oData Services for PT and Virtual Layouts
             * 
             * 
             */
            _loadRemoteOdataServices: function () {

                var _PT_ModelService = this.getView().getModel("PT_LayoutService");
                var _that = this;
                //var _Virtual_ModelService = this.getView().getModel("Virtual_LayoutModel");


                _PT_ModelService.read("/ZZ1_CDS_SEARCH_HELP_PARNR/?", {
                    success: function (oData, Result) {

                        console.log(oData);
                        let _oModel = new JSONModel();
                        _oModel.setData(oData.results);
                        _that.getView().setModel(_oModel, "materialesModel");

                    }, error: function (oError) {
                        console.log(oError);
                    }
                });


            },

            clearTable: function (_tableID) {

                if (this.getView().getModel("requestModel").getProperty("/tableVE")) {

                    if (this.getView().getModel("veLayoutModel")) {
                        this.getView().getModel("veLayoutModel").setData();
                    }

                } else if (this.getView().getModel("requestModel").getProperty("/tableMP")) {
                    if (this.getView().getModel("mpLayoutModel")) {
                        this.getView().getModel("mpLayoutModel").setData();
                    }

                } if (this.getView().getModel("requestModel").getProperty("/tablePT")) {

                    if (this.getView().getModel("ptLayoutModel")) {
                        this.getView().getModel("ptLayoutModel").setData();
                    }


                }

            }




        });




    });