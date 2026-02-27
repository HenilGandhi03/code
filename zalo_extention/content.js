async function translateText(text) {
    const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
}

function isVietnamese(text) {
    return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
}

async function processMessage(messageNode) {
    if (messageNode.dataset.translated) return;

    const textSpan = messageNode.querySelector('[data-component="text-container"]');
    if (!textSpan) return;

    const text = textSpan.innerText.trim();
    if (!text || !isVietnamese(text)) return;

    messageNode.dataset.translated = "true";

    try {
        const translated = await translateText(text);

        const translationDiv = document.createElement("div");
        translationDiv.innerText = translated;
        translationDiv.style.fontSize = "12px";
        translationDiv.style.opacity = "0.75";
        translationDiv.style.marginTop = "6px";
        translationDiv.style.fontStyle = "italic";

        textSpan.parentElement.appendChild(translationDiv);
    } catch (err) {
        console.error("Translation error:", err);
    }
}

function scanMessages() {
    const messages = document.querySelectorAll(".chat-message-v2");
    messages.forEach(processMessage);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.classList?.contains("chat-message-v2")) {
                    processMessage(node);
                }
                node.querySelectorAll?.(".chat-message-v2")
                    .forEach(processMessage);
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

setTimeout(scanMessages, 1500);