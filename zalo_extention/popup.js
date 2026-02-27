document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("language");
  const saveBtn = document.getElementById("save");
  const saveStatus = document.getElementById("save-status");

  const emailInput = document.getElementById("email");
  const subscribeBtn = document.getElementById("subscribe");
  const emailStatus = document.getElementById("email-status");

  // Load saved language
  chrome.storage.local.get(["language"], (result) => {
    if (result.language) {
      select.value = result.language;
    }
  });

  // Save language with inline feedback
  saveBtn.addEventListener("click", () => {
    const selectedLang = select.value;

    saveBtn.disabled = true;

    chrome.storage.local.set({ language: selectedLang }, () => {
      saveStatus.textContent = "✓ Language saved";
      saveStatus.classList.add("show");

      setTimeout(() => {
        saveStatus.classList.remove("show");
        saveBtn.disabled = false;
      }, 1500);
    });
  });

  // Email subscription (silent submission)
  subscribeBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) return;

    subscribeBtn.disabled = true;

    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSdLHfvG9V1i_iLsz1-e7U9ipU4EfiOI5bxRggMlOy9Ol3whQw/formResponse";

    const formData = new FormData();
    formData.append("entry.1537383206", email);

    try {
      await fetch(formURL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      emailInput.value = "";
      emailStatus.textContent = "✓ You're on the list";
      emailStatus.classList.add("show");

      setTimeout(() => {
        emailStatus.classList.remove("show");
        subscribeBtn.disabled = false;
      }, 2000);

    } catch (error) {
      subscribeBtn.disabled = false;
      emailStatus.textContent = "Something went wrong";
      emailStatus.classList.add("show");
    }
  });

  // Coffee link
  document.getElementById("coffee").addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://buymeacoffee.com/henilgandhi",
    });
  });
});