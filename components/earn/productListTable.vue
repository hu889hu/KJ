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
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const totalPages = computed(() => {
  return Math.ceil(availablePairsArray.value.length / activitiesPerPage.value)
})
const ProductListData = computed(() => {
  const start = (currentPage.value - 1) * activitiesPerPage.value
  return availablePairsArray.value.slice(start, start + activitiesPerPage.value)
})

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  currentPage.value = val
}

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
    <div class="topInfo">
      <div class="title">
        {{ $t('所有產品') }}
      </div>
      <div class="search">
        <el-input
          v-model="searchInput"
          style="width: 240px"
          size="large"
          :placeholder="`${$t('搜尋代幣名稱')}`"
        >
          <template #prefix>
            <i class="fa-solid fa-magnifying-glass"></i>
          </template>
        </el-input>
      </div>
    </div>
    <el-table
      ref="ProductListDataTableRef"
      :data="ProductListData"
      style="width: 100%"
    >
      <el-table-column type="expand" width="1">
        <template #default="props">
          <!-- props.$index -->
          <div class="productService">
            <el-table
              ref="productServiceRef"
              :data="productServiceData[0]"
              style="width: 100%"
              class-name="custom-table"
            >
              <el-table-column min-width="25%">
                <template #default="scope">
                  <div class="coinInfo">
                    <div class="coinTitle marginStyleLeft">
                      {{ scope.row.name }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="25%">
                <template #default="scope">
                  <div class="profitInfo">{{ scope.row.profit }}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="25%">
                <template #default="scope">
                  <div class="type">{{ scope.row.type }}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="13%">
                <template #default="scope">
                  <div>
                    <el-tag :type="typeTipsStyle(scope.row.typeTips)">{{
                      scope.row.typeTips
                    }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="12%">
                <template #default="scope">
                  <div>
                    <el-button type="warning">{{ $t('立即購買') }}</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="`${$t('幣種')}`" min-width="25%">
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
      <el-table-column :label="`${$t('年化收益率')}`" min-width="25%">
        <template #default="scope">
          <div
            class="profitInfo"
            @click="toogleExpand(scope.row, scope.$index)"
          >
            22.38 % ~ 108.13 %
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="`${$t('投資期')}`" min-width="25%">
        <template #default="scope">
          <div class="type" @click="toogleExpand(scope.row, scope.$index)">
            {{ $t('定期/活期') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('操作')}`"
        min-width="25%"
        class-name="action"
      >
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
    <div class="paginationSection">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="availablePairsArray.length"
        @prev-click="previousPage()"
        @next-click="nextPage()"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="sass">
.allProductListTable
  width: 100%
  padding: 6px 24px
  background: #fff
  border-radius: 12px
  margin: 0 0 24px 0
  overflow: hidden
  color: #121214
  .topInfo
    display: flex
    justify-content: space-between
    align-items: center
    padding: 12px
    .title
      width: 50%
      font-weight: 600
      font-size: 24px
      line-height: 32px
      color: #121214
    .search
      width: 50%
      display: flex
      justify-content: flex-end
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
    font-size: 16px
    line-height: 18px
    color: #000
  .profitInfo
    width: 100%
    font-weight: 600
    font-size: 16px
    line-height: 26px
    color: #20b26c
  .type
    width: 100%
    font-weight: 400
    font-size: 16px
    line-height: 18px
    color: #000
</style>

<style>
.el-table .action .cell {
  text-align: right;
  padding: 0 40px 0 0;
}
.profit_column {
  width: 20%;
}
.profitTime_column {
  width: 30%;
}
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
  .profitInfo
    width: 100%
    font-weight: 600
    font-size: 14px
    line-height: 26px
    color: #20b26c
  .type
    width: 100%
    font-weight: 400
    font-size: 14px
    line-height: 18px
    color: #000
  .marginStyleLeft
    margin: 0 0 0 30px
</style>

<style>
/* .topInfo .el-input {
  --el-input-focus-borderr: #ff7f50;
} */
.productService .el-table {
  --el-table-border-color: #ebeef500;
}
.custom-table .el-table__body-wrapper tbody tr td {
  border-top: none;
  border-bottom: none;
}
.el-table .custom-table td.el-table__cell,
.el-table .custom-table th.el-table__cell.is-leaf {
  border-bottom: none;
}
</style>
