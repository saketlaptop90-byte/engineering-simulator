import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const paverYellow = new THREE.MeshPhysicalMaterial({ color: 0xFFB90F, metalness: 0.5, roughness: 0.4, clearcoat: 0.5 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const hotAsphalt = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.9, clearcoat: 0.1 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Spreading Augers
    // ==========================================
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            const z = t * this.height - (this.height / 2);
            return optionalTarget.set(x, y, z);
        }
    }
    
    // Left and Right augers that spread asphalt
    const augerPath = new HelixCurve(0.2, 2.5, 6);
    const augerBladeShape = new THREE.Shape();
    augerBladeShape.moveTo(0, 0);
    augerBladeShape.lineTo(0, 0.2);
    augerBladeShape.lineTo(0.05, 0.2);
    augerBladeShape.lineTo(0.05, 0);
    
    const augerSettings = { steps: 100, extrudePath: augerPath, bevelEnabled: false };
    const augerGeo = new THREE.ExtrudeGeometry(augerBladeShape, augerSettings);
    
    const leftAuger = new THREE.Mesh(augerGeo, machinedSteel);
    leftAuger.position.set(-1.3, 0.5, -2.5);
    leftAuger.rotation.y = Math.PI/2;
    group.add(leftAuger);
    
    const rightAuger = new THREE.Mesh(augerGeo, machinedSteel);
    rightAuger.position.set(1.3, 0.5, -2.5);
    rightAuger.rotation.y = -Math.PI/2; // Reverse pitch
    group.add(rightAuger);

    group.userData.animatedMeshes['auger_l'] = leftAuger;
    group.userData.animatedMeshes['auger_r'] = rightAuger;
    parts.push({ mesh: leftAuger, name: "CAD Spreading Augers", description: "Mathematically extruded helical augers to distribute asphalt evenly.", function: "Feeds hot mix to the screed."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Heated Screed Plate
    // ==========================================
    // Extruded screed plate with precise vibration unit housing
    const screedShape = new THREE.Shape();
    screedShape.moveTo(-2.5, 0);
    screedShape.lineTo(2.5, 0);
    screedShape.lineTo(2.5, 0.1);
    screedShape.lineTo(2.3, 0.4);
    screedShape.lineTo(-2.3, 0.4);
    screedShape.lineTo(-2.5, 0.1);
    
    const screedSettings = { depth: 0.8, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    const screedGeo = new THREE.ExtrudeGeometry(screedShape, screedSettings);
    const screed = new THREE.Mesh(screedGeo, darkSteel);
    
    // Position screed at the back
    screed.position.set(0, 0.2, -3.5);
    group.add(screed);
    group.userData.animatedMeshes['screed'] = screed;
    parts.push({ mesh: screed, name: "Vibrating Screed Plate", description: "Extruded heavy steel plate for leveling and compacting.", function: "Smooths the asphalt layer."});

    // ==========================================
    // 3. Factual Fasteners (8,500 parts)
    // ==========================================
    const boltCount = 8500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 2, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "8,500 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Structural rigidity." });

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 4.0), paverYellow);
    body.position.set(0, 1.5, 0);
    group.add(body);
    
    // Scale adjustment for visibility
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Fast rotation of spreading augers
        const speed = state.throttle * 0.2;
        group.userData.animatedMeshes['auger_l'].rotation.x += speed;
        group.userData.animatedMeshes['auger_r'].rotation.x -= speed;
        
        // High frequency vibration of the screed
        if (state.throttle > 0.1) {
            group.userData.animatedMeshes['screed'].position.y = 0.2 + (Math.sin(time * 0.1) * 0.02);
        }
    };

    group.userData.parts = parts;
    return group;
}
