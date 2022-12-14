/*
 * @Description: Big.js 封装
 * @Date: 2022-12-07 14:56:49
 * @LastEditTime: 2022-12-12 14:22:06
 */
import Big from 'big.js';
//加法封装
export function add(a, b) {
  return new Big(a).plus(new Big(b)).toString();
}
//减法封装
export function sub(a, b) {
  return new Big(a).minus(new Big(b)).toString();
}
//乘法封装
export function mul(a, b) {
  return new Big(a).times(new Big(b)).toString();
}
//除法封装
export function div(a, b) {
  return new Big(a).div(new Big(b)).toString();
}
//保留两位小数
export function BigToFixed(a) {
  // return new Big(a).toFixed(2);
  return a;
}
//保留两位小数
export function BigToFixedTwo(a) {
  return new Big(a).toFixed(2);
}

