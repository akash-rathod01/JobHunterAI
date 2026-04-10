const fs = require('fs');
const path = require('path');

const OLD_NAME = 'J-JobHunterAI';
const NEW_NAME = 'J-JobHunterAI';
const OLD_KEBAB = 'j-jobhunter-ai';
const NEW_KEBAB = 'j-jobhunter-ai';

// Simple recursive file replacement
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && f !== 'node_modules' && f !== '.git' && f !== 'docs-site' && f !== 'dist' && f !== 'build') {
            walkDir(dirPath, callback);
        } else if (!isDirectory) {
            callback(path.join(dir, f));
        }
    });
}

walkDir(path.resolve(__dirname, '..'), function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json') || filePath.endsWith('.md') || filePath.endsWith('.yml')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(new RegExp(OLD_NAME, 'g'), NEW_NAME)
            .replace(new RegExp(OLD_KEBAB, 'g'), NEW_KEBAB);
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
