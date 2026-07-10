import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumChassis = new THREE.MeshPhysicalMaterial({ color: 0x99aabb, metalness: 0.8, roughness: 0.3 }); // Outer helmet shell
    const niobiumSQUID = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 }); // Superconducting sensors
    const cryogenTubing = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.2, roughness: 0.8 }); // Liquid helium lines
    const goldContacts = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 }); // Data uplink pins
    
    // VFX Materials
    const cryogenicVaporVFX = new THREE.MeshBasicMaterial({ color: 0xeeeeff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Liquid He boil-off
    const quantumCoherenceVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Superposition states
    const neuralSynapseVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Brainwave readouts

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.squids = [];
    group.userData.animatedMeshes.vapor = [];
    group.userData.animatedMeshes.synapses = [];
    group.userData.animatedMeshes.dataRings = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Titanium Chassis & Cryocooler
    // ==========================================
    const helmetGroup = new THREE.Group();
    
    // The main cranial dome (open at the bottom for the head)
    const domeGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI*2, 0, Math.PI/1.8);
    const dome = new THREE.Mesh(domeGeo, titaniumChassis);
    helmetGroup.add(dome);
    
    // Cryocooler backpack / rear module
    const cooler = new THREE.Group();
    cooler.position.set(0, 0, -0.7);
    
    // Compressor tank
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6).rotateX(Math.PI/2), steel);
    cooler.add(tank);
    
    // Radiator fins
    for(let i=0; i<6; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.02), aluminum);
        fin.position.set(0, 0, -0.2 + (i*0.1));
        cooler.add(fin);
    }
    
    // Thick insulated cryogen lines running from the cooler into the helmet
    for(let side of [-1, 1]) {
        class TubeCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Arc from back to side of helmet
                const angle = Math.PI - (t * Math.PI/2 * side);
                const r = 0.85;
                const x = r * Math.sin(angle);
                const z = r * Math.cos(angle);
                const y = -0.2 + (t * 0.4);
                return optionalTarget.set(x, y, z);
            }
        }
        const tube = new THREE.Mesh(new THREE.TubeGeometry(new TubeCurve(), 16, 0.04, 8, false), cryogenTubing);
        cooler.add(tube);
    }
    
    helmetGroup.add(cooler);
    
    group.add(helmetGroup);
    parts.push({ mesh: tank, name: "Liquid Helium Cryocooler", description: "Closed-loop micro-compressor.", function: "Chills the internal superconducting sensors down to 4 Kelvin, maintaining the fragile quantum states required for operation."});

    // ==========================================
    // 2. PROCEDURAL CAD: SQUID Arrays & Contacts
    // ==========================================
    // Superconducting QUantum Interference Devices
    const arrayGroup = new THREE.Group();
    
    // Map them inside the dome
    const numSensors = 64;
    for(let i=0; i<numSensors; i++) {
        // Fibonacci sphere mapping for even distribution on the upper hemisphere
        const phi = Math.acos(1 - (2 * (i + 0.5)) / (numSensors*2));
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        const r = 0.75; // Inside the dome
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(theta) * Math.sin(phi);
        
        const squidGroup = new THREE.Group();
        squidGroup.position.set(x, y, z);
        squidGroup.lookAt(0,0,0);
        
        // The SQUID housing
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08).rotateX(Math.PI/2), niobiumSQUID);
        squidGroup.add(housing);
        
        // Gold contact pin touching the scalp
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1).rotateX(Math.PI/2), goldContacts);
        pin.position.z = 0.05; // Extend inward
        squidGroup.add(pin);
        
        // Quantum Coherence indicator (VFX)
        const qGlow = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), quantumCoherenceVFX);
        qGlow.position.z = -0.05; // Back of the housing
        squidGroup.add(qGlow);
        
        arrayGroup.add(squidGroup);
        group.userData.animatedMeshes.squids.push({ mesh: qGlow, phase: Math.random() * Math.PI * 2 });
    }
    
    group.add(arrayGroup);
    parts.push({ mesh: arrayGroup.children[0].children[0], name: "SQUID Sensor Array", description: "Superconducting Quantum Interference Devices.", function: "Measures the incredibly faint magnetic fields generated by firing neurons with extreme precision, bypassing the skull entirely."});

    // ==========================================
    // 3. PROCEDURAL CAD: VFX (Vapor, Synapses, Data)
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Cryogenic Boil-off Vapor from the cooler
    for(let i=0; i<15; i++) {
        const vapor = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), cryogenicVaporVFX);
        vapor.userData = { t: Math.random(), xBase: (Math.random()-0.5)*0.4 };
        vfxGroup.add(vapor);
        group.userData.animatedMeshes.vapor.push(vapor);
    }
    
    // Neural Synapse visualizer (inside the helmet)
    // Simulating thought patterns as arcs of light
    for(let i=0; i<10; i++) {
        class SynapseCurve extends THREE.Curve {
            constructor() {
                super();
                // Random arc between two points inside the sphere
                this.p1 = new THREE.Vector3((Math.random()-0.5)*1.0, Math.random()*0.5, (Math.random()-0.5)*1.0);
                this.p2 = new THREE.Vector3((Math.random()-0.5)*1.0, Math.random()*0.5, (Math.random()-0.5)*1.0);
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const p = new THREE.Vector3().lerpVectors(this.p1, this.p2, t);
                p.y += Math.sin(t * Math.PI) * 0.2; // Arc upwards
                return optionalTarget.copy(p);
            }
        }
        const synGeo = new THREE.TubeGeometry(new SynapseCurve(), 16, 0.01, 4, false);
        const syn = new THREE.Mesh(synGeo, neuralSynapseVFX);
        syn.userData = { life: 0, active: false };
        vfxGroup.add(syn);
        group.userData.animatedMeshes.synapses.push(syn);
    }
    
    // Concentric Data Uplink Rings radiating upwards
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.02, 16, 64), quantumCoherenceVFX);
        ring.rotation.x = Math.PI/2;
        ring.userData = { yBase: i * 0.4 };
        vfxGroup.add(ring);
        group.userData.animatedMeshes.dataRings.push(ring);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. SQUIDs achieve quantum coherence
            group.userData.animatedMeshes.squids.forEach(sq => {
                // Throbs rapidly indicating active measurement
                sq.mesh.material.opacity = 0.5 + (Math.sin(timeAcc * 20 * speed + sq.phase) * 0.5);
            });
            
            // 2. Cryogenic Vapor boils off the back
            group.userData.animatedMeshes.vapor.forEach(vapor => {
                vapor.userData.t += 0.02 * speed;
                if (vapor.userData.t > 1.0) vapor.userData.t = 0.0;
                
                vapor.position.set(
                    vapor.userData.xBase + (Math.sin(timeAcc * 5 + vapor.userData.t*10) * 0.1),
                    0.2 - (vapor.userData.t * 1.5), // Falls downwards (cold gas)
                    -0.8 + (Math.cos(timeAcc * 4 + vapor.userData.t*10) * 0.1)
                );
                
                const scale = 1.0 + (vapor.userData.t * 2.0);
                vapor.scale.set(scale, scale, scale);
                vapor.material.opacity = (1.0 - vapor.userData.t) * 0.6 * speed;
            });
            
            // 3. Neural Synapses flash
            group.userData.animatedMeshes.synapses.forEach(syn => {
                if (!syn.userData.active && Math.random() < 0.05 * speed) {
                    syn.userData.active = true;
                    syn.userData.life = 1.0;
                }
                
                if (syn.userData.active) {
                    syn.userData.life -= 0.1 * speed;
                    syn.material.opacity = syn.userData.life;
                    if (syn.userData.life <= 0) syn.userData.active = false;
                }
            });
            
            // 4. Data Uplink rings pulse upwards
            group.userData.animatedMeshes.dataRings.forEach((ring, index) => {
                ring.userData.yBase += 0.02 * speed;
                if (ring.userData.yBase > 1.2) ring.userData.yBase = 0.0;
                
                ring.position.y = 0.8 + ring.userData.yBase;
                ring.material.opacity = (1.2 - ring.userData.yBase) * 0.8;
                
                const rScale = 1.0 + (ring.userData.yBase * 0.5);
                ring.scale.set(rScale, rScale, rScale);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.squids.forEach(sq => sq.mesh.material.opacity = 0.1);
            group.userData.animatedMeshes.vapor.forEach(v => v.material.opacity = 0);
            group.userData.animatedMeshes.synapses.forEach(s => s.material.opacity = 0);
            group.userData.animatedMeshes.dataRings.forEach(r => r.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
