/**
 * multi browser clipboard copy - ypetya@gmail.com
 * */
/***
 * This function uses multiple methods for copying data to clipboard
 * 1. document.execCommand('copy') can be supported only for user initiated contexts
 *   - that means we can only determine it on the fly
 *   - d3 eventDispatch is not working this way
 * 2. ClipboardEvent constructor is only defined for Firefox (see MDN)
 *   - for FF, d3 selector uses input's value property instead of selection.text()
 * */
export default function (inputNode, action) {
  // Chrome
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported(action)
  ) {
    inputNode.select();
    document.execCommand(action);
  } else {
    // FF
    const event = new ClipboardEvent(action);
    const text = inputNode.value;
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
    document.dispatchEvent(event);
  }
}
