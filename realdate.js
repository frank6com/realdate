// ==UserScript==
// @name         日期格式转换
// @namespace    http://frank6.com/
// @version      1.2
// @description  将英文版的日期格式转换为2024年9月10日这种格式
// @author       Frank6
// @match        *://*/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // 匹配常见的英文日期格式：09/10/2024, September 10, 2024, Sep 10, 2024, 17 August 2024
    const dateRegex = /(\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\w+\s\d{1,2},\s\d{4}\b|\b\w{3}\s\d{1,2},\s\d{4}\b|\b\d{1,2}\s\w+\s\d{4}\b)/g;


    // 获取页面中的所有文本节点
    function walk(node) {
        let child, next;
        switch (node.nodeType) {
            case 1: // Element
            case 9: // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;
            case 3: // Text node
                handleText(node);
                break;
        }
    }

    // 处理文本节点
    function handleText(textNode) {
        let text = textNode.nodeValue;
        textNode.nodeValue = text.replace(dateRegex, function (match) {
            return convertDate(match);
        });
    }

    // 将英文日期格式转换为中文日期格式
    function convertDate(dateStr) {
        const fullMonths = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };

        const shortMonths = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };

        // 处理 "September 10, 2024" 格式
        let longDateMatch = /(\w+)\s(\d{1,2}),\s(\d{4})/.exec(dateStr);
        if (longDateMatch && fullMonths[longDateMatch[1]]) {
            let month = fullMonths[longDateMatch[1]];
            let day = longDateMatch[2];
            let year = longDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        // 处理 "Sep 10, 2024" 格式
        let shortDateMatch = /(\w{3})\s(\d{1,2}),\s(\d{4})/.exec(dateStr);
        if (shortDateMatch && shortMonths[shortDateMatch[1]]) {
            let month = shortMonths[shortDateMatch[1]];
            let day = shortDateMatch[2];
            let year = shortDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        // 处理 "09/10/2024" 格式
        let slashDateMatch = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(dateStr);
        if (slashDateMatch) {
            let month = slashDateMatch[1];
            let day = slashDateMatch[2];
            let year = slashDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        // 处理 "17 August 2024" 格式
        let reverseDateMatch = /(\d{1,2})\s(\w+)\s(\d{4})/.exec(dateStr);
        if (reverseDateMatch && fullMonths[reverseDateMatch[2]]) {
            let day = reverseDateMatch[1];
            let month = fullMonths[reverseDateMatch[2]];
            let year = reverseDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        return dateStr; // 如果无法匹配，则返回原始文本
    }

    // 执行
    walk(document.body);
})();
