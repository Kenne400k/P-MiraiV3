const configCommand = {
    name: 'nhac2',
    version: '1.0.0',
    hasPermssion: 2,
    credits: 'pcoder',
    description: 'Tự động nhắc nhở đua đội vào lúc 20:05 mỗi ngày',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 3
};

const moment = require('moment-timezone');
const fs = require('fs'); // Thêm module fs để đọc file ảnh

// Tạo đối tượng lưu trạng thái nhắc nhở
let statusAuto = {};

// Hàm tính toán thời gian chờ đến 20:05
function getNextReminderTime() {
    const vietnamTime = moment.tz("Asia/Ho_Chi_Minh");
    let reminderTime = vietnamTime.clone().set({ hour: 20, minute: 5, second: 0, millisecond: 0 });

    // Nếu giờ hiện tại đã qua 20:05, set thời gian cho ngày hôm sau
    if (vietnamTime.isAfter(reminderTime)) {
        reminderTime.add(1, 'days');
    }

    return reminderTime;
}

// Hàm gửi thông báo vào lúc 20:05
async function noprefix(arg) {
    if (!statusAuto[arg.event.threadID] || arg.event.senderID == arg.api.getCurrentUserID()) return;

    const out = (a, b, c, d) => arg.api.sendMessage(a, b ? b : arg.event.threadID, c ? c : null, d ? d : arg.event.messageID);

    // Tính toán thời gian chờ đến 20:05
    const nextReminderTime = getNextReminderTime();
    const currentTime = moment.tz("Asia/Ho_Chi_Minh");

    // Tính toán khoảng thời gian chờ (ms)
    const waitTime = nextReminderTime.diff(currentTime);

    setTimeout(() => {
        // Khi đến 20:05, gửi thông báo nhắc nhở
        const listUserID = arg.event.participantIDs;
        let body = "⏰ Giờ đua clan đã điểm rồi, vào đua ngay thôi nào anh em! 🚗💨";
        let mentions = [];
        let index = 0;
    
        for (const idUser of listUserID) {
            body = "‎" + body;
            mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
            index -= 1;
        }
    
        // Đường dẫn ảnh thông báo
        const imagePath = __dirname + '/Noprefix/oops.jpg'; // Sử dụng __dirname để lấy đường dẫn chính xác
    
        if (fs.existsSync(imagePath)) {
            arg.api.sendMessage({
                body,
                mentions,
                attachment: fs.createReadStream(imagePath)
            }, arg.event.threadID, arg.event.messageID);
        } else {
            arg.api.sendMessage("🚫 Không tìm thấy ảnh thông báo.", arg.event.threadID, arg.event.messageID);
        }
    }, waitTime); // Đặt thời gian chờ cho đến 20:05
}

// Hàm bật/tắt tính năng nhắc nhở
function runCommand(arg) {
    const out = (a, b, c, d) => arg.api.sendMessage(a, b ? b : arg.event.threadID, c ? c : null, d ? d : arg.event.messageID);
    try {
        // Toggle trạng thái bật/tắt
        statusAuto[arg.event.threadID] = !statusAuto[arg.event.threadID];
        out((statusAuto[arg.event.threadID] ? 'Bật' : 'Tắt') + ' tính năng nhắc nhở đua đội');
    } catch (e) {
        out(e);
    }
};

module.exports = {
    config: configCommand,
    run: runCommand,
    handleEvent: noprefix
};
