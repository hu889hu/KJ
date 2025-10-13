<template>
  <div class="navbar">
    <img
      src="https://opussgroup.com/storage/logo.png?t=1727444208"
      alt="創富金融集團"
      class="logo"
    />
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}
</style>
