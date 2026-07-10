import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const tetherMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 }); // Woven Carbon Nanotubes
    const climberHullMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.5, roughness: 0.4 }); // Composite aerospace hull
    const rollerMat = new THREE.MeshPhysicalMaterial({ color: 0x778899, metalness: 0.8, roughness: 0.3 }); // Magnetic grip rollers
    const stationMat = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.7, roughness: 0.5 }); // Orbital counterweight station
    
    // VFX Materials
    const solarArrayVFX = new THREE.MeshPhysicalMaterial({ color: 0x0033ff, metalness: 0.2, roughness: 0.1, transmission: 0.9, side: THREE.DoubleSide }); // Photovoltaic panels
    const laserPowerVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Beamed power from the ground
    const thrusterVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Station keeping

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.climbers = [];
    group.userData.animatedMeshes.laser = null;
    group.userData.animatedMeshes.solarPanels = [];
    group.userData.animatedMeshes.thrusters = [];
    group.userData.animatedMeshes.rollers = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Tether & Counterweight Station
    // ==========================================
    const tetherGroup = new THREE.Group();
    
    // The Carbon Nanotube Tether (stretching vertically)
    // We model a section of it. The top represents the geostationary orbit, the bottom is Earth.
    const tetherLength = 10.0;
    const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, tetherLength, 16), tetherMat);
    tetherGroup.add(tether);
    
    // Orbital Counterweight Station (at the top)
    const station = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32), stationMat);
    station.position.y = tetherLength / 2;
    tetherGroup.add(station);
    
    // Habitation Ring (rotating)
    const habRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 32), stationMat);
    habRing.rotation.x = Math.PI/2;
    habRing.position.y = (tetherLength / 2) - 0.5;
    tetherGroup.add(habRing);
    
    // Station-keeping thrusters on the counterweight
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI) / 2;
        const thr = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 8), thrusterVFX);
        // Positioned at the edges of the station, pointing sideways to maintain tension/orbit
        thr.position.set(1.6 * Math.cos(angle), tetherLength / 2, 1.6 * Math.sin(angle));
        thr.rotation.z = Math.PI/2 * (Math.cos(angle) > 0 ? -1 : 1); 
        thr.rotation.x = Math.PI/2 * (Math.sin(angle) > 0 ? 1 : -1);
        tetherGroup.add(thr);
        group.userData.animatedMeshes.thrusters.push(thr);
    }
    
    group.add(tetherGroup);
    parts.push({ mesh: tether, name: "Carbon Nanotube Tether", description: "Monomolecular woven ribbon stretching 36,000 km.", function: "Provides a physical track connecting the Earth's surface directly to a geostationary counterweight station, allowing payload transport without rockets."});
    parts.push({ mesh: station, name: "Geostationary Apex Station", description: "Massive orbital counterweight and spaceport.", function: "Maintains tension on the tether via centrifugal force, acting as the primary transfer hub for deep-space missions."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Climber Cars & Power Lasers
    // ==========================================
    const climbers = 2; // Two climbers going up/down
    
    for(let c=0; c<climbers; c++) {
        const climberGroup = new THREE.Group();
        
        // Main Climber Hull
        const hull = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.6), climberHullMat);
        climberGroup.add(hull);
        
        // Grip Rollers (clamping the tether)
        for(let y of [-0.4, 0.4]) {
            for(let x of [-0.15, 0.15]) {
                const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2).rotateX(Math.PI/2), rollerMat);
                roller.position.set(x, y, 0); // Tether runs through the middle
                climberGroup.add(roller);
                group.userData.animatedMeshes.rollers.push({ mesh: roller, side: x > 0 ? 1 : -1 });
            }
        }
        
        // Massive Solar Array / Laser Receivers on the sides
        for(let side of [-1, 1]) {
            const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.0), solarArrayVFX);
            panel.position.set(side * 1.2, 0, 0);
            panel.rotation.y = side * Math.PI/2;
            climberGroup.add(panel);
            group.userData.animatedMeshes.solarPanels.push(panel);
            
            // Support strut
            const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8).rotateZ(Math.PI/2), aluminum);
            strut.position.set(side * 0.6, 0, 0);
            climberGroup.add(strut);
        }
        
        // Initial position
        climberGroup.userData = { phase: c * Math.PI, speed: 0.5 };
        climberGroup.position.y = 0;
        
        group.add(climberGroup);
        group.userData.animatedMeshes.climbers.push(climberGroup);
    }
    
    parts.push({ mesh: group.userData.animatedMeshes.climbers[0].children[0], name: "Heavy Payload Climber", description: "Electromagnetic ascender vehicle.", function: "Uses magnetic grip rollers to pull itself up the tether at thousands of kilometers per hour, powered by ground-based lasers."});

    // Beamed Power Laser VFX (shooting up from the ground to the climbers)
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, tetherLength, 16), laserPowerVFX);
    laser.position.y = 0; // Spans the whole length
    group.add(laser);
    group.userData.animatedMeshes.laser = laser;

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Rotate habitation ring slowly regardless of throttle
        habRing.rotation.z += 0.005;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Climbers move up and down the tether
            group.userData.animatedMeshes.climbers.forEach((climber, i) => {
                // Use sine wave to go up and down
                const yPos = Math.sin(timeAcc * climber.userData.speed * speed + climber.userData.phase) * (tetherLength/2 - 0.8);
                climber.position.y = yPos;
                
                // Track panels towards the "sun" (or laser)
                // Just rotate them slightly for effect
                climber.children.forEach(c => {
                    if (c.geometry.type === 'PlaneGeometry') {
                        c.rotation.x = Math.sin(timeAcc * 0.5) * 0.2;
                    }
                });
            });
            
            // 2. Rollers spin rapidly
            group.userData.animatedMeshes.rollers.forEach(r => {
                // Depending on side, they roll opposite ways to pull the tether
                r.mesh.rotation.y += 0.5 * speed * r.side;
            });
            
            // 3. Ground Laser powers the climbers
            group.userData.animatedMeshes.laser.material.opacity = 0.4 * speed + (Math.sin(timeAcc * 30 * speed) * 0.1);
            
            // 4. Station keeping thrusters pulse
            group.userData.animatedMeshes.thrusters.forEach(thr => {
                thr.material.opacity = Math.random() < 0.1 * speed ? 0.8 : 0.2;
                thr.scale.y = 1.0 + (Math.random() * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.laser.material.opacity = 0.0;
            group.userData.animatedMeshes.thrusters.forEach(thr => thr.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
