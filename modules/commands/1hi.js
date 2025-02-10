const fs = require("fs");
module.exports.config = {
	name: "Oops",
    version: "1.1.8",
	hasPermssion: 0,
	credits: "BLACK", 
	description: "",
	commandCategory: "Tiện Ích",
	usages: "",
    cooldowns: 5, 
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
const { threadID, messageID, senderID } = event;
    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {

					case "1":
			api.sendMessage({
				body: "", 
				attachment: fs.createReadStream(__dirname + `/Noprefix/ctien.jpg`)
			}, event.threadID, event.messageID);
			break;
		case "2":
			api.sendMessage({
				body: "", 
				attachment: fs.createReadStream(__dirname + `/Noprefix/banhmi.jpg`)
			}, event.threadID, event.messageID);
			break;
		case "3":
			api.sendMessage({
				body: "", 
				attachment: fs.createReadStream(__dirname + `/Noprefix/nnhi.jpg`)
			}, event.threadID, event.messageID); 
			break;
		case "4":
			api.sendMessage({
				body: "", 
				attachment: fs.createReadStream(__dirname + `/Noprefix/anhien.jpg`)
			}, event.threadID, event.messageID); 
			break;
					default:
				const choose = parseInt(event.body);
            	if (isNaN(event.body)) return api.sendMessage("💟 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝟏 𝐜𝐨𝐧 𝐬𝐨̂́", event.threadID, event.messageID);
            	if (choose > 12 || choose < 1) return api.sendMessage("🔰 𝐋𝐮̛̣𝐚 𝐜𝐡𝐨̣𝐧 𝐤𝐡𝐨̂𝐧𝐠 𝐧𝐚̆̀𝐦 𝐭𝐫𝐨𝐧𝐠 𝐝𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡.", event.threadID, event.messageID); 
		    
			}
		}
	}
}

module.exports.run = async ({ api, event, handleReply }) => {
	const fs = require("fs");
	const { threadID, messageID, senderID } = event;
	return api.sendMessage({ body: "= Gái OopsClan =" +
                "\n1. Cẩm Tiên" +
                "\n2. Bánh Mì" +
                "\n3. Nghi Nhi" +
                "\n4. An Nhiên" +
                "\n\nReply theo số nếu bạn muốn thấy gái đẹp"
            ,attachment: fs.createReadStream(__dirname + `/Noprefix/oops.jpg`)}, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })  
    })
}