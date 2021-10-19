import parseAttrsStr from './parseAttrsStr.js';
export default function(templateStr) {
  // 指针
  var index = 0;
  // 剩余部分
  var rest = templateStr;
  // 开始标记
  var startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
  // 结束标记
  var endRegExp = /^\<\/([a-z]+[1-6]?)\>/;
  // 抓取结束标记前的文字
  var wordRegExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
  // 准备两个栈
  var stack1 = [];
  var stack2 = [{ children: [] }];

  while (index < templateStr.length - 1) {
    rest = templateStr.substring(index);
    // console.log(templateStr[index]);
    if (startRegExp.test(rest)) {
      // 识别遍历到的这个字符,是不是一个开始标签
      let tag = rest.match(startRegExp)[1];
      let attrsStr = rest.match(startRegExp)[2];
      // console.log('检测到开始标记', tag);
      // 将开始标记推入栈中
      stack1.push(tag);
      // 将空数组推入栈2中
      stack2.push({ tag: tag, children: [], attrs: parseAttrsStr(attrsStr) });
      // 指针移动标签的长度加2再加attrsStr的长度,为什么要加2呢?因为<>也占2位
      // 得到attrsStr的总长度
      const attrsStrLength = attrsStr != null ? attrsStr.length : 0;
      index += tag.length + 2 + attrsStrLength;
    } else if (endRegExp.test(rest)) {
      // 识别遍历到的这个字符,是不是一个结束标签
      let tag = rest.match(endRegExp)[1];
      // console.log('检测到结束标记', tag);
      let pop_tag = stack1.pop();
      // 此时,tag一定是和栈1顶部的是相同的
      if (tag == pop_tag) {
        let pop_arr = stack2.pop();
        if (stack2.length > 0) {
          // // 检查stack2是否有children属性,如果没有就创建一个数组
          // if (!stack2[stack2.length - 1].hasOwnProperty('children')) {
          //   stack2[stack2.length - 1].children = [];
          // }
          stack2[stack2.length - 1].children.push(pop_arr);
        }
      } else {
        throw new Error(pop_tag + '标签没有封闭!');
      }
      // 指针移动标签的长度加3,为什么要加3呢?因为</>也占2位
      index += tag.length + 3;
    } else if (wordRegExp.test(rest)) {
      // 识别遍历到的这个字符,是不是文字,并且不能是全空
      let word = rest.match(wordRegExp)[1];
      // 看word是不是全是空
      if (!/^\s+$/.test(word)) {
        // 不是全是空
        console.log('检测到文字', word);
        // 改变此时stack2栈顶元素中
        stack2[stack2.length - 1].children.push({ text: word, type: 3 });
      }
      // 指针移动标签的长度
      index += word.length;
    } else {
      // 标签中的文字
      index++;
    }
  }
  // 此时stack2就是我们之前默认放置的一项了,此时要返回这一项的children即可
  return stack2[0].children[0];
}
