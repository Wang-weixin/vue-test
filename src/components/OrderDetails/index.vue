/*
 * @Author: lk 
 * @Date: 2019-11-06 17:08:57 
 * @Last Modified by: lk
 * @Last Modified time: 2019-12-05 12:28:30
 * @Description:  订单详情
 */
<template>
    <div class="order-details" v-loading="loading"  element-loading-text="加载中,请稍后...">
            <div class="order_state"  v-if="orderList.length > 0">
                <div class="icon state_error">
                </div>
                <div class="state_cont">
                    <div class="state_txt">
                        <span class="desc"  v-if="orderList.length===1">{{orderStateOptions[detail.orderState]}}</span>
                        <span class="desc"  v-else>订单已拆单</span>
                    </div>
                </div>
            </div>
            <div class="address_defalut_wrap">
                <div  class="address_defalut address_border" style="display: block;" v-if="addressItem">
                    <ul >
                        <li><strong>{{addressItem.receiveName}}&nbsp;{{addressItem.receiveMobile}}</strong></li>
                        <li class="b-title">{{addressItem.provinceName+addressItem.cityName+addressItem.countyName+(addressItem.townName?addressItem.townName:'')+addressItem.detailedAddress}} </li>
                    </ul>
                </div>
            </div>
            <div class="order-father-detail" v-for="(order,orderIndex) in orderList" :key="orderIndex">
                <div class="order_shopBar">
                    <div>
                               <span class="b-text">订单编号:</span>
                    &nbsp;<span class="order-number">{{order.porderId}}</span>
                    </div>
                    <span class="b-text">{{orderStateOptions[order.orderState]}}</span>
                </div>
                <div class="good-item" v-for="(sku,skuIndex) in order.skus" :key="skuIndex">
                    <img :src="'http://img13.360buyimg.com/n4/'+sku.path" alt="">
                    <div class="good-item-message">
                        <div class="good-name"> {{sku.name}}</div>
                        <div class="good-price-count">
                            <div class="good-price">¥{{sku.price | toFixed2}}</div>
                            <div class="good-count">x{{sku.num}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-last">
                <div class="order_summary">
                    <div class="inner_line">
                        <span class="title">订单编号：</span>
                        <div class="content">
                            {{detail.porderId}}
                        </div>
                    </div>
                    <div class="inner_line">
                        <span class="title">下单时间：</span>
                        <div class="content">
                            {{detail.addTime | parseTime}}
                        </div>
                    </div>
                    <div class="inner_line">
                        <span class="title">支付方式：</span>
                        <div class="content">
                            在线支付
                        </div>
                    </div>
                </div>
                <div class="order_total">
                    <div>
                        <div class="total_item">
                            订单金额<span data-show-tip="fee" class="total_icon"></span><span class="price"> ¥ {{detail.orderPrice | toFixed2}}</span>
                        </div>
                        <div class="total_item">
                            运费<span data-show-tip="fee" class="total_icon"></span><span class="price">+ ¥ {{detail.freight | toFixed2}}</span>
                        </div>
                    </div>
                    <div class="total">
                        实付金额：<span class="color_red">¥ {{detail.orderPrice | toFixedLocal(detail)}}</span>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  props: {
    porderId: [Number, String],
    isPorder: [Number, String]
  },
  data() {
    return {
      loading: false,
      detail: {},
      orderList: [],
      addressItem: null,
      orderStateOptions: {
        '0': '订单失败',
        '1': '待收货',
        '2': '已完成',
        '3': '已取消',
        '9': '待支付'
      }
    }
  },
  filters: {
    toFixedLocal(val, order) {
      let price = 0
      if (typeof order.orderPrice === 'number') {
        price += order.orderPrice
      }
      if (typeof order.freight === 'number') {
        price += order.freight
      }

      if (price === null) {
        return '暂无报价'
      } else {
        if (typeof price === 'number') {
          return (Math.round(price * 100) / 100).toFixed(2)
        } else {
          return price
        }
      }
    }
  },
  created() {
    this.getOrderDetails()
  },
  methods: {
    getOrderDetails() {
      baseRequest('/afterSale/getAddressFromOrderDetail', { jdOrderId: this.porderId }).then(response => {
        this.addressItem = response.result.address
        this.addressItem.receiveName = response.result.name
        this.addressItem.receiveMobile = response.result.mobile
      })
      this.loading = true
      baseRequest('/jdmallOrder/getOrderInfo', { porderId: this.porderId, isPorder: this.isPorder }).then(response => {
        this.detail = response.result
        if (response.result.children) {
          this.orderList = response.result.children
        } else {
          this.orderList = [response.result]
        }
        this.loading = false
      }, _ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
     .order-details{
         padding-top:10px;
        font-size: 12px;
        color: #999;
        .b-text{
            font-size: 16px;
            color: #333;
        }
         .order_state {
            background-image: -webkit-gradient(linear,left top,right top,color-stop(0,#f66d70),to(#e93b3d));
            background-image: -webkit-linear-gradient(left,#f66d70,#e93b3d);
            background-image: linear-gradient(90deg,#f2270c,#f2270c);
            color: #fff;
            padding: 12px 10px;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            font-size: 12px;
            line-height: 18px;
            position: relative;
            .order_state .state_cont {
                padding-left: 25px;
                z-index: 5;
            }
            .state_txt {
                line-height: 24px;
                position: relative;
                .desc {
                    font-family: PingFangSC-Semibold;
                    font-size: 16px;
                    font-weight: 400;
                }
            }
        }
        .order-father-detail{
            overflow: hidden;
            margin-top: 15px;
            .order_shopBar{
                background-color: #fff;
                padding: 11px 10px;
                line-height: 24px;
                position: relative;
                -webkit-box-align: center;
                -webkit-align-items: center;
                align-items: center;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-justify-content: space-between;
                &::after{
                    content: "";
                    height: 0;
                    display: block;
                    border-bottom: 1px solid #e5e5e5;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                    position: absolute;
                    left: 10px;
                    right: 0;
                    bottom: 0;
                }
                .order-number{
                    font-size: 14px;
                    color: #999;
                }
            }
            .good-item{
                background-color: #fff;
                padding:10px;
                height: 103px;
                position: relative;
                img{
                    height: 75px;
                    width: 75px;
                    position: absolute;
                }
                .good-item-message{
                    padding-left:83px;
                    .good-name{
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333;
                        line-height: 21px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .good-price-count{
                        margin-top: 3px;
                        line-height: 24px;
                        font-size: 12px;
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-pack: justify;
                        -webkit-justify-content: space-between;
                        -ms-flex-pack:justify ;
                        justify-content: space-between;
                        .good-price{
                            color: #f2270c;
                            font-size: 16px;
                        }
                    }
                }
            
            }
        }
        .order-last{
            margin-top:10px;
            .order_summary{
                padding: 12px 10px;
                overflow: hidden;
                margin-top: 15px;
                background-color: #fff;
                color: #151515;
                font-size: 14px;
                &::after{
                    content: "";
                    height: 0;
                    display: block;
                    border-bottom: 1px solid #e5e5e5;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                    position: absolute;
                    left: 10px;
                    right: 0;
                    bottom: 0;
                }
            }
            .inner_line {
                display: flex;
                padding-top: 3px;
                font-size: 14px;
                line-height: 21px;
                position: relative;
                .title {
                    min-width: 70px;
                    color: #999;
                }
                .content {
                    width: 100%;
                    color: #151515;
                    display: block;
                    -webkit-flex: 1;
                    -webkit-box-flex: 1;
                    flex: 1;
                }
            }
            .order_total{
                background: #fff;
                overflow: hidden;
                position: relative;
                margin-bottom: 15px;
                padding:10px;
                .total_item {
                    font-size: 14px;
                    line-height: 21px;
                    color: #333;
                    font-weight: 400;
                    position: relative;
                    .price {
                        float: right;
                        line-height: 21px;
                        color: #333;
                        font-weight: 400;
                        position: relative;
                        float: right;
                        font-family: JDZH-Regular;
                    }
                }
                .total {
                    float: right;
                    margin-top: 8px;
                    font-size: 16px;
                    line-height: 24px;
                    color: #333;
                    font-weight: 700;
                    .color_red {
                        color: #f2270c;
                    }
                }
            }
        }
     }
 </style>
 
 
<style lang="scss" scoped>
.address_defalut_wrap {
    position: relative;
}
.address_defalut {
    padding: 12px 10px;
    position: relative;
    color: #333;
}
.address_defalut.address_border {
    padding-bottom: 16px;
    background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURf///4u16Oxtbezz/J3B7NDh9vSmprjS8vGNjfjDw/vd3f7w8O57e0EOI68AAABSSURBVCjPY2CAAE4l7GACVJ4hUBArEIXJL8KuXw0mz4xdv2ABVJ77EHYDGmAGmGDXLwKT58CuX2cDTIEjdgOcYfJJ2A3Qgsmz4/CBwWgQUiMIAXzCOFELLk/nAAAAAElFTkSuQmCC) -7px bottom repeat-x;
    background-size: 64px 5px;
}
.address_defalut ul {
    position: relative;
    padding-right: 30px;
}
.address_defalut li {
    word-wrap: break-word;
    word-break: break-all;
    font-size: 14px;
    line-height:20px;
}
.address_defalut li strong {
    font-size: 16px;
}
</style>