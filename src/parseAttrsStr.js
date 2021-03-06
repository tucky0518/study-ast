// 把attrsStr变为数组返回
export default function(attrsStr) {
  // console.log(attrsStr);

  if (attrsStr == undefined) return [];

  // 当前是否在引号内
  var isYinhao = false;
  // 断点
  var point = 0;
  // 结果数组
  var result = [];

  // 遍历attrsStr,而不是你想的用split()这种暴力方法
  for (let i = 0; i < attrsStr.length; i++) {
    let char = attrsStr[i];
    if (char == '"') {
      isYinhao = !isYinhao;
    } else if (char == ' ' && !isYinhao) {
      // 遇见了空格,并且不在引号中
      // console.log(i);
      if (!/^\s*$/.test(attrsStr.substring(point, i))) {
        result.push(attrsStr.substring(point, i).trim());
        point = i;
      }
    }
  }
  // 循环结束之后,最后还剩一个属性k='v'
  result.push(attrsStr.substring(point).trim());

  // 下面的代码功能是,将["k=v","k=v","k=v"]变为[{name:k,value:v},{name:k,value:v},{name:k,value:v}]
  result = result.map(item => {
    //  根据等号拆分
    const o = item.match(/^(.+)="(.+)"$/);
    return {
      name: o[1],
      value: o[2]
    };
  });

  return result;
}
