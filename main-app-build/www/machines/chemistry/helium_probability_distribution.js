import * as THREE from 'three';
export function createHeliumProbabilityDistribution() {
  const group = new THREE.Group();
  
  // Radial probability distribution graph for Helium
  // Peaks closer to the nucleus than Hydrogen (a0 = ~0.5 Bohr radii)
  const graphGroup = new THREE.Group();
  
  const points = [];
  const aHe = 0.8; // Scaled for visual comparison to H
  for(let r=0; r<=5; r+=0.1) {
      // P(r) ~ r^2 * e^(-Z*r/a)
      const prob = (r*r) * Math.exp(-2.5*r/aHe) * 4.0; 
      points.push(new THREE.Vector3(r, prob, 0));
  }
  
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});
  const graphLine = new THREE.Line(lineGeo, lineMat);
  graphGroup.add(graphLine);

  // Axes
  graphGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 6, 0xffffff));
  graphGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 0xffffff));

  // Vertical line at peak
  const peakLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(aHe, 0, 0), new THREE.Vector3(aHe, 2.0, 0)]), new THREE.LineBasicMaterial({color: 0xffff00, dashed: true}));
  graphGroup.add(peakLine);
  
  graphGroup.position.set(-3, -1, 0);
  group.add(graphGroup);

  // Ghost outline of Hydrogen's peak for comparison
  const hPeakLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1.5, 0, 0), new THREE.Vector3(1.5, 1.0, 0)]), new THREE.LineBasicMaterial({color: 0x888888, dashed: true}));
  graphGroup.add(hPeakLine);

  // Corresponding 3D atom model beside it
  const atom = new THREE.Mesh(new THREE.SphereGeometry(aHe, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, wireframe: true}));
  atom.position.set(3, 1, 0);
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom.add(nuc);
  group.add(atom);

  group.userData.animate = function(delta, time, speed) {
      atom.rotation.y = time * speed * 0.5;
  };

  return {
    group: group,
    description: "Radial Probability Distribution of Helium. Because the +2 nucleus pulls the electrons inward, the peak radial probability (the most likely distance to find an electron) is shifted significantly to the left (closer to the nucleus) compared to Hydrogen (the grey dashed line).",
    parts: [
      { name: "Yellow Line (Peak)", material: "Probability Maximum", function: "Closer to the nucleus than Hydrogen." },
      { name: "Grey Dashed Line", material: "Hydrogen's Peak", function: "Shown for comparison to highlight Helium's compact size." }
    ],
    quizQuestions: [
      { question: "How does the peak of Helium's radial probability distribution compare to Hydrogen's?", options: ["It is exactly the same", "It is further away from the nucleus", "It is closer to the nucleus because of the higher nuclear charge (+2)", "It is at infinity"], correct: 2, explanation: "The stronger electrostatic pull from Helium's two protons shrinks the electron probability cloud, causing the peak likelihood distance to be significantly shorter than in Hydrogen." }
    ]
  };
}