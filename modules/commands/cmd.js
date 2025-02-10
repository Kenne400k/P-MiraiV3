const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "cmd",
    version: "1.1.0",
    hasPermssion: 3,
    credits: "Pcoder",
    description: "Quản lý module bot (load, unload, info, count)",
    commandCategory: "Admin",
    usages: "[load/unload/loadAll/unloadAll/info/count] [module]",
    cooldowns: 2
};

// Load một hoặc nhiều module
const loadCommand = async ({ moduleList, threadID, messageID, api }) => {
    let errorList = [];

    for (const moduleName of moduleList) {
        try {
            const modulePath = path.join(__dirname, `${moduleName}.js`);

            // Xóa module cũ khỏi cache
            delete require.cache[require.resolve(modulePath)];

            const command = require(modulePath);
            global.client.commands.set(command.config.name, command);
        } catch (error) {
            errorList.push(`- ${moduleName}: ${error.message}`);
        }
    }

    const successCount = moduleList.length - errorList.length;
    api.sendMessage(
        `✅ Đã load ${successCount}/${moduleList.length} module!\n${errorList.join("\n")}`,
        threadID,
        messageID
    );
};

// Unload một hoặc nhiều module
const unloadCommand = async ({ moduleList, threadID, messageID, api }) => {
    for (const moduleName of moduleList) {
        global.client.commands.delete(moduleName);
    }
    api.sendMessage(`🛑 Đã gỡ ${moduleList.length} module!`, threadID, messageID);
};

// Lấy thông tin module
const getModuleInfo = (moduleName) => {
    const command = global.client.commands.get(moduleName);
    if (!command) return `⚠ Module '${moduleName}' không tồn tại!`;

    const { name, version, hasPermssion, credits, cooldowns } = command.config;
    return `📜 Thông tin module:
- 🔹 Tên: ${name}
- 🔹 Phiên bản: ${version}
- 🔹 Quyền hạn: ${hasPermssion}
- 🔹 Tác giả: ${credits}
- 🔹 Thời gian chờ: ${cooldowns}s`;
};

// Xử lý lệnh
module.exports.run = async ({ event, args, api }) => {
    const { threadID, messageID } = event;
    const moduleList = args.slice(1);

    switch (args[0]) {
        case "load":
            if (!moduleList.length) return api.sendMessage("❌ Chưa nhập module cần load!", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID, api });

        case "unload":
            if (!moduleList.length) return api.sendMessage("❌ Chưa nhập module cần gỡ!", threadID, messageID);
            return unloadCommand({ moduleList, threadID, messageID, api });

        case "loadAll": {
            const allModules = fs.readdirSync(__dirname)
                .filter(file => file.endsWith(".js") && file !== "cmd.js")
                .map(file => file.replace(".js", ""));
            return loadCommand({ moduleList: allModules, threadID, messageID, api });
        }

        case "unloadAll": {
            const allModules = [...global.client.commands.keys()];
            return unloadCommand({ moduleList: allModules, threadID, messageID, api });
        }

        case "info":
            if (!moduleList.length) return api.sendMessage("❌ Chưa nhập module cần xem!", threadID, messageID);
            return api.sendMessage(getModuleInfo(moduleList[0]), threadID, messageID);

        case "count":
            return api.sendMessage(`🔢 Hiện có ${global.client.commands.size} module đang hoạt động!`, threadID, messageID);

        default:
            return api.sendMessage("⚠ Lệnh không hợp lệ!", threadID, messageID);
    }
};
