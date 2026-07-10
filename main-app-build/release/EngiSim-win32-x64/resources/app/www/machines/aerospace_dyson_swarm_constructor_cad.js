import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const hullMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 }); // Main constructor hull
    const droneMat = new THREE.MeshPhysicalMaterial({ color: 0xcc4422, metalness: 0.6, roughness: 0.5 }); // Automated mining drones
    const sailSpoolMat = new THREE.MeshPhysicalMaterial({ color: 0x4466aa, metalness: 0.9, roughness: 0.1 }); // Carbon fiber sail spools
    
    // VFX Materials
    const solarSailVFX = new THREE.MeshBasicMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.4, side: THREE.DoubleSide }); // Unfurled solar sails
    const plasmaTorchVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Drone cutting lasers
    const thrusterVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Ion drives

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.drones = [];
    group.userData.animatedMeshes.sails = [];
    group.userData.animatedMeshes.thrusters = [];
    group.userData.animatedMeshes.torches = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Central Constructor Hub
    // ==========================================
    const hubGroup = new THREE.Group();
    
    // Massive elongated hexagonal body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 5.0, 6), hullMat);
    body.rotation.z = Math.PI/2;
    hubGroup.add(body);
    
    // Main Ion Thrusters at the rear
    for(let i=0; i<3; i++) {
        const angle = (i * Math.PI*2) / 3;
        const thruster = new THREE.Group();
        thruster.position.set(-2.5, 0.6 * Math.cos(angle), 0.6 * Math.sin(angle));
        thruster.rotation.z = Math.PI/2;
        
        const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 0.6), darkSteel());
        thruster.add(bell);
        
        const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 2.0, 16, 1, true), thrusterVFX);
        plume.position.y = 1.3;
        thruster.add(plume);
        group.userData.animatedMeshes.thrusters.push(plume);
        
        hubGroup.add(thruster);
    }
    
    group.add(hubGroup);
    parts.push({ mesh: body, name: "Constructor Hub", description: "Automated factory ship.", function: "Manufactures and coordinates billions of solar sails and mining drones to incrementally build a Dyson Swarm around a star."});

    // ==========================================
    // 2. PROCEDURAL CAD: Solar Sail Deployers
    // ==========================================
    const deployerGroup = new THREE.Group();
    
    // Rotating arms that unfurl massive solar sails
    for(let i=0; i<4; i++) {
        const armGroup = new THREE.Group();
        // Spaced along the hull
        armGroup.position.set(-1.0 + (i * 0.8), 0, 0);
        
        const spool = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), sailSpoolMat);
        spool.rotation.x = Math.PI/2;
        armGroup.add(spool);
        
        // The partially unfurled sail
        // We'll model it as a thin plane that scales up during animation
        const sail = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), solarSailVFX);
        sail.position.set(0, 2.0, 0);
        sail.rotation.x = -Math.PI/2;
        // Initially rolled up
        sail.scale.set(1.0, 0.01, 1.0);
        
        armGroup.add(sail);
        group.userData.animatedMeshes.sails.push(sail);
        
        deployerGroup.add(armGroup);
    }
    
    group.add(deployerGroup);
    parts.push({ mesh: deployerGroup.children[0].children[0], name: "Sail Spools", description: "Ultra-thin carbon-fiber photon sails.", function: "Extrudes and unfurls massive mirrored sails to capture stellar radiation pressure for energy generation and station-keeping."});

    // ==========================================
    // 3. PROCEDURAL CAD: Asteroid Mining Drones
    // ==========================================
    const droneSwarm = new THREE.Group();
    
    // A cloud of tiny autonomous mining drones flying around the front of the ship
    for(let i=0; i<15; i++) {
        const drone = new THREE.Group();
        
        // Random starting position in a cloud ahead of the ship
        drone.position.set(3.0 + Math.random()*3.0, (Math.random()-0.5)*3.0, (Math.random()-0.5)*3.0);
        
        // Drone body
        const db = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.1), droneMat);
        drone.add(db);
        
        // Plasma torch (pointing forward)
        const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5).rotateZ(-Math.PI/2), plasmaTorchVFX);
        torch.position.set(0.3, 0, 0);
        drone.add(torch);
        
        group.userData.animatedMeshes.torches.push(torch);
        
        // Save initial parameters for procedural flocking
        drone.userData = {
            basePos: drone.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random()
        };
        
        droneSwarm.add(drone);
        group.userData.animatedMeshes.drones.push(drone);
    }
    
    group.add(droneSwarm);
    parts.push({ mesh: droneSwarm.children[0].children[0], name: "Mining Drone Swarm", description: "Autonomous resource gatherers.", function: "Disassembles nearby asteroids using plasma torches to feed the hub's factory with raw materials for sail production."});

    // Helper material
    function darkSteel() {
        return new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 });
    }

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Hub Thrusters fire
            group.userData.animatedMeshes.thrusters.forEach(t => {
                t.material.opacity = 0.8 * speed;
                t.scale.y = 1.0 + Math.random()*0.5 * speed;
            });
            
            // 2. Solar Sails Unfurl
            group.userData.animatedMeshes.sails.forEach((sail, idx) => {
                // Sails unfurl progressively based on throttle
                sail.scale.y = 0.01 + (speed * 1.5);
                // Shift position so it unfurls outwards instead of from center
                sail.position.z = sail.scale.y * 1.5;
                // Add a slight shimmer
                sail.material.opacity = 0.4 + (Math.sin(timeAcc * 10 + idx) * 0.1);
            });
            
            // 3. Drone Swarm Flocks and Mines
            group.userData.animatedMeshes.drones.forEach((drone, idx) => {
                const ud = drone.userData;
                // Complex flocking/swarming math
                drone.position.x = ud.basePos.x + Math.sin(timeAcc * ud.speed * speed + ud.phase) * 1.0;
                drone.position.y = ud.basePos.y + Math.cos(timeAcc * ud.speed * 1.2 * speed + ud.phase) * 1.0;
                drone.position.z = ud.basePos.z + Math.sin(timeAcc * ud.speed * 0.8 * speed + ud.phase) * 1.0;
                
                // Point in direction of travel (roughly)
                drone.lookAt(drone.position.x + 1, drone.position.y, drone.position.z);
            });
            
            // 4. Plasma torches fire
            group.userData.animatedMeshes.torches.forEach(torch => {
                // Fire randomly
                if (Math.random() < 0.2 * speed) {
                    torch.material.opacity = 0.9;
                    torch.scale.y = 1.0 + Math.random();
                } else {
                    torch.material.opacity = 0.0;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.thrusters.forEach(t => t.material.opacity = 0.0);
            group.userData.animatedMeshes.sails.forEach(sail => {
                sail.scale.y = 0.01;
                sail.position.z = 0;
            });
            group.userData.animatedMeshes.torches.forEach(t => t.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
