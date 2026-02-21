const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

const files = walkSync('./src/modules');

files.forEach(file => {
    if (file.endsWith('.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix req.params.id -> (req.params.id as string) for endpoints
        if (content.includes('req.params.id') && !content.includes('req.params.id as string')) {
            content = content.replace(/req\.params\.id/g, '(req.params.id as string)');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
});
