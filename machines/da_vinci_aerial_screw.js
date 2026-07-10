import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials matching historical aesthetic but integrating high-tech properties
    const oakWood = new THREE.MeshStandardMaterial({
        color: 0x5c4033, roughness: 0.9, metalness: 0.1, bumpScale: 0.05
    });
    const darkWalnut = new THREE.MeshStandardMaterial({
        color: 0x3e2723, roughness: 0.95, metalness: 0.05
    });
    const linenFabric = new THREE.MeshStandardMaterial({
        color: 0xe8e4c9, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
    });
    const hempRope = new THREE.MeshStandardMaterial({
        color: 0xc2a67a, roughness: 1.0, metalness: 0.0
    });
    const leather = new THREE.MeshStandardMaterial({
        color: 0x5c3a21, roughness: 0.8, metalness: 0.1
    });
    const glowingAether = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.8
    });
    const glowingRune = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.5, roughness: 0.5, metalness: 0.5
    });

    const baseElevation = 4.0;
    const floorRadius = 10;
    const plankThickness = 0.3;
    const platformHeight = 1.5;

    // The main superstructure that will bounce on the hydraulics
    const superStructure = new THREE.Group();
    superStructure.position.y = baseElevation;
    group.add(superStructure);
    meshes.superStructure = superStructure;

    // 1. Off-Road Undercarriage (CRITICAL MANDATE)
    const undercarriageGroup = new THREE.Group();
    group.add(undercarriageGroup);

    // Axles
    const axleGeo = new THREE.CylinderGeometry(0.3, 0.3, floorRadius * 2 + 4, 16);
    axleGeo.rotateZ(Math.PI/2);
    
    const frontAxle = new THREE.Mesh(axleGeo, darkSteel);
    frontAxle.position.set(0, 2.0, floorRadius - 2);
    undercarriageGroup.add(frontAxle);
    
    const rearAxle = new THREE.Mesh(axleGeo, darkSteel);
    rearAxle.position.set(0, 2.0, -floorRadius + 2);
    undercarriageGroup.add(rearAxle);

    function createOffRoadWheel(radius, tube, lugCount) {
        const wheelGroup = new THREE.Group();
        
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        const lugGeo = new THREE.BoxGeometry(tube * 1.5, tube * 0.4, tube * 0.8);
        for(let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * (radius + tube * 0.8), Math.sin(angle) * (radius + tube * 0.8), 0);
            lug.rotation.z = angle;
            lug.position.z = i % 2 === 0 ? tube * 0.3 : -tube * 0.3;
            lug.rotation.x = i % 2 === 0 ? 0.2 : -0.2;
            wheelGroup.add(lug);
        }

        const rimGeo = new THREE.CylinderGeometry(radius - tube * 0.8, radius - tube * 0.8, tube * 2, 32);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, chrome);
        wheelGroup.add(rim);

        const spokeCount = 12;
        const spokeGeo = new THREE.CylinderGeometry(0.05, 0.05, radius - tube, 16);
        spokeGeo.rotateY(Math.PI / 2);
        for(let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spoke1 = new THREE.Mesh(spokeGeo, chrome);
            spoke1.position.set(Math.cos(angle) * (radius / 2), Math.sin(angle) * (radius / 2), tube * 0.8);
            spoke1.rotation.z = angle;
            spoke1.rotation.x = -0.2; 
            wheelGroup.add(spoke1);

            const spoke2 = new THREE.Mesh(spokeGeo, chrome);
            spoke2.position.set(Math.cos(angle) * (radius / 2), Math.sin(angle) * (radius / 2), -tube * 0.8);
            spoke2.rotation.z = angle;
            spoke2.rotation.x = 0.2;
            wheelGroup.add(spoke2);
        }

        const hubGeo = new THREE.CylinderGeometry(tube * 1.5, tube * 1.5, tube * 2.5, 16);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        wheelGroup.add(hub);

        return wheelGroup;
    }

    const wheelRadius = 2.0;
    const wheelTube = 0.6;
    meshes.wheels = [];

    const wheelPositions = [
        new THREE.Vector3(-floorRadius - 1.0, wheelRadius, floorRadius - 2),
        new THREE.Vector3(floorRadius + 1.0, wheelRadius, floorRadius - 2),
        new THREE.Vector3(-floorRadius - 1.0, wheelRadius, -floorRadius + 2),
        new THREE.Vector3(floorRadius + 1.0, wheelRadius, -floorRadius + 2)
    ];

    wheelPositions.forEach(pos => {
        const wheel = createOffRoadWheel(wheelRadius, wheelTube, 80);
        wheel.position.copy(pos);
        wheel.rotation.y = Math.PI / 2;
        undercarriageGroup.add(wheel);
        meshes.wheels.push(wheel);
    });

    // Hydraulic Suspension
    meshes.pistons = [];
    wheelPositions.forEach((pos, idx) => {
        const suspensionGroup = new THREE.Group();
        
        const outerCylGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.0, 16);
        const outerCyl = new THREE.Mesh(outerCylGeo, copper);
        outerCyl.position.set(pos.x, baseElevation - 0.2, pos.z);
        suspensionGroup.add(outerCyl);

        const innerCylGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16);
        const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
        innerCyl.position.set(pos.x, baseElevation - 1.5, pos.z);
        suspensionGroup.add(innerCyl);
        
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos.x, baseElevation - 0.5, pos.z),
            new THREE.Vector3(pos.x * 0.7, baseElevation + 0.5, pos.z * 0.7),
            new THREE.Vector3(0, baseElevation + 1.0, 0)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const line = new THREE.Mesh(tubeGeo, rubber);
        suspensionGroup.add(line);

        group.add(suspensionGroup);
        meshes.pistons.push({ outer: outerCyl, inner: innerCyl, baseY: baseElevation - 1.5 });
    });

    // 2. Base Floor Planks and Pillars
    const floorGroup = new THREE.Group();
    floorGroup.position.y = platformHeight;
    superStructure.add(floorGroup);

    const plankWidth = 0.5;
    const plankGap = 0.02;
    const planks = new THREE.Group();
    for (let x = -floorRadius + plankWidth / 2; x < floorRadius; x += plankWidth + plankGap) {
        const zSpan = Math.sqrt(floorRadius * floorRadius - x * x);
        if (zSpan > 0.5) {
            const plankGeo = new THREE.BoxGeometry(plankWidth, plankThickness, zSpan * 2);
            const plank = new THREE.Mesh(plankGeo, oakWood);
            plank.position.set(x, plankThickness / 2, 0);
            
            const nailGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8);
            nailGeo.rotateX(Math.PI / 2);
            for(let nz of [-zSpan + 0.2, 0, zSpan - 0.2]) {
                const nail = new THREE.Mesh(nailGeo, darkSteel);
                nail.position.set(0, plankThickness / 2, nz);
                nail.rotation.x = Math.PI / 2;
                plank.add(nail);
            }
            planks.add(plank);
        }
    }
    floorGroup.add(planks);
    
    const rimGeo = new THREE.TorusGeometry(floorRadius, 0.4, 32, 100);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, darkWalnut);
    rim.position.y = plankThickness / 2;
    floorGroup.add(rim);

    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, platformHeight, 16);
    for(let r = 2; r <= floorRadius; r += 3) {
        const numPillars = r * 3;
        for(let i = 0; i < numPillars; i++) {
            const angle = (i / numPillars) * Math.PI * 2;
            const pillar = new THREE.Mesh(pillarGeo, oakWood);
            pillar.position.set(Math.cos(angle) * r, platformHeight / 2, Math.sin(angle) * r);
            superStructure.add(pillar);
            
            if (i > 0) {
                const prevAngle = ((i - 1) / numPillars) * Math.PI * 2;
                const p1 = new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);
                const p2 = new THREE.Vector3(Math.cos(prevAngle) * r, platformHeight, Math.sin(prevAngle) * r);
                const dist = p1.distanceTo(p2);
                const braceGeo = new THREE.CylinderGeometry(0.05, 0.05, dist, 8);
                const brace = new THREE.Mesh(braceGeo, darkWalnut);
                const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                brace.position.copy(mid);
                brace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
                superStructure.add(brace);
            }
        }
    }

    // Da Vinci's Aether-Control Panel
    const deskGroup = new THREE.Group();
    deskGroup.position.set(floorRadius - 2.5, platformHeight + plankThickness, 0);
    
    const consoleGeo = new THREE.BoxGeometry(1.5, 1.2, 1.0);
    const consoleMesh = new THREE.Mesh(consoleGeo, copper);
    consoleMesh.position.y = 0.6;
    deskGroup.add(consoleMesh);

    const screenGeo = new THREE.PlaneGeometry(1.2, 0.7);
    const screenMesh = new THREE.Mesh(screenGeo, glowingAether);
    screenMesh.position.set(-0.76, 0.8, 0);
    screenMesh.rotation.y = -Math.PI / 2;
    deskGroup.add(screenMesh);

    for(let z of [-0.3, 0.3]) {
        const stickBaseGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const stickBase = new THREE.Mesh(stickBaseGeo, darkSteel);
        stickBase.position.set(0.2, 1.2, z);
        deskGroup.add(stickBase);

        const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const stick = new THREE.Mesh(stickGeo, chrome);
        stick.position.set(0.2, 1.4, z);
        stick.rotation.z = 0.2;
        deskGroup.add(stick);

        const knobGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const knob = new THREE.Mesh(knobGeo, glowingRune);
        knob.position.set(0.12, 1.58, z);
        deskGroup.add(knob);
    }
    
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(0.76, 0.5, 0);
    for(let z = -0.4; z <= 0.4; z += 0.1) {
        const barGeo = new THREE.BoxGeometry(0.02, 0.8, 0.02);
        const bar = new THREE.Mesh(barGeo, steel);
        bar.position.set(0, 0, z);
        grilleGroup.add(bar);
    }
    deskGroup.add(grilleGroup);

    // Articulating Boom Arm Sensor
    const boomArmGroup = new THREE.Group();
    boomArmGroup.position.set(0, 1.2, 0.4);
    deskGroup.add(boomArmGroup);

    const boomBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8), darkSteel);
    boomArmGroup.add(boomBase);

    const lowerBoom = new THREE.Group();
    lowerBoom.position.y = 0.1;
    boomArmGroup.add(lowerBoom);

    const lowerBoomMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), copper);
    lowerBoomMesh.position.y = 0.4;
    lowerBoom.add(lowerBoomMesh);

    const elbow = new THREE.Group();
    elbow.position.y = 0.8;
    lowerBoom.add(elbow);
    
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), steel);
    elbow.add(elbowJoint);

    const upperBoomMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), chrome);
    upperBoomMesh.position.y = 0.3;
    elbow.add(upperBoomMesh);

    const sensorHead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), glowingAether);
    sensorHead.position.y = 0.6;
    elbow.add(sensorHead);

    meshes.boomArm = { lower: lowerBoom, elbow: elbow };
    superStructure.add(deskGroup);

    // 3. Center Pedestal and Mystical Gears
    const pedestalPoints = [];
    for (let i = 0; i <= 10; i++) {
        const r = 2.0 - i * 0.1;
        const y = i * 0.2;
        pedestalPoints.push(new THREE.Vector2(r, y));
    }
    const pedestalGeo = new THREE.LatheGeometry(pedestalPoints, 64);
    const pedestal = new THREE.Mesh(pedestalGeo, oakWood);
    pedestal.position.y = plankThickness;
    floorGroup.add(pedestal);

    const gearGroup = new THREE.Group();
    gearGroup.position.y = platformHeight + 0.2; 
    
    const createGear = (radius, teethCount, thickness, material) => {
        const shape = new THREE.Shape();
        const innerRadius = radius - 0.2;
        const outerRadius = radius;
        for (let i = 0; i < teethCount * 2; i++) {
            const angle = (i / (teethCount * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            if (i === 0) shape.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
            else shape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
        }
        shape.closePath();
        
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, radius * 0.5, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.rotateX(Math.PI / 2);
        geo.translate(0, thickness, 0);
        return new THREE.Mesh(geo, material);
    };

    const sunGear = createGear(2.0, 32, 0.3, darkSteel);
    gearGroup.add(sunGear);
    meshes.sunGear = sunGear;

    meshes.planetGears = [];
    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const dist = 3.0; 
        const planet = createGear(1.0, 16, 0.3, copper);
        planet.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        gearGroup.add(planet);
        meshes.planetGears.push(planet);
        
        const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 16);
        const shaft = new THREE.Mesh(shaftGeo, steel);
        shaft.position.copy(planet.position);
        shaft.position.y += 0.5;
        gearGroup.add(shaft);
    }
    superStructure.add(gearGroup);

    // Glowing Astrolabe embedded in pedestal
    const astrolabeGroup = new THREE.Group();
    astrolabeGroup.position.set(0, plankThickness + 1.5, 0);
    floorGroup.add(astrolabeGroup);
    meshes.astrolabeRings = [];

    const astrolabeSizes = [2.5, 2.3, 2.1, 1.9, 1.7];
    const astrolabeMats = [copper, steel, glowingRune, copper, darkSteel];
    for(let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(astrolabeSizes[i], 0.04 + i * 0.01, 16, 64);
        const ring = new THREE.Mesh(ringGeo, astrolabeMats[i]);
        ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        astrolabeGroup.add(ring);
        meshes.astrolabeRings.push({ 
            mesh: ring, 
            axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), 
            speed: (Math.random() * 2 + 0.5) * (i % 2 === 0 ? 1 : -1) 
        });
    }
    
    const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
    const crystal = new THREE.Mesh(crystalGeo, glowingAether);
    astrolabeGroup.add(crystal);
    meshes.crystal = crystal;

    // 4. Rotating Assembly (Mast, Rotor, Push Bars)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = platformHeight + plankThickness + 2.0; 
    superStructure.add(rotorGroup);
    meshes.rotorGroup = rotorGroup;

    const mastHeight = 30;
    const mastPoints = [];
    for(let i = 0; i <= 20; i++) {
        const y = (i / 20) * mastHeight;
        const r = 0.8 - (i / 20) * 0.4;
        mastPoints.push(new THREE.Vector2(r, y));
    }
    const mastGeo = new THREE.LatheGeometry(mastPoints, 32);
    const mast = new THREE.Mesh(mastGeo, oakWood);
    rotorGroup.add(mast);

    const bandGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 32);
    for(let i = 1; i < 20; i += 2) {
        const y = (i / 20) * mastHeight;
        const r = 0.8 - (i / 20) * 0.4 + 0.02; 
        const m = new THREE.Mesh(bandGeo, darkSteel);
        m.scale.set(r, 1, r);
        m.position.y = y;
        
        for(let j = 0; j < 8; j++) {
            const rivetGeo = new THREE.SphereGeometry(0.06, 8, 8);
            const rivet = new THREE.Mesh(rivetGeo, copper);
            const angle = (j / 8) * Math.PI * 2;
            rivet.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
            m.add(rivet);
        }
        mast.add(m);
    }

    const hubGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.0, 16);
    const hub = new THREE.Mesh(hubGeo, darkWalnut);
    hub.position.y = 3.0;
    mast.add(hub);

    function createRopeWinding(radius, yStart, yEnd, turns, thickness, material) {
        const points = [];
        const segments = turns * 32;
        for(let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 * turns;
            const y = yStart + t * (yEnd - yStart);
            points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, segments, thickness, 8, false);
        return new THREE.Mesh(geo, material);
    }

    mast.add(createRopeWinding(0.9, 3.5, 4.5, 15, 0.04, hempRope));
    mast.add(createRopeWinding(0.4, mastHeight - 1.5, mastHeight - 0.5, 10, 0.03, hempRope));

    const barLength = 8;
    meshes.lanterns = [];
    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        const barPivot = new THREE.Group();
        barPivot.rotation.y = angle;
        barPivot.position.y = 3.0;
        mast.add(barPivot);

        const barGeo = new THREE.CylinderGeometry(0.15, 0.1, barLength, 16);
        barGeo.rotateZ(Math.PI / 2);
        barGeo.translate(barLength / 2 + 1.0, 0, 0); 
        
        const bar = new THREE.Mesh(barGeo, oakWood);
        barPivot.add(bar);

        const gripGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.5, 16);
        gripGeo.rotateZ(Math.PI / 2);
        const grip = new THREE.Mesh(gripGeo, leather);
        grip.position.set(barLength + 0.5, 0, 0);
        bar.add(grip);

        const lanternSwing = new THREE.Group();
        lanternSwing.position.set(barLength + 0.5, -0.2, 0); 
        barPivot.add(lanternSwing);
        
        const hookGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const hook = new THREE.Mesh(hookGeo, darkSteel);
        hook.position.y = -0.25;
        lanternSwing.add(hook);

        const housingGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.4, 6);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.y = -0.6;
        lanternSwing.add(housing);

        const glassGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.3, 16);
        const glassMesh = new THREE.Mesh(glassGeo, tinted); 
        glassMesh.position.y = -0.6;
        lanternSwing.add(glassMesh);

        const flameGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const flame = new THREE.Mesh(flameGeo, glowingRune);
        flame.position.y = -0.6;
        lanternSwing.add(flame);

        meshes.lanterns.push(lanternSwing);

        const pushBarEnd = new THREE.Vector3(Math.cos(angle) * barLength, 3.0, Math.sin(angle) * barLength);
        const mastAttachment = new THREE.Vector3(0, 9.0, 0); 
        const dist = pushBarEnd.distanceTo(mastAttachment);
        const ropeGeo = new THREE.CylinderGeometry(0.03, 0.03, dist, 6);
        const rope = new THREE.Mesh(ropeGeo, hempRope);
        const mid = new THREE.Vector3().addVectors(pushBarEnd, mastAttachment).multiplyScalar(0.5);
        rope.position.copy(mid);
        rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(mastAttachment, pushBarEnd).normalize());
        mast.add(rope);
    }

    // 5. Helical Rotor
    const helixTurns = 2.5;
    const helixHeight = 18;
    const helixRadius = 9;
    const helixStartY = 6.0;
    const segments = 250;

    const canopyGeo = new THREE.BufferGeometry();
    const cVerts = [];
    const cNorms = [];
    const cUVs = [];
    const cInds = [];

    const strutGroup = new THREE.Group();
    strutGroup.position.y = helixStartY;
    mast.add(strutGroup);

    class HelixCurve extends THREE.Curve {
        constructor(r, h, t) { super(); this.r = r; this.h = h; this.t = t; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.t;
            return optionalTarget.set(Math.cos(angle) * this.r, t * this.h, Math.sin(angle) * this.r);
        }
    }
    const outerCurve = new HelixCurve(helixRadius, helixHeight, helixTurns);
    const reedGeo = new THREE.TubeGeometry(outerCurve, 300, 0.15, 12, false);
    const reedMesh = new THREE.Mesh(reedGeo, hempRope); 
    reedMesh.position.y = helixStartY;
    mast.add(reedMesh);

    const getInnerRadius = (y) => {
        const i = (y / mastHeight) * 20;
        return 0.8 - (i / 20) * 0.4 + 0.05; 
    };

    for(let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * helixTurns;
        const y = t * helixHeight;
        
        const innerR = getInnerRadius(helixStartY + y);
        const ox = Math.cos(angle) * helixRadius;
        const oz = Math.sin(angle) * helixRadius;
        const ix = Math.cos(angle) * innerR;
        const iz = Math.sin(angle) * innerR;

        cVerts.push(ix, y, iz);
        cVerts.push(ox, y, oz);

        cUVs.push(0, t * helixTurns * 5);
        cUVs.push(1, t * helixTurns * 5);

        if (i % 5 === 0 && i !== 0 && i !== segments) {
            const strutLen = helixRadius - innerR;
            const strutGeo = new THREE.CylinderGeometry(0.05, 0.03, strutLen, 8);
            strutGeo.rotateZ(Math.PI / 2);
            strutGeo.translate(strutLen / 2 + innerR, 0, 0);
            const strut = new THREE.Mesh(strutGeo, oakWood);
            strut.position.y = y;
            strut.rotation.y = -angle; 
            strutGroup.add(strut);

            if (i % 15 === 0) {
                const ropeStart = new THREE.Vector3(ox, y + helixStartY, oz);
                const ropeEnd = new THREE.Vector3(0, mastHeight - 1, 0);
                const ropeLen = ropeStart.distanceTo(ropeEnd);
                const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, ropeLen, 6);
                const ropeMesh = new THREE.Mesh(ropeGeo, hempRope);
                
                const mid = new THREE.Vector3().addVectors(ropeStart, ropeEnd).multiplyScalar(0.5);
                ropeMesh.position.copy(mid);
                ropeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(ropeEnd, ropeStart).normalize());
                mast.add(ropeMesh);
            }
        }
    }

    for(let i = 0; i < segments; i++) {
        const i2 = i * 2;
        cInds.push(i2, i2 + 1, i2 + 2);
        cInds.push(i2 + 1, i2 + 3, i2 + 2);
    }

    canopyGeo.setAttribute('position', new THREE.Float32BufferAttribute(cVerts, 3));
    canopyGeo.setAttribute('uv', new THREE.Float32BufferAttribute(cUVs, 2));
    canopyGeo.setIndex(cInds);
    canopyGeo.computeVertexNormals();

    const canopy = new THREE.Mesh(canopyGeo, linenFabric);
    canopy.position.y = helixStartY;
    mast.add(canopy);

    // Mast Finial
    const finialGroup = new THREE.Group();
    finialGroup.position.y = mastHeight;
    
    const finialBaseGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.5, 16);
    const finialBase = new THREE.Mesh(finialBaseGeo, copper);
    finialGroup.add(finialBase);
    
    const finialSpireGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0.5, 0.25),
        new THREE.Vector2(0.6, 0.4),
        new THREE.Vector2(0.2, 0.8),
        new THREE.Vector2(0.3, 1.2),
        new THREE.Vector2(0.0, 2.0)
    ], 32);
    const finialSpire = new THREE.Mesh(finialSpireGeo, darkSteel);
    finialGroup.add(finialSpire);

    const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const orb = new THREE.Mesh(orbGeo, glowingAether);
    orb.position.y = 1.0;
    finialGroup.add(orb);
    meshes.finialOrb = orb;

    mast.add(finialGroup);

    // Assembly Metadata
    parts.push({
        name: 'All-Terrain Mobile Undercarriage',
        description: 'A heavy forged steel axle system with massive off-road tires and hydraulic suspension, allowing the machine to traverse battlefields before takeoff.',
        material: 'Chrome, Dark Steel, and Rubber',
        function: 'Provides ground mobility and absorbs the immense shock of landing.',
        assemblyOrder: 1,
        connections: ['Base Platform Pillars', 'Ground'],
        failureEffect: 'The machine becomes immobile on the ground or crashes violently upon landing.',
        cascadeFailures: ['Base Floor Planks'],
        originalPosition: {x: 0, y: 2.0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    parts.push({
        name: 'Base Platform Pillars',
        description: 'Extensive wooden columns bracing the main elevated flight deck.',
        material: 'Oak Wood',
        function: 'Supports the massive weight of the crew and mast above the suspension.',
        assemblyOrder: 2,
        connections: ['All-Terrain Mobile Undercarriage', 'Base Floor Planks'],
        failureEffect: 'Structural collapse of the floor.',
        cascadeFailures: ['Base Floor Planks', 'Central Pedestal'],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    parts.push({
        name: 'Base Floor Planks',
        description: 'Dozens of heavy oak planks forming the operator walking platform.',
        material: 'Oak Wood and Dark Steel Nails',
        function: 'Allows operators to walk in circles while pushing the levers.',
        assemblyOrder: 3,
        connections: ['Base Platform Pillars', 'Central Pedestal'],
        failureEffect: 'Operators would fall through, halting operation.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 5.5, z: 0},
        explodedPosition: {x: 0, y: -3, z: 0}
    });

    parts.push({
        name: 'Aether Control Console',
        description: 'A glowing copper and steel terminal used to monitor anomalous aetheric flows and steer the machine.',
        material: 'Copper, Steel, and Glowing Aether',
        function: 'Allows the flight commander to adjust suspension hydraulics and astrolabe spin rates.',
        assemblyOrder: 4,
        connections: ['Base Floor Planks'],
        failureEffect: 'Loss of fine navigational control.',
        cascadeFailures: [],
        originalPosition: {x: 7.5, y: 6.0, z: 0},
        explodedPosition: {x: 15, y: 8, z: 0}
    });

    parts.push({
        name: 'Central Pedestal',
        description: 'A robust carved wooden socket housing the main mast bearing.',
        material: 'Oak Wood',
        function: 'Anchors the rotating mast to the stationary floor.',
        assemblyOrder: 5,
        connections: ['Base Floor Planks', 'Main Rotating Mast', 'Celestial Astrolabe'],
        failureEffect: 'The mast would collapse, destroying the machine.',
        cascadeFailures: ['Main Rotating Mast', 'Helical Rotor', 'Rigging'],
        originalPosition: {x: 0, y: 5.8, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    parts.push({
        name: 'Celestial Astrolabe Engine',
        description: 'A highly advanced, glowing clockwork mechanism embedded in the pedestal.',
        material: 'Copper, Steel, and Glowing Aether',
        function: 'Provides mystical lifting force and stabilizes the central bearing using gyroscopic rings.',
        assemblyOrder: 6,
        connections: ['Central Pedestal'],
        failureEffect: 'Loss of anomalous levitation, requiring pure human muscle power.',
        cascadeFailures: ['Main Mast Bearings'],
        originalPosition: {x: 0, y: 7.0, z: 0},
        explodedPosition: {x: 0, y: 12, z: -10}
    });

    parts.push({
        name: 'Mystical Planetary Gears',
        description: 'A massive dark steel gear train linked to the astrolabe.',
        material: 'Dark Steel and Copper',
        function: 'Multiplies the torque of the human operators to power the aetheric rings.',
        assemblyOrder: 7,
        connections: ['Base Floor Planks', 'Central Pedestal'],
        failureEffect: 'The astrolabe loses synchronization with the mast.',
        cascadeFailures: ['Celestial Astrolabe Engine'],
        originalPosition: {x: 0, y: 5.7, z: 0},
        explodedPosition: {x: -10, y: 5, z: 0}
    });

    parts.push({
        name: 'Main Rotating Mast',
        description: 'A massive 30-meter tapering wooden shaft forming the core of the screw.',
        material: 'Oak Wood',
        function: 'Transmits torque from the push bars to the helical rotor.',
        assemblyOrder: 8,
        connections: ['Central Pedestal', 'Push Bar Hub', 'Helical Rotor'],
        failureEffect: 'Total structural failure and immediate crash.',
        cascadeFailures: ['Helical Rotor', 'Rigging', 'Navigation Lanterns'],
        originalPosition: {x: 0, y: 7.5, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    parts.push({
        name: 'Iron Reinforcement Bands',
        description: 'Thick forged iron rings riveted along the mast.',
        material: 'Dark Steel and Copper',
        function: 'Prevents the massive torque from splitting the wooden mast.',
        assemblyOrder: 9,
        connections: ['Main Rotating Mast'],
        failureEffect: 'The mast would splinter and shatter under stress.',
        cascadeFailures: ['Main Rotating Mast'],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 10, y: 15, z: 0}
    });

    parts.push({
        name: 'Push Bar Hub',
        description: 'A reinforced wooden cylinder near the base of the mast.',
        material: 'Dark Walnut Wood',
        function: 'Serves as the central mounting point for the four massive push levers.',
        assemblyOrder: 10,
        connections: ['Main Rotating Mast', 'Operator Push Levers'],
        failureEffect: 'Inability to transfer operator power to the mast.',
        cascadeFailures: ['Operator Push Levers'],
        originalPosition: {x: 0, y: 10.5, z: 0},
        explodedPosition: {x: 0, y: 18, z: 10}
    });

    parts.push({
        name: 'Operator Push Levers',
        description: 'Four long heavy wooden beams used by operators to turn the screw.',
        material: 'Oak Wood and Leather',
        function: 'Acts as a manual crank for the machine.',
        assemblyOrder: 11,
        connections: ['Push Bar Hub', 'Navigation Lanterns'],
        failureEffect: 'Loss of propulsion.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 10.5, z: 0},
        explodedPosition: {x: -15, y: 10.5, z: 0}
    });

    parts.push({
        name: 'Navigation Lanterns',
        description: 'Four heavy iron lanterns with glowing mystical runes inside.',
        material: 'Dark Steel, Tinted Glass, and Glowing Runes',
        function: 'Provides illumination and spatial orientation during night flights.',
        assemblyOrder: 12,
        connections: ['Operator Push Levers'],
        failureEffect: 'Loss of visibility.',
        cascadeFailures: [],
        originalPosition: {x: 8.0, y: 9.7, z: 0},
        explodedPosition: {x: 15, y: 5, z: 15}
    });

    parts.push({
        name: 'Helical Linen Canopy',
        description: 'A massive continuous spiral of densely woven linen fabric.',
        material: 'Linen Fabric',
        function: 'Catches the air to provide vertical thrust as it rotates.',
        assemblyOrder: 13,
        connections: ['Radial Support Struts', 'Outer Helical Reed Frame', 'Main Rotating Mast'],
        failureEffect: 'Loss of aerodynamic lift, resulting in a rapid descent.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 18.5, z: 0},
        explodedPosition: {x: 0, y: 35, z: 0}
    });

    parts.push({
        name: 'Outer Helical Reed Frame',
        description: 'Thick bundles of dried reeds bound tightly with hemp rope.',
        material: 'Hemp Rope',
        function: 'Provides a flexible but strong outer edge to maintain the canopy tension.',
        assemblyOrder: 14,
        connections: ['Helical Linen Canopy', 'Radial Support Struts'],
        failureEffect: 'The canopy would lose its shape and flutter uselessly.',
        cascadeFailures: ['Helical Linen Canopy'],
        originalPosition: {x: 0, y: 18.5, z: 0},
        explodedPosition: {x: 0, y: 30, z: 15}
    });

    parts.push({
        name: 'Radial Support Struts',
        description: 'Dozens of small wooden poles radiating from the mast to the outer frame.',
        material: 'Oak Wood',
        function: 'Maintains the structural geometry of the spiral against immense air pressure.',
        assemblyOrder: 15,
        connections: ['Main Rotating Mast', 'Outer Helical Reed Frame'],
        failureEffect: 'The spiral would collapse inward, destroying aerodynamic efficiency.',
        cascadeFailures: ['Helical Linen Canopy', 'Outer Helical Reed Frame'],
        originalPosition: {x: 0, y: 18.5, z: 0},
        explodedPosition: {x: -25, y: 25, z: 0}
    });

    parts.push({
        name: 'Upper Tension Rigging',
        description: 'A complex web of hemp ropes tying the outer frame to the mast peak.',
        material: 'Hemp Rope',
        function: 'Transfers the lift force from the outer edges to the central mast.',
        assemblyOrder: 16,
        connections: ['Radial Support Struts', 'Mast Finial'],
        failureEffect: 'The outer edges of the rotor would shear off under load.',
        cascadeFailures: ['Outer Helical Reed Frame'],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 45, z: 0}
    });

    parts.push({
        name: 'Mast Finial',
        description: 'A decorative and functional capstone at the absolute top of the mast.',
        material: 'Copper, Dark Steel, and Glowing Aether',
        function: 'Acts as the anchor point for all upper tension rigging.',
        assemblyOrder: 17,
        connections: ['Main Rotating Mast', 'Upper Tension Rigging'],
        failureEffect: 'All upper rigging would detach, causing instant catastrophic collapse of the rotor.',
        cascadeFailures: ['Upper Tension Rigging', 'Helical Linen Canopy'],
        originalPosition: {x: 0, y: 37.5, z: 0},
        explodedPosition: {x: 0, y: 55, z: 0}
    });

    const description = "Leonardo Da Vinci's Aerial Screw, re-imagined as a functional, highly advanced Aether-punk flight machine. Featuring a heavy off-road tire undercarriage with hydraulic suspension, an intricate celestial astrolabe generating lifting force, and a massive helical linen rotor spanning 30 meters. This historic yet intensely complex vehicle requires a dedicated crew to operate its glowing aether control panels and immense manual push levers.";

    const quizQuestions = [
        {
            question: "What material did Da Vinci historically propose for the outer frame of the helical rotor to keep it lightweight yet flexible?",
            options: ["Forged Iron", "Dried Reeds", "Oak Wood", "Bronze"],
            correctAnswer: 1,
            explanation: "Da Vinci's notes specified dried reeds bound together, as they provided the necessary flexibility and lightness for the outer rim of the canopy."
        },
        {
            question: "What is the primary function of the heavy iron reinforcement bands wrapped along the central mast?",
            options: ["To add weight for stability", "To prevent the wooden mast from splitting under extreme rotational torque", "To conduct the magical aether energy", "To provide handholds for climbing"],
            correctAnswer: 1,
            explanation: "The immense torque generated by four operators pushing the levers could easily split a solid wooden mast along the grain. The iron bands compress the wood and prevent catastrophic failure."
        },
        {
            question: "How does the machine generate aerodynamic lift?",
            options: ["By flapping the linen canopy like wings", "By heating the air inside the canopy", "By compressing air downwards through the continuous rotation of the helical surface", "Through the anomalous levitation of the celestial astrolabe alone"],
            correctAnswer: 2,
            explanation: "The machine acts as a giant screw, 'drilling' upwards into the air and compressing it downwards, which is the foundational concept behind modern helicopter rotors."
        },
        {
            question: "Why is the complex web of upper tension rigging essential for the structural integrity of the massive rotor?",
            options: ["It stops the mast from spinning too fast", "It transfers the lifting force from the fragile outer frame directly to the strong central mast", "It prevents the linen from tearing", "It is purely decorative"],
            correctAnswer: 1,
            explanation: "The outer edges of the rotor generate the most lift but are structurally the weakest. The rigging transfers this upward force to the strong central mast finial, preventing the radial struts from snapping."
        },
        {
            question: "What is the primary purpose of the heavy off-road tires and hydraulic pistons integrated into the base platform?",
            options: ["To drive the machine along the ground without flying", "To absorb the intense shock of landing and allow mobility across rugged battlefields prior to takeoff", "To spin the celestial astrolabe faster", "To store extra glowing aether"],
            correctAnswer: 1,
            explanation: "The massive weight of the aerial screw requires a robust shock absorption system upon returning to the ground, and the off-road tires allow it to be towed across rough terrain to ideal launch positions."
        }
    ];

    function animate(time, speed, meshes) {
        if (meshes.wheels) {
            meshes.wheels.forEach(wheel => {
                wheel.rotation.z -= speed * 0.05;
            });
        }

        if (meshes.pistons) {
            meshes.pistons.forEach((piston, idx) => {
                const bounce = Math.sin(time * 5 + idx) * 0.2;
                piston.inner.position.y = piston.baseY + bounce;
            });
        }

        if (meshes.superStructure) {
            const avgBounce = Math.sin(time * 5) * 0.1;
            meshes.superStructure.position.y = baseElevation + avgBounce;
        }

        if (meshes.rotorGroup) {
            meshes.rotorGroup.rotation.y -= speed * 0.015;
        }

        if (meshes.sunGear) {
            meshes.sunGear.rotation.y += speed * 0.05;
        }

        if (meshes.planetGears) {
            meshes.planetGears.forEach(planet => {
                planet.rotation.y -= speed * 0.1; 
            });
        }

        if (meshes.astrolabeRings) {
            meshes.astrolabeRings.forEach(ringObj => {
                ringObj.mesh.rotateOnAxis(ringObj.axis, speed * ringObj.speed * 0.02);
            });
        }
        
        if (meshes.crystal) {
            meshes.crystal.scale.setScalar(1.0 + Math.sin(time * 3) * 0.15);
            meshes.crystal.rotation.y += speed * 0.05;
        }

        if (meshes.finialOrb) {
            meshes.finialOrb.scale.setScalar(1.0 + Math.cos(time * 4) * 0.1);
        }

        if (meshes.lanterns) {
            meshes.lanterns.forEach((lantern, index) => {
                const centrifugalAngle = speed * 0.12; 
                const bounce = Math.sin(time * 5 + index) * 0.05;
                lantern.rotation.z = centrifugalAngle; 
                lantern.rotation.x = bounce; 
            });
        }

        if (meshes.boomArm) {
            meshes.boomArm.lower.rotation.z = Math.sin(time * 2) * 0.5;
            meshes.boomArm.lower.rotation.y = Math.cos(time * 1.5) * 1.0;
            meshes.boomArm.elbow.rotation.z = Math.sin(time * 3) * 0.8 - 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAerialScrew() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
