const fs = require('fs');
const path = require('path');

// --- 文件路径配置 ---
// 假设此脚本位于项目根目录下的某个文件夹，请根据实际调整路径
const jsonPath = path.resolve(__dirname, './iconfont.json'); 
const outputPath = path.resolve(__dirname, './icon-map.uts'); // 目标输出文件
// --------------------

try {
    // 1. 读取 iconfont.json 文件内容
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const iconData = JSON.parse(jsonContent);

    if (!iconData.glyphs || iconData.glyphs.length === 0) {
        console.warn('⚠️ Iconfont 警告: iconfont.json 文件中未找到 glyphs 数据。跳过生成。');
        return;
    }

    // 2. 遍历 glyphs 数组，生成映射对象
    const iconMap = {};
    const cssPrefix = iconData.css_prefix_text || 'icon-';

    iconData.glyphs.forEach(glyph => {
        const key = `${cssPrefix}${glyph.name}`;
        // 使用十进制值
        iconMap[key] = glyph.unicode_decimal; 
    });

    // 3. 生成 JavaScript 文件内容
    const now = new Date();
		const tmpObj = JSON.stringify(iconMap, null, 2)
    const jsContent = `
/**
 * ⚠️ 警告：此文件是根据 iconfont.json 自动生成的，请勿手动修改！
 * 生成时间: ${now.toLocaleString()}
 * Unicode 值类型: 十进制数字
 */

const iconMap = ${JSON.stringify(iconMap, null, 2)}

export default iconMap
`;
    
    // --- 核心修改：确保目标目录存在 ---
    const outputDir = path.dirname(outputPath); // 获取目标文件的父目录

    if (!fs.existsSync(outputDir)) {
        // 使用 recursive: true 确保所有父目录都会被创建
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`✨ 创建了输出目录: ${path.relative(process.cwd(), outputDir)}`);
    }
    // ------------------------------------

    // 4. 【核心】直接覆盖/创建文件
    // fs.writeFileSync() 保证了如果文件存在就覆盖，不存在就创建
    fs.writeFileSync(outputPath, jsContent, 'utf8');

    // 5. 成功日志
    const relativeOutputPath = path.relative(process.cwd(), outputPath);
    console.log(`\n✅ Iconfont 映射文件已成功更新（${iconData.glyphs.length}个图标）。`);
    console.log(`   目标文件: ${relativeOutputPath}`);
    console.log(`   更新时间: ${now.toLocaleTimeString()}`);

} catch (error) {
    console.error('\n❌ 自动生成 Iconfont 映射文件失败:', error.message);
    if (error.code === 'ENOENT') {
         console.error(`   请检查路径: ${path.relative(process.cwd(), jsonPath)} 是否存在 'iconfont.json' 文件。`);
    }
}