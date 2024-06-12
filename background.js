async function turnOnAndOff() {
  // Where we will expose all the data we retrieve from storage.sync.
  const storageCache = { state: "off" };
  const initStorageCache = chrome.storage.sync.get().then((items) => {
    Object.assign(storageCache, items);
  });

  try {
    await initStorageCache;
  } catch (e) {
    console.log("error", e);
  }

  const courseSidebar = document.getElementById("courseSidebar");
  const main = document.querySelector(".lecture-content");
  if (storageCache.state === "on") {
    storageCache.state = "off";
    courseSidebar.style.display = "block";
    main.style.maxWidth = storageCache.prevMainMaxWidth;
  } else {
    storageCache.prevMainMaxWidth = window
      .getComputedStyle(main)
      .getPropertyValue("max-width");
    storageCache.state = "on";
    courseSidebar.style.display = "none";
    main.style.maxWidth = "100%";
  }
  chrome.storage.sync.set(storageCache);
}

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: turnOnAndOff,
  });
});
