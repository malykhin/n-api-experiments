const addon = require('./build/Release/module.node')
const Jimp = require('jimp')
const path = require('path')

const QUICK_SORT = 0
const BUBBLE_SORT = 1
const ARRAY_LENGTH = 1000

const targetArray = Array(ARRAY_LENGTH)
  .fill(null)
  .map(() => Math.round(Math.random() * 1000))
  
const sortedArrayJSBubble = [...targetArray]


console.time('JS native (quick) sort')
const sortedArrayJS = targetArray.sort()
console.timeEnd('JS native (quick) sort')
console.log(`sortedArrayJS length: ${sortedArrayJS.length}`)


console.time('JS for bubble sort')
for (let i = 0; i < (sortedArrayJSBubble.length - 1); ++i) {
  for (let j = 0; j < sortedArrayJSBubble.length - 1 - i; ++j ) {
    if (sortedArrayJSBubble[j] > sortedArrayJSBubble[j + 1]) {
      const temp = sortedArrayJSBubble[j + 1]
      sortedArrayJSBubble[j + 1] = sortedArrayJSBubble[j]
      sortedArrayJSBubble[j] = temp
    }
  }
}
console.timeEnd('JS for bubble sort')
console.log(`sortedArrayJSBubble length: ${sortedArrayJSBubble.length}`)


console.time('N-API bubble sort')
const sortedArrayCbubble =  addon.sort(targetArray, BUBBLE_SORT)
console.timeEnd('N-API bubble sort')
console.log(`sortedArrayCbubble length: ${sortedArrayCbubble.length}`)


console.time('N-API quick sort')
const sortedArrayCquick =  addon.sort(targetArray, QUICK_SORT)
console.timeEnd('N-API quick sort')
console.log(`sortedArrayCquick length: ${sortedArrayCquick.length}`)


console.time('Jimp to B&W')
Jimp.read('Lenna.png')
  .then(lenna => {
    return lenna
      .greyscale()
      .write('Lenna-bw-jimp.png')
  })
  .then(() => console.timeEnd('Jimp to B&W'))


console.time('opencv to B&W')
addon.toGrayScale(path.join(__dirname, 'Lenna.png'), path.join(__dirname, 'Lenna-bw-n-api.png'))
console.timeEnd('opencv to B&W')


const x = 512
const y = 512

console.time('Jimp resize')
Jimp.read('Lenna.png')
  .then(lenna => {
    return lenna
      .resize(x, y)
      .write('Lenna-resize-jimp.png')
  })
  .then(() => console.timeEnd('Jimp resize'))


console.time('opencv resize')
addon.resize(path.join(__dirname, 'Lenna.png'), path.join(__dirname, 'Lenna-resize-n-api.png'), x, y)
console.timeEnd('opencv resize')
