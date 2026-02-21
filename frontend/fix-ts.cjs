const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            filelist = walkSync(fullPath, filelist);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            filelist.push(fullPath);
        }
    });
    return filelist;
}

const files = walkSync('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // fix arrays
    content = content.replace(/useState\(\[\]\)/g, 'useState<any[]>([])');

    // fix nulls
    content = content.replace(/useState\(null\)/g, 'useState<any | null>(null)');

    // fix empty objects
    content = content.replace(/useState\(\{\}\)/g, 'useState<any>({})');

    // fix false
    content = content.replace(/useState\(false\)/g, 'useState<boolean>(false)');

    // fix true
    content = content.replace(/useState\(true\)/g, 'useState<boolean>(true)');

    // fix useContext(AuthContext)
    content = content.replace(/useContext\(AuthContext\)/g, 'useContext(AuthContext)!');

    // fix (e) =>
    content = content.replace(/\(e\)\s*=>/g, '(e: any) =>');

    // fix (err) =>
    content = content.replace(/\(err\)\s*=>/g, '(err: any) =>');
    content = content.replace(/\(error\)\s*=>/g, '(error: any) =>');

    // fix catch (error)
    content = content.replace(/catch\s*\(\s*error\s*\)/g, 'catch (error: any)');

    // fix ProtectedRoute Props
    if (file.includes('ProtectedRoute.tsx')) {
        content = content.replace(/const ProtectedRoute = \(\{ children, allowedRoles \}\) => \{/g,
            'const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
