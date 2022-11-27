<template>
  <el-table
    :data="newTableData"
    class="goods_table"
    stripe
    border>
    <el-table-column label="活动图片" width="200">
      <template scope="scope">
        <router-link
          tag="div"
          :to="'/goods-detail/' + $route.params.order_id + '/' + scope.row.code + '?order_name=' + order_name"
          class="goods_img cursor"
          :style="backgroundImage(scope.row.bannarImgUrl)">
        </router-link>
      </template>
    </el-table-column>

    <el-table-column label="跳转路径" min-width="160">
      <template scope="scope">
        <p class="text_ellipsis">{{scope.row.path}}</p>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="70">
      <template scope="scope">
        <p class="text_ellipsis" style="color: red">{{scope.row.status}}</p>
      </template>
    </el-table-column>

    <el-table-column label="开始时间" width="120">
      <template scope="scope">
        <p class="tc">{{scope.row.startTime}}</p>
      </template>
    </el-table-column>

    <el-table-column label="结束时间" width="120">
      <template scope="scope">
        <p>{{scope.row.endTime}}</p>
      </template>
    </el-table-column>

    <el-table-column label="banner类型" width="80">
      <template scope="scope">
        <p>{{scope.row.type == 1 ? '首页' : '排行榜'}}</p>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="130">
      <template scope="scope">
<!--        <el-button type="primary" class="add_goods_btn" @click="addGoods(scope.$index)">编辑商品</el-button>-->
<!--        <el-button type="primary" class="add_goods_btn" @click="addGoods(scope.$index)">删除</el-button>-->
        <div class="btn_area">
          <el-button
            size="small"
            class="btn_cad"
            @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button
            size="small"
            class="btn_sku"
            @click="deleteGoods(scope.row.id)">
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import { backgroundImage } from 'common/js/mixins'
  export default {
    props: {
      tableData: {
        type: Array,
      },
      order_name: {
        type: String,
      },
    },
    data() {
      const {order_id} = this.$route.params
      return {
        order_id,
        rateList: [
          {key: 'ctimeLimit', value: '工期'},
          {key: 'cquality', value: '质量'},
          {key: 'ceffect', value: '效果'},
          {key: 'ccustomerService', value: '售后'},
        ],
      }
    },

    mixins: [backgroundImage],

    computed: {
      newTableData() {
        return this.tableData.map(item => ({...item, currentSkuIndex: 0}))
      }
    },

    methods:{
      selectColor(whichSkuIndex, whichGoodsIndex) {
        let data = [...this.newTableData]
        data[whichGoodsIndex].currentSkuIndex = whichSkuIndex
        this.newTableData = data
      },

      addGoods(whichGoodsIndex) {
        const { currentSkuIndex, goodsPropertyVos } = this.newTableData[whichGoodsIndex]
        const {
          sku,
          color
        } =  goodsPropertyVos[currentSkuIndex]
        const data = {
          sku,
          color,
          order_id: this.order_id,
        }
        this.$http.post('order/add_goods', data).then(res => {
          if (!res || !res.data) {
            this.$message.error('添加商品失败！')
          } else {
            this.$message.success('添加商品成功！')
            this.$emit('onAddedGoodsCountChange', res.data)
          }
        })
      },

      deleteGoods(id) {
        this.$http.delete('delete/goods/'+id).then(res => {
          if (res.code != 200) {
            this.$message.error('删除商品失败！')
          } else {
            this.$message.success('删除商品成功！')
          }
        })
      },

      edit(data){
        this.$emit('editDialog', data);
      }
    },
  }
</script>
<style lang="sass" scoped>
.goods_table
  p
    font-size: 12px
    line-height: 20px

  .goods_img
    width: 100%
    min-height: 100px

  .color_circle
    position: relative
    left: 0
    top: 0
    width: 25px
    height: 25px
    border-radius: 50%
    background-size: cover
    display: inline-block
    cursor: pointer
    border: 1px #3a3a3a solid

    i
      display: none

  .seleted i
    display: block
    position: absolute
    top: 5px
    right: 0
    color: green
    font-size: 14px !important

  .rate_box
    font-size: 12px
    line-height: 18px

    .rate
      display: inline-block
      vertical-align: top

  .add_goods_btn
    width: 100%
    font-size: 14px

  .btn_area
    margin-top: 10px
    display: flex
    justify-content: space-between

    .btn_sku
      flex: 1

    .btn_cad
      @extend .btn_sku

</style>
