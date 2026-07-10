import * as THREE from 'three';
export function createBoronElectronRepulsion() {
  const group = new THREE.Group();
  
  // Boron's 3 valence electrons pushing away from each other (VSEPR theory basis)
  
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0x222222}));
  group.add(core);

  const eGrp = new THREE.Group();
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff})); e1.position.set(0, 3, 0); eGrp.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff})); e2.position.set(2.6, -1.5, 0); eGrp.add(e2);
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff})); e3.position.set(-2.6, -1.5, 0); eGrp.add(e3);
  
  group.add(eGrp);

  // Repulsion arrows between them
  const createArrow = (p1, p2) => {
      const dir = new THREE.Vector3().subVectors(p2.position, p1.position).normalize();
      const length = p1.position.distanceTo(p2.position) * 0.8;
      // Position halfway
      const pos = new THREE.Vector3().addVectors(p1.position, p2.position).multiplyScalar(0.5);
      
      const arrow1 = new THREE.ArrowHelper(dir, pos, length/2, 0xff00ff, 0.4, 0.4);
      const arrow2 = new THREE.ArrowHelper(dir.negate(), pos, length/2, 0xff00ff, 0.4, 0.4);
      
      group.add(arrow1, arrow2);
      return {a1: arrow1, a2: arrow2};
  };
  
  const pair1 = createArrow(e1, e2);
  const pair2 = createArrow(e2, e3);
  const pair3 = createArrow(e3, e1);

  // Angle arcs (120 degrees)
  const arcMat = new THREE.LineBasicMaterial({color: 0x00ffff});
  for(let i=0; i<3; i++) {
      const curve = new THREE.EllipseCurve(0, 0, 1.5, 1.5, (i*120)*Math.PI/180 + 0.2, ((i+1)*120)*Math.PI/180 - 0.2, false, 0);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const arc = new THREE.Line(geometry, arcMat);
      group.add(arc);
  }
  
  const text = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  text.position.set(0, 0, 1.5);
  group.add(text); // "120°"

  group.userData.animate = function(delta, time, speed) {
      group.rotation.z = time * speed * 0.2;
      
      // Jiggle to show they are fighting to maintain distance
      const jiggle = Math.sin(time*speed*10)*0.05;
      e1.position.y = 3 + jiggle;
      e2.position.x = 2.6 + jiggle;
      e3.position.x = -2.6 - jiggle;
  };

  return {
    group: group,
    description: "Valence Electron Repulsion. Why do molecules form specific shapes? It starts right here. Boron has 3 valence electrons in its outer shell. Because they are all negatively charged, they repel each other. To get as far away from each other as possible, they arrange themselves into a perfect flat triangle around the nucleus. The angle between them is exactly 120 degrees! This is called 'Trigonal Planar' geometry.",
    parts: [
      { name: "Cyan Spheres", material: "3 Valence Electrons", function: "The outermost negative charges." },
      { name: "Magenta Arrows", material: "Electrostatic Repulsion", function: "Pushing away from each other equally." },
      { name: "120° Angle", material: "Trigonal Planar Geometry", function: "The most efficient way for 3 objects on a sphere to maximize distance from one another." }
    ],
    quizQuestions: [
      { question: "If Boron forms 3 chemical bonds using these 3 electrons, what shape will the resulting molecule be?", options: ["A straight line", "A square", "A flat triangle (Trigonal Planar) with 120° angles", "A pyramid"], correct: 2, explanation: "Because the 3 electrons naturally push themselves into a flat 120-degree triangle, any atoms that attach to them will also be forced into a flat triangle. Boron Trifluoride (BF3) is a perfect example of this." }
    ]
  };
}