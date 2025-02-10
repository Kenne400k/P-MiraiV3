module.exports.config = {
    name: "dlvideo",
    version: "1.1.0",
    hasPermission: 0,
    credits: "Pcoder",
    description: "Tải video hoặc âm thanh từ nhiều nền tảng",
    commandCategory: "Tiện ích",
    usages: "/dlvideo <link>",
    cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
        return api.sendMessage("❌ Vui lòng nhập đường link video hoặc âm thanh!", threadID, messageID);
    }

    const videoURL = args[0];
    const apiKey = "979ce6";
    const apiURL = `https://hungdev.id.vn/medias/down-aio?apikey=${apiKey}&url=${encodeURIComponent(videoURL)}`;

    api.sendMessage("🔄 Đang xử lý, vui lòng chờ...", threadID, messageID);

    try {
        const res = await axios.get(apiURL);
        const data = res.data;

        if (!data || !data.success || !data.data) {
            return api.sendMessage("❌ Không thể tải dữ liệu. Hãy kiểm tra lại link!", threadID, messageID);
        }

        const { title, author, duration, medias } = data.data;
        if (!medias || medias.length === 0) {
            return api.sendMessage("❌ Không tìm thấy dữ liệu tải!", threadID, messageID);
        }

        const bestMedia = medias.find(m => m.type === "video") || medias.find(m => m.type === "audio");
        if (!bestMedia) {
            return api.sendMessage("❌ Không tìm thấy file video hoặc âm thanh!", threadID, messageID);
        }

        const fileExtension = bestMedia.extension || "mp4";
        const filePath = path.join(__dirname, `cache/dl_${Date.now()}.${fileExtension}`);

        const writer = fs.createWriteStream(filePath);
        const response = await axios.get(bestMedia.url, { responseType: "stream" });
        response.data.pipe(writer);

        writer.on("finish", () => {
            api.sendMessage({
                body: `🎬 𝗧𝗔̉𝗜 𝗧𝗛𝗔̀𝗡𝗛 𝗖𝗢̂𝗡𝗚! ✅\n\n` +
                      `📌 𝗧𝗶𝗲̂𝘂 đ𝗲̂̀: ${title}\n` +
                      `👤 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${author || "Không rõ"}\n` +
                      `⏳ 𝗧𝗵𝗼̛̀𝗶 𝗹𝘂̛𝗼̛̣𝗻𝗴: ${duration}\n\n` +
                      `📥 𝗙𝗶𝗹𝗲 đ𝗮̃ đ𝘂̛𝗼̛̣𝗰 𝘁𝗮̉𝗶 𝘃𝗲̂̀! 🎶🎥`,
                attachment: fs.createReadStream(filePath)
            }, threadID, () => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error("❌ Lỗi khi xóa file:", err);
                });
            }, messageID);
        });

        writer.on("error", () => {
            return api.sendMessage("❌ Lỗi khi tải file. Thử lại sau!", threadID, messageID);
        });

    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu!", threadID, messageID);
    }
};
