import request from '@/utils/request'

export function getProject(params="") {
  return request({
    url: `/projectGet${params}`,
    method: 'get'
  })
}