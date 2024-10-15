const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// 이미지 저장 경로 설정 (src/routes/travelLogPosting/uploadimg)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'src', 'routes', 'travelLogPosting', 'uploadimg'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 중복 방지
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 처리 엔드포인트
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  // 클라이언트로 이미지 경로 반환
  const imagePath = `/src/routes/travelLogPosting/uploadimg/${req.file.filename}`;
  res.json(imagePath);
});

// 정적 파일 제공 (업로드된 파일을 제공)
app.use('/src/routes/travelLogPosting/uploadimg', express.static(path.join(__dirname, 'src', 'routes', 'travelLogPosting', 'uploadimg')));

// 서버 시작
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});