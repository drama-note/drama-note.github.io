// 要排除的目錄
const ignorePath = [
    'pages/article/life-murmurs'
];

export default {
    provider: 'local', // 啟動 miniSearch
    options: {
        translations: {
            button: {
                buttonText: '搜尋文章',
                buttonAriaLabel: '搜尋文章'
            },
            modal: {
                noResultsText: '找不到相關內容',
                displayDetails: '詳細訊息',
                resetButtonTitle: '清除搜尋條件',
                backButtonTitle: '返回搜尋结果',
                footer: {
                    selectText: '選擇',
                    selectKeyAriaLabel: 'enter',
                    navigateText: '切換',
                    navigateUpKeyAriaLabel: 'up arrow',
                    navigateDownKeyAriaLabel: 'down arrow',
                    closeKeyAriaLabel: 'escape'
                }
            }
        },
        _render(src, env, md) {
            const html = md.render(src, env);
            // 排除 有設定不給搜尋 或者 沒有發布的頁面
            if (env.frontmatter?.search === false || !env.frontmatter?.isPublished)
                return '';

            // 要排除特定的目錄
            for (const path of ignorePath) {
                if (env.relativePath.startsWith(path)) {
                    return '';
                }
            }

            // 新增錨點
            if (env.frontmatter?.title)
                return md.render(`# ${env.frontmatter.title}`) + html;

            return html;
        }
    }
}