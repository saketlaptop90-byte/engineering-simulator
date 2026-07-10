import * as THREE from 'three';

export function createBoronElectronCloud() {
  const group = new THREE.Group();
  
  const vertexShader = \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`;

  // FBM (Fractional Brownian Motion) Shader for Plasma
  const fragmentShader = \`
    uniform float time;
    varying vec2 vUv;
    
    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // FBM
    float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 5; i++) {
            f += w * snoise(p);
            p *= 2.0;
            w *= 0.5;
        }
        return f;
    }
    
    void main() {
        vec2 uv = vUv * 3.0;
        float q = fbm(uv + time * 0.2);
        vec2 r = vec2(fbm(uv + q + time * 0.3 - uv.x - uv.y), fbm(uv + q - time * 0.4));
        float c = fbm(uv + r * 2.0);
        
        vec3 color = mix(vec3(0.1, 0.0, 0.5), vec3(0.0, 0.8, 1.0), clamp(c*c*4.0,0.0,1.0));
        color = mix(color, vec3(1.0, 1.0, 1.0), clamp(r.x,0.0,1.0));
        
        // Sphere mask mapping
        float dist = distance(vUv, vec2(0.5));
        float alpha = smoothstep(0.5, 0.3, dist);
        
        gl_FragColor = vec4(color, alpha * c);
    }
  \`;

  const mat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 32, 32), mat);
  // Keep it facing camera like a billboard
  group.add(mesh);

  group.userData.animate = function(delta, time) {
      mat.uniforms.time.value = time;
      // Billboard to camera is usually done in render loop, but we can fake it by just not rotating the parent
  };

${infoBlockNew}
  return group;
}
