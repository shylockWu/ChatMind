/*
 * @Author: shylock shylock.wu@moblor.com
 * @Date: 2023-04-20 14:28:48
 * @LastEditors: shylock shylock.wu@moblor.com
 * @LastEditTime: 2023-04-20 14:29:38
 * @FilePath: /AutoGPTDemo/src/server/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import type { AxiosProgressEvent } from 'axios'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://s3m25c.laf.dev/test-open-api',
})

function chat(params: {
  prompt: string
  session_id?: string
  onDownloadProgress?: (ProgressEvent: AxiosProgressEvent) => void
}) {
  return apiClient({
    method: 'POST',
    responseType: 'stream',
    data: { prompt: params.prompt, session_id: params.session_id, key: '6lDP2LyQMYTR32MORBr3' },
    onDownloadProgress: params.onDownloadProgress,
  })
}

export { chat }
