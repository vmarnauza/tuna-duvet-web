import { useCallback, useEffect, useRef } from "react";

export default function Background() {
  const firstRenderDone = useRef(false);

  const handleResize = useCallback(() => {
    initBackground();
  }, []);

  useEffect(() => {
    if (!firstRenderDone.current) {
      initBackground();
      window.addEventListener("resize", handleResize);
      firstRenderDone.current = true;
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div
      id="background"
      className="w-screen h-screen fixed left-0 top-0 -z-10 overflow-hidden"
    ></div>
  );
}

function initBackground() {
  const canvas = document.createElement("canvas");
  const startTime = new Date().getTime(); // Get start time for animating
  let currentTime = 0;
  const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

  if (!gl) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // give WebGL it's viewport
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // kind of back-end stuff
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  ); // ^^ That up there sets up the vertex's used to draw onto. I think at least, I haven't payed much attention to vertex's yet, for all I know I'm wrong.

  const vertexShader = gl.createShader(gl.VERTEX_SHADER); //create the vertex shader from script
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //create the fragment from script
  const program = gl.createProgram(); // create the WebGL program.  This variable will be used to inject our javascript variables into the program.

  if (!vertexShader || !fragmentShader || !program) return;

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  gl.attachShader(program, vertexShader); // add the shaders to the program
  gl.attachShader(program, fragmentShader); // ^^
  gl.linkProgram(program); // Tell our WebGL application to use the program
  gl.useProgram(program); // ^^ yep, but now literally use it.

  /* 
	
	Alright, so here we're attatching javascript variables to the WebGL code.  First we get the location of the uniform variable inside the program. 
	
	We use the gl.getUniformLocation function to do this, and pass thru the program variable we created above, as well as the name of the uniform variable in our shader.
	
	*/
  const locationOfResolution = gl.getUniformLocation(program, "u_resolution");
  const locationOfTime = gl.getUniformLocation(program, "u_time");

  /*
	
	Then we simply apply our javascript variables to the program. 
	Notice, it gets a bit tricky doing this.  If you're editing a float value, gl.uniformf works. 
	
	But if we want to send over an array of floats, for example, we'd use gl.uniform2f.  We're specifying that we are sending 2 floats at the end.  
	
	You can also send it over to the program as a vector, by using gl.uniform2fv.
	To read up on all of the different gl.uniform** stuff, to send any variable you want, I'd recommend using the table (found on this site, but you need to scroll down about 300px) 
	
	https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html#uniforms
	
	*/
  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
  gl.uniform1f(locationOfTime, currentTime);

  const render = () => {
    const now = new Date().getTime();
    currentTime = (now - startTime) / 1000; // update the current time for animations

    gl.uniform1f(locationOfTime, currentTime); // update the time uniform in our shader

    window.requestAnimationFrame(render); // request the next frame

    const positionLocation = gl.getAttribLocation(program, "a_position"); // do stuff for those vertex's
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const background = document.getElementById("background");
  background?.children[0]?.remove();
  background?.appendChild(canvas);

  render();
}

const fragmentShaderSource = `
#ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.14159265359;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_xpos;
  uniform float u_ypos;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec3 color1 = vec3(75.0/255.0,144.0/255.0,210.0/255.0);
  vec3 color2 = vec3(252.0/255.0,244.0/255.0,111.0/255.0);
  vec3 color3 = vec3(244.0/255.0,238.0/255.0,87.0/255.0);
  vec3 color4 = vec3(242.0/255.0,232.0/255.0,99.0/255.0);
  vec3 color5 = vec3(242.0/255.0,205.0/255.0,96.0/255.0);
  vec3 color6 = vec3(255.0/255.0,255.0/255.0,255.0/255.0);
  vec2 lt = vec2(gl_FragCoord.x + u_xpos, gl_FragCoord.y + u_ypos);
  vec2 st = lt.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  vec2 pos = vec2(st*0.6);
  float DF = 0.0;
  float a = 0.0;
  vec2 vel = vec2(u_time*.1);
  st.xy *= 0.4;
  float r = snoise(vec3(st.x,st.y,u_time * 0.1));
  
if(r > 0.60){
  color = color5;
} else if(r > 0.20){
  color = color4;
} else if(r > -0.20){
  color = color3;
} else if(r > -0.60){
  color = color2;
} else if(r > -2.0){
  color = color1;
}
  
gl_FragColor = vec4(color,1.0);
}
`;

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;
