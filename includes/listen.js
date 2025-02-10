module.exports = function({ api, models }) {

	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });
	const logger = require("../utils/log.js");
	const fs = require("fs");

    const moment = require('moment-timezone');

    const axios = require("axios");

  var day = moment.tz("Asia/Ho_Chi_Minh").day();

  const checkttDataPath = __dirname + '/../modules/commands/tt/';

  setInterval(async() => {

    const day_now = moment.tz("Asia/Ho_Chi_Minh").day();

    if (day != day_now) {

      day = day_now;

      const checkttData = fs.readdirSync(checkttDataPath);

      console.log('--> 𝗖𝗛𝗘𝗖𝗞𝗧𝗧: 𝗡𝗴𝗮̀𝘆 𝗠𝗼̛́𝗶');

      checkttData.forEach(async(checkttFile) => {

        const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));

        let storage = [], count = 1;

        for (const item of checktt.day) {

            const userName = await Users.getNameUser(item.id) || 'Facebook User';

            const itemToPush = item;

            itemToPush.name = userName;

            storage.push(itemToPush);

        };

        storage.sort((a, b) => {

            if (a.count > b.count) {

                return -1;

            }

            else if (a.count < b.count) {

                return 1;

            } else {

                return a.name.localeCompare(b.name);

            }

        });

        let checkttBody = '=== 𝗧𝗼𝗽 𝟭𝟬 𝗧𝘂̛𝗼̛𝗻𝗴 𝗧𝗮́𝗰 𝗡𝗴𝗮̀𝘆 ===\n';

        checkttBody += storage.slice(0, 10).map(item => {

          return `${count++}. ${item.name} (${item.count})`;

      }).join('\n');

        api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');

        

        checktt.day.forEach(e => {

            e.count = 0;

        });

        checktt.time = day_now;

        

        fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));

      });

      if (day_now == 1) {

        console.log('--> 𝗖𝗛𝗘𝗖𝗞𝗧𝗧: 𝗧𝘂𝗮̂̀𝗻 𝗠𝗼̛́𝗶');

        checkttData.forEach(async(checkttFile) => {

          const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));

          let storage = [], count = 1;

          for (const item of checktt.week) {

              const userName = await Users.getNameUser(item.id) || 'Facebook User';

              const itemToPush = item;

              itemToPush.name = userName;

              storage.push(itemToPush);

          };

          storage.sort((a, b) => {

              if (a.count > b.count) {

                  return -1;

              }

              else if (a.count < b.count) {

                  return 1;

              } else {

                  return a.name.localeCompare(b.name);

              }

          });

          let checkttBody = '=== 𝗧𝗼𝗽 𝟭𝟬 𝗧𝘂̛𝗼̛𝗻𝗴 𝗧𝗮́𝗰 𝗧𝘂𝗮̂̀𝗻 ===\n';

          checkttBody += storage.slice(0, 10).map(item => {

            return `${count++}. ${item.name} (${item.count})`;

        }).join('\n');

          api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');

          checktt.week.forEach(e => {

              e.count = 0;

          });

          

          fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));

        })

      }

      global.client.sending_top = false;

    }

  }, 1000 * 10);


  
	//////////////////////////////////////////////////////////////////////
	//========= Push all variable from database to environment =========//
	//////////////////////////////////////////////////////////////////////
	
