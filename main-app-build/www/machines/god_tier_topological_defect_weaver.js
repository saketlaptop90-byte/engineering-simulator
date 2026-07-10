import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // =========================================================================
    // CUSTOM GLOWING EXOTIC MATERIALS
    // =========================================================================
    const cosmicStringMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 5.0,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });
    
    const domainWallMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 3.0,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });

    const monopoleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        roughness: 0.0,
        metalness: 1.0
    });

    const higgsFieldMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x4400aa,
        emissiveIntensity: 1.5,
        roughness: 0.9,
        metalness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    const quantumFoamMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x222244,
        emissiveIntensity: 0.8,
        roughness: 0.8,
        metalness: 0.9,
        transparent: true,
        opacity: 0.4
    });

    const neonScreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        roughness: 0.4,
        metalness: 0.2
    });

    const warningLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4.0,
        roughness: 0.1,
        metalness: 0.1
    });

    // =========================================================================
    // MATHEMATICAL CURVES FOR HYPER-REALISTIC TUBES AND STRINGS
    // =========================================================================
    class CosmicStringCurve extends THREE.Curve {
        constructor(scale = 1, phases = [0,0,0]) {
            super();
            this.scale = scale;
            this.phases = phases;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.sin(2 * Math.PI * t + this.phases[0]) * 5 + Math.cos(7 * Math.PI * t) * 1.5;
            const ty = Math.cos(3 * Math.PI * t + this.phases[1]) * 5 + Math.sin(11 * Math.PI * t) * 1.5;
            const tz = Math.sin(5 * Math.PI * t + this.phases[2]) * 5 + Math.cos(13 * Math.PI * t) * 1.5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    class BraidedCableCurve extends THREE.Curve {
        constructor(radius, turns, length, offsetAngle) {
            super();
            this.radius = radius;
            this.turns = turns;
            this.length = length;
            this.offsetAngle = offsetAngle;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * this.turns * t + this.offsetAngle;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = (t - 0.5) * this.length;
            return optionalTarget.set(x, y, z);
        }
    }

    class SpiralCoolantCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * this.turns * t;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    // =========================================================================
    // PROCEDURAL COMPONENT GENERATORS
    // =========================================================================
    
    // Extruded Gear Generator
    const createGear = (radius, teeth, depth, material) => {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.8;
        const holeRadius = radius * 0.3;
        
        for (let i = 0; i < teeth; i++) {
            const a = (i / teeth) * Math.PI * 2;
            const aNext = ((i + 1) / teeth) * Math.PI * 2;
            const aMid = (a + aNext) / 2;
            
            if (i === 0) shape.moveTo(Math.cos(a) * innerRadius, Math.sin(a) * innerRadius);
            else shape.lineTo(Math.cos(a) * innerRadius, Math.sin(a) * innerRadius);
            
            shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
            shape.lineTo(Math.cos(aMid) * radius, Math.sin(aMid) * radius);
            shape.lineTo(Math.cos(aMid) * innerRadius, Math.sin(aMid) * innerRadius);
        }
        shape.lineTo(Math.cos(0) * innerRadius, Math.sin(0) * innerRadius);

        const hole = new THREE.Path();
        hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, material);
    };

    // Hydraulic Piston Generator
    const createHydraulicPiston = (namePrefix, length, radius, x, y, z, rx, ry, rz, groupParent) => {
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.2, 32);
        
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        const rod = new THREE.Mesh(rodGeo, chrome);
        
        cylinder.position.set(x, y, z);
        cylinder.rotation.set(rx, ry, rz);
        
        rod.position.set(0, length * 0.4, 0); 
        cylinder.add(rod);
        
        const fittingGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.2, 16, 32);
        const topFitting = new THREE.Mesh(fittingGeo, steel);
        topFitting.position.set(0, length/2, 0);
        topFitting.rotation.x = Math.PI / 2;
        cylinder.add(topFitting);

        const bottomFitting = new THREE.Mesh(fittingGeo, steel);
        bottomFitting.position.set(0, -length/2, 0);
        bottomFitting.rotation.x = Math.PI / 2;
        cylinder.add(bottomFitting);

        groupParent.add(cylinder);

        parts.push({
            name: `${namePrefix}_Cylinder_Casing`,
            description: `Hyper-baric titanium-tungsten casing designed to handle immense fluid pressures during defect manipulation.`,
            material: 'darkSteel',
            function: 'Contains hydraulic fluid for primary articulation.',
            assemblyOrder: parts.length + 1,
            connections: ['Structural_Mount', 'Hydraulic_Lines'],
            failureEffect: 'Rupture causes hyper-velocity fluid ejection and structural collapse.',
            cascadeFailures: ['Arm Paralysis', 'Defect Recoil'],
            originalPosition: { x, y, z },
            explodedPosition: { x: x * 1.2, y: y * 1.2, z: z * 1.2 },
            meshRef: cylinder
        });

        parts.push({
            name: `${namePrefix}_Actuator_Rod`,
            description: `Polished chronium-carbide piston rod capable of sustaining gigatons of shear force.`,
            material: 'chrome',
            function: 'Translates fluid pressure into linear kinetic output.',
            assemblyOrder: parts.length + 1,
            connections: [`${namePrefix}_Cylinder_Casing`, 'Joint_Assembly'],
            failureEffect: 'Snapping under anomalous gravitational loads.',
            cascadeFailures: ['Kinematic Severing'],
            originalPosition: { x: 0, y: length * 0.4, z: 0 },
            explodedPosition: { x: 0, y: length, z: 0 },
            meshRef: rod,
            parentMesh: cylinder
        });

        return { cylinder, rod };
    };

    // =========================================================================
    // CORE VACUUM CHAMBER (LATHE GEOMETRY)
    // =========================================================================
    const chamberPoints = [];
    for ( let i = 0; i <= 100; i ++ ) {
        const v = i / 100;
        const r = 25 + Math.sin(v * Math.PI) * 18 + Math.cos(v * Math.PI * 6) * 1.5;
        const h = (v - 0.5) * 80;
        chamberPoints.push( new THREE.Vector2( r, h ) );
    }
    const chamberGeo = new THREE.LatheGeometry(chamberPoints, 128);
    const mainChamber = new THREE.Mesh(chamberGeo, darkSteel);
    group.add(mainChamber);
    
    parts.push({
        name: 'Primary_Vacuum_Manifold_Shell',
        description: 'Neutronium-laced hyper-dense containment vessel designed to isolate the false-vacuum decay event from the baseline universe.',
        material: 'darkSteel',
        function: 'Maintains an absolute void state, allowing for spontaneous symmetry breaking and defect crystallization.',
        assemblyOrder: 1,
        connections: ['Cooling_Rings', 'Symmetry_Breaker_Core'],
        failureEffect: 'False vacuum collapse breaches the hull, spreading at the speed of light and destroying the observable universe.',
        cascadeFailures: ['Universal Annihilation', 'Spacetime Dissolution'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 },
        meshRef: mainChamber
    });

    // =========================================================================
    // MAGNETIC CONTAINMENT & COOLING RINGS
    // =========================================================================
    const rings = [];
    const ringCount = 12;
    for (let i = 0; i < ringCount; i++) {
        const ringRadius = 45 - Math.abs(i - ringCount/2) * 2;
        const ringGeo = new THREE.TorusGeometry(ringRadius, 1.8, 64, 128);
        const ring = new THREE.Mesh(ringGeo, copper);
        const yPos = -35 + (i * 6.3);
        ring.position.set(0, yPos, 0);
        ring.rotation.x = Math.PI / 2;
        
        // Add intricate nodes, heat sinks, and flux capacitors around each ring
        const nodeCount = 36;
        for(let j = 0; j < nodeCount; j++) {
            const angle = (j / nodeCount) * Math.PI * 2;
            
            // Heat Sink (Extruded shape instead of box)
            const sinkShape = new THREE.Shape();
            sinkShape.moveTo(-1, -1);
            sinkShape.lineTo(1, -1);
            sinkShape.lineTo(1.5, 0);
            sinkShape.lineTo(1, 1);
            sinkShape.lineTo(-1, 1);
            sinkShape.lineTo(-1, -1);
            
            const exSet = { depth: 4, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 2 };
            const nodeGeo = new THREE.ExtrudeGeometry(sinkShape, exSet);
            nodeGeo.center();
            const node = new THREE.Mesh(nodeGeo, aluminum);
            
            node.position.set(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius);
            node.rotation.y = -angle;
            node.rotation.x = Math.PI / 2; // Align with torus
            
            // Glowing flux diode
            const diodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const diode = new THREE.Mesh(diodeGeo, warningLightMaterial);
            diode.position.set(0, 0, 2);
            node.add(diode);

            ring.add(node);
        }

        mainChamber.add(ring);
        rings.push(ring);

        parts.push({
            name: `Superconducting_Containment_Toroid_${i}`,
            description: `Yttrium-Barium-Copper-Oxide toroid ring chilled to 0.001 Kelvin.`,
            material: 'copper/aluminum',
            function: 'Generates the immense magnetic fields needed to pin magnetic monopoles and stabilize the domain wall boundaries.',
            assemblyOrder: 10 + i,
            connections: ['Primary_Vacuum_Manifold_Shell', 'Cryo_Lines'],
            failureEffect: 'Magnetic field lines sever, allowing monopoles to escape and disrupt all electronics in a 50km radius.',
            cascadeFailures: ['Monopole Leak', 'Catalyzed Proton Decay Induction'],
            originalPosition: { x: 0, y: yPos, z: 0 },
            explodedPosition: { x: 0, y: yPos * 2, z: 0 },
            meshRef: ring,
            parentMesh: mainChamber
        });
    }

    // =========================================================================
    // OBSERVATION VIEWPORTS
    // =========================================================================
    for(let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const viewportGroup = new THREE.Group();
        
        const windowGeo = new THREE.CylinderGeometry(6, 6, 4, 64);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.rotation.x = Math.PI / 2;
        viewportGroup.add(windowMesh);

        const frameGeo = new THREE.TorusGeometry(6.5, 1.2, 32, 64);
        const frameMesh = new THREE.Mesh(frameGeo, steel);
        frameMesh.rotation.x = Math.PI / 2;
        viewportGroup.add(frameMesh);
        
        // Bolts on frame
        for(let b=0; b<12; b++) {
            const bAngle = (b/12) * Math.PI * 2;
            const boltGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.position.set(Math.cos(bAngle)*6.5, Math.sin(bAngle)*6.5, 0.6);
            bolt.rotation.x = Math.PI / 2;
            viewportGroup.add(bolt);
        }

        const r = 40;
        viewportGroup.position.set(Math.cos(angle) * r, 5, Math.sin(angle) * r);
        viewportGroup.rotation.y = -angle + Math.PI/2;
        
        mainChamber.add(viewportGroup);

        parts.push({
            name: `Viewport_Assembly_${i}`,
            description: `Multi-layered transparent aluminum viewport for visual confirmation of defect crystallization.`,
            material: 'tinted/steel',
            function: 'Allows scientists to safely observe raw symmetric collapse.',
            assemblyOrder: 50 + i,
            connections: ['Primary_Vacuum_Manifold_Shell'],
            failureEffect: 'Explosive decompression of the vacuum chamber, blinding observers with high-energy gamma rays.',
            cascadeFailures: ['Chamber Breach', 'Observer Vaporization'],
            originalPosition: { x: viewportGroup.position.x, y: viewportGroup.position.y, z: viewportGroup.position.z },
            explodedPosition: { x: viewportGroup.position.x * 1.5, y: viewportGroup.position.y, z: viewportGroup.position.z * 1.5 },
            meshRef: viewportGroup,
            parentMesh: mainChamber
        });
    }

    // =========================================================================
    // HIGGS POTENTIAL GENERATOR (INTERNAL HEART)
    // =========================================================================
    const higgsGeo = new THREE.IcosahedronGeometry(22, 5);
    const higgsField = new THREE.Mesh(higgsGeo, higgsFieldMaterial);
    group.add(higgsField);

    parts.push({
        name: 'Higgs_Potential_Modulator_Core',
        description: 'Projects a synthesized scalar field to manually select the vacuum expectation value (VEV) within the chamber.',
        material: 'higgsFieldMaterial',
        function: 'Induces spontaneous symmetry breaking, forcing the universe to "choose" a state, thereby creating defects at the boundaries.',
        assemblyOrder: 100,
        connections: ['Primary_Vacuum_Manifold_Shell', 'Cosmic_Strings'],
        failureEffect: 'Symmetry is violently restored, causing defects to dissolve into a burst of pure, unfiltered hawking radiation.',
        cascadeFailures: ['Radiation Flash', 'Vaporization of Weaver Arms'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 },
        meshRef: higgsField
    });

    // =========================================================================
    // COSMIC STRINGS (TOPOLOGICAL DEFECTS)
    // =========================================================================
    const stringMeshes = [];
    const stringCount = 5;
    for(let i=0; i<stringCount; i++) {
        const path = new CosmicStringCurve(2.0, [i, i*1.3, i*2.7]);
        const tubeGeo = new THREE.TubeGeometry(path, 400, 0.6, 24, true);
        const stringMesh = new THREE.Mesh(tubeGeo, cosmicStringMaterial);
        group.add(stringMesh);
        stringMeshes.push({ mesh: stringMesh, path: path });

        parts.push({
            name: `Cosmic_String_Filament_${i}`,
            description: `A 1-dimensional topological defect possessing immense mass-energy density, equivalent to an entire galaxy compressed into a line thinner than a proton.`,
            material: 'cosmicStringMaterial',
            function: 'Acts as the primary "thread" for the Weaver, manipulated to stitch together regions of differing vacuum states.',
            assemblyOrder: 110 + i,
            connections: ['Higgs_Potential_Modulator_Core', `Weaver_Arm_System_${i}`],
            failureEffect: 'String self-intersects, pinching off a loop that decays rapidly via emission of gravitational waves.',
            cascadeFailures: ['Gravitational Tsunami', 'Local Spacetime Rupture'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (i - stringCount/2) * 50, y: 50, z: (i - stringCount/2) * 50 },
            meshRef: stringMesh
        });
    }

    // =========================================================================
    // DOMAIN WALL (ANIMATED 2D MANIFOLD)
    // =========================================================================
    const wallGeo = new THREE.PlaneGeometry(55, 55, 128, 128);
    const domainWall = new THREE.Mesh(wallGeo, domainWallMaterial);
    domainWall.rotation.x = -Math.PI / 4;
    group.add(domainWall);

    parts.push({
        name: 'Discrete_Domain_Wall_Manifold',
        description: 'A 2D boundary trapped between two regions of space that settled into different, degenerate discrete vacuum states.',
        material: 'domainWallMaterial',
        function: 'Provides a massive planar defect surface to be stabilized and stitched by the cosmic strings.',
        assemblyOrder: 120,
        connections: ['Cosmic_String_Filaments', 'Vacuum_Chamber'],
        failureEffect: 'Wall collapses under its own immense tension, emitting a lethal wave of highly energetic axions.',
        cascadeFailures: ['Detector Blinding', 'Thermal Spike'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 },
        meshRef: domainWall
    });

    // =========================================================================
    // MAGNETIC MONOPOLES (POINT DEFECTS)
    // =========================================================================
    const monopoles = [];
    for(let i=0; i<8; i++) {
        const mGroup = new THREE.Group();
        
        const mGeo = new THREE.SphereGeometry(2.5, 64, 64);
        const mMesh = new THREE.Mesh(mGeo, monopoleMaterial);
        mGroup.add(mMesh);
        
        // Extreme detailing on monopoles (spikes representing magnetic flux lines)
        for(let j=0; j<24; j++) {
            const spikeGeo = new THREE.ConeGeometry(0.3, 4.0, 16);
            const spike = new THREE.Mesh(spikeGeo, monopoleMaterial);
            const phi = Math.acos(-1 + (2 * j) / 24);
            const theta = Math.sqrt(24 * Math.PI) * phi;
            spike.position.setFromSphericalCoords(2.5, phi, theta);
            spike.lookAt(0,0,0);
            spike.rotateX(Math.PI/2); 
            mGroup.add(spike);
        }

        group.add(mGroup);
        monopoles.push(mGroup);

        parts.push({
            name: `GUT_Magnetic_Monopole_${i}`,
            description: `A point-like topological defect exhibiting a net magnetic charge, a relic of the Grand Unified Theory symmetry breaking epoch.`,
            material: 'monopoleMaterial',
            function: 'Acts as termination points and anchors for cosmic strings, creating complex bead-on-a-string dynamical systems.',
            assemblyOrder: 130 + i,
            connections: ['Cosmic_String_Filaments', 'Containment_Toroids'],
            failureEffect: 'Catalyzes proton decay in any surrounding baryonic matter it touches via the Callan-Rubakov effect.',
            cascadeFailures: ['Matter Annihilation', 'Chamber Integrity Loss'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: Math.cos(i)*80, y: Math.sin(i)*80, z: Math.sin(i*2)*80 },
            meshRef: mGroup
        });
    }

    // =========================================================================
    // BRAIDED CABLING & HYDRAULIC LINES
    // =========================================================================
    const cablingGroup = new THREE.Group();
    for(let c=0; c<16; c++) {
        const length = 120;
        const braidPath1 = new BraidedCableCurve(1.5, 20, length, 0);
        const braidPath2 = new BraidedCableCurve(1.5, 20, length, Math.PI);
        const braidGeo1 = new THREE.TubeGeometry(braidPath1, 300, 0.4, 12, false);
        const braidGeo2 = new THREE.TubeGeometry(braidPath2, 300, 0.4, 12, false);
        const braid1 = new THREE.Mesh(braidGeo1, rubber);
        const braid2 = new THREE.Mesh(braidGeo2, rubber);
        
        const braid = new THREE.Group();
        braid.add(braid1);
        braid.add(braid2);

        const angle = (c/16) * Math.PI * 2;
        braid.position.set(Math.cos(angle)*28, 0, Math.sin(angle)*28);
        braid.rotation.y = -angle;

        cablingGroup.add(braid);
    }
    group.add(cablingGroup);

    // =========================================================================
    // GOD-TIER WEAVER ARMS (EXTREME DETAIL)
    // =========================================================================
    const weaverArms = [];
    const armCount = 8;
    for(let i=0; i<armCount; i++) {
        const armGroup = new THREE.Group();
        const angle = (i/armCount) * Math.PI * 2;
        armGroup.position.set(Math.cos(angle)*35, -20, Math.sin(angle)*35);
        armGroup.rotation.y = -angle;

        // Base Pivot Mount (Extruded for complexity)
        const pivotShape = new THREE.Shape();
        pivotShape.moveTo(-4, -4);
        pivotShape.lineTo(4, -4);
        pivotShape.lineTo(2, 4);
        pivotShape.lineTo(-2, 4);
        pivotShape.lineTo(-4, -4);
        const pExSet = { depth: 8, bevelEnabled: true, bevelThickness: 0.5 };
        const pivotGeo = new THREE.ExtrudeGeometry(pivotShape, pExSet);
        pivotGeo.center();
        const pivot = new THREE.Mesh(pivotGeo, steel);
        pivot.rotation.x = Math.PI/2;
        armGroup.add(pivot);

        // Heavy Lower Arm
        const lowerArmGeo = new THREE.CylinderGeometry(3, 4, 30, 32);
        const lowerArm = new THREE.Mesh(lowerArmGeo, aluminum);
        lowerArm.position.set(0, 15, 0);
        pivot.add(lowerArm);

        // Armor plating on lower arm
        for(let a=0; a<4; a++) {
            const armorGeo = new THREE.BoxGeometry(7, 25, 1);
            const armor = new THREE.Mesh(armorGeo, darkSteel);
            armor.position.set(0, 0, (a%2===0?4.5:-4.5));
            if(a>1) {
                armor.position.set((a===2?4.5:-4.5), 0, 0);
                armor.rotation.y = Math.PI/2;
            }
            lowerArm.add(armor);
        }

        // Mid Articulation Joint
        const midJointGeo = new THREE.SphereGeometry(5, 64, 64);
        const midJoint = new THREE.Mesh(midJointGeo, chrome);
        midJoint.position.set(0, 15, 0);
        lowerArm.add(midJoint);

        // Upper Arm
        const upperArmGeo = new THREE.CylinderGeometry(2, 3, 25, 32);
        const upperArm = new THREE.Mesh(upperArmGeo, aluminum);
        upperArm.position.set(0, 12.5, 0);
        midJoint.add(upperArm);

        // Fine Manipulation Claw Base
        const clawBaseGeo = new THREE.CylinderGeometry(2.5, 3, 6, 32);
        const clawBase = new THREE.Mesh(clawBaseGeo, copper);
        clawBase.position.set(0, 12.5, 0);
        upperArm.add(clawBase);

        // Pincers (Using complex shapes)
        const pincerShape = new THREE.Shape();
        pincerShape.moveTo(0, 0);
        pincerShape.lineTo(2, 8);
        pincerShape.lineTo(0.5, 10);
        pincerShape.lineTo(-1, 8);
        pincerShape.lineTo(0, 0);
        const pExSet2 = { depth: 1.5, bevelEnabled: true };
        const pincerGeo = new THREE.ExtrudeGeometry(pincerShape, pExSet2);
        pincerGeo.center();
        
        const pincer1 = new THREE.Mesh(pincerGeo, steel);
        pincer1.position.set(2, 6, 0);
        pincer1.rotation.z = Math.PI / 8;
        clawBase.add(pincer1);

        const pincer2 = new THREE.Mesh(pincerGeo, steel);
        pincer2.position.set(-2, 6, 0);
        pincer2.rotation.z = -Math.PI / 8;
        clawBase.add(pincer2);

        // Hydraulics for the arm
        createHydraulicPiston(`Arm${i}_Main_Hydraulic`, 20, 1.0, 0, 8, -5, Math.PI/10, 0, 0, armGroup);
        createHydraulicPiston(`Arm${i}_Upper_Hydraulic`, 15, 0.8, 0, 10, -3.5, Math.PI/12, 0, 0, lowerArm);

        group.add(armGroup);
        weaverArms.push({ root: armGroup, lower: lowerArm, mid: midJoint, upper: upperArm, claw: clawBase, p1: pincer1, p2: pincer2, index: i });

        parts.push({
            name: `Precision_Weaver_Arm_System_0${i}`,
            description: `Hyper-articulated robotic manipulator shielded in chronium-carbide. Capable of grasping and physically displacing 1D cosmic strings without being sliced by their infinite sharpness.`,
            material: 'aluminum/steel/chrome',
            function: 'Executes the delicate braiding maneuvers, intertwining cosmic strings around domain wall manifolds to engineer stable macroscopic defect structures.',
            assemblyOrder: 150 + i * 5,
            connections: ['Vacuum_Chamber_Shell', 'Cosmic_String_Filaments', 'Hydraulic_Systems'],
            failureEffect: 'Arm is severed by a cosmic string, plunging thousands of tons of mundane baryonic matter into the pristine false vacuum.',
            cascadeFailures: ['Vacuum Contamination', 'Explosive Decompression', 'Defect Tangling'],
            originalPosition: { x: armGroup.position.x, y: armGroup.position.y, z: armGroup.position.z },
            explodedPosition: { x: armGroup.position.x * 2.5, y: armGroup.position.y - 20, z: armGroup.position.z * 2.5 },
            meshRef: armGroup
        });
    }

    // =========================================================================
    // MASSIVE ALL-TERRAIN MOBILITY BASE (TRACKS/WHEELS)
    // =========================================================================
    const wheelRadius = 16;
    const wheelTube = 5;
    const wheelMeshes = [];
    const baseChassisGroup = new THREE.Group();
    
    // Main Chassis Body
    const chassisGeo = new THREE.BoxGeometry(90, 10, 160);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, -60, 0);
    baseChassisGroup.add(chassis);

    for(let wx = 0; wx < 2; wx++) {
        for(let wz = 0; wz < 4; wz++) {
            const wheelGroup = new THREE.Group();
            
            const tireGeo = new THREE.TorusGeometry(wheelRadius, wheelTube, 64, 128);
            const tire = new THREE.Mesh(tireGeo, rubber);
            wheelGroup.add(tire);
            
            // Extreme Lugs using Extrude
            const numLugs = 90;
            const lugShape = new THREE.Shape();
            lugShape.moveTo(-1.5, -0.8);
            lugShape.lineTo(1.5, -0.8);
            lugShape.lineTo(1.2, 0.8);
            lugShape.lineTo(-1.2, 0.8);
            lugShape.lineTo(-1.5, -0.8);
            const lugEx = { depth: wheelTube * 2.8, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2 };
            const lugGeo = new THREE.ExtrudeGeometry(lugShape, lugEx);
            lugGeo.center();
            
            for(let l = 0; l < numLugs; l++) {
                const angle = (l / numLugs) * Math.PI * 2;
                const lug = new THREE.Mesh(lugGeo, rubber);
                
                const lx = Math.cos(angle) * (wheelRadius + wheelTube * 0.5);
                const ly = Math.sin(angle) * (wheelRadius + wheelTube * 0.5);
                
                lug.position.set(lx, ly, 0);
                lug.rotation.z = angle;
                tire.add(lug);
            }
            
            // Rim and Spokes
            const rimGeo = new THREE.CylinderGeometry(wheelRadius - 2, wheelRadius - 2, 8, 64);
            const rim = new THREE.Mesh(rimGeo, chrome);
            rim.rotation.x = Math.PI / 2;
            wheelGroup.add(rim);
            
            const numSpokes = 16;
            for(let s = 0; s < numSpokes; s++) {
                const sAngle = (s / numSpokes) * Math.PI * 2;
                const spokeGeo = new THREE.CylinderGeometry(0.8, 1.2, wheelRadius - 2, 32);
                const spoke = new THREE.Mesh(spokeGeo, darkSteel);
                spoke.position.set(Math.cos(sAngle) * (wheelRadius/2), Math.sin(sAngle) * (wheelRadius/2), 0);
                spoke.rotation.z = sAngle + Math.PI/2;
                spoke.rotation.x = Math.PI / 2;
                wheelGroup.add(spoke);
            }

            // Central Hubcap
            const hubGeo = new THREE.CylinderGeometry(3.5, 4, 10, 64);
            const hub = new THREE.Mesh(hubGeo, steel);
            hub.rotation.x = Math.PI / 2;
            wheelGroup.add(hub);
            
            const isLeft = wx === 0;
            const xPos = isLeft ? -55 : 55;
            const zPos = -60 + (wz * 40);
            
            wheelGroup.position.set(xPos, -60, zPos);
            wheelGroup.rotation.y = Math.PI / 2;
            
            baseChassisGroup.add(wheelGroup);
            wheelMeshes.push(wheelGroup);

            // Massive Suspension Hydraulics
            createHydraulicPiston(`Heavy_Suspension_${wx}_${wz}`, 25, 2.5, xPos + (isLeft? 10 : -10), -45, zPos, 0, 0, isLeft ? -Math.PI/4 : Math.PI/4, baseChassisGroup);
            
            parts.push({
                name: `Omni_Terrain_Locomotion_Wheel_${wx}_${wz}`,
                description: `Gigantic vulcanized-polycarbonate wheel assembly designed to transport the millions of tons of the Weaver across shattered, post-collapse planetary landscapes.`,
                material: 'rubber/chrome',
                function: 'Mobility, seismic vibration damping, and ground-fault traversal.',
                assemblyOrder: 200 + (wx * 4) + wz,
                connections: ['Suspension_Hydraulics', 'Main_Chassis_Base'],
                failureEffect: 'Catastrophic loss of mobility, tilting the platform and causing fatal misalignment of the vacuum containment fields.',
                cascadeFailures: ['Vacuum Chamber Breach due to sheer stress', 'Immobilization'],
                originalPosition: { x: xPos, y: -60, z: zPos },
                explodedPosition: { x: xPos * 2, y: -80, z: zPos * 2 },
                meshRef: wheelGroup,
                parentMesh: baseChassisGroup
            });
        }
    }
    group.add(baseChassisGroup);

    // =========================================================================
    // COMMAND & CONTROL OPERATOR CABIN
    // =========================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 60, 60);
    
    const cabinBodyShape = new THREE.Shape();
    cabinBodyShape.moveTo(-15, -10);
    cabinBodyShape.lineTo(15, -10);
    cabinBodyShape.lineTo(12, 10);
    cabinBodyShape.lineTo(-12, 10);
    cabinBodyShape.lineTo(-15, -10);
    const cbExSet = { depth: 25, bevelEnabled: true, bevelThickness: 1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinBodyShape, cbExSet);
    cabinGeo.center();
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    // Front Viewport
    const winGeo = new THREE.PlaneGeometry(22, 14);
    const window = new THREE.Mesh(winGeo, tinted);
    window.position.set(0, 0, 12.6);
    cabinGroup.add(window);

    // Roof Antenna Arrays
    for(let r=0; r<6; r++) {
        const antennaGeo = new THREE.CylinderGeometry(0.2, 0.2, 15, 16);
        const antenna = new THREE.Mesh(antennaGeo, chrome);
        antenna.position.set(-10 + (r*4), 18, -5);
        cabinGroup.add(antenna);
        
        const antDishGeo = new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI, 0, Math.PI);
        const antDish = new THREE.Mesh(antDishGeo, darkSteel);
        antDish.material.side = THREE.DoubleSide;
        antDish.position.set(0, 7.5, 0);
        antenna.add(antDish);
    }

    // Interior Control Consoles (Visible through tinted glass)
    const panelGeo = new THREE.BoxGeometry(20, 5, 4);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, -4, 6);
    panel.rotation.x = -Math.PI / 5;
    cabinGroup.add(panel);

    const screenGeo = new THREE.PlaneGeometry(6, 3);
    const screen1 = new THREE.Mesh(screenGeo, neonScreenMaterial);
    screen1.position.set(-6, 2.6, 0);
    screen1.rotation.x = -Math.PI / 2;
    panel.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo, warningLightMaterial);
    screen2.position.set(6, 2.6, 0);
    screen2.rotation.x = -Math.PI / 2;
    panel.add(screen2);

    const stickGeo = new THREE.CylinderGeometry(0.3, 0.3, 3);
    const stick1 = new THREE.Mesh(stickGeo, chrome);
    stick1.position.set(-2, 2.5, 0);
    panel.add(stick1);
    const stick2 = new THREE.Mesh(stickGeo, chrome);
    stick2.position.set(2, 2.5, 0);
    panel.add(stick2);

    group.add(cabinGroup);

    parts.push({
        name: `Primary_Operator_Citadel`,
        description: `Heavily shielded, psychically-damped command center for the Weaver pilots. Life support systems are decoupled from the main power grid to survive temporal fluctuations.`,
        material: 'steel/tinted',
        function: 'Houses the human crew and neurological interface rigs required for the delicate task of topological weaving.',
        assemblyOrder: 300,
        connections: ['Vacuum_Chamber_Shell', 'Communication_Array', 'Main_Chassis'],
        failureEffect: 'Loss of manual override capabilities, leaving the weaving process to the sub-sentient AI routines.',
        cascadeFailures: ['AI Takeover', 'Uncontrolled Defect Braiding', 'Crew Insanity due to spacetime geometries'],
        originalPosition: { x: 0, y: 60, z: 60 },
        explodedPosition: { x: 0, y: 120, z: 120 },
        meshRef: cabinGroup
    });

    // =========================================================================
    // QUANTUM FLUCTUATION DAMPERS
    // =========================================================================
    const createQuantumDamper = (index, x, y, z, rx, ry, rz) => {
        const damperGroup = new THREE.Group();
        
        const baseGeo = new THREE.CylinderGeometry(6, 8, 4, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        damperGroup.add(base);

        for(let f=0; f<12; f++) {
            const finGeo = new THREE.BoxGeometry(1.5, 12, 20);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(0, 6, 0);
            fin.rotation.y = (f/12) * Math.PI * 2;
            base.add(fin);
        }

        const coreGeo = new THREE.SphereGeometry(5, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 2.5});
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(0, 10, 0);
        base.add(core);

        const coilPath = new BraidedCableCurve(6.5, 8, 15, 0);
        const coilGeo = new THREE.TubeGeometry(coilPath, 128, 0.4, 16, false);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.position.set(0, 10, 0);
        coil.rotation.x = Math.PI/2;
        base.add(coil);

        damperGroup.position.set(x, y, z);
        damperGroup.rotation.set(rx, ry, rz);
        group.add(damperGroup);

        parts.push({
            name: `Zero_Point_Fluctuation_Damper_${index}`,
            description: `A massive energy sink that stabilizes the local zero-point energy field to prevent spontaneous pair production from disrupting the delicate defect weave.`,
            material: 'darkSteel/copper',
            function: 'Energy dissipation and localized vacuum stabilization.',
            assemblyOrder: 350 + index,
            connections: ['Vacuum_Chamber_Shell', 'Cooling_Systems'],
            failureEffect: 'Runaway virtual particle production creates swarms of micro black holes within the machinery.',
            cascadeFailures: ['Hull Breach', 'Micro-Singularity Accretion', 'Total System Consumption'],
            originalPosition: { x, y, z },
            explodedPosition: { x: x*2, y: y*2, z: z*2 },
            meshRef: damperGroup
        });

        return { root: damperGroup, core: core, coil: coil };
    };

    const dampers = [];
    for(let i=0; i<10; i++) {
        const angle = (i/10) * Math.PI * 2;
        const d = createQuantumDamper(i, Math.cos(angle)*60, -10, Math.sin(angle)*60, 0, -angle, 0);
        dampers.push(d);
    }

    // =========================================================================
    // EXTERNAL MAINTENANCE SCAFFOLDING
    // =========================================================================
    const scaffoldGroup = new THREE.Group();
    for (let wLevel = 0; wLevel < 4; wLevel++) {
        const yLevel = -20 + wLevel * 25;
        const radius = 70 - wLevel * 6;

        const floorGeo = new THREE.RingGeometry(radius, radius + 8, 128);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9,
            metalness: 0.8,
            side: THREE.DoubleSide,
            wireframe: true // Looks like grating
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = Math.PI / 2;
        floor.position.set(0, yLevel, 0);
        scaffoldGroup.add(floor);

        parts.push({
            name: `Maintenance_Walkway_Gantry_Level_${wLevel}`,
            description: `Industrial grating walkways allowing intrepid (or expendable) technicians to manually inspect the vacuum chamber exterior seals.`,
            material: 'steel',
            function: 'Provides pedestrian access to critical exterior junction boxes and cryo-valves.',
            assemblyOrder: 400 + wLevel,
            connections: ['Main_Chassis', 'Support_Struts'],
            failureEffect: 'Structural collapse drops technicians into the active damper coils.',
            cascadeFailures: ['Loss of Personnel', 'Biological Contamination of Heat Sinks'],
            originalPosition: { x: 0, y: yLevel, z: 0 },
            explodedPosition: { x: 0, y: yLevel, z: 0 },
            meshRef: floor
        });

        // Railings
        for (let r = 0; r < 90; r++) {
            const angle = (r / 90) * Math.PI * 2;
            
            const postGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
            const post = new THREE.Mesh(postGeo, steel);
            post.position.set(Math.cos(angle) * (radius + 7.6), yLevel + 1.5, Math.sin(angle) * (radius + 7.6));
            scaffoldGroup.add(post);

            const inPost = new THREE.Mesh(postGeo, steel);
            inPost.position.set(Math.cos(angle) * (radius + 0.4), yLevel + 1.5, Math.sin(angle) * (radius + 0.4));
            scaffoldGroup.add(inPost);
        }

        const outRailGeo = new THREE.TorusGeometry(radius + 7.6, 0.2, 16, 128);
        const outRail = new THREE.Mesh(outRailGeo, steel);
        outRail.rotation.x = Math.PI / 2;
        outRail.position.set(0, yLevel + 3.0, 0);
        scaffoldGroup.add(outRail);

        const inRailGeo = new THREE.TorusGeometry(radius + 0.4, 0.2, 16, 128);
        const inRail = new THREE.Mesh(inRailGeo, steel);
        inRail.rotation.x = Math.PI / 2;
        inRail.position.set(0, yLevel + 3.0, 0);
        scaffoldGroup.add(inRail);
    }
    
    // Ladders
    for (let wLevel = 0; wLevel < 3; wLevel++) {
        const yLevel = -20 + wLevel * 25;
        const radius = 70 - wLevel * 6;

        for (let l = 0; l < 6; l++) {
            const angle = (l / 6) * Math.PI * 2 + Math.PI/6;
            const ladderGroup = new THREE.Group();
            
            const railGeo = new THREE.CylinderGeometry(0.3, 0.3, 25, 16);
            const rail1 = new THREE.Mesh(railGeo, steel);
            rail1.position.set(-1.5, 12.5, 0);
            ladderGroup.add(rail1);
            
            const rail2 = new THREE.Mesh(railGeo, steel);
            rail2.position.set(1.5, 12.5, 0);
            ladderGroup.add(rail2);

            for (let step = 1; step < 24; step++) {
                const stepGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
                const stepMesh = new THREE.Mesh(stepGeo, aluminum);
                stepMesh.position.set(0, step * (25/24), 0);
                stepMesh.rotation.z = Math.PI / 2;
                ladderGroup.add(stepMesh);
            }

            ladderGroup.position.set(Math.cos(angle) * (radius + 4), yLevel, Math.sin(angle) * (radius + 4));
            ladderGroup.rotation.y = -angle;
            ladderGroup.rotation.x = -0.15; // Slanted ladder
            
            scaffoldGroup.add(ladderGroup);
        }
    }
    group.add(scaffoldGroup);

    // =========================================================================
    // PhD LEVEL QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of Grand Unified Theories (GUTs), the Kibble-Zurek mechanism predicts the density of topological defects formed during a symmetry-breaking phase transition. Which of the following best describes the scaling of the defect density with the quench time?",
            options: [
                "Inversely proportional to the quench time.",
                "Proportional to a power of the quench time, dependent on critical exponents.",
                "Exponentially suppressed as the quench time increases.",
                "Independent of the quench time, determined solely by the Ginzburg-Landau potential."
            ],
            correctAnswer: 1,
            explanation: "The Kibble-Zurek mechanism predicts that the density of defects scales as a power law of the quench time, specifically tau_Q^(-D*nu/(1+z*nu)), where nu and z are the static and dynamic critical exponents of the transition."
        },
        {
            question: "Cosmic strings formed from the breaking of a U(1) gauge symmetry are characterized by a winding number. What fundamental property prevents a cosmic string with winding number n=1 from decaying into the trivial vacuum?",
            options: [
                "Conservation of angular momentum of the scalar field.",
                "The existence of a mass gap in the Goldstone boson spectrum.",
                "Topological stability dictated by the non-trivial first homotopy group of the vacuum manifold, pi_1(M) != 0.",
                "Magnetic monopoles trapped within the string core acting as anchors."
            ],
            correctAnswer: 2,
            explanation: "The stability of cosmic strings arises purely from the topology of the vacuum manifold M. If the first homotopy group pi_1(M) is non-trivial, field configurations can have non-zero winding numbers that cannot be smoothly, continuously deformed to the uniform vacuum state."
        },
        {
            question: "If a domain wall (arising from a broken discrete symmetry) dynamically interacts with a Schwarzschild black hole, what is the expected outcome according to classical general relativity?",
            options: [
                "The domain wall will be completely absorbed without altering the black hole's mass.",
                "The domain wall will reflect off the event horizon due to intense Hawking radiation pressure.",
                "The black hole will neatly slice the domain wall, leaving a boundary ending exactly on the horizon.",
                "The domain wall will violently accelerate the black hole or be swallowed, significantly increasing the black hole's mass proportionally to the intercepted wall area."
            ],
            correctAnswer: 3,
            explanation: "Domain walls carry immense energy density (tension). When interacting with a black hole, they transfer energy proportional to their tension and the area intercepted, significantly increasing the black hole's mass and dynamically coupling to its motion."
        },
        {
            question: "According to topological arguments, magnetic monopoles are generic predictions of Grand Unified Theories because:",
            options: [
                "The strong CP problem requires a magnetic charge to universally conserve parity.",
                "The second homotopy group of the vacuum manifold, pi_2(G/H), is non-trivial when a simple, simply connected Lie group G breaks to a subgroup H containing a U(1) factor.",
                "They are absolutely required to explain the baryon asymmetry of the universe via high-temperature sphaleron processes.",
                "Supersymmetry breaking naturally and necessarily generates magnetically charged gauginos."
            ],
            correctAnswer: 1,
            explanation: "According to topology, if a simply connected grand unified group G breaks down to a subgroup H that includes a U(1) factor (like the U(1)_em of electromagnetism), the second homotopy group pi_2(G/H) contains integers (is non-trivial), yielding topologically stable, heavy magnetic monopoles."
        },
        {
            question: "When a cosmic string network intersects a domain wall in certain complex symmetry-breaking models, what composite topological structure is typically formed?",
            options: [
                "A 'bead-on-a-string', where a monopole is confined strictly to the 1D string.",
                "A massive, localized Q-ball at the exact point of intersection.",
                "A 'wall bounded by strings' or a 'string puncturing a wall', which can lead to a phenomenon known as 'unzipping' of the defect network.",
                "An instanton that instantly catalyzes false vacuum decay."
            ],
            correctAnswer: 2,
            explanation: "Depending on the exact sequence of symmetry breaking, strings can act as the boundaries of domain walls, or puncture them outright. This creates a highly complex, unstable network where the massive wall tension pulls on the strings, often leading to rapid network decay or 'unzipping'."
        }
    ];

    // =========================================================================
    // EXTREME ANIMATION LOGIC
    // =========================================================================
    function animate(time, speed, meshes) {
        // 1. Locomotion: Rotate Massive Tires
        wheelMeshes.forEach((wheel, index) => {
            wheel.rotation.z -= 0.05 * speed;
        });

        // 2. Modulate the Higgs Field Core
        higgsField.rotation.x += 0.02 * speed;
        higgsField.rotation.y += 0.03 * speed;
        higgsFieldMaterial.emissiveIntensity = 1.5 + Math.sin(time * 3) * 1.0;
        
        // 3. Animate Cosmic Strings (Tension and vibration)
        stringMeshes.forEach((str, index) => {
            str.mesh.rotation.y = time * 0.8 * speed * (index % 2 === 0 ? 1 : -1);
            str.mesh.rotation.x = Math.sin(time * 0.4 + index) * 0.8;
            str.mesh.rotation.z = Math.cos(time * 0.3 - index) * 0.4;
            
            // Hyper-pulsate the string's emissive intensity to simulate energy density
            str.mesh.material.emissiveIntensity = 5.0 + Math.sin(time * 8 + index * 2) * 4.0;
        });

        // 4. Undulate the Domain Wall Manifold (Dynamic vertex displacement)
        const positionAttribute = domainWall.geometry.attributes.position;
        const vertex = new THREE.Vector3();
        for ( let i = 0; i < positionAttribute.count; i ++ ) {
            vertex.fromBufferAttribute( positionAttribute, i );
            // Original Z was 0. We add complex interfering sine waves based on X, Y, and Time
            const waveX = Math.sin(vertex.x * 0.2 + time * speed * 3.0);
            const waveY = Math.cos(vertex.y * 0.2 + time * speed * 2.5);
            const waveXY = Math.sin((vertex.x + vertex.y) * 0.1 - time * speed * 1.5);
            
            vertex.z = (waveX * waveY * 4.0) + (waveXY * 2.0);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        domainWall.geometry.computeVertexNormals();
        positionAttribute.needsUpdate = true;
        
        // Flash the domain wall occasionally (simulate phase transition shocks)
        if(Math.random() < 0.08 * speed) {
            domainWallMaterial.emissive.setHex(0xffffff);
            domainWallMaterial.emissiveIntensity = 8.0;
        } else {
            domainWallMaterial.emissive.setHex(0x0088ff);
            domainWallMaterial.emissiveIntensity = 3.0;
        }

        // 5. Orbit Magnetic Monopoles around the chaotic string field
        monopoles.forEach((mono, index) => {
            const angle = time * speed * 0.8 + (index * Math.PI / 4);
            const radius = 25 + Math.sin(time * speed * 1.5 + index) * 15;
            const height = Math.cos(time * speed * 0.7 + index * 2) * 30;
            
            mono.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            // Spin the monopole itself
            mono.rotation.x += 0.15 * speed;
            mono.rotation.y += 0.20 * speed;
            mono.rotation.z += 0.10 * speed;
        });

        // 6. Kinematic Animation of the Weaver Arms (Inverse Kinematics approximation via harmonics)
        weaverArms.forEach((arm, index) => {
            const offset = index * Math.PI / 4;
            
            // Base pivot sweeping motion
            arm.root.rotation.y = -offset + Math.sin(time * speed * 0.6 + offset) * 0.45;
            
            // Lower arm raising/lowering
            arm.lower.rotation.x = Math.sin(time * speed * 1.2 + offset) * 0.5;
            
            // Mid joint reaching
            arm.mid.rotation.x = Math.cos(time * speed * 1.5 + offset * 1.5) * 0.6;
            
            // Upper arm wrist compensation
            arm.upper.rotation.x = Math.sin(time * speed * 0.9 + offset) * 0.4;
            arm.upper.rotation.z = Math.cos(time * speed * 1.1 + offset) * 0.2;

            // Claw rotation
            arm.claw.rotation.y = time * speed * 3.5;

            // Pincers rapidly opening and closing to 'grasp' the quantum foam
            const pincerAngle = Math.abs(Math.sin(time * speed * 5 + offset)) * Math.PI / 6;
            arm.p1.rotation.z = Math.PI / 8 + pincerAngle;
            arm.p2.rotation.z = -Math.PI / 8 - pincerAngle;
        });
        
        // 7. Superconducting Containment Rings spinning in opposite directions
        rings.forEach((ring, index) => {
            ring.rotation.z = time * speed * (0.15 + index * 0.03) * (index % 2 === 0 ? 1 : -1);
            
            // Pulsate the diodes on the rings
            ring.children.forEach((node) => {
                if(node.children.length > 0) {
                    node.children[0].material.emissiveIntensity = 2 + Math.sin(time * 10 + index) * 2;
                }
            });
        });

        // 8. Quantum Fluctuation Dampers working
        dampers.forEach((d, i) => {
            d.coil.rotation.y = time * speed * 4.0;
            d.core.material.emissiveIntensity = 2.5 + Math.sin(time * 15 + i * 3) * 1.5;
        });
    }

    return {
        group,
        parts,
        description: "The God-Tier Topological Defect Weaver is a monument to trans-dimensional engineering. Capable of manipulating the fundamental fabric of spacetime, it artificially induces symmetry-breaking phase transitions to spool cosmic strings, sculpt domain walls, and harness the devastating power of magnetic monopoles. Proceed with extreme caution; localized false-vacuum collapse is a potential operational hazard.",
        quizQuestions,
        animate
    };
}
