import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2, clearcoat: 0.5 });
    const jdGreen = new THREE.MeshPhysicalMaterial({ color: 0x367C2B, metalness: 0.5, roughness: 0.3, clearcoat: 0.8 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Helical Auger
    // ==========================================
    // We mathematically calculate a 3D helical screw using ExtrudeGeometry on a custom Shape along a Curve
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
    
    const augerPath = new HelixCurve(0.4, 4.0, 10);
    const augerBladeShape = new THREE.Shape();
    augerBladeShape.moveTo(0, 0);
    augerBladeShape.lineTo(0, 0.4);
    augerBladeShape.lineTo(0.05, 0.4);
    augerBladeShape.lineTo(0.05, 0);
    
    const augerSettings = {
        steps: 200,
        extrudePath: augerPath,
        bevelEnabled: false
    };
    
    const augerBlade = new THREE.Mesh(new THREE.ExtrudeGeometry(augerBladeShape, augerSettings), machinedSteel);
    const augerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0, 32).rotateX(Math.PI/2), machinedSteel);
    
    const augerGroup = new THREE.Group();
    augerGroup.add(augerBlade, augerShaft);
    augerGroup.position.set(0, 1.0, 3.0);
    augerGroup.rotation.y = Math.PI/2;
    group.add(augerGroup);
    group.userData.animatedMeshes['auger'] = augerGroup;
    parts.push({ mesh: augerGroup, name: "Helical Header Auger", description: "Procedurally extruded helical screw curve for gathering crops.", function: "Feeds crops into the threshing drum." });

    // ==========================================
    // 2. PROCEDURAL CAD: The Threshing Drum (Lathe + Array)
    // ==========================================
    const drumPoints = [
        new THREE.Vector2(0, 1.0), new THREE.Vector2(0.8, 1.0),
        new THREE.Vector2(0.8, 0.9), new THREE.Vector2(0.6, 0.9),
        new THREE.Vector2(0.6, -0.9), new THREE.Vector2(0.8, -0.9),
        new THREE.Vector2(0.8, -1.0), new THREE.Vector2(0, -1.0)
    ];
    const drumGeo = new THREE.LatheGeometry(drumPoints, 64);
    const threshingDrum = new THREE.Mesh(drumGeo, machinedSteel);
    threshingDrum.rotation.z = Math.PI/2;
    threshingDrum.position.set(0, 2.5, 0);
    
    // Add rasp bars
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const barGeo = new THREE.BoxGeometry(2.0, 0.1, 0.1);
        const bar = new THREE.Mesh(barGeo, steel);
        bar.position.set(0, Math.cos(angle)*0.8, Math.sin(angle)*0.8);
        threshingDrum.add(bar);
    }
    
    group.add(threshingDrum);
    group.userData.animatedMeshes['threshing_drum'] = threshingDrum;
    parts.push({ mesh: threshingDrum, name: "Threshing Drum", description: "Lathed hollow drum with 8 precise rasp bars.", function: "Separates grain from the stalk."});

    // ==========================================
    // 3. 12200 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, 12200);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 12200; i++) {
        dummy.position.set((Math.random() - 0.5) * 3, Math.random() * 4, (Math.random() - 0.5) * 5);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "12200 Hex Fasteners", description: "Instanced procedural array of bolts.", function: "Structural support." });

    // Chassis & Cabin (Basic shells for visual context)
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 5.0), jdGreen);
    chassis.position.set(0, 2.0, -1.0);
    group.add(chassis);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        const speed = state.throttle;
        
        // Accurate Helical Auger rotation
        group.userData.animatedMeshes['auger'].rotation.x += 0.05 * speed;
        // Accurate Threshing Drum rotation
        group.userData.animatedMeshes['threshing_drum'].rotation.x += 0.2 * speed;
    };

    group.userData.parts = parts;
    return group;
}

