const { observable, effect ,Reaction} = require("../dist/how-long-till-lunch.cjs");

class Person {
  // @observable
  name = "lihaonan";
  // @observable
  sex = "man";
  age = 22;
  aaaaaa= {aa:1};
}
const person = {
  age : 22,
  aaa: {aa:1}
}

let reaction = new Reaction();

new Proxy(person,{
  get(target, key) {
    debugger
    reaction.collect();
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    // 对于数组的值设置处理: 当对数组进行观察监听时，由于对数组的操作会有两步执行:
    // 更新数组元素值
    // 更改数组的length属性，所以需要将更改length属性的操作给拦截，避免一次操作数组，多次触发handler
    if (key === "length") return true;
    let r = Reflect.set(target, key, value);
    reaction.run();
    return r;
  }
  })

effect(() => {
  console.log("autorun", person.age);
  // console.log('autorun', person.age);
});
effect(() => {
  console.log("autorun", person.aaaaaa);
  // console.log('autorun', person.age);
});
person.aaaaaa = {aa:2};
console.log("111111", person.aaaaaa);
// person.sex = 'woman';
// person.age = 23;

person.name = "dashuaige";