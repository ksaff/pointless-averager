function checkUrl(tabId, changeInfo, tab) {
	/*if (/https?:\/\/(?:[^\/]*)?engradebcps.com\/class\/gradebook/.test(tab.url)) {
		chrome.pageAction.show(tabId);
	}*/
	chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(checkUrl);