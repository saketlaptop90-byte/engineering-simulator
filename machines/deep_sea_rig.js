import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

function createLatticeMast(THREE, baseW, topW, height, segments) {
    const group = new THREE.Group();
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const ratio = i / segments;
        const w = baseW * (1 - ratio) + topW * ratio;
        const y = ratio * height;
        points.push([
            new THREE.Vector3(-w / 2, y, -w / 2),
            new THREE.Vector3(w / 2, y, -w / 2),
            new THREE.Vector3(w / 2, y, w / 2),
            new THREE.Vector3(-w / 2, y, w / 2)
        ]);
    }
    
    const createBeam = (p1, p2, radius) => {
        const distance = p1.distanceTo(p2);
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, distance, 8), steel);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        cylinder.position.copy(mid);
        
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        group.add(cylinder);
    };
    
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < 4; j++) {
            createBeam(points[i][j], points[i + 1][j], 0.6);
            createBeam(points[i][j], points[i][(j + 1) % 4], 0.4);
            createBeam(points[i][j], points[i + 1][(j + 1) % 4], 0.3);
            createBeam(points[i][(j + 1) % 4], points[i + 1][j], 0.3);
        }
    }
    for (let j = 0; j < 4; j++) {
        createBeam(points[segments][j], points[segments][(j + 1) % 4], 0.4);
    }
    return group;
}

function createPontoon(THREE) {
    const shape = new THREE.Shape();
    const width = 16;
    const height = 12;
    const radius = 4;
    
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
    
    const extrudeSettings = { depth: 100, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 1, bevelThickness: 1 };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    const mesh = new THREE.Mesh(geom, steel);
    return mesh;
}

function createColumn(THREE) {
    const group = new THREE.Group();
    const radius = 8;
    const height = 40;
    const colGeom = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false);
    const col = new THREE.Mesh(colGeom, darkSteel);
    col.position.y = height / 2;
    group.add(col);
    
    const ribGeom = new THREE.TorusGeometry(radius + 0.5, 0.5, 16, 32);
    for (let i = 1; i < 5; i++) {
        const rib = new THREE.Mesh(ribGeom, steel);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = i * (height / 5);
        group.add(rib);
    }
    
    const strakeGeom = new THREE.BoxGeometry(1, height, 1);
    for (let i = 0; i < 8; i++) {
        const strake = new THREE.Mesh(strakeGeom, darkSteel);
        strake.position.x = (radius + 0.2) * Math.cos(i * Math.PI / 4);
        strake.position.z = (radius + 0.2) * Math.sin(i * Math.PI / 4);
        strake.position.y = height / 2;
        strake.rotation.y = -i * Math.PI / 4;
        group.add(strake);
    }
    return group;
}

function createMainDeck(THREE) {
    const group = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-40, -40);
    shape.lineTo(40, -40);
    shape.lineTo(45, -30);
    shape.lineTo(45, 30);
    shape.lineTo(40, 40);
    shape.lineTo(-40, 40);
    shape.lineTo(-45, 30);
    shape.lineTo(-45, -30);
    shape.lineTo(-40, -40);
    
    const hole = new THREE.Path();
    hole.absarc(0, 0, 8, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    const settings = { depth: 6, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
    const geom = new THREE.ExtrudeGeometry(shape, settings);
    geom.center();
    const mesh = new THREE.Mesh(geom, darkSteel);
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);
    
    const detailGeom = new THREE.BoxGeometry(4, 2, 4);
    for (let i = 0; i < 30; i++) {
        const detail = new THREE.Mesh(detailGeom, steel);
        detail.position.set((Math.random() - 0.5) * 70, 4, (Math.random() - 0.5) * 70);
        if (detail.position.length() < 12) detail.position.x += 15;
        group.add(detail);
    }
    return group;
}

