<template>
  <div class="container">
    <keep-alive>
      <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>
    </keep-alive>
    <section class="goods_list">
      <header class="header_nav">
        <div class="box">
          <el-button  type="primary" @click="dialogStatus = true" class="add_num_btn fr add_goods_btn">添加活动</el-button>
<!--          <el-input-->
<!--            ref="searchInput"-->
<!--            class="search_input fr mt10"-->
<!--            v-model="searchKey"-->
<!--            placeholder="请输入商品名称或商品编号"-->
<!--            icon="search"-->
<!--            @keyup.enter.native="searchGoods"-->
<!--            :on-icon-click="searchGoods">-->
<!--          </el-input>-->
<!--          <el-button class="add_num_btn fr" type="text">已添加：{{addedGoodsCount}} 个商品</el-button>-->
        </div>
      </header>

      <div class="content_box">
        <activity-table-layout
          :tableData="activityListData"
          :order_name="order_name"
          v-if="activityListData.length"
          @onAddedGoodsCountChange="num => addedGoodsCount = num"
          @editDialog="edit"
          class="goods_table">
        </activity-table-layout>

        <el-pagination
          class="page_list"
          layout="prev, pager, next"
          @current-change="onPageChange"
          :current-page="pageIndex"
          :page-count="pageCount">
        </el-pagination>
      </div>
    </section>
    <el-dialog :title="title" :visible.sync="dialogStatus">
      <div style="display: flex; margin-top: 10px">
        <span>图片上传:</span>
        <el-upload
          ref="upload"
          action="/upload"
          style="margin-left: 10px"
          accept="image/png,image/gif,image/jpg,image/jpeg"
          list-type="picture-card"
          :file-list="fileList"
          :http-request="uploadImage"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :limit="1"
          :on-exceed="handleExceed">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="display: flex; margin-top: 10px">
        <span>活动路径:</span>
        <el-input v-model="activity.path" style="width: 50%; margin-left: 10px"></el-input>
      </div>
      <div style="display: flex; margin-top: 10px">
        <span>开始时间:</span>
        <el-date-picker type="datetime" v-model="activity.startTime" @change="sformatTime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="选择时间"></el-date-picker>
      </div>
      <div style="display: flex; margin-top: 10px">
        <span>结束时间:</span>
        <el-date-picker type="datetime" v-model="activity.endTime" @change="eformatTime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="选择时间"></el-date-picker>
      </div>
      <div style="display: flex; margin-top: 10px">
        <span>活动类型:</span>
        <el-select v-model="activity.type" style="margin-top: 10px;">
          <el-option
            v-for="s in activityType"
            :key="s.id"
            :label="s.name"
            :value="s.id"
          />
        </el-select>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import GoodsMenu from 'base/goods-menu/goods-menu'
  import ActivityTableLayout from './activity-table-layout'
  import { mapState } from 'vuex'
  import {Axios} from '../../../common/js/Axios'

  export default {
    components: {
      GoodsMenu,
      ActivityTableLayout,
    },

    data() {
      const { order_id } = this.$route.params
      return {
        order_id,
        searchKey: '',
        dialogStatus: false,
        activityListData: [],
        fileList: [],
        addedGoodsCount: 0, // 该订单里已添加的商品数
        pageCount: 0,
        pageIndex: 1,
        breadData: {},
        order_name: '',
        activityType: [
          {'id': 1, 'name': '首页'},
          {'id': 2, 'name': '排行榜'}
          ],
        activity: {
          id: '',
          bannarImgUrl: '',
          path: '',
          startTime: '',
          endTime: '',
          type: 1
        },
        flag: 0
      }
    },

    created() {
      // pageIndex 一旦改变就触发 onPageChange 事件有点不妥，故加了这个变量做限制
      this.onPageChangeLock = false

      this.$store.dispatch('fetchActivityList', {...this.$route.query, order_id: this.order_id})
      //this.$store.dispatch('fetchGoodsColorsList')
    },

    computed: {
      ...mapState(['fetchGoodsListParams', 'activityList']),
      title(){
        return this.flag === 0 ? '新增': '编辑';
      }
    },

    watch: {
      activityList(data) {
        const {
          list = [],
          pageSize,
          pages,
          title = {},
          order_name = '',
        } = data
        this.activityListData = list || []
        //this.breadData = title || {}
        this.addedGoodsCount = pageSize
        this.pageCount = pages
        //this.order_name = order_name
      },

      // 把 params 序列化到 URL 的 query 里，
      // TODO: 但是网页刷新后并没有反过来把 URL query 里的参数分配到 params 里
      fetchGoodsListParams(params) {
        this.$router.replace({
          query: params
        })
      },
      dialogStatus: function(newVal, oldVal) {
        if (newVal) {
          if(this.flag !== 0) {
            this.fileList.splice(0, this.fileList.length)
            this.fileList.push({'url': this.activity.bannarImgUrl});
          }else{
            this.fileList.splice(0, this.fileList.length)
          }
        }
      },

      goodsColor(goods_color) {
        // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
        if(this.pageIndex !== 1) {
          this.onPageChangeLock = true
          this.pageIndex = 1
        }
        const params = {
          goods_color,
          page_index: this.pageIndex,
          menu_id: 0,
          level: 1,
        }
        this.$store.dispatch('fetchGoodsList', params)
      },
    },

    methods:{
      searchGoods() {
        // 只要搜索传值了，后端会把所有的条件置空去搜索，尽管这样前端还是得把一些条件给清空
        // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
        if(this.pageIndex !== 1) {
          this.onPageChangeLock = true
          this.pageIndex = 1
        }
        const params = {
          search_key: this.searchKey,
          page_index: this.pageIndex,
          menu_id: 0,
          level: 1,
        }
        this.$store.dispatch('fetchActivityList', params)
      },

      sformatTime(time) {
        this.activity.startTime = time;
      },

      eformatTime(time) {
        this.activity.endTime = time;
      },

      onPageChange(page_index) {
        if(this.onPageChangeLock) {
          this.onPageChangeLock = false
          return
        }
        this.pageIndex = page_index
        this.$store.dispatch('fetchGoodsList', {page_index})
      },

      handleAvatarSuccess(res, file) {
        //this.goods.goodsImageUrl = URL.createObjectURL(file.raw);
      },
      // 文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$notify.warning({
          title: '警告',
          message: '只允许上传一张logo'
        })
      },
      // 文件列表移除文件时的钩子
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 点击文件列表中已上传的文件时的钩子
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadImage(param){
        console.log(param)
        var formData = new FormData();
        formData.append("file", param.file);
        Axios.post(param.action,formData,
          { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
          console.log('上传图片成功')
          this.goods.goodsImageUrl = response.data.url
          param.onSuccess()  // 上传成功的图片会显示绿色的对勾
        }).catch(response => {
          console.log('图片上传失败')
          param.onError()
        })
      },
      uploadFile() {
        this.$refs.upload.submit()
      },
      addGoods() {
        if (!this.activity.bannarImgUrl) {
          this.$message.error('请输入名片！', 'error')
          return
        }

        if(this.flag == 0){
          this.$http.post('add/activity', this.activity).then(res => {
            if (res.code == 200) {
              this.dialogStatus = false;
              this.searchGoods();
            } else {
              this.$message.error('创建活动失败！', 'error')
            }
          })
        }else{
          this.$http.post('update/activity', this.activity).then(res => {
            if (res.code == 200) {
              this.dialogStatus = false;
              this.searchGoods();
            } else {
              this.$message.error('创建活动失败！', 'error')
            }
          })
        }

      },
      edit(activity){
        this.flag = 1;
        this.dialogStatus = true
        this.activity = activity;
        //this.fileList[0] = goods.goodsImageUrl;
      }
    },
  }
</script>
<style lang="sass" scoped>
  .container
    width: 100%
    min-height: 100vh
    display: flex

    .goods_menu
      width: 220px

    .goods_list
      flex: 1

  .header_nav
    padding: 0 20px
    width: 100%
    box-sizing: border-box
    height: 50px
    background: #eee

    .order_name
      line-height: 50px
      font-size: 16px

    .add_num_btn
      margin-top: 10px
      margin-right: 20px

    .search_input
      width: 200px


  .content_box
    padding: 20px
    width: 100%
    height: auto

    .bread_box
      margin-bottom: 5px
      height: 32px
      line-height: 32px

      .bread
        line-height: 32px

      .color_select
        width: 140px
        float: right

    .goods_table
      width: 100%
      height: auto


    .page_list
      margin: auto
      text-align: center
      margin-top: 20px
</style>
