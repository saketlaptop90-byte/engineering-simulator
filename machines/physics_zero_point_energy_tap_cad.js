import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const casimirPlateMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.0 }); // Perfectly polished uncharged conductive plates
    const piezoActuatorMat = new THREE.MeshPhysicalMaterial({ color: 0x887755, metalness: 0.6, roughness: 0.4 }); // Piezoelectric ceramics
    const vacuumHousingMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.5 }); // Ultra-high vacuum vessel
    const rectifierCoilMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.2 }); // Gold-plated induction coils
    
    // VFX Materials
    const vacuumFluctuationVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Virtual particles popping in and out
    const energyArcVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Harnessed electrical energy
    const harmonicOscillatorVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Resonance visualization

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.plates = [];
    group.userData.animatedMeshes.virtualParticles = [];
    group.userData.animatedMeshes.arcs = [];
    group.userData.animatedMeshes.resonators = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Vacuum Housing & Actuators
    // ==========================================
    const housingGroup = new THREE.Group();
    
    // The main heavy spherical vacuum vessel (cut open for viewing)
    const vessel = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI*2, 0, Math.PI/1.5), vacuumHousingMat);
    vessel.rotation.x = -Math.PI/2; // Open side facing up/forward
    housingGroup.add(vessel);
    
    // Massive piezoelectric actuator mounts to push the plates together
    for(let side of [-1, 1]) {
        const actuator = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0), piezoActuatorMat);
        actuator.position.set(side * 1.0, 0, 0);
        actuator.rotation.z = Math.PI/2;
        housingGroup.add(actuator);
    }
    
    group.add(housingGroup);
    parts.push({ mesh: vessel, name: "UHV Containment Vessel", description: "Ultra-high vacuum spherical housing.", function: "Provides an environment completely devoid of classical matter, allowing pure quantum vacuum fluctuations to dominate."});

    // ==========================================
    // 2. PROCEDURAL CAD: Casimir Plates & Rectifiers
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The Casimir Plates (Must be brought nanometers apart)
    // We model them as thick blocks for CAD visibility
    const plateGeo = new THREE.BoxGeometry(0.05, 1.2, 1.2);
    
    const leftPlate = new THREE.Mesh(plateGeo, casimirPlateMat);
    leftPlate.position.set(-0.2, 0, 0);
    const rightPlate = new THREE.Mesh(plateGeo, casimirPlateMat);
    rightPlate.position.set(0.2, 0, 0);
    
    coreGroup.add(leftPlate, rightPlate);
    group.userData.animatedMeshes.plates.push(leftPlate, rightPlate);
    
    // Quantum Harmonic Oscillator Rings (Rectifiers)
    // Surrounding the plates to harvest the resonant energy
    for(let i=0; i<3; i++) {
        const r = 0.8 + (i * 0.2);
        const coil = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 16, 64), rectifierCoilMat);
        coil.rotation.y = Math.PI/2;
        coreGroup.add(coil);
        
        // VFX Resonator overlay
        const res = new THREE.Mesh(new THREE.TorusGeometry(r, 0.08, 16, 64), harmonicOscillatorVFX);
        res.rotation.y = Math.PI/2;
        coreGroup.add(res);
        group.userData.animatedMeshes.resonators.push(res);
    }
    
    // Energy extraction arcs (VFX)
    for(let i=0; i<6; i++) {
        class ArcCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const angle = (i * Math.PI * 2) / 6;
                // Arc from the plates to the outer coils
                const rStart = 0.6;
                const rEnd = 1.2;
                const r = rStart + (rEnd - rStart) * t;
                const y = Math.sin(t * Math.PI) * 0.2; // Curve outwards
                return optionalTarget.set(0, r * Math.cos(angle) + y, r * Math.sin(angle));
            }
        }
        const arc = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(), 16, 0.01, 4, false), energyArcVFX);
        coreGroup.add(arc);
        group.userData.animatedMeshes.arcs.push(arc);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: leftPlate, name: "Conductive Casimir Plates", description: "Perfectly polished, uncharged metallic plates.", function: "Driven to within nanometers of each other. They exclude longer wavelengths of vacuum fluctuations between them, creating a negative radiation pressure that pulls them together."});

    // ==========================================
    // 3. PROCEDURAL CAD: Virtual Particles VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // The space between the plates boils with virtual particles
    for(let i=0; i<50; i++) {
        // We use tiny spheres that pop in and out of existence
        const particle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), vacuumFluctuationVFX);
        // Positioned in the gap between plates
        particle.userData = {
            baseX: (Math.random() - 0.5) * 0.4,
            baseY: (Math.random() - 0.5) * 1.0,
            baseZ: (Math.random() - 0.5) * 1.0,
            life: Math.random(),
            speed: 1.0 + Math.random() * 2.0
        };
        vfxGroup.add(particle);
        group.userData.animatedMeshes.virtualParticles.push(particle);
    }
    
    group.add(vfxGroup);
    parts.push({ mesh: vfxGroup.children[0], name: "Vacuum Fluctuation Rectifier", description: "Quantum harmonic induction coils.", function: "Oscillates the plates at ultra-high frequencies, performing work against the Casimir force and rectifying the zero-point energy of the vacuum into usable electrical power."});

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Plates oscillate incredibly fast (simulated as a blur/vibration)
            // They move from 0.2 down to 0.05 and back
            const gap = 0.1 + (Math.sin(timeAcc * 50 * speed) * 0.08); // Very fast oscillation
            group.userData.animatedMeshes.plates[0].position.x = -gap;
            group.userData.animatedMeshes.plates[1].position.x = gap;
            
            // 2. Virtual Particles boil in the gap
            group.userData.animatedMeshes.virtualParticles.forEach(vp => {
                vp.userData.life += 0.05 * speed * vp.userData.speed;
                if (vp.userData.life > 1.0) {
                    vp.userData.life = 0.0;
                    // Respawn inside the current gap
                    vp.userData.baseX = (Math.random() - 0.5) * (gap * 2);
                }
                
                vp.position.set(vp.userData.baseX, vp.userData.baseY, vp.userData.baseZ);
                
                // Opacity is a quick flash (pops into existence then vanishes)
                // Sine wave from 0 to 1 back to 0
                vp.material.opacity = Math.sin(vp.userData.life * Math.PI) * 0.8;
                vp.scale.setScalar(1.0 + (vp.userData.life * 2.0)); // Expand as they exist
            });
            
            // 3. Resonator Coils glow and throb
            group.userData.animatedMeshes.resonators.forEach((res, index) => {
                res.material.opacity = 0.4 + (Math.sin(timeAcc * 10 * speed + index) * 0.4);
                res.rotation.z += 0.02 * speed * (index % 2 === 0 ? 1 : -1);
            });
            
            // 4. Energy Arcs crackle outwards
            group.userData.animatedMeshes.arcs.forEach(arc => {
                arc.material.opacity = 0.5 + (Math.random() * 0.5 * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.plates[0].position.x = -0.2;
            group.userData.animatedMeshes.plates[1].position.x = 0.2;
            group.userData.animatedMeshes.virtualParticles.forEach(vp => vp.material.opacity = 0);
            group.userData.animatedMeshes.resonators.forEach(r => r.material.opacity = 0);
            group.userData.animatedMeshes.arcs.forEach(arc => arc.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
