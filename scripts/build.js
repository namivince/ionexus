/**
 * Script build để tạo output từ các file markdown
 */
const { processMarkdownFiles } = require('../src/processor');
const path = require('path');
const fs = require('fs-extra');
const handlebars = require('handlebars');

// Đường dẫn thư mục chứa các file markdown
const sourceDir = path.resolve(__dirname, '..');
// Đường dẫn thư mục output
const outputDir = path.resolve(__dirname, '../build');
// Đường dẫn thư mục templates
const templatesDir = path.resolve(__dirname, '../src/templates');

// Đăng ký helper cho handlebars
handlebars.registerHelper('eq', function(a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

// Chuẩn bị các template
async function prepareTemplates() {
  try {
    // Đọc template chính
    const mainTemplateContent = await fs.readFile(path.join(templatesDir, 'main.html'), 'utf-8');
    const mainTemplate = handlebars.compile(mainTemplateContent);
    
    return {
      mainTemplate
    };
  } catch (error) {
    console.error('Lỗi khi chuẩn bị templates:', error);
    throw error;
  }
}

// Chuẩn bị thư mục output
async function prepareOutputDir() {
  try {
    // Tạo thư mục output nếu chưa tồn tại
    await fs.ensureDir(outputDir);
    await fs.ensureDir(path.join(outputDir, 'html'));
    await fs.ensureDir(path.join(outputDir, 'json'));
    await fs.ensureDir(path.join(outputDir, 'assets'));
    
    // Copy CSS từ templates vào assets
    try {
      await fs.copy(
        path.join(templatesDir, 'style.css'),
        path.join(outputDir, 'assets', 'style.css')
      );
    } catch (error) {
      console.log('Lưu ý: Không tìm thấy file style.css trong templates, sẽ tạo mới');
      // Tạo file CSS trực tiếp trong assets
      const cssContent = await fs.readFile(path.join(__dirname, '../src/templates/style.css'), 'utf-8');
      await fs.writeFile(path.join(outputDir, 'assets', 'style.css'), cssContent);
    }
    
    // Tạo file CSS inline cho index.html
    const inlineCssContent = `
    /* iONexus CSS - Inline version */
    :root {
      --color-primary: #1A237E;
      --color-secondary: #FF5252;
      --color-background: #FFFFFF;
      --color-text-primary: #212121;
      --color-text-secondary: #757575;
      --color-border: #E0E0E0;
      --color-success: #16A34A;
      --color-warning: #FFC107;
      --color-error: #D32F2F;
      --color-gray-50: #FAFAFA;
      --color-gray-100: #F5F5F5;
      --color-gray-200: #EEEEEE;
      --color-gray-300: #E0E0E0;
      --color-gray-400: #BDBDBD;
      --color-gray-500: #9E9E9E;
      --color-gray-600: #757575;
      --color-gray-700: #616161;
      --color-gray-800: #424242;
      --color-gray-900: #212121;
    }
    `;
    await fs.writeFile(path.join(outputDir, 'assets', 'inline-style.css'), inlineCssContent);
    
    // Tạo thư mục cho hình ảnh mẫu
    await fs.ensureDir(path.join(outputDir, 'assets', 'images'));
    
    // Tạo một số hình ảnh mẫu cho property
    const sampleImages = [
      { name: 'property1.jpg', url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg' },
      { name: 'property2.jpg', url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg' },
      { name: 'property3.jpg', url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg' },
      { name: 'property4.jpg', url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg' },
      { name: 'property5.jpg', url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg' },
      { name: 'property6.jpg', url: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg' }
    ];
    
    // Không tải hình ảnh thực tế, chỉ ghi chú URL
    for (const image of sampleImages) {
      await fs.writeFile(
        path.join(outputDir, 'assets', 'images', image.name),
        `This is a placeholder. Actual image would be downloaded from: ${image.url}`
      );
    }
    
    return true;
  } catch (error) {
    console.error('Lỗi khi chuẩn bị thư mục output:', error);
    throw error;
  }
}

// Tạo dữ liệu mẫu cho property
function generateSampleProperties(type = 'buy', count = 6) {
  const properties = [];
  
  const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Penthouse'];
  const locations = ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay', 'JBR', 'Arabian Ranches'];
  const badges = ['Featured', 'New', 'Exclusive', 'Off Plan'];
  
  for (let i = 1; i <= count; i++) {
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const beds = Math.floor(Math.random() * 4) + 1;
    const baths = beds;
    const area = (Math.floor(Math.random() * 2000) + 800).toLocaleString();
    
    let price;
    if (type === 'buy') {
      price = `AED ${(Math.floor(Math.random() * 9000000) + 1000000).toLocaleString()}`;
    } else if (type === 'rent') {
      price = `AED ${(Math.floor(Math.random() * 200000) + 50000).toLocaleString()}/yr`;
    } else if (type === 'commercial') {
      price = `AED ${(Math.floor(Math.random() * 5000000) + 1000000).toLocaleString()}`;
    } else { // projects
      price = `From AED ${(Math.floor(Math.random() * 2000000) + 800000).toLocaleString()}`;
    }
    
    properties.push({
      id: `property-${type}-${i}`,
      title: `${beds} Bedroom ${propertyType} in ${location}`,
      price,
      location,
      beds,
      baths,
      area,
      badge,
      image: `/assets/images/property${i % 6 + 1}.jpg`,
      type: propertyType
    });
  }
  
  return properties;
}

// Tạo trang index.html
async function createIndexHtml(templates, indexData) {
  try {
    // Phân loại các trang theo thư mục
    const categorizedPages = {};
    
    indexData.forEach(item => {
      const pathParts = item.path.split('/');
      if (pathParts.length > 1) {
        const category = pathParts[0];
        if (!categorizedPages[category]) {
          categorizedPages[category] = [];
        }
        categorizedPages[category].push(item);
      } else {
        if (!categorizedPages['other']) {
          categorizedPages['other'] = [];
        }
        categorizedPages['other'].push(item);
      }
    });
    
    // Tạo HTML cho trang index
    const html = templates.mainTemplate({
      title: 'iONexus UI Mockup Spec',
      isHomePage: true,
      categorizedPages,
      currentYear: new Date().getFullYear(),
      properties: generateSampleProperties('buy', 6)
    });
    
    await fs.writeFile(path.join(outputDir, 'index.html'), html);
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo trang index.html:', error);
    throw error;
  }
}

// Tạo các trang HTML từ dữ liệu đã xử lý
async function createHtmlPages(templates, processedData) {
  try {
    for (const data of processedData) {
      const relativePath = data.relativePath;
      const fileNameWithoutExt = path.basename(relativePath, '.md');
      const dirName = path.dirname(relativePath);
      
      // Xác định loại trang
      const pageType = data.frontMatter.page_type || 'content';
      const pagePath = data.frontMatter.slug || `/${dirName}/${fileNameWithoutExt}`;
      
      // Xác định các flag cho template
      const templateData = {
        title: data.frontMatter.title || data.title,
        content: data.html,
        currentYear: new Date().getFullYear(),
        isBuy: dirName.includes('buy'),
        isRent: dirName.includes('rent'),
        isCommercial: dirName.includes('commercial'),
        isProjects: dirName.includes('projects'),
        isAgents: dirName.includes('agents'),
        isMortgages: dirName.includes('mortgages'),
        isAccount: dirName.includes('account'),
        isHomePage: fileNameWithoutExt === 'landing_page',
        isListingPage: fileNameWithoutExt.includes('listing'),
        isDetailPage: fileNameWithoutExt.includes('detail'),
        isContentPage: !fileNameWithoutExt.includes('listing') && !fileNameWithoutExt.includes('detail') && !fileNameWithoutExt === 'landing_page'
      };
      
      // Thêm dữ liệu mẫu cho các trang listing
      if (templateData.isListingPage) {
        if (templateData.isBuy) {
          templateData.properties = generateSampleProperties('buy');
        } else if (templateData.isRent) {
          templateData.properties = generateSampleProperties('rent');
        } else if (templateData.isCommercial) {
          templateData.properties = generateSampleProperties('commercial');
        } else if (templateData.isProjects) {
          templateData.properties = generateSampleProperties('projects');
        }
      }
      
      // Tạo HTML từ template
      const html = templates.mainTemplate(templateData);
      
      // Tạo thư mục output nếu chưa tồn tại
      await fs.ensureDir(path.join(outputDir, 'html', dirName));
      
      // Lưu file HTML
      await fs.writeFile(
        path.join(outputDir, 'html', dirName, `${fileNameWithoutExt}.html`),
        html
      );
    }
    
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo các trang HTML:', error);
    throw error;
  }
}

// Bắt đầu xử lý
async function build() {
  try {
    console.log('🚀 Bắt đầu build...');
    
    // Cài đặt handlebars nếu chưa có
    try {
      require('handlebars');
    } catch (e) {
      console.log('Đang cài đặt handlebars...');
      require('child_process').execSync('npm install handlebars@4.7.7 --no-save');
    }
    
    // Chuẩn bị templates
    const templates = await prepareTemplates();
    
    // Chuẩn bị thư mục output
    await prepareOutputDir();
    
    // Xử lý các file markdown
    const results = await processMarkdownFiles(sourceDir, outputDir);
    
    // Tạo file index.html
    const indexData = results.map(result => ({
      path: result.relativePath,
      title: result.title,
      page_type: result.frontMatter.page_type,
      slug: result.frontMatter.slug
    }));
    await createIndexHtml(templates, indexData);
    
    // Tạo các trang HTML
    await createHtmlPages(templates, results);
    
    console.log('✅ Build hoàn tất! Kết quả được lưu trong thư mục build/');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra khi build:', error);
    process.exit(1);
  }
}

// Chạy build
build();
