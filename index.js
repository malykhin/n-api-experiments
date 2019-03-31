const addon = require('./build/Release/module.node')
const path = require('path')
const cv = require('opencv.js')
const jpeg = require('jpeg-js')
const fs = require('fs')

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
for (let i = 0; i < sortedArrayJSBubble.length - 1; ++i) {
  for (let j = 0; j < sortedArrayJSBubble.length - 1 - i; ++j) {
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
const sortedArrayCbubble = addon.sort(targetArray, BUBBLE_SORT)
console.timeEnd('N-API bubble sort')
console.log(`sortedArrayCbubble length: ${sortedArrayCbubble.length}`)

console.time('N-API quick sort')
const sortedArrayCquick = addon.sort(targetArray, QUICK_SORT)
console.timeEnd('N-API quick sort')
console.log(`sortedArrayCquick length: ${sortedArrayCquick.length}`)

console.time('opencv to B&W')
addon.toGrayScale(path.join(__dirname, 'Lenna2048.jpg'), path.join(__dirname, 'Lenna-bw-n-api.jpg'))
console.timeEnd('opencv to B&W')

console.time('opencv.js to B&W')
const inJpegData = fs.readFileSync(path.join(__dirname, 'Lenna2048.jpg'))
const rawData = jpeg.decode(inJpegData)

const img = cv.matFromImageData(rawData)
cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY)
const outImg = new cv.Mat()
cv.cvtColor(img, outImg, cv.COLOR_GRAY2RGBA)

const outData = {
  data: outImg.data,
  width: outImg.size().width,
  height: outImg.size().height,
}
const outJpegData = jpeg.encode(outData, 50)

fs.writeFileSync(path.join(__dirname, 'Lenna-bw-opencv-js.jpg'), outJpegData.data)
console.timeEnd('opencv.js to B&W')

const x = 256
const y = 256

console.time('opencv resize')
addon.resize(path.join(__dirname, 'Lenna.jpg'), path.join(__dirname, 'Lenna-resize-n-api.jpg'), x, y)
console.timeEnd('opencv resize')

console.time('opencv.js resize')
const inJpegDataResize = fs.readFileSync(path.join(__dirname, 'Lenna.jpg'))
const rawDataResize = jpeg.decode(inJpegDataResize)

const imgResize = cv.matFromImageData(rawDataResize)

const outImgResize = new cv.Mat()
const sizeResize = new cv.Size(x, y)
cv.resize(imgResize, outImgResize, sizeResize)

const outDataResize = {
  data: outImgResize.data,
  width: outImgResize.size().width,
  height: outImgResize.size().height,
}
const outJpegDataResize = jpeg.encode(outDataResize, 50)

fs.writeFileSync(path.join(__dirname, 'Lenna-resize-opencv-js.jpg'), outJpegDataResize.data)
console.timeEnd('opencv.js resize')
