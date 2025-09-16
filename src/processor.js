/**
 * Module xử lý các file markdown
 */
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const marked = require('marked');
const cheerio = require('cheerio');

/**
 * Tìm tất cả các file markdown trong thư mục
 * @param {string} sourceDir - Thư mục nguồn
 * @returns {Promise<string[]>} - Danh sách đường dẫn file
 */
async function findMarkdownFiles(sourceDir) {
  try {
    // Tìm tất cả các file .md, bỏ qua node_modules và các thư mục ẩn
    return new Promise((resolve, reject) => {
      // Đường dẫn tuyệt đối để tìm kiếm
      const pattern = path.join(sourceDir, '**/*.md');
      console.log(`Tìm kiếm file markdown với pattern: ${pattern}`);
      
      glob(pattern, {
        ignore: ['**/node_modules/**', '**/.*/**', '**/build/**', '**/package*.json'],
        nodir: true
      }, (err, files) => {
        if (err) {
          console.error('Lỗi khi tìm file:', err);
          reject(err);
        } else {
          console.log(`Tìm thấy ${files.length} file markdown`);
          files.forEach(file => console.log(` - ${file}`));
          resolve(files);
        }
      });
    });
  } catch (error) {
    console.error('Lỗi khi tìm file markdown:', error);
    throw error;
  }
}

/**
 * Xử lý nội dung file markdown
 * @param {string} filePath - Đường dẫn file
 * @returns {Object} - Dữ liệu đã xử lý
 */
async function processMarkdownFile(filePath) {
  try {
    // Đọc nội dung file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Phân tích front matter và nội dung
    const { data, content } = matter(fileContent);
    
    // Chuyển đổi markdown sang HTML
    const htmlContent = marked.parse(content);
    
    // Phân tích cấu trúc HTML để trích xuất thông tin
    const $ = cheerio.load(htmlContent);
    
    // Trích xuất các section
    const sections = [];
    $('h2').each((i, elem) => {
      const sectionTitle = $(elem).text();
      let sectionContent = '';
      
      // Lấy nội dung cho đến h2 tiếp theo hoặc hết
      let next = $(elem).next();
      while (next.length && !next.is('h2')) {
        sectionContent += next.prop('outerHTML');
        next = next.next();
      }
      
      sections.push({
        title: sectionTitle,
        content: sectionContent
      });
    });
    
    // Trích xuất các code block
    const codeBlocks = [];
    $('pre code').each((i, elem) => {
      const language = $(elem).attr('class')?.replace('language-', '') || '';
      const code = $(elem).text();
      codeBlocks.push({
        language,
        code
      });
    });
    
    // Tạo đối tượng kết quả
    return {
      filePath,
      relativePath: path.relative(process.cwd(), filePath),
      frontMatter: data,
      title: $('h1').first().text(),
      sections,
      codeBlocks,
      html: htmlContent
    };
  } catch (error) {
    console.error(`Lỗi khi xử lý file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Tạo output HTML từ dữ liệu đã xử lý
 * @param {Object} processedData - Dữ liệu đã xử lý
 * @returns {string} - Nội dung HTML
 */
function generateHtml(processedData) {
  const { frontMatter, title, sections, html } = processedData;
  
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frontMatter.title || title} - iONexus</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #212121;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #1A237E;
      color: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    h1 {
      font-size: 32px;
      margin: 0;
    }
    h2 {
      font-size: 24px;
      margin-top: 30px;
      border-bottom: 1px solid #E0E0E0;
      padding-bottom: 10px;
    }
    .meta {
      color: #757575;
      font-size: 14px;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 30px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'Courier New', monospace;
    }
    .tag {
      background-color: #E0E0E0;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 14px;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <header>
    <h1>${frontMatter.title || title}</h1>
    <div class="meta">
      ${frontMatter.page_type ? `<span class="tag">${frontMatter.page_type}</span>` : ''}
      ${frontMatter.slug ? `<span>Path: ${frontMatter.slug}</span>` : ''}
      ${frontMatter.updated ? `<span>Updated: ${frontMatter.updated}</span>` : ''}
    </div>
  </header>
  
  <main>
    ${html}
  </main>
  
  <footer>
    <p>&copy; iONexus ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>`;
}

/**
 * Tạo output JSON từ dữ liệu đã xử lý
 * @param {Object} processedData - Dữ liệu đã xử lý
 * @returns {Object} - Đối tượng JSON
 */
function generateJson(processedData) {
  const { frontMatter, title, sections, codeBlocks } = processedData;
  
  return {
    ...frontMatter,
    title,
    sections: sections.map(section => ({
      title: section.title,
      content: section.content
    })),
    codeBlocks: codeBlocks.map(block => ({
      language: block.language,
      code: block.code
    }))
  };
}

/**
 * Xử lý tất cả các file markdown và tạo output
 * @param {string} sourceDir - Thư mục nguồn
 * @param {string} outputDir - Thư mục đích
 */
async function processMarkdownFiles(sourceDir, outputDir) {
  try {
    // Tìm tất cả các file markdown
    const markdownFiles = await findMarkdownFiles(sourceDir);
    console.log(`Tìm thấy ${markdownFiles.length} file markdown`);
    
    // Tạo thư mục output nếu chưa tồn tại
    await fs.ensureDir(outputDir);
    await fs.ensureDir(path.join(outputDir, 'html'));
    await fs.ensureDir(path.join(outputDir, 'json'));
    
    // Xử lý từng file
    const results = [];
    for (const filePath of markdownFiles) {
      console.log(`Đang xử lý: ${filePath}`);
      
      // Xử lý file markdown
      const processedData = await processMarkdownFile(filePath);
      results.push(processedData);
      
      // Tạo tên file output
      const relativePath = path.relative(sourceDir, filePath);
      const fileNameWithoutExt = path.basename(filePath, '.md');
      const dirName = path.dirname(relativePath);
      
      // Tạo thư mục output nếu chưa tồn tại
      await fs.ensureDir(path.join(outputDir, 'html', dirName));
      await fs.ensureDir(path.join(outputDir, 'json', dirName));
      
      // Tạo và lưu file HTML
      const htmlContent = generateHtml(processedData);
      await fs.writeFile(
        path.join(outputDir, 'html', dirName, `${fileNameWithoutExt}.html`),
        htmlContent
      );
      
      // Tạo và lưu file JSON
      const jsonContent = generateJson(processedData);
      await fs.writeFile(
        path.join(outputDir, 'json', dirName, `${fileNameWithoutExt}.json`),
        JSON.stringify(jsonContent, null, 2)
      );
    }
    
    // Tạo file index.json chứa thông tin tất cả các file
    const index = results.map(result => ({
      path: result.relativePath,
      title: result.title,
      slug: result.frontMatter.slug,
      page_type: result.frontMatter.page_type,
      brand: result.frontMatter.brand
    }));
    
    await fs.writeFile(
      path.join(outputDir, 'index.json'),
      JSON.stringify(index, null, 2)
    );
    
    console.log(`Đã xử lý ${results.length} file markdown`);
    return results;
  } catch (error) {
    console.error('Lỗi khi xử lý các file markdown:', error);
    throw error;
  }
}

module.exports = {
  findMarkdownFiles,
  processMarkdownFile,
  generateHtml,
  generateJson,
  processMarkdownFiles
};
