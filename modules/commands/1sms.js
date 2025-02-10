module.exports.config = {
    name: "spamsms",
    version: "1.1.2",
    hasPermission: 1,
    credits: "Pcoder",
    description: "Spam SMS OTP",
    commandCategory: "Tiện ích",
    usages: "/spamsms {sdt} {time}",
    cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length < 2) {
        return api.sendMessage("❌ Vui lòng nhập đúng cú pháp: /spamsms {sdt} {time}", threadID, messageID);
    }

    const sdt = args[0];
    const time = parseInt(args[1]);

    if (!/^\d{10}$/.test(sdt)) {
        return api.sendMessage("❌ Số điện thoại không hợp lệ, vui lòng nhập 10 số!", threadID, messageID);
    }

    if (isNaN(time) || time > 120) {
        return api.sendMessage("❌ Thời gian không hợp lệ (tối đa 120 giây)!", threadID, messageID);
    }

    const apiKey = "a0e66baea2139a323840f80e2e325e5a";
    const apiURL = `http://localhost:3001/api/spamsms?sdt=${sdt}&apikey=${apiKey}&time=${time}`;
    const imageURL = "https://i.imgur.com/12r6H1B.gif";
    const imagePath = path.join(__dirname, "cache/spamsms.gif");

    try {
        if (!fs.existsSync(imagePath)) {
            await downloadImage(imageURL, imagePath);
        }

        // Gửi tin nhắn ngay lập tức với ảnh
        api.sendMessage({
            body: `🔄 Đang gửi OTP đến ${sdt} trong ${time}s...`,
            attachment: fs.createReadStream(imagePath)
        }, threadID, async () => {
            console.log(`Bắt đầu gửi OTP cho ${sdt} trong ${time}s...`);

            // Gửi OTP đến API
            try {
                const res = await axios.get(apiURL);
                const data = res.data;

                api.sendMessage({
                    body: `✅ ${data.message}`,
                    attachment: fs.createReadStream(imagePath)
                }, threadID, messageID);
            } catch (err) {
                console.error(err);
                api.sendMessage("❌ Đã xảy ra lỗi khi gửi OTP!", threadID, messageID);
            }
        }, messageID);

    } catch (err) {
        console.error(err);
        api.sendMessage("❌ Lỗi tải ảnh!", threadID, messageID);
    }
};

// Hàm tải ảnh từ URL về file tạm
async function downloadImage(url, outputPath) {
    const response = await axios({
        url,
        responseType: "stream"
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}
