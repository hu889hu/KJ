# Project Update Documentation

## OL. repo 轉成 v2 api 版本

### BaseCode: BPFE repo

按照以下內容調整：

1. 切換到 `v2` 分支：

   ```sh
   git checkout -b v2
   git checkout v2
   ```

   ![本地圖片](./assets/md/image15.png)

2. 合併條件:
   完成測試後才進行合併。

### 測試帳號:

- 帳號: cas01 or qwe01
- 密碼: 0000

#### basecode更新

- `nuxt.config.ts` 裡 `runtimeConfig` 覆蓋 (siteId 不需要覆盖)
- `/stores` 底下文件全部轉移覆蓋
- `/composables/useApi.ts` 覆蓋

---

## /game/index.vue 二元介面調整：

#### 以 BPFE 中 `/game/modelV2/index.vue` 代碼為準

#### `/components/gameChart.vue` 直接覆蓋

### /game/index.vue 原檔案先 copy 保留再開始依照以下順序改動：

（每個專案 script 跟 html 可能都有稍微不同，script 中可能有畫面樣式處理，保留原檔案方便轉移）

#### script:

- script 先直接覆蓋
- `resetTimer` 裡的 `navigateTo()` 跳轉的頁面要維持

#### html: (原介面樣式要維持）

- 用到用戶 balance 的地方改成用 `playerWalletBalance`
- 有用到 `@click="(symbol = item.symbol), selectSymbol()"` 的地方改成

```javascript
selectSymbol(item)
```

- `<gameChart>` tag 上一層 div 加上 `v-if="availableCurrency.length > 0"` (確保 socket 連上有 product 時再 render gameChart)
- `<gameChart>` tag 裡加上 `:symbolData="symbolData"` 傳參
- 用到 `roundId` 的地方都改成 `roundNo`
- `v-for="item in siteStore.siteData.betAmounts` 改成 `v-for="item in betAmountsList"`
- 有用到 `.pair` 的地方改成 `.symbol`
- 用到 `connectRecordList('currentOrder')` function 的地方改成不用帶值，直接 `connectRecordList`
- `record.type === 'currentOrder'` div 裡的 `item.openPrice` 改成 `item.originalRoundData.openPrice`
- `record.type === 'historyOrder'` div 裡的 `item.closePrice` 改成 `item.roundInfo.closePrice`
- `record.type === 'currentOrder' && 'historyOrder'` 裡對應「時間/幣種」的值更改為下面
- 有用到`new Intl.NumberFormat('zh-TW'`的顯示，裡面都用Number(原對應值)包起,避免報錯

```javascript
<div>{{ formatDate(item.createdAt) }}</div>
<div>{{ item.label || item.name || item.symbol }}</div>
```

- `record.type === 'historyRecord'` 裡對應「類別」的值更改為下面

```javascript
<div>{{ item.label || item.name || item.symbol }}</div>
```

#### css:

- 統一加上

```css
[hidden] {
  display: none !important;
}
```

### 最後 double check 畫面是否都正常運行

---

## 以下畫面會連動後台設定而變動，請先登入管理後台

https://hdembridgezpqb.com/

### 帳號:

- 帳號: engineer01 or engineer02
- 密碼: 123456

### 登入後請先找到當前正在轉移的project

![本地圖片](./assets/md/image2.png)

---

## /pages/user.vue 調整

參考檔案 `/pages/user/modeltranfer.vue`

#### script新增:

- 下方script直接加進去/pages/user.vue

```javascript
const pledgeSocketStore = usePledgeSocketStore()

await onMounted(async () => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    await pledgeSocketStore.startConnectWebSocket()
  }
})
onBeforeUnmount(() => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    pledgeSocketStore.closeWebSocket()
  }
})
```

#### menu選項樣式新增（包含手機版）:

![本地圖片](./assets/md/image16.png)

##### 新增 [ 質押 ]按鈕

icon使用

```javascript
<i class="fas fa-coins" />
```

v-if判斷

```javascript
 v-if="siteStore.siteData?.gameType?.find((item: any) => item === 5)"
```

按鈕跳轉頁面

```javascript
navigateTo(`/user/pledge`)
```

以上改完用後台設定是否顯示
站點列表的基本資訊點開
[質押升息]按鈕開關測試前台是否顯示
![本地圖片](./assets/md/image3.png)

---

## /pages/user/pledge.vue 畫面新增

如果該project沒有該檔案請直接複製進去
保留原功能，樣式調整成該project的色系與排版樣式

### 後台需先確認

- 站點列表->基本設定->遊戲類型[質押升息]有開啟
  ![本地圖片](./assets/md/image4.png)
- 站點列表->基本設定->額外資訊要有 level （\*該功能有特別提才要）
  ![本地圖片](./assets/md/image6.png)
  如果沒有，新增完level要reload後台
  下方 玩家列表->基本設定 才會出現欄位
- 玩家列表->基本設定->額外資訊要有 level : 1 //有1.2.3等級可以輸入 （\*該功能有特別提才要）
  ![本地圖片](./assets/md/image7.png)
  ![本地圖片](./assets/md/image9.png)
- 質押控端->商品列表 要有商品，沒有可以自行新增
- 商品點擊修改最下方的等級 ->對應 玩家列表->基本設定->額外資訊（\*該功能有特別提才要）
  ![本地圖片](./assets/md/image8.png)

