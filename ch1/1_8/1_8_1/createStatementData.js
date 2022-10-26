function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));

        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result
    }
    // playFor函数要使用plays变量，因此将其嵌套在statement函数中，这样renderPlainText就可以删除plays参数了
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances.reduce((total, perf) => total + perf.amount, 0)
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0)
    }
}

class PerformanceCalculator {
    performance;

    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error("unknown type: $(this.play.type}");
        }
        return result;
    }

    get volumeCredits() {
        // 计算观众积分
        let result = Math.max(this.performance.audience - 30, 0);
        // add extra credit for every five comedy attendees
        if ("comedy" === this.play.type) {
            result += Math.floor(this.performance.audience / 5);
        }
        return result;
    }
}

module.exports = {
    createStatementData
}