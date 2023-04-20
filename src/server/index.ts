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
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://s3m25c.laf.dev/test-open-api',
  responseType: 'stream',
})

export default apiClient
