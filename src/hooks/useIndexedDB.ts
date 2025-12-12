import { type Ref } from 'vue'

interface UseIndexedDBReturn {
  openDB: (name: string, version: number, objectStoreName: string) => Promise<IDBDatabase>
  get: (objectStoreName: string, key: string) => Promise<any>
  put: (objectStoreName: string, key: string, value: any) => Promise<any>
  deleteData: (objectStoreName: string, key: string) => Promise<any>
}

export function useIndexedDB(): UseIndexedDBReturn {
  const db: Ref<IDBDatabase | null> = ref(null)

  function openDB(name: string, version: number, objectStoreName: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(name, version)

      openRequest.onupgradeneeded = function (e: IDBVersionChangeEvent) {
        db.value = (e.target as IDBOpenDBRequest).result
        if (!db.value.objectStoreNames.contains(objectStoreName)) {
          db.value.createObjectStore(objectStoreName)
        }
      }

      openRequest.onsuccess = function (e: Event) {
        db.value = (e.target as IDBOpenDBRequest).result
        resolve(db.value)
      }

      openRequest.onerror = function () {
        const err = openRequest.error
        reject(err ?? new Error('IndexedDB open failed'))
      }
    })
  }

  function get(objectStoreName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!db.value) {
        reject(new Error('IndexedDB is not opened'))
        return
      }
      const transaction = db.value.transaction(objectStoreName, 'readonly')
      const store = transaction.objectStore(objectStoreName)
      const getRequest = store.get(key)

      getRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      getRequest.onerror = function () {
        const err = getRequest.error
        reject(err ?? new Error('IndexedDB get failed'))
      }
    })
  }

  function put(objectStoreName: string, key: string, value: any): Promise<any> {
    console.log(value)

    return new Promise((resolve, reject) => {
      if (!db.value) {
        reject(new Error('IndexedDB is not opened'))
        return
      }
      const transaction = db.value.transaction(objectStoreName, 'readwrite')
      const store = transaction.objectStore(objectStoreName)
      const cleanedValue = JSON.parse(JSON.stringify(value)) // 移除不能被克隆的数据类型
      const putRequest = store.put(cleanedValue, key)

      putRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      putRequest.onerror = function () {
        const err = putRequest.error
        reject(err ?? new Error('IndexedDB put failed'))
      }
    })
  }

  function deleteData(objectStoreName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(objectStoreName, key, db.value)
      if (!db.value) {
        reject(new Error('IndexedDB is not opened'))
        return
      }
      const transaction = db.value.transaction(objectStoreName, 'readwrite')
      console.log(transaction)
      const store = transaction.objectStore(objectStoreName)
      console.log(store)

      const deleteRequest = store.delete(key)

      deleteRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      deleteRequest.onerror = function () {
        const err = deleteRequest.error
        reject(err ?? new Error('IndexedDB delete failed'))
      }
    })
  }

  return { openDB, get, put, deleteData }
}
