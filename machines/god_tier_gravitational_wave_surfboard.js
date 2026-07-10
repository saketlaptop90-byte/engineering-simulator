import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =========================================================================
    // 1. CUSTOM HYPER-ADVANCED MATERIALS
    // =========================================================================
    const neutroniumMat = new THREE.MeshPhysicalMaterial({
        color: 0x050508,
        metalness: 1.0,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissive: 0x010105,
        emissiveIntensity: 0.2
    });

    const exoticMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x220044,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x4400ff,
        emissiveIntensity: 0.6,
        transmission: 0.5,
        thickness: 2.0
    });

    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9
    });

    const glowingPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff1100,
        emissive: 0xff1100,
        emissiveIntensity: 2.0
    });

    const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.0,
        ior: 1.52,
        thickness: 0.5,
        side: THREE.DoubleSide,
        emissive: 0x001133,
        emissiveIntensity: 0.2
    });

    const darkEnergyMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        emissive: 0x0a0011,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
        color: 0xffbb00,
        metalness: 1.0,
        roughness: 0.4
    });

    const spacetimeGridMat = new THREE.MeshStandardMaterial({
        color: 0x001122,
        metalness: 0.5,
        roughness: 0.8,
        emissive: 0x002244,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // =========================================================================
    // 2. HELPER: PART REGISTRATION
    // =========================================================================
    function addPart(name, description, mesh, materialName, functionDesc, failEffect, pos, expPos, assemblyOrder) {
        mesh.name = name;
        mesh.position.copy(pos);
        mesh.userData.originalPosition = pos.clone();
        mesh.userData.explodedPosition = expPos.clone();
        
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections: [],
            failureEffect: failEffect,
            cascadeFailures: [],
            originalPosition: pos.clone(),
            explodedPosition: expPos.clone()
        });
    }

    // =========================================================================
    // 3. GEOMETRY GENERATORS
    // =========================================================================
    
    // --- PART 1: Neutronium Hull Main ---
    function createNeutroniumHull() {
        const hullGroup = new THREE.Group();
        
        // Main aerodynamic shape using extruded spline
        const shape = new THREE.Shape();
        shape.moveTo(0, 6);
        shape.quadraticCurveTo(4, 5, 5, 0);
        shape.quadraticCurveTo(4, -3, 0, -4);
        shape.quadraticCurveTo(-4, -3, -5, 0);
        shape.quadraticCurveTo(-4, 5, 0, 6);

        const extrudeSettings = { 
            depth: 60, 
            bevelEnabled: true, 
            bevelSegments: 16, 
            steps: 20, 
            bevelSize: 1.5, 
            bevelThickness: 2 
        };
        const hullGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        hullGeo.center();
        const hullMesh = new THREE.Mesh(hullGeo, neutroniumMat);
        hullMesh.rotation.x = Math.PI / 2;
        hullMesh.scale.set(1, 1.5, 1);
        hullGroup.add(hullMesh);

        // Add structural ribs
        for(let i = 0; i < 15; i++) {
            const ribGeo = new THREE.TorusGeometry(6.2 + Math.sin(i*0.2)*0.5, 0.3, 16, 64);
            const rib = new THREE.Mesh(ribGeo, darkSteel);
            rib.rotation.x = Math.PI / 2;
            rib.position.z = -35 + i * 5;
            rib.scale.y = 0.8;
            hullGroup.add(rib);
        }

        // Add tensor field generator nodes (greebles)
        for(let i = 0; i < 40; i++) {
            const nodeGeo = new THREE.BoxGeometry(0.8, 0.8, 1.5);
            const node = new THREE.Mesh(nodeGeo, chrome);
            const angle = (i / 40) * Math.PI * 2;
            const zPos = -30 + Math.random() * 60;
            node.position.set(Math.cos(angle) * 5.8, Math.sin(angle) * 4.8, zPos);
            node.lookAt(0, 0, zPos);
            hullGroup.add(node);
        }

        // Add intricate hydraulic piping along the spine
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 6.5, -40),
            new THREE.Vector3(0, 7.5, -20),
            new THREE.Vector3(0, 7.5, 20),
            new THREE.Vector3(0, 6.5, 40)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipePath, 64, 0.4, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);
        hullGroup.add(pipeMesh);

        return hullGroup;
    }

    // --- PART 2 & 3: Spacetime Fins ---
    function createSpacetimeFin(isLeft) {
        const finGroup = new THREE.Group();
        
        // Primary Fin Blade
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(25, -5);
        finShape.quadraticCurveTo(28, -15, 20, -25);
        finShape.lineTo(5, -15);
        finShape.quadraticCurveTo(0, -5, 0, 0);

        const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5 };
        const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
        finGeo.center();
        const finMesh = new THREE.Mesh(finGeo, darkSteel);
        finMesh.rotation.x = Math.PI / 2;
        
        if(isLeft) {
            finMesh.position.set(-15, 0, 0);
        } else {
            finMesh.position.set(15, 0, 0);
            finMesh.scale.x = -1; // Mirror for starboard
        }
        finGroup.add(finMesh);

        // Curvature Actuator Pistons
        for(let p = 0; p < 3; p++) {
            const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 8, 16), steel);
            pistonOuter.rotation.z = Math.PI / 2;
            pistonOuter.position.set(isLeft ? -10 - p*4 : 10 + p*4, 0, -2 - p*3);
            
            const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 16), chrome);
            pistonInner.rotation.z = Math.PI / 2;
            pistonInner.position.copy(pistonOuter.position);
            
            finGroup.add(pistonOuter);
            finGroup.add(pistonInner);
        }

        // Trailing Edge Plasma Vents
        for(let v = 0; v < 8; v++) {
            const ventGeo = new THREE.BoxGeometry(2, 0.5, 0.5);
            const vent = new THREE.Mesh(ventGeo, glowingBlue);
            vent.position.set(isLeft ? -12 - v*1.5 : 12 + v*1.5, 0, -15 - v*1.2);
            finGroup.add(vent);
        }

        // Surface etching / circuitry
        const circuitGeo = new THREE.PlaneGeometry(15, 10);
        const circuit = new THREE.Mesh(circuitGeo, glowingPurple);
        circuit.rotation.x = -Math.PI / 2;
        circuit.position.set(isLeft ? -15 : 15, 0.8, -10);
        // We use simple plane for circuit glowing layer
        finGroup.add(circuit);

        return finGroup;
    }

    // --- PART 4: Singularity Drive Core ---
    function createDriveCore() {
        const coreGroup = new THREE.Group();
        
        // Outer Containment Shell
        const shellGeo = new THREE.IcosahedronGeometry(8, 3);
        const shell = new THREE.Mesh(shellGeo, glass);
        coreGroup.add(shell);
        
        // Inner Event Horizon proxy
        const ehGeo = new THREE.SphereGeometry(3, 32, 32);
        const eh = new THREE.Mesh(ehGeo, exoticMatterMat);
        coreGroup.add(eh);

        // Penrose Process Extractors (Spikes)
        for(let s = 0; s < 20; s++) {
            const spikeGeo = new THREE.ConeGeometry(0.5, 6, 16);
            const spike = new THREE.Mesh(spikeGeo, copper);
            
            const phi = Math.acos(-1 + (2 * s) / 20);
            const theta = Math.sqrt(20 * Math.PI) * phi;
            
            spike.position.setFromSphericalCoords(6, phi, theta);
            spike.lookAt(0, 0, 0);
            spike.rotateX(Math.PI / 2); // Point outward
            
            coreGroup.add(spike);
        }

        // Magnetic Confinement Rings
        for(let r = 0; r < 4; r++) {
            const ringGeo = new THREE.TorusGeometry(10 + r*1.5, 0.4, 32, 100);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            
            meshes[`coreRing_${r}`] = ring; // Store for animation
            coreGroup.add(ring);
        }

        return coreGroup;
    }

    // --- PART 5: Ergosphere Canopy ---
    function createCanopy() {
        const canopyGroup = new THREE.Group();
        
        const glassGeo = new THREE.CapsuleGeometry(5, 15, 32, 64);
        const glassMesh = new THREE.Mesh(glassGeo, shieldMat);
        glassMesh.rotation.x = Math.PI / 2;
        canopyGroup.add(glassMesh);

        // Frame
        const frameGeo = new THREE.WireframeGeometry(glassGeo);
        const frame = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({color: 0x333333, linewidth: 2}));
        frame.rotation.x = Math.PI / 2;
        canopyGroup.add(frame);

        return canopyGroup;
    }

    // --- PART 6: Pilot Interface Cabin ---
    function createPilotCabin() {
        const cabinGroup = new THREE.Group();
        
        // Base Floor
        const floorGeo = new THREE.BoxGeometry(8, 0.5, 12);
        const floor = new THREE.Mesh(floorGeo, darkSteel);
        cabinGroup.add(floor);

        // Pilot Seat
        const seatGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(2, 1, 2);
        const base = new THREE.Mesh(baseGeo, steel);
        base.position.y = 0.5;
        seatGroup.add(base);
        
        const cushionGeo = new THREE.BoxGeometry(2.2, 0.4, 2.2);
        const cushion = new THREE.Mesh(cushionGeo, rubber);
        cushion.position.y = 1.2;
        seatGroup.add(cushion);
        
        const backGeo = new THREE.BoxGeometry(2.2, 3.5, 0.4);
        const back = new THREE.Mesh(backGeo, rubber);
        back.position.set(0, 3.0, -0.9);
        back.rotation.x = -0.15;
        seatGroup.add(back);

        const headrestGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 16);
        const headrest = new THREE.Mesh(headrestGeo, rubber);
        headrest.rotation.z = Math.PI / 2;
        headrest.position.set(0, 5.0, -1.2);
        seatGroup.add(headrest);

        seatGroup.position.set(0, 0, 2);
        cabinGroup.add(seatGroup);

        // Control Dashboard
        const dashGeo = new THREE.BoxGeometry(6, 3, 2);
        const dash = new THREE.Mesh(dashGeo, plastic);
        dash.position.set(0, 2, 6);
        dash.rotation.x = 0.5;
        cabinGroup.add(dash);

        // Holographic Displays
        for(let i = 0; i < 3; i++) {
            const holoGeo = new THREE.PlaneGeometry(3, 2);
            const holo = new THREE.Mesh(holoGeo, glowingBlue);
            holo.position.set((i-1)*3.2, 5, 7 - Math.abs(i-1)*1);
            holo.lookAt(0, 3, 2);
            cabinGroup.add(holo);
        }

        // Control Yokes (Joysticks)
        for(let i of [-1, 1]) {
            const stickGeo = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 16);
            const stick = new THREE.Mesh(stickGeo, chrome);
            stick.position.set(i * 2, 3.5, 5.5);
            stick.rotation.x = -0.3;
            cabinGroup.add(stick);

            const knobGeo = new THREE.SphereGeometry(0.4, 16, 16);
            const knob = new THREE.Mesh(knobGeo, glowingRed);
            knob.position.set(i * 2, 4.2, 5.3);
            cabinGroup.add(knob);
        }

        // Add hundreds of tiny buttons to dashboard
        for(let b = 0; b < 60; b++) {
            const btnGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            const mat = Math.random() > 0.5 ? glowingBlue : glowingRed;
            const btn = new THREE.Mesh(btnGeo, mat);
            btn.position.set(-2.5 + Math.random()*5, 2.5 + Math.random()*1, 5.2 + Math.random()*1.5);
            cabinGroup.add(btn);
        }

        return cabinGroup;
    }

    // --- PART 7: Frame Drag Thrusters ---
    function createThrusters() {
        const thrusterGroup = new THREE.Group();

        // Main Nozzle
        const nozzleGeo = new THREE.CylinderGeometry(4, 8, 15, 32, 1, true);
        const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzle.rotation.x = Math.PI / 2;
        thrusterGroup.add(nozzle);

        // Inner Accelerator Rings
        for(let i = 0; i < 10; i++) {
            const ringGeo = new THREE.TorusGeometry(3.5 + (i*0.4), 0.2, 16, 64);
            const ring = new THREE.Mesh(ringGeo, copper);
            ring.position.z = -7 + i * 1.5;
            thrusterGroup.add(ring);
        }

        // Plasma Core
        const coreGeo = new THREE.CapsuleGeometry(2, 10, 16, 32);
        const core = new THREE.Mesh(coreGeo, glowingPurple);
        core.rotation.x = Math.PI / 2;
        thrusterGroup.add(core);

        // Vectoring Struts
        for(let i = 0; i < 6; i++) {
            const strutGeo = new THREE.CylinderGeometry(0.3, 0.3, 16, 16);
            const strut = new THREE.Mesh(strutGeo, chrome);
            const angle = (i / 6) * Math.PI * 2;
            strut.position.set(Math.cos(angle)*6, Math.sin(angle)*6, 0);
            strut.rotation.z = angle;
            thrusterGroup.add(strut);
        }

        return thrusterGroup;
    }

    // --- PART 8: Dark Energy Scoops ---
    function createScoop(isLeft) {
        const scoopGroup = new THREE.Group();
        
        // Intake Housing
        const houseGeo = new THREE.BoxGeometry(6, 4, 15);
        const house = new THREE.Mesh(houseGeo, darkSteel);
        house.position.set(isLeft ? -7 : 7, 0, 0);
        scoopGroup.add(house);

        // Turbine Blades
        const turbineGroup = new THREE.Group();
        for(let b = 0; b < 12; b++) {
            const bladeGeo = new THREE.BoxGeometry(0.2, 3.5, 1);
            const blade = new THREE.Mesh(bladeGeo, chrome);
            blade.position.y = 1.75;
            
            const pivot = new THREE.Group();
            pivot.rotation.z = (b / 12) * Math.PI * 2;
            pivot.add(blade);
            turbineGroup.add(pivot);
        }
        turbineGroup.position.set(isLeft ? -7 : 7, 0, 7.5);
        turbineGroup.rotation.x = Math.PI / 2;
        
        meshes[isLeft ? 'turbineLeft' : 'turbineRight'] = turbineGroup;
        scoopGroup.add(turbineGroup);

        // Filter Grid
        const gridGeo = new THREE.PlaneGeometry(5, 3);
        const grid = new THREE.Mesh(gridGeo, goldFoilMat);
        grid.position.set(isLeft ? -7 : 7, 0, 7.6);
        grid.rotation.x = -Math.PI / 2;
        // scoopGroup.add(grid); // Add if you want it capped

        return scoopGroup;
    }

    // --- PART 9: Quantum Gyroscopic Stabilizer ---
    function createGyro() {
        const gyroGroup = new THREE.Group();
        
        const outerGimbal = new THREE.Mesh(new THREE.TorusGeometry(6, 0.5, 32, 64), chrome);
        const midGimbal = new THREE.Mesh(new THREE.TorusGeometry(5, 0.5, 32, 64), copper);
        const innerGimbal = new THREE.Mesh(new THREE.TorusGeometry(4, 0.5, 32, 64), steel);
        
        const rotor = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2, 32), exoticMatterMat);

        gyroGroup.add(outerGimbal);
        gyroGroup.add(midGimbal);
        gyroGroup.add(innerGimbal);
        gyroGroup.add(rotor);

        meshes.outerGimbal = outerGimbal;
        meshes.midGimbal = midGimbal;
        meshes.innerGimbal = innerGimbal;
        meshes.gyroRotor = rotor;

        return gyroGroup;
    }

    // --- PART 10: Graviton Emitter Array ---
    function createEmitters() {
        const emitterGroup = new THREE.Group();
        
        for(let i = 0; i < 100; i++) {
            const emitGeo = new THREE.SphereGeometry(0.3, 8, 8);
            const emitter = new THREE.Mesh(emitGeo, glowingRed);
            
            // Distribute along a Fibonacci spiral cylinder
            const y = 1 - (i / 99) * 2; // -1 to 1
            const radius = Math.sqrt(1 - y * y) * 8;
            const theta = 2.39996323 * i;
            
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            
            emitter.position.set(x, y * 30, z);
            emitterGroup.add(emitter);
        }
        
        return emitterGroup;
    }

    // --- PART 11: Geodesic Navigational Array ---
    function createNavArray() {
        const navGroup = new THREE.Group();
        
        const dishGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dish = new THREE.Mesh(dishGeo, goldFoilMat);
        dish.rotation.x = Math.PI / 2;
        navGroup.add(dish);

        const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const antenna = new THREE.Mesh(antennaGeo, chrome);
        antenna.position.z = 3;
        antenna.rotation.x = Math.PI / 2;
        navGroup.add(antenna);

        for(let i=0; i<4; i++) {
            const probeGeo = new THREE.BoxGeometry(0.2, 0.2, 4);
            const probe = new THREE.Mesh(probeGeo, copper);
            probe.position.set(Math.cos(i*Math.PI/2)*1.5, Math.sin(i*Math.PI/2)*1.5, 2);
            navGroup.add(probe);
        }

        return navGroup;
    }

    // --- PART 12: Hawking Radiation Vents ---
    function createVents() {
        const ventGroup = new THREE.Group();
        
        for(let i = 0; i < 15; i++) {
            const louverGeo = new THREE.BoxGeometry(8, 0.3, 2);
            const louverL = new THREE.Mesh(louverGeo, darkSteel);
            louverL.position.set(-6, -2, -20 + i * 2.5);
            louverL.rotation.x = -Math.PI / 6;
            louverL.rotation.z = Math.PI / 4;
            ventGroup.add(louverL);

            const louverR = new THREE.Mesh(louverGeo, darkSteel);
            louverR.position.set(6, -2, -20 + i * 2.5);
            louverR.rotation.x = -Math.PI / 6;
            louverR.rotation.z = -Math.PI / 4;
            ventGroup.add(louverR);
        }
        
        return ventGroup;
    }

    // --- PART 13: Spacetime Fabric (The Wave) ---
    function createSpacetimeFabric() {
        // Enormous plane to animate as gravitational waves
        const waveGeo = new THREE.PlaneGeometry(400, 400, 200, 200);
        waveGeo.rotateX(-Math.PI / 2);
        
        // Initial setup
        const positions = waveGeo.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
            positions[i+1] = 0; // Flat initially, animated in render loop
        }
        
        const waveMesh = new THREE.Mesh(waveGeo, spacetimeGridMat);
        
        // Add some floating quantum foam particles
        const foamGeo = new THREE.BufferGeometry();
        const foamCount = 2000;
        const foamPos = new Float32Array(foamCount * 3);
        for(let i = 0; i < foamCount * 3; i++) {
            foamPos[i] = (Math.random() - 0.5) * 400;
        }
        foamGeo.setAttribute('position', new THREE.BufferAttribute(foamPos, 3));
        const foamMat = new THREE.PointsMaterial({color: 0x00ffff, size: 0.5, transparent: true, opacity: 0.6});
        const foam = new THREE.Points(foamGeo, foamMat);
        waveMesh.add(foam);

        return waveMesh;
    }

    // =========================================================================
    // 4. INSTANTIATE AND ASSEMBLE PARTS
    // =========================================================================

    // 1. Spacetime Fabric (Base Environment)
    const spacetimeFabric = createSpacetimeFabric();
    addPart('SpacetimeFabric', 'The underlying 4D manifold, exhibiting quadrupole distortions from merging black holes.', spacetimeFabric, 'SpacetimeGrid', 'Provides the medium for wave propagation and riding.', 'Vacuum decay; false vacuum collapse.', new THREE.Vector3(0, -15, 0), new THREE.Vector3(0, -80, 0), 0);

    // 2. Neutronium Hull
    const hull = createNeutroniumHull();
    addPart('NeutroniumHull', 'The primary chassis made of degenerate matter. Incredibly dense.', hull, 'Neutronium / Chrome', 'Provides structural integrity against extreme tidal forces.', 'Catastrophic spaghettification of the vessel.', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20, 0), 1);

    // 3. Spacetime Fins (Port & Starboard)
    const portFin = createSpacetimeFin(true);
    addPart('PortSpacetimeFin', 'Port-side local curvature manipulator.', portFin, 'DarkSteel / Copper', 'Alters local stress-energy tensor to induce port yaw/roll.', 'Uncontrollable port-side spin.', new THREE.Vector3(-6, 0, 0), new THREE.Vector3(-40, 0, 0), 2);

    const stbdFin = createSpacetimeFin(false);
    addPart('StarboardSpacetimeFin', 'Starboard-side local curvature manipulator.', stbdFin, 'DarkSteel / Copper', 'Alters local stress-energy tensor to induce starboard yaw/roll.', 'Uncontrollable starboard-side spin.', new THREE.Vector3(6, 0, 0), new THREE.Vector3(40, 0, 0), 3);

    // 4. Singularity Drive Core
    const driveCore = createDriveCore();
    addPart('SingularityDriveCore', 'Contained micro-singularity powering the vessel.', driveCore, 'Glass / Exotic Matter', 'Generates infinite energy via the Penrose process.', 'Hawking radiation flash-fries the local sector.', new THREE.Vector3(0, 5, -25), new THREE.Vector3(0, 50, -25), 4);

    // 5. Ergosphere Canopy
    const canopy = createCanopy();
    addPart('ErgosphereCanopy', 'A protective field dome shielding the pilot from infinite time dilation.', canopy, 'Shield Material', 'Maintains a localized inertial reference frame.', 'Pilot ages 10,000 years in a microsecond.', new THREE.Vector3(0, 10, 5), new THREE.Vector3(0, 40, 5), 5);

    // 6. Pilot Interface Cabin
    const cabin = createPilotCabin();
    addPart('PilotInterfaceCabin', 'The cockpit where the rider interfaces with the wave gradients.', cabin, 'Mixed High-Tech', 'Allows conscious steering and navigation of the geodesic paths.', 'Loss of control.', new THREE.Vector3(0, 6, 2), new THREE.Vector3(0, 30, 20), 6);

    // 7. Frame Drag Thrusters
    const thrusters = createThrusters();
    addPart('FrameDragThrusters', 'Main propulsion leveraging the Lense-Thirring effect.', thrusters, 'DarkSteel / GlowingPurple', 'Provides forward momentum relative to the dragging of spacetime.', 'Vessel stalls and falls into the wave trough.', new THREE.Vector3(0, 0, -40), new THREE.Vector3(0, -10, -80), 7);

    // 8. Dark Energy Scoops
    const scoopL = createScoop(true);
    addPart('DarkEnergyScoopPort', 'Intake for zero-point energy.', scoopL, 'DarkSteel', 'Fuels the quantum stabilizers.', 'Energy starvation on port side.', new THREE.Vector3(-8, -2, 20), new THREE.Vector3(-30, -10, 30), 8);

    const scoopR = createScoop(false);
    addPart('DarkEnergyScoopStarboard', 'Intake for zero-point energy.', scoopR, 'DarkSteel', 'Fuels the quantum stabilizers.', 'Energy starvation on starboard side.', new THREE.Vector3(8, -2, 20), new THREE.Vector3(30, -10, 30), 9);

    // 9. Quantum Gyroscopic Stabilizer
    const gyro = createGyro();
    addPart('QuantumGyroscopicStabilizer', 'Multi-axis gyros maintaining perfect alignment with the stress-energy tensor.', gyro, 'Chrome / Copper', 'Prevents tumbling through the chaotic wave crests.', 'Immediate and violent tumbling.', new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, -30, 0), 10);

    // 10. Graviton Emitter Array
    const emitters = createEmitters();
    addPart('GravitonEmitterArray', 'Arrays of artificial graviton projectors.', emitters, 'Glowing Red', 'Generates the anti-gravity cushion to float on the wave.', 'Vessel sinks through the fabric of spacetime.', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 60, -10), 11);

    // 11. Geodesic Navigational Array
    const nav = createNavArray();
    addPart('GeodesicNavigationalArray', 'Forward sensor cluster detecting incoming ripples.', nav, 'Gold / Chrome', 'Maps the curvature ahead for autopilot adjustments.', 'Blind navigation causing a crash into a singularity.', new THREE.Vector3(0, 0, 45), new THREE.Vector3(0, 10, 80), 12);

    // 12. Hawking Radiation Vents
    const vents = createVents();
    addPart('HawkingRadiationVents', 'Exhaust louvers for excess heat and virtual particles.', vents, 'DarkSteel', 'Prevents thermal runaway of the drive core.', 'Vessel melts into a quark-gluon plasma.', new THREE.Vector3(0, 0, -15), new THREE.Vector3(0, -20, -50), 13);


    // =========================================================================
    // 5. METADATA & QUIZ
    // =========================================================================
    const description = "God-Tier Gravitational Wave Surfboard. A mastercraft of spacetime engineering designed to ride the quadrupole ripples of merging black holes. Features a solid neutronium hull, singularity drive, and frame-dragging thrusters.";

    const quizQuestions = [
        {
            question: "What is the theoretical maximum percentage of rest mass energy that can be extracted from a maximally rotating Kerr black hole via the Penrose process?",
            options: ["100%", "50%", "29%", "15%"],
            correctAnswer: 2
        },
        {
            question: "In the transverse-traceless (TT) gauge, which components of the metric perturbation h_μν correspond to physical gravitational wave degrees of freedom?",
            options: [
                "The spatial trace",
                "The longitudinal components",
                "The spatial transverse and traceless components",
                "The time-time component"
            ],
            correctAnswer: 2
        },
        {
            question: "The frequency of gravitational waves emitted by a binary system in a quasi-circular orbit is related to its orbital frequency (f_orb) by what factor?",
            options: ["f_GW = f_orb", "f_GW = 2 * f_orb", "f_GW = 0.5 * f_orb", "f_GW = f_orb^2"],
            correctAnswer: 1
        },
        {
            question: "The equation governing the relative acceleration of nearby freely falling test particles, demonstrating tidal forces due to spacetime curvature, is known as:",
            options: [
                "The Einstein Field Equations",
                "The Geodesic Deviation Equation",
                "The Raychaudhuri Equation",
                "The Lense-Thirring Effect"
            ],
            correctAnswer: 1
        },
        {
            question: "For a non-rotating Schwarzschild black hole, at what radial coordinate is the Innermost Stable Circular Orbit (ISCO) located?",
            options: ["r = 2GM/c^2", "r = 3GM/c^2", "r = 6GM/c^2", "r = 1.5GM/c^2"],
            correctAnswer: 2
        }
    ];

    // =========================================================================
    // 6. EXTREME ANIMATION LOGIC
    // =========================================================================
    function animate(time, speed, activeMeshes) {
        const t = time * 0.001 * speed;

        // 1. Animate Spacetime Fabric (Quadrupole Gravitational Wave)
        if(activeMeshes.SpacetimeFabric) {
            const waveGeo = activeMeshes.SpacetimeFabric.geometry;
            const positions = waveGeo.attributes.position.array;
            
            // Assume the merger is happening at z = 200
            const sourceZ = 200;
            const sourceX = 0;
            const omega = 3.0; // Wave frequency
            const k = 0.05;    // Wave number
            
            for(let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i+2];
                const dx = x - sourceX;
                const dz = z - sourceZ;
                const r = Math.sqrt(dx*dx + dz*dz) + 0.1;
                
                // Spiral phase for inspiral
                const theta = Math.atan2(dz, dx);
                const phase = omega * t - k * r + 2 * theta; 
                
                // Amplitude decays with distance (1/r)
                const amplitude = 150.0 / (r * 0.05 + 1.0);
                
                // Apply quadrupole deformation (h_plus and h_cross combination)
                positions[i+1] = amplitude * Math.cos(phase) * Math.cos(2*theta);
            }
            
            waveGeo.attributes.position.needsUpdate = true;
            // Compute normals for proper lighting reflections on the wave
            waveGeo.computeVertexNormals();
            
            // Animate quantum foam
            const foam = activeMeshes.SpacetimeFabric.children[0];
            if(foam) {
                foam.rotation.y = t * 0.1;
                foam.position.y = Math.sin(t) * 2;
            }
        }

        // 2. Animate the Surfboard's Bobbing and Steering
        // Calculate wave height at the ship's position (x=0, z=0)
        const sourceZ = 200;
        const rShip = sourceZ;
        const thetaShip = Math.atan2(-sourceZ, 0); // -pi/2
        const phaseShip = 3.0 * t - 0.05 * rShip + 2 * thetaShip;
        const amplitudeShip = 150.0 / (rShip * 0.05 + 1.0);
        
        const shipY = amplitudeShip * Math.cos(phaseShip) * Math.cos(2*thetaShip);
        
        // Calculate pitch (derivative)
        const pitch = -amplitudeShip * 0.05 * Math.sin(phaseShip);

        // Apply global ship movements to all parts EXCEPT SpacetimeFabric
        Object.keys(activeMeshes).forEach(key => {
            if(key !== 'SpacetimeFabric') {
                const mesh = activeMeshes[key];
                // Only apply if not exploded
                if (!mesh.userData.isExploded) {
                    const orig = mesh.userData.originalPosition;
                    // Bobbing
                    mesh.position.y = orig.y + shipY - 5; // -5 to sit slightly in the wave
                    // Pitching
                    mesh.rotation.x = pitch * 0.2;
                }
            }
        });

        // 3. Animate Internal Components
        
        // Singularity Drive Core Rings
        if(meshes.coreRing_0) meshes.coreRing_0.rotation.x = t * 5;
        if(meshes.coreRing_1) meshes.coreRing_1.rotation.y = t * 4;
        if(meshes.coreRing_2) meshes.coreRing_2.rotation.z = t * 3;
        if(meshes.coreRing_3) meshes.coreRing_3.rotation.x = -t * 6;

        // Quantum Gyro
        if(meshes.outerGimbal) meshes.outerGimbal.rotation.x = t * 2;
        if(meshes.midGimbal) meshes.midGimbal.rotation.y = t * 3;
        if(meshes.innerGimbal) meshes.innerGimbal.rotation.z = t * 4;
        if(meshes.gyroRotor) meshes.gyroRotor.rotation.y = t * 10;

        // Dark Energy Turbines
        if(meshes.turbineLeft) meshes.turbineLeft.rotation.z = -t * 15;
        if(meshes.turbineRight) meshes.turbineRight.rotation.z = t * 15;

        // Spacetime Fins adjusting to maintain balance
        if(activeMeshes.PortSpacetimeFin && !activeMeshes.PortSpacetimeFin.userData.isExploded) {
            activeMeshes.PortSpacetimeFin.rotation.z = Math.sin(t * 5) * 0.1;
        }
        if(activeMeshes.StarboardSpacetimeFin && !activeMeshes.StarboardSpacetimeFin.userData.isExploded) {
            activeMeshes.StarboardSpacetimeFin.rotation.z = -Math.sin(t * 5) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
