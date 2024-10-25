export const DangerousClipboard = (targetText: string, timer?: number) => {
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText(targetText);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = targetText;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, targetText.length + 99);

      try {
        document.execCommand('copy');
      } catch (copyError) {
        alert('복사 실패 : ' + copyError);
      }

      textArea.setSelectionRange(0, 0);
      document.body.removeChild(textArea);
    }
  }, timer ?? 300);
};
