export function omit(obj, keys) {
  const result = { ...obj }; // 创建对象的浅拷贝
  for (const key of keys) {
    delete result[key]; // 删除指定的属性
  }
  return result;
}
