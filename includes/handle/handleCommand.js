module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const stringSimilarity = require('string-similarity');
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const logger = require("../../utils/log.js");
    const moment = require("moment-timezone");

    return async function ({ event }) {
        const dateNow = Date.now();
        const time = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY");
        const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly } = global.config;
        const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
        const { commands, cooldowns } = global.client;
        var { body, senderID, threadID, messageID } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        // Kiểm tra nếu user hoặc nhóm bị ban
        if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox == false && senderID == threadID)) {
            if (!ADMINBOT.includes(senderID.toString())) {
                if (userBanned.has(senderID)) {
                    const { reason, dateAdded } = userBanned.get(senderID) || {};
                    return api.sendMessage(`Bạn đã bị ban! Lý do: ${reason} - Ngày: ${dateAdded}`, threadID, async (err, info) => {
                        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                        return api.unsendMessage(info.messageID);
                    }, messageID);
                } else if (threadBanned.has(threadID)) {
                    const { reason, dateAdded } = threadBanned.get(threadID) || {};
                    return api.sendMessage(`Nhóm này đã bị ban! Lý do: ${reason} - Ngày: ${dateAdded}`, threadID, async (err, info) => {
                        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                        return api.unsendMessage(info.messageID);
                    }, messageID);
                }
            }
        }

        // Xử lý command
        body = body !== undefined ? body : '';
        const [matchedPrefix] = body.match(new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadData.get(threadID) || {}).PREFIX || PREFIX)})\\s*`)) || [''];
        var args = body.slice(matchedPrefix.length).trim().split(/ +/);
        var commandName = args.shift()?.toLowerCase();  // Kiểm tra nếu commandName tồn tại
        var command = commands.get(commandName);

        if (!command) return;  // Nếu không có lệnh thì bỏ qua luôn

        // Kiểm tra quyền hạn của user
        var permssion = 0;
        const threadInfoo = (await Threads.getData(threadID)).threadInfo;
        const adminIDs = threadInfoo ? threadInfoo.adminIDs : [];
        const find = adminIDs.find(el => el.id == senderID);
        if (ADMINBOT.includes(senderID.toString())) permssion = 2;
        else if (NDH.includes(senderID.toString())) permssion = 3;
        else if (find) permssion = 1;

        const rolePermissions = {
            1: "Quản Trị Viên",
            2: "ADMIN BOT",
            3: "Người Hỗ Trợ"
        };
        const requiredPermission = rolePermissions[command.config.hasPermission] || "";
        if (command.config.hasPermission > permssion) {
            return api.sendMessage(`📌 Lệnh ${command.config.name} yêu cầu quyền hạn ${requiredPermission}`, threadID, async (err, info) => {
                await new Promise(resolve => setTimeout(resolve, 15 * 1000));
                return api.unsendMessage(info.messageID);
            }, messageID);
        }

        // Xử lý cooldown
        if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
        const timestamps = client.cooldowns.get(command.config.name);
        const expirationTime = (command.config.cooldowns || 1) * 1000;
        if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
            return api.setMessageReaction('😼', event.messageID, err => (err) ? logger('Lỗi khi set reaction', 2) : '', true);
        }

        // Log khi Developer Mode bật
        if (DeveloperMode === true) {
            logger(`[DEV MODE] ${time} - Chạy lệnh: ${commandName} từ ${senderID} trong nhóm ${threadID} với args: ${args.join(" ")} (Thời gian: ${(Date.now()) - dateNow}ms)`);
        }

        // Chạy lệnh
        try {
            const Obj = {
                api,
                event,
                args,
                models,
                Users,
                Threads,
                Currencies,
                permssion,
                getText: (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language)) ? (...values) => {
                    var lang = command.languages[global.config.language][values[0]] || '';
                    for (var i = values.length; i > 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, values[i]);
                    }
                    return lang;
                } : () => {}
            };
            await command.run(Obj);
            timestamps.set(senderID, dateNow);
        } catch (e) {
            console.log(e);
            return api.sendMessage(`Lỗi khi chạy lệnh ${commandName}: ${e}`, threadID);
        }
    };
};
