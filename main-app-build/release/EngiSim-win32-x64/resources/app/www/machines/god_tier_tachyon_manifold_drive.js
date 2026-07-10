import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // CUSTOM ADVANCED MATERIALS
    // -------------------------------------------------------------------------
    const tachyonGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xbb00ff,
        emissiveIntensity: 5.5,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const quantumBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0044ff,
        emissive: 0x0022cc,
        emissiveIntensity: 2.5,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const exoticMatter = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0x770022,
        emissiveIntensity: 2.0,
        transmission: 0.9,
        opacity: 1,
        metalness: 1.0,
        roughness: 0.0,
        ior: 2.5,
        thickness: 1.5,
        side: THREE.DoubleSide
    });

    const darkEnergyMatrix = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 1.0,
        roughness: 0.2,
        envMapIntensity: 2.0
    });

    const superconductorGold = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });

    const chronofieldCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.6
    });

    const hyperChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.0,
        envMapIntensity: 3.0
    });

    // -------------------------------------------------------------------------
    // GEOMETRY GENERATION - COMPLEX LATHE PROFILES
    // -------------------------------------------------------------------------
    const injectorCorePoints = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const x = Math.sin(t * Math.PI * 4) * 0.5 + Math.cos(t * Math.PI * 10) * 0.1 + 1.0;
        const y = (t - 0.5) * 20;
        injectorCorePoints.push(new THREE.Vector2(x, y));
    }
    const injectorCoreGeo = new THREE.LatheGeometry(injectorCorePoints, 128);

    const manifoldPoints = [];
    for (let i = 0; i <= 300; i++) {
        const t = i / 300;
        const r = 3 + Math.sin(t * Math.PI * 8) * 1.5 + Math.exp(t * 2) * 0.1;
        const y = (t - 0.5) * 15;
        manifoldPoints.push(new THREE.Vector2(r, y));
    }
    const manifoldGeo = new THREE.LatheGeometry(manifoldPoints, 256);

    const outerManifoldPoints = [];
    for (let i = 0; i <= 300; i++) {
        const t = i / 300;
        const r = 6 + Math.cos(t * Math.PI * 6) * 2.0;
        const y = (t - 0.5) * 25;
        outerManifoldPoints.push(new THREE.Vector2(r, y));
    }
    const outerManifoldGeo = new THREE.LatheGeometry(outerManifoldPoints, 256);

    const containmentVesselPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const r = 2.5 + Math.sin(t * Math.PI) * 2;
        const y = (t - 0.5) * 10;
        containmentVesselPoints.push(new THREE.Vector2(r, y));
    }
    const containmentVesselGeo = new THREE.LatheGeometry(containmentVesselPoints, 64);

    // -------------------------------------------------------------------------
    // GEOMETRY GENERATION - COMPLEX EXTRUSIONS
    // -------------------------------------------------------------------------
    const gearShape = new THREE.Shape();
    const gearTeeth = 36;
    const gearRadiusOuter = 8.0;
    const gearRadiusInner = 7.0;
    for (let i = 0; i < gearTeeth * 2; i++) {
        const angle = (i / (gearTeeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? gearRadiusOuter : gearRadiusInner;
        if (i === 0) gearShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else gearShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    gearShape.closePath();
    
    // Adding holes in the gear
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 5, 0, Math.PI * 2, false);
    gearShape.holes.push(holePath);

    for (let i = 0; i < 6; i++) {
        const hAngle = (i / 6) * Math.PI * 2;
        const smallHole = new THREE.Path();
        smallHole.absarc(Math.cos(hAngle) * 6, Math.sin(hAngle) * 6, 0.5, 0, Math.PI * 2, false);
        gearShape.holes.push(smallHole);
    }

    const extrudeSettings = {
        depth: 1.5,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };
    const acceleratorRingGeo = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);

    const strutShape = new THREE.Shape();
    strutShape.moveTo(0, 0);
    strutShape.lineTo(1, 0.5);
    strutShape.lineTo(1, 8);
    strutShape.lineTo(0, 8.5);
    strutShape.lineTo(-1, 8);
    strutShape.lineTo(-1, 0.5);
    strutShape.closePath();
    
    const strutExtrude = { depth: 0.5, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 };
    const strutGeo = new THREE.ExtrudeGeometry(strutShape, strutExtrude);

    // -------------------------------------------------------------------------
    // GEOMETRY GENERATION - PARAMETRIC TUBES & HYDRAULICS
    // -------------------------------------------------------------------------
    class TachyonKnotCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const p = 3;
            const q = 7;
            const t2 = t * Math.PI * 2;
            const r = Math.cos(q * t2) + 4;
            const x = r * Math.cos(p * t2) * this.scale;
            const y = r * Math.sin(p * t2) * this.scale;
            const z = Math.sin(q * t2) * 2 * this.scale;
            return optionalTarget.set(x, y, z);
        }
    }
    const knotCurve = new TachyonKnotCurve(1.5);
    const quantumEntanglementGeo = new THREE.TubeGeometry(knotCurve, 300, 0.2, 16, true);

    class HydraulicLineCurve extends THREE.Curve {
        constructor(start, end, cp1, cp2) {
            super();
            this.start = start;
            this.end = end;
            this.cp1 = cp1;
            this.cp2 = cp2;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = THREE.ShapeUtils.b3(t, this.start.x, this.cp1.x, this.cp2.x, this.end.x);
            const y = THREE.ShapeUtils.b3(t, this.start.y, this.cp1.y, this.cp2.y, this.end.y);
            const z = THREE.ShapeUtils.b3(t, this.start.z, this.cp1.z, this.cp2.z, this.end.z);
            return optionalTarget.set(x, y, z);
        }
    }

    THREE.ShapeUtils.b3 = function(t, p0, p1, p2, p3) {
        const cX = 3 * (p1 - p0), bX = 3 * (p2 - p1) - cX, aX = p3 - p0 - cX - bX;
        return (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0;
    };

    const hydraulicLines = new THREE.Group();
    for(let i=0; i<24; i++) {
        const angle = (i/24) * Math.PI * 2;
        const start = new THREE.Vector3(Math.cos(angle)*2, -10, Math.sin(angle)*2);
        const end = new THREE.Vector3(Math.cos(angle)*7, 10, Math.sin(angle)*7);
        const cp1 = new THREE.Vector3(Math.cos(angle)*8, -5, Math.sin(angle)*8);
        const cp2 = new THREE.Vector3(Math.cos(angle)*1, 5, Math.sin(angle)*1);
        const curve = new HydraulicLineCurve(start, end, cp1, cp2);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        hydraulicLines.add(tube);
    }

    // -------------------------------------------------------------------------
    // PART ASSEMBLIES & MESH INSTANTIATION
    // -------------------------------------------------------------------------

    // 1. Primary Tachyon Injector Core
    const injectorCore = new THREE.Mesh(injectorCoreGeo, quantumBlue);
    injectorCore.rotation.x = Math.PI / 2;
    group.add(injectorCore);
    meshes.injectorCore = injectorCore;

    // 2. Inner Hyperspatial Folding Manifold
    const innerManifold = new THREE.Mesh(manifoldGeo, hyperChrome);
    innerManifold.rotation.x = Math.PI / 2;
    group.add(innerManifold);
    meshes.innerManifold = innerManifold;

    // 3. Outer Hyperspatial Folding Manifold
    const outerManifold = new THREE.Mesh(outerManifoldGeo, darkEnergyMatrix);
    outerManifold.rotation.x = Math.PI / 2;
    group.add(outerManifold);
    meshes.outerManifold = outerManifold;

    // 4. Quantum Entanglement Chamber (Knot)
    const entanglementChamber = new THREE.Mesh(quantumEntanglementGeo, tachyonGlow);
    group.add(entanglementChamber);
    meshes.entanglementChamber = entanglementChamber;

    // 5 & 6. Tachyonic Particle Accelerator Rings
    const ringA = new THREE.Mesh(acceleratorRingGeo, superconductorGold);
    ringA.position.y = -8;
    ringA.rotation.x = Math.PI / 2;
    group.add(ringA);
    meshes.ringA = ringA;

    const ringB = new THREE.Mesh(acceleratorRingGeo, superconductorGold);
    ringB.position.y = 8;
    ringB.rotation.x = Math.PI / 2;
    group.add(ringB);
    meshes.ringB = ringB;

    // 7. Exotic Matter Containment Vessel
    const containmentVessel = new THREE.Mesh(containmentVesselGeo, exoticMatter);
    containmentVessel.rotation.x = Math.PI / 2;
    group.add(containmentVessel);
    meshes.containmentVessel = containmentVessel;

    // 8. Hydraulic Lines Group
    group.add(hydraulicLines);
    meshes.hydraulicLines = hydraulicLines;

    // 9. Chronofield Dampeners
    const dampenersGroup = new THREE.Group();
    const dampenerGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dampener = new THREE.Mesh(dampenerGeo, chronofieldCyan);
        dampener.position.set(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
        dampenersGroup.add(dampener);
    }
    group.add(dampenersGroup);
    meshes.dampeners = dampenersGroup;

    // 10. Temporal Calibration Struts
    const strutsGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.position.set(Math.cos(angle) * 4, -4, Math.sin(angle) * 4);
        strut.rotation.y = -angle;
        strut.rotation.x = Math.PI / 4;
        strutsGroup.add(strut);
    }
    group.add(strutsGroup);
    meshes.struts = strutsGroup;

    // 11. Antimatter Catalyst Injectors
    const catalystGroup = new THREE.Group();
    const catalystGeo = new THREE.ConeGeometry(0.8, 4, 16);
    for(let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const catalyst = new THREE.Mesh(catalystGeo, exoticMatter);
        catalyst.position.set(Math.cos(angle) * 2.5, 12, Math.sin(angle) * 2.5);
        catalyst.rotation.x = Math.PI;
        catalystGroup.add(catalyst);
    }
    group.add(catalystGroup);
    meshes.catalysts = catalystGroup;

    // 12. Superluminal Exhaust Port
    const exhaustGeo = new THREE.TorusGeometry(3, 0.8, 32, 100);
    const exhaust = new THREE.Mesh(exhaustGeo, tachyonGlow);
    exhaust.position.y = -15;
    exhaust.rotation.x = Math.PI / 2;
    group.add(exhaust);
    meshes.exhaust = exhaust;

    // 13. Graviton Harmonizer Array
    const harmonizerGroup = new THREE.Group();
    const harmonizerGeo = new THREE.IcosahedronGeometry(1, 1);
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const harm = new THREE.Mesh(harmonizerGeo, quantumBlue);
        harm.position.set(Math.cos(angle) * 11, Math.sin(angle * 4) * 2, Math.sin(angle) * 11);
        harmonizerGroup.add(harm);
    }
    group.add(harmonizerGroup);
    meshes.harmonizers = harmonizerGroup;

    // 14. Sub-Planck Flux Condenser
    const condenserGeo = new THREE.DodecahedronGeometry(2.5, 2);
    const condenser = new THREE.Mesh(condenserGeo, hyperChrome);
    condenser.position.y = 15;
    group.add(condenser);
    meshes.condenser = condenser;

    // 15. Singularity Confinement Grid
    const gridGeo = new THREE.SphereGeometry(14, 32, 32);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    group.add(grid);
    meshes.grid = grid;

    // -------------------------------------------------------------------------
    // EXTREME PARTICLE SYSTEM (Tachyonic Particle Streams)
    // -------------------------------------------------------------------------
    const particleCount = 100000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVels = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xaa00ff);
    const color2 = new THREE.Color(0x00ffff);

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 12;
        const y = (Math.random() - 0.5) * 40;
        
        particlePos[i * 3] = Math.cos(theta) * r;
        particlePos[i * 3 + 1] = y;
        particlePos[i * 3 + 2] = Math.sin(theta) * r;

        particleVels[i * 3] = (Math.random() - 0.5) * 2;
        particleVels[i * 3 + 1] = (Math.random() - 0.5) * 20; // High vertical velocity
        particleVels[i * 3 + 2] = (Math.random() - 0.5) * 2;

        const mixedColor = color1.clone().lerp(color2, Math.random());
        particleColors[i * 3] = mixedColor.r;
        particleColors[i * 3 + 1] = mixedColor.g;
        particleColors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    // Streaked texture for particles to simulate faster-than-light motion blur
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 4, 64);
    const streakTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
        size: 0.8,
        map: streakTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    const tachyonParticles = new THREE.Points(particleGeo, particleMat);
    group.add(tachyonParticles);
    meshes.tachyonParticles = tachyonParticles;
    meshes.particleVels = particleVels;
    
    // Light Sources to illuminate the massive structure
    const pointLight1 = new THREE.PointLight(0xaa00ff, 500, 100);
    pointLight1.position.set(0, 10, 0);
    group.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00ffff, 500, 100);
    pointLight2.position.set(0, -10, 0);
    group.add(pointLight2);

    // -------------------------------------------------------------------------
    // PARTS ARRAY DEFINITION
    // -------------------------------------------------------------------------
    
    parts.push({
        name: "Primary Tachyon Injector Core",
        description: "The central spindle that injects superluminal tachyon fields into the manifold. Operates at near-infinite energy densities.",
        material: "Quantum Blue Physical Material",
        function: "Tachyon Field Generation",
        assemblyOrder: 1,
        connections: ["Inner Hyperspatial Folding Manifold", "Quantum Entanglement Chamber"],
        failureEffect: "Spontaneous conversion of the ship into a zero-dimensional point.",
        cascadeFailures: ["Outer Hyperspatial Folding Manifold", "Singularity Confinement Grid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    parts.push({
        name: "Inner Hyperspatial Folding Manifold",
        description: "A continuously fluctuating geometric array that folds 3D space into 11-dimensional Calabi-Yau spaces.",
        material: "Hyper Chrome",
        function: "Spatial Compression",
        assemblyOrder: 2,
        connections: ["Primary Tachyon Injector Core", "Outer Hyperspatial Folding Manifold"],
        failureEffect: "Localized timeline collapse.",
        cascadeFailures: ["Chronofield Dampeners"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 0, z: 0 }
    });

    parts.push({
        name: "Outer Hyperspatial Folding Manifold",
        description: "The secondary barrier that prevents the inner manifold from unraveling the local cosmic string network.",
        material: "Dark Energy Matrix",
        function: "Cosmic String Stabilization",
        assemblyOrder: 3,
        connections: ["Inner Hyperspatial Folding Manifold", "Tachyonic Particle Accelerator Rings"],
        failureEffect: "Creation of an expanding false vacuum bubble.",
        cascadeFailures: ["Singularity Confinement Grid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 0, z: 0 }
    });

    parts.push({
        name: "Quantum Entanglement Chamber",
        description: "A torus knot chamber where macroscopic quantum superposition is maintained for instant teleportation matrices.",
        material: "Tachyon Glow Standard",
        function: "Non-local state transfer",
        assemblyOrder: 4,
        connections: ["Primary Tachyon Injector Core"],
        failureEffect: "Crew consciousness entangled with alternate reality variants.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: -30 }
    });

    parts.push({
        name: "Tachyonic Particle Accelerator Ring A",
        description: "Upper ring constructed from superconducting gold, accelerating tachyons to millions of times the speed of light.",
        material: "Superconductor Gold",
        function: "Particle Acceleration",
        assemblyOrder: 5,
        connections: ["Outer Hyperspatial Folding Manifold", "Hydraulic Lines"],
        failureEffect: "Time runs backwards locally.",
        cascadeFailures: ["Tachyonic Particle Accelerator Ring B"],
        originalPosition: { x: 0, y: -8, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    parts.push({
        name: "Tachyonic Particle Accelerator Ring B",
        description: "Lower ring operating in counter-rotation to Ring A, creating a temporal shear field.",
        material: "Superconductor Gold",
        function: "Temporal Shear Generation",
        assemblyOrder: 6,
        connections: ["Outer Hyperspatial Folding Manifold", "Hydraulic Lines"],
        failureEffect: "Time runs sideways locally.",
        cascadeFailures: ["Tachyonic Particle Accelerator Ring A"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    parts.push({
        name: "Exotic Matter Containment Vessel",
        description: "Holds negative-mass exotic matter essential for keeping the wormhole throat open during transit.",
        material: "Exotic Matter Physical",
        function: "Wormhole Throat Stabilization",
        assemblyOrder: 7,
        connections: ["Primary Tachyon Injector Core"],
        failureEffect: "Wormhole throat collapse, crushing the vessel into a singularity.",
        cascadeFailures: ["Singularity Confinement Grid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 40 }
    });

    parts.push({
        name: "Hyper-Hydraulic Plasma Lines",
        description: "Transports superheated quark-gluon plasma to actuate the physical shifts of the manifold.",
        material: "Rubber / Advanced Polymers",
        function: "Thermal-Kinetic Transfer",
        assemblyOrder: 8,
        connections: ["Tachyonic Particle Accelerator Ring A", "Tachyonic Particle Accelerator Ring B"],
        failureEffect: "Plasma leak vaporizing the engineering deck.",
        cascadeFailures: ["Temporal Calibration Struts"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 30, z: 30 }
    });

    parts.push({
        name: "Chronofield Dampeners",
        description: "Emits a reverse-tachyon pulse to prevent the ship from arriving before it departs.",
        material: "Chronofield Cyan",
        function: "Causality Protection",
        assemblyOrder: 9,
        connections: ["Inner Hyperspatial Folding Manifold"],
        failureEffect: "Grandfather paradox execution.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -30, z: 30 }
    });

    parts.push({
        name: "Temporal Calibration Struts",
        description: "Physical struts that lock the local reference frame to the cosmic microwave background rest frame.",
        material: "Steel",
        function: "Frame Dragging Anchor",
        assemblyOrder: 10,
        connections: ["Hyper-Hydraulic Plasma Lines"],
        failureEffect: "Ship becomes permanently lost in the year 3,000,000,000 BCE.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 30, z: -30 }
    });

    parts.push({
        name: "Antimatter Catalyst Injectors",
        description: "Injects precisely measured streams of anti-hydrogen to trigger the initial tachyon cascade.",
        material: "Exotic Matter",
        function: "Ignition",
        assemblyOrder: 11,
        connections: ["Primary Tachyon Injector Core"],
        failureEffect: "Complete matter-antimatter annihilation of the sector.",
        cascadeFailures: ["Sub-Planck Flux Condenser"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    parts.push({
        name: "Superluminal Exhaust Port",
        description: "Vents excess Cherenkov radiation and distorted spacetime ripples away from the hull.",
        material: "Tachyon Glow",
        function: "Waste Energy Venting",
        assemblyOrder: 12,
        connections: ["Tachyonic Particle Accelerator Ring A"],
        failureEffect: "Lethal radiation dose to all organic matter within 5 AU.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    parts.push({
        name: "Graviton Harmonizer Array",
        description: "Synchronizes the emission of synthetic gravitons to smooth the transition into hyperspace.",
        material: "Quantum Blue",
        function: "Gravimetric Smoothing",
        assemblyOrder: 13,
        connections: ["Outer Hyperspatial Folding Manifold"],
        failureEffect: "Micro-black holes forming in the crew quarters.",
        cascadeFailures: ["Singularity Confinement Grid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 20, z: -40 }
    });

    parts.push({
        name: "Sub-Planck Flux Condenser",
        description: "Condenses zero-point energy fluctuations below the Planck length into usable thrust.",
        material: "Hyper Chrome",
        function: "Zero-Point Energy Extraction",
        assemblyOrder: 14,
        connections: ["Antimatter Catalyst Injectors"],
        failureEffect: "Energy extraction falls to zero, stranding the vessel.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    parts.push({
        name: "Singularity Confinement Grid",
        description: "A spherical electromagnetic and gravimetric cage that prevents the drive's artificial singularity from escaping.",
        material: "Cyan Wireframe",
        function: "Singularity Containment",
        assemblyOrder: 15,
        connections: ["Outer Hyperspatial Folding Manifold"],
        failureEffect: "Immediate spaghettification of the vessel and surrounding planets.",
        cascadeFailures: ["All systems."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Grid doesn't explode, it just fades out usually
    });

    // -------------------------------------------------------------------------
    // 5 PHD-LEVEL QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the Tachyon Manifold Drive, how does the Outer Hyperspatial Folding Manifold mitigate the effects of the Alcubierre metric's blue-shift at the forward event horizon?",
            options: [
                "By projecting a localized inverted tachyon field that scatters high-energy photons into parallel branes.",
                "By absorbing the photons and converting them directly into dark energy.",
                "By rotating the ship 180 degrees midway through the journey.",
                "By decelerating the ship below light speed periodically to vent the radiation."
            ],
            correctAnswer: 0,
            explanation: "The blue-shift problem in warp metrics results in lethal high-energy radiation accumulating at the leading edge. The Outer Manifold solves this by using inverted tachyons to scatter this radiation across 11-dimensional branes, safely away from our 3D space."
        },
        {
            question: "If the Tachyonic Particle Accelerator Rings lose temporal synchronization (shear > 10^-43 seconds), which of the following is the mathematically predicted outcome according to closed timelike curve (CTC) thermodynamics?",
            options: [
                "The rings will melt due to standard friction.",
                "The ship will recursively encounter versions of itself from the immediate future, causing an infinite mass-energy cascade.",
                "The tachyon streams will convert into slower-than-light tardyons, harmlessly dissipating.",
                "The chronofield dampeners will automatically reverse the flow of time to fix the error."
            ],
            correctAnswer: 1,
            explanation: "Asynchronous rings generate uncontrolled CTCs. Thermodynamics dictates that vacuum fluctuations traversing these curves amplify to infinity, causing an infinite mass-energy cascade that destroys the drive."
        },
        {
            question: "What is the primary function of injecting anti-hydrogen via the Antimatter Catalyst Injectors into the Exotic Matter Containment Vessel?",
            options: [
                "To provide kinetic thrust to propel the ship.",
                "To annihilate the exotic matter and safely shut down the drive.",
                "To induce a forced symmetry breaking in the vacuum state, catalyzing the exotic matter to manifest a negative energy density.",
                "To create a bright flash of light used for interstellar communication."
            ],
            correctAnswer: 2,
            explanation: "Exotic matter requires an immense localized energy spike to force a phase transition in the quantum vacuum, generating the negative energy density necessary to stabilize the wormhole throat. Anti-hydrogen annihilation provides this exact energetic signature."
        },
        {
            question: "Why is the Quantum Entanglement Chamber shaped specifically as a torus knot (p=3, q=7) rather than a standard torus?",
            options: [
                "It looks more aesthetically pleasing to the engineers.",
                "The topological invariance of a (3,7) torus knot uniquely preserves the quantum phase of the entangled tachyons against decoherence from Hawking radiation.",
                "It allows for more hydraulic lines to be attached.",
                "It minimizes the physical footprint of the chamber inside the ship."
            ],
            correctAnswer: 1,
            explanation: "Quantum decoherence is a major issue near artificial singularities. The topological properties of a (3,7) knot provide a protected state space where the Berry phase of the tachyons remains invariant, shielding them from Hawking radiation."
        },
        {
            question: "According to the drive's operational manual, if the Chronofield Dampeners fail, causality protection drops. What is the precise mechanism by which the 'Grandfather Paradox' is physically prevented by the universe in this scenario?",
            options: [
                "The universe spontaneously deletes the ship.",
                "The Novikov self-consistency principle forces quantum probability amplitudes to 0 for any timeline-altering actions, manifesting as seemingly 'random' mechanical failures.",
                "A parallel timeline is instantly created, isolating the paradox.",
                "Time police intervene."
            ],
            correctAnswer: 1,
            explanation: "Without dampeners, the drive relies on the universe's natural paradox resolution. Following the Novikov self-consistency principle, the universe mathematically suppresses paradoxes by driving the probability of contradictory events to zero, resulting in impossible bad luck preventing the action."
        }
    ];

    // -------------------------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // -------------------------------------------------------------------------
    function animate(time, speed, meshesObj) {
        if (!meshesObj.injectorCore) return;

        const t = time * speed;
        
        // 1. Core and Manifold Rotations (Complex Interleaved)
        meshesObj.injectorCore.rotation.y = t * 2.0;
        meshesObj.innerManifold.rotation.y = -t * 1.5;
        meshesObj.outerManifold.rotation.y = t * 0.5;
        
        // Morphing the manifolds (Simulating spatial folding)
        const innerScale = 1.0 + Math.sin(t * 3) * 0.15;
        meshesObj.innerManifold.scale.set(innerScale, 1.0, innerScale);
        
        const outerScale = 1.0 + Math.cos(t * 2) * 0.1;
        meshesObj.outerManifold.scale.set(outerScale, 1.0 + Math.sin(t*4)*0.05, outerScale);

        // 2. Quantum Entanglement Chamber (Throbbing & Rotating)
        meshesObj.entanglementChamber.rotation.x = t * 0.8;
        meshesObj.entanglementChamber.rotation.y = t * 1.2;
        meshesObj.entanglementChamber.rotation.z = t * 0.5;
        const pulse = 1.0 + Math.sin(t * 10) * 0.2;
        meshesObj.entanglementChamber.scale.set(pulse, pulse, pulse);

        // 3. Accelerator Rings
        meshesObj.ringA.rotation.z = t * 5.0; // High speed
        meshesObj.ringB.rotation.z = -t * 5.5; // Counter rotation with shear offset
        
        // Rings oscillate up and down slightly
        meshesObj.ringA.position.y = -8 + Math.sin(t * 4) * 0.5;
        meshesObj.ringB.position.y = 8 + Math.cos(t * 4) * 0.5;

        // 4. Exotic Matter Containment Vessel
        meshesObj.containmentVessel.rotation.y = t * 3.0;
        meshesObj.containmentVessel.material.opacity = 0.7 + Math.sin(t * 8) * 0.3;
        meshesObj.containmentVessel.material.emissiveIntensity = 2.0 + Math.cos(t * 12) * 1.5;

        // 5. Hydraulic Lines (Withing / Pumping effect)
        meshesObj.hydraulicLines.children.forEach((tube, index) => {
            const offset = index * 0.2;
            tube.scale.x = 1.0 + Math.sin(t * 8 + offset) * 0.2;
            tube.scale.z = 1.0 + Math.sin(t * 8 + offset) * 0.2;
        });

        // 6. Chronofield Dampeners
        meshesObj.dampeners.rotation.y = -t * 0.5;
        meshesObj.dampeners.children.forEach((dampener, index) => {
            const offset = index * (Math.PI / 4);
            dampener.position.y = Math.sin(t * 5 + offset) * 2;
            dampener.material.emissiveIntensity = 3.0 + Math.sin(t * 15 + offset) * 2.0;
        });

        // 7. Temporal Calibration Struts
        meshesObj.struts.rotation.y = t * 0.2;
        meshesObj.struts.children.forEach((strut, index) => {
            strut.rotation.z = Math.sin(t * 2 + index) * 0.2;
        });

        // 8. Antimatter Catalyst Injectors (Firing sequence)
        meshesObj.catalysts.rotation.y = t * 1.0;
        meshesObj.catalysts.children.forEach((catalyst, index) => {
            // Rapid pulsing to simulate injection
            const fireRate = (t * 20 + index * 10) % 10;
            if (fireRate < 1.0) {
                catalyst.material.emissiveIntensity = 10.0;
                catalyst.scale.set(1.5, 1.5, 1.5);
            } else {
                catalyst.material.emissiveIntensity = 2.0;
                catalyst.scale.set(1.0, 1.0, 1.0);
            }
        });

        // 9. Superluminal Exhaust
        meshesObj.exhaust.rotation.z = -t * 4.0;
        meshesObj.exhaust.scale.set(
            1.0 + Math.random() * 0.1,
            1.0 + Math.random() * 0.1,
            1.0 + Math.random() * 0.1
        );
        meshesObj.exhaust.material.emissiveIntensity = 5.0 + Math.random() * 5.0; // Flickering

        // 10. Graviton Harmonizers
        meshesObj.harmonizers.rotation.y = t * 0.7;
        meshesObj.harmonizers.rotation.x = Math.sin(t * 0.3) * 0.2;
        meshesObj.harmonizers.children.forEach((harm, index) => {
            harm.rotation.x = t * 4;
            harm.rotation.y = t * 3;
            // Orbiting motion
            const angle = (index / 16) * Math.PI * 2 + t;
            harm.position.x = Math.cos(angle) * 11;
            harm.position.z = Math.sin(angle) * 11;
            harm.position.y = Math.sin(angle * 4 + t * 5) * 3;
        });

        // 11. Sub-Planck Flux Condenser
        meshesObj.condenser.rotation.x = t * 2;
        meshesObj.condenser.rotation.y = t * 3;
        meshesObj.condenser.rotation.z = t * 4;
        meshesObj.condenser.position.y = 15 + Math.sin(t * 6) * 1.5;

        // 12. Singularity Confinement Grid
        meshesObj.grid.rotation.y = t * 0.1;
        meshesObj.grid.rotation.x = t * 0.05;
        // Pulse the grid opacity
        meshesObj.grid.material.opacity = 0.1 + Math.sin(t * 2) * 0.08;

        // 13. MASSIVE PARTICLE SYSTEM ANIMATION (Faster-than-light streaking)
        const positions = meshesObj.tachyonParticles.geometry.attributes.position.array;
        const velocities = meshesObj.particleVels;
        const pCount = positions.length / 3;

        for (let i = 0; i < pCount; i++) {
            positions[i * 3] += velocities[i * 3] * speed;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * speed * 2.0; // Warp speed multiplier
            positions[i * 3 + 2] += velocities[i * 3 + 2] * speed;

            // Boundary wrap-around
            if (positions[i * 3 + 1] > 30) positions[i * 3 + 1] = -30;
            if (positions[i * 3 + 1] < -30) positions[i * 3 + 1] = 30;

            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            const r2 = x * x + z * z;

            // Radial pull towards the center (Singularity effect)
            if (r2 > 400) {
                positions[i * 3] *= 0.99;
                positions[i * 3 + 2] *= 0.99;
            }
        }
        meshesObj.tachyonParticles.geometry.attributes.position.needsUpdate = true;
    }

    return {
        group,
        parts,
        description: "The God-Tier Tachyon Manifold Drive. An infinitely complex piece of ultra-technology that uses a contained artificial singularity, folded 11-dimensional Calabi-Yau manifolds, and superluminal tachyonic particle streams to casually rewrite the laws of causality, thermodynamics, and general relativity, allowing instantaneous travel across the multiverse.",
        quizQuestions,
        animate
    };
}
