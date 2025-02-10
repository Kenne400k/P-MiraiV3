# Mirai Bot Unofficial🤖<sub><sub>v3.0.0🚀</sub></sub>
<p align="center">
    <a href="https://nodejs.org/dist/v20.17.0"><img src="https://img.shields.io/badge/Nodejs%20Support-20.x-brightgreen.svg?style=flat-square" alt="Nodejs Support v20.x"></a>
    <img alt="size" src="https://img.shields.io/github/repo-size/DongDev-VN/Mirai-Bot-V3.svg?style=flat-square&label=size">
    <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=red&label=code%20version&prefix=v&query=%24.version&url=https://raw.githubusercontent.com/DongDev-VN/Mirai-Bot-V3/refs/heads/main/package.json&style=flat-square">
    <a href="https://github.com/DongDev-VN/Mirai-Bot-V3/commits"><img alt="Commits" src="https://img.shields.io/github/commit-activity/m/DongDev-VN/Mirai-Bot-V3.svg?label=commit&style=flat-square"></a>
    <img alt="Visitors" src="https://visitor-badge.laobi.icu/badge?page_id=DongDev-VN.Mirai-Bot-V3">
    <img alt="size" src="https://img.shields.io/badge/license-GPL--3.0-green?style=flat-square&color=brightgreen">
</p>

## 📝 **Giới thiệu**
**Mirai Bot V3 Unofficial** là một dự án được DongDev cập nhật và tiếp tục phát triển từ dự án Mirai-V2 của Catalizcs và SpermLord.

## 📜 **Cài đặt**
Sau đây là các bước cơ bản để có thể cài đặt và vận hành bot.

### 💡 **Yêu cầu**
- Dung lượng trống từ **1-2GB**
- Phần mềm chỉnh sửa file như [Notepad++](https://notepad-plus-plus.org/downloads/) hoặc [Sublime Text 3](https://www.sublimetext.com/3)
- Hiểu biết cơ bản về **Node.js** và **JavaScript**
- Một tài khoản Facebook dùng làm bot (**Nên dùng tài khoản phụ để tránh bị khóa**)
- Hệ điều hành:
  - **Windows:** Cần cài đặt `windows-build-tools`
  - **Linux:** Cần cài đặt `python3` hoặc `python2`
  - **Android:** Dùng **Termux** để chạy bot

### ⚙️ **Cài Đặt**

#### 1️⃣ Cài đặt Node.js và Git
Tải về và cài đặt:
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

#### 2️⃣ Clone source bot
```sh
git clone https://github.com/DongDev-VN/Mirai-Bot-V3 Mirai-Bot-V3
```

#### 3️⃣ Cài đặt thư viện cần thiết
```sh
cd Mirai-Bot-V3
npm install
```

#### 4️⃣ Chỉnh sửa cấu hình bot
- Mở file `config.json`
- Tuỳ chỉnh ID admin, tên bot,...
- Lưu lại file

#### 5️⃣ Thêm Cookie hoặc AppState
- Nếu dùng **cookie**, lưu vào `cookie.txt`
- Nếu dùng **AppState**, lưu vào `appstate.json`

#### 6️⃣ Khởi động bot
```sh
npm start
```

---

# 📱 Hướng Dẫn Cài Đặt Bot trên Termux

## 1️⃣ Tải Termux
Tải Termux từ F-Droid:
[📥 Tải Termux](https://f-droid.org/packages/com.termux/)

## 2️⃣ Cập nhật hệ thống và cài Debian
```sh
pkg update -y && pkg upgrade -y
pkg install proot-distro -y
proot-distro install debian
proot-distro login debian
```

## 3️⃣ Cài đặt Node.js
```sh
apt install nodejs -y
```

## 4️⃣ Cài đặt NVM (quản lý phiên bản Node.js)
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash  
source ~/.bashrc  
nvm install 20  
nvm use 20
```

## 5️⃣ Cài đặt File Browser (quản lý file trên web)
```sh
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
```

## 6️⃣ Chạy File Browser
```sh
filebrowser -r ~
```
Truy cập `localhost:8080` để kiểm tra.
- **User:** admin  
- **Pass:** admin  

## 7️⃣ Cài đặt bot
```sh
cd /ten-thu-muc-bot/
```
Mở `package.json`, tìm và xóa thư viện **canvas** nếu có.

## 8️⃣ Cài đặt thư viện
```sh
npm i
```

## 9️⃣ Thêm Cookie hoặc AppState
- **Cookie** → `cookie.txt`
- **AppState** → `appstate.json`

## 🔟 Khởi động bot
```sh
npm start
```

---
### 📌 Liên Hệ Mua Bot Mirai V3
💬 **Facebook:** [Fb.com/100047128875560](https://www.facebook.com/100047128875560)  
📞 **Zalo:** 0786888655
