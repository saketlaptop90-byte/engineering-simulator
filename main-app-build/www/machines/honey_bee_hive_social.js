export function createHoneyBeeHive(THREE) {
  const group = new THREE.Group();

  // The Comb (Hexagonal Grid)
  const combGroup = new THREE.Group();
  group.add(combGroup);

  const hexRadius = 0.5;
  const hexDepth = 1.0;
  const waxMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.8, metalness: 0.1 });
  const honeyMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
  const broodMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });

  const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, hexDepth, 6);
  // Hollow it out slightly
  const hollowGeo = new THREE.CylinderGeometry(hexRadius*0.8, hexRadius*0.8, hexDepth*1.1, 6);
  // We'll just use a solid cylinder scaled for simplicity, and cap it for honey/brood
  
  const cells = [];

  const rows = 10;
  const cols = 10;
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      // Hex grid offset
      const xOffset = c * hexRadius * Math.sqrt(3);
      const yOffset = r * hexRadius * 1.5;
      const x = xOffset + ((r % 2 === 0) ? 0 : (hexRadius * Math.sqrt(3) / 2));
      const y = yOffset;

      // Draw the walls
      const cell = new THREE.Mesh(hexGeo, waxMat);
      cell.rotation.x = Math.PI / 2;
      cell.position.set(x - 5, y - 5, 0);
      
      // Assign cell type based on location
      let type = 'empty';
      if (y > 3) type = 'honey';      // Top is honey storage
      else if (x > 3 && x < 7 && y > 1 && y < 5) type = 'pollen'; // Ring around brood
      else if (x > 2 && x < 8 && y < 3) type = 'brood'; // Center/bottom is brood
      
      // Visual fill
      if (type === 'honey') {
        const fill = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius*0.8, hexRadius*0.8, hexDepth*0.9, 6), honeyMat);
        fill.rotation.x = Math.PI / 2;
        cell.add(fill);
      } else if (type === 'brood') {
        const fill = new THREE.Mesh(new THREE.SphereGeometry(hexRadius*0.6), broodMat);
        cell.add(fill);
      } else if (type === 'pollen') {
        const fill = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius*0.8, hexRadius*0.8, hexDepth*0.5, 6), new THREE.MeshStandardMaterial({ color: 0xbbff22 }));
        fill.rotation.x = Math.PI / 2;
        fill.position.z = -0.2;
        cell.add(fill);
      }

      cell.userData = { type: type };
      combGroup.add(cell);
      cells.push(cell);
    }
  }

  // Add click zones
  const honeyZone = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 2), new THREE.MeshBasicMaterial({ visible: false }));
  honeyZone.position.set(0, 3, 0);
  group.add(honeyZone);
  honeyZone.userData = { id: 'honey_zone', name: 'Honey Stores', description: 'Located at the top of the hive. Honey is dehydrated nectar, capped with wax for winter food.' };

  const broodZone = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 2), new THREE.MeshBasicMaterial({ visible: false }));
  broodZone.position.set(0, -2, 0);
  group.add(broodZone);
  broodZone.userData = { id: 'brood_zone', name: 'Brood Chamber', description: 'Located in the warmer center/bottom. Here the Queen lays up to 2,000 eggs per day. Larvae are fed by nurse bees.' };

  // Bees (Agents)
  const beeGroup = new THREE.Group();
  group.add(beeGroup);
  
  const beeGeo = new THREE.CapsuleGeometry(0.2, 0.4, 4, 8);
  const beeMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Stripe with texture ideally, using dark color
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });

  const createBee = (role) => {
    const b = new THREE.Group();
    const body = new THREE.Mesh(beeGeo, beeMat);
    body.rotation.z = Math.PI / 2;
    b.add(body);
    
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.2, 8), stripeMat);
    stripe.rotation.z = Math.PI / 2;
    b.add(stripe);

    const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    wing.position.set(0, 0.2, 0.2);
    wing.rotation.x = Math.PI/2;
    const wing2 = wing.clone();
    wing2.position.set(0, 0.2, -0.2);
    
    b.add(wing, wing2);
    
    // Scale for role
    if (role === 'queen') b.scale.set(1.5, 1.5, 1.5);
    if (role === 'drone') b.scale.set(1.2, 1.2, 1.2);
    
    b.userData = { role: role, wings: [wing, wing2], target: new THREE.Vector3() };
    return b;
  };

  const bees = [];

  // The Queen
  const queen = createBee('queen');
  queen.position.set(0, -2, 1.5);
  beeGroup.add(queen);
  bees.push(queen);
  queen.children[0].userData = { id: 'queen', name: 'The Queen Bee', description: 'The only reproductive female. She emits pheromones that regulate the hive.' };

  // Workers
  for(let i=0; i<30; i++) {
    const worker = createBee('worker');
    worker.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, 1 + Math.random()*2);
    beeGroup.add(worker);
    bees.push(worker);
  }
  bees[1].children[0].userData = { id: 'worker', name: 'Worker Bee (Female)', description: 'Sterile females that do all the work: foraging, nursing, guarding, and building wax.' };

  // Drones
  for(let i=0; i<5; i++) {
    const drone = createBee('drone');
    drone.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, 1.5 + Math.random()*2);
    beeGroup.add(drone);
    bees.push(drone);
  }
  bees[31].children[0].userData = { id: 'drone', name: 'Drone Bee (Male)', description: 'Stingless males whose sole purpose is to mate with a virgin queen from another hive. They are kicked out before winter.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    // Waggle dance for one worker
    const dancer = bees[1];
    dancer.position.set(0, 0, 1.5);
    dancer.rotation.y = Math.sin(t*10)*0.5; // waggle
    dancer.rotation.z = Math.PI/4; // angle indicates direction relative to sun
    
    bees.forEach((b, i) => {
      // Flap wings rapidly
      b.userData.wings[0].rotation.z = Math.sin(t*50) * 0.5;
      b.userData.wings[1].rotation.z = -Math.sin(t*50) * 0.5;

      if(i !== 1) { // Not the dancer
        // Random wandering over the comb
        if(Math.random() < 0.01) {
          b.userData.target.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, 1 + Math.random());
        }
        b.position.lerp(b.userData.target, 0.02);
        
        // Face target
        b.lookAt(b.userData.target);
      }
    });

    // Queen moves slowly around brood
    queen.userData.target.set(Math.sin(t*0.2)*2, -2 + Math.cos(t*0.3), 1.5);
  };

  group.userData.quiz = [
    { question: "What is the primary role of the male Drone bees?", options: ["To guard the hive entrance", "To make honey", "To mate with a queen from another hive"], answer: 2 },
    { question: "How do worker bees communicate the location of a good flower patch to the rest of the hive?", options: ["They buzz loudly", "They perform a figure-eight 'Waggle Dance' where angle equals direction and duration equals distance", "They leave a trail of pollen"], answer: 1 }
  ];

  return group;
}
