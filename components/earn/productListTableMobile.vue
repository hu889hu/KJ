<script lang="ts" setup>
const { t } = useI18n()
const PlayerStore = usePlayerStore()

const searchInput = ref('')
const activitiesPerPage = ref(10)
const currentPage = ref(1)
const availablePairsArray = computed(() => {
  if (searchInput.value) {
    return Object.values(PlayerStore.playerInfo?.availablePairs).filter(
      (item: any) => {
        const itemString = JSON.stringify(item)
        return itemString
          .toLowerCase()
          .includes(searchInput.value.toLowerCase())
      }
    )
  } else {
    return Object.values(PlayerStore.playerInfo?.availablePairs)
  }
})

const ProductListDataTableRef = ref(null)
const productServiceRef = ref(null)
const expandedRows = ref([])
const toogleExpand = (row, index) => {
  if (ProductListDataTableRef.value) {
    ProductListDataTableRef.value.toggleRowExpansion(row)
    const rowIndex = expandedRows.value.indexOf(index)
    if (rowIndex === -1) {
      expandedRows.value.push(index)
    } else {
      expandedRows.value.splice(rowIndex, 1)
    }
    console.log('expandedRows', expandedRows.value)
  }
}
const productServiceData = {
  0: [
    {
      name: '活期理財',
      profit: '22.38 %',
      type: '活期',
      typeTips: '保本型'
    },
    {
      name: '定期',
      profit: '300.00 %',
      type: '1 天',
      typeTips: '進階型'
    }
  ]
}
const typeTipsStyle = (value: any) => {
  return value === '保本型' ? 'warning' : 'success'
}
</script>

<template>
  <div class="allProductListTable">
    <van-sticky>
      <div class="topInfo">
        <div class="title">
          {{ $t('所有產品') }}
        </div>
        <div class="search">
          <el-input
            v-model="searchInput"
            style="width: 240px"
            size="small"
            :placeholder="`${$t('搜尋代幣名稱')}`"
          >
            <template #prefix>
              <i class="fa-solid fa-magnifying-glass"></i>
            </template>
          </el-input>
        </div>
        <div class="listTitle">
          {{ $t('代幣/預估年化收益率') }}
        </div>
      </div>
    </van-sticky>
    <el-table
      ref="ProductListDataTableRef"
      :data="availablePairsArray"
      style="width: 100%"
    >
      <el-table-column type="expand" width="1">
        <template #default="props">
          <!-- props.$index -->
          <div class="productService">
            <div
              class="cardItem"
              v-for="(item, index) in productServiceData[0]"
              :key="index"
            >
              <div class="left">
                <div class="infoCol">
                  <div class="smallTitle">
                    {{ item.name }}
                  </div>
                  <div class="tag">
                    <el-tag :type="typeTipsStyle(item.typeTips)" size="small">{{
                      item.typeTips
                    }}</el-tag>
                  </div>
                </div>
                <div class="infoCol">
                  <div class="smallProfitInfo">
                    {{ item.profit }} 年化收益率
                  </div>
                  <div class="type">
                    {{ item.type }}
                  </div>
                </div>
              </div>
              <div class="right">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="50%">
        <template #default="scope">
          <div class="coinInfo" @click="toogleExpand(scope.row, scope.$index)">
            <div class="icon">
              <img :src="scope.row.icon" />
            </div>
            <div class="coinTitle">
              {{ scope.row.label || scope.row.name || scope.row.symbol }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="40%">
        <template #default="scope">
          <div
            class="profitInfo"
            @click="toogleExpand(scope.row, scope.$index)"
          >
            22.38 % ~ 108.13 %
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="10%" class-name="action">
        <template #default="scope">
          <div
            class="type"
            @click="toogleExpand(scope.row, scope.$index)"
            :class="{ rotate: expandedRows.includes(scope.$index) }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="sass">
.allProductListTable
  width: 100%
  padding: 6px 5px
  background: #fff
  border-radius: 12px
  margin: 0 0 24px 0
  overflow: hidden
  color: #121214
  .topInfo
    display: flex
    justify-content: space-between
    align-items: center
    padding: 12px 12px 0 12px
    background: #fff
    flex-wrap: wrap
    .title
      width: 50%
      font-weight: 600
      font-size: 18px
      line-height: 32px
      color: #121214
    .search
      width: 50%
      display: flex
      justify-content: flex-end
    .listTitle
      width: 100%
      font-weight: 600
      font-size: 14px
      line-height: 32px
      color: #949494
      margin: 24px 0 0 0
  .coinInfo
    width: 100%
    padding: 12px 0
    display: flex
    justify-content: flex-start
    align-items: center
  .icon
    margin: 0 8px 0 0
    img
      width: 24px
      height: 24px
  .coinTitle
    font-weight: 400
    font-size: 12px
    line-height: 18px
    color: #000
  .profitInfo
    width: 100%
    font-weight: 600
    font-size: 12px
    line-height: 26px
    color: #20b26c
  .type
    width: 100%
    font-weight: 400
    font-size: 12px
    line-height: 18px
    color: #000
</style>

<style scoped lang="sass">
.paginationSection
  display: flex
  justify-content: center
  margin: 24px 0 0 0
</style>

<style>
.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover {
  color: orange;
}
.el-pagination.is-background .el-pager li:hover {
  background-color: rgb(249, 210, 136);
  color: #000;
}
.el-pagination.is-background .el-pager li.is-active {
  background-color: orange;
  color: #000;
}
</style>

<style scoped>
.type svg {
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.rotate svg {
  transform: rotate(180deg);
  color: orange;
}
</style>

<style scoped lang="sass">
.productService
  margin: 30px 0
  padding: 0 12px
  .coinInfo
    width: 100%
    padding: 12px 0
    display: flex
    justify-content: flex-start
  .icon
    margin: 0 8px 0 0
    img
      width: 24px
      height: 24px
  .coinTitle
    font-weight: 400
    font-size: 14px
    line-height: 18px
    color: #000
  .type
    width: 100%
    font-weight: 400
    font-size: 14px
    line-height: 18px
    color: #000
  .marginStyleLeft
    margin: 0 0 0 30px
</style>

<style scoped lang="sass">
.cardItem
   width: 100%
   background: #e2e2e2
   border-radius: 12px
   display: flex
   justify-content: space-between
   align-items: center
   margin: 0 0 12px 0
   padding: 6px 12px
   .left
     width: 90%
   .right
     width: 10%
     text-align: right
   .infoCol
      display: flex
      justify-content: flex-start
      align-items: center
      margin: 12px 0
      .smallTitle
        font-weight: 400
        font-size: 12px
        line-height: 18px
        color: #000
      .tag
        margin: 0 0 0 12px
      .smallProfitInfo
        width: 70%
        font-weight: 600
        font-size: 12px
        line-height: 26px
        color: #5c5c5c
        margin: 0 12px 0 0
      .type
        font-weight: 400
        font-size: 10px
        line-height: 18px
        color: #686868
</style>
