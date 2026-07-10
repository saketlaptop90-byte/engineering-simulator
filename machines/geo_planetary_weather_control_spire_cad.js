import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const spireHullMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.6, roughness: 0.4 }); // Weather-resistant composite
    const dipoleAntennaMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.2 }); // Silver-plated RF emitters
    const capacitorBankMat = new THREE.MeshPhysicalMaterial({ color: 0x223344, metalness: 0.8, roughness: 0.6 }); // Heavy electrical housings
    const glowingCoreMat = new THREE.MeshBasicMaterial({ color: 0x00aaff }); // High-voltage reactor core
    
    // VFX Materials
    const ionosphereBeamVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // RF energy beaming up
    const coronaDischargeVFX = new THREE.MeshBasicMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // St. Elmo's fire on the antennas
    const weatherFrontVFX = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 1.0, transmission: 0.8, opacity: 0.0, transparent: true }); // Simulated cloud nucleation

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rfBeam = null;
    group.userData.animatedMeshes.coronas = [];
    group.userData.animatedMeshes.clouds = [];
    group.userData.animatedMeshes.capacitors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Main Spire & Capacitors
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Central towering spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.2, 6.0, 16), spireHullMat);
    spire.position.y = 1.0;
    baseGroup.add(spire);
    
    // Massive super-capacitor banks around the base
    const numBanks = 8;
    for(let i=0; i<numBanks; i++) {
        const bankGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / numBanks;
        
        bankGroup.position.set(2.0 * Math.cos(angle), -1.5, 2.0 * Math.sin(angle));
        bankGroup.rotation.y = -angle;
        
        // Capacitor housing
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 1.2), capacitorBankMat);
        bankGroup.add(cap);
        
        // High-voltage feed lines to the spire
        class CableCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = -1.0 * t; // In towards spire
                const y = 0.5 + (1.5 * t); // Up towards feed point
                const z = 0;
                return optionalTarget.set(x, y, z);
            }
        }
        const cable = new THREE.Mesh(new THREE.TubeGeometry(new CableCurve(), 16, 0.05, 8, false), copper);
        bankGroup.add(cable);
        
        // Power level indicator light
        const light = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.1, 0.1), glowingCoreMat);
        light.position.set(0, 0.4, 0.6); // Front edge
        bankGroup.add(light);
        group.userData.animatedMeshes.capacitors.push(light);
        
        baseGroup.add(bankGroup);
    }
    
    group.add(baseGroup);
    parts.push({ mesh: baseGroup.children[1].children[0], name: "Graphene Super-Capacitor Banks", description: "Multi-terawatt rapid discharge energy storage.", function: "Stores the massive amounts of power required to pulse the ionospheric heaters, releasing it in microsecond bursts."});

    // ==========================================
    // 2. PROCEDURAL CAD: Phased Dipole Antenna Array
    // ==========================================
    // Mounted on the upper sections of the spire
    const antennaGroup = new THREE.Group();
    
    for(let tier=0; tier<4; tier++) {
        const yPos = 1.0 + (tier * 1.0);
        const radius = 1.0 - (tier * 0.15); // Tapers up
        const numAntennas = 12;
        
        for(let i=0; i<numAntennas; i++) {
            const angle = (i * Math.PI * 2) / numAntennas;
            
            // Dipole crossbar
            const dipole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6).rotateX(Math.PI/2), dipoleAntennaMat);
            dipole.position.set(radius * Math.cos(angle), yPos, radius * Math.sin(angle));
            dipole.rotation.y = -angle; // Face outward
            antennaGroup.add(dipole);
            
            // Corona discharge VFX point on the tips of the dipoles
            const corona1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), coronaDischargeVFX);
            corona1.position.set(radius * Math.cos(angle) - (Math.sin(angle)*0.3), yPos, radius * Math.sin(angle) + (Math.cos(angle)*0.3));
            antennaGroup.add(corona1);
            
            const corona2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), coronaDischargeVFX);
            corona2.position.set(radius * Math.cos(angle) + (Math.sin(angle)*0.3), yPos, radius * Math.sin(angle) - (Math.cos(angle)*0.3));
            antennaGroup.add(corona2);
            
            group.userData.animatedMeshes.coronas.push(corona1, corona2);
        }
    }
    
    group.add(antennaGroup);
    parts.push({ mesh: antennaGroup.children[0], name: "Phased Dipole Ionospheric Heater", description: "High-Frequency (HF) radio transmitter array.", function: "Beams focused RF energy into the ionosphere to locally heat and lift the atmosphere, steering jet streams and modifying global weather patterns."});

    // ==========================================
    // 3. PROCEDURAL CAD: RF Beam & Weather VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // The main RF energy beam shooting up into the sky
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.5, 15.0, 16), ionosphereBeamVFX);
    beam.position.y = 10.0;
    vfxGroup.add(beam);
    group.userData.animatedMeshes.rfBeam = beam;
    
    // Simulated cloud fronts forming above the spire
    for(let i=0; i<5; i++) {
        const cloud = new THREE.Mesh(new THREE.SphereGeometry(2.0 + Math.random(), 16, 16), weatherFrontVFX);
        cloud.position.set((Math.random()-0.5)*10, 12.0 + Math.random()*4, (Math.random()-0.5)*10);
        cloud.scale.y = 0.5; // Flattened clouds
        cloud.userData = { phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() };
        vfxGroup.add(cloud);
        group.userData.animatedMeshes.clouds.push(cloud);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Capacitor banks charge and pulse
            group.userData.animatedMeshes.capacitors.forEach(cap => {
                cap.material.opacity = 0.5 + (Math.sin(timeAcc * 15 * speed) * 0.5); // Rapid pulsing
            });
            
            // 2. Corona discharge crackles on the antennas
            group.userData.animatedMeshes.coronas.forEach(corona => {
                if(Math.random() < 0.3 * speed) {
                    corona.material.opacity = 0.5 + Math.random()*0.5;
                    corona.scale.setScalar(1.0 + Math.random());
                } else {
                    corona.material.opacity = 0;
                }
            });
            
            // 3. RF Beam fires upwards
            group.userData.animatedMeshes.rfBeam.material.opacity = 0.3 + (Math.sin(timeAcc * 20 * speed) * 0.2);
            group.userData.animatedMeshes.rfBeam.scale.x = 1.0 + (Math.sin(timeAcc * 10 * speed) * 0.1);
            group.userData.animatedMeshes.rfBeam.scale.z = 1.0 + (Math.sin(timeAcc * 10 * speed) * 0.1);
            
            // 4. Clouds rapidly form and swirl (Nucleation)
            group.userData.animatedMeshes.clouds.forEach(cloud => {
                cloud.material.opacity = 0.8 * speed;
                // Swirl around the beam
                cloud.position.x = Math.sin(timeAcc * cloud.userData.speed + cloud.userData.phase) * 5.0;
                cloud.position.z = Math.cos(timeAcc * cloud.userData.speed + cloud.userData.phase) * 5.0;
                // Thicken
                cloud.scale.y = 0.5 + (Math.sin(timeAcc * 2 * speed) * 0.2);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.capacitors.forEach(cap => cap.material.opacity = 0.2);
            group.userData.animatedMeshes.coronas.forEach(c => c.material.opacity = 0);
            group.userData.animatedMeshes.rfBeam.material.opacity = 0;
            group.userData.animatedMeshes.clouds.forEach(c => c.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
