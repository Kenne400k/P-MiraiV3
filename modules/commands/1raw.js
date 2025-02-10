const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "raw",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "pcoder",
    description: "Get raw link of a code file in commands folder",
    commandCategory: "Tiện ích",
    usages: "/raw <filename>",
    cooldowns: 5,
    dependencies: {}
}

module.exports.run = async function({ api, args, event }) {
    const { threadID, messageID } = event;

    // Kiểm tra nếu có tham số file name
    if (args.length === 0) {
        return api.sendMessage("❌ **Bạn phải chỉ định tên file!**", threadID, messageID);
    }

    // Tên file được yêu cầu
    const filename = args[0];

    // Đường dẫn tới thư mục commands (chỉnh sửa theo đường dẫn của bạn)
    const filePath = path.join("/root/mirai/modules/commands", filename);

    // Kiểm tra file có tồn tại không
    if (fs.existsSync(filePath)) {
        // Tạo đường dẫn raw link
        const rawLink = `file:///${filePath}`; // Đây là raw link của file trong hệ thống

        // Gửi đường link raw cho người dùng
        api.sendMessage({
            body: `🔍 **Đây là raw link của file ${filename}**:\n\n${rawLink}`,
        }, threadID, messageID);
    } else {
        api.sendMessage(`❌ **File không tồn tại trong thư mục commands!**`, threadID, messageID);
    }
}
