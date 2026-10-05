/**
 * Robust ZIP file downloader that creates a real file download stream
 * preventing the browser from displaying raw binary/text code in the tab.
 */
export async function downloadProjectZip(): Promise<void> {
  try {
    const res = await fetch('/kisanrakshak-fullstack.zip');
    if (!res.ok) {
      throw new Error(`Failed to fetch zip: ${res.statusText}`);
    }
    const blob = await res.blob();
    const zipBlob = new Blob([blob], { type: 'application/zip' });
    const url = window.URL.createObjectURL(zipBlob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kisanrakshak-fullstack.zip';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, 2000);
  } catch (err) {
    console.error('Download error, fallback direct link:', err);
    // Fallback direct link
    const anchor = document.createElement('a');
    anchor.href = '/kisanrakshak-fullstack.zip';
    anchor.setAttribute('download', 'kisanrakshak-fullstack.zip');
    anchor.target = '_blank';
    anchor.click();
  }
}
