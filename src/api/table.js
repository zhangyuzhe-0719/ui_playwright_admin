import request from '@/utils/request'

export function getList(params="") {
  return request({
    url: `/caseGet${params}`,
    method: 'get'
  })
}

export function csDelete(id){
  return request({
    url: `/caseDelete?id=${id}`,
    method: 'delete',
  })
}

export function csUpdate(params) {
  return request({
    url: '/caseUpdate',
    method: 'post',
    data: params
  })
}

export function csAdd(params) {
  return request({
    url: '/caseAdd',
    method: 'post',
    data: params
  })
}

export function resultCreate() {
  return request({
    url: '/resultCreate',
    method: 'get'
  })
}