function createDrillBit(THREE) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2, 16), darkSteel);
    group.add(base);
    
    const coneGeom = new THREE.ConeGeometry(0.6, 1.5, 16);
    for (let i = 0; i < 3; i++) {
        const angle = i * (Math.PI * 2 / 3);
        const cone = new THREE.Mesh(coneGeom, chrome);
        cone.position.set(0.6 * Math.cos(angle), -1.2, 0.6 * Math.sin(angle));
        cone.rotation.x = Math.PI / 4;
        cone.rotation.y = angle;
        
        const toothGeom = new THREE.BoxGeometry(0.1, 0.2, 0.1);
        for (let j = 0; j < 10; j++) {
            const tooth = new THREE.Mesh(toothGeom, darkSteel);
            tooth.position.set(0.4 - j * 0.04, -0.5 + j * 0.1, 0);
            cone.add(tooth);
        }
        group.add(cone);
    }
    return group;
}

function createDrillSystem(THREE, animatedObjects) {
    const group = new THREE.Group();
    
    const topDrive = new THREE.Group();
    const tdBody = new THREE.Mesh(new THREE.BoxGeometry(5, 8, 5), plastic);
    const tdMotor = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 6, 16), copper);
    tdMotor.position.y = 5;
    topDrive.add(tdBody, tdMotor);
    topDrive.position.y = 40;
    
    const drillStringGroup = new THREE.Group();
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 180, 16), chrome);
    pipe.position.y = -50; 
    
    const bit = createDrillBit(THREE);
    bit.position.y = -140;
    
    drillStringGroup.add(pipe, bit);
    drillStringGroup.position.y = 40;
    
    group.add(topDrive, drillStringGroup);
    animatedObjects.push({ mesh: topDrive, type: "topDrive" });
    animatedObjects.push({ mesh: drillStringGroup, type: "drillString" });
    
    return group;
}

function createBOP(THREE) {
    const group = new THREE.Group();
    const frame = createLatticeMast(THREE, 12, 12, 35, 4); 
    frame.position.y = -17.5;
    group.add(frame);
    
    for (let i = 0; i < 4; i++) {
        const ram = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 4.5, 16), chrome);
        ram.position.y = -10 + i * 6;
        group.add(ram);
        
        const act1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 16, 16), plastic);
        act1.rotation.z = Math.PI / 2;
        act1.position.y = ram.position.y;
        group.add(act1);
        
        const act2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 16, 16), plastic);
        act2.rotation.x = Math.PI / 2;
        act2.position.y = ram.position.y;
        group.add(act2);
    }
    
    const lmrp = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16), darkSteel);
    lmrp.position.y = 18;
    group.add(lmrp);
    
    return group;
}

function createHelipad(THREE) {
    const group = new THREE.Group();
    const supportGeom = new THREE.CylinderGeometry(1, 1, 20, 8);
    for (let i = 0; i < 4; i++) {
        const s = new THREE.Mesh(supportGeom, steel);
        s.position.set((i % 2 === 0 ? 1 : -1) * 5, -10, (i < 2 ? 1 : -1) * 5);
        s.rotation.x = (i < 2 ? -1 : 1) * Math.PI / 6;
        s.rotation.z = (i % 2 === 0 ? 1 : -1) * Math.PI / 6;
        group.add(s);
    }
    
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 1, 32), aluminum);
    group.add(pad);
    const net = new THREE.Mesh(new THREE.TorusGeometry(17, 0.2, 8, 64), steel);
    group.add(net);
    
    const hMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x555555 });
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 2), hMat);
    h1.position.set(0, 0.6, -3);
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 2), hMat);
    h2.position.set(0, 0.6, 3);
    const h4 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 6), hMat);
    h4.position.set(0, 0.6, 0);
    group.add(h1, h2, h4);
    
    return group;
}

function createCraneSystem(THREE, x, z, rotY, offset, animatedObjects) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 16), steel);
    base.position.y = 4;
    group.add(base);
    
    const rotatingPart = new THREE.Group();
    rotatingPart.position.y = 8;
    
    const cab = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 6), plastic);
    cab.position.set(0, 2, -1);
    
    const window = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2, 1), glass);
    window.position.set(0, 2.5, 2);
    rotatingPart.add(cab, window);
    
    const boom = createLatticeMast(THREE, 2.5, 1, 45, 6);
    boom.rotation.x = -Math.PI / 3;
    boom.position.set(0, 2, 2);
    rotatingPart.add(boom);
    
    const tipY = 45 * Math.cos(Math.PI / 3) + 2;
    const tipZ = 45 * Math.sin(Math.PI / 3) + 2;
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 35, 8), darkSteel);
    cable.position.set(0, tipY - 17.5, tipZ);
    rotatingPart.add(cable);
    
    group.add(rotatingPart);
    group.position.set(x, 13, z);
    group.rotation.y = rotY;
    
    animatedObjects.push({ mesh: rotatingPart, type: "crane", offset: offset });
    return group;
}

