import * as THREE from 'three';
export function createBoronProtons() {
  const group = new THREE.Group();
  
  // 5 Protons Violently repelling
  
  const protonMat = new THREE.MeshPhysicalMaterial({
      color: 0xff0000, metalness: 0.3, roughness: 0.1, clearcoat: 1.0, emissive: 0xaa0000, emissiveIntensity: 0.5
  });
  
  const protons = [];
  for(let i=0; i<5; i++) {
      const p = new THREE.Group();
      
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 64), protonMat);
      p.add(mesh);
      
      // Repulsion force field (additive pulse)
      const field = new THREE.Mesh(
          new THREE.SphereGeometry(1.5, 32, 32),
          new THREE.MeshBasicMaterial({color: 0xff4444, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending})
      );
      p.add(field);
      
      p.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
      group.add(p);
      protons.push({grp: p, mesh, field, vel: new THREE.Vector3(0,0,0)});
  }
  
  const pLight = new THREE.PointLight(0xff0000, 3, 20);
  group.add(pLight);

  // Lightning arcs between protons showing extreme repulsive tension
  const arcMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8});
  const arcs = [];
  for(let i=0; i<5; i++) {
      for(let j=i+1; j<5; j++) {
          const geo = new THREE.BufferGeometry();
          const pos = new Float32Array(15); // 5 points
          geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
          const line = new THREE.Line(geo, arcMat);
          group.add(line);
          arcs.push({line, pos, i, j});
      }
  }

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Physics: Repulsion from origin and each other
      const origin = new THREE.Vector3(0,0,0);
      protons.forEach(p => {
          // Push away from origin slightly to spread them out
          const away = p.grp.position.clone().normalize().multiplyScalar(0.01);
          p.vel.add(away);
          
          // Repel from others
          protons.forEach(p2 => {
              if (p !== p2) {
                  const dist = p.grp.position.distanceTo(p2.grp.position);
                  if (dist < 4) {
                      const push = p.grp.position.clone().sub(p2.grp.position).normalize().multiplyScalar(0.02 / (dist*dist));
                      p.vel.add(push);
                  }
              }
          });
          
          // Spring back to center so they don't fly away
          const pull = origin.clone().sub(p.grp.position).multiplyScalar(0.01);
          p.vel.add(pull);
          
          // Dampen
          p.vel.multiplyScalar(0.9);
          p.grp.position.add(p.vel);
          
          // Pulse fields
          p.field.scale.setScalar(1 + Math.sin(time*speed*10 + p.grp.position.x)*0.2);
          p.field.material.opacity = 0.3 + Math.sin(time*speed*15)*0.1;
      });
      
      // Draw jittery lightning arcs
      arcs.forEach(arc => {
          const p1 = protons[arc.i].grp.position;
          const p2 = protons[arc.j].grp.position;
          const dist = p1.distanceTo(p2);
          
          if (dist < 3.5) {
              arc.line.visible = true;
              for(let k=0; k<5; k++) {
                  const t = k/4;
                  const pt = new THREE.Vector3().lerpVectors(p1, p2, t);
                  // Add extreme jitter to middle points
                  if (k > 0 && k < 4) {
                      pt.x += (Math.random()-0.5)*0.4;
                      pt.y += (Math.random()-0.5)*0.4;
                      pt.z += (Math.random()-0.5)*0.4;
                  }
                  arc.pos[k*3] = pt.x;
                  arc.pos[k*3+1] = pt.y;
                  arc.pos[k*3+2] = pt.z;
              }
              arc.line.geometry.attributes.position.needsUpdate = true;
          } else {
              arc.line.visible = false;
          }
      });
  };

  return {
    group: group,
    description: "The 5 Protons (Violent Repulsion - Remastered). An upgraded simulation of the Electromagnetic Force. The 5 protons in Boron all have a positive charge. Because 'like charges repel', they absolutely despise being near each other! Notice the intense, jagged lightning arcs of electrostatic tension firing between them as they try to push each other apart, while a simulated central boundary prevents them from flying infinitely far away.",
    parts: [
      { name: "Ruby Spheres", material: "Protons", function: "Sources of immense positive electromagnetic force." },
      { name: "Red Halos", material: "Electric Field", function: "The invisible boundary of repulsion." },
      { name: "White Arcs", material: "Electrostatic Tension", function: "The immense energy trying to rip the nucleus apart." }
    ],
    quizQuestions: [
      { question: "If the 5 protons hate each other this much, why doesn't the Boron nucleus instantly explode?", options: ["Because they are tied with string", "Because gravity is stronger than electricity", "Because the Neutrons provide the Strong Nuclear Force, which overpowers the electrical repulsion", "Because they run out of energy"], correct: 2, explanation: "Without neutrons, a nucleus with more than 1 proton will instantly explode! The neutrons act as the 'glue' that binds it all together." }
    ]
  };
}