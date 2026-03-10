/* ================================================================
   FICHIER — index-shader.js
   Shader WebGL pour l'arrière-plan de la section manifeste.
   IIFE auto-exécuté, aucune dépendance externe.

   OPTIMISÉ v2 (GPU Intel UHD) :
   - Résolution rendu ÷2 (CSS upscale, 4x moins de pixels)
   - Lignes réduites de 16 à 8 (2x moins de calculs/pixel)
   - Cadencé à 30fps au lieu de 60fps
   ================================================================ */
!function(){
  var canvas = document.getElementById('manifeste-shader-canvas');
  var section = canvas && canvas.closest('.manifeste-section');
  if (!canvas || !section) return;

  var RENDER_SCALE = 0.5;  // rendu à 50% de la résolution réelle
  var TARGET_FPS   = 30;
  var FRAME_TIME   = 1000 / TARGET_FPS;

  var gl = null, programInfo = null, positionBuffer = null;
  var startTime = 0, animId = null, initialized = false;
  var lastFrameTime = 0;

  function initShader() {
    if (initialized) return;
    gl = canvas.getContext('webgl', { alpha: true, powerPreference: 'low-power' });
    if (!gl) return;

    var vsSource = 'attribute vec4 aVertexPosition;void main(){gl_Position=aVertexPosition;}';
    var fsSource = [
      'precision mediump float;',
      'uniform vec2 iResolution;',
      'uniform float iTime;',
      'const float overallSpeed=0.2;',
      'const float gridSmoothWidth=0.015;',
      'const float axisWidth=0.05;',
      'const float majorLineWidth=0.025;',
      'const float minorLineWidth=0.0125;',
      'const float majorLineFrequency=5.0;',
      'const float minorLineFrequency=1.0;',
      'const float scale=5.0;',
      'const vec4 lineColor=vec4(0.3,0.15,0.7,1.0);',
      'const float minLineWidth=0.01;',
      'const float maxLineWidth=0.2;',
      'const float lineSpeed=1.0*overallSpeed;',
      'const float lineAmplitude=1.0;',
      'const float lineFrequency=0.2;',
      'const float warpSpeed=0.2*overallSpeed;',
      'const float warpFrequency=0.5;',
      'const float warpAmplitude=1.0;',
      'const float offsetFrequency=0.5;',
      'const float offsetSpeed=1.33*overallSpeed;',
      'const float minOffsetSpread=0.6;',
      'const float maxOffsetSpread=2.0;',
      'const int linesPerGroup=8;',   // réduit de 16 à 8
      '#define drawSmoothLine(pos,halfWidth,t) smoothstep(halfWidth,0.0,abs(pos-(t)))',
      '#define drawCrispLine(pos,halfWidth,t) smoothstep(halfWidth+gridSmoothWidth,halfWidth,abs(pos-(t)))',
      '#define drawCircle(pos,radius,coord) smoothstep(radius+gridSmoothWidth,radius,length(coord-(pos)))',
      'float random(float t){return(cos(t)+cos(t*1.3+1.3)+cos(t*1.4+1.4))/3.0;}',
      'float getPlasmaY(float x,float hf,float o){return random(x*lineFrequency+iTime*lineSpeed)*hf*lineAmplitude+o;}',
      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/iResolution.xy;',
      '  vec2 space=(gl_FragCoord.xy-iResolution.xy/2.0)/iResolution.x*2.0*scale;',
      '  float hf=1.0-(cos(uv.x*6.28)*0.5+0.5);',
      '  float vf=1.0-(cos(uv.y*6.28)*0.5+0.5);',
      '  space.y+=random(space.x*warpFrequency+iTime*warpSpeed)*warpAmplitude*(0.5+hf);',
      '  space.x+=random(space.y*warpFrequency+iTime*warpSpeed+2.0)*warpAmplitude*hf;',
      '  vec4 lines=vec4(0.0);',
      '  vec4 bg1=vec4(0.04,0.06,0.18,1.0);',
      '  vec4 bg2=vec4(0.12,0.04,0.22,1.0);',
      '  for(int l=0;l<linesPerGroup;l++){',
      '    float nli=float(l)/float(linesPerGroup);',
      '    float ot=iTime*offsetSpeed;',
      '    float op=float(l)+space.x*offsetFrequency;',
      '    float rnd=random(op+ot)*0.5+0.5;',
      '    float hw=mix(minLineWidth,maxLineWidth,rnd*hf)/2.0;',
      '    float off=random(op+ot*(1.0+nli))*mix(minOffsetSpread,maxOffsetSpread,hf);',
      '    float lp=getPlasmaY(space.x,hf,off);',
      '    float line=drawSmoothLine(lp,hw,space.y)/2.0+drawCrispLine(lp,hw*0.15,space.y);',
      '    float cx=mod(float(l)+iTime*lineSpeed,25.0)-12.0;',
      '    vec2 cp=vec2(cx,getPlasmaY(cx,hf,off));',
      '    line+=drawCircle(cp,0.01,space)*4.0;',
      '    lines+=line*lineColor*rnd;',
      '  }',
      '  gl_FragColor=mix(bg1,bg2,uv.x)*vf;',
      '  gl_FragColor.a=1.0;',
      '  gl_FragColor+=lines;',
      '}'
    ].join('\n');

    function loadShader(type, source) {
      var s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    var vs = loadShader(gl.VERTEX_SHADER, vsSource);
    var fs = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    programInfo = {
      program: program,
      aPos: gl.getAttribLocation(program, 'aVertexPosition'),
      uRes: gl.getUniformLocation(program, 'iResolution'),
      uTime: gl.getUniformLocation(program, 'iTime')
    };

    startTime = Date.now();
    initialized = true;
  }

  function resizeCanvas() {
    if (!gl) return;
    // rendu à résolution réduite (CSS s'occupe de l'upscale via width/height 100%)
    canvas.width  = Math.round(section.offsetWidth * RENDER_SCALE);
    canvas.height = Math.round(section.offsetHeight * RENDER_SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render() {
    if (!initialized || !gl) return;

    // throttle à 30fps — skip les frames trop rapprochées
    var now = performance.now();
    var delta = now - lastFrameTime;
    if (delta < FRAME_TIME) {
      animId = requestAnimationFrame(render);
      return;
    }
    lastFrameTime = now - (delta % FRAME_TIME);

    var t = (Date.now() - startTime) / 1000;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(programInfo.program);
    gl.uniform2f(programInfo.uRes, canvas.width, canvas.height);
    gl.uniform1f(programInfo.uTime, t);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.aPos);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animId = requestAnimationFrame(render);
  }

  function start() {
    if (!initialized) { initShader(); resizeCanvas(); }
    if (initialized && !animId) {
      lastFrameTime = performance.now();
      animId = requestAnimationFrame(render);
    }
  }

  function stop() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  // Only render when manifeste section is visible
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { rootMargin: '100px' });
    obs.observe(section);
  }

  window.addEventListener('resize', function() { if (initialized) resizeCanvas(); });
}();
