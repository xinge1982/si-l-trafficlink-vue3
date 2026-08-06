//复制文本
import { ElMessage } from 'element-plus'

// i18n language  match title
import { i18n } from '@/lang'
// the keys using  zh file
import langEn from '@/lang/zh'
import settings from '@/settings'

export const sleepTimeout = (time) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve(null)
    }, time)
  })
}

export const filterNull = (data) => {
  Object.keys(data).forEach((key) => {
    if (!data[key]) delete data[key]
  })

  return data
}

//深拷贝
export function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value))
}

const { t, te } = i18n.global
export const langTitle = (title) => {
  if (!title) {
    return settings.title
  }
  if (te(title) && t(title)) {
    return t(title)
  }
  for (const key of Object.keys(langEn)) {
    if (te(`${key}.${title}`) && t(`${key}.${title}`)) {
      return t(`${key}.${title}`)
    }
  }

  return title
}

export const langKeyTitle = (key: any,title) => {
  if (!title) {
    return settings.title
  }
  if (te(`${key}.${title}`) && t(`${key}.${title}`)) {
    return t(`${key}.${title}`)
  }

  return title
}

//get i18n instance
export const getLangInstance = () => {
  return i18n.global
}

//生成唯一的uuid
export const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.trunc(Math.random() * 16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const isNullOrEmpty = (str: string | null | undefined): boolean => {
  return str === null || str === undefined || str.length === 0
}

//根据url下载模板
export const downLoadTempByUrl = (url) => {
  //得到主键key
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
}

//下载模板
export const downLoadTemp = (res) => {
  //得到主键key
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', decodeURI(res.headers['file-name']))
  document.body.appendChild(link)
  link.click()
}

export const resetData = (from, formString) => {
  const backData = JSON.parse(formString)
  Object.keys(backData).forEach((key) => (from[key] = backData[key]))
}

export const reshowData = (addEditForm, detailData) => {
  Object.keys(addEditForm).forEach((fItem) => {
    // eslint-disable-next-line no-prototype-builtins
    if (detailData && ![null, undefined, ''].includes(detailData[fItem])) {
      addEditForm[fItem] = detailData[fItem]
    }
  })
}

export const formatRFC3339 = (rfcTime) => {
  const date = new Date(rfcTime)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

//minio图片显示拼接
// import { listReq } from '@/api/ossConfig'
//
// //取 minio 激活的 bucket
// let bucketName = ''
// listReq({}).then(({ rows }: any) => {
//   rows.forEach((item) => {
//     if (item.status === '0') {
//       bucketName = item.bucketName
//     }
//   })
// })
// console.log(bucketName)

export const spliceMinioUrl = (imageUrl) => {
  return `${import.meta.env.VITE_APP_IMAGE_URL}/${imageUrl}`
}

export function isNumericString(value: string): boolean {
  return value.trim() !== '' && !Number.isNaN(Number(value));
}
