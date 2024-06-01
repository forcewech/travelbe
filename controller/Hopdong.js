require('dotenv').config();
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const jwt = require('jsonwebtoken')
exports.hopDong = async (req, res) => {
    var { token } = req.query;
    try {
        var data = await jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (error) {
        return res.status(403).send({
            message: 'token loi roi'
        })
    }

    const benA = {
        ten: data.data.tenkhachhang,
        nguoiDaiDien: data.data.tenkhachhang,
        email: data.data.email,
        dienThoai: data.data.sdt,
        diaChi: data.data.diachi
      };
    
      const benB = {
        ten: 'CÔNG TY TRÁCH NHIỆM HỮU HẠN 5 CHÂU MEDIA',
        diaChi: '39, Ngõ 195, Cầu Diễn, Phúc Diễn, Bắc Từ Liêm, Hà Nội',
        nguoiDaiDien: 'Nguyễn Tiến Dũng',
        chucVu: 'Giám đốc',
        dienThoai: '0339832545',
        fax: '0339832545',
        giayPhep: '180015224',
        noiCap: 'Thành phố Hà Nội'
      };
      try {
        // Render template Pug thành HTML với dữ liệu
        const html = await new Promise((resolve, reject) => {
          res.render('contract', { benA, benB }, (err, html) => {
            if (err) reject(err);
            else resolve(html);
          });
        });
    
        // Sử dụng Puppeteer để chuyển đổi HTML thành PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ path: 'contract.pdf',
        format: 'A4',
        printBackground: true });
        await browser.close();
    
        // Thiết lập tiêu đề và gửi PDF về client
        res.setHeader('Content-disposition', 'attachment; filename=hopdongdulich.pdf');
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error generating PDF');
      }
}
