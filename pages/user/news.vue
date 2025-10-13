<script lang="ts" setup>
const store = useSiteStore()
const { queryNews } = store
const { locale } = useI18n()
const lang = locale.value
const siteStore = useSiteStore()
const activitiesPerPage = ref(5)
const currentPage = ref(1)
const router = useRouter()
await useAsyncData(async () => {
  const path = 'user'
  await queryNews(lang, path)
})
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const totalPages = computed(() => {
  console.log(store.news.total)
  return Math.ceil(store.news.total / activitiesPerPage.value)
})
const displayedActivities = computed(() => {
  const start = (currentPage.value - 1) * activitiesPerPage.value
  return store.news.result.slice(start, start + activitiesPerPage.value)
})
</script>

<template>
  <div class="pages">
    <div class="sec-title">
      <span>{{ $lang('網站公告') }}</span>
      <i class="fas fa-gift"></i>
    </div>
    <ul class="pagination">
      <li :class="{ disabled: currentPage === 1 }" @click="previousPage">
        <a>« {{ $lang('上一頁') }}</a>
      </li>
      <li :class="{ disabled: currentPage === totalPages }" @click="nextPage">
        <a>{{ $lang('下一頁') }} »</a>
      </li>
    </ul>
    <div class="post">
      <div v-for="item in displayedActivities" :key="item.title" class="Item">
        <input :id="item.title" type="checkbox" />
        <label :for="item.title">
          <div class="itemTitle" style="cursor: pointer">
            <div>{{ item.title }}</div>
          </div>
          <div class="itemContent">
            <div class="html" v-html="item.content"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
.pages
  padding: 20px
  @media screen and (max-width: 768px)
    padding: 10px
</style>

<style scoped lang="sass">
.router
  width: 100%
  height: 35px
  position: relative
  border-radius: 5px
  font-size: 16px
  background-color: #afafaf
  color: #fff
  display: flex
  align-items: center
  justify-content: flex-start
  border: 1px solid #fff
  svg
    padding: 0 20px 0 10px
  .home
    cursor: pointer
</style>

<style scoped lang="sass">
.pagination
  display: flex
  padding-left: 0
  list-style: none
  border-radius: .25rem
  margin: 20px 0
  li
    margin: 0 5px 0 0
  li.disabled
    opacity: .5
    pointer-events: none
  a
    background-color: #ffffff
    color: rgba(0, 0, 0, .87)
    padding: 3px 10px
    border-radius: 2px
    font-size: 14px
    font-weight: 500
    transition: box-shadow .2s cubic-bezier(.4,0,1,1), background-color .2s cubic-bezier(.4,0,.2,1), color .2s cubic-bezier(.4,0,.2,1)
    outline: 0
    border: 0
</style>

<style scoped lang="sass">
.post
  margin: 10px 0
  .Item
    position: relative
    background-color: #fff
    margin: 10px 0
    width: 100%
    .itemContent
      display: none
      padding: 10px 5px 20px 5px
    input[type="checkbox"]
      display: none
    label
      width: 100%
    input[type="checkbox"]:checked ~ label .itemContent
      display: block
    .itemTitle
      width: 100%
      .image
        width: 100%
        img
          width: 100%
          max-height: 400px
          object-fit: cover
          border-radius: 5px
          margin: 0 0 10px 0
</style>
