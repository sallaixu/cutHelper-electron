export function containsIgnoreCase(str, searchStr) {
    if (searchStr === null) return true;
    // 创建一个忽略大小写的正则表达式
    const regex = new RegExp(searchStr, 'i');
    
    // 使用 test 方法进行判断
    return regex.test(str);
}