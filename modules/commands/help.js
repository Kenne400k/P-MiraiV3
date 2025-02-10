const fs = require('fs'); // Thêm dòng này để import fs

module.exports.config = {
    name: "help",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "DC-Nam", // mod lại by táo táo
    description: "Xem danh sách lệnh và info",
    commandCategory: "Danh sách lệnh",
    usages: "[tên lệnh/all]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {},
    "en": {}
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID: tid, messageID: mid } = event;

    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");

    let type = args[0] ? args[0].toLowerCase() : "";
    let msg = "", array = [], i = 0;
    let prefix = global.config.PREFIX;

    if (type === "all") {
        for (const cmd of commands.values()) {
            msg += `[${++i}]-> ${cmd.config.name}: ${cmd.config.description}\n-----------------------\n`;
        }
        return api.sendMessage(msg, tid, mid);
    }

    if (type) {
        for (const cmd of commands.values()) {
            array.push(cmd.config.name.toString());
        }

        if (!array.includes(type)) {
            msg = `Không tìm thấy lệnh '${type}' trong hệ thống.`;
            return api.sendMessage(msg, tid, mid);
        }

        const cmd = commands.get(type).config;
        msg = `[🧸] ➜ 𝗧𝗲̂𝗻: ${cmd.name} ( ${cmd.version} )\n` +
              `[🔗] ➜ 𝗤𝘂𝘆𝗲̂̀𝗻 𝗵𝗮̣𝗻: ${TextPr(cmd.hasPermssion)}\n` +
              `[👤] ➜ 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${cmd.credits}\n` +
              `[💬] ➜ 𝗠𝗼̂ 𝘁𝗮̉: ${cmd.description}\n` +
              `[🧩] ➜ 𝗧𝗵𝘂𝗼̣̂𝗰 𝗻𝗵𝗼́𝗺: ${cmd.commandCategory}\n` +
              `[🌟] ➜ 𝗖𝗮́𝗰𝗵 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴: ${cmd.usages}\n` +
              `[⏰] ➜ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝗰𝗵𝗼̛̀: ${cmd.cooldowns}s`;

        return api.sendMessage(msg, tid, mid);
    } else {
        let categories = {};
        for (const cmd of commands.values()) {
            let cat = cmd.config.commandCategory;
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.config.name);
        }

        for (let cat in categories) {
            msg += `[💝] ➜ 𝗡𝗵𝗼́𝗺: ${cat.toUpperCase()}\n[✨] ➜ 𝗟𝗲̣̂𝗻𝗵: ${categories[cat].join(", ")}\n\n`;
        }

        msg += `[🔗] ➜ 𝗦𝗼̂́ 𝗹𝗲̣̂𝗻𝗵 𝗵𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶: ${commands.size}\n` +
               `[💜] ➜ 𝗗𝘂̀𝗻𝗴 "${prefix}help <tên lệnh>" để xem chi tiết.\n` +
               `[💙] ➜ 𝗗𝘂̀𝗻𝗴 "${prefix}help all" để xem tất cả lệnh.\n\n` +
               `⏰===『 ${timeNow} 』===⏰`;

        // Sử dụng ảnh từ cache/dos.gif
        return api.sendMessage({ 
            body: msg, 
            attachment: fs.createReadStream(__dirname + '/cache/dos.gif')
        }, tid, mid);
    }
};

module.exports.handleReaction = async ({ event, api, handleReaction }) => {
    const { threadID, messageID, userID } = event;
    if (userID !== handleReaction.author || event.reaction !== "❤") return;
    api.unsendMessage(handleReaction.messageID);

    const uptime = process.uptime();
    const hours = Math.floor(uptime / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    let msg = `===== [ 𝗧𝗛𝗢̂𝗡𝗚 𝗧𝗜𝗡 𝗕𝗢𝗧 ] =====\n\n` +
              `[💮] ➜ 𝗢𝗻𝗹𝗶𝗻𝗲 đ𝘂̛𝗼̛̣𝗰 ${hours}𝗴 ${minutes}𝗽 ${seconds}𝘀\n` +
              `[⚙️] ➜ 𝗣𝗵𝗶𝗲̂𝗻 𝗯𝗮̉𝗻: ${global.config.version}\n` +
              `[🔗] ➜ 𝗧𝗼̂̉𝗻𝗴 𝗹𝗲̣̂𝗻𝗵: ${global.client.commands.size}\n` +
              `[👥] ➜ 𝗧𝗼̂̉𝗻𝗴 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: ${global.data.allUserID.length}\n` +
              `[🏘️] ➜ 𝗧𝗼̂̉𝗻𝗴 𝗻𝗵𝗼́𝗺: ${global.data.allThreadID.length}\n` +
              `[💓] ➜ 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.config.PREFIX}`;

    return api.sendMessage({ 
        body: msg, 
        attachment: fs.createReadStream(__dirname + '/cache/dos.gif')
    }, threadID);
};

function TextPr(permission) {
    return permission === 0 ? "Thành Viên" :
           permission === 1 ? "Quản trị viên" :
           permission === 2 ? "ADMINBOT" : "Toàn Quyền";
}
