// refactor 1_6_1.js
// 将invoice中的customer和performance放到data里面去，这样就可以删去invoice了。
// 同时注意totalVolumeCredits和totalAmount都是嵌套在renderPlainText中的，并且使用了invoice变量，
// 现在这两个函数的参数也需要从data中获取了，需要修改。

function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances
    return renderPlainText(statementData, plays)
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        // print line for this order
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        // 计算观众积分
        let result = Math.max(aPerformance.audience - 30, 0);
        // add extra credit for every five comedy attendees
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result;
    }
}

const invoices = require("./invoices.json");
const plays = require("./plays.json");

console.log(statement(invoices, plays));