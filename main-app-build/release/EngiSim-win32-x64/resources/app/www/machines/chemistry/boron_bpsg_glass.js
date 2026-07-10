import * as THREE from 'three';
export function createBPSG() {
  const group = new THREE.Group();
  
  // BPSG (Borophosphosilicate Glass) - Semiconductor planarization
  
  // Microchip trenches (Silicon substrate)
  const chipMat = new THREE.MeshPhysicalMaterial({color: 0x444444, metalness: 0.9, roughness: 0.4});
  const chip = new THREE.Group();
  
  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 4), chipMat);
  base.position.y = -2;
  chip.add(base);
  
  // Transistor ridges (Trenches)
  for(let i=-3; i<=3; i+=2) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2, 4), chipMat);
      ridge.position.set(i, -0.5, 0);
      chip.add(ridge);
  }
  group.add(chip);

  // The BPSG Glass flowing over it like thick honey
  const glassGeo = new THREE.PlaneGeometry(8, 4, 32, 16);
  const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, 
      transmission: 0.8, 
      opacity: 1, 
      transparent: true, 
      roughness: 0.1, 
      ior: 1.5,
      clearcoat: 1.0,
      side: THREE.DoubleSide
  });
  
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.rotation.x = -Math.PI/2;
  glass.position.y = 1;
  group.add(glass);
  
  // Save original vertices for flowing animation
  const origVertices = glassGeo.attributes.position.array.slice();

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,10,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.1)*0.3; // Gentle rock to show reflections
      
      // Animate the glass melting and planarizing (flowing into trenches)
      // We'll cycle between rigid bumpy glass and melted flat glass
      const cycle = (Math.sin(time*speed*0.5) + 1) / 2; // 0 to 1 smoothly
      
      const posAttr = glass.geometry.attributes.position;
      const v = new THREE.Vector3();
      
      for(let i=0; i<posAttr.count; i++) {
          v.fromArray(origVertices, i*3);
          
          // x in plane is v.x, y in plane is v.y (which is Z in world space)
          // Z in plane is the height (which is Y in world space)
          
          // Determine if we are over a ridge or a trench
          const isOverRidge = Math.abs(Math.cos(v.x * Math.PI / 2)) > 0.5;
          
          // Unmelted: follows the contours of the chip
          const unmeltedZ = isOverRidge ? 0.0 : -1.5; 
          
          // Melted: completely flat on top, filling the trenches
          const meltedZ = 0.0;
          
          // Lerp based on heat cycle
          const targetZ = THREE.MathUtils.lerp(unmeltedZ, meltedZ, cycle);
          
          posAttr.setXYZ(i, v.x, v.y, targetZ);
      }
      posAttr.needsUpdate = true;
      glass.geometry.computeVertexNormals();
      
      // Change color slightly based on heat
      glass.material.color.setHex(cycle > 0.8 ? 0xffaaaa : 0x00ffff); // Turns red when hot/flowing
  };

  return {
    group: group,
    description: "Borophosphosilicate Glass (BPSG). How do they make computer chips with billions of microscopic transistors? They use Boron! As they build microscopic layers of transistors, the surface becomes incredibly bumpy (like the grey ridges shown). If you try to print another layer on top, it will break. To fix this, they coat the chip in a special glass made of Silicon, Phosphorus, and Boron. By adding Boron, the melting point of the glass drops drastically. When heated, the glass melts like thick honey, flows into the trenches, and creates a perfectly flat, smooth surface for the next layer of the microchip to be printed on!",
    parts: [
      { name: "Grey Blocks", material: "Silicon Microchip", function: "Microscopic transistors and wires." },
      { name: "Cyan Flowing Liquid", material: "BPSG Glass", function: "Melting at a low temperature to fill the gaps and create a perfectly flat surface." }
    ],
    quizQuestions: [
      { question: "Why is Boron added to the glass (creating BPSG) when manufacturing microchips?", options: ["To make the microchip magnetic", "Boron significantly lowers the melting point of the glass, allowing it to melt and flow smoothly over the delicate transistors without destroying them with extreme heat.", "To make the microchip waterproof", "To color the glass blue"], correct: 1, explanation: "Normal glass melts at extremely high temperatures that would instantly melt and destroy a computer chip. Adding Boron drops the melting point to a safe level!" }
    ]
  };
}