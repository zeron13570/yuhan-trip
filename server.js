import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 추가

const app = express();
const port = process.env.PORT || 3000; // 환경 변수에서 포트 번호 가져오기

const uploadDir = 'uploads';

// CORS 허용
app.use(cors({
    origin: '*', // 개발 중에는 모든 도메인 허용
    methods: 'GET,POST', // 허용할 HTTP 메서드
}));

app.use(bodyParser.json());

// 업로드 디렉토리 생성 (없으면 생성)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 최대 5MB로 설정 (필요에 따라 조정)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // 허용할 파일 형식
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: 파일 형식이 올바르지 않습니다.'); // 에러 메시지
    }
});

// 이미지 업로드 API
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '이미지가 업로드되지 않았습니다.' });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    console.log('Uploaded image path:', imagePath); // 업로드된 이미지 경로 확인
    res.json({ imagePath });
});

// 정적 파일 제공
app.use('/uploads', express.static(uploadDir));

// JSON 파일 경로
const filePath = './posts.json';

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// 에러 처리 함수
const handleError = (res, message, status = 500) => {
    res.status(status).json({ message });
};

// 포스트 작성 API
app.post('/add-post', (req, res) => {
    console.log('Received new post:', req.body);

    const { title, content, region, username, image, userId } = req.body;  // userId 추가
    if (!title || !content || !region || !username || !userId) {  // userId 체크 추가
        return handleError(res, '모든 필드를 입력해주세요.', 400);
    }

    const newPost = {
        id: uuidv4(), // UUID로 고유 ID 생성
        title,
        content,
        region,
        username,
        userId,  // userId 사용
        image,
        date: new Date().toISOString(), // 현재 날짜를 ISO 형식으로 저장
        likes: 0,
        likedBy: []
    };

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }

        posts.push(newPost);

        fs.writeFile(filePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return handleError(res, '포스트 저장 중 오류가 발생했습니다.');
            }
            res.status(201).json({ message: '포스트가 저장되었습니다.', post: newPost });
        });
    });
});


// 모든 포스트 가져오기 API
app.get('/get-posts', (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.status(200).json([]); // 파일이 없으면 빈 배열 반환
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        try {
            const posts = JSON.parse(data);
            const sortedPosts = sortPostsByDate(posts); // 날짜 기준으로 정렬
            console.log('Sorted Posts:', sortedPosts); // 정렬된 포스트 로그
            res.status(200).json(sortedPosts); // 정렬된 포스트 반환
        } catch (parseError) {
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }
    });
});


// 특정 포스트 가져오기 API
app.get('/get-post/:id', (req, res) => {
    const postId = req.params.id;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        try {
            const posts = JSON.parse(data);
            const post = posts.find(p => p.id === postId); // ID로 포스트 찾기
            if (post) {
                return res.status(200).json(post); // 포스트 반환
            } else {
                return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
            }
        } catch (parseError) {
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }
    });
});
// 사용자가 작성한 포스트 가져오기 API
app.get('/get-posts-by-user/:userId', (req, res) => {
    const userId = req.params.userId;  // URL 파라미터에서 userId 가져오기

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        try {
            const posts = JSON.parse(data);  // JSON 데이터 파싱
            const userPosts = posts.filter(post => post.userId === userId);  // userId로 필터링

            if (userPosts.length > 0) {
                res.status(200).json(userPosts);  // 작성한 포스트 반환
            } else {
                res.status(404).json({ message: '작성한 게시물이 없습니다.' });
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }
    });
});

//좋아요
app.post('/get-post/:id/like', (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId; // 계정 ID 사용
    console.log('Received userId:', userId); // userId 확인

    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }

        const post = posts.find(p => p.id === postId);
        if (!post) {
            console.error(`Post not found for ID: ${postId}`);
            return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
        }

        console.log('Post before like:', post); // 좋아요 변경 전 상태 확인

        // 좋아요 토글 로직 (userId로 체크)
        if (post.likedBy.includes(userId)) {
            post.likedBy = post.likedBy.filter(id => id !== userId);
            post.likes--;
        } else {
            post.likedBy.push(userId);
            post.likes++;
        }

        console.log('Post after like:', post); // 좋아요 변경 후 상태 확인

        fs.writeFile(filePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return handleError(res, '파일 저장 중 오류가 발생했습니다.');
            }
            res.status(200).json({ likes: post.likes, likedBy: post.likedBy });
        });
    });
});
app.get('/liked-posts/:userId', (req, res) => {
    const { userId } = req.params;  // URL 파라미터에서 userId 가져오기

    // JSON 파일에서 posts 데이터 읽기
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return handleError(res, '파일을 읽는 중 오류가 발생했습니다.');
        }

        try {
            const posts = JSON.parse(data);  // JSON 데이터 파싱

            // userId를 숫자로 변환
            const numericUserId = Number(userId);

            // likedBy 배열의 값들도 숫자로 변환하여 비교
            const likedPosts = posts.filter(post => 
                post.likedBy.some(like => Number(like) === numericUserId)
            );

            if (likedPosts.length > 0) {
                res.status(200).json(likedPosts);  // 좋아요를 누른 게시물 반환
            } else {
                res.status(404).json({ message: '좋아요를 누른 게시물이 없습니다.' });
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return handleError(res, 'JSON 파싱 중 오류가 발생했습니다.');
        }
    });
});

// 포스트를 날짜 순으로 정렬하는 함수
function sortPostsByDate(posts) {
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // 내림차순으로 정렬
}

// 포스트를 좋아요 수에 따라 정렬하는 함수
function sortPostsByLikes(posts) {
    return posts.sort((a, b) => b.likes - a.likes); // 내림차순으로 정렬
}
