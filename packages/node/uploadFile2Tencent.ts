import tencentcloud from 'tencentcloud-sdk-nodejs'
import COS from 'cos-nodejs-sdk-v5'
import fs from 'fs'
import path from 'path'
// import ora from 'ora'

/**
 * 上传文件到腾讯云
 */
interface PutObjectOptions {
  Key: string
  Bucket: string
  Region: string
  StorageClass:
    | 'STANDARD'
    | 'STANDARD_IA'
    | 'ARCHIVE'
    | 'DEEP_ARCHIVE'
    | 'INTELLIGENT_TIERING'
    | 'MAZ_STANDARD'
    | 'MAZ_STANDARD_IA'
    | 'MAZ_INTELLIGENT_TIERING'
}
export interface UploadFileConfigs {
  cosConfig: COS.COSOptions
  putConfig: PutObjectOptions
  filePath: string
}
export const uploadFile2TencentCos = async (params: UploadFileConfigs) => {
  const { cosConfig, putConfig, filePath } = params
  if (!filePath) {
    return
  }
  return await new Promise((resolve, reject) => {
    const cos = new COS(cosConfig)
    cos.putObject(
      {
        ...(putConfig ?? {}),
        Body: fs.createReadStream(filePath) // 上传文件对象
      },
      function (err, data) {
        if (err) {
          console.log(' -------------- 上传 crx 失败了 --------------')
          reject(err)
          return
        }
        resolve(data)
      }
    )
  })
}

export const uploadFilesToCOS = async (needUploadFils: Array<string>) => {
  const cosConfig = {
    SecretId: 'xxx',
    SecretKey: 'xxx'
  }
  const putConfig: Pick<
    PutObjectOptions,
    'Bucket' | 'Region' | 'StorageClass'
  > = {
    Bucket: 'xxx',
    Region: 'xxx',
    StorageClass: 'STANDARD'
  }
  for (let i = 0; i < needUploadFils.length; i++) {
    const uploadPath = needUploadFils[i]
    const cosKey = `baseFilePath${uploadPath}`
    const filePath = path.resolve(process.cwd(), `baseUploadPath${uploadPath}`)
    await uploadFile2TencentCos({
      cosConfig,
      filePath,
      putConfig: {
        ...putConfig,
        Key: cosKey
      }
    })
  }
}

// 刷新 cdn url 资源
export interface CdnConfig {
  credential: {
    secretId: string
    secretKey: string
  }
  Region: string
  profile: {
    httpProfile: {
      endpoint: string
    }
  }
}
export const refreshCDNUrl = async (
  fileUrls: Array<string>,
  cdnConfigs: CdnConfig
) => {
  return await new Promise((resolve, reject) => {
    const CdnClient = tencentcloud.cdn.v20180606.Client
    const client = new CdnClient(cdnConfigs)
    const params = {
      Urls: fileUrls
    }
    client.PurgeUrlsCache(params).then(
      () => {
        resolve(null)
      },
      (err) => {
        console.log(' -------------- 刷新 cdn 失败了 --------------')
        reject(err)
      }
    )
  })
}

// test
// const run = async () => {
//   try {
//     const spinner = ora().start('正在更新打包后的文件...')
//     const needUploadFils = ['/main.js', '/index.html']
//     await uploadFilesToCOS(needUploadFils)
//     const needRefreshUrls = needUploadFils.map((url) => `baseUrl${url}`)
//     const clientConfig = {
//       credential: {
//         secretId: 'xxx',
//         secretKey: 'xxx'
//       },
//       Region: 'xxx',
//       profile: {
//         httpProfile: {
//           endpoint: 'cdn.tencentcloudapi.com'
//         }
//       }
//     }
//     await refreshCDNUrl(needRefreshUrls, clientConfig)
//     spinner.succeed('全部更新成功~')
//   } catch (err) {
//     console.log(err)
//   }
// }
// run()
