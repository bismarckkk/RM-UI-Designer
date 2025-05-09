const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
    url: "https://github.com/bismarckkk/RM_UI_Generator/releases/latest/download/",
    files: ['rm_ui_generator.wasm', 'rm_ui_generator.js'],
    outputDir: ['src/assets', 'public']
};

async function downloadWasm() {
    for (let i = 0; i < CONFIG.outputDir.length; i++) {
        const file = CONFIG.files[i];
        const outputPath = path.join(CONFIG.outputDir[i], file);
        const url = CONFIG.url + file;

        await downloadFile(url, outputPath);
    }
}

// 辅助函数：文件下载
function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);

        const request = https.get(url, (res) => {
            // 检查响应状态码
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // 处理重定向
                const redirectUrl = res.headers.location;
                file.close();
                fs.unlink(outputPath, () => {
                    downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
                });
            } else {
                file.close();
                fs.unlink(outputPath, () => reject(new Error(`Request failed with status code: ${res.statusCode}`)));
            }
        });

        request.on('error', (err) => {
            fs.unlink(outputPath, () => reject(err));
        });

        file.on('error', (err) => {
            fs.unlink(outputPath, () => reject(err));
        });
    });
}

// 执行下载
downloadWasm()
    .then(() => {
        console.log("WASM下载成功");
        process.exit(0); // 确保程序在成功后退出
    })
    .catch(err => {
        console.error("下载失败:", err.message);
        process.exit(1); // 确保程序在失败后退出
    });