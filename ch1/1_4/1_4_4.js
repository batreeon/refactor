// refactor 1_4_3.js 
// 将计算credits的逻辑提炼成函数；将format提炼成函数，避免使用临时变量，临时变量值在局部使用，很容易导致代码变长变复杂；将所有thisAmuount都变成内联形式
// 将format这个较通用的名称修改为usd，函数名更加清晰，可以让人不用看函数体就知道函数的用处
// 并且将除以100放到usd里。美分美元转换
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf)

        // print line for this order
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${usd(totalAmount)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
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
        return plays[aPerformance.playID]
    }

    function volumeCreditsFor(aPerformance) {
        // 计算观众积分
        let result = Math.max(aPerformance.audience - 30, 0)
        // add extra credit for every five comedy attendees
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result
    }

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