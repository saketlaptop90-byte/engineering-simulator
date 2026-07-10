import * as THREE from 'three';

export function createBoronAtomicRadius() {
  const group = new THREE.Group();
  
  // Volumetric boundary shader
  const vertexShader = \`
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`;
  
  const fragmentShader = \`
    varying vec3 vNormal;
    void main() {
      float fresnel = dot(vec3(0,0,1), vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 3.0);
      gl_FragColor = vec4(0.0, 0.5, 1.0, fresnel * 0.8 + 0.1);
    }
  \`;

  const mat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  
  // Neutral Boron (85 pm scaled to 3.0 units)
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(3.0, 64, 64), mat);
  group.add(sphere);
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  
  // Ruler
  const rulerGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(3.0,0,0)]);
  group.add(new THREE.Line(rulerGeo, new THREE.LineBasicMaterial({color: 0xffffff})));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      sphere.scale.setScalar(1.0 + Math.sin(time*5)*0.02); // slight pulse
  };

${infoBlock}
  return group;
}
