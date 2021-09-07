import requestApi from "@/api/request-api";

export default {
  url: '/base/pConTrack',
  // findOne() {
  //   return requestApi.request_get(this.url + '/findOne')
  // }
}
export const findOne = (id) => {
  return requestApi.request_get('/base/pConTrack/findOne', { id })
}
