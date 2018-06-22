//index.js
//获取应用实例
//download by http://www.srcfans.com
var app = getApp()
Page({
    data: {
        circleList: [], //圆点数组
        awardList: [], //奖品数组
        colorCircleFirst: '#FFDF2F', //圆点颜色1
        colorCircleSecond: '#FE4D32', //圆点颜色2
        colorAwardDefault: '#F5F0FC', //奖品默认颜色
        colorAwardSelect: '#ffe400', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        isRunning: false, //是否正在抽奖
        my_award: ['精美手表一个', '北京烤鸭一只', '50积分', '100积分', '20元话费', '100MB省内流量', '美图手机', '未中奖'], // 奖品的名称
        times: '60', //转盘转动的速度
    },

    onLoad: function() {
        var _this = this;
        //圆点设置
        var leftCircle = 7.5;
        var topCircle = 7.5;
        var circleList = [];
        for (var i = 0; i < 24; i++) {
            if (i == 0) {
                topCircle = 15;
                leftCircle = 15;
            } else if (i < 6) {
                topCircle = 7.5;
                leftCircle = leftCircle + 102.5;
            } else if (i == 6) {
                topCircle = 15
                leftCircle = 620;
            } else if (i < 12) {
                topCircle = topCircle + 94;
                leftCircle = 620;
            } else if (i == 12) {
                topCircle = 565;
                leftCircle = 620;
            } else if (i < 18) {
                topCircle = 570;
                leftCircle = leftCircle - 102.5;
            } else if (i == 18) {
                topCircle = 565;
                leftCircle = 15;
            } else if (i < 24) {
                topCircle = topCircle - 94;
                leftCircle = 7.5;
            } else {
                return
            }
            circleList.push({
                topCircle: topCircle,
                leftCircle: leftCircle
            });
        }
        this.setData({
            circleList: circleList
        })
        //圆点闪烁
        setInterval(function() {
            if (_this.data.colorCircleFirst == '#FFDF2F') {
                _this.setData({
                    colorCircleFirst: '#FE4D32',
                    colorCircleSecond: '#FFDF2F',
                })
            } else {
                _this.setData({
                    colorCircleFirst: '#FFDF2F',
                    colorCircleSecond: '#FE4D32',
                })
            }
        }, 500)
        //奖品item设置
        var awardList = [];
        //间距
        var topAward = 25;
        var leftAward = 25;
        for (var j = 0; j < 8; j++) {
            if (j == 0) {
                topAward = 25;
                leftAward = 25;
            } else if (j < 3) {
                topAward = topAward;
                //166.6666是宽.15是间距.下同
                leftAward = leftAward + 166.6666 + 15;
            } else if (j < 5) {
                leftAward = leftAward;
                //150是高,15是间距,下同
                topAward = topAward + 150 + 15;
            } else if (j < 7) {
                leftAward = leftAward - 166.6666 - 15;
                topAward = topAward;
            } else if (j < 8) {
                leftAward = leftAward;
                topAward = topAward - 150 - 15;
            }
            var my_award = this.data.my_award[j];
            awardList.push({
                topAward: topAward,
                leftAward: leftAward,
                my_award: my_award
            });
        }
        this.setData({
            awardList: awardList
        })
    },
    //开始游戏
    startGame: function() {
        if (this.data.isRunning) return
        this.setData({
            isRunning: true,
        })
        var _this = this;
        //声明一个数组存八个点概率
        var ProArray = [0.1, 0.1, 0.1, 0.2, 0.1, 0.2, 0.1, 0.1];
        //随机数
        var ranNumber = Math.random() * 1000000;
        var jieguo = ranNumber / 1000000;
        console.log('结果：');
        console.log(jieguo);
        var result = [];
        var rep = [];
        var indexSelect = 0;
        //比较大小
        for (var i = 0; i < ProArray.length; i++) {
            if (jieguo < ProArray[i]) {
                result.push(ProArray[i]);
                rep.push(i);
            }
        }
        if (result.length == 0) {
            var maxres = ProArray[0];
            for (var i = 0; i < ProArray.length; i++) {
                if (maxres < ProArray[i]) maxres = ProArray[i];
            }
            for (var i = 0; i < ProArray.length; i++) {
                if (maxres == ProArray[i]) indexSelect = i;
            }
        } else {
            var maxres = result[0];
            for (var i = 0; i < result.length; i++) {
                if (maxres > result[i]) maxres = result[i];
            }
            for (var i = 0; i < result.length; i++) {
                if (maxres == result[i]) indexSelect = i;
            }
            for (var i = 0; i < rep.length; i++) {
                if (indexSelect == i) indexSelect = rep[i];
            }
        }
        var i = 0;
        var timer = setInterval(function() {
            indexSelect++;
            //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
            i += 40;
            if (i > 1000) {
                //去除循环
                clearInterval(timer)
                //获奖提示
                console.log(_this.data.indexSelect);
                if (_this.data.indexSelect == 6) {
                    wx.showModal({
                        title: '很遗憾',
                        content: _this.data.my_award[_this.data.indexSelect + 1],
                        showCancel: false, //去掉取消按钮
                        success: function(res) {
                            if (res.confirm) {
                                _this.setData({
                                    isRunning: false
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '恭喜您',
                        content: '获得了' + ' " ' + _this.data.my_award[_this.data.indexSelect + 1] + ' " ',
                        showCancel: false, //去掉取消按钮
                        success: function(res) {
                            if (res.confirm) {
                                _this.setData({
                                    isRunning: false
                                })
                            }
                        }
                    })
                }
            }
            indexSelect = indexSelect % 8;
            _this.setData({
                indexSelect: indexSelect
            })
        }, (_this.data.times * 1 + i))
    }
})