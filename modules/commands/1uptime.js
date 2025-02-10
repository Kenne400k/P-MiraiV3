const moment = require('moment-timezone');
const axios = require('axios'); // Để sử dụng tải ảnh

module.exports = {
    config: {
        name: "upt090",
        credit: "Vanhung",
        description: "View the uptime of the bot",
        commandCategory: "System",
        cooldowns: 5
    },
    run: async ({ api, event }) => {
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / (60 * 60));
        const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        // Lấy thời gian uptime của bot
        const replyMsg = `⏱️ Bot uptime: ${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;

        // Link ảnh
        const imageUrl = "https://f48-zpg-r.zdn.vn/jpg/8606418411915881408/aed4b64c12e4aebaf7f5.jpg";

        try {
            // Tải ảnh về trước
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            // Tạo đường dẫn tạm cho ảnh
            const imagePath = `${__dirname}/cache/uptime_image.jpg`;

            // Ghi dữ liệu ảnh vào file
            require('fs').writeFileSync(imagePath, Buffer.from(response.data));

            // Gửi tin nhắn kèm theo ảnh
            return api.sendMessage({
                body: replyMsg,  // Tin nhắn kèm theo thời gian uptime
                attachment: require('fs').createReadStream(imagePath)  // Gửi ảnh
            }, event.threadID, () => {
                // Xóa ảnh sau khi gửi xong
                require('fs').unlinkSync(imagePath);
            }, event.messageID);

        } catch (error) {
            console.error("Error downloading image:", error);
            api.sendMessage("Đã có lỗi khi tải ảnh!", event.threadID);
        }
    }
};