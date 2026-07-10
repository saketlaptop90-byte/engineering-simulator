import * as THREE from 'three';

export function createBoronQuantumMechanicalModel() {
  const group = new THREE.Group();
  
  // Custom GLSL Volumetric Shader
  const vertexShader = \`
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`;

  const fragmentShader = \`
    uniform float time;
    uniform vec3 baseColor;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    ${noiseShaderCode}
    
    void main() {
      // Create a pulsating, noisy field
      float noiseVal = cnoise(vPosition * 2.0 + time * 0.5);
      float intensity = (noiseVal + 1.0) * 0.5; // 0 to 1
      
      // Fresnel effect for volumetric look (fades at edges)
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = max(0.0, fresnel);
      
      float alpha = intensity * fresnel * 0.8;
      
      // Discard very low probability areas
      if (alpha < 0.1) discard;
      
      vec3 color = mix(baseColor, vec3(1.0, 1.0, 1.0), intensity * 0.5);
      gl_FragColor = vec4(color, alpha);
    }
  \`;

  // 1s orbital (dense small core)
  const mat1s = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, baseColor: { value: new THREE.Color(0xff0044) } },
    vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });
  const orb1s = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), mat1s);
  group.add(orb1s);
  
  // 2s orbital (larger diffuse)
  const mat2s = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, baseColor: { value: new THREE.Color(0x00ff88) } },
    vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });
  const orb2s = new THREE.Mesh(new THREE.SphereGeometry(2.5, 64, 64), mat2s);
  group.add(orb2s);

  // 2p orbital (dumbbell)
  const mat2p = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, baseColor: { value: new THREE.Color(0x0088ff) } },
    vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });
  const pGeo = new THREE.SphereGeometry(1.2, 64, 64);
  pGeo.scale(1, 1, 2);
  const pLobe1 = new THREE.Mesh(pGeo, mat2p); pLobe1.position.z = 1.5; group.add(pLobe1);
  const pLobe2 = new THREE.Mesh(pGeo, mat2p); pLobe2.position.z = -1.5; group.add(pLobe2);
  
  group.userData.animate = function(delta, time) {
      group.rotation.x += delta * 0.1;
      group.rotation.y += delta * 0.2;
      
      mat1s.uniforms.time.value = time;
      mat2s.uniforms.time.value = time;
      mat2p.uniforms.time.value = time;
  };

${infoBlockQuantum}
  return group;
}