---

## /pages/bank.vue 調整

v-if="Object.keys(playerStore.playerInfo.bankInfo).length === 0"
改成

```javascript
v-if="Object.keys(playerStore.playerInfo.bankInfo || {}).length === 0"
```

-驗證成功判斷

```javascript
await useAsyncData(() => {
  if (playerStore.playerInfo.bankInfo !== null) {
    if (playerStore.playerInfo.bankInfo.status === 1) {
      navigateTo('/user/withdraw')
    }
  }
})

//送出bankApply後
if (bankApplyRes) {
  setTimeout(() => {
    const res = await playerStore.fetchInfo()
    if (res.success) {
      if (playerStore.playerInfo.bankInfo.status === 1) {
        navigateTo('/user/withdraw')
      }
    }
  }, 1000)
}
```

## ![本地圖片](./assets/md/image17.png)

## /pages/user/withdraw.vue 介面調整：

### 後台需先確認

- 站點列表->基本設定->遊戲類型[質押升息]有開啟
  ![本地圖片](./assets/md/image4.png)
- 玩家列表->基本設定->額外資訊要有 level : 1 //有1.2.3等級可以輸入
  ![本地圖片](./assets/md/image9.png)

### 前台會拿到兩個錢包

參考檔案 `/pages/user/modeltranfer/withdraw.vue`

### script 裡的function可以直接參考使用

如果直接覆蓋 原畫面功能要double check v-model的值

### 加上 「劃轉」btn ＆ form 的功能畫面

- 錢包數量要大於1才會顯示畫轉畫面

```html
v-if="playerStore.playerInfo.wallet.length > 1"
```

樣式調整成該project的色系與排版樣式
![本地圖片](./assets/md/image11.png)

### 提領要有 我的資產 欄位顯示

樣式調整成該project的色系與排版樣式
![本地圖片](./assets/md/image12.png)

- script

```javascript
const mainBalance = computed(() => {
  const mainWallet = playerStore.playerInfo.wallet.find(
    (item: any) => item.type === siteStore.siteData.mainWalletType
  )
  return mainWallet ? mainWallet.balance : 0
})
```

- html

```html
{{ new Intl.NumberFormat('zh-TW').format(mainBalance) }}
```

---

## /pages/user/record.vue 介面調整：

以 BPFE 中 `/pages/user/modeltranfer/record.vue` script代碼為準
請開啟 npm run dev 觀看畫面功能與樣式
原project的頁面html功能如果有缺，請將功能與畫面加上
樣式調整成該project的色系與排版樣式

![本地圖片](./assets/md/image13.png)

#### script:

- 可以直接覆蓋，但要注意該專案是否有額外處理 `formatMemo`
- 有的話原project `formatMemo` 要保留

#### html:

##### `recordType === 'transaction' div

- 要有錢包選擇的代碼
- 錢包數量要大於1才會顯示錢包選擇

```html
<div class="" v-if="playerStore.playerInfo.wallet.length > 1">
  <span class="">{{ $lang('錢包') }}</span>
  <select v-model="selectWalletId" class="selectStyle">
    <option
      v-for="item in playerStore.playerInfo.wallet"
      :key="item.id"
      :value="item.id"
      @click="(selectWalletId = item.id), (selectWallet = item)"
    >
      {{ walletTypeName(item.type) }}
    </option>
  </select>
</div>
```

以上改完用後台設定是否顯示兩個錢包

- 站點列表->基本設定->遊戲類型[質押升息]
  按鈕開關測試前台是否顯示

遊戲類型選擇兩個
前台會有兩個錢包紀錄選項

遊戲類型選擇ㄧ個
前台只有一個錢包紀錄選項
![本地圖片](./assets/md/image4.png)

##### `recordType === 'withdraw' div

- `v-for recordList.result` 改成 `withdrawRecordList.result`
- 確保該頁要有提領紀錄列表與btn
- 如果沒有紀錄可以用測試帳號從前台 /pages/user/withdraw.vue 中申請提領
  這樣後台提領列表就會有紀錄
  ![本地圖片](./assets/md/image10.png)

---

## /register.vue

- `const signupData` 裡要確認 `additionalInfo` 為 Object
  ```javascript
  additionalInfo: {
  }
  ```

---

## /pages/user裡其他頁面中有用到 `PlayerStore.playerInfo?.balance` 的地方

### 全部改成 v-for 因應有兩個錢包的顯示

樣式調整成該project的色系與排版樣式
![本地圖片](./assets/md/image14.png)

```html
<div class="balance" v-for="(item, index) in PlayerStore.playerInfo?.wallet">
  <h3>{{ walletName(item.type) }}</h3>
  <h1>$ {{ new Intl.NumberFormat('zh-tw').format(item.balance) }}</h1>
</div>
```

```javascript
const walletName = (type) => {
  switch (type) {
    case 1:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('美元資產(電子錢包)')
    case 2:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('電力資產(電子錢包)')
    case 3:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('商城資產(電子錢包)')
    case 4:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('質押資產(電子錢包)')
    default:
      return t('其他資產')
  }
}
```

---

## 最後請 double check 是否有報錯或顯示不出來的地方

---
