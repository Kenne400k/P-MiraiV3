module.exports = function ({ api, models }) {
  setInterval(function () {
    if(global.config.NOTIFICATION) {
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000*60);
    const fs = require("fs");
    const Users = require("./controllers/users")({ models, api }),
          Threads = require("./controllers/threads")({ models, api }),
          Currencies = require("./controllers/currencies")({ models });
    const logger = require("../utils/log.js");
    const moment = require('moment-timezone');
    const axios = require("axios");
    var day = moment.tz("Asia/Ho_Chi_Minh").day();
(async function () {
    try {
      logger(global.getText('listen', 'startLoadEnvironment'), 'DATA');
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
    } catch (error) {
        return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
    }
}());

  const admin = config.ADMINBOT;
  logger.loader("┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
  for(let i = 0; i <= admin.length -1; i++){
    dem = i + 1
    logger.loader(` ID ADMIN ${dem}: ${(!admin[i]) ? "Trống" : admin[i]}`);
  }
  logger.loader(` ID BOT: ${api.getCurrentUserID()}`)
  logger.loader(` PREFIX: ${global.config.PREFIX}`)
  logger.loader(` NAME BOT: ${(!global.config.BOTNAME) ? "This bot was made by Gau" : global.config.BOTNAME}`)
  logger.loader("┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛")

  
  //////dọn cache khi onbot!////////////////////////////////////////////////////////////
  const { exec } = require('child_process');
  exec('rm -fr modules/commands/cache/*.m4a');
  exec('rm -fr modules/commands/cache/*.mp4');
  exec('rm -fr modules/commands/cache/*.png');
  exec('rm -fr modules/commands/cache/*.jpg');
  exec('rm -fr modules/commands/cache/*.gif');
  exec('rm -fr modules/commands/cache/*.mp3');
  exec('rm -fr modules/commands/*.m4a');
  exec('rm -fr modules/commands/*.mp4');
  exec('rm -fr modules/commands/*.png');
  exec('rm -fr modules/commands/*.jpg');
  exec('rm -fr modules/commands/*.gif');
  exec('rm -fr modules/commands/*.mp3');
  const adminID = '100075885595966'
  api.sendMessage('Bot vừa khởi động lại và đã tự động dọn dẹp cache!', adminID);
  //////dọn cache khi onbot!////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////
  //========= Require all handle need =========//
  //////////////////////////////////////////////

  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleRefresh = require("./handle/handleRefresh")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });
//logger hiện console
logger.loader(`Ping load toàn bộ commands và events • ${Date.now() - global.client.timeStart}ms •`);
//DEFINE DATLICH PATH
  const datlichPath = __dirname + "/../modules/commands/cache/datlich.json";

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
    if (time[1] > 12 || time[1] < 1) resolve(" Tháng của bạn có vẻ không hợp lệ");
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
    if (!fs.existsSync(datlichPath)) fs.writeFileSync(datlichPath, JSON.stringify({}, null, 4));
    var data = JSON.parse(fs.readFileSync(datlichPath));
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
  return async (event) => {


    
    let form_mm_dd_yyyy = (input = '', split = input.split('/'))=>`${split[1]}/${split[0]}/${split[2]}`;
    let prefix = (global.data.threadData.get(event.threadID) || {}).PREFIX||global.config.PREFIX;
    let send = (msg, callback)=>api.sendMessage(msg, event.threadID, callback, event.messageID);
    if ((event.body||'').startsWith(prefix) && event.senderID != api.getCurrentUserID() && !global.config.ADMINBOT.includes(event.senderID)) {
    let thuebot;
        try { thuebot = JSON.parse(require('fs').readFileSync(process.cwd()+'/modules/commands/data/thuebot.json')); } catch { thuebot = []; };
        let find_thuebot = thuebot.find($=>$.t_id == event.threadID);
        if (!find_thuebot)return api.shareContact(`❎ Nhóm của bạn chưa thuê bot, vui lòng liên hệ Admin ${config.AMDIN_NAME} để thuê bot\n───────────────────\n🌐 Facebook: ${config.FACEBOOK_ADMIN}\n🔐 Zalo: ${config.ZALO_ADMIN}`, global.config.ADMINBOT[0], event.threadID);
        if (new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() <= Date.now()+25200000)return api.shareContact(`⚠️ Nhóm của bạn đã hết hạn thuê bot, vui lòng thanh toán để tiếp tục gia hạn, liên hệ Admin ${config.AMDIN_NAME}\n───────────────────\n🌐 Facebook: ${config.MESSENGER_ADMIN}\n🔐 Zalo: ${config.ZALO_ADMIN}`, global.config.ADMINBOT[0], event.threadID);
        };
const checkttDataPath = __dirname + '/../modules/commands/kiemtra/';
  setInterval(async() => {
    const day_now = moment.tz("Asia/Ho_Chi_Minh").day();
    if (day != day_now) {
      day = day_now;
      const checkttData = fs.readdirSync(checkttDataPath);
      console.log('--> CHECKTT: Ngày Mới');
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
        let checkttBody = '[ Top 10 Tương Tác Ngày ]\n─────────────────\n';
        checkttBody += storage.slice(0, 10).map(item => {
           return `🏆 Top: ${count++}\n🐳 Tên: ${item.name}\n💬 Số tin nhắn: ${item.count} tin`;
                    }).join('\n\n');
        api.sendMessage(`${checkttBody}\n─────────────────\nTổng tin nhắn trong ngày: ${storage.reduce((a, b) => a + b.count, 0)}\n⚡ Các bạn khác cố gắng tương tác nếu muốn lên top nha :3`, checkttFile.replace(".json", ""),
          (err) => (err ? logger(err) : "")
        );
        checktt.last.day = JSON.parse(JSON.stringify(checktt.day));
        checktt.day.forEach((e) => {
          e.count = 0;
        });
        checktt.time = day_now;
 
        fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
      });
      if (day_now == 1) {
        console.log('--> CHECKTT: Tuần Mới');
        checkttData.forEach(async(checkttFile) => {
          const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
          if (!checktt.last)
            checktt.last = {
              time: day_now,
              day: [],
              week: [],
            };
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
          let checkttBody = '[ Top 10 Tương Tác Tuần ]\n─────────────────\n';
          checkttBody += storage.slice(0, 10).map(item => {
            return `🏆 Top: ${count++}\n🐙 Tên: ${
                item.name
              }\n💬 Số tin nhắn: ${item.count} tin.`;
            })
            .join("\n\n");
          api.sendMessage(`${checkttBody}\n─────────────────\nTổng tin nhắn trong tuần: ${storage.reduce((a, b) => a + b.count, 0)}\n⚡ Các bạn khác cố gắng tương tác nếu muốn lên top nha :>`,checkttFile.replace(".json", ""),
            (err) => (err ? logger(err) : "")
          );
          checktt.last.week = JSON.parse(JSON.stringify(checktt.week));
          checktt.week.forEach(e => {
              e.count = 0;
          });
 
          fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
        })
      }
      global.client.sending_top = false;
    }
  }, 1000 * 10);


    if (event.type === "change_thread_image") api.sendMessage(`${event.snippet}`, event.threadID);
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
           handleRefresh({ event });
           if(global.config.notiGroup) {
             var msg = ''
             msg += event.logMessageBody
             if(event.author == api.getCurrentUserID()) {
               msg = msg.replace('Bạn', global.config.BOTNAME)
             }
             return api.sendMessage({
         body: `${msg}`}, event.threadID);
           }
           break;
      case "message_reaction":
        var { iconUnsend } = global.config
        if(iconUnsend.status && event.senderID == api.getCurrentUserID() && event.reaction == iconUnsend.icon) {
          api.unsendMessage(event.messageID)
        }
        handleReaction({ event });
        break;
      default:
        break;
    }
  };
};