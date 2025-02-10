const https = require('https');
const fs = require('fs');

// Hàm tải file từ URL về
const downloadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            // Nếu HTTP response không thành công
            if (response.statusCode !== 200) {
                reject(new Error(`Lỗi HTTP: ${response.statusCode}`));
                return;
            }
            // Piping dữ liệu về file
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            // Xử lý lỗi tải file
            fs.unlink(filePath, () => reject(err));
        });
    });
};

module.exports = {
    downloadFile
};
