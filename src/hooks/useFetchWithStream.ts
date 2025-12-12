import { useFetch } from '@vueuse/core'

interface FetchWithStreamParams {
  data: Record<string, any>
  cb: (line: string) => void
  url: string
  signal?: AbortSignal | null
}

export async function useFetchWithStream({
  data,
  cb,
  url,
  signal: _signal = null
}: FetchWithStreamParams): Promise<void> {
  const body = JSON.stringify(data)
  const {
    data: _resData,
    response: responseData,
    error,
    execute
  } = useFetch(url, {
    method: 'POST',
    body
  })

  console.log(responseData)
  // 等待 fetch 执行完成
  await execute()
  console.log(responseData.value)

  // 处理错误
  if (error.value) {
    throw new Error('网络错误或其他错误: ' + error.value.message)
  }

  // 处理流式响应
  const reader = responseData.value?.body?.getReader()
  if (!reader) {
    throw new Error('无法获取响应的读取器')
  }

  const decoder = new TextDecoder('utf-8')
  let partialChunk = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    partialChunk += decoder.decode(value, { stream: true })
    let lines = partialChunk.split('\n')
    partialChunk = lines.pop() || '' // 保留最后一个未完整的行，继续拼接
    lines = lines.filter(Boolean).map((line) => line.replace('data:', ''))
    console.log('lines', lines)
    for (const line of lines) {
      try {
        // 根据你的需求处理不同类型的数据
        // const res = JSON.parse(line)
        cb(line)
      } catch (error) {
        console.error('解析错误:', error)
      }
    }
  }
}
