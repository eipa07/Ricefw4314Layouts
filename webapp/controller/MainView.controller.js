sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     */

    (Controller, Filter, FilterOperator) => {
        "use strict";

        return Controller.extend("report.ricefw.controller.MainView", {
            onInit() {
                this._oModelMp = this.getOwnerComponent().getModel("MpLayoutModel");
                this._oModelImpo = this.getOwnerComponent().getModel("ImpoLayoutModel");
                this._oModelPt = this.getOwnerComponent().getModel("PtLayoutModel");

            },

            onSearchFilters: function () {
                this._oModel = this.getView().getModel("LayoutModel");

                console.log(this._oModel);

                //let oModelBody = this.getView().getModel("mpModel").getData();
                /**
                 * LIFNR - Proveedor
                 * PERNR - Cliente
                 * 
                 */

            },

            onVHParnrRequest: function (oEvent) {
                let sInputValue = oEvent.getSource().getValue();
                this._sInputId = oEvent.getSource().getId();
                if (!this._oVHParnrDialog) {
                    this._oVHParnrDialog = sap.ui.xmlfragment(
                        "report.ricefw.view.fragments.ParnrSelectionDialog",
                        this
                    );
                    this.getView().addDependent(this._oVHParnrDialog);
                }

                // Implement filter functionality
                this._oVHParnrDialog.getBinding("items").filter([new Filter(
                    "PARNR", FilterOperator.Contains, sInputValue
                )]);

                this._oVHParnrDialog.open(sInputValue);
            },

            onVHSearchParnr: function (oEvent) {
                let sValue = oEvent.getParameter("value");

                let _parnr = new Filter(
                    "PARNR", FilterOperator.Contains, sValue
                );
                let _parnrText = new Filter(
                    "PARNRTEXT", FilterOperator.Contains, sValue
                );

                var _filters = new Filter({
                    filters: [_parnr, _parnrText], and: false
                });
                oEvent.getSource().getBinding("items").filter([_filters]);


            },

            onVHCloseParnr: function (oEvent) {
                var SelectedItem = oEvent.getParameter("selectedItem");
                if (SelectedItem) {
                    var oCarridInput = this.getView().byId(this._sInputId);
                    oCarridInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onVHPLifnrRequest: function (oEvent) {
                let sInputValue = oEvent.getSource().getValue();
                this._lifnrInputId = oEvent.getSource().getId();
                if (!this._oVHLifnrDialog) {
                    this._oVHLifnrDialog = sap.ui.xmlfragment(
                        "report.ricefw.view.fragments.LifnrSelectionDialog",
                        this
                    );
                    this.getView().addDependent(this._oVHLifnrDialog);
                }

                // Implement filter functionality
                /* this._oVHLifnrDialog.getBinding("items").filter([ new Filter(
                    "Lifnr", FilterOperator.Contains, sInputValue
                )]); */

                this._oVHLifnrDialog.open(sInputValue);
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

                // Set selected value on Input

            },


        });




    });