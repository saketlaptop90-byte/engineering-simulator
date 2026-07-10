import * as THREE from 'three';

export function createBoronElectronDensity() {
  const group = new THREE.Group();
  
  // 100,000 points mapped via Gaussian PDF
  const particleCount = 100000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorHot = new THREE.Color(0xffffff);
  const colorMid = new THREE.Color(0x00aaff);
  const colorCold = new THREE.Color(0x000033);
  const tempColor = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
      // Box-Muller transform for normal/gaussian distribution
      let u1 = Math.random();
      let u2 = Math.random();
      let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      let z2 = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
      
      // Standard deviation determines cloud size
      const sigma = 1.2;
      const x = z0 * sigma;
      const y = z1 * sigma;
      const z = z2 * sigma;
      
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      
      const dist = Math.sqrt(x*x + y*y + z*z);
      
      // Map color based on density (closer = denser)
      if (dist < 0.5) {
          tempColor.copy(colorHot);
      } else if (dist < 2.0) {
          const ratio = (dist - 0.5) / 1.5;
          tempColor.copy(colorHot).lerp(colorMid, ratio);
      } else {
          const ratio = Math.min((dist - 2.0) / 2.0, 1.0);
          tempColor.copy(colorMid).lerp(colorCold, ratio);
      }
      
      colors[i*3] = tempColor.r;
      colors[i*3+1] = tempColor.g;
      colors[i*3+2] = tempColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);

  group.userData.animate = function(delta, time) {
      points.rotation.y += delta * 0.2;
      points.rotation.x = Math.sin(time*0.2)*0.3;
  };

${infoBlockNew}
  return group;
}