(async function () {

    try {
        logger(global.getText('listen', 'startLoadEnvironment'), '『 P-DATABASE』');
        let threads = await Threads.getAll(),
            users = await Users.getAll(['userID', 'name', 'data']),
            currencies = await Currencies.getAll(['userID']);
        for (const data of threads) {
            const idThread = String(data.threadID);
            global.data.allThreadID.push(idThread), 
            global.data.threadData.set(idThread, data['data'] || {}), 
            global.data.threadInfo.set(idThread, data.threadInfo || {});
            if (data['data'] && data['data']['banned'] == !![]) 
            	global.data.threadBanned.set(idThread, 
            	{
                'reason': data['data']['reason'] || '',
                'dateAdded': data['data']['dateAdded'] || ''
            });
            if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0) 
            global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
            if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
        }
        logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
        for (const dataU of users) {
            const idUsers = String(dataU['userID']);
            global.data['allUserID']['push'](idUsers);
            if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
            if (dataU.data && dataU.data.banned == 1) global.data['userBanned']['set'](idUsers, {
                'reason': dataU['data']['reason'] || '',
                'dateAdded': dataU['data']['dateAdded'] || ''
            });
            if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0) 
            global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
        }
        for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
        logger.loader(global.getText('listen', 'loadedEnvironmentUser')), logger(global.getText('listen','successLoadEnvironment'),'[ DATABASE ]');
    } catch (error) {
        return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
    }
}());
	logger(`${api.getCurrentUserID()} - [ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "PCODER" : global.config.BOTNAME}`, "『 BOT INFO 』");
	
	///////////////////////////////////////////////
	//========= Require all handle need =========//
	//////////////////////////////////////////////

	const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
	const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });
  const handleUnsend = require("./handle/handleUnsend")({ api })
	logger.loader(`====== ${Date.now() - global.client.timeStart}ms ======`);


	//DEFINE DATLICH PATH
	const datlichPath = __dirname + '/../modules/commands/cache/datlich.json';

	//FUNCTION HOẠT ĐỘNG NHƯ CÁI TÊN CỦA NÓ, CRE: DUNGUWU
	const monthToMSObj = {
		1: 31 * 24 * 60 * 60 * 1000,
		2: 28 * 24 * 60 * 60 * 1000,
		3: 31 * 24 * 60 * 60 * 1000,
		4: 30 * 24 * 60 * 60 * 1000,
		5: 31 * 24 * 60 * 60 * 1000,
		6: 30 * 24 * 60 * 60 * 1000,
		7: 31 * 24 * 60 * 60 * 1000,
		8: 31 * 24 * 60 * 60 * 1000,
		9: 30 * 24 * 60 * 60 * 1000,
		10: 31 * 24 * 60 * 60 * 1000,
		11: 30 * 24 * 60 * 60 * 1000,
		12: 31 * 24 * 60 * 60 * 1000
	};
	const checkTime = (time) => new Promise((resolve) => {
		time.forEach((e, i) => time[i] = parseInt(String(e).trim()));
		const getDayFromMonth = (month) => (month == 0) ? 0 : (month == 2) ? (time[2] % 4 == 0) ? 29 : 28 : ([1, 3, 5, 7, 8, 10, 12].includes(month)) ? 31 : 30;
		if (time[1] > 12 || time[1] < 1) resolve("Tháng của bạn có vẻ không hợp lệ");
		if (time[0] > getDayFromMonth(time[1]) || time[0] < 1) resolve("Ngày của bạn có vẻ không hợp lệ");
		if (time[2] < 2022) resolve("Bạn sống ở kỷ nguyên nào thế?");
		if (time[3] > 23 || time[3] < 0) resolve("Giờ của bạn có vẻ không hợp lệ");
		if (time[4] > 59 || time[3] < 0) resolve("Phút của bạn có vẻ không hợp lệ");
		if (time[5] > 59 || time[3] < 0) resolve("Giây của bạn có vẻ không hợp lệ");
		yr = time[2] - 1970;
		yearToMS = (yr) * 365 * 24 * 60 * 60 * 1000;
		yearToMS += ((yr - 2) / 4).toFixed(0) * 24 * 60 * 60 * 1000;
		monthToMS = 0;
		for (let i = 1; i < time[1]; i++) monthToMS += monthToMSObj[i];
		if (time[2] % 4 == 0) monthToMS += 24 * 60 * 60 * 1000;
		dayToMS = time[0] * 24 * 60 * 60 * 1000;
		hourToMS = time[3] * 60 * 60 * 1000;
		minuteToMS = time[4] * 60 * 1000;
		secondToMS = time[5] * 1000;
		oneDayToMS = 24 * 60 * 60 * 1000;
		timeMs = yearToMS + monthToMS + dayToMS + hourToMS + minuteToMS + secondToMS - oneDayToMS;
		resolve(timeMs);
	});
  
	const tenMinutes = 10 * 60 * 1000;
  
	const checkAndExecuteEvent = async () => {

		/*smol check*/
		if (!fs.existsSync(datlichPath)) fs.writeFileSync(datlichPath, JSON.stringify({}, null, 4));
		var data = JSON.parse(fs.readFileSync(datlichPath));

		//GET CURRENT TIME
		var timeVN = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY_HH:mm:ss');
		timeVN = timeVN.split("_");
		timeVN = [...timeVN[0].split("/"), ...timeVN[1].split(":")];

		let temp = [];
		let vnMS = await checkTime(timeVN);
		const compareTime = e => new Promise(async (resolve) => {
			let getTimeMS = await checkTime(e.split("_"));
			if (getTimeMS < vnMS) {
				if (vnMS - getTimeMS < tenMinutes) {
					data[boxID][e]["TID"] = boxID;
					temp.push(data[boxID][e]); delete data[boxID][e];
				} else delete data[boxID][e];
				fs.writeFileSync(datlichPath, JSON.stringify(data, null, 4));
			};
			resolve();
		})

		await new Promise(async (resolve) => {
			for (boxID in data) {
				for (e of Object.keys(data[boxID])) await compareTime(e);
			}
			resolve();
		})
		for (el of temp) {
			try {
				var all = (await Threads.getInfo(el["TID"])).participantIDs;
			    all.splice(all.indexOf(api.getCurrentUserID()), 1);
				var body = el.REASON || "MỌI NGƯỜI ƠI", mentions = [], index = 0;
				
			    for (let i = 0; i < all.length; i++) {
				    if (i == body.length) body += " ‍ ";
				    mentions.push({
				  	  tag: body[i],
				  	  id: all[i],
				  	  fromIndex: i - 1
				    });
			    }
			} catch (e) { return console.log(e); }
			var out = {
				body, mentions
			}
			if ("ATTACHMENT" in el) {
				out.attachment = [];
				for (a of el.ATTACHMENT) {
					let getAttachment = (await axios.get(encodeURI(a.url), { responseType: "arraybuffer"})).data;
					fs.writeFileSync(__dirname + `/../modules/commands/cache/${a.fileName}`, Buffer.from(getAttachment, 'utf-8'));
					out.attachment.push(fs.createReadStream(__dirname + `/../modules/commands/cache/${a.fileName}`));
				}
			}
			console.log(out);
			if ("BOX" in el) await api.setTitle(el["BOX"], el["TID"]);
			api.sendMessage(out, el["TID"], () => ("ATTACHMENT" in el) ? el.ATTACHMENT.forEach(a => fs.unlinkSync(__dirname + `/../modules/commands/cache/${a.fileName}`)) : "");
		}

	}
	setInterval(checkAndExecuteEvent, tenMinutes/10);
  
  /////////////////////////////////////////////////
  ////////////// Get time khi bot bật /////////////
  /////////// Không có tác dụng như upt ///////////
  /////////////////////////////////////////////////

	var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
   var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = 'Chủ nhật'
  if (thu == 'Monday') thu = 'Thứ'
  if (thu == 'Tuesday') thu = 'Thứ 3'
  if (thu == 'Wednesday') thu = 'Thứ 4'
  if (thu == "Thursday") thu = 'Thứ 5'
  if (thu == 'Friday') thu = 'Thứ 6'
  if (thu == 'Saturday') thu = 'Thứ 7'
  logger(`${thu} || ${gio}`, "[ Time ]")

	//////////////////////////////////////////////////
	//========= Send event to handle need =========//
	/////////////////////////////////////////////////
	
	return async (event) => {
    if (event.type == "change_thread_image") api.sendMessage(`» [ Update Thread ] ${event.snippet}`, event.threadID);
    if (global.config.duyetbox == true) {
	  let data = JSON.parse(fs.readFileSync(__dirname + "/../modules/commands/cache/approvedThreads.json"));
	  let adminBot = global.config.ADMINBOT;
	  let ndhBot = global.config.NDH;
	  let pendingPath = __dirname + "/../modules/commands/cache/pendingdThreads.json";
	  if (!data.includes(event.senderID) && !data.includes(event.threadID) && !adminBot.includes(event.senderID) &&!ndhBot.includes(event.senderID)) {
		
		//getPrefix
		  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
		  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
		  //check body
		if (event.body == `duyetbox`) {
      let threadInfo = await api.getThreadInfo(event.threadID);
    let nameThread = threadInfo.threadName || await Users.getNameUser(event.senderID)
		  adminBot.forEach(e => {
			api.sendMessage(`𝗬𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗽𝗵𝗲̂ 𝗱𝘂𝘆𝗲̣̂𝘁 𝗯𝗼𝘅\n\n𝗕𝗼𝘅: ${nameThread}\n𝗜𝗗: ${event.threadID}\n\n『 ${gio} 』`, e, ndhBot);
		  })
		  return api.sendMessage(`Đã gửi yêu cầu đến các admin bot!`, event.threadID, () => {
			let pendingData = JSON.parse(fs.readFileSync(pendingPath));
			if (!pendingData.includes(event.threadID) || !pendingData.includes(event.senderID)) {
			  pendingData.push(event.threadID || event.senderID);
			fs.writeFileSync(pendingPath, JSON.stringify(pendingData));
			}
		  });
		}
	if (event.body && event.body.startsWith(prefix)) return api.sendMessage(`𝗕𝗼𝘅 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗻𝗮̆̀𝗺 𝘁𝗿𝗼𝗻𝗴 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵 𝗱𝘂̛𝗼̛̣𝗰 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗯𝗼𝘁, 𝗱𝗲̂̉ 𝗴𝘂̛̉𝗶 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗱𝘂𝘆𝗲̣̂𝘁 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗯𝗼𝘁\n\nGhi: "duyetbox"\n\n𝗔𝗱𝗺𝗶𝗻 𝘀𝗲̃ 𝗽𝗵𝗲̂ 𝗱𝘂𝘆𝗲̣̂𝘁 𝗯𝗼𝘅 𝗯𝗮̣𝗻 𝘁𝗿𝗼𝗻𝗴 2 𝗴𝗶𝗼̛̀`, event.threadID);
	}
  }
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCreateDatabase({ event });
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });

				break;
			case "event":
				handleEvent({ event });
				break;
			case "message_reaction":
				if(event.senderID == api.getCurrentUserID() && event.reaction == '❤') {
					api.unsendMessage(event.messageID)
				}
				handleReaction({ event });
				break;
			default:
				break;
		}
	};
};
