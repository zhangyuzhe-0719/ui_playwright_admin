import request from '@/utils/request'

export function getClass(params="") {
  return request({
    url: `/classGet${params}`,
    method: 'get'
  })
}

export function addClass(params) {
    return request({
      url: `/classAdd`,
      method: 'post',
      data: params
    })
}

export function updateClass(params) {
    return request({
        url: `/classUpdate`,
        method: 'post',
        data: params
    })
}

export function deleteClass(params) {
    return request({
        url: `/classUpdate${params}`,
        method: 'delete'
        })
}