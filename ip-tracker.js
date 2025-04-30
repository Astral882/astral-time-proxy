// 如果汇率API失败，使用静态数据
let usdtRate = 4.72;

async function getExchangeRate() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=myr');
        const data = await response.json();
        usdtRate = data.tether.myr;
    } catch (error) {
        console.log("Using default rate");
    }
    return usdtRate;
}