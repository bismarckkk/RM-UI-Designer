import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';

const require = createRequire(import.meta.url);

async function release() {
    const flag = process.argv[2] ?? 'patch';
    const packageJson = require('../src-tauri/tauri.conf.json');
    let [a, b, c] = packageJson.package.version.split('.').map(Number);

    if (flag === 'major') {
        a += 1;
        b = 0;
        c = 0;
    } else if (flag === 'minor') {
        b += 1;
        c = 0;
    } else if (flag === 'patch') {
        c += 1;
    } else {
        console.log(`Invalid flag "${flag}"`);
        process.exit(1);
    }

    const nextVersion = `${a}.${b}.${c}`;
    packageJson.package.version = nextVersion;

    // 将新版本写入 package.json 文件
    fs.writeFileSync('./src-tauri/tauri.conf.json', JSON.stringify(packageJson, null, 2));

    execSync('git checkout main');
    execSync('git pull');
    execSync('git add ./src-tauri/tauri.conf.json');
    execSync(`git commit -m "release: v${nextVersion}"`);
    execSync(`git tag -a v${nextVersion} -m "v${nextVersion}"`);
    execSync(`git push`);
    execSync(`git push origin v${nextVersion}`);
    execSync('git checkout dev');
    console.log(`Publish Successfully...`);
}

release().catch(console.error);
