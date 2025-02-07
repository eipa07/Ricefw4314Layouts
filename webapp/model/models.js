sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        buildMpModel: function(){
            let oModel = new JSONModel({
                "noParte": "",
                "desc": "",
                "descIngles": "",
                "categoria": "",
                "fracAran": "",
                "faDesperdicio": "",
                "umComercial": "",
                "umTarifa": "",
                "paisDestino": "",
                "costoUnitario": "",
                "pesoKG": "",
                "referencia": "",
                "observaciones": "",
                "fechaEstructura": "",
                "noParteComp": "",
                "unidadComponente": "",
                "unidadComponente": "",
                "cantIncorpodara": "",
                "cantMerma": "",
                "cantDesperdicio": "",
                "fDesde": "",
                "fHasta": "",
            })
        },

    };

});