module.exports.config = {
    name: "outUser",
    version: "1.0.0",
    hasPermssion: 2,
    credit: "Sam",
    description: "Lưu biệt danh và UID người bị kick hoặc tự out nhóm vào bộ nhớ tạm",
    commandCategory: "Nhóm",
    usages: "[text]",
    cooldowns: 5
  };
  
  // Lưu trữ biệt danh người đã rời nhóm hoặc bị kick
  let leftUsers = [];
  
  module.exports.handleEvent = async ({ event, api, Users }) => {
    // Kiểm tra sự kiện khi người dùng rời nhóm hoặc bị kick
    if (event.logMessageType === "log:unsubscribe" || event.logMessageType === "log:memberremove") {
      // Kiểm tra nếu là sự kiện rời nhóm (log:unsubscribe) hoặc bị kick (log:memberremove)
      const userID = event.logMessageData.leftParticipantFbId || event.logMessageData.removeParticipantFbId;
  
      // Lấy biệt danh của người bị kick hoặc tự out
      const userInfo = await Users.getData(userID);
      const nickname = userInfo.name;
  
      // Lưu UID và biệt danh vào bộ nhớ tạm
      if (!leftUsers.some(user => user.userID === userID)) {  // Kiểm tra nếu UID chưa có trong danh sách
        leftUsers.push({ userID, nickname });
        console.log(`Đã lưu UID: ${userID}, Biệt danh: ${nickname}`);
      }
    }
  };
  
  // Lệnh để hiển thị biệt danh những người đã rời nhóm hoặc bị kick
  module.exports.run = async ({ event, api }) => {
    const { threadID, messageID } = event;
  
    // Kiểm tra xem có người nào đã rời nhóm hoặc bị kick
    if (leftUsers.length === 0) {
      return api.sendMessage("Không có người nào đã rời nhóm hoặc bị kick.", threadID, messageID);
    }
  
    // Tạo danh sách biệt danh
    let message = "Danh sách người đã rời nhóm hoặc bị kick:\n";
    leftUsers.forEach(user => {
      message += `- ${user.nickname} (UID: ${user.userID})\n`;
    });
  
    // Gửi danh sách biệt danh
    return api.sendMessage(message, threadID, messageID);
  };
  
  module.exports.languages = {
    "vi": {
      "successText": "Hiển thị biệt danh thành công.",
      "noUserLeft": "Không có người nào đã rời nhóm hoặc bị kick."
    },
    "en": {
      "successText": "Display nicknames successfully.",
      "noUserLeft": "No user has left the group or been kicked."
    }
  };
  