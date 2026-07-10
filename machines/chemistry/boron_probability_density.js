import * as THREE from 'three';

export function createBoronProbabilityDensity() {
  const group = new THREE.Group();
  
  // Create a volumetric cube that runs a custom shader
  // It only renders pixels that intersect with a scanning Y plane
  
  const vertexShader = \`
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  \`;

  const fragmentShader = \`
    uniform float scanY;
    varying vec3 vWorldPosition;
    
    // Fake a 2D PDF contour map
    void main() {
      // Only render if within a narrow band of the scanY plane
      float distToPlane = abs(vWorldPosition.y - scanY);
      if (distToPlane > 0.05) discard;
      
      // Calculate 2D distance from center axis
      float r = length(vWorldPosition.xz);
      
      // Probability Density Function (Fake 1s + 2s + 2p combo)
      float pdf = 0.0;
      pdf += exp(-r * 3.0) * 2.0; // tight core (1s)
      pdf += exp(-abs(r - 1.5) * 2.0) * 0.8; // outer ring (2s)
      
      // Contour mapping (banding)
      float bands = mod(pdf * 10.0, 1.0);
      float alpha = smoothstep(0.4, 0.5, bands);
      
      // Color map: red high, blue low
      vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), clamp(pdf, 0.0, 1.0));
      
      gl_FragColor = vec4(color, alpha * 0.8);
    }
  \`;

  const mat = new THREE.ShaderMaterial({
      uniforms: { scanY: { value: 0 } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
  });

  // A large box that we slice through
  const box = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), mat);
  group.add(box);
  
  // Add a visual glowing frame for the scanning plane
  const planeFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(6, 6)),
      new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5})
  );
  planeFrame.rotation.x = Math.PI/2;
  group.add(planeFrame);

  group.userData.animate = function(delta, time) {
      // Oscillate scanner up and down
      const y = Math.sin(time) * 2.5;
      mat.uniforms.scanY.value = y;
      planeFrame.position.y = y;
      
      // Slowly rotate the whole volume
      box.rotation.y += delta * 0.3;
  };

${infoBlockNew}
  return group;
}
