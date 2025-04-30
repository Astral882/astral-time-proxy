// 人脸识别模块
document.getElementById('dealerBtn').addEventListener('click', initFaceVerification);

let faceVerificationAttempts = 0;
const MAX_ATTEMPTS = 3;

async function initFaceVerification() {
    // 重置状态
    document.getElementById('verificationStatus').textContent = '';
    document.getElementById('faceModal').style.display = 'block';

    // 启动摄像头
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, facingMode: 'user' } 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access denied. Please enable permissions.");
        return;
    }

    // 绑定拍照事件
    document.getElementById('captureBtn').onclick = captureFace;
}

async function captureFace() {
    if (faceVerificationAttempts >= MAX_ATTEMPTS) {
        alert("Too many failed attempts. System locked for 30 minutes.");
        document.getElementById('faceModal').style.display = 'none';
        return;
    }

    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    const statusEl = document.getElementById('verificationStatus');
    
    // 拍照
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    // 显示验证中状态
    statusEl.textContent = "Verifying...";
    statusEl.style.color = "#0066cc";

    try {
        // 调用Azure Face API（实际端点通过环境变量配置）
        const response = await fetch(process.env.AZURE_FACE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_API_KEY
            },
            body: JSON.stringify({ image: imageData })
        });

        const result = await response.json();

        if (result.isVerified) {
            // 验证通过，跳转申请页面
            window.location.href = `/dealer-apply.html?token=${result.token}`;
        } else {
            // 验证失败
            faceVerificationAttempts++;
            statusEl.textContent = `Verification failed (${faceVerificationAttempts}/3 attempts)`;
            statusEl.style.color = "#cc0000";
        }
    } catch (error) {
        console.error("API error:", error);
        statusEl.textContent = "Server error. Please try later.";
    }
}