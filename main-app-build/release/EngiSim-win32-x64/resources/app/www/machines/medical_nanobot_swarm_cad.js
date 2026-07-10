import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials (Scaled up for viewing)
    const diamondoid = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.1, transmission: 0.8, thickness: 0.2 }); // Carbon lattice hull
    const titaniumOxide = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.6, roughness: 0.4 }); // Mechanical structural parts
    const piezoCeramic = new THREE.MeshPhysicalMaterial({ color: 0xffffcc, metalness: 0.1, roughness: 0.8 }); // Actuators
    const goldContacts = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.2 }); // Nanoscale circuitry
    
    // VFX Materials
    const drugPayloadVFX = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8 }); // Fluorescent targeting drug
    const scanningLaserVFX = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.bots = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Individual Nanobot (Macro Scale)
    // ==========================================
    // We will define a single highly detailed nanobot and then clone it to create a swarm
    const baseBot = new THREE.Group();
    
    // A. Main Hull (Diamondoid Capsule)
    const hullGeo = new THREE.CapsuleGeometry(0.2, 0.4, 16, 16);
    const hull = new THREE.Mesh(hullGeo, diamondoid);
    hull.rotation.z = Math.PI/2; // Orient horizontally
    baseBot.add(hull);
    
    // B. Internal Sub-Assemblies
    
    // B1. Onboard Logic Controller (ASIC)
    const logicChip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.15), goldContacts);
    logicChip.position.set(-0.1, 0, 0);
    baseBot.add(logicChip);
    
    // B2. Acoustic/Magnetic Power Receiver (Coil)
    const powerCoil = new THREE.Group();
    for(let i=0; i<10; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.005, 8, 16), copper);
        ring.position.x = -0.25 + (i * 0.015);
        ring.rotation.y = Math.PI/2;
        powerCoil.add(ring);
    }
    baseBot.add(powerCoil);
    
    // B3. Drug Delivery Payload Bay
    const payloadGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const payload = new THREE.Mesh(payloadGeo, drugPayloadVFX);
    payload.position.set(0.15, 0, 0);
    baseBot.add(payload);
    
    // C. Propulsion (Piezoelectric Rotary Motor & Flagellum)
    const motorGroup = new THREE.Group();
    motorGroup.position.set(-0.35, 0, 0);
    
    const stator = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05).rotateZ(Math.PI/2), titaniumOxide);
    motorGroup.add(stator);
    
    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1).rotateZ(Math.PI/2), piezoCeramic);
    
    // Synthetic Flagellum (Corkscrew tail)
    class CorkscrewCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = -t * 0.6; // Tail goes out the back
            const r = 0.05;
            const y = Math.sin(t * Math.PI * 6) * r;
            const z = Math.cos(t * Math.PI * 6) * r;
            return optionalTarget.set(x, y, z);
        }
    }
    const tailGeo = new THREE.TubeGeometry(new CorkscrewCurve(), 64, 0.01, 8, false);
    const tail = new THREE.Mesh(tailGeo, plastic);
    tail.position.x = -0.05;
    rotor.add(tail);
    
    motorGroup.add(rotor);
    baseBot.add(motorGroup);
    baseBot.userData.rotor = rotor; // Store reference to spin it
    
    // D. Navigation / Target Scanning (Optical/Chemical sensors on the front)
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(0.4, 0, 0);
    
    const sensorBase = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.1, 8).rotateZ(-Math.PI/2), titaniumOxide);
    sensorGroup.add(sensorBase);
    
    // Scanning Laser VFX
    const laser = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.0, 16).rotateZ(-Math.PI/2), scanningLaserVFX);
    laser.position.set(0.5, 0, 0);
    sensorGroup.add(laser);
    baseBot.userData.laser = laser;
    
    baseBot.add(sensorGroup);

    // ==========================================
    // 2. PROCEDURAL CAD: The Swarm Array
    // ==========================================
    // Instead of bolts, we clone the highly detailed nanobot to create a swarm of 50 units.
    // They are swimming in a simulated bloodstream environment.
    
    const swarmGroup = new THREE.Group();
    const botCount = 50;
    
    for(let i=0; i<botCount; i++) {
        const bot = baseBot.clone();
        
        // Setup individual references since clone() doesn't deep copy userData meshes correctly
        bot.userData.rotor = bot.children.find(c => c.children.length > 1)?.children[1];
        bot.userData.laser = bot.children[bot.children.length-1].children[1];
        
        // Random starting positions within a sphere
        const r = Math.random() * 2.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        bot.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        
        // Random orientation
        bot.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        // Animation variables
        bot.userData.velocity = new THREE.Vector3(0,0,0);
        bot.userData.target = new THREE.Vector3((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
        bot.userData.phase = Math.random() * Math.PI * 2;
        
        swarmGroup.add(bot);
        group.userData.animatedMeshes.bots.push(bot);
    }
    
    group.add(swarmGroup);
    
    parts.push({ mesh: baseBot.children[0], name: "Diamondoid Hull Capsule", description: "Inert carbon lattice exterior.", function: "Protects the internal nanoscale machinery from the host's immune system."});
    parts.push({ mesh: baseBot.children[3], name: "Piezoelectric Flagella Motor", description: "Rotary actuator measuring only 200 nanometers.", function: "Spins the synthetic corkscrew tail to propel the bot through viscous blood plasma."});
    parts.push({ mesh: baseBot.children[1], name: "Onboard Logic ASIC", description: "Gold-contact nanoscale processing unit.", function: "Executes swarm intelligence algorithms, allowing the bots to coordinate and locate target cancer cells autonomously."});
    parts.push({ mesh: baseBot.children[2], name: "Chemotherapeutic Payload Bay", description: "Spherical containment vessel.", function: "Holds exactly 1,000 molecules of targeted cancer drug, releasing it only when the specific tumor biomarker is detected."});

    // Scale adjustment (We are rendering them massively scaled up)
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            group.userData.animatedMeshes.bots.forEach(bot => {
                // 1. Spin the flagella motor
                if (bot.userData.rotor) {
                    bot.userData.rotor.rotation.x += 10.0 * speed;
                }
                
                // 2. Scanning Laser VFX
                if (bot.userData.laser) {
                    const isScanning = Math.sin(timeAcc * 10 + bot.userData.phase) > 0.5;
                    bot.userData.laser.material.opacity = isScanning ? 0.3 * speed : 0.0;
                }
                
                // 3. Swarm Swimming Logic (Boids-like simple movement)
                const dir = new THREE.Vector3().subVectors(bot.userData.target, bot.position);
                if (dir.length() < 0.2) {
                    // Pick a new target if reached
                    bot.userData.target.set((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
                }
                dir.normalize();
                
                // Smoothly rotate towards target
                const targetRotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1,0,0), dir));
                bot.rotation.x += (targetRotation.x - bot.rotation.x) * 0.05 * speed;
                bot.rotation.y += (targetRotation.y - bot.rotation.y) * 0.05 * speed;
                
                // Move forward
                bot.translateX(0.02 * speed);
                
                // Keep them somewhat bounded in the center
                if (bot.position.length() > 2.5) {
                    bot.userData.target.set(0,0,0);
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.bots.forEach(bot => {
                if (bot.userData.rotor) bot.userData.rotor.rotation.x *= 0.95;
                if (bot.userData.laser) bot.userData.laser.material.opacity = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
