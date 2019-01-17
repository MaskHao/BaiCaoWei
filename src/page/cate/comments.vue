<template lang="html">
    <div class="tab" style="padding-top:45px;">
      <div class="header-box clearfix">
        <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
        评论列表
        <div class="header-right"></div>
      </div>
        <div class="show-pj" id="J_pjBox">
            <ul>
                <li v-for="(comments,index) in commentsList">
                    <div class="tab-name clearfix">
                        <img v-if="comments.head_img" v-bind:src="comments.head_img+'?imageView2/2/w/30'"/>
                        <img v-else src="http://img2.vipbcw.com/wap/none_head.png?imageView2/2/w/30"/>
                        <p class="username">{{comments.username}}</p>
                        <span class="edit-time">{{comments.add_time | switchDate}}</span>
                        <p class="tab-time">{{comments.join_time}}</p>
                    </div>
                    <p class="tab-page">{{comments.content}}</p>
                    <span class="reply" :style="{'display':comments.admin_reply == '' && 'none'}">{{comments.admin_reply}}</span>
                </li>
            </ul>
            <!-- <p class="pj-more" id="J_morePj" v-on:click="page++">点击加载更多...</p>
            <p class="pj-more" style="display:none">商品暂无评价</p> -->
        </div>
        <p id="loding" class="load" v-text="text"></p>
    </div>
</template>

<script>
import {getGoodsComments} from 'service/getData'
export default {
    data(){
        return {
            commentsList:[],
            page:1,
            goodsId:null,
            lastMsg:'',
            text:''
        }
    },
    methods:{
        getComments(){//获取评论数据
            getGoodsComments(this.goodsId,this.page).then((response) => {
                let res = response.data.result_data.list
                if(res){
                    for(let i=0;i<res.length;i++){
                        this.commentsList.push(res[i])
                    }
                }
                this.lastMsg = res
                if(res){
                    this.text='加载中...'
                }else{
                    setTimeout(() => {
                        this.text = '没有更多了哦'
                    },500)
                }

            })
        },
    },
    filters:{
        switchDate(date){
            return new Date(parseInt(date) * 1000).toLocaleString().split(' ')[0]
        }
    },
    created(){
        this.goodsId = this.$route.query.id
        this.getComments()

        document.addEventListener('scroll',() => {

            let bheight = window.screen.height//浏览器当前窗口可视区域高度
            let sheight = document.body.scrollHeight || document.documentElement.scrollHeight//获取滚动条高度
            let stop = document.body.scrollTop || document.documentElement.scrollTop//滚动条距离顶部的距离

            if(stop>=sheight-bheight){//当滚动条到顶部的距离等于滚动条高度减去窗口高度时
                if(this.lastMsg){
                    this.page++
                }
            }
        })
    },
    watch:{
        'page'(){
            this.getComments()
        }
    }
}
</script>

<style lang="css">
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;width:100%;top:0;left:0; z-index:99;}
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}

  .load {padding: 12px 0;text-align: center;font-size: 1.3rem}
.show-pj { background: #fff; padding:10px;}
.show-pj h2 { height: 40px; line-height: 40px; font-size: 1.4rem; border-bottom: 1px solid #f5f5f5; color: #333;}
.show-pj ul li { padding: 8px 0; border-bottom: 1px solid #f5f5f5;}
.show-pj .pj-more{text-align: center;padding:10px 0 0;}
.tab-name img{float:left; width:30px;height:30px;border-radius: 15px;overflow: hidden;margin-right:5px;}
.tab-name p { font-size: 1rem;width:60%;overflow:hidden;white-space: nowrap;}
.tab-name .tab-time {color: #afcee3;padding-top: 1%;}
.tab-page {font-size: 1.4rem;padding: 5px 0 5px 35px;color: #666;}
    .tab-name {position: relative}
    .edit-time {position: absolute;right: 0;top: 2px;font-size: 1.2rem;}
    .reply {display:inline-block;padding: 5px 10px;margin-left:35px;margin-top:5px;background: #ededed;color: #999;position: relative}
  .reply::before {content: '';display: inline-block;border-bottom: 8px solid #ededed; border-left: 4px solid transparent;border-right: 4px solid transparent;position: absolute;left: 10px;top: -7px;}
   .tab-name .username {font-size: 1.3rem;}
</style>



// WEBPACK FOOTER //
// comments.vue?9263ecd4