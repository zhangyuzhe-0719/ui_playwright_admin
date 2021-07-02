import request from '@/utils/request'

export function getPrj(params="") {
  return request({
    url: `/projectGet${params}`,
    method: 'get'
  })
}

export function getCls(params="") {
    return request({
      url: `/classGet${params}`,
      method: 'get'
    })
  }