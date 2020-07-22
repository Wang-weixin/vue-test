<template>
    <div class="target-tool">
        <div class="inside-container clearfix">
            <ul class="tool-bar fl">
                <li class="clearfix">
                    <a class="fr clearfix g" :class="{active:active==='G'}" @click="toolBarChange('G')">
                        <div v-if="active === 'G'" class="tool-bar-title fl">
                            目标计划清单
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-G" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix y" :class="{active:active==='Y'}" @click="toolBarChange('Y')">
                        <div v-if="active === 'Y'" class="tool-bar-title fl">
                            年度重要目标
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-Y" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix m" :class="{active:active==='M'}" @click="toolBarChange('M')">
                        <div v-if="active === 'M'" class="tool-bar-title fl">
                            月计划
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-M" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix w" :class="{active:active==='W'}" @click="toolBarChange('W')">
                        <div v-if="active === 'W'" class="tool-bar-title fl">
                            周计划
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-W" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix d" :class="{active:active==='D'}" @click="toolBarChange('D')">
                        <div v-if="active === 'D'" class="tool-bar-title fl">
                            日计划
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-D" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix a" :class="{active:active==='A'}" @click="toolBarChange('A')">
                        <div v-if="active === 'A'" class="tool-bar-title fl">
                            我的成就
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-A" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix c" :class="{active:active==='C'}" @click="toolBarChange('C')">
                        <div v-if="active === 'C'" class="tool-bar-title fl">
                            沟通
                            /授权
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-C" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix f" :class="{active:active==='F'}" @click="toolBarChange('F')">
                        <div v-if="active === 'F'" class="tool-bar-title fl">
                            未来规划
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-F" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix l" :class="{active:active==='L'}" @click="toolBarChange('L')">
                        <div v-if="active === 'L'" class="tool-bar-title fl">
                            人生目标
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-L" />
                    </a>
                </li>
                <li class="clearfix">
                    <a class="fr clearfix h" :class="{active:active==='H'}" @click="toolBarChange('H')">
                        <div v-if="active === 'H'" class="tool-bar-title fl">
                            帮助
                            /续费
                        </div>
                        <svg-icon class="tool-bar-icon" icon-class="icon-H" />
                    </a>
                </li>
            </ul>
            <div class="tool-container fl">
                <gps v-show="active==='G'"></gps>
                <yearc v-show="active==='Y'"></yearc>
                <monthc v-show="active==='M'"></monthc>
            </div>
            <ul class="tool-options fl">
                <li>
                    <div class="tool-options-title">2020年</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import gps from './components/gps'
import yearc from './components/year'
import monthc from './components/month'
export default {
  components: {
    gps, yearc, monthc
  },
  data() {
    return {
      active: 'G'
    }
  },
  methods: {
    toolBarChange(name) {
      this.active = name
    }
  }
}
</script>
<style lang="scss">
$colorG:#db1717;
$colorY:#ff7700;
$colorM:#ffaa00;
$colorW:#04ae0f;
$colorD:#1dd3d1;
$colorA:#00a0e9;
$colorC:#0066ff;
$colorF:#a65fec;
$colorL:#ec5fe7;
$colorH:#e22c79;
.target-tool{
    margin-top:30px;
    .tool-bar{
        width:62px;
        a{
            display: block;
            width: 52px;
            height: 52px;
            line-height: 52px;
            text-align: center;
            background-color: #ccc;
            font-size: 20px;
            color: #fff;
            &.g{
                background-color: $colorG;
                border-top-left-radius: 10px;
            }
            &.y{
                background-color: $colorY;
            }
            &.m{
                background-color: $colorM;
            }
            &.w{
                background-color: $colorW;
            }
            &.d{
                background-color: $colorD;
            }
            &.a{
                background-color: $colorA;
            }
            &.c{
                background-color: $colorC;
            }
            &.f{
                background-color: $colorF;
            }
            &.l{
                background-color: $colorL;
            }
            &.h{
                background-color: $colorH;
                border-bottom-left-radius: 10px;
            }
            &.active{
                height: 110px;
                width: 62px;
                line-height:normal;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                padding:12px 12px 12px 14px;
                text-align: left;
                .tool-bar-title{
                    width: 14px;
                    font-family: PingFangSC-Semibold;
                    font-size: 14px;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #ffffff;
                    line-height: 14px;
                    font-weight: bold;
                }
                .tool-bar-icon{
                    margin-left: 6px;
                    float: left;
                    font-size: 16px;
                    width: 16px;
                }
            }
        }
    }
    .tool-container{
        width: calc(100% - 94px);
        background-color: #fff;
        box-shadow: 0px 2px 10px 0px 
		rgba(0, 0, 0, 0.1);
	    border-radius: 0px 10px 10px 10px;
    }
    .tool-options{
        width: 32px;
        li{
            width: 80px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #555555;
            border-radius: 10px 10px 0px 0px;
            transform: rotate(90deg);
            transform-origin: left bottom;
            cursor: pointer;
            .tool-options-title{
                font-family: PingFangSC-Semibold;
                font-size: 14px;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #ffffff;
            }
        }
    }
}
</style>