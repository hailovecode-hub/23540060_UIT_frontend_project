// LOGIC ĐĂNG NHẬP ẢO

// Xử lý đăng ký
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.querySelector('input[placeholder="Tên hiển thị"]').value;
  const email = e.target.querySelector('input[placeholder="Email"]').value;
  const password = e.target.querySelector('input[placeholder="Mật khẩu"]').value;

  if (name && password) {
    closeModal("signupModal");
    // Chuyển trang ngay sau khi đăng ký thành công
    alert("Đăng ký thành công");
    window.location.href = "./pages/home-page.html";
  }
});

// Xử lý đăng nhập
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailUser = e.target.querySelector('input[placeholder="Email"]').value;
  const passwordUser = e.target.querySelector('input[placeholder="Mật khẩu"]').value;

  if (emailUser && passwordUser) {
    closeModal("loginModal");

    // Chuyển trang ngay sau khi đăng nhập thành công
    alert("Đăng nhập thành công");
    window.location.href = "./pages/home-page.html";
    closeModal("loginModal");
  }

});
