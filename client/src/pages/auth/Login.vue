<template>
  <div class="login-container">
    <div class="login-left">
      <h2>Chào mừng bạn đến với SPACESOUL LIBRARY</h2>
      <p>
        Đăng nhập để tiếp tục khám phá và sử dụng các dịch vụ của chúng tôi.
      </p>
    </div>
    <div class="login-right">
      <h1>Đăng nhập</h1>

      <form>
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="Nhập email" />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input type="password" placeholder="Nhập mật khẩu" />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-left {
  flex: 4;
  padding: 30px;
  background-color: #1f3728;
}
.login-right {
  flex: 6;
  padding: 30px;
}
</style>
