// refactor 1_6_6.js
// 使用数组的reduce方法改造totalAmount和totalVolumeCredits函数
// 把准备statement数据又提炼成了一个函数。现在statement函数把数据准备好，然后render不再进行计算，只需要接受数据，将数据组织成目标形式就可以了

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData

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
                thisAmount = 30000;
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

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        // print line for this order
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }
}

const invoices = require("./invoices.json");
const plays = require("./plays.json");

console.log(statement(invoices, plays));