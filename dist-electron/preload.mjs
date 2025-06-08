"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // 最小化
  minimize: () => electron.ipcRenderer.send("minimize-window"),
  // 关闭窗口
  close: () => electron.ipcRenderer.send("close-window"),
  // Store相关操作
  getStore: (key) => electron.ipcRenderer.invoke("getStore", key),
  setStore: (key, value) => electron.ipcRenderer.invoke("setStore", key, value),
  deleteStore: (key) => electron.ipcRenderer.invoke("deleteStore", key),
  hasStore: (key) => electron.ipcRenderer.invoke("hasStore", key),
  clearStore: () => electron.ipcRenderer.invoke("clearStore")
});
