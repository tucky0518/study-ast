import parse from './parse.js';
var templateStr = `
<div>
  <h3 class="box hh" id="myBox" data-n="5">hello</h3>
  <ul>
    <li>aaa</li>
    <li>bbb</li>
    <li>ccc</li>
  </ul>
</div>
`;

const ast = parse(templateStr);
console.log(ast);
