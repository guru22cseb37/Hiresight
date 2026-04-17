// popup.js
document.getElementById('grab-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, (results) => {
    const text = results[0].result;
    if (text) {
      const preview = document.getElementById('selection-preview');
      preview.textContent = text;
      preview.style.display = 'block';
      
      const analyzeBtn = document.getElementById('analyze-btn');
      analyzeBtn.disabled = false;
      analyzeBtn.style.background = '#3B82F6';
      
      chrome.storage.local.set({ selectedJD: text });
    }
  });
});

document.getElementById('analyze-btn').addEventListener('click', () => {
  chrome.storage.local.get(['selectedJD'], (result) => {
    const url = 'http://localhost:3000/dashboard/analyze?external_jd=' + encodeURIComponent(result.selectedJD);
    chrome.tabs.create({ url });
  });
});

// content.js
// This script is injected into web pages
console.log('HireSight Extension Active');
