module.exports.config = {
  name: "adduser",
  version: "1.0.0",
  hasPermssion: 1, // Đảm bảo quyền admin hoặc có quyền thêm thành viên
  credits: "Bot Developer",
  description: "Thêm người dùng vào nhóm thông qua UID",
  commandCategory: "System",
  usages: "adduser [UID]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const uid = args[0];  // UID người dùng cần thêm vào nhóm

  if (!uid) {
      return api.sendMessage('Vui lòng cung cấp UID của người cần thêm vào nhóm.', event.threadID, event.messageID);
  }

  try {
      // Kiểm tra nếu bot có quyền mời thành viên vào nhóm
      if (event.senderID !== event.threadID) {
          // Mã giả để thêm người vào nhóm (phụ thuộc vào nền tảng API bạn đang sử dụng)
          const success = await addUserToGroup(uid, event.threadID);

          if (success) {
              return api.sendMessage(`Đã thêm người với UID: ${uid} vào nhóm.`, event.threadID, event.messageID);
          } else {
              return api.sendMessage('Không thể thêm người vào nhóm. Kiểm tra quyền hạn và thử lại.', event.threadID, event.messageID);
          }
      } else {
          return api.sendMessage('Bot không thể thêm người vào nhóm từ chính nhóm của nó.', event.threadID, event.messageID);
      }
  } catch (err) {
      console.error(err);
      return api.sendMessage('Đã xảy ra lỗi khi thực hiện lệnh.', event.threadID, event.messageID);
  }
};

// Hàm giả mời người dùng vào nhóm
async function addUserToGroup(uid, threadID) {
  // Đây là mã giả và cần phải thay đổi tùy theo nền tảng bạn đang sử dụng
  // API của Facebook Messenger không cho phép thêm người dùng vào nhóm qua UID trực tiếp
  return new Promise((resolve, reject) => {
      // API giả mời người dùng vào nhóm
      // resolve(true) nếu thành công
      // reject('Lỗi') nếu không thành công
      resolve(true); // Giả sử việc thêm thành công
  });
}
