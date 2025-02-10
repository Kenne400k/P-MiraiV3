const axios = require("axios");

module.exports.config = {
    name: "apikey",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Pcoder",
    description: "Đăng ký API Key và kiểm tra API Key",
    commandCategory: "Tiện ích",
    usages: "/apikey reg <name> | /apikey checker <apikey>",
    cooldowns: 5,
    dependencies: {}
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    // Kiểm tra nếu là lệnh đăng ký API Key
    if (args[0] === "reg") {
        if (args.length === 1) {
            api.sendMessage("Vui lòng cung cấp tên của bạn để đăng ký API key. Sử dụng lệnh /apikey reg <name>", threadID, messageID);
            return;
        }

        const name = args.slice(1).join(" "); // Lấy tên từ đối số

        try {
            // Gửi yêu cầu đăng ký API key
            const url = `https://better-foxhound-relative.ngrok-free.app/apikey?type=register&name=${name}`;
            const response = await axios.get(url);

            // Kiểm tra phản hồi từ API
            if (response.status === 200 && response.data.apikey) {
                const { apikey, type, message } = response.data;

                // Phân biệt giữa Premium và Basic API key
                if (type === "premium") {
                    api.sendMessage(`🎮 𝗣𝗖𝗢𝗗𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟 🎮\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n𝗣𝗖𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n🛠️ API Key Premium của bạn là: ${apikey}\n🔑 Loại: Premium\n📝 Số yêu cầu: Không giới hạn`, threadID, messageID);
                } else {
                    api.sendMessage(`🎮 𝗣𝗖𝗢𝗗𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟 🎮\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n𝗣𝗖𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n🛠️ API Key Basic của bạn là: ${apikey}\n🔑 Loại: Basic\n📝 Số yêu cầu: 50`, threadID, messageID);
                }
            } else {
                api.sendMessage("Lỗi khi đăng ký API Key. Vui lòng thử lại hoặc kiểm tra lại tên của bạn.", threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("Lỗi khi kết nối tới API. Vui lòng thử lại sau.", threadID, messageID);
        }
    } 
    
    // Kiểm tra nếu là lệnh kiểm tra API Key
    else if (args[0] === "checker") {
        if (args.length === 1) {
            api.sendMessage("Vui lòng cung cấp API key để kiểm tra. Sử dụng lệnh /apikey checker <apikey>", threadID, messageID);
            return;
        }

        const apikey = args[1]; // Lấy API key từ đối số

        try {
            // Gửi yêu cầu kiểm tra API key
            const url = `https://better-foxhound-relative.ngrok-free.app/apikey?type=checker&apikey=${apikey}`;
            const response = await axios.get(url);

            // Kiểm tra phản hồi từ API
            if (response.status === 200 && response.data.apikey) {
                const { apikey, name, type, request } = response.data;
                if (type === "premium") {
                    api.sendMessage(`🎮 𝗣𝗖𝗢𝗗𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟 🎮\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n𝗣𝗖𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n🔑 API Key Premium\n📝 Tên: ${name}\n🛠️ Loại: Premium\n📝 Số yêu cầu: Không giới hạn`, threadID, messageID);
                } else {
                    api.sendMessage(`🎮 𝗣𝗖𝗢𝗗𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟 🎮\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n𝗣𝗖𝗘𝗥 𝘅 𝗣𝗞𝗧𝗢𝗢𝗟\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n🔑 API Key Basic\n📝 Tên: ${name}\n🛠️ Loại: Basic\n📝 Số yêu cầu: 50`, threadID, messageID);
                }
            } else {
                api.sendMessage("API Key không tồn tại hoặc không hợp lệ!", threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("Lỗi khi kết nối tới API. Vui lòng thử lại sau.", threadID, messageID);
        }
    } 
    
    else {
        api.sendMessage("Lệnh không hợp lệ. Sử dụng /apikey reg hoặc /apikey checker", threadID, messageID);
    }
}
