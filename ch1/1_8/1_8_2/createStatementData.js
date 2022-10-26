function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));

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

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error("unknown type: ${aPlay.type}");
    }
}

class PerformanceCalculator {
    performance;

    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay
    }

    get volumeCredits() {
        // 计算观众积分
        let result = Math.max(this.performance.audience - 30, 0);
        return result;
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        // add extra credit for every five comedy attendees 
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

module.exports = {
    createStatementData
}