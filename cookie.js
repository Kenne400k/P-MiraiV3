const fs = require('fs');
const puppeteer = require('puppeteer');

const FACEBOOK_URL = 'https://www.facebook.com/';
const COOKIE_FILE = 'cookie.txt';
const FB_EMAIL = 'your_email'; // Thay bằng email đăng nhập
const FB_PASSWORD = 'your_password'; // Thay bằng mật khẩu

async function getFacebookCookie() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle2' });
    
    await page.type('#email', FB_EMAIL);
    await page.type('#pass', FB_PASSWORD);
    await page.click('[name="login"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    const cookies = await page.cookies();
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    
    fs.writeFileSync(COOKIE_FILE, cookieString);
    console.log('Lấy cookie thành công! Cookie đã được lưu vào cookie.txt');
    
    await browser.close();
}

getFacebookCookie().catch(error => {
    console.error('Đã xảy ra lỗi:', error);
});
