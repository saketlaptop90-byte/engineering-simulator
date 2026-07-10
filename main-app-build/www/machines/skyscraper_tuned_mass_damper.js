export function createTunedMassDamper(THREE) {
    const group = new THREE.Group();

    // Skyscraper Frame (Simple wireframe tower)
    const towerGeo = new THREE.BoxGeometry(4, 20, 4);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x445566, wireframe: true, transparent: true, opacity: 0.5 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 10;
    group.add(tower);

    // Floors
    const floorGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x8899aa });
    for(let y = 0; y <= 20; y += 4) {
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = y;
        tower.add(floor); // Attach to tower so they sway together
    }

    // Tuned Mass Damper (The heavy pendulum near the top)
    const damperGroup = new THREE.Group();
    damperGroup.position.set(0, 18, 0); // Hang from near the top
    tower.add(damperGroup); // Attached to tower

    // Cables holding the mass
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    
    const cable1 = new THREE.Mesh(cableGeo, cableMat);
    cable1.position.set(-1, -1.5, -1);
    damperGroup.add(cable1);
    
    const cable2 = new THREE.Mesh(cableGeo, cableMat);
    cable2.position.set(1, -1.5, -1);
    damperGroup.add(cable2);

    const cable3 = new THREE.Mesh(cableGeo, cableMat);
    cable3.position.set(-1, -1.5, 1);
    damperGroup.add(cable3);

    const cable4 = new THREE.Mesh(cableGeo, cableMat);
    cable4.position.set(1, -1.5, 1);
    damperGroup.add(cable4);

    // The Mass (Heavy steel/concrete ball)
    const massGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const massMat = new THREE.MeshStandardMaterial({ color: 0xccaacc, metalness: 0.7, roughness: 0.3 });
    const mass = new THREE.Mesh(massGeo, massMat);
    mass.position.y = -3;
    damperGroup.add(mass);

    // Hydraulic shock absorbers (dashpots) attached to floor below
    const shockGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const shockMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const shock1 = new THREE.Mesh(shockGeo, shockMat);
    shock1.position.set(-2, 15, 0);
    shock1.rotation.z = Math.PI / 4;
    tower.add(shock1);

    const shock2 = new THREE.Mesh(shockGeo, shockMat);
    shock2.position.set(2, 15, 0);
    shock2.rotation.z = -Math.PI / 4;
    tower.add(shock2);

    group.userData.animate = function(time) {
        // Wind/Earthquake sways the building
        const buildingSway = Math.sin(time * 2) * 0.2;
        
        // Tower pivots slightly from the base
        tower.rotation.z = buildingSway * 0.1;

        // Tuned Mass Damper swings out of phase (resists the sway)
        // In reality it lags by 90 degrees if perfectly tuned, here we approximate counter-movement
        const damperSway = Math.cos(time * 2) * 0.3;
        damperGroup.rotation.z = damperSway;
        
        // Update shock absorbers to point at the mass
        shock1.lookAt(new THREE.Vector3().copy(mass.getWorldPosition(new THREE.Vector3())));
        shock2.lookAt(new THREE.Vector3().copy(mass.getWorldPosition(new THREE.Vector3())));
    };

    group.userData.quiz = [
        { question: "What is the purpose of a Tuned Mass Damper (TMD)?", options: ["To reduce the amplitude of mechanical vibrations", "To generate electricity", "To store water", "To increase building weight"], answer: 0 },
        { question: "Where is a TMD usually placed in a skyscraper?", options: ["Near the top", "In the basement", "In the exact center", "Outside the building"], answer: 0 },
        { question: "What famous skyscraper features a visible 728-ton TMD?", options: ["Taipei 101", "Burj Khalifa", "Empire State Building", "Willis Tower"], answer: 0 }
    ];

    return group;
}