function createFlareBoomSystem(THREE, animatedObjects) {
    const group = new THREE.Group();
    const boom = createLatticeMast(THREE, 5, 1.5, 60, 10);
    boom.rotation.z = -Math.PI / 2;
    
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 5, 16), darkSteel);
    tip.position.set(62, 0, 0);
    tip.rotation.z = -Math.PI / 2;
    
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, transparent: true, opacity: 0.8 });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 16), flameMat);
    flame.position.set(68, 0, 0);
    flame.rotation.z = -Math.PI / 2;
    
    group.add(boom, tip, flame);
    group.position.set(40, 25, 0);
    
    animatedObjects.push({ mesh: flame, type: "flare" });
    return group;
}

function createAccommodationBlock(THREE, animatedObjects) {
    const group = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const floor = new THREE.Mesh(new THREE.BoxGeometry(32, 4, 16), steel);
        floor.position.y = i * 4 + 2;
        group.add(floor);
        
        const windows = new THREE.Mesh(new THREE.BoxGeometry(32.2, 2.5, 16.2), tinted);
        windows.position.y = i * 4 + 2;
        group.add(windows);
    }
    
    const radarGroup = new THREE.Group();
    const radarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3), steel);
    const radarDish = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.5), plastic);
    radarDish.position.y = 1.5;
    radarGroup.add(radarBase, radarDish);
    radarGroup.position.set(0, 23, -4);
    group.add(radarGroup);
    
    animatedObjects.push({ mesh: radarGroup, type: "radar" });
    group.position.set(0, 13, 26);
    return group;
}

function createLifeboats(THREE) {
    const group = new THREE.Group();
    const positions = [
        { x: -44, z: 20 }, { x: -44, z: -20 },
        { x: 44, z: 20 }, { x: 44, z: -20 }
    ];
    
    positions.forEach(pos => {
        const boatGroup = new THREE.Group();
        const boat = new THREE.Mesh(new THREE.CapsuleGeometry(1.8, 4.5, 8, 16), rubber); 
        boat.rotation.x = Math.PI / 2;
        boatGroup.add(boat);
        
        const davitGeom = new THREE.CylinderGeometry(0.4, 0.4, 7, 8);
        const d1 = new THREE.Mesh(davitGeom, steel);
        d1.position.set(0, 3.5, 2.5);
        d1.rotation.x = Math.PI / 4;
        
        const d2 = new THREE.Mesh(davitGeom, steel);
        d2.position.set(0, 3.5, -2.5);
        d2.rotation.x = -Math.PI / 4;
        
        boatGroup.add(d1, d2);
        boatGroup.position.set(pos.x, 8, pos.z);
        group.add(boatGroup);
    });
    return group;
}

function createMooringWinch(THREE) {
    const group = new THREE.Group();
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 10, 32), darkSteel);
    drum.rotation.x = Math.PI / 2;
    group.add(drum);
    
    for (let i = -4.5; i <= 4.5; i += 0.6) {
        const rope = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.3, 8, 32), steel);
        rope.position.z = i;
        group.add(rope);
    }
    
    const flangeGeom = new THREE.CylinderGeometry(5.5, 5.5, 0.6, 32);
    const f1 = new THREE.Mesh(flangeGeom, steel);
    f1.rotation.x = Math.PI / 2;
    f1.position.z = -5.3;
    const f2 = new THREE.Mesh(flangeGeom, steel);
    f2.rotation.x = Math.PI / 2;
    f2.position.z = 5.3;
    group.add(f1, f2);
    
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 5, 16), copper);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(0, 0, -8);
    group.add(motor);
    
    const gearToothGeom = new THREE.BoxGeometry(0.6, 1.2, 0.6);
    for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2;
        const tooth = new THREE.Mesh(gearToothGeom, darkSteel);
        tooth.position.set(5.5 * Math.cos(angle), 5.5 * Math.sin(angle), -5.3);
        tooth.rotation.z = angle;
        group.add(tooth);
    }
    return group;
}

