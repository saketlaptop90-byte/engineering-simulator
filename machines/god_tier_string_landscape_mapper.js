import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // =========================================================================
    // CUSTOM MULTIVERSE MATERIALS
    // =========================================================================
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 3.0, 
        wireframe: true, transparent: true, opacity: 0.8 
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 2.5, 
        transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8
    });
    
    const holographicGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0, 
        wireframe: true, transparent: true, opacity: 0.4 
    });
    
    const fluxOrange = new THREE.MeshStandardMaterial({ 
        color: 0xff5500, emissive: 0xff2200, emissiveIntensity: 3.5,
        roughness: 0.2, metalness: 0.9
    });
    
    const quantumGold = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, emissive: 0xaa8800, emissiveIntensity: 1.2, 
        metalness: 1.0, roughness: 0.05 
    });

    const voidBlack = new THREE.MeshStandardMaterial({
        color: 0x050505, roughness: 0.9, metalness: 0.1
    });

    const exoticMatter = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x008888, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.7, wireframe: false
    });

    let partIdCounter = 1;

    // =========================================================================
    // HELPER: REGISTER PART
    // =========================================================================
    function registerPart(mesh, name, description, materialName, func, connections, failureEffect, cascadeFailures, expX, expY, expZ) {
        mesh.name = `${name}_${partIdCounter++}`;
        group.add(mesh);
        parts.push({
            name: mesh.name,
            description: description,
            material: materialName,
            function: func,
            assemblyOrder: partIdCounter,
            connections: connections,
            failureEffect: failureEffect,
            cascadeFailures: cascadeFailures,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: { x: mesh.position.x + expX, y: mesh.position.y + expY, z: mesh.position.z + expZ }
        });
    }

    // =========================================================================
    // 1. MASSIVE CHASSIS & FOUNDATION
    // =========================================================================
    function buildChassis() {
        const chassisGroup = new THREE.Group();
        
        // Main structural base using complex Shape and ExtrudeGeometry
        const chassisShape = new THREE.Shape();
        chassisShape.moveTo(0, 0);
        chassisShape.lineTo(20, 0);
        chassisShape.bezierCurveTo(25, 0, 30, 5, 30, 10);
        chassisShape.lineTo(30, 30);
        chassisShape.bezierCurveTo(30, 35, 25, 40, 20, 40);
        chassisShape.lineTo(-20, 40);
        chassisShape.bezierCurveTo(-25, 40, -30, 35, -30, 30);
        chassisShape.lineTo(-30, 10);
        chassisShape.bezierCurveTo(-30, 5, -25, 0, -20, 0);
        chassisShape.lineTo(0, 0);

        // Holes for core and hyper-drives
        const coreHole = new THREE.Path();
        coreHole.absarc(0, 20, 8, 0, Math.PI * 2, false);
        chassisShape.holes.push(coreHole);
        
        const driveHole1 = new THREE.Path();
        driveHole1.absarc(-15, 10, 4, 0, Math.PI * 2, false);
        chassisShape.holes.push(driveHole1);
        
        const driveHole2 = new THREE.Path();
        driveHole2.absarc(15, 10, 4, 0, Math.PI * 2, false);
        chassisShape.holes.push(driveHole2);

        const extrudeSettings = { 
            depth: 6, 
            bevelEnabled: true, 
            bevelSegments: 8, 
            steps: 4, 
            bevelSize: 1.5, 
            bevelThickness: 1.5 
        };
        
        const baseGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.rotation.x = Math.PI / 2;
        baseMesh.position.set(0, 10, -20);
        chassisGroup.add(baseMesh);

        // Add 200 structural rivets
        const rivetGeo = new THREE.SphereGeometry(0.2, 8, 8);
        for(let i=0; i<200; i++) {
            const rivet = new THREE.Mesh(rivetGeo, chrome);
            rivet.position.set(
                (Math.random() - 0.5) * 58, 
                10.5, 
                (Math.random() - 0.5) * 38
            );
            chassisGroup.add(rivet);
        }

        // Internal Lattice structural reinforcements
        const latticeGeo = new THREE.CylinderGeometry(0.3, 0.3, 60, 8);
        for(let i=0; i<5; i++) {
            const strut = new THREE.Mesh(latticeGeo, steel);
            strut.rotation.z = Math.PI / 2;
            strut.position.set(0, 7, -15 + i*8);
            chassisGroup.add(strut);
        }

        registerPart(
            chassisGroup, 
            "God_Tier_Landscape_Chassis", 
            "The multi-layered durasteel framework protecting the entire quantum assembly.", 
            "darkSteel", 
            "Provides macroscopic structural integrity in regions of high gravitational variance.", 
            ["Tires", "Core", "Booms", "Cabin"], 
            "Catastrophic structural collapse", 
            ["Core breach", "Loss of all telemetry", "Operator fatality"], 
            0, -50, 0
        );
    }
    buildChassis();

    // =========================================================================
    // 2. MULTI-TERRAIN HYPER-TIRES
    // =========================================================================
    function buildTire(x, y, z, nameSuffix, rotateY) {
        const tireGroup = new THREE.Group();
        
        // Massive main Torus
        const torusGeo = new THREE.TorusGeometry(6, 2.5, 64, 128);
        const mainTire = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(mainTire);

        // Hundreds of tiny extruded BoxGeometry lugs for treads
        const lugGeo = new THREE.BoxGeometry(3, 0.8, 5.5);
        const numLugs = 120;
        for(let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position on the outer edge of the torus
            lug.position.set(Math.cos(angle) * 8.2, Math.sin(angle) * 8.2, 0);
            lug.rotation.z = angle;
            // Slight alternating offset for aggressive tread
            lug.position.z = (i % 2 === 0) ? 0.5 : -0.5;
            tireGroup.add(lug);
        }

        // Rim using complex Cylinder with Lathe profile inside
        const rimPoints = [];
        for (let i = 0; i <= 10; i++) {
            rimPoints.push(new THREE.Vector2(Math.sin(i * 0.3) * 2 + 1.5, (i - 5) * 0.4));
        }
        const rimGeo = new THREE.LatheGeometry(rimPoints, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        const outerRimGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.5, 64);
        const outerRim = new THREE.Mesh(outerRimGeo, chrome);
        outerRim.rotation.x = Math.PI / 2;
        tireGroup.add(outerRim);

        // Complex spoke arrays (nested cylinders)
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.1, 9, 16);
        const innerSpokeGeo = new THREE.CylinderGeometry(0.1, 0.1, 9, 8);
        for(let i=0; i<16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = angle;
            spoke.position.set(Math.cos(angle)*2.2, Math.sin(angle)*2.2, 0);
            
            const innerSpoke = new THREE.Mesh(innerSpokeGeo, copper);
            innerSpoke.rotation.z = angle + (Math.PI/16);
            innerSpoke.position.set(Math.cos(angle+(Math.PI/16))*2.2, Math.sin(angle+(Math.PI/16))*2.2, -0.5);

            tireGroup.add(spoke);
            tireGroup.add(innerSpoke);
        }

        // Center hub glow
        const hubGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const hub = new THREE.Mesh(hubGeo, fluxOrange);
        hub.scale.z = 0.5;
        tireGroup.add(hub);

        tireGroup.position.set(x, y, z);
        if (rotateY) tireGroup.rotation.y = rotateY;
        
        updatables.push({
            obj: tireGroup,
            type: 'wheel',
            speed: 1.5
        });

        registerPart(
            tireGroup, 
            `Quantum_Tread_Assemblage_${nameSuffix}`, 
            "Hyper-dense off-road traction wheels designed to grip on 11-dimensional surfaces.", 
            "rubber/chrome/steel", 
            "Allows traversal of shifting reality landscapes.", 
            ["Axle", "Chassis", "Hydraulic Suspension"], 
            "Loss of mobility in physical dimensions", 
            ["Axle snap", "Gravitational stranding"], 
            x*3, -20, z*3
        );
    }

    // 8-Wheel Drive System
    buildTire( 35, 8.5,  25, "FR_1");
    buildTire( 35, 8.5,   5, "FR_2");
    buildTire( 35, 8.5, -15, "RR_1");
    buildTire( 35, 8.5, -35, "RR_2");

    buildTire(-35, 8.5,  25, "FL_1", Math.PI);
    buildTire(-35, 8.5,   5, "FL_2", Math.PI);
    buildTire(-35, 8.5, -15, "RL_1", Math.PI);
    buildTire(-35, 8.5, -35, "RL_2", Math.PI);

    // =========================================================================
    // 3. HYDRAULIC SUSPENSION SYSTEM
    // =========================================================================
    function buildSuspension(x, y, z, nameSuffix) {
        const suspGroup = new THREE.Group();

        // Main housing
        const housingGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        suspGroup.add(housing);

        // Piston (Cylinder within Cylinder)
        const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = -6;
        suspGroup.add(piston);

        // Hydraulic fluid lines
        const linePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2, 2, 0),
            new THREE.Vector3(3, -2, 2),
            new THREE.Vector3(2, -6, 0)
        ]);
        const lineGeo = new THREE.TubeGeometry(linePath, 20, 0.3, 8, false);
        const line = new THREE.Mesh(lineGeo, copper);
        suspGroup.add(line);

        // Suspension Springs
        const springGeo = new THREE.TorusGeometry(2.5, 0.4, 16, 100);
        for(let i=0; i<5; i++) {
            const spring = new THREE.Mesh(springGeo, steel);
            spring.rotation.x = Math.PI / 2;
            spring.position.y = -2 - i*1.5;
            suspGroup.add(spring);
        }

        suspGroup.position.set(x, y, z);
        
        updatables.push({
            obj: piston,
            type: 'suspension_piston',
            baseY: -6,
            offset: Math.random() * Math.PI * 2
        });

        registerPart(
            suspGroup, 
            `Hydraulic_Tachyon_Strut_${nameSuffix}`, 
            "Absorbs macroscopic shockwaves and localized space-time distortions.", 
            "darkSteel/chrome/copper", 
            "Dampens multidimensional impacts.", 
            ["Chassis", `Wheel_${nameSuffix}`], 
            "Excessive vibration", 
            ["Sensor misalignment"], 
            x*1.5, 10, z*1.5
        );
    }

    buildSuspension( 28, 14,  25, "FR_1");
    buildSuspension( 28, 14,   5, "FR_2");
    buildSuspension( 28, 14, -15, "RR_1");
    buildSuspension( 28, 14, -35, "RR_2");

    buildSuspension(-28, 14,  25, "FL_1");
    buildSuspension(-28, 14,   5, "FL_2");
    buildSuspension(-28, 14, -15, "RL_1");
    buildSuspension(-28, 14, -35, "RL_2");

    // =========================================================================
    // 4. THE QUANTUM SUPERCOMPUTER CORE
    // =========================================================================
    function buildCore() {
        const coreGroup = new THREE.Group();
        
        // Massive central reactor block
        const reactorShape = new THREE.Shape();
        reactorShape.absarc(0, 0, 8, 0, Math.PI * 2, false);
        const extSet = { depth: 15, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
        const reactorGeo = new THREE.ExtrudeGeometry(reactorShape, extSet);
        const reactor = new THREE.Mesh(reactorGeo, voidBlack);
        reactor.rotation.x = Math.PI / 2;
        reactor.position.y = 8;
        coreGroup.add(reactor);

        // Core containment rings
        for(let i=0; i<8; i++) {
            const ringGeo = new THREE.TorusGeometry(9 + Math.sin(i*0.5)*1, 0.5, 32, 128);
            const ring = new THREE.Mesh(ringGeo, neonBlue);
            ring.position.y = -6 + i*2.5;
            ring.rotation.x = Math.PI / 2;
            coreGroup.add(ring);
            
            updatables.push({
                obj: ring,
                type: 'core_ring',
                baseY: ring.position.y,
                phase: i * 0.5,
                scale: 9 + Math.sin(i*0.5)*1
            });
        }

        // Energy Plumes
        const plumeGeo = new THREE.CylinderGeometry(0.5, 4, 20, 32, 1, true);
        const plume = new THREE.Mesh(plumeGeo, fluxOrange);
        plume.position.y = 10;
        coreGroup.add(plume);
        
        updatables.push({
            obj: plume,
            type: 'plume'
        });

        // Processing node arrays
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const nodeGeo = new THREE.BoxGeometry(2, 12, 2);
            const node = new THREE.Mesh(nodeGeo, darkSteel);
            node.position.set(Math.cos(angle)*11, 2, Math.sin(angle)*11);
            
            // Node screens
            const screenGeo = new THREE.PlaneGeometry(1.5, 10);
            const screen = new THREE.Mesh(screenGeo, holographicGreen);
            screen.position.set(0, 0, 1.01);
            node.add(screen);

            node.lookAt(0, 2, 0);
            coreGroup.add(node);
        }

        coreGroup.position.set(0, 16, 0);
        registerPart(
            coreGroup, 
            "10^500_Vacuum_State_Processor", 
            "The heart of the String Landscape Mapper, capable of calculating vacua coordinates simultaneously.", 
            "voidBlack/neonBlue/fluxOrange", 
            "Computes multidimensional topography.", 
            ["Chassis", "Hologram Projector", "Data Rivers"], 
            "Total logic collapse", 
            ["Reality fragmentation", "False vacuum decay nucleation"], 
            0, 80, 0
        );
    }
    buildCore();

    // =========================================================================
    // 5. CALABI-YAU MANIFOLD HOLOGRAPHIC PROJECTOR
    // =========================================================================
    function buildHologram() {
        const holoGroup = new THREE.Group();

        // Projector Base
        const projBaseGeo = new THREE.CylinderGeometry(5, 7, 4, 64);
        const projBase = new THREE.Mesh(projBaseGeo, chrome);
        holoGroup.add(projBase);

        // Emitter Lenses
        for(let i=0; i<6; i++) {
            const angle = (i/6) * Math.PI * 2;
            const lensGeo = new THREE.SphereGeometry(1, 32, 32);
            const lens = new THREE.Mesh(lensGeo, glass);
            lens.position.set(Math.cos(angle)*4, 2, Math.sin(angle)*4);
            holoGroup.add(lens);
            
            const beamGeo = new THREE.CylinderGeometry(0.1, 1.5, 15, 32, 1, true);
            const beam = new THREE.Mesh(beamGeo, holographicGreen);
            beam.position.set(Math.cos(angle)*4, 9, Math.sin(angle)*4);
            // aim at center
            beam.lookAt(0, 15, 0);
            beam.rotation.x -= Math.PI/2;
            holoGroup.add(beam);
        }

        // The Calabi-Yau projection (using deeply nested TorusKnots)
        const cyGeo1 = new THREE.TorusKnotGeometry(4, 1.2, 300, 64, 5, 8);
        const cyMesh1 = new THREE.Mesh(cyGeo1, holographicGreen);
        cyMesh1.position.y = 15;
        holoGroup.add(cyMesh1);

        const cyGeo2 = new THREE.TorusKnotGeometry(3, 0.8, 200, 64, 7, 3);
        const cyMesh2 = new THREE.Mesh(cyGeo2, neonPurple);
        cyMesh2.position.y = 15;
        holoGroup.add(cyMesh2);
        
        const cyGeo3 = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 32, 11, 4);
        const cyMesh3 = new THREE.Mesh(cyGeo3, neonBlue);
        cyMesh3.position.y = 15;
        holoGroup.add(cyMesh3);

        updatables.push({ obj: cyMesh1, type: 'calabi_yau', speed: 1.0 });
        updatables.push({ obj: cyMesh2, type: 'calabi_yau', speed: -1.5 });
        updatables.push({ obj: cyMesh3, type: 'calabi_yau', speed: 2.0 });

        holoGroup.position.set(0, 26, 0);
        registerPart(
            holoGroup, 
            "Holographic_Topology_Projector", 
            "Projects a visual representation of the folded compactified dimensions.", 
            "chrome/glass/neon", 
            "Visualizes 6D Calabi-Yau manifolds in real-time.", 
            ["Core processor"], 
            "Loss of visual topology", 
            ["Navigational blindness"], 
            0, 120, 0
        );
    }
    buildHologram();

    // =========================================================================
    // 6. MASSIVE DATA RIVERS
    // =========================================================================
    function buildDataRivers() {
        // We use complex parametric curves to simulate data flowing around the machine
        class MultiverseCurve extends THREE.Curve {
            constructor(scale, phaseX, phaseY, phaseZ) {
                super();
                this.scale = scale;
                this.phaseX = phaseX;
                this.phaseY = phaseY;
                this.phaseZ = phaseZ;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.cos(t * Math.PI * this.phaseX) * this.scale.x;
                const ty = Math.sin(t * Math.PI * this.phaseY) * this.scale.y;
                const tz = Math.sin(t * Math.PI * this.phaseZ) * this.scale.z;
                return optionalTarget.set(tx, ty, tz);
            }
        }
        
        const curves = [
            { s: {x: 35, y: 15, z: 25}, pX: 4, pY: 6, pZ: 2, mat: neonBlue },
            { s: {x: 40, y: 10, z: 30}, pX: 2, pY: 8, pZ: 4, mat: holographicGreen },
            { s: {x: 25, y: 25, z: 40}, pX: 6, pY: 2, pZ: 6, mat: neonPurple },
            { s: {x: 45, y: 5, z: 20}, pX: 8, pY: 4, pZ: 2, mat: fluxOrange }
        ];

        curves.forEach((cfg, idx) => {
            const path = new MultiverseCurve(cfg.s, cfg.pX, cfg.pY, cfg.pZ);
            const tubeGeo = new THREE.TubeGeometry(path, 300, 0.8, 16, true);
            const tube = new THREE.Mesh(tubeGeo, cfg.mat);
            tube.position.y = 20;
            group.add(tube);
            
            updatables.push({
                obj: tube,
                type: 'data_river',
                speed: (idx % 2 === 0 ? 1 : -1) * (1 + idx*0.2)
            });

            registerPart(
                tube, 
                `Data_River_Stream_${idx}`, 
                "Physical manifestation of tensor flows mapping the string vacua.", 
                "exoticMatter", 
                "Transmits sheer volumes of coordinate data instantly.", 
                ["Core", "Sensor Booms"], 
                "Information leak into the bulk", 
                ["Localized reality breakdown"], 
                cfg.s.x * 2, 50, cfg.s.z * 2
            );
        });
    }
    buildDataRivers();

    // =========================================================================
    // 7. OPERATOR CABIN (Highly Detailed)
    // =========================================================================
    function buildCabin() {
        const cabinGroup = new THREE.Group();
        
        // Outer Shell
        const shellShape = new THREE.Shape();
        shellShape.moveTo(-8, 0);
        shellShape.lineTo(8, 0);
        shellShape.lineTo(10, 5);
        shellShape.lineTo(8, 12);
        shellShape.lineTo(-8, 12);
        shellShape.lineTo(-10, 5);
        shellShape.lineTo(-8, 0);
        
        const shellExt = { depth: 16, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
        const shellGeo = new THREE.ExtrudeGeometry(shellShape, shellExt);
        const shell = new THREE.Mesh(shellGeo, steel);
        shell.rotation.x = Math.PI / 2;
        shell.position.set(0, 0, 8);
        cabinGroup.add(shell);

        // Windows (Tinted)
        const frontWinGeo = new THREE.PlaneGeometry(14, 8);
        const frontWin = new THREE.Mesh(frontWinGeo, tinted);
        frontWin.position.set(0, 6, 8.1);
        cabinGroup.add(frontWin);

        const topWinGeo = new THREE.PlaneGeometry(14, 14);
        const topWin = new THREE.Mesh(topWinGeo, tinted);
        topWin.rotation.x = -Math.PI / 2;
        topWin.position.set(0, 12.1, 1);
        cabinGroup.add(topWin);

        // Observer Chair
        const chairGroup = new THREE.Group();
        const seatGeo = new THREE.BoxGeometry(4, 1, 4);
        const seat = new THREE.Mesh(seatGeo, plastic);
        chairGroup.add(seat);
        const backGeo = new THREE.BoxGeometry(4, 6, 1);
        const back = new THREE.Mesh(backGeo, plastic);
        back.position.set(0, 3, -1.5);
        chairGroup.add(back);
        chairGroup.position.set(0, 2, 2);
        cabinGroup.add(chairGroup);

        // Central Console & Joysticks
        const consoleGeo = new THREE.BoxGeometry(8, 3, 4);
        const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
        consoleMesh.position.set(0, 2, 6);
        consoleMesh.rotation.x = -Math.PI / 6;
        cabinGroup.add(consoleMesh);

        // 10 Glowing UI Screens
        for(let i=0; i<10; i++) {
            const uiGeo = new THREE.PlaneGeometry(1.2, 0.8);
            const ui = new THREE.Mesh(uiGeo, (i%2===0) ? holographicGreen : neonBlue);
            ui.position.set(-3 + (i%5)*1.5, 1 + Math.floor(i/5)*1, 2.01);
            consoleMesh.add(ui);
        }

        // Joysticks
        for(let i of [-1, 1]) {
            const joyBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
            const joyBase = new THREE.Mesh(joyBaseGeo, steel);
            joyBase.position.set(i*3, 0.5, 0);
            const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
            const stick = new THREE.Mesh(stickGeo, chrome);
            stick.position.set(0, 1, 0);
            joyBase.add(stick);
            consoleMesh.add(joyBase);
        }

        // Cabin support pillars
        const pillarGeo = new THREE.CylinderGeometry(1, 1, 10, 16);
        for(let x of [-6, 6]) {
            for(let z of [-5, 5]) {
                const pillar = new THREE.Mesh(pillarGeo, steel);
                pillar.position.set(x, -5, z);
                cabinGroup.add(pillar);
            }
        }

        cabinGroup.position.set(0, 25, 25);
        registerPart(
            cabinGroup, 
            "Multiverse_Observer_Cockpit", 
            "Pressurized and chronally-shielded command center.", 
            "steel/tinted/plastic", 
            "Protects the operator from vacuum decay and paradoxes.", 
            ["Chassis", "Core"], 
            "Observer exposed to raw landscape", 
            ["Spontaneous existence failure"], 
            0, 60, 40
        );
    }
    buildCabin();

    // =========================================================================
    // 8. HYDRAULIC SENSOR BOOM ARMS
    // =========================================================================
    function buildBoomArm(xSign) {
        const boomGroup = new THREE.Group();

        // Massive rotating base pivot
        const pivotGeo = new THREE.CylinderGeometry(4, 4, 8, 64);
        const pivot = new THREE.Mesh(pivotGeo, steel);
        pivot.rotation.x = Math.PI/2;
        boomGroup.add(pivot);

        // Massive Lower Arm
        const lowerArmShape = new THREE.Shape();
        lowerArmShape.moveTo(-2, 0);
        lowerArmShape.lineTo(2, 0);
        lowerArmShape.lineTo(1.5, 30);
        lowerArmShape.lineTo(-1.5, 30);
        lowerArmShape.lineTo(-2, 0);
        
        const lowerExt = { depth: 4, bevelEnabled: true, bevelSize: 0.2 };
        const lowerArmGeo = new THREE.ExtrudeGeometry(lowerArmShape, lowerExt);
        const lowerArm = new THREE.Mesh(lowerArmGeo, darkSteel);
        lowerArm.position.set(0, 0, -2);
        boomGroup.add(lowerArm);

        // Massive Piston Array for lower arm
        const pistonOuterGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
        const pistonOuter = new THREE.Mesh(pistonOuterGeo, copper);
        pistonOuter.position.set(0, 10, 4);
        pistonOuter.rotation.x = Math.PI/12;
        boomGroup.add(pistonOuter);

        const pistonInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 32);
        const pistonInner = new THREE.Mesh(pistonInnerGeo, chrome);
        pistonInner.position.set(0, 10, 0);
        pistonOuter.add(pistonInner);

        // Upper arm joint
        const jointGeo = new THREE.SphereGeometry(3, 32, 32);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.set(0, 30, 0);
        boomGroup.add(joint);

        // Upper Arm
        const upperArmGeo = new THREE.BoxGeometry(2.5, 25, 2.5);
        const upperArm = new THREE.Mesh(upperArmGeo, aluminum);
        upperArm.position.y = 12.5;
        // initial angle
        upperArm.rotation.z = Math.PI/4 * xSign;
        joint.add(upperArm);

        // Multidimensional Sensor Array Head
        const headGeo = new THREE.IcosahedronGeometry(4, 1);
        const head = new THREE.Mesh(headGeo, quantumGold);
        head.position.y = 12.5;
        upperArm.add(head);

        // Sensor probes (Spikes)
        for(let i=0; i<8; i++) {
            const probeGeo = new THREE.ConeGeometry(0.5, 10, 16);
            const probe = new THREE.Mesh(probeGeo, fluxOrange);
            probe.position.y = 8;
            probe.rotation.z = (Math.PI/4) * i;
            head.add(probe);
        }

        updatables.push({
            obj: boomGroup,
            type: 'boom_arm',
            sign: xSign,
            innerPiston: pistonInner,
            joint: joint,
            head: head
        });

        boomGroup.position.set(xSign * 18, 14, -15);
        registerPart(
            boomGroup, 
            `Topological_Sensor_Boom_${xSign > 0 ? "Starboard" : "Port"}`, 
            "Articulating macro-manipulators for probing dimensional fabric.", 
            "steel/copper/gold/aluminum", 
            "Extends sensors into unstable vacuum regions safely.", 
            ["Chassis", "Data Rivers"], 
            "Inability to scan distant vacua", 
            ["Mapping blindspots"], 
            xSign * 40, 20, -40
        );
    }
    buildBoomArm(1);
    buildBoomArm(-1);

    // =========================================================================
    // 9. HAWKING RADIATION EXHAUST VENTS & FLUX CAPACITORS
    // =========================================================================
    function buildExhausts() {
        const exhaustGroup = new THREE.Group();
        
        // Build 12 massive stacks
        for(let i=0; i<12; i++) {
            const xOffset = (i%2 === 0 ? 1 : -1) * 22;
            const zOffset = 25 - Math.floor(i/2) * 8;
            
            const pipeGeo = new THREE.CylinderGeometry(1.8, 2.2, 18, 32);
            const pipe = new THREE.Mesh(pipeGeo, chrome);
            pipe.position.set(xOffset, 15, zOffset);
            
            // Ribbed heat sinks
            for(let j=0; j<5; j++) {
                const ribGeo = new THREE.TorusGeometry(2.5, 0.4, 16, 32);
                const rib = new THREE.Mesh(ribGeo, darkSteel);
                rib.rotation.x = Math.PI/2;
                rib.position.y = -6 + j*3;
                pipe.add(rib);
            }

            // Animated Flaps
            const flapGeo = new THREE.PlaneGeometry(3.6, 3.6);
            const flap = new THREE.Mesh(flapGeo, voidBlack);
            flap.position.set(0, 9, 0);
            flap.rotation.x = Math.PI / 4;
            pipe.add(flap);
            
            // Emissive glow inside
            const glowGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
            const glow = new THREE.Mesh(glowGeo, fluxOrange);
            glow.position.set(0, 8, 0);
            pipe.add(glow);

            updatables.push({
                obj: flap,
                type: 'exhaust_flap',
                offset: i
            });

            exhaustGroup.add(pipe);
        }
        
        exhaustGroup.position.set(0, 10, -10);
        registerPart(
            exhaustGroup, 
            "Hawking_Radiation_Vents", 
            "Massive thermal and informational exhaust stacks.", 
            "chrome/darkSteel/fluxOrange", 
            "Vents excess vacuum energy and paradox heat.", 
            ["Chassis", "Core"], 
            "Core informational meltdown", 
            ["Catastrophic erasure of local history"], 
            0, 80, 50
        );
    }
    buildExhausts();

    // =========================================================================
    // 10. M-THEORY PLATING & STRING TENSION REGULATORS
    // =========================================================================
    function buildPlating() {
        const platingGroup = new THREE.Group();
        
        // Hexagonal plating arrays
        const hexGeo = new THREE.CylinderGeometry(2, 2, 0.5, 6);
        for(let x = -20; x <= 20; x += 4) {
            for(let z = -30; z <= 10; z += 4) {
                // Check if inside chassis bounds roughly
                if (Math.abs(x) < 22 && Math.abs(z) < 32) {
                    const hex = new THREE.Mesh(hexGeo, steel);
                    hex.position.set(x, 16.5, z);
                    
                    // Tension regulator node
                    const nodeGeo = new THREE.SphereGeometry(0.5, 8, 8);
                    const node = new THREE.Mesh(nodeGeo, neonBlue);
                    node.position.y = 0.5;
                    hex.add(node);
                    
                    platingGroup.add(hex);
                    
                    updatables.push({
                        obj: node,
                        type: 'tension_node',
                        baseY: 0.5,
                        phase: x + z
                    });
                }
            }
        }
        registerPart(
            platingGroup, 
            "M_Theory_Armor_Plating", 
            "Hexagonal super-symmetric plating.", 
            "steel/neonBlue", 
            "Deflects high-energy tachyons and stray cosmic strings.", 
            ["Chassis"], 
            "Armor breach", 
            ["Internal component decay"], 
            0, 30, 0
        );
    }
    buildPlating();

    // =========================================================================
    // DESCRIPTION & METADATA
    // =========================================================================
    const description = "The String Landscape Mapper (God Tier) is an unfathomably massive and complex construct designed to navigate and index the 10^500 possible false vacua of the string landscape. It employs an 8-wheel quantum-tread drive system, real-time holographic Calabi-Yau manifold unfolding, immense tensor data rivers, and Hawking radiation exhaust stacks to chart the multiverse without collapsing the local wavefunction.";

    // =========================================================================
    // 5 PHD-LEVEL STRING THEORY / MATH QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of the string landscape, what is the primary mechanism that stabilizes the moduli fields in Type IIB flux compactifications to yield a discrete set of vacua?",
            options: [
                "The KKLT (Kachru-Kallosh-Linde-Trivedi) mechanism",
                "The Seiberg-Witten exact solution",
                "The AdS/CFT correspondence limit",
                "T-duality invariant winding modes"
            ],
            answer: 0,
            explanation: "The KKLT mechanism incorporates fluxes to stabilize complex structure moduli and the dilaton, followed by non-perturbative effects (like gaugino condensation or Euclidean D3-branes) to stabilize Kahler moduli, producing de Sitter vacua via an anti-D3 brane uplift."
        },
        {
            question: "The Euler characteristic χ of a Calabi-Yau 3-fold relates to the number of generations of chiral fermions in standard heterotic string compactifications. Which formula correctly represents this relationship?",
            options: [
                "Generations = |χ| / 2",
                "Generations = χ",
                "Generations = 2 * |χ|",
                "Generations = χ^2 / 4"
            ],
            answer: 0,
            explanation: "In heterotic compactifications on a Calabi-Yau manifold, the net number of chiral generations (number of 27s minus number of 27-bars in E6) is given by half the absolute value of the Euler characteristic of the manifold."
        },
        {
            question: "Bousso's holographic bound relates the maximum degrees of freedom in a region to its boundary area. In a de Sitter space with a positive cosmological constant Λ, the maximum entropy is proportional to:",
            options: [
                "1 / Λ",
                "Λ^2",
                "1 / Λ^2",
                "ln(Λ)"
            ],
            answer: 0,
            explanation: "The entropy of de Sitter space is given by the Gibbons-Hawking entropy, S = 3π / (G * Λ). Therefore, the maximum entropy bound is inversely proportional to the cosmological constant Λ."
        },
        {
            question: "In F-theory compactifications on elliptically fibered Calabi-Yau fourfolds, the elliptic fibration degenerates over specific loci in the base space. What do these singular loci correspond to physically in the effective theory?",
            options: [
                "Locations of 7-branes wrapping cycles in the base",
                "Positions of D3-branes",
                "Horizons of extremal black holes",
                "Graviton vertex operator insertion points"
            ],
            answer: 0,
            explanation: "The singular fibers of the elliptic fibration in F-theory indicate where the axio-dilaton undergoes a monodromy, which physically corresponds to the locations of 7-branes wrapping cycles in the base manifold."
        },
        {
            question: "A transition between distinct false vacua in the landscape occurs via quantum bubble nucleation. The decay rate per unit volume is governed by the bounce action exponent B. What is the standard formalism used to calculate B including gravitational backreaction?",
            options: [
                "Coleman-De Luccia formalism",
                "Feynman-Kac formula",
                "Penrose-Carter diagrammatics",
                "Wheeler-DeWitt minisuperspace equation"
            ],
            answer: 0,
            explanation: "The Coleman-De Luccia formalism is the standard semi-classical framework for computing the tunneling rate of false vacuum decay, explicitly taking into account the effects of general relativity and gravity on the bubble nucleation."
        }
    ];

    // =========================================================================
    // HIGHLY SYNCHRONIZED ANIMATION LOOP
    // =========================================================================
    function animate(time, speed, meshes) {
        updatables.forEach(item => {
            // Massive off-road tires rotating
            if (item.type === 'wheel') {
                item.obj.rotation.x -= 0.05 * speed * item.speed;
            }
            // Suspension pistons pumping dynamically
            if (item.type === 'suspension_piston') {
                item.obj.position.y = item.baseY + Math.sin(time * speed * 4 + item.offset) * 1.5;
            }
            // Reactor rings pulsing and scaling
            if (item.type === 'core_ring') {
                item.obj.position.y = item.baseY + Math.sin(time * 3 + item.phase) * 1.2;
                item.obj.rotation.z = Math.sin(time + item.phase) * 0.3;
                const scale = item.scale + Math.cos(time * 5 + item.phase) * 0.5;
                item.obj.scale.set(scale / item.scale, scale / item.scale, scale / item.scale);
            }
            // Energy Plume scaling
            if (item.type === 'plume') {
                item.obj.scale.y = 1 + Math.abs(Math.sin(time * 8)) * 0.5;
                item.obj.material.emissiveIntensity = 2 + Math.abs(Math.sin(time * 16)) * 2;
            }
            // Complex unfolding Holograms (Calabi-Yau)
            if (item.type === 'calabi_yau') {
                item.obj.rotation.x += 0.015 * speed * item.speed;
                item.obj.rotation.y += 0.025 * speed * item.speed;
                item.obj.rotation.z += 0.010 * speed * item.speed;
                const scale = 1 + Math.sin(time * 4 * item.speed) * 0.15;
                item.obj.scale.set(scale, scale, scale);
            }
            // Articulating Booms
            if (item.type === 'boom_arm') {
                const angle = Math.sin(time * speed * 0.8) * 0.6;
                item.obj.rotation.z = angle * item.sign;
                // Sync internal piston to match rotation
                item.innerPiston.position.y = 10 + Math.sin(time * speed * 0.8) * 3;
                // Counter-rotate head
                item.head.rotation.y += 0.05 * speed;
                item.head.rotation.z = -angle * item.sign; 
            }
            // Flowing Data Rivers
            if (item.type === 'data_river') {
                // We rotate the entire complex tube curve to simulate data flowing rapidly
                item.obj.rotation.y += 0.02 * speed * item.speed;
                item.obj.rotation.z = Math.sin(time * speed * 0.5) * 0.1;
            }
            // Hawking Flaps opening and closing
            if (item.type === 'exhaust_flap') {
                // Quick chaotic snapping motion
                const snap = Math.pow(Math.abs(Math.sin(time * 6 + item.offset)), 4);
                item.obj.rotation.x = Math.PI / 4 + snap * 1.2;
            }
            // Pulsing Tension nodes on armor
            if (item.type === 'tension_node') {
                item.obj.position.y = item.baseY + Math.sin(time * 10 + item.phase) * 0.3;
                const s = 1 + Math.sin(time * 15 + item.phase) * 0.5;
                item.obj.scale.set(s, s, s);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
