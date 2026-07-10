import * as THREE from 'three';

export function createBoronRutherfordModel() {
  const group = new THREE.Group();
  
  // Blazing nucleus
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffaa00, emissiveIntensity: 2.0})
  );
  group.add(nucleus);
  
  const pointLight = new THREE.PointLight(0xffaa00, 2, 10);
  group.add(pointLight);
  
  // 10,000 Electrons via InstancedMesh
  const particleCount = 10000;
  const eGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff, blending: THREE.AdditiveBlending});
  
  const instancedMesh = new THREE.InstancedMesh(eGeo, eMat, particleCount);
  group.add(instancedMesh);
  
  // Pre-calculate random orbital parameters for each particle
  const pData = [];
  for(let i=0; i<particleCount; i++) {
      pData.push({
          radiusX: 1.0 + Math.random() * 4.0,
          radiusZ: 1.0 + Math.random() * 4.0,
          speed: 1.0 + Math.random() * 3.0,
          rotX: Math.random() * Math.PI * 2,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          offset: Math.random() * Math.PI * 2
      });
  }

  const dummy = new THREE.Object3D();

  group.userData.animate = function(delta, time) {
      nucleus.scale.setScalar(1.0 + Math.sin(time*10)*0.05); // pulsating core
      
      // Update 10,000 particles
      for(let i=0; i<particleCount; i++) {
          const pd = pData[i];
          const t = time * pd.speed + pd.offset;
          
          // Base elliptical position
          const px = Math.cos(t) * pd.radiusX;
          const pz = Math.sin(t) * pd.radiusZ;
          
          dummy.position.set(px, 0, pz);
          // Apply random orbital plane rotation
          dummy.rotation.set(pd.rotX, pd.rotY, pd.rotZ);
          
          // Update matrix
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      
      group.rotation.y += delta * 0.1;
  };

${infoBlockRutherford}
  return group;
}
