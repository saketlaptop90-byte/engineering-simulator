import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "God-Tier Baryogenesis Reactor: A supreme cosmological engine designed to violate CP symmetry on a macroscopic scale, converting pure photon radiation into a net excess of baryonic matter over antimatter. Fully mobile on a monolithic tracked chassis.";

    // Custom Glowing Materials
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0, transparent: true, opacity: 0.95 });
    const matterMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0033ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const antiMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0011, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const superConductor = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.1 });
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.3 });
    const energyField = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x4400ff, emissiveIntensity: 1.5, wireframe: true, transparent: true, opacity: 0.3 });
    const hologramMat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 1.0, wireframe: true, transparent: true, opacity: 0.8 });

    // Animation target registry
    const animationTargets = {
        coreCore: null,
        coreShells: [],
        containmentRings: [],
        matterHelices: [],
        antiMatterSpikes: [],
        holograms: [],
        pistons: [],
        smokeParticles: [],
        baffles: [],
        higgsCouplers: [],
        dmiNodes: [],
        tires: [],
        fans: [],
        matterFlow: null,
        antiMatterFlow: null,
        tankFluid: null,
        steeringWheel: null,
        joystick1: null,
        radarDish: null,
        photonBeams: []
    };

    // Helper classes for complex geometries
    class ReactorCoilCurve extends THREE.Curve {
        constructor(radius, minorRadius, turns) {
            super();
            this.radius = radius;
            this.minorRadius = minorRadius;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = (this.radius + this.minorRadius * Math.cos(angle * 10)) * Math.cos(t * Math.PI * 2);
            const z = (this.radius + this.minorRadius * Math.cos(angle * 10)) * Math.sin(t * Math.PI * 2);
            const y = this.minorRadius * Math.sin(angle * 10);
            return optionalTarget.set(x, y, z);
        }
    }

    class HydraulicLineCurve extends THREE.Curve {
        constructor(p1, p2, control) {
            super();
            this.p1 = p1;
            this.p2 = p2;
            this.control = control;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const temp1 = this.p1.clone().lerp(this.control, t);
            const temp2 = this.control.clone().lerp(this.p2, t);
            return temp1.lerp(temp2, t).clone();
        }
    }

    // ==========================================
    // 1. Central Singularity Core
    // ==========================================
    const singularityGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(2, 4);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    singularityGroup.add(coreMesh);
    animationTargets.coreCore = coreMesh;

    for(let i=0; i<4; i++) {
        const shellGeo = new THREE.IcosahedronGeometry(2.5 + i*0.8, 2);
        const shellMesh = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({
            color: 0xffffff, wireframe: true, emissive: 0x00ffff,
            emissiveIntensity: 1.0 - (i*0.2), transparent: true, opacity: 0.5
        }));
        singularityGroup.add(shellMesh);
        animationTargets.coreShells.push({ mesh: shellMesh, speed: 0.02 * (i%2===0?1:-1) * (i+1) });
    }
    group.add(singularityGroup);
    parts.push({
        name: "Central Singularity",
        description: "A microscopic kugelblitz black hole, sustained by pure photon injection.",
        material: "Planck-Density Emissive Plasma",
        function: "Energy Source",
        assemblyOrder: 1,
        connections: ["PhotonInjectionAxis", "SingularityContainmentField"],
        failureEffect: "Instantaneous collapse and Hawking evaporation, vaporizing the local star system.",
        cascadeFailures: ["MagneticConfinementRings"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0,0,0)
    });

    // ==========================================
    // 2. Singularity Containment Field
    // ==========================================
    const containmentGroup = new THREE.Group();
    const dodecaGeo = new THREE.DodecahedronGeometry(8, 1);
    const dodecaMesh = new THREE.Mesh(dodecaGeo, energyField);
    containmentGroup.add(dodecaMesh);
    
    // Add intricate wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(8.2, 2);
    const cageMesh = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({
        color: 0x111111, wireframe: true, metalness: 1.0, roughness: 0.2
    }));
    containmentGroup.add(cageMesh);
    group.add(containmentGroup);
    parts.push({
        name: "Singularity Containment Field",
        description: "Envelopes the kugelblitz in a stable false-vacuum bubble.",
        material: "Quantum Vacuum Manipulator Mesh",
        function: "Containment",
        assemblyOrder: 2,
        connections: ["CentralSingularity"],
        failureEffect: "Vacuum decay scenario initiating at the core.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0,0,20)
    });

    // ==========================================
    // 3. Photon Injection Axis
    // ==========================================
    const injectionPoints = [];
    for(let i=0; i<30; i++) {
        injectionPoints.push(new THREE.Vector2(1.5 + Math.sin(i*0.3)*0.4 - (i*0.02), i * 0.8));
    }
    const injectorGeo = new THREE.LatheGeometry(injectionPoints, 64);
    
    const topInjector = new THREE.Mesh(injectorGeo, superConductor);
    topInjector.position.y = 9;
    group.add(topInjector);
    
    const bottomInjector = new THREE.Mesh(injectorGeo, superConductor);
    bottomInjector.position.y = -9;
    bottomInjector.rotation.x = Math.PI;
    group.add(bottomInjector);

    // Glowing beams inside injectors
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
    const topBeam = new THREE.Mesh(beamGeo, coreMat);
    topBeam.position.y = 15;
    group.add(topBeam);
    animationTargets.photonBeams.push(topBeam);

    const bottomBeam = new THREE.Mesh(beamGeo, coreMat);
    bottomBeam.position.y = -15;
    group.add(bottomBeam);
    animationTargets.photonBeams.push(bottomBeam);

    parts.push({
        name: "Photon Injection Axis",
        description: "Massive collimators funneling high-energy gamma rays into the core.",
        material: "Supercooled YBCO Lattice",
        function: "Energy Delivery",
        assemblyOrder: 3,
        connections: ["CentralSingularity"],
        failureEffect: "Gamma ray burst directed vertically, annihilating overhead structures.",
        cascadeFailures: ["CentralSingularity"],
        originalPosition: new THREE.Vector3(0,10,0),
        explodedPosition: new THREE.Vector3(0,40,0)
    });

    // ==========================================
    // 4. CP Violation Filters (Matter Side - Blue)
    // ==========================================
    const matterFilterGroup = new THREE.Group();
    matterFilterGroup.position.y = 15;
    for(let i=0; i<12; i++) {
        const curve = new ReactorCoilCurve(12, 1.5, 4);
        const tubeGeo = new THREE.TubeGeometry(curve, 300, 0.6, 16, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, glass);
        tubeMesh.rotation.y = (i / 12) * Math.PI * 2;
        
        const innerPlasmaGeo = new THREE.TubeGeometry(curve, 300, 0.25, 8, true);
        const innerPlasma = new THREE.Mesh(innerPlasmaGeo, matterMat);
        tubeMesh.add(innerPlasma);
        
        matterFilterGroup.add(tubeMesh);
        animationTargets.matterHelices.push({ inner: innerPlasma, outer: tubeMesh, phase: i });
    }
    group.add(matterFilterGroup);
    parts.push({
        name: "CP Violation Filter (Matter)",
        description: "Asymmetrical chiral helices that preferentially resonate with baryonic matter generation.",
        material: "Transparent Aluminum & Baryonic Plasma",
        function: "Matter Separation",
        assemblyOrder: 4,
        connections: ["PhotonInjectionAxis"],
        failureEffect: "Symmetric pair production, neutralizing the reactor's purpose.",
        cascadeFailures: ["BaryonExtractionManifold"],
        originalPosition: new THREE.Vector3(0,15,0),
        explodedPosition: new THREE.Vector3(0,60,0)
    });

    // ==========================================
    // 5. Antimatter Annihilation Chamber (Red)
    // ==========================================
    const antimatterGroup = new THREE.Group();
    antimatterGroup.position.y = -20;
    const amBaseGeo = new THREE.CylinderGeometry(10, 16, 12, 12);
    const amBase = new THREE.Mesh(amBaseGeo, darkSteel);
    antimatterGroup.add(amBase);
    
    for(let i=0; i<12; i++) {
        const amSpikeGeo = new THREE.BoxGeometry(2, 20, 2);
        const pos = amSpikeGeo.attributes.position;
        for(let v=0; v<pos.count; v++) {
            if(pos.getY(v) > 0) {
                pos.setX(v, pos.getX(v) * 0.05);
                pos.setZ(v, pos.getZ(v) * 0.05);
            }
        }
        amSpikeGeo.computeVertexNormals();
        
        const amSpike = new THREE.Mesh(amSpikeGeo, antiMat);
        const angle = (i/12) * Math.PI * 2;
        
        const spikeHolder = new THREE.Group();
        spikeHolder.position.set(Math.cos(angle)*12, -6, Math.sin(angle)*12);
        spikeHolder.rotation.y = -angle;
        spikeHolder.rotation.x = Math.PI; // point downwards
        spikeHolder.rotation.z = Math.PI/5;
        
        spikeHolder.add(amSpike);
        antimatterGroup.add(spikeHolder);
        animationTargets.antiMatterSpikes.push({ mesh: spikeHolder, phase: i });
    }
    group.add(antimatterGroup);
    parts.push({
        name: "Antimatter Annihilation Chamber",
        description: "Vents and safely annihilates the generated antimatter away from the core.",
        material: "Neutronium Plated Dark Steel",
        function: "Antimatter Disposal",
        assemblyOrder: 5,
        connections: ["PhotonInjectionAxis"],
        failureEffect: "Catastrophic matter-antimatter detonation.",
        cascadeFailures: ["MobileChassis", "SupportScaffolding"],
        originalPosition: new THREE.Vector3(0,-20,0),
        explodedPosition: new THREE.Vector3(0,-60,0)
    });

    // ==========================================
    // 6. Magnetic Confinement Rings
    // ==========================================
    const ringGroup = new THREE.Group();
    const ringRadiusBase = 22;
    for(let i=0; i<20; i++) {
        const ringRadius = ringRadiusBase + Math.sin(i*Math.PI/10)*3;
        const ringGeo = new THREE.TorusGeometry(ringRadius, 0.6, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        ringMesh.rotation.x = Math.PI/2;
        ringMesh.position.y = (i - 10) * 2;
        
        for(let j=0; j<16; j++) {
            const connGeo = new THREE.BoxGeometry(1.5, 0.8, 3);
            const connMesh = new THREE.Mesh(connGeo, darkSteel);
            const angle = (j / 16) * Math.PI * 2;
            connMesh.position.set(Math.cos(angle)*ringRadius, 0, Math.sin(angle)*ringRadius);
            connMesh.lookAt(0, ringMesh.position.y, 0);
            ringMesh.add(connMesh);
            
            const lightGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const lightMesh = new THREE.Mesh(lightGeo, hologramMat);
            lightMesh.position.set(0, 0.6, 0);
            connMesh.add(lightMesh);
            animationTargets.holograms.push({ mesh: lightMesh, phase: i+j });
        }
        ringGroup.add(ringMesh);
        animationTargets.containmentRings.push({ mesh: ringMesh, baseY: ringMesh.position.y, phase: i });
    }
    group.add(ringGroup);
    parts.push({
        name: "Magnetic Confinement Rings",
        description: "Massive toroids generating multi-tesla fields to shape the plasma.",
        material: "Ferromagnetic Steel & Superconductors",
        function: "Plasma Shaping",
        assemblyOrder: 6,
        connections: ["SupportScaffolding"],
        failureEffect: "Plasma breach, melting internal components.",
        cascadeFailures: ["CPViolationFilters"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0,0,-80)
    });

    // ==========================================
    // 7. Mobile Chassis
    // ==========================================
    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = -50;
    
    const mainBodyGeo = new THREE.BoxGeometry(40, 12, 90);
    const mainBody = new THREE.Mesh(mainBodyGeo, darkSteel);
    chassisGroup.add(mainBody);

    // Greebling for panel lines
    function generatePanelLines(targetGroup, width, height, depth) {
        const numPanels = 300;
        for(let i=0; i<numPanels; i++) {
            const pw = Math.random() * 3 + 1;
            const ph = Math.random() * 3 + 1;
            const panelGeo = new THREE.BoxGeometry(pw, ph, 0.2);
            const panel = new THREE.Mesh(panelGeo, steel);
            const face = Math.floor(Math.random() * 6);
            if(face === 0) {
                panel.position.set(width/2 + 0.1, (Math.random()-0.5)*height, (Math.random()-0.5)*depth);
                panel.rotation.y = Math.PI/2;
            } else if(face === 1) {
                panel.position.set(-width/2 - 0.1, (Math.random()-0.5)*height, (Math.random()-0.5)*depth);
                panel.rotation.y = -Math.PI/2;
            } else if(face === 2) {
                panel.position.set((Math.random()-0.5)*width, height/2 + 0.1, (Math.random()-0.5)*depth);
                panel.rotation.x = -Math.PI/2;
            } else if(face === 3) {
                panel.position.set((Math.random()-0.5)*width, -height/2 - 0.1, (Math.random()-0.5)*depth);
                panel.rotation.x = Math.PI/2;
            } else if(face === 4) {
                panel.position.set((Math.random()-0.5)*width, (Math.random()-0.5)*height, depth/2 + 0.1);
            } else if(face === 5) {
                panel.position.set((Math.random()-0.5)*width, (Math.random()-0.5)*height, -depth/2 - 0.1);
                panel.rotation.y = Math.PI;
            }
            targetGroup.add(panel);
        }
    }
    generatePanelLines(chassisGroup, 40, 12, 90);

    group.add(chassisGroup);
    parts.push({
        name: "Mobile Chassis",
        description: "Monolithic dark steel platform housing the engine drive and supporting the reactor mass.",
        material: "Dark Steel & Titanium Alloy",
        function: "Structural Base & Locomotion",
        assemblyOrder: 7,
        connections: ["AllTerrainTires", "SupportScaffolding", "OperatorCabin"],
        failureEffect: "Immobilization and structural sagging.",
        cascadeFailures: ["SupportScaffolding"],
        originalPosition: new THREE.Vector3(0,-50,0),
        explodedPosition: new THREE.Vector3(0,-100,0)
    });

    // ==========================================
    // 8. All-Terrain Tractor Tires
    // ==========================================
    const wheelPositions = [
        [-25, -50, 35], [25, -50, 35],
        [-25, -50, 12], [25, -50, 12],
        [-25, -50, -12], [25, -50, -12],
        [-25, -50, -35], [25, -50, -35]
    ];
    
    wheelPositions.forEach((pos) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos[0], pos[1], pos[2]);
        
        const tireGeo = new THREE.TorusGeometry(8, 3, 32, 120);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireMesh.rotation.y = Math.PI/2;
        wheelGroup.add(tireMesh);
        
        // Aggressive Treads
        const numLugs = 80;
        for(let l=0; l<numLugs; l++) {
            const lugAngle = (l / numLugs) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(6.5, 1.2, 1.8);
            const lugPos = lugGeo.attributes.position;
            for(let v=0; v<lugPos.count; v++) {
                if(lugPos.getY(v) > 0) {
                    lugPos.setX(v, lugPos.getX(v) * 0.7);
                    lugPos.setZ(v, lugPos.getZ(v) * 0.7);
                }
            }
            lugGeo.computeVertexNormals();
            
            const lugMesh = new THREE.Mesh(lugGeo, rubber);
            lugMesh.position.set(0, Math.sin(lugAngle) * 11, Math.cos(lugAngle) * 11);
            lugMesh.rotation.x = lugAngle;
            tireMesh.add(lugMesh);
        }
        
        // Rims
        const rimGeo = new THREE.CylinderGeometry(6, 6, 5, 32);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.z = Math.PI/2;
        wheelGroup.add(rimMesh);
        
        const numSpokes = 16;
        for(let s=0; s<numSpokes; s++) {
            const spokeAngle = (s / numSpokes) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.4, 0.6, 6, 8);
            const spokeMesh = new THREE.Mesh(spokeGeo, darkSteel);
            spokeMesh.position.set(0, Math.sin(spokeAngle) * 3, Math.cos(spokeAngle) * 3);
            spokeMesh.rotation.x = spokeAngle;
            rimMesh.add(spokeMesh);
        }
        
        const hubGeo = new THREE.CylinderGeometry(1.5, 2, 5.5, 16);
        const hubMesh = new THREE.Mesh(hubGeo, goldFoil);
        hubMesh.rotation.z = Math.PI/2;
        wheelGroup.add(hubMesh);
        
        group.add(wheelGroup);
        animationTargets.tires.push(tireMesh);
    });

    parts.push({
        name: "All-Terrain Tractor Tires",
        description: "Massive rubber and steel tread arrays for moving the reactor across rough planetary surfaces.",
        material: "Vulcanized Rubber & Chrome",
        function: "Locomotion",
        assemblyOrder: 8,
        connections: ["MobileChassis"],
        failureEffect: "Loss of mobility, extreme terrain vulnerability.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0,-50,0),
        explodedPosition: new THREE.Vector3(100,-50,0)
    });

    // ==========================================
    // 9. Support Scaffolding
    // ==========================================
    const scaffoldGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const radius = 32;
        const pillarGeo = new THREE.CylinderGeometry(1.5, 1.5, 90, 16);
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(Math.cos(angle)*radius, -5, Math.sin(angle)*radius);
        scaffoldGroup.add(pillar);
        
        for(let j=0; j<25; j++) {
            const h = -45 + j*3.5;
            const nextAngle = ((i+1)%8) * Math.PI * 2;
            const p1 = new THREE.Vector3(Math.cos(angle)*radius, h, Math.sin(angle)*radius);
            const p2 = new THREE.Vector3(Math.cos(nextAngle)*radius, h, Math.sin(nextAngle)*radius);
            
            const dist = p1.distanceTo(p2);
            const strutGeo = new THREE.CylinderGeometry(0.4, 0.4, dist, 8);
            const strut = new THREE.Mesh(strutGeo, aluminum);
            
            strut.position.copy(p1).lerp(p2, 0.5);
            strut.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
            scaffoldGroup.add(strut);
        }
    }
    group.add(scaffoldGroup);
    parts.push({
        name: "Support Scaffolding",
        description: "Intricate web of steel and aluminum struts absorbing vibrations from the CP-violating reactions.",
        material: "Steel & Aluminum",
        function: "Structural Integrity",
        assemblyOrder: 9,
        connections: ["MobileChassis", "MagneticConfinementRings"],
        failureEffect: "Reactor core misalignment, causing catastrophic containment failure.",
        cascadeFailures: ["CentralSingularity"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(-80,0,0)
    });

    // ==========================================
    // 10. Operator Cabin
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -38, 50); 
    
    const cabinBodyGeo = new THREE.BoxGeometry(14, 10, 10);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, steel);
    cabinGroup.add(cabinBody);
    
    const windowGeo = new THREE.PlaneGeometry(12, 5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 1.5, 5.1);
    cabinGroup.add(windowMesh);
    
    for(let side of [-1, 1]) {
        const mirrorArmGeo = new THREE.CylinderGeometry(0.15, 0.15, 3);
        const mirrorArm = new THREE.Mesh(mirrorArmGeo, chrome);
        mirrorArm.position.set(side * 8, 1, 4);
        mirrorArm.rotation.z = side * Math.PI/2;
        cabinGroup.add(mirrorArm);
        
        const mirrorGeo = new THREE.BoxGeometry(0.8, 2, 0.3);
        const mirrorMesh = new THREE.Mesh(mirrorGeo, chrome);
        mirrorMesh.position.set(side * 9.5, 1, 4);
        mirrorMesh.rotation.y = side * Math.PI/6;
        cabinGroup.add(mirrorMesh);
    }
    
    const grilleGeo = new THREE.BoxGeometry(8, 4, 0.6);
    const grilleMesh = new THREE.Mesh(grilleGeo, darkSteel);
    grilleMesh.position.set(0, -2.5, 5.1);
    cabinGroup.add(grilleMesh);
    for(let g=0; g<12; g++) {
        const slatGeo = new THREE.BoxGeometry(7.5, 0.15, 0.8);
        const slat = new THREE.Mesh(slatGeo, chrome);
        slat.position.set(0, -4 + g*0.3, 5.1);
        cabinGroup.add(slat);
    }
    
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(-8, -8, 2);
    const railGeo = new THREE.CylinderGeometry(0.15, 0.15, 15);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(-1.5, 0, 0);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(1.5, 0, 0);
    ladderGroup.add(rail1, rail2);
    for(let r=0; r<15; r++) {
        const rungGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.z = Math.PI/2;
        rung.position.set(0, -7 + r, 0);
        ladderGroup.add(rung);
    }
    cabinGroup.add(ladderGroup);
    
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, 0, 3);
    
    const steerGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 32);
    const steerMesh = new THREE.Mesh(steerGeo, rubber);
    steerMesh.position.set(-3, 0, 0);
    steerMesh.rotation.x = -Math.PI/6;
    const sSpokeGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4);
    const sSpoke = new THREE.Mesh(sSpokeGeo, chrome);
    steerMesh.add(sSpoke);
    const sSpoke2 = new THREE.Mesh(sSpokeGeo, chrome);
    sSpoke2.rotation.z = Math.PI/2;
    steerMesh.add(sSpoke2);
    interiorGroup.add(steerMesh);
    animationTargets.steeringWheel = steerMesh;
    
    const joyBaseGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const joyArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
    const joyKnobGeo = new THREE.SphereGeometry(0.3, 16, 16);
    
    const joy1Base = new THREE.Mesh(joyBaseGeo, darkSteel);
    joy1Base.position.set(3, -1, 0);
    const joy1Arm = new THREE.Mesh(joyArmGeo, steel);
    joy1Arm.position.set(0, 0.75, 0);
    const joy1Knob = new THREE.Mesh(joyKnobGeo, antiMat); 
    joy1Knob.position.set(0, 1.5, 0);
    joy1Base.add(joy1Arm, joy1Knob);
    interiorGroup.add(joy1Base);
    animationTargets.joystick1 = joy1Base;
    
    const panelGeo = new THREE.PlaneGeometry(5, 2.5);
    const panelMesh = new THREE.Mesh(panelGeo, hologramMat);
    panelMesh.position.set(0, -0.5, 1);
    panelMesh.rotation.x = -Math.PI/4;
    interiorGroup.add(panelMesh);
    
    cabinGroup.add(interiorGroup);
    
    // Add radar dish on cabin roof
    const radarGeo = new THREE.SphereGeometry(2, 16, 16, 0, Math.PI);
    const radarMesh = new THREE.Mesh(radarGeo, chrome);
    radarMesh.rotation.x = -Math.PI/2;
    radarMesh.position.set(0, 6, -2);
    cabinGroup.add(radarMesh);
    animationTargets.radarDish = radarMesh;

    group.add(cabinGroup);
    parts.push({
        name: "Operator Cabin",
        description: "Heavily shielded command center featuring tinted glass, steering controls, joysticks, and retro-holographic displays.",
        material: "Lead-Lined Steel & Tinted Glass",
        function: "Manual Override & Navigation",
        assemblyOrder: 10,
        connections: ["MobileChassis"],
        failureEffect: "Operator death due to extreme radiation exposure.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0,-38,50),
        explodedPosition: new THREE.Vector3(0,-38,100)
    });

    // ==========================================
    // 11. Hydraulic Boom Arms
    // ==========================================
    const boomGroup = new THREE.Group();
    for(let side of [-1, 1]) {
        const boomArmGeo = new THREE.BoxGeometry(6, 60, 6);
        const boomArm = new THREE.Mesh(boomArmGeo, darkSteel);
        boomArm.position.set(side * 35, -10, 0);
        boomArm.rotation.z = side * Math.PI/8;
        boomGroup.add(boomArm);
        
        const cylinderOuterGeo = new THREE.CylinderGeometry(2.5, 2.5, 30, 16);
        const cylinderInnerGeo = new THREE.CylinderGeometry(1.8, 1.8, 30, 16);
        const cylinderOuter = new THREE.Mesh(cylinderOuterGeo, steel);
        const cylinderInner = new THREE.Mesh(cylinderInnerGeo, chrome);
        
        cylinderOuter.position.set(side * 25, -30, 0);
        cylinderOuter.rotation.z = side * Math.PI/6;
        
        cylinderInner.position.set(0, 15, 0); 
        cylinderOuter.add(cylinderInner);
        boomGroup.add(cylinderOuter);
        animationTargets.pistons.push({ outer: cylinderOuter, inner: cylinderInner, baseLength: 15 });
        
        const lineCurve = new HydraulicLineCurve(
            new THREE.Vector3(side * 25, -35, 0), 
            new THREE.Vector3(side * 30, -10, 0), 
            new THREE.Vector3(side * 15, -20, 8)
        );
        const lineGeo = new THREE.TubeGeometry(lineCurve, 20, 0.5, 8, false);
        const lineMesh = new THREE.Mesh(lineGeo, rubber);
        boomGroup.add(lineMesh);
    }
    group.add(boomGroup);
    parts.push({
        name: "Hydraulic Boom Arms",
        description: "Massive articulated lifters supporting the outer containment modules, powered by high-pressure hydraulics.",
        material: "Dark Steel & Chrome",
        function: "Structural Articulation",
        assemblyOrder: 11,
        connections: ["MobileChassis", "SupportScaffolding"],
        failureEffect: "Structural collapse of the outer rings.",
        cascadeFailures: ["MagneticConfinementRings"],
        originalPosition: new THREE.Vector3(0,-10,0),
        explodedPosition: new THREE.Vector3(0,-10,80)
    });

    // ==========================================
    // 12. Plasma Exhaust Stacks
    // ==========================================
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, -44, -30);
    for(let side of [-1, 1]) {
        for(let i=0; i<3; i++) {
            const stackGeo = new THREE.CylinderGeometry(2, 2, 20, 16);
            const stack = new THREE.Mesh(stackGeo, chrome);
            stack.position.set(side * 15, 10, i * 6);
            
            const stackTopGeo = new THREE.TorusGeometry(2, 2, 16, 16, Math.PI/2);
            const stackTop = new THREE.Mesh(stackTopGeo, chrome);
            stackTop.position.set(0, 10, 2);
            stackTop.rotation.y = side * Math.PI/2;
            stack.add(stackTop);
            
            exhaustGroup.add(stack);
            
            for(let p=0; p<4; p++) {
                const smokeGeo = new THREE.SphereGeometry(1.5, 8, 8);
                const smoke = new THREE.Mesh(smokeGeo, new THREE.MeshStandardMaterial({
                    color: 0x222222, emissive: 0x111111, transparent: true, opacity: 0.6
                }));
                smoke.position.set(side * 15, 22 + p*3, i*6 + (side === 1 ? -1 : 1) * 4);
                exhaustGroup.add(smoke);
                animationTargets.smokeParticles.push({ mesh: smoke, phase: p + i, side: side });
            }
        }
    }
    group.add(exhaustGroup);
    parts.push({
        name: "Plasma Exhaust Stacks",
        description: "Vents excess thermal energy and non-baryonic waste from the chassis drive.",
        material: "Chrome Plating",
        function: "Heat Dissipation",
        assemblyOrder: 12,
        connections: ["MobileChassis"],
        failureEffect: "Chassis drive meltdown.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0,-44,-30),
        explodedPosition: new THREE.Vector3(0,-44,-80)
    });

    // ==========================================
    // 13. Quantum Decoherence Baffles
    // ==========================================
    const baffleGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const baffleGeo = new THREE.RingGeometry(24, 34, 32, 1, 0, Math.PI/3);
        const baffle = new THREE.Mesh(baffleGeo, goldFoil);
        baffle.material.side = THREE.DoubleSide;
        baffle.position.y = (i - 8) * 4;
        baffle.rotation.x = Math.PI/2;
        baffle.rotation.z = (i/16) * Math.PI * 2;
        baffleGroup.add(baffle);
        animationTargets.baffles.push({ mesh: baffle, phase: i });
    }
    group.add(baffleGroup);
    parts.push({
        name: "Quantum Decoherence Baffles",
        description: "Gold-foil arrays that selectively force wave-function collapse on rogue particle emissions.",
        material: "Gold Foil",
        function: "Quantum Filtering",
        assemblyOrder: 13,
        connections: ["MagneticConfinementRings"],
        failureEffect: "Uncontrolled quantum superposition, blurring macro reality.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(60,0,0)
    });

    // ==========================================
    // 14. Higgs Field Exciters
    // ==========================================
    const higgsGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const octaGeo = new THREE.OctahedronGeometry(5, 0);
        const octa = new THREE.Mesh(octaGeo, new THREE.MeshStandardMaterial({
            color: 0xffffff, emissive: 0xffaaff, emissiveIntensity: 2.0, wireframe: true
        }));
        const angle = (i/6) * Math.PI * 2;
        octa.position.set(Math.cos(angle)*40, 50, Math.sin(angle)*40);
        
        const innerOcta = new THREE.Mesh(new THREE.OctahedronGeometry(2.5, 0), matterMat);
        octa.add(innerOcta);
        
        higgsGroup.add(octa);
        animationTargets.higgsCouplers.push({ mesh: octa, phase: i, inner: innerOcta });
    }
    group.add(higgsGroup);
    parts.push({
        name: "Higgs Field Exciters",
        description: "Induces localized spikes in the Higgs vacuum expectation value to impart mass to generated particles.",
        material: "Wireframe Exotic Matter",
        function: "Mass Generation",
        assemblyOrder: 14,
        connections: ["SupportScaffolding"],
        failureEffect: "Particles remain massless, instantly radiating away at the speed of light.",
        cascadeFailures: ["BaryonExtractionManifold"],
        originalPosition: new THREE.Vector3(0,50,0),
        explodedPosition: new THREE.Vector3(0,100,0)
    });

    // ==========================================
    // 15. Dark Matter Inhibitors
    // ==========================================
    const dmiGroup = new THREE.Group();
    const dmiPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(45, 0, 45),
        new THREE.Vector3(55, 15, 0),
        new THREE.Vector3(45, 0, -45),
        new THREE.Vector3(0, -15, -55),
        new THREE.Vector3(-45, 0, -45),
        new THREE.Vector3(-55, 15, 0),
        new THREE.Vector3(-45, 0, 45),
        new THREE.Vector3(0, -15, 55)
    ], true);
    
    const dmiGeo = new THREE.TubeGeometry(dmiPath, 200, 1.5, 16, true);
    const dmiMesh = new THREE.Mesh(dmiGeo, superConductor);
    dmiGroup.add(dmiMesh);
    
    for(let i=0; i<20; i++) {
        const nodeGeo = new THREE.DodecahedronGeometry(3);
        const node = new THREE.Mesh(nodeGeo, energyField);
        const pt = dmiPath.getPoint(i/20);
        node.position.copy(pt);
        dmiGroup.add(node);
        animationTargets.dmiNodes.push({ mesh: node, phase: i });
    }
    group.add(dmiGroup);
    parts.push({
        name: "Dark Matter Inhibitors",
        description: "A continuous superconducting loop actively cancelling out weakly interacting massive particle (WIMP) interference.",
        material: "Superconductor & Energy Fields",
        function: "Interference Negation",
        assemblyOrder: 15,
        connections: ["MagneticConfinementRings"],
        failureEffect: "Unseen gravitational anomalies tearing the reactor apart.",
        cascadeFailures: ["SingularityContainmentField"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0,-50,50)
    });

    // ==========================================
    // 16. Cooling Fan Arrays
    // ==========================================
    const fansGroup = new THREE.Group();
    fansGroup.position.set(-21, -44, 0); 
    for(let f=0; f<8; f++) {
        const fanGeo = new THREE.CylinderGeometry(3, 3, 0.8, 32);
        const fanMesh = new THREE.Mesh(fanGeo, darkSteel);
        fanMesh.rotation.z = Math.PI/2;
        fanMesh.position.set(0, (f%2)*7 - 3.5, Math.floor(f/2)*7 - 10.5);
        
        const bladeGroup = new THREE.Group();
        for(let b=0; b<10; b++) {
            const bladeGeo = new THREE.BoxGeometry(0.15, 2.7, 1.2);
            const blade = new THREE.Mesh(bladeGeo, chrome);
            blade.position.set(0, Math.cos((b/10)*Math.PI*2)*1.5, Math.sin((b/10)*Math.PI*2)*1.5);
            blade.rotation.x = (b/10)*Math.PI*2;
            blade.rotation.y = Math.PI/4;
            bladeGroup.add(blade);
        }
        fanMesh.add(bladeGroup);
        fansGroup.add(fanMesh);
        animationTargets.fans.push({ mesh: bladeGroup, speed: 12 + Math.random()*4 });
    }
    group.add(fansGroup);
    parts.push({
        name: "High-RPM Cooling Fans",
        description: "Industrial cooling arrays pumping atmospheric gases over the superconductor radiators.",
        material: "Dark Steel & Chrome",
        function: "Thermal Management",
        assemblyOrder: 16,
        connections: ["MobileChassis"],
        failureEffect: "Overheating superconductors, causing magnetic field collapse.",
        cascadeFailures: ["MagneticConfinementRings"],
        originalPosition: new THREE.Vector3(-21,-44,0),
        explodedPosition: new THREE.Vector3(-60,-44,0)
    });

    // ==========================================
    // 17. Matter / Antimatter Flow Channels & Tank
    // ==========================================
    const matterFlow = [];
    const antiMatterFlow = [];
    
    const tankGeo = new THREE.SphereGeometry(18, 32, 32);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(0, 45, -45);
    
    // Add metal banding to tank
    const bandGeo = new THREE.TorusGeometry(18.2, 0.5, 16, 64);
    const band1 = new THREE.Mesh(bandGeo, steel);
    band1.rotation.x = Math.PI/2;
    tankMesh.add(band1);
    const band2 = new THREE.Mesh(bandGeo, steel);
    tankMesh.add(band2);

    const tankFluidGeo = new THREE.SphereGeometry(17, 32, 32);
    const tankFluid = new THREE.Mesh(tankFluidGeo, matterMat);
    tankMesh.add(tankFluid);
    animationTargets.tankFluid = tankFluid;
    group.add(tankMesh);
    
    const matterPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 15, 0),
        new THREE.Vector3(15, 30, -20),
        new THREE.Vector3(0, 45, -45)
    ]);
    
    const antiMatterPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -20, 0),
        new THREE.Vector3(-15, -35, 20),
        new THREE.Vector3(0, -50, 60)
    ]);
    
    for(let i=0; i<40; i++) {
        const mPart = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), matterMat);
        group.add(mPart);
        matterFlow.push({ mesh: mPart, phase: i/40 });
        
        const aPart = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), antiMat);
        group.add(aPart);
        antiMatterFlow.push({ mesh: aPart, phase: i/40 });
    }
    
    animationTargets.matterFlow = { path: matterPath, particles: matterFlow };
    animationTargets.antiMatterFlow = { path: antiMatterPath, particles: antiMatterFlow };

    parts.push({
        name: "Matter Extraction & Antimatter Venting System",
        description: "Pipes harvesting baryonic matter into the primary spherical glass tank while safely venting antimatter into space.",
        material: "Glass, Steel & Plasma",
        function: "Product Harvesting",
        assemblyOrder: 17,
        connections: ["CPViolationFilters", "AntimatterAnnihilationChamber"],
        failureEffect: "Backflow of antimatter into the harvesting tank.",
        cascadeFailures: ["AntimatterAnnihilationChamber"],
        originalPosition: new THREE.Vector3(0,45,-45),
        explodedPosition: new THREE.Vector3(0,80,-80)
    });

    // ==========================================
    // Core Animation Logic
    // ==========================================
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        if(animationTargets.coreCore) {
            animationTargets.coreCore.scale.setScalar(1 + Math.sin(t * 12)*0.08);
            animationTargets.coreCore.rotation.y = t * 3;
            animationTargets.coreCore.rotation.z = t * 2.1;
        }
        
        animationTargets.coreShells.forEach((shell) => {
            shell.mesh.rotation.x = t * shell.speed;
            shell.mesh.rotation.z = t * shell.speed * 1.5;
            shell.mesh.scale.setScalar(1 + Math.sin(t * 8 + shell.speed * 100)*0.05);
        });
        
        animationTargets.containmentRings.forEach((ring) => {
            ring.mesh.position.y = ring.baseY + Math.sin(t * 2.5 + ring.phase)*0.8;
            ring.mesh.rotation.z = Math.sin(t * 1.2 + ring.phase)*0.08;
            ring.mesh.rotation.x = Math.PI/2 + Math.cos(t * 0.8 + ring.phase)*0.05;
        });
        
        animationTargets.matterHelices.forEach((helix) => {
            helix.inner.rotation.x = t * 6 + helix.phase;
            helix.outer.rotation.x = -t * 2 + helix.phase;
            helix.inner.material.opacity = 0.6 + Math.sin(t * 10 + helix.phase)*0.4;
        });
        
        animationTargets.antiMatterSpikes.forEach((spike) => {
            spike.mesh.rotation.y = t * 4 + spike.phase;
            spike.mesh.position.y = -6 + Math.sin(t * 12 + spike.phase) * 1.8;
        });
        
        animationTargets.holograms.forEach((holo) => {
            holo.mesh.material.emissiveIntensity = 0.5 + Math.sin(t * 25 + holo.phase) * 1.5;
        });
        
        if (animationTargets.steeringWheel) {
            animationTargets.steeringWheel.rotation.z = Math.sin(t * 0.6) * Math.PI/3;
        }
        
        if (animationTargets.joystick1) {
            animationTargets.joystick1.rotation.x = Math.sin(t * 2.5) * Math.PI/6;
            animationTargets.joystick1.rotation.z = Math.cos(t * 1.8) * Math.PI/6;
        }

        if (animationTargets.radarDish) {
            animationTargets.radarDish.rotation.z = t * 2;
        }
        
        animationTargets.pistons.forEach((piston) => {
            const extension = Math.sin(t * 1.5) * 6;
            piston.inner.position.y = piston.baseLength + extension;
        });
        
        animationTargets.smokeParticles.forEach((smoke) => {
            const phaseT = (t * 6 + smoke.phase) % 12;
            smoke.mesh.position.y = 22 + phaseT * 2.5;
            smoke.mesh.scale.setScalar(1 + phaseT * 0.6);
            smoke.mesh.material.opacity = Math.max(0, 1 - (phaseT / 12));
        });
        
        animationTargets.baffles.forEach((baffle) => {
            baffle.mesh.rotation.z += 0.015 * speed;
        });
        
        animationTargets.higgsCouplers.forEach((coupler) => {
            coupler.mesh.rotation.x = t * 3.5 + coupler.phase;
            coupler.mesh.rotation.y = t * 4.5 + coupler.phase;
            coupler.mesh.position.y = 50 + Math.sin(t * 6 + coupler.phase) * 6;
            coupler.inner.rotation.z = -t * 12;
            coupler.inner.scale.setScalar(1 + Math.sin(t*15)*0.2);
        });
        
        animationTargets.dmiNodes.forEach((node) => {
            node.mesh.scale.setScalar(1 + Math.sin(t * 18 + node.phase)*0.6);
            node.mesh.rotation.y = t * 5;
        });
        
        animationTargets.tires.forEach((tire) => {
            tire.rotation.z = -t * 2.5; 
        });

        animationTargets.fans.forEach((fan) => {
            fan.mesh.rotation.x += fan.speed * speed * 0.05;
        });

        if (animationTargets.matterFlow) {
            animationTargets.matterFlow.particles.forEach((p) => {
                const pt = (t * 0.25 + p.phase) % 1;
                const pos = animationTargets.matterFlow.path.getPoint(pt);
                p.mesh.position.copy(pos);
                p.mesh.scale.setScalar(1 + Math.sin(pt * Math.PI)*0.8);
            });
            animationTargets.antiMatterFlow.particles.forEach((p) => {
                const pt = (t * 0.6 + p.phase) % 1; 
                const pos = animationTargets.antiMatterFlow.path.getPoint(pt);
                p.mesh.position.copy(pos);
                p.mesh.scale.setScalar(1 + Math.sin(pt * Math.PI)*2.0);
            });
        }
        
        if (animationTargets.tankFluid) {
            animationTargets.tankFluid.scale.setScalar(1 + Math.sin(t * 2.5)*0.03);
            animationTargets.tankFluid.rotation.y = t * 0.6;
            animationTargets.tankFluid.rotation.x = Math.sin(t * 0.5) * 0.1;
        }

        animationTargets.photonBeams.forEach((beam) => {
            beam.scale.set(1 + Math.random()*0.2, 1, 1 + Math.random()*0.2);
            beam.material.emissiveIntensity = 2.0 + Math.random()*2.0;
        });
    }

    // ==========================================
    // Educational Physics / Cosmology Quiz
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Sakharov conditions for baryogenesis, which of the following is strictly required to generate a net baryon asymmetry from an initially symmetric state?",
            options: [
                "Conservation of baryon number and C-symmetry.",
                "Thermal equilibrium and violation of parity.",
                "Violation of C and CP symmetry, baryon number violation, and interactions out of thermal equilibrium.",
                "Conservation of lepton number and the presence of massless neutrinos."
            ],
            answer: 2
        },
        {
            question: "Sphaleron transitions in the Standard Model are non-perturbative processes that violate which of the following conservation laws at high temperatures?",
            options: [
                "B - L (Baryon minus Lepton number).",
                "B + L (Baryon plus Lepton number).",
                "Electric Charge.",
                "Weak Isospin."
            ],
            answer: 1
        },
        {
            question: "Electroweak baryogenesis relies on a strongly first-order phase transition to provide the out-of-equilibrium condition. Why does the Standard Model (with a 125 GeV Higgs boson) fail to satisfy this requirement?",
            options: [
                "The electroweak phase transition in the SM is a smooth crossover rather than a true first-order phase transition.",
                "The Higgs boson decays too quickly into bottom quarks.",
                "The mass of the top quark is too low to catalyze the transition.",
                "The W and Z bosons do not acquire mass during the transition."
            ],
            answer: 0
        },
        {
            question: "In leptogenesis, the initial asymmetry is generated in the lepton sector through the CP-violating out-of-equilibrium decay of what theoretical particles?",
            options: [
                "Heavy left-handed Dirac neutrinos.",
                "Light active neutrinos.",
                "Right-handed W bosons.",
                "Heavy right-handed Majorana neutrinos."
            ],
            answer: 3
        },
        {
            question: "The Jarlskog invariant (J) quantifies CP violation in the quark sector via the CKM matrix. Why is the CP violation provided by the SM CKM matrix considered insufficient to explain the observed baryon asymmetry of the Universe?",
            options: [
                "The CKM matrix is perfectly unitary, forbidding any macroscopic CP violation.",
                "The Jarlskog invariant is exactly zero for three generations of quarks.",
                "The dimensionless ratio J / (T_c)^6 is roughly 10^-20, which is many orders of magnitude smaller than the observed baryon-to-photon ratio.",
                "It only violates C symmetry, completely preserving CP symmetry."
            ],
            answer: 2
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
