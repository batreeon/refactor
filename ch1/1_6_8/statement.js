// refactor 1_6_7.js
// 将createStatementData函数拆分到另一个文件里。
// 使用module.exports导出函数，使用require引用其他文件中的函数

let createStatementData = require('./createStatementData').createStatementData

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
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

const invoices = require("../invoices.json");
const plays = require("../plays.json");

console.log(statement(invoices, plays));