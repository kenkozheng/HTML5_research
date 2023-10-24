"use strict";

/**
 * 加载3张同样宽高的图，用 canvas 绘制到一起，形成一张大图，通过 texImage3D 传给 sampler2DArray。这个 sampler2DArray 跟普通 sampler2D 都只是占一个纹理寄存器，并不是一次传给多个寄存器。
 * void main() {
 *    outColor = texture(u_image, v_texCoord);
 * }
 * 再通过 texture 方法传入一个 vec3（普通纹理是 vec2），多出来的第三个数就是索引第几张图
 */

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d-array", "fragment-shader-2d-array"]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var imageLocation = gl.getUniformLocation(program, "u_image");

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  var count = 3000;

  // 顶点坐标数组
  gl.enableVertexAttribArray(positionAttributeLocation);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var vertexArray = [];
  for (var i = 0; i < count; ++i) {
    vertexArray = vertexArray.concat(setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300)));
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // 顶点纹理坐标数组
  gl.enableVertexAttribArray(texcoordLocation);
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  const texcoordArray = [];
  for (let i = 0; i < count; i++) {
    texcoordArray.push(
      0,  0,  i % 3,
      1,  0,  i % 3,
      0,  1,  i % 3,
      1,  1,  i % 3
    );
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordArray), gl.STATIC_DRAW);
  // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  var size = 3;          // components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

  // index buffer 初始化
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [];
  for (let i = 0; i < count; i++) {
    const base = i * 4;
    indices.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
  }
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1i(imageLocation, 0);

  // code above this line is initialization code
  // --------------------------------
  // code below this line is rendering code

  loadImageAndCreateTextureInfo(gl, [
    '../res/star.jpg',
    '../res/leaves.jpg',
    '../res/keyboard.jpg',
  ]);
  var fpsCount = 0;
  var lastTime = Date.now();
  var consoleDiv = document.getElementById('consoleDiv');
  requestAnimationFrame(function onFrame() {
    // Draw the rectangle. 控制如何从 index buffer 中取数
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var indexCount = 6 * count;
    var indexType = gl.UNSIGNED_SHORT;
    gl.drawElements(primitiveType, indexCount, indexType, offset);
    fpsCount++;
    if (Date.now() - lastTime >= 1000) {
      lastTime = Date.now();
      consoleDiv.innerText = fpsCount;
      fpsCount = 0;
    }
    requestAnimationFrame(onFrame);
  });
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x2, y2,
  ];
}

function loadImageAndCreateTextureInfo(gl, urls) {
  loadImages(urls, function(imgs) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    /**
     * 多个宽高相同的纹理合到一个图，一次推送到纹理缓存
     */
    // 把3个同宽高的图画到 canvas 上，一次推送 sampler2DArray
    // var canvas = document.createElement('canvas');
    // canvas.width = imgs[0].width;
    // canvas.height = imgs[0].height * imgs.length;
    // var ctx = canvas.getContext('2d');
    // for (let i = 0; i < imgs.length; i++) {
    //   ctx.drawImage(imgs[i], 0, imgs[0].height * i);
    // }
    // var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // var pixels = new Uint8Array(imageData.data.buffer);
    // gl.texImage3D(
    //   gl.TEXTURE_2D_ARRAY,
    //   0, // level 暂时不知道什么地方会用到
    //   gl.RGBA, // internalFormat
    //   imgs[0].width, // width
    //   imgs[0].height, // height
    //   imgs.length, // depth 多少个纹理
    //   0, // border
    //   gl.RGBA, // format
    //   gl.UNSIGNED_BYTE, // type
    //   pixels
    // );

    // 利用 texImage3D 设定空间，再用 texSubImage3D 设置图片。texImage3D 创建空间时，宽高设定很重要，后续的尺寸不能超过这个尺寸。如果后续尺寸比这个小，会导致渲染时图片偏小，也很好理解，因为 subImage 传递的只是左上角一小部分的图片，其他面积为空白。
    gl.texImage3D(
      gl.TEXTURE_2D_ARRAY,
      0, // level 暂时不知道什么地方会用到
      gl.RGBA, // internalFormat
      imgs[0].width, // width
      imgs[0].height, // height
      imgs.length, // depth 多少个纹理
      0, // border
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      null
    );
    /**
     * 用 texStorage3D 搭配 texSubImage3D 也可以。但这里需要时 RGBA8 不是 RGBA。
     * 因为选项里边没有 RGBA https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D
     * 另外，这里不是指输入图片的格式，是指把图片转为什么格式存储。
     * texImage3D 的 gl.RGBA 默认情况下跟 gl.RGBA8 一致
     */
    // gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, imgs[0].width, imgs[0].height,3);
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0, // level 暂时不知道什么地方会用到
      0, // x offset
      0, // y offset
      0, // z offset 不能超过前边预留的 depth
      imgs[0].width, // width
      imgs[0].height, // height
      1, // depth 多少个纹理
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      imgs[0]
    );
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0, // level 暂时不知道什么地方会用到
      0,
      0,
      1,
      imgs[0].width, // width
      imgs[0].height, // height
      1, // depth 多少个纹理
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      imgs[1]
    );
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0, // level 暂时不知道什么地方会用到
      0,
      0,
      2,
      imgs[0].width, // width
      imgs[0].height, // height
      1, // depth 多少个纹理
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      imgs[2]
    );
  });
}

function loadImage(url, onload) {
  var img = new Image();
  img.src = url;
  img.onload = function() {
    onload(img);
  };
  return img;
}

function loadImages(urls, onload) {
  var imgs = [];
  var imgsToLoad = urls.length;

  function onImgLoad() {
    if (--imgsToLoad <= 0) {
      onload(imgs);
    }
  }

  for (var i = 0; i < imgsToLoad; ++i) {
    imgs.push(loadImage(urls[i], onImgLoad));
  }
}

main();
