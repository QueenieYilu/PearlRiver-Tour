(function($) {
    "use strict";
    var calendarSwitch = (function() {
        function calendarSwitch(element, options) {
            this.settings = $.extend(true, $.fn.calendarSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }
        calendarSwitch.prototype = { /*说明：初始化插件*/
            /*实现：初始化dom结构，布局，分页及绑定事件*/
            init: function() {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.selectors.sections;
                me.index = me.settings.index;
                me.comfire = me.settings.comfireBtn;

				var html = "<table class='dateZone'><tr><td class='colo'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class='colo'>六</td></tr></table>" + "<div class='tbody'></div>"
                $(me.sections).append(html);
                for (var q = 0; q < me.index; q++) {
                    var select = q;
                    $(me.sections).find(".tbody").append("<p class='ny1'></p><table class='dateTable'></table>")
                    var currentDate = new Date();
                    currentDate.setMonth(currentDate.getMonth() + select);
                    var currentYear = currentDate.getFullYear();
                    var currentMonth = currentDate.getMonth();
                    var setcurrentDate = new Date(currentYear, currentMonth, 1);
                    var firstDay = setcurrentDate.getDay();
                    var yf = currentMonth + 1;
                    if (yf < 10) {
                        $(me.sections).find('.ny1').eq(select).text(currentYear + '年' + '0' + yf + '月');
                    } else {
                        $(me.sections).find('.ny1').eq(select).text(currentYear + '年' + yf + '月');
                    }
                    var DaysInMonth = [];
                    if (me._isLeapYear(currentYear)) {
                        DaysInMonth = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                    } else {
                        DaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                    }
                    var Ntd = firstDay + DaysInMonth[currentMonth];
                    var Ntr = Math.ceil(Ntd / 7);
                    for (var i = 0; i < Ntr; i++) {
                        $(me.sections).find('.dateTable').eq(select).append('<tr></tr>');
                    };
                    var createTd = $(me.sections).find('.dateTable').eq(select).find('tr');
                    createTd.each(function(index, element) {
                        for (var j = 0; j < 7; j++) {
                            $(this).append('<td></td>')
                        }
                    });
                    var arryTd = $(me.sections).find('.dateTable').eq(select).find('td');
                    for (var m = 0; m < DaysInMonth[currentMonth]; m++) {
                        arryTd.eq(firstDay++).text(m + 1);
                    }
                }
                me._initselected();

                me.element.on('click', function(event) {
                    event.preventDefault();
//                  me._slider(me.sections)
                });
                
                //点击完成部分
                $(me.sections).find('.tbody td').on('click', function(event) {
                    event.preventDefault();
//                  alert(111);
                    $(me.sections).find('.tbody .rz').each(function(index, element) {
                        //点击的日期存入input
                        var day = parseInt($(this).parent().text().replace(/[^0-9]/ig, "")) //截取字符串中的数字
                        if(day < 10){
                            day = "0" + day;
                        }
                        var startDayArrays = $(this).parents('table').prev('p').text().split('');
                        var startDayArrayYear = [];
                        var startDayArrayMonth = [];
                        var startDayYear = "";
                        var startDayMonth = "";
                        for (var i = 0; i < 4; i++) {
                            var select = i;
                            startDayArrayYear.push(startDayArrays[select])
                        }
                        startDayYear = startDayArrayYear.join('');
                        for (var i = 5; i < 7; i++) {
                            startDayArrayMonth.push(startDayArrays[i])
                        }
                        startDayMonth = startDayArrayMonth.join('');
                        //添加到input
                        $('#startDate').val(startDayYear + '-' + startDayMonth + '-' + day);
						//me._slider(me.sections)//动画
		                me._callback()
                    });
                });

            },
            _isLeapYear: function(year) {
                return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
            },
            //动画
            _slider: function(id) {
                var me = this;
                me.animateFunction = me.settings.animateFunction;
                if (me.animateFunction == "fadeToggle") {
                    $(id).fadeToggle();
                } else if (me.animateFunction == "slideToggle") {
                    $(id).slideToggle();
                } else if (me.animateFunction == "toggle") {
                    $(id).toggle();
                }
            },
            //默认选中当前系统时间
            _initselected: function() {
                var me = this;
                me.outColor = me.settings.outColor;
                me.daysnumber = me.settings.daysnumber;
                var strDays = new Date().getDate();
                var arry = [];
                var arry1 = [];
                var tds = $(me.sections).find('.dateTable').eq(0).find('td');
                tds.each(function(index, element) {
                	//如果是当前系统时间，则默认选中
                    if ($(this).text() == strDays) {
                        $(this).append('</br><p class="rz"></p>');
                        me._checkColor(me.outColor)

                    }
                })

                $(me.sections).find('.tbody').find('td').each(function(index, element) {
                    if ($(this).text() != '') {
                        arry.push(element);
                    }
                });
                for (var i = 0; i < strDays - 1; i++) {
                    $(arry[i]).css('color', '#ccc');
                }
                if (me.daysnumber) {
                    //可以在这里添加90天的条件
                    for (var i = strDays - 1; i < strDays + parseInt(me.daysnumber); i++) {
                        arry1.push(arry[i])
                    }
                    for (var i = strDays + parseInt(me.daysnumber); i < $(arry).length; i++) {
                        $(arry[i]).css('color', '#ccc')
                    }
                } else {
                    for (var i = strDays - 1; i < $(arry).length; i++) {
                        arry1.push(arry[i])
                    }
                }
                me._selectDate(arry1)
            },
            //选中的颜色
            _checkColor: function(outColor) {
                var me = this;
                var rz = $(me.sections).find('.rz');
                // console.log(rz);
                for (var i = 0; i < rz.length; i++) {
                    rz.eq(i).closest('td').css({
                        'background': outColor,
                        'color': '#fff'
                    });
                }

            },
            _callback: function() {
                var me = this;
                if (me.settings.callback && $.type(me.settings.callback) === "function") {
                    me.settings.callback();
                }
            },
            //选中的具体日期
            _selectDate: function(arry1) {
                var me = this;
                me.outColor = me.settings.outColor;
                me.sections = me.selectors.sections;

                $(arry1).on('click', function(index) {
                    index.stopPropagation();
                    $(me.sections).find('.hover').remove();
                    $(me.sections).find('.tbody').find('p').remove('.rz');
                    $(me.sections).find('.tbody').find('br').remove();
                    $(arry1).css({
                        'background': '#fff',
                        'color': '#333333'
                    });
                    $(this).append('<p class="rz"></p>')
                    me._checkColor(me.outColor)
                })
            }

        }
        return calendarSwitch;
    })();
    $.fn.calendarSwitch = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data("calendarSwitch");

            if (!instance) {
                me.data("calendarSwitch", (instance = new calendarSwitch(me, options)));
            }

            if ($.type(options) === "string") return instance[options]();
        });
    };
    $.fn.calendarSwitch.defaults = {
        selectors: {
            sections: "#calendar"
        },
        index: 4,
        //展示的月份个数
        animateFunction: "toggle",
        //动画效果
        controlDay: false,
        //是否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
        daysnumber: "30",
        //控制天数
        outColor: "red",
        //选中颜色
        callback: "",
        //回调函数
        comfireBtn: '.comfire' //确定按钮的class或者id

    };
})(jQuery);
