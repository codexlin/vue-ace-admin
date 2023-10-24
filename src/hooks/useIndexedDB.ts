import { ref, type Ref } from 'vue'

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

      openRequest.onerror = function (e: Event) {
        reject(e)
      }
    })
  }

  function get(objectStoreName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(objectStoreName, 'readonly')
      const store = transaction.objectStore(objectStoreName)
      const getRequest = store.get(key)

      getRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      getRequest.onerror = function (e: Event) {
        reject(e)
      }
    })
  }

  function put(objectStoreName: string, key: string, value: any): Promise<any> {
    console.log(value)

    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(objectStoreName, 'readwrite')
      const store = transaction.objectStore(objectStoreName)
      const cleanedValue = JSON.parse(JSON.stringify(value)) // 移除不能被克隆的数据类型
      const putRequest = store.put(cleanedValue, key)

      putRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      putRequest.onerror = function (e: Event) {
        reject(e)
      }
    })
  }

  function deleteData(objectStoreName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(objectStoreName, 'readwrite')
      const store = transaction.objectStore(objectStoreName)
      const deleteRequest = store.delete(key)

      deleteRequest.onsuccess = function (e: Event) {
        resolve((e.target as IDBRequest).result)
      }

      deleteRequest.onerror = function (e: Event) {
        reject(e)
      }
    })
  }

  return { openDB, get, put, deleteData }
}
