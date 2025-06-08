import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // 最小化
  minimize: () => ipcRenderer.send('minimize-window'),
  // 关闭窗口
  close: () => ipcRenderer.send('close-window'),

  // Store相关操作
  getStore: (key: string) => ipcRenderer.invoke('getStore', key),
  setStore: (key: string, value: any) => ipcRenderer.invoke('setStore', key, value),
  deleteStore: (key: string) => ipcRenderer.invoke('deleteStore', key),
  hasStore: (key: string) => ipcRenderer.invoke('hasStore', key),
  clearStore: () => ipcRenderer.invoke('clearStore'),
})