function createAllMooringWinches(THREE) {
    const group = new THREE.Group();
    const pos = [
        { x: -35, z: -35, r: 0 }, { x: 35, z: -35, r: Math.PI },
        { x: -35, z: 35, r: 0 }, { x: 35, z: 35, r: Math.PI }
    ];
    pos.forEach(p => {
        const winch = createMooringWinch(THREE);
        winch.position.set(p.x, 15, p.z);
        winch.rotation.y = p.r;
        group.add(winch);
    });
    return group;
}

function createMooringLinesSystem(THREE) {
    const group = new THREE.Group();
    const cols = [
        { x: -35, z: -35 }, { x: 35, z: -35 },
        { x: -35, z: 35 }, { x: 35, z: 35 }
    ];
    
    cols.forEach(col => {
        for (let i = 0; i < 3; i++) {
            const angle = Math.atan2(col.z, col.x) + (i - 1) * 0.25;
            const startX = col.x;
            const startZ = col.z;
            const endX = startX + 250 * Math.cos(angle);
            const endZ = startZ + 250 * Math.sin(angle);
            const endY = -150;
            const midX = (startX + endX) / 2;
            const midZ = (startZ + endZ) / 2;
            const midY = endY / 2 - 35; 
            
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(startX, -10, startZ),
                new THREE.Vector3(midX, midY, midZ),
                new THREE.Vector3(endX, endY, endZ)
            ]);
            
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.6, 8, false), darkSteel);
            group.add(tube);
        }
    });
    return group;
}

function createPipeRacks(THREE) {
    const group = new THREE.Group();
    const rackW = 12;
    const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 18, 8);
    for (let x = -rackW / 2; x < rackW / 2; x += 0.8) {
        for (let y = 0; y < 5; y += 0.8) {
            const pipe = new THREE.Mesh(pipeGeom, chrome);
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(x, y, 0);
            group.add(pipe);
        }
    }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(rackW + 2, 6, 20), steel);
    frame.position.y = 2;
    group.add(frame);
    group.position.set(20, 13, 0);
    return group;
}

function createOffRoadTire(THREE) {
    const group = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.TorusGeometry(2, 0.8, 16, 64), rubber);
    group.add(tire);
    
    const lugGeom = new THREE.BoxGeometry(1.8, 0.4, 0.4);
    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const lug = new THREE.Mesh(lugGeom, rubber);
        lug.position.set((2.8) * Math.cos(angle), (2.8) * Math.sin(angle), 0);
        lug.rotation.z = angle;
        group.add(lug);
    }
    
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.8, 32), chrome);
    rim.rotation.x = Math.PI / 2;
    group.add(rim);
    
    const spokeGeom = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    for (let i = 0; i < 8; i++) {
        const spoke = new THREE.Mesh(spokeGeom, steel);
        spoke.rotation.z = (i / 8) * Math.PI * 2;
        spoke.rotation.x = Math.PI / 2;
        group.add(spoke);
    }
    return group;
}

