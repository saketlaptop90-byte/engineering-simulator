import * as THREE from 'three';

export function createBoronElectronElectronRepulsion() {
  const group = new THREE.Group();
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  // Instanced Mesh for electrons
  const count = 5;
  const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({color: 0x00ffff}),
      count
  );
  group.add(mesh);
  
  // Physics simulation data
  const particles = [];
  for(let i=0; i<count; i++) {
      particles.push({
          pos: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4),
          vel: new THREE.Vector3(0,0,0)
      });
  }

  // Visual Repulsion Lines
  const lineMat = new THREE.LineBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.5});
  const lines = new THREE.LineSegments(new THREE.BufferGeometry(), lineMat);
  group.add(lines);

  const dummy = new THREE.Object3D();
  
  group.userData.animate = function(delta, time) {
      const linePositions = [];
      
      // Simple physics: Nucleus pulls them in, Electrons push each other away
      for(let i=0; i<count; i++) {
          const p1 = particles[i];
          const force = new THREE.Vector3();
          
          // Pull to center
          const distToCenter = p1.pos.length();
          force.copy(p1.pos).normalize().multiplyScalar(-5.0 / (distToCenter * distToCenter + 0.1));
          
          // Repel from others
          for(let j=0; j<count; j++) {
              if (i === j) continue;
              const p2 = particles[j];
              const diff = new THREE.Vector3().subVectors(p1.pos, p2.pos);
              const dist = diff.length();
              
              if (dist < 2.0) {
                  // Strong repulsion if close
                  force.add(diff.normalize().multiplyScalar(4.0 / (dist * dist + 0.1)));
                  // Draw repulsion line
                  linePositions.push(p1.pos.x, p1.pos.y, p1.pos.z);
                  linePositions.push(p2.pos.x, p2.pos.y, p2.pos.z);
              }
          }
          
          // Update velocity and position
          p1.vel.add(force.multiplyScalar(delta));
          p1.vel.multiplyScalar(0.95); // friction/damping to prevent exploding
          
          // Centrifugal component to keep them orbiting
          const tangent = new THREE.Vector3(-p1.pos.z, 0, p1.pos.x).normalize().multiplyScalar(2.0);
          p1.vel.add(tangent.multiplyScalar(delta));
          
          p1.pos.add(p1.vel.clone().multiplyScalar(delta));
          
          dummy.position.copy(p1.pos);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
      }
      
      mesh.instanceMatrix.needsUpdate = true;
      lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      
      group.rotation.y += delta * 0.1;
  };

${infoBlock}
  return group;
}
