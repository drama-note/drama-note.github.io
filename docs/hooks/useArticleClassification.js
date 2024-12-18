import path from 'node:path';
import fs from 'node:fs';
import matter from 'gray-matter';

// 判斷是否是資料夾
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

// 取得 FrontMatter
function getFrontMatter(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    return data;
}

// 文章分類函數
export async function getArticleClassification(files, startPathName, res = null) {
    if (!res) {
        res = {
            tags: {},
        };
    }

    for (const file of files) {
        const dir = path.join(startPathName, file); // 組合路徑
        const isDir = isDirectory(dir); // 判斷是否是資料夾

        if (isDir) {
            // 如果是資料夾，遞迴進下一次
            const nextfiles = fs.readdirSync(dir);
            res = await getArticleClassification(nextfiles, `${startPathName}/${file}`, res);
        } else {
            const fileName = path.basename(file);

            // 排除非 md 檔案
            const suffix = path.extname(file);
            if (suffix !== '.md') {
                continue;
            }

            const frontmatter = getFrontMatter(`${startPathName}/${fileName}`);

            if (frontmatter.tags && frontmatter.isPublished) {
                const url = `${startPathName.split('/pages')[1]}/${fileName.replace('.md', '.html')}`;

                for (const tag of frontmatter.tags) {
                    res.tags[tag] = res.tags[tag] || { count: 0, group: [] };
                    res.tags[tag].count++;
                    res.tags[tag].group.push({
                        title: frontmatter.title || '',
                        image: frontmatter.image || '',
                        category: frontmatter.categories || '',
                        date: frontmatter.createdAt || '',
                        url,
                    });
                }
            }
        }
    }

    return res;
}