function createPipeHandler(THREE, animatedObjects) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 14), plastic);
    body.position.y = 2.5;
    group.add(body);
    
    const cab = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), tinted);
    cab.position.set(0, 5.5, 3);
    group.add(cab);
    
    const tirePos = [
        { x: -4, z: 4 }, { x: 4, z: 4 },
        { x: -4, z: -4 }, { x: 4, z: -4 }
    ];
    tirePos.forEach(p => {
        const tire = createOffRoadTire(THREE);
        tire.position.set(p.x, 2.8, p.z);
        tire.rotation.y = Math.PI / 2;
        group.add(tire);
    });
    
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 16), steel);
    arm.position.set(0, 4.5, -5);
    group.add(arm);
    
    const claw = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 16, 1, true, 0, Math.PI), steel);
    claw.position.set(0, 4.5, -13);
    claw.rotation.z = Math.PI / 2;
    group.add(claw);
    
    group.position.set(-18, 13.2, -10);
    animatedObjects.push({ mesh: group, type: "vehicle" });
    return group;
}

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatedObjects = [];

    const addPart = (mesh, config) => {
        group.add(mesh);
        parts.push({
            name: config.name,
            description: config.description,
            material: config.material,
            function: config.function,
            assemblyOrder: parts.length + 1,
            connections: config.connections || [],
            failureEffect: config.failureEffect || "Operational downtime.",
            cascadeFailures: config.cascadeFailures || [],
            originalPosition: config.originalPosition,
            explodedPosition: config.explodedPosition,
        });
    };

    // 1. Port Pontoon
    const pontoonPort = createPontoon(THREE);
    pontoonPort.position.set(-35, -30, 0);
    addPart(pontoonPort, {
        name: "Port Pontoon",
        description: "Massive buoyant hull structure providing primary floatation.",
        material: "Steel",
        function: "Buoyancy & Ballast",
        originalPosition: { x: -35, y: -30, z: 0 },
        explodedPosition: { x: -80, y: -50, z: 0 }
    });

    // 2. Starboard Pontoon
    const pontoonStbd = createPontoon(THREE);
    pontoonStbd.position.set(35, -30, 0);
    addPart(pontoonStbd, {
        name: "Starboard Pontoon",
        description: "Massive buoyant hull structure providing primary floatation.",
        material: "Steel",
        function: "Buoyancy & Ballast",
        originalPosition: { x: 35, y: -30, z: 0 },
        explodedPosition: { x: 80, y: -50, z: 0 }
    });

    // 3. Fwd Port Column
    const colFP = createColumn(THREE);
    colFP.position.set(-35, -10, -35);
    addPart(colFP, {
        name: "Forward Port Column",
        description: "Vertical stabilizing column housing ballast tanks.",
        material: "Dark Steel",
        function: "Stabilization",
        originalPosition: { x: -35, y: -10, z: -35 },
        explodedPosition: { x: -60, y: 10, z: -60 }
    });

    // 4. Fwd Starboard Column
    const colFS = createColumn(THREE);
    colFS.position.set(35, -10, -35);
    addPart(colFS, {
        name: "Forward Starboard Column",
        description: "Vertical stabilizing column housing ballast tanks.",
        material: "Dark Steel",
        function: "Stabilization",
        originalPosition: { x: 35, y: -10, z: -35 },
        explodedPosition: { x: 60, y: 10, z: -60 }
    });

    // 5. Aft Port Column
    const colAP = createColumn(THREE);
    colAP.position.set(-35, -10, 35);
    addPart(colAP, {
        name: "Aft Port Column",
        description: "Vertical stabilizing column housing ballast tanks.",
        material: "Dark Steel",
        function: "Stabilization",
        originalPosition: { x: -35, y: -10, z: 35 },
        explodedPosition: { x: -60, y: 10, z: 60 }
    });

    // 6. Aft Starboard Column
    const colAS = createColumn(THREE);
    colAS.position.set(35, -10, 35);
    addPart(colAS, {
        name: "Aft Starboard Column",
        description: "Vertical stabilizing column housing ballast tanks.",
        material: "Dark Steel",
        function: "Stabilization",
        originalPosition: { x: 35, y: -10, z: 35 },
        explodedPosition: { x: 60, y: 10, z: 60 }
    });

    // 7. Main Deck
    const mainDeck = createMainDeck(THREE);
    mainDeck.position.set(0, 10, 0);
    addPart(mainDeck, {
        name: "Main Deck",
        description: "Primary operational platform supporting all drilling modules.",
        material: "Dark Steel",
        function: "Structural Support",
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 8. Derrick Tower
    const derrick = createLatticeMast(THREE, 16, 6, 80, 10);
    derrick.position.set(0, 13, 0);
    addPart(derrick, {
        name: "Derrick Tower",
        description: "Towering lattice structure facilitating the lifting of drill strings.",
        material: "Steel",
        function: "Lifting & Drilling Support",
        originalPosition: { x: 0, y: 13, z: 0 },
        explodedPosition: { x: 0, y: 120, z: 0 }
    });

    // 9. Drill System
    const drillSystem = createDrillSystem(THREE, animatedObjects);
    drillSystem.position.set(0, 13, 0);
    addPart(drillSystem, {
        name: "Drill System",
        description: "Top drive, drill pipe, and drill bit executing the deep-sea boring.",
        material: "Chrome / Plastic",
        function: "Boring & Torque",
        originalPosition: { x: 0, y: 13, z: 0 },
        explodedPosition: { x: 0, y: 180, z: 0 }
    });

    // 10. Subsea BOP
    const bop = createBOP(THREE);
    bop.position.set(0, -140, 0);
    addPart(bop, {
        name: "Subsea Blowout Preventer (BOP)",
        description: "Critical safety valve stack on the seafloor preventing blowouts.",
        material: "Dark Steel / Chrome",
        function: "Well Control",
        originalPosition: { x: 0, y: -140, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // 11. Helipad
    const helipad = createHelipad(THREE);
    helipad.position.set(-50, 20, -50);
    addPart(helipad, {
        name: "Helipad",
        description: "Cantilevered landing zone for crew transfer helicopters.",
        material: "Aluminum",
        function: "Crew Transport",
        originalPosition: { x: -50, y: 20, z: -50 },
        explodedPosition: { x: -80, y: 60, z: -80 }
    });

    // 12. Port Crane
    const craneP = createCraneSystem(THREE, -35, 13, 35, 0, animatedObjects);
    addPart(craneP, {
        name: "Port Heavy-Lift Crane",
        description: "Lattice boom crane for material handling and resupply.",
        material: "Plastic / Steel",
        function: "Material Handling",
        originalPosition: { x: -35, y: 13, z: 35 },
        explodedPosition: { x: -60, y: 70, z: 60 }
    });

    // 13. Starboard Crane
    const craneS = createCraneSystem(THREE, 35, 13, -35, Math.PI, animatedObjects);
    addPart(craneS, {
        name: "Starboard Heavy-Lift Crane",
        description: "Lattice boom crane for material handling and resupply.",
        material: "Plastic / Steel",
        function: "Material Handling",
        originalPosition: { x: 35, y: 13, z: -35 },
        explodedPosition: { x: 60, y: 70, z: -60 }
    });

    // 14. Flare Boom
    const flareBoom = createFlareBoomSystem(THREE, animatedObjects);
    addPart(flareBoom, {
        name: "Flare Boom",
        description: "Extended boom for safely burning off excess volatile gases.",
        material: "Steel",
        function: "Gas Venting",
        originalPosition: { x: 40, y: 25, z: 0 },
        explodedPosition: { x: 100, y: 40, z: 0 }
    });

    // 15. Accommodation Block
    const accomBlock = createAccommodationBlock(THREE, animatedObjects);
    addPart(accomBlock, {
        name: "Accommodation Block",
        description: "Living quarters and central command bridge for rig personnel.",
        material: "Steel / Tinted Glass",
        function: "Housing & Command",
        originalPosition: { x: 0, y: 13, z: 26 },
        explodedPosition: { x: 0, y: 80, z: 50 }
    });

    // 16. Lifeboats
    const lifeboats = createLifeboats(THREE);
    addPart(lifeboats, {
        name: "Lifeboats",
        description: "Totally enclosed motor propelled survival crafts (TEMPSC).",
        material: "Rubber / Steel",
        function: "Emergency Evacuation",
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 100 }
    });

    // 17. Mooring Winches
    const winches = createAllMooringWinches(THREE);
    addPart(winches, {
        name: "Mooring Winches",
        description: "Massive winches controlling tension on anchor lines.",
        material: "Dark Steel",
        function: "Positioning",
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: -40 }
    });

    // 18. Mooring Lines
    const mooringLines = createMooringLinesSystem(THREE);
    addPart(mooringLines, {
        name: "Mooring Lines",
        description: "High-tension catenary cables anchoring the rig to the seabed.",
        material: "Dark Steel",
        function: "Anchoring",
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // 19. Drill Pipe Racks
    const racks = createPipeRacks(THREE);
    addPart(racks, {
        name: "Drill Pipe Racks",
        description: "Storage staging area for thousands of feet of drill casing.",
        material: "Chrome / Steel",
        function: "Pipe Storage",
        originalPosition: { x: 20, y: 13, z: 0 },
        explodedPosition: { x: 50, y: 60, z: 0 }
    });

    // 20. Heavy Pipe Handler Vehicle
    const pipeHandler = createPipeHandler(THREE, animatedObjects);
    addPart(pipeHandler, {
        name: "Rough-Terrain Pipe Handler",
        description: "Heavy duty vehicle with aggressive off-road treads for moving drill casing.",
        material: "Plastic / Rubber",
        function: "Logistics",
        originalPosition: { x: -18, y: 13.2, z: -10 },
        explodedPosition: { x: -40, y: 30, z: -20 }
    });

    function animate(time, speed, meshes) {
        animatedObjects.forEach(obj => {
            if (obj.type === "drillString") {
                obj.mesh.rotation.y += speed * 0.1;
            } else if (obj.type === "topDrive") {
                obj.mesh.position.y = 40 + Math.sin(time * 0.5) * 20;
            } else if (obj.type === "crane") {
                obj.mesh.rotation.y = Math.sin(time * 0.2 + obj.offset) * 1.2;
            } else if (obj.type === "flare") {
                const s = 1 + Math.random() * 0.3;
                obj.mesh.scale.set(s, s, s);
            } else if (obj.type === "radar") {
                obj.mesh.rotation.y += speed * 0.05;
            } else if (obj.type === "vehicle") {
                obj.mesh.position.z = -10 + Math.sin(time * 0.4) * 8;
            }
        });
    }

    const description = "Ultra-Deepwater Semi-Submersible Drilling Rig. A massive, dynamically positioned or moored floating platform capable of drilling in thousands of meters of water. Features a complex lattice derrick, deep-sea subsea blowout preventer (BOP), massive buoyancy pontoons, extreme heavy lift lattice cranes, and detailed deck machinery including an aggressive off-road pipe handling vehicle.";
    
    const quizQuestions = [
        {
            question: "What is the primary function of the Subsea Blowout Preventer (BOP)?",
            options: ["To pump mud into the well", "To seal the well in an emergency to prevent an uncontrolled blowout", "To generate power for the rig", "To filter sea water for crew usage"],
            correctAnswer: 1,
            explanation: "The BOP is a critical safety valve stack sitting on the seafloor designed to close off the wellbore during an emergency."
        },
        {
            question: "Why does a semi-submersible rig use large submerged pontoons rather than a traditional ship hull?",
            options: ["To minimize the effect of wave action and provide extreme stability", "To travel at high speeds across the ocean", "To store more oil", "To act as a submarine"],
            correctAnswer: 0,
            explanation: "Submerging the massive pontoons below the turbulent surface wave action drastically increases the rig's stability, which is essential for deep-sea drilling."
        },
        {
            question: "What mechanism drives the rotational torque of the drill string in modern deep-sea rigs?",
            options: ["The Mooring Winches", "The Blowout Preventer", "The Top Drive", "The Flare Boom"],
            correctAnswer: 2,
            explanation: "The Top Drive is a heavy duty motor suspended in the derrick that turns the drill string and facilitates the boring process."
        },
        {
            question: "What is the purpose of the catenary sag in the massive mooring lines?",
            options: ["To save material costs", "To act as a shock absorber against ocean currents and heave", "To catch fish", "To generate electricity"],
            correctAnswer: 1,
            explanation: "The heavy sagging curve of the mooring lines allows the system to absorb immense kinetic energy from waves by lifting the heavy chain/wire before pulling tight on the anchor."
        },
        {
            question: "Why is the flare boom extended so far away from the main deck structure?",
            options: ["For aesthetic purposes", "To act as a counterbalance to the cranes", "To provide a mounting point for the helipad", "To keep intense heat and combustible gases safely away from personnel and equipment"],
            correctAnswer: 3,
            explanation: "Flaring off excess gas generates intense heat and poses a fire hazard; extending it far outboard on a long lattice boom keeps the main rig safe."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDeepSeaRig() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
