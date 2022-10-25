// refactor 1_6_8
// renderHtml()

function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }
    // playFor函数要使用plays变量，因此将其嵌套在statement函数中，这样renderPlainText就可以删除plays参数了
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    // 这个函数现在提炼出来，内部也不需要特别改造，因为输入参数其实和上一轮改造是一样的
    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        // 计算观众积分
        let result = Math.max(aPerformance.audience - 30, 0);
        // add extra credit for every five comedy attendees
        if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data) {
        return data.performances.reduce((total, perf) => total + perf.amount, 0)
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0)
    }
}

module.exports = {
    createStatementData
}