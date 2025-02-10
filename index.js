const { spawn } = require("child_process");
const chalk = require("chalk");
const fs = require("fs");
const axios = require("axios");
const gradient = require('gradient-string');
const express = require('express');
const logger = console.log;

// Kiểm tra biến `con` và lấy theme
let theme = "default";
try {
    theme = con?.DESIGN?.Theme?.toLowerCase() || "default";
} catch (error) {
    console.warn("Lỗi lấy theme, dùng mặc định.");
}

let co, error;
const themeColors = {
    blue: gradient([{ color: "#1affa3", pos: 0.2 }, { color: "cyan", pos: 0.4 }, { color: "pink", pos: 0.6 }, { color: "cyan", pos: 0.8 }, { color: "#1affa3", pos: 1 }]),
    dream: gradient([{ color: "blue", pos: 0.2 }, { color: "pink", pos: 0.3 }, { color: "gold", pos: 0.6 }, { color: "pink", pos: 0.8 }, { color: "blue", pos: 1 }]),
    test: gradient("#243aff", "#4687f0", "#5800d4", "#243aff"),
    fiery: gradient("#fc2803", "#fc6f03", "#fcba03"),
    rainbow: gradient.rainbow,
    pastel: gradient.pastel,
    cristal: gradient.cristal,
    red: gradient("red", "orange"),
    aqua: gradient("#0030ff", "#4e6cf2"),
    pink: gradient("purple", "pink"),
    retro: gradient.retro,
    sunlight: gradient("orange", "#ffff00", "#ffe600"),
    teen: gradient.teen,
    summer: gradient.summer,
    flower: gradient("blue", "purple", "yellow", "#81ff6e"),
    ghost: gradient.mind,
    hacker: gradient("#47a127", "#0eed19", "#27f231"),
    default: gradient("#243aff", "#4687f0", "#5800d4"),
};

co = themeColors[theme] || themeColors.default;
error = chalk.red.bold;


          
// Lấy IP server
async function getIPserver() {
    try {
        const response = await axios.get("https://ipinfo.io/json", {
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        const data = response.data;

        console.log(gradient.rainbow("━━━━━━━━━━━━━━━[ INFO SERVER USER ]━━━━━━━━━━━━━━"));
        logger(`${data.ip}`, "| Địa chỉ IP |");
        logger(`${data.hostname || "N/A"}`, "| Tên Miền |");
        logger(`${data.country}`, "| Quốc gia |");
        logger(`${data.city || "N/A"}`, "| Thành phố |");
        logger(`${data.org}`, "| Nhà Mạng |");
        logger("N/A (do đây là môi trường Node.js)", "| Trình duyệt |");
        console.log(gradient.rainbow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    } catch (error) {
        console.error("Lỗi lấy thông tin server:", error);
    }
}
getIPserver();

function startBot(message) {
    (message) ? logger(message, "BOT ĐANG KHỞI ĐỘNG") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

   child.on("close",async (codeExit) => {
      var x = 'codeExit'.replace('codeExit',codeExit);
        if (codeExit == 1) return startBot("BOT RESTARTING!!!");
         else if (x.indexOf(2) == 0) {
           await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
                 startBot("Bot has been activated please wait a moment!!!");
       }
         else return; 
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

function runAutoJS() {
    
    const autoProcess = spawn("node", ["api/auto.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true,
    });

    autoProcess.on("close", (codeExit) => {
        if (codeExit !== 0) {
            console.error(gradient.red("auto.js gặp lỗi và đã dừng."));
        }
    });

    autoProcess.on("error", (err) => {
        console.error(gradient.red("Lỗi auto.js: " + err.message));
    });
}

// Chạy auto.js và thông báo server đang chạy trên localhost:3000

startBot("Bắt đầu chạy bot...");


