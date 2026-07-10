import * as THREE from 'three';

export function createBoronElectronProtonInteraction() {
  const group = new THREE.Group();
  
  // Nucleus
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    new THREE.MeshStandardMaterial({color: 0xff4444, emissive: 0xff0000, emissiveIntensity: 0.5})
  ));
  
  // Electric Field Lines (Shader)
  const vertexShader = \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`;

  const fragmentShader = \`
    uniform float time;
    varying vec2 vUv;
    void main() {
      // Create radial lines flowing inwards
      vec2 center = vec2(0.5);
      vec2 pos = vUv - center;
      float dist = length(pos);
      float angle = atan(pos.y, pos.x);
      
      // Flowing dashed lines
      float lines = sin(angle * 30.0);
      float flow = fract(dist * 10.0 + time * 2.0);
      
      float intensity = smoothstep(0.8, 1.0, lines) * smoothstep(0.4, 0.6, flow);
      intensity *= smoothstep(0.5, 0.1, dist); // fade at edges
      
      gl_FragColor = vec4(1.0, 0.2, 0.2, intensity * 0.8);
    }
  \`;

  const fieldMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: vertexShader, fragmentShader: fragmentShader,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });

  const field = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), fieldMat);
  group.add(field);

  // 5 Electrons being pulled
  const electrons = [];
  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({color: 0x00aaff});
  
  for(let i=0; i<5; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      group.add(e);
      electrons.push({ mesh: e, angle: (Math.PI*2/5)*i, dist: 2.0 + Math.random(), speed: 0.5 + Math.random()*0.5 });
  }

  group.add(new THREE.AmbientLight(0xffffff, 1.0));

  group.userData.animate = function(delta, time) {
      fieldMat.uniforms.time.value = time;
      field.lookAt(window.camera ? window.camera.position : new THREE.Vector3(0,0,10));
      
      electrons.forEach(e => {
          e.angle += delta * e.speed;
          // Spring-like oscillation around distance 2
          const currentDist = e.dist + Math.sin(time * 3.0 + e.angle) * 0.5;
          e.mesh.position.x = Math.cos(e.angle) * currentDist;
          e.mesh.position.y = Math.sin(e.angle) * currentDist;
      });
  };

${infoBlock}
  return group;
}
