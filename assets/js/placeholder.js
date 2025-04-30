// 人脸识别初始化
document.getElementById('dealerBtn')?.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, facingMode: 'user' } 
        });
        console.log("Camera ready for Azure Face API");
    } catch (error) {
        alert("Camera error: " + error.message);
    }
});
