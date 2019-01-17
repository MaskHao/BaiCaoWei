<template>
    <div>
        <header class="search-header" style="padding:0;">
            <div class="left-box" v-on:click="routeBack"><i class="iconfont icon-iconback"></i></div>
                <input name="search" type="text" class="search-input icon_search_2" :placeholder="searchKey.word" v-model="searchWords" v-on:keyup.enter="submit">
                <em class="cancel-input" v-on:click="setFavorite(searchWords,'')">搜索</em>
        </header>
        <div class="container paddingTop search-content">
            <div class="item">
                <h1>热门搜索</h1>
                <ul class="clear" id="J_searchKey">
                    <li :style="{borderColor:item.color}" v-for="(item,index) in hotList" :key="index" v-on:click="setFavorite(item.word,item.url)">
                      <a :style="{color:item.color}" href="javascript:;" v-if="item.url == ''">{{item.word}}</a>
                      <a :style="{color:item.color}" v-else href="javascript:;">{{item.word}}</a>
                    </li>
                </ul>
            </div>
            <div class="item" id="J_history" v-show="historyShow">
                <h1>最近搜索<i class="iconfont icon-icontrash fr" id="J_delSearch" v-on:click="delHistory"></i></h1>
                <ul class="clear">
                  <template v-if="items">
                    <li v-for="items in searchList"  :key="items" @click="setFavorite(items.word,items.url)">
                      <a href="javascript:;" v-if="items.url == ''">{{items.word}}</a>
                      <a v-else href="javascript:;">{{items.word}}</a>
                    </li>
                  </template>
                    
                </ul>
            </div>
        </div>
        <!--选择弹窗-->
        <confirmDialog ref="dialog"></confirmDialog>
      <vAlert ref='alertDialog'></vAlert>
    </div>
</template>

<script>
import {getHotSearch,homeTab} from '../../service/getData'
import {setStore,getStore,removeStore} from '../../assets/js/mUtils'
import confirmDialog from '../../components/confirmDialog'
import vAlert from 'components/alertDialog'
    export default {
        data () {
            return {
                hotList:[],
                historyShow:false,
                searchList:null,
                searchWords:'',
                searchKey:''
            }
        },
        methods:{
            getHomeTab(){
                homeTab().then((res) => {
                    this.searchKey = res.data.result_data.default_search_words_new
                })
            },
            getHot(){//获取热门搜索的数据
                getHotSearch().then((response) => {
                    this.hotList = response.data.result_data.list;
                })
            },
            setFavorite(favorite,url){//存储最近搜索栏目的localStorage
              var _favorite = this.trim(favorite);
              var _url = url;
                if(favorite != ""){
                  if(_favorite != ''){
                    var hotArr = this.hotList;
                    for(var j=0 ; j<hotArr.length ; j++){
                      if(hotArr[j].word == _favorite){
                        _url = hotArr[j].url
                      }
                    }
                    let favArray = JSON.parse(getStore('fav'))
                    if(!favArray){
                      favArray = []
                    }else{
                      for(var i=0 ; i<favArray.length ; i++ ){
                        if(_favorite == favArray[i].word){
                          favArray.splice(i,1);
                        }
                      }
                    }
                    favArray.splice(0,0,{'word':_favorite,'url':_url});
                    setStore('fav',favArray)
                    if(this.searchKey.word == favorite){
                      window.location.href = this.searchKey.url
                    }else if(_url != ''){
                      window.location.href = _url;
                    }else{
                      this.$router.push({ path: '/data-list/list-goods', query: { searchKey: _favorite}});
                    }
                  }else{
                    this.$refs.alertDialog.alert('请输入搜索关键词');
                  }
                }else{
                  if(this.searchKey.url){
                    window.location.href = this.searchKey.url
                  }else{
                    this.$router.push({ path: '/data-list/list-goods', query: { searchKey: this.searchKey.word}});
                  }
                }
            },
            routeBack(){//回到上一页
              this.$router.go(-1)
            },
            delHistory(){//删除历史搜索记录
                this.$refs.dialog.confirm({
                    text:'确认清空最近搜索？'
                }).then((response) => {
                    this.historyShow = false
                    this.$refs.dialog.show = false
                    removeStore('fav')
                }).catch(() =>{

                })
            },
            submit(){//搜索框输入文字回车查询数据
                this.setFavorite(this.searchWords,'')
            },
            trim(str){
              return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
            }
        },
        components:{
            confirmDialog,
          vAlert
        },
        created () {
            this.getHot()
            this.searchList = JSON.parse(getStore('fav'))//获取localStorage里面的最近搜索记录
            if(this.searchList){
                this.historyShow = true
            }else{
                this.historyShow = false
            }
        },
        updated () {

        },
        mounted () {
            this.getHomeTab()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*search*/
    .left-box .icon-iconback{font-size:2rem;color:#3c4347;background: url(../../assets/images/ic_left.png) no-repeat center;background-size: 70%;float: left;height: 100%;width: 100%;}
    .search-page { height: 100%;}
    .search-header {width: 100%;height: 50px; line-height: 50px; padding: 0 0 0 8px; position: fixed; top: 0; left: 0; z-index: 999;background:#fff;border-bottom:solid 1px #ddd;}
    .search-input { float: left; width: 80%; height: 34px; line-height: 20px; margin: 7px 10px; padding: 5px 15px 5px 35px; border-radius: 17px; background: #eee url(http://img2.vipbcw.com/wap/svg/icon_search_3.svg) no-repeat 5px center; background-size: 10%;}
    .cancel-input { display: inline-block; width: 10%; line-height: 50px; text-align: center; font-size: 1.2rem; color: #3C4347;}
    .search-content {background: #fff;}
    .search-content .item{ margin-left:10px;padding-right:10px;padding-bottom:16px;border-bottom:solid 1px #f5f5f5;}
    .search-content h1 { height: 40px; line-height: 40px; font-size: 1.4rem; color: #3C4347;}
    .search-content h1:before{content:"|"; color:#ff4f39;font-weight: bold;margin-right:5px;}
    .search-content h1 i{font-size: 1.4rem;}
    .search-content .icon-icontrash {background: url(../../assets/images/icon_del.png) no-repeat center;background-size: 70%;float: right;width: 8%;height: 100%;}
    .search-content .item:last-child{border-bottom:0;}
    .search-content ul { background: #fff;overflow: hidden;}
    .search-content ul li { float: left; height: 28px; line-height: 28px; padding: 0 10px; border:solid 1px #bbb; border-radius: 14px; margin-right: 10px; margin-top: 10px;}
    .search-content ul li a:active{color:rgba(60,67,71,1);}
    .search-page .search-header{padding:0;}
    .search-header .left-box{float:left;text-align: center;width: 10%;height: 100%;position: relative;}
    .search-header .search-input{margin:8px 0;}
    .search-content ul .red {border-color: #FF4F39}
    .search-content ul .red a {color: #FF4F39}
</style>



// WEBPACK FOOTER //
// search.vue?253fc09e