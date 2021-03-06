/**
 * Created by george.vlada on 20.04.2016.
 */
(function(window, $) {
    "use strict";

    function PhotonJqGrid(parameters) {

        var $this = this;

        var defaultParams = {
            //For options details check here: http://www.trirand.com/jqgridwiki/doku.php?id=wiki:options
            table: '#grid-table',
            pager: '#grid-pager',
            loadtext: '<div class="loader-dots dark"><div class="sk-bounce1"></div><div class="sk-bounce2"></div><div class="sk-bounce3"></div></div>',
            datatype: 'json',
            mtype: 'POST',

            sortable: true,
            viewrecords: true,
            multiSort: true,
            rowNum: 100,
            rowList: [1, 2, 5, 10, 20, 75, 100],
            multiselect: false,
            multiboxonly: true,
            styleUI : 'fontAwesome',
            iconSet: 'fontAwesome',

            shrinkToFit: true,
            autoResizing: { compact: true },
            autowidth: true,
            width: 'auto',
            height: '100%',

            mergeOnPaging: true,
            onPaging: function() {
                var jqGridOverlay = _getJqGridOverlay();
                jqGridOverlay.addClass('custom-overlay');
            },

            mergeLoadComplete: true,
            loadComplete: function () {
                var table = gridOpts.table;
                var jqGridOverlay = _getJqGridOverlay();

                //Display no records message.
                var noRecordsMessage = photonTranslations.listing[photonPageLang].noResults;
                var emptyMessage = $(
                    '<div class="custom-jqgrid-messages-'+ table.id +' custom-jqgrid-no-records-'+ table.id +' alert alert-info no-margin">' +
                        '<i class="fa fa-info-circle"></i>' +
                        noRecordsMessage +
                    '</div>'
                );

                if (typeof table.p != 'undefined' && table.p.reccount === 0) {
                    $('.custom-jqgrid-messages-' + table.id).remove();
                    $('#' + table.id).parent().append(emptyMessage);
                    $('#gbox_'+ table.id +' .ui-jqgrid-pager').addClass('hide');
                } else {
                    $('#gbox_'+ table.id +' .ui-jqgrid-pager').removeClass('hide');
                    $('#'+ table.id ).removeClass('hide');
                    $('.custom-jqgrid-messages-' + table.id).remove();
                }
                jqGridOverlay.removeClass('custom-overlay');

            },
            mergeGridComplete:true,
            gridComplete: function() {
                var jqGridOverlay = _getJqGridOverlay();
                //Make overlay background active
                jqGridOverlay.addClass('custom-overlay');
            },
            caption: 'Listing default caption, please provide "caption" parameter'
        };

        var gridOpts = $.extend({}, defaultParams, parameters || {});

        function _getJqGridOverlay()
        {
            var table = gridOpts.table;
            return $("#lui_" + table.substr(1));
        }

        if (gridOpts.mergeGridComplete && typeof(parameters) !== 'undefined' && typeof(parameters.gridComplete) !== 'undefined') {
            var defaultGridComplete = defaultParams.gridComplete;
            var parametersGridComplete = parameters.gridComplete;
            gridOpts.gridComplete = function () {
                defaultGridComplete();
                parametersGridComplete();
            }
        }

        if (gridOpts.mergeLoadComplete && typeof(parameters) !== 'undefined' && typeof(parameters.loadComplete) !== 'undefined') {
            var defaultLoadComplete = defaultParams.loadComplete;
            var parametersLoadComplete = parameters.loadComplete;
            gridOpts.loadComplete = function () {
                defaultLoadComplete();
                parametersLoadComplete();
            }
        }

        if(gridOpts.mergeOnPaging && typeof (parameters) !== 'undefined' && typeof(parameters.onPaging) !== 'undefined') {
            var defaultOnPaging = defaultParams.onPaging;
            var parametersOnPaging = parameters.onPaging;
            gridOpts.onPaging = function () {
                defaultOnPaging();
                parametersOnPaging();
            }
        }

        this.init = function () {
            $this.grid = $(gridOpts.table).jqGrid(gridOpts);
            var jqGridOverlay = _getJqGridOverlay();
            //The overlay class should be added if data is added through ajax
            if(gridOpts.datatype &&  gridOpts.datatype !== 'jsonstring') {
                jqGridOverlay.removeClass('ui-overlay').addClass('custom-overlay');
            }
        };
    }



    function photonAddGridError(message, gridId){
        if(gridId == undefined || gridId == ''){
            gridId = 'grid-table';
        }
        var customMessage = $(
            '<div class="custom-jqgrid-messages-'+ gridId +' custom-errors-'+ gridId +' alert alert-danger no-margin">' +
            '<i class="fa fa-exclamation-circle"></i>' +
            message +
            '</div>'
        );

        $('.custom-jqgrid-messages-' + gridId).remove();
        $('#' + gridId).parent().prepend(customMessage);
        $('#' + gridId).addClass('hide');
        $('#gbox_'+ gridId +' .ui-jqgrid-pager').addClass('hide');
    }

    function photonResizeGrid() {

        if ($('.ui-jqgrid table').length <= 0) {
            return false;
        }

        var resize = function (index, grid) {
            var width = $(grid).first().parent().width();
            $(grid).find('table').setGridWidth(width);
        };

        setTimeout(function () {
            $('.ui-jqgrid').each(function(index, value) {
                resize(index, value);
            });

        }, 0);

        return true;
    }

    //---- Events ----
    //Resize grid
    $(window).on('resize', function () {
        photonResizeGrid();
    });

    //Resize after closing or opening menu
    $('#toggle-sidebar-size-btn').on('click', function () {
        $(window).trigger('resize');
    });

    //----  Public access to functions ----
    window.PhotonJqGrid = PhotonJqGrid;
    window.photonAddGridError = photonAddGridError;
    window.photonResizeGrid = photonResizeGrid;

}(window, jQuery));