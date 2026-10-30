// jsdom has a dialog element but not showModal() and close(), so give it the parts the pop-out player uses:
// showModal marks it open, and close marks it closed and fires the close event the way a browser does
export const installFakeDialog = () => {
    const proto = window.HTMLDialogElement.prototype;
    proto.showModal = function showModal(this: HTMLDialogElement) {
        this.setAttribute("open", "");
    };
    proto.close = function close(this: HTMLDialogElement) {
        if (!this.hasAttribute("open")) return;
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close"));
    };
};
