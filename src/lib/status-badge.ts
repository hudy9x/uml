export type StatusType = "info" | "success" | "error";

export class StatusBadge {
  private static readonly BADGE_ID = "status-badge";
  private static readonly HIDE_DELAY = 500; // 3 seconds

  static loading(status: boolean, delay: number = this.HIDE_DELAY) {
    const badge = document.getElementById(this.BADGE_ID);
    if (!badge) return;

    console.log("badge", badge, status);

    const saveIcon = badge.querySelector("#stt-icon-save");
    const loadingIcon = badge.querySelector("#stt-icon-loading");
    const text = badge.querySelector("#stt-text");

    console.log("saveIcon", saveIcon);
    console.log("loadingIcon", loadingIcon);
    console.log("text", text);

    if (!saveIcon || !loadingIcon || !text) return;

    if (status) {
      console.log("status loading", status);
      saveIcon.classList.add("hidden");
      loadingIcon.classList.remove("hidden");
      text.textContent = "Saving...";
    } else {
      setTimeout(() => {
        console.log("status", status);
        saveIcon.classList.remove("hidden");
        loadingIcon.classList.add("hidden");
        text.textContent = "Saved";
      }, delay);
    }
  }
}
