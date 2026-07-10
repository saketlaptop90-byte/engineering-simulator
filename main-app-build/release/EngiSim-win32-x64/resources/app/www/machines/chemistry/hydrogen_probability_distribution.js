import * as THREE from 'three';
export function createHydrogenProbabilityDistribution() {
  const group = new THREE.Group();
  
  // Radial probability distribution graph: 4 * pi * r^2 * |psi|^2
  // For 1s, this peaks at the Bohr radius (a0).
  const graphGroup = new THREE.Group();
  
  const points = [];
  const a0 = 1.5; // Scaled Bohr radius
  for(let r=0; r<=5; r+=0.1) {
      // P(r) ~ r^2 * e^(-2r/a0)
      const prob = (r*r) * Math.exp(-2*r/a0) * 1.5; 
      points.push(new THREE.Vector3(r, prob, 0));
  }
  
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});
  const graphLine = new THREE.Line(lineGeo, lineMat);
  graphGroup.add(graphLine);

  // Axes
  graphGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 6, 0xffffff));
  graphGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 0xffffff));

  // Vertical line at Bohr radius peak
  const peakLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a0, 0, 0), new THREE.Vector3(a0, 2.0, 0)]), new THREE.LineBasicMaterial({color: 0xffff00, dashed: true}));
  peakLine.computeLineDistances();
  graphGroup.add(peakLine);
  
  graphGroup.position.set(-3, -1, 0);
  group.add(graphGroup);

  // Corresponding 3D atom model beside it
  const atom = new THREE.Mesh(new THREE.SphereGeometry(a0, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, wireframe: true}));
  atom.position.set(3, 1, 0);
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom.add(nuc);
  group.add(atom);

  group.userData.animate = function(delta, time, speed) {
      atom.rotation.y = time * speed * 0.5;
  };

  return {
    group: group,
    description: "Radial Probability Distribution. While electron density is highest at the nucleus, the total volume of space increases further out. Multiplying density by spherical volume gives the Radial Probability: the likelihood of finding the electron at a specific distance r.",
    parts: [
      { name: "Graph Curve", material: "Math", function: "Plots Radial Probability vs Distance." },
      { name: "Peak (Yellow Line)", material: "Bohr Radius", function: "The most probable distance to find the electron (52.9 pm)." }
    ],
    quizQuestions: [
      { question: "While electron DENSITY is highest at the nucleus, the RADIAL PROBABILITY peaks at the Bohr radius (52.9 pm). Why?", options: ["Because the nucleus repels the electron", "Because the volume of a spherical shell increases with the square of the radius (4πr²), balancing out the dropping density", "Because electrons prefer to sit exactly at 52.9 pm", "It's an optical illusion"], correct: 1, explanation: "Radial probability = (Electron Density) × (Volume of spherical shell). Density drops exponentially, but volume grows as r². The mathematical product of these two opposing factors creates a peak exactly at the Bohr radius." }
    ]
  };
}