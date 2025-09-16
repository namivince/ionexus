/**
 * iONexus Markdown Processor
 * Ứng dụng xử lý các file markdown và tạo output
 */

const { processMarkdownFiles } = require('./src/processor');

// Đường dẫn thư mục chứa các file markdown
const sourceDir = '.';
// Đường dẫn thư mục output
const outputDir = './build';

// Bắt đầu xử lý
processMarkdownFiles(sourceDir, outputDir)
  .then(() => {
    console.log('✅ Xử lý hoàn tất! Kết quả được lưu trong thư mục build/');
  })
  .catch((error) => {
    console.error('❌ Có lỗi xảy ra:', error);
    process.exit(1);
  });
