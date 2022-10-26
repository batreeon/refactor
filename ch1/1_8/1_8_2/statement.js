// refactor 1_8_1
// 使用类来组织单个performance，并将花费和用户积分的计算组织为类的方法
// 使用多态

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
}

function statementHtml(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays))
}

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
    for (let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
    {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}

const invoices = require("../../invoices.json");
const plays = require("../../plays.json");

console.log(statement(invoices, plays));
// console.log(statementHtml(invoices, plays));