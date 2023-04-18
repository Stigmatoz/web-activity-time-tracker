import Browser from 'webextension-polyfill';

export async function useBlockPage(url: string, summaryTime: number, summaryCounter: number): Promise<void>{
    const blockUrl = Browser.runtime.getURL("block.html") + '?url=' + url
                    + '&summaryTime=' + summaryTime
                    + '&summaryCounter=' + summaryCounter;
    const tab = await Browser.tabs.query({ currentWindow: true, active: true }) 
    Browser.tabs.update(tab[0].id, { url: blockUrl });
}