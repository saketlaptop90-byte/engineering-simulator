import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ============================================================================
    // UTILITY CURVES & MATH FOR TOPOPOLIS
    // ============================================================================
    
    // A highly complex Lissajous / Torus Knot intertwining the 3 stars
    class TopopolisCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const p = 3; 
            const q = 7; 
            const u = t * Math.PI * 2;
            const r = 1200 + 300 * Math.cos(q * u);
            
            const x = r * Math.cos(p * u) * this.scale;
            const y = r * Math.sin(p * u) * this.scale;
            const z = 600 * Math.sin(q * u) * this.scale;
            
            return optionalTarget.set(x, y, z);
        }
    }

    const topoCurve = new TopopolisCurve(1);

    // Spine curve generator for spiral wrapping
    class SpineCurve extends THREE.Curve {
        constructor(baseCurve, offset, phase, wraps) {
            super();
            this.baseCurve = baseCurve;
            this.offset = offset;
            this.phase = phase;
            this.wraps = wraps;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const pt = this.baseCurve.getPoint(t);
            const tangent = this.baseCurve.getTangent(t).normalize();
            let normal = new THREE.Vector3(0, 1, 0);
            if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
            normal.cross(tangent).normalize();
            
            normal.applyAxisAngle(tangent, t * Math.PI * 2 * this.wraps + this.phase); 
            normal.multiplyScalar(this.offset);
            
            return optionalTarget.addVectors(pt, normal);
        }
    }

    // ============================================================================
    // 1. STAR SYSTEM (BINARY/TRINARY KNOT CORE)
    // ============================================================================
    
    // Star 1 - Alpha (Blue Supergiant)
    const starAlphaGeo = new THREE.SphereGeometry(250, 64, 64);
    const starAlphaMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        emissive: 0x2266ff,
        emissiveIntensity: 5.0,
        roughness: 0.1,
        metalness: 0.1
    });
    const starAlpha = new THREE.Mesh(starAlphaGeo, starAlphaMat);
    starAlpha.position.set(-300, 0, 150);
    group.add(starAlpha);
    meshes.starAlpha = starAlpha;

    // Star 2 - Beta (Red Dwarf)
    const starBetaGeo = new THREE.SphereGeometry(120, 64, 64);
    const starBetaMat = new THREE.MeshStandardMaterial({
        color: 0xff3311,
        emissive: 0xcc1100,
        emissiveIntensity: 3.0
    });
    const starBeta = new THREE.Mesh(starBetaGeo, starBetaMat);
    starBeta.position.set(400, 150, -200);
    group.add(starBeta);
    meshes.starBeta = starBeta;

    // Star 3 - Gamma (Neutron Star / Pulsar)
    const starGammaGeo = new THREE.SphereGeometry(40, 64, 64);
    const starGammaMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0
    });
    const starGamma = new THREE.Mesh(starGammaGeo, starGammaMat);
    starGamma.position.set(100, -300, 100);
    group.add(starGamma);
    meshes.starGamma = starGamma;

    parts.push({
        name: "Trinary Core Constellation",
        description: "The gravitational anchor for the Topopolis. A complex trinary star system comprising a Blue Supergiant, a Red Dwarf, and a rapidly spinning Neutron Star.",
        material: "Stellar Plasma & Degenerate Matter",
        function: "Gravitational tethering and exotic energy production.",
        assemblyOrder: 1,
        connections: ["Gravimetric Tethers", "Stellar Siphons"],
        failureEffect: "Orbital destabilization resulting in Topopolis shearing.",
        cascadeFailures: ["Topopolis structural collapse", "Exotic matter containment breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -2000 }
    });

    // ============================================================================
    // 2. MAIN TOPOPOLIS HULL & BIOSPHERE
    // ============================================================================

    // Main structural tube - Inner Biosphere (Glassy)
    const strandAGeo = new THREE.TubeGeometry(topoCurve, 2048, 80, 32, true);
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x88aaff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    const strandA = new THREE.Mesh(strandAGeo, glassMat);
    group.add(strandA);
    meshes.strandA = strandA;

    parts.push({
        name: "Transparent Biosphere Containment",
        description: "The main habitable volume of the Topopolis, visible through a hyper-diamond transparent containment field. Capable of supporting trillions of citizens.",
        material: "Hyper-Diamond Glass & Tinted Polymers",
        function: "Atmosphere retention and civilian housing.",
        assemblyOrder: 2,
        connections: ["Spines", "Artificial Gravity Rotators"],
        failureEffect: "Depressurization of an entire habitat section.",
        cascadeFailures: ["Atmospheric venting", "Sectional quarantine lockdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: -800, z: -800 }
    });

    // Spiraling Spines
    meshes.spines = [];
    for(let i=0; i<6; i++) {
        const sCurve = new SpineCurve(topoCurve, 90, i * Math.PI/3, 150);
        const sGeo = new THREE.TubeGeometry(sCurve, 2048, 12, 12, true);
        const sMesh = new THREE.Mesh(sGeo, darkSteel);
        group.add(sMesh);
        meshes.spines.push(sMesh);
    }

    parts.push({
        name: "Primary Carbon-Nanotube Spines",
        description: "Six massive structural spines wrapping spirally around the main habitat tube. Composed of compressed carbon degenerate matter.",
        material: "Carbon Degenerate Matter & Dark Steel",
        function: "Tensile reinforcement and primary magnetic shielding generation.",
        assemblyOrder: 3,
        connections: ["Main Habitat Tube", "Magnetic Constrictors"],
        failureEffect: "Spinal snap leading to catastrophic habitat decompression.",
        cascadeFailures: ["Loss of magnetic shielding", "Stellar radiation sterilization of biosphere"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 800, y: 800, z: 800 }
    });

    // ============================================================================
    // 3. PLANETARY GEAR-TIRES (DRIVE RINGS)
    // CRITICAL REQUIREMENT: Aggressive off-road treads & spoke arrays
    // ============================================================================
    
    meshes.driveRings = [];
    const numDriveRings = 24;
    
    // Build the extremely complex Gear-Tire geometry
    const tireGroupBase = new THREE.Group();
    
    // The main Torus for the tire
    const tireTorusGeo = new THREE.TorusGeometry(150, 20, 32, 128);
    const tireMesh = new THREE.Mesh(tireTorusGeo, rubber);
    tireGroupBase.add(tireMesh);
    
    // The treads (hundreds of extruded boxes)
    const treadGeo = new THREE.BoxGeometry(25, 10, 8);
    const numTreads = 120;
    for(let j=0; j<numTreads; j++) {
        const treadAngle = (j / numTreads) * Math.PI * 2;
        const tread = new THREE.Mesh(treadGeo, rubber);
        tread.position.set(
            Math.cos(treadAngle) * 170, 
            Math.sin(treadAngle) * 170, 
            0
        );
        tread.rotation.z = treadAngle;
        
        // Alternate angles for aggressive off-road look
        tread.rotation.x = (j % 2 === 0) ? 0.2 : -0.2;
        
        tireGroupBase.add(tread);
    }
    
    // The Rim (Cylinder with complex spoke arrays)
    const rimGeo = new THREE.CylinderGeometry(130, 130, 15, 64);
    const rimMesh = new THREE.Mesh(rimGeo, chrome);
    rimMesh.rotation.x = Math.PI / 2;
    tireGroupBase.add(rimMesh);
    
    const spokeGeo = new THREE.CylinderGeometry(4, 4, 260, 16);
    for(let j=0; j<12; j++) {
        const spoke = new THREE.Mesh(spokeGeo, steel);
        spoke.rotation.z = (j / 12) * Math.PI;
        tireGroupBase.add(spoke);
        
        // Add hydraulic detail to spoke
        const subSpokeGeo = new THREE.CylinderGeometry(6, 6, 100, 16);
        const subSpoke = new THREE.Mesh(subSpokeGeo, copper);
        subSpoke.rotation.z = (j / 12) * Math.PI;
        tireGroupBase.add(subSpoke);
    }

    // Place them along the Topopolis
    for(let i=0; i<numDriveRings; i++) {
        const ringInstance = tireGroupBase.clone();
        const t = i / numDriveRings;
        const pt = topoCurve.getPoint(t);
        const tangent = topoCurve.getTangent(t).normalize();
        
        let normal = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
        normal.cross(tangent).normalize();
        
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
        const matrix = new THREE.Matrix4();
        matrix.makeBasis(normal, tangent, binormal); 
        
        ringInstance.position.copy(pt);
        ringInstance.quaternion.setFromRotationMatrix(matrix);
        // Align tire correctly along tube
        ringInstance.rotateY(Math.PI / 2);

        group.add(ringInstance);
        meshes.driveRings.push(ringInstance);
    }

    parts.push({
        name: "Planetary Gear-Tires",
        description: "Massive rotating drive rings acting as literal planetary gears rolling against the immense magnetic field lines of the star system. Features extremely aggressive treads and complex spoke rims to grip spacetime.",
        material: "Hyper-Rubber & Chromed Degenerate Matter",
        function: "Locomotion and magnetic field gripping for orbital stabilization.",
        assemblyOrder: 4,
        connections: ["Spines", "Magnetic Field Lines"],
        failureEffect: "Loss of traction against the magnetic field, causing the Topopolis to drift into the stars.",
        cascadeFailures: ["Tread shredding", "Spoke buckling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    // ============================================================================
    // 4. EXTERIOR ATTACHMENTS (ELEVATORS, RADIATORS, DOCKS)
    // ============================================================================
    const numStructures = 800;
    const structureGroup = new THREE.Group();
    group.add(structureGroup);
    meshes.elevators = [];
    meshes.radiators = [];
    meshes.dockingBays = [];

    const elevatorGeo = new THREE.CylinderGeometry(3, 3, 120, 16);
    const radiatorGeo = new THREE.BoxGeometry(60, 4, 30);
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x883300, emissiveIntensity: 0.8 });
    const dockGeo = new THREE.TorusGeometry(25, 5, 16, 64);

    for (let i = 0; i < numStructures; i++) {
        const t = i / numStructures;
        const pt = topoCurve.getPoint(t);
        const tangent = topoCurve.getTangent(t).normalize();
        
        let normal = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
        normal.cross(tangent).normalize();
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
        
        const matrix = new THREE.Matrix4();
        matrix.makeBasis(normal, tangent, binormal);

        if (i % 3 === 0) {
            const elevator = new THREE.Mesh(elevatorGeo, chrome);
            const angle = (i * 13.7) % (Math.PI * 2);
            const localPos = new THREE.Vector3(Math.cos(angle) * 130, 0, Math.sin(angle) * 130);
            
            elevator.position.copy(pt).add(localPos.clone().applyMatrix4(matrix));
            elevator.quaternion.setFromRotationMatrix(matrix);
            elevator.lookAt(pt);
            elevator.rotateX(Math.PI/2);
            
            structureGroup.add(elevator);
            meshes.elevators.push(elevator);
        } else if (i % 3 === 1) {
            const radiator = new THREE.Mesh(radiatorGeo, radiatorMat);
            const angle = (i * 13.7) % (Math.PI * 2);
            const localPos = new THREE.Vector3(Math.cos(angle) * 90, 0, Math.sin(angle) * 90);
            
            radiator.position.copy(pt).add(localPos.clone().applyMatrix4(matrix));
            radiator.quaternion.setFromRotationMatrix(matrix);
            radiator.lookAt(pt);
            
            structureGroup.add(radiator);
            meshes.radiators.push(radiator);
        } else {
            const dock = new THREE.Mesh(dockGeo, darkSteel);
            const angle = (i * 13.7) % (Math.PI * 2);
            const localPos = new THREE.Vector3(Math.cos(angle) * 110, 0, Math.sin(angle) * 110);
            
            dock.position.copy(pt).add(localPos.clone().applyMatrix4(matrix));
            dock.quaternion.setFromRotationMatrix(matrix);
            dock.lookAt(pt);
            
            structureGroup.add(dock);
            meshes.dockingBays.push(dock);
        }
    }

    parts.push({
        name: "Geodesic Space Elevators",
        description: "Thousands of localized tether elevators protruding outward.",
        material: "Chrome & Steel",
        function: "Logistical transport to zero-g regions.",
        assemblyOrder: 5,
        connections: ["Habitat Tube", "Zero-G Docking Bays"],
        failureEffect: "Elevator cable snapping, whipping around the tube.",
        cascadeFailures: ["Debris storm", "Hull punctures"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 1000, z: -300 }
    });

    parts.push({
        name: "Thermodynamic Radiator Arrays",
        description: "Vast glowing panels distributed along the entire length to bleed off waste heat.",
        material: "Copper & Exotic Coolant",
        function: "Waste heat dissipation.",
        assemblyOrder: 6,
        connections: ["Internal Heat Sinks", "Coolant Circulation Network"],
        failureEffect: "Thermal runaway leading to internal habitat cooking.",
        cascadeFailures: ["Biosphere incineration", "Coolant pipe bursts"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -1000, y: -200, z: 500 }
    });

    // ============================================================================
    // 5. HYDRAULIC PISTONS & TENSION COMPENSATORS
    // ============================================================================
    
    meshes.pistons = [];
    const pistonBaseGeo = new THREE.CylinderGeometry(15, 15, 60, 16);
    const pistonRodGeo = new THREE.CylinderGeometry(8, 8, 120, 16);
    
    for(let i=0; i<36; i++) {
        const pGroup = new THREE.Group();
        const pCyl = new THREE.Mesh(pistonBaseGeo, copper);
        const pRod = new THREE.Mesh(pistonRodGeo, chrome);
        
        pRod.position.y = 40;
        pGroup.add(pCyl);
        pGroup.add(pRod);
        
        const t = i / 36;
        const pt = topoCurve.getPoint(t);
        const tangent = topoCurve.getTangent(t).normalize();
        
        let normal = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
        normal.cross(tangent).normalize();
        
        pGroup.position.copy(pt).add(normal.clone().multiplyScalar(100));
        pGroup.lookAt(pt); // Pointing inwards
        pGroup.rotateX(Math.PI/2);
        
        group.add(pGroup);
        meshes.pistons.push({ group: pGroup, rod: pRod, phase: i });
    }

    parts.push({
        name: "Macro-Tension Hydraulic Compensators",
        description: "Enormous piston-driven shock absorbers lining the hull to dampen chaotic orbital perturbations.",
        material: "Neutron-ium Plated Chrome & Copper",
        function: "Vibration dampening and structural integrity.",
        assemblyOrder: 7,
        connections: ["Gravimetric Engine", "Outer Hull"],
        failureEffect: "Severe localized quakes within the habitat.",
        cascadeFailures: ["City leveling", "Spine micro-fractures"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 600, y: -600, z: 600 }
    });

    // ============================================================================
    // 6. INTERSTELLAR TRADE FLEETS
    // ============================================================================
    meshes.fleet = new THREE.Group();
    group.add(meshes.fleet);
    meshes.ships = [];

    const shipBodyGeo = new THREE.ConeGeometry(8, 30, 8);
    const shipDriveGeo = new THREE.CylinderGeometry(6, 3, 10, 8);
    
    for(let i=0; i<100; i++) {
        const shipGroup = new THREE.Group();
        
        const shipBody = new THREE.Mesh(shipBodyGeo, aluminum);
        shipBody.rotation.x = Math.PI / 2;
        shipGroup.add(shipBody);
        
        const shipDrive = new THREE.Mesh(shipDriveGeo, darkSteel);
        shipDrive.position.z = 20;
        shipDrive.rotation.x = Math.PI / 2;
        shipGroup.add(shipDrive);
        
        const engineGlow = new THREE.Mesh(
            new THREE.SphereGeometry(4, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5.0 })
        );
        engineGlow.position.z = 25;
        shipGroup.add(engineGlow);

        shipGroup.userData = {
            t: Math.random(),
            speed: (Math.random() * 0.0003) + 0.0001,
            offsetAngle: Math.random() * Math.PI * 2,
            offsetRadius: 200 + Math.random() * 300
        };

        meshes.fleet.add(shipGroup);
        meshes.ships.push(shipGroup);
    }

    parts.push({
        name: "Interstellar Trade Fleet",
        description: "A swarm of automated and crewed mercantile vessels navigating the complex gravitational currents around the Topopolis.",
        material: "Aluminum & Dark Steel",
        function: "Interstellar commerce and resource import.",
        assemblyOrder: 8,
        connections: ["Docking Bays", "Navigational Beacons"],
        failureEffect: "Ship collision with Topopolis superstructure.",
        cascadeFailures: ["Kessler syndrome", "Docking bay destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1200, y: 1200, z: 1200 }
    });

    // ============================================================================
    // 7. GRAVIMETRIC TORSION ENGINE (CENTER)
    // ============================================================================
    const engineCoreGeo = new THREE.TorusKnotGeometry(250, 50, 256, 64, 3, 4);
    const engineCoreMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 3.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const gravimetricEngine = new THREE.Mesh(engineCoreGeo, engineCoreMat);
    group.add(gravimetricEngine);
    meshes.gravimetricEngine = gravimetricEngine;

    parts.push({
        name: "Gravimetric Torsion Drive",
        description: "A massive, central, multi-dimensional Torus Knot of exotic matter stabilizing the entire habitat knot.",
        material: "Pulsing Exotic Matter (Wireframe)",
        function: "Spatial stabilization and macro-structural integrity.",
        assemblyOrder: 9,
        connections: ["Stellar Cores", "Topopolis Spines"],
        failureEffect: "Spacetime folding and complete sub-atomic disassembly of the habitat.",
        cascadeFailures: ["Black hole formation", "Local space-time rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1200, z: 0 }
    });

    // ============================================================================
    // 8. PLASMA SIPHONS
    // ============================================================================
    const siphonMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.6
    });

    const siphonAlphaGeo = new THREE.CylinderGeometry(8, 3, 400, 16);
    siphonAlphaGeo.translate(0, 200, 0);
    const siphonAlpha = new THREE.Mesh(siphonAlphaGeo, siphonMat);
    siphonAlpha.position.copy(starAlpha.position);
    siphonAlpha.lookAt(0,0,0);
    siphonAlpha.rotateX(Math.PI/2);
    group.add(siphonAlpha);
    meshes.siphonAlpha = siphonAlpha;

    const siphonBetaGeo = new THREE.CylinderGeometry(8, 3, 500, 16);
    siphonBetaGeo.translate(0, 250, 0);
    const siphonBeta = new THREE.Mesh(siphonBetaGeo, siphonMat);
    siphonBeta.position.copy(starBeta.position);
    siphonBeta.lookAt(0,0,0);
    siphonBeta.rotateX(Math.PI/2);
    group.add(siphonBeta);
    meshes.siphonBeta = siphonBeta;

    parts.push({
        name: "Plasma Siphons",
        description: "Gigantic magnetic flux tubes that siphon raw stellar plasma from the core stars directly into the habitat's fusion reactors.",
        material: "Magnetic Containment Fields",
        function: "Primary energy gathering.",
        assemblyOrder: 10,
        connections: ["Stars", "Fusion Manifolds"],
        failureEffect: "Plasma stream escapes containment.",
        cascadeFailures: ["Fusion reactor starvation", "Stellar flare trigger"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1000, z: -1000 }
    });

    // ============================================================================
    // 9. SHIELD GENERATOR
    // ============================================================================
    const shieldGeo = new THREE.IcosahedronGeometry(1300, 5);
    const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 1.0, 
        thickness: 0.5,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const globalShield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(globalShield);
    meshes.globalShield = globalShield;

    parts.push({
        name: "Macro-Scale Void Shield",
        description: "An encompassing icosahedral energy shield protecting the entire Topopolis knot from rogue planetoids and supernovas.",
        material: "Hard Light & Phase-Shifted Geometry",
        function: "Ultimate defense against cosmic extinction events.",
        assemblyOrder: 11,
        connections: ["Gravimetric Engine", "Siphons"],
        failureEffect: "Topopolis becomes vulnerable to micro-meteorite and radiation bombardment.",
        cascadeFailures: ["Hull breaches", "Radiation sickness across biosphere"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ============================================================================
    // 10. TETHER NODES
    // ============================================================================
    const tetherNodeGeo = new THREE.SphereGeometry(40, 32, 32);
    meshes.tetherNodes = [];
    for(let i=0; i<20; i++) {
        const node = new THREE.Mesh(tetherNodeGeo, steel);
        const t = i / 20;
        const pt = topoCurve.getPoint(t);
        node.position.copy(pt);
        group.add(node);
        meshes.tetherNodes.push(node);
    }

    parts.push({
        name: "Habitat Tether Nodes",
        description: "Massive spherical joints allowing the Topopolis to flex and twist without shearing.",
        material: "Neutronium Infused Steel",
        function: "Structural articulation and life support cycling.",
        assemblyOrder: 12,
        connections: ["Main Habitat Tube", "Spines"],
        failureEffect: "Joint freezing, leading to immense stress.",
        cascadeFailures: ["Life support failure", "Catastrophic fragmentation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -500, y: 700, z: 500 }
    });

    // ============================================================================
    // 11. ARTIFICIAL SUNS (INTERNAL)
    // ============================================================================
    const innerSunGeo = new THREE.SphereGeometry(25, 16, 16);
    const innerSunMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffee,
        emissiveIntensity: 4.0
    });
    meshes.innerSuns = [];
    for(let i=0; i<40; i++) {
        const sun = new THREE.Mesh(innerSunGeo, innerSunMat);
        const t = (i + 0.5) / 40;
        const pt = topoCurve.getPoint(t);
        sun.position.copy(pt);
        group.add(sun);
        meshes.innerSuns.push(sun);
    }

    parts.push({
        name: "Axial Linear Fusion Suns",
        description: "A chain of miniature fusion reactors suspended precisely in the center of the Topopolis tube, providing artificial daylight.",
        material: "Contained Plasma",
        function: "Biosphere illumination and thermodynamic driving.",
        assemblyOrder: 13,
        connections: ["Tether Nodes"],
        failureEffect: "Eternal night in affected sectors, freezing of local biosphere.",
        cascadeFailures: ["Crop failure", "Atmospheric freezing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -800 }
    });
    
    // ============================================================================
    // 12. ANTIMATTER DEFENSE TURRETS
    // ============================================================================
    meshes.turrets = [];
    const turretBaseGeo = new THREE.CylinderGeometry(25, 30, 25, 16);
    const turretBarrelGeo = new THREE.CylinderGeometry(6, 6, 150, 16);
    for(let i=0; i<24; i++) {
        const tGroup = new THREE.Group();
        const tBase = new THREE.Mesh(turretBaseGeo, steel);
        const tBarrel = new THREE.Mesh(turretBarrelGeo, darkSteel);
        tBarrel.rotation.x = Math.PI / 2;
        tBarrel.position.z = 75;
        tBarrel.position.y = 15;
        
        tGroup.add(tBase);
        tGroup.add(tBarrel);
        
        const t = (i + 0.1) / 24;
        const pt = topoCurve.getPoint(t);
        const tangent = topoCurve.getTangent(t).normalize();
        
        let normal = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
        normal.cross(tangent).normalize();
        
        const matrix = new THREE.Matrix4();
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
        matrix.makeBasis(normal, tangent, binormal);
        
        tGroup.position.copy(pt).add(normal.clone().multiplyScalar(100));
        tGroup.quaternion.setFromRotationMatrix(matrix);
        tGroup.rotateX(Math.PI/2);
        
        group.add(tGroup);
        meshes.turrets.push({ group: tGroup, barrel: tBarrel });
    }

    parts.push({
        name: "Antimatter Point-Defense Batteries",
        description: "Massive twin-linked cannons capable of vaporizing rogue asteroids or hostile armadas using focused antimatter streams.",
        material: "Hardened Steel & Magnetic Coils",
        function: "Active orbital defense.",
        assemblyOrder: 14,
        connections: ["Outer Hull", "Sensor Arrays"],
        failureEffect: "Vulnerability in specific defensive arcs.",
        cascadeFailures: ["Asteroid impact", "Shield overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: 400, z: -800 }
    });

    // ============================================================================
    // 13. OMNI-SENSORS
    // ============================================================================
    const sensorGeo = new THREE.DodecahedronGeometry(20);
    const sensorMat = new THREE.MeshPhysicalMaterial({ color: 0x33ff33, wireframe: true, emissive: 0x114411 });
    meshes.sensors = [];
    for(let i=0; i<15; i++) {
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        const t = i / 15;
        const pt = topoCurve.getPoint(t);
        sensor.position.copy(pt).multiplyScalar(1.2); 
        group.add(sensor);
        meshes.sensors.push(sensor);
    }

    parts.push({
        name: "Quantum Omni-Sensors",
        description: "Unbound floating polyhedrons utilizing quantum entanglement to scan the surrounding lightyears instantaneously.",
        material: "Programmable Matter",
        function: "Early warning and deep space telemetry.",
        assemblyOrder: 15,
        connections: ["Comm-Arrays", "Turret Fire Control"],
        failureEffect: "Sensor ghosts and false positives.",
        cascadeFailures: ["Friendly fire incidents", "Navigation hazards"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1000, y: 0, z: -1000 }
    });

    // ============================================================================
    // 14. BIOSPHERE CLOUDS
    // ============================================================================
    const cloudGeo = new THREE.SphereGeometry(40, 16, 16);
    const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        roughness: 1.0,
        depthWrite: false
    });
    meshes.clouds = [];
    for(let i=0; i<80; i++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        const t = i / 80;
        const pt = topoCurve.getPoint(t);
        pt.x += (Math.random() - 0.5) * 60;
        pt.y += (Math.random() - 0.5) * 60;
        pt.z += (Math.random() - 0.5) * 60;
        cloud.position.copy(pt);
        group.add(cloud);
        meshes.clouds.push(cloud);
    }
    
    parts.push({
        name: "Macro-Atmospheric Cloud Systems",
        description: "Engineered weather patterns providing rain and atmospheric scrubbing for the immense internal landscape.",
        material: "Water Vapor & Particulate Condensation Nuclei",
        function: "Water cycle and climate regulation.",
        assemblyOrder: 16,
        connections: ["Internal Oceans", "Inner Suns"],
        failureEffect: "Droughts or super-storms within the habitat.",
        cascadeFailures: ["Agricultural collapse", "Civil unrest"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });
    
    // ============================================================================
    // 15. TRANSIT RAILS
    // ============================================================================
    const railCurve = new THREE.TubeGeometry(topoCurve, 2048, 3, 8, true);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x888800, wireframe: true });
    meshes.rails = [];
    for(let i=0; i<3; i++) {
        const rail = new THREE.Mesh(railCurve, railMat);
        rail.scale.setScalar(1.06 + i*0.04);
        group.add(rail);
        meshes.rails.push(rail);
    }

    parts.push({
        name: "Magnetic Induction Transit Rails",
        description: "Hyper-velocity train networks wrapping around the exterior.",
        material: "Superconducting Gold-Alloy",
        function: "Global mass transit.",
        assemblyOrder: 17,
        connections: ["Elevators", "Tether Nodes"],
        failureEffect: "Trains derail at hyper-velocity.",
        cascadeFailures: ["Hull breach", "Sector quarantine"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -400, y: -400, z: -400 }
    });

    // ============================================================================
    // EXPORT METADATA & QUIZ
    // ============================================================================
    
    const description = "God-Tier Topopolis: A cosmic-scale braided space habitat forming a multi-stellar knot, utilizing extreme exotic matter for tensile strength and rotating for artificial gravity. Spanning millions of kilometers, it is a testament to Type II Kardashev engineering, enclosing an entire trinary star system within its twisting, serpent-like embrace.";

    const quizQuestions = [
        {
            question: "Given a Topopolis of radius R, wrapped around a central mass M in a Lissajous orbit, what tensile strength T is required to prevent tidal shearing if the structural thickness is d and density is ρ, assuming rotation ω for 1g internal gravity?",
            options: [
                "T = ρ * R² * ω² + (G * M * ρ / r³) * d",
                "T = (G * M * ρ / R²) - ω² * R",
                "T = ρ * ω² * R² + (2 * G * M * ρ / R³) * Δr²",
                "T = ρ * R * (ω² * R + G * M / r²)"
            ],
            correctAnswerIndex: 0,
            explanation: "The tensile strength must counteract both the centrifugal force required for artificial gravity (Fc = m * ω² * R) and the tidal gradient from the central mass (Ft ≈ (G * M * m / r³) * d). Summing these forces per unit area gives the required exotic material tensile limits."
        },
        {
            question: "In a trinary stellar core (Blue Supergiant, Red Dwarf, Neutron Star), how does the Topopolis extract energy via the Gravimetric Torsion Drive?",
            options: [
                "By capturing solar wind and converting it into kinetic energy.",
                "By utilizing the Lense-Thirring effect (frame-dragging) of the rapidly spinning Neutron star relative to the barycenter.",
                "By building a Dyson sphere around each individual star inside the tube.",
                "Through standard photovoltaic panels mounted on the inner hull."
            ],
            correctAnswerIndex: 1,
            explanation: "Frame-dragging (Lense-Thirring effect) from the extremely dense and rapidly spinning neutron star warps local spacetime. The Gravimetric Torsion drive couples with this distortion, extracting immense rotational energy continuously."
        },
        {
            question: "To maintain 1g (9.81 m/s²) of artificial gravity in a habitat tube with a radius of 10,000 km, what must be the rotational period?",
            options: [
                "Approx 2.4 hours",
                "Approx 63.4 minutes",
                "Approx 1.76 hours",
                "Approx 10.5 hours"
            ],
            correctAnswerIndex: 2,
            explanation: "Using a = ω² * r, 9.81 = (2π / T)² * 10,000,000. Solving for T: T = 2π * √(10,000,000 / 9.81) ≈ 6,342 seconds, which is about 1.76 hours."
        },
        {
            question: "Why must a Topopolis use Carbon Degenerate Matter or similar exotic materials for its primary spines?",
            options: [
                "Standard molecular bonds fail at scales exceeding a few thousand kilometers due to the sheer mass-energy of the structure.",
                "Carbon degenerate matter is completely transparent, allowing light to pass.",
                "It is cheaper to manufacture than steel in orbit.",
                "It naturally produces oxygen as a byproduct."
            ],
            correctAnswerIndex: 0,
            explanation: "The structural load of a Topopolis spanning astronomical units exceeds the theoretical maximum tensile strength of chemical bonds. Degenerate matter relies on Pauli exclusion principle and strong nuclear forces, providing orders of magnitude higher tensile strength."
        },
        {
            question: "If a catastrophic failure occurs and the Topopolis snaps, what is the primary immediate danger to the internal biosphere before vacuum exposure?",
            options: [
                "Radiation from the central stars.",
                "The snapping of the tube releases elastic potential energy, causing a hyper-velocity whiplash that pulverizes the structure at a significant fraction of c.",
                "Spontaneous combustion of the atmosphere.",
                "Immediate collapse into a black hole."
            ],
            correctAnswerIndex: 1,
            explanation: "A structure under astronomical tension stores immense elastic potential energy. A snap results in the loose ends accelerating at tens of thousands of g's, whipping through the system and completely annihilating the internal biosphere via shockwaves long before vacuum or radiation becomes an issue."
        }
    ];

    // ============================================================================
    // ANIMATION LOOP
    // ============================================================================
    
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        if (meshes.starAlpha) meshes.starAlpha.rotation.y = t * 0.5;
        if (meshes.starBeta) meshes.starBeta.rotation.y = t * 0.8;
        if (meshes.starGamma) {
            meshes.starGamma.rotation.y = t * 20.0; 
            meshes.starGamma.rotation.x = t * 15.0;
            meshes.starGamma.scale.setScalar(1 + Math.sin(t * 50) * 0.1);
        }

        if (meshes.siphonAlpha) meshes.siphonAlpha.scale.x = 1 + Math.sin(t * 5) * 0.1;
        if (meshes.siphonBeta) meshes.siphonBeta.scale.x = 1 + Math.sin(t * 6 + 1) * 0.1;

        if (meshes.gravimetricEngine) {
            meshes.gravimetricEngine.rotation.x = t * 0.5;
            meshes.gravimetricEngine.rotation.y = t * 0.3;
            meshes.gravimetricEngine.rotation.z = t * 0.7;
            meshes.gravimetricEngine.material.emissiveIntensity = 3.0 + Math.sin(t * 10) * 1.5;
        }

        if (meshes.globalShield) {
            meshes.globalShield.rotation.y = t * 0.02;
            meshes.globalShield.rotation.x = t * 0.01;
            meshes.globalShield.scale.setScalar(1 + Math.sin(t * 2) * 0.01);
        }

        if (meshes.strandA) meshes.strandA.material.opacity = 0.25 + Math.sin(t * 2) * 0.05;

        // Drive Rings spinning
        meshes.driveRings.forEach((ring, i) => {
            // Spin around its local Z axis (which acts like an axle)
            ring.rotateZ(0.1 * speed);
        });

        meshes.radiators.forEach((rad, i) => {
            rad.material.emissiveIntensity = 0.5 + Math.sin(t * 3 + i) * 0.5;
        });

        meshes.ships.forEach((ship, i) => {
            const data = ship.userData;
            data.t += data.speed * speed;
            if (data.t > 1) data.t = 0;
            
            const pos = topoCurve.getPoint(data.t);
            const tangent = topoCurve.getTangent(data.t).normalize();
            
            let normal = new THREE.Vector3(0, 1, 0);
            if (Math.abs(tangent.y) > 0.9) normal.set(1, 0, 0);
            normal.cross(tangent).normalize();
            
            normal.applyAxisAngle(tangent, data.offsetAngle + t * 0.1);
            normal.multiplyScalar(data.offsetRadius);
            
            ship.position.copy(pos).add(normal);
            
            const lookPos = topoCurve.getPoint(data.t + 0.001);
            lookPos.add(normal);
            ship.lookAt(lookPos);
            
            ship.children[2].material.emissiveIntensity = 2.0 + Math.random() * 3.0;
        });

        meshes.innerSuns.forEach((sun, i) => {
            sun.material.emissiveIntensity = 3.0 + Math.sin(t * 5 + i) * 1.5;
        });

        meshes.pistons.forEach((p) => {
            const extension = Math.sin(t * 2 + p.phase) * 30;
            p.rod.position.y = 40 + extension;
        });

        meshes.turrets.forEach((tData, i) => {
            tData.group.rotateY(Math.sin(t * 0.5 + i) * 0.02 * speed);
            tData.barrel.rotation.x = Math.PI / 2 + Math.sin(t + i) * 0.2;
        });

        meshes.sensors.forEach((s, i) => {
            s.rotation.x += 0.05 * speed;
            s.rotation.y += 0.03 * speed;
            s.scale.setScalar(1 + Math.sin(t * 10 + i) * 0.2);
        });

        meshes.clouds.forEach((c, i) => {
            c.rotation.y += 0.01 * speed;
            c.rotation.x += 0.005 * speed;
        });

        meshes.rails.forEach((r, i) => {
            r.material.emissiveIntensity = 0.5 + Math.sin(t * 10 + i * Math.PI) * 0.5;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
