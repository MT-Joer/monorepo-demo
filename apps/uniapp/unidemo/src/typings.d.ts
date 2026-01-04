 
 
// 全局要用的类型放到这里

type IResData<T> = {
  code: number
  data: T
  msg: string
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  filePath?: string
  files?: UniApp.UploadFileOptionFiles[]
  formData?: any
  name?: string
}

type IUserInfo = {
  avatar?: string
  nickname?: string
  /** 微信的 openid，非微信没有这个字段 */
  openid?: string
  token?: string
}

enum TestEnum {
  A = "a",
  B = "b",
}

declare type Recordable<T = any> = Record<string, T>
