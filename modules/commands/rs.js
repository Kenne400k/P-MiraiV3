this.config = {
    name: "rs",
    version: "1.0.0",
    hasPermission: 2, // Quyền Admin
    credits: "DongDev",
    description: "Khởi Động Lại Bot.",
    commandCategory: "Admin",
    cooldowns: 0,
    images: [],
};

this.run = ({ event, api, permLevel }) => {
    // Kiểm tra quyền của người gửi
    if (permLevel < this.config.hasPermission) {
        return api.sendMessage("❌ Bạn không có quyền thực hiện lệnh này.", event.threadID, event.messageID);
    }

    // Nếu có quyền admin, tiếp tục thực hiện lệnh
    api.sendMessage("BOT ĐI ĐÁI CÁI!!", event.threadID, () => process.exit(1), event.messageID);
};