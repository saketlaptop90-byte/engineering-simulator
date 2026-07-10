import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM HYPER-REALISTIC MATERIALS
    // ==========================================
    const magmaCoreMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff3300, emissiveIntensity: 3.0, roughness: 0.1, metalness: 0.2 });
    const magmaCoolMat = new THREE.MeshStandardMaterial({ color: 0xaa2200, emissive: 0x551100, emissiveIntensity: 1.5, roughness: 0.6, metalness: 0.1 });
    const oceanicCrustMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95, metalness: 0.15, flatShading: true });
    const lithosphereMat = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.85, metalness: 0.3, flatShading: true });
    const sedimentMat = new THREE.MeshStandardMaterial({ color: 0x3d3830, roughness: 1.0, metalness: 0.05, flatShading: true });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.7, wireframe: true });
    const neonMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.7, wireframe: true });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 });
    const thermalBubbleMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x2288ff, emissiveIntensity: 1.0, transparent: true, opacity: 0.6, roughness: 0.1 });
    const smokeMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.8, roughness: 1.0 });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRY
    // ==========================================

    function createDeformedCrust(width, depth, segments, isLeft) {
        const crustGroup = new THREE.Group();
        
        // Main Lithospheric Base (ExtrudeGeometry to avoid simple cubes)
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -10);
        shape.lineTo(width/2, -10);
        shape.lineTo(width/2, 0);
        
        // create jagged top edge for shape
        for(let i = width/2; i >= -width/2; i -= 2) {
            shape.lineTo(i, Math.random() * 1.5);
        }
        shape.lineTo(-width/2, 0);
        
        const extrudeSettings = { depth: depth, bevelEnabled: false, steps: 10 };
        const baseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        baseGeom.translate(0, 0, -depth/2); // center on Z
        const baseMesh = new THREE.Mesh(baseGeom, lithosphereMat);
        crustGroup.add(baseMesh);

        // Top Ocean Crust Layer (Highly displaced Plane)
        const topGeom = new THREE.PlaneGeometry(width, depth, segments, segments);
        const pos = topGeom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const distToRidge = Math.abs(x + (isLeft ? width/2 : -width/2));
            
            let z = Math.random() * 1.5; 
            z += Math.exp(-distToRidge * 0.05) * 8; // Ridge height decay
            z += Math.sin(y * 0.05) * 3; // Transform fault simulation transverse ridges
            
            pos.setZ(i, z);
        }
        topGeom.computeVertexNormals();
        const topMesh = new THREE.Mesh(topGeom, oceanicCrustMat);
        topMesh.rotation.x = -Math.PI / 2;
        topMesh.position.y = 1.5; // sit on top of base
        crustGroup.add(topMesh);

        return crustGroup;
    }

    function createMagmaChamber() {
        const chamberGroup = new THREE.Group();
        
        // LatheGeometry for massive chamber
        const pts = [];
        for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            const radius = Math.sin(t * Math.PI) * 18 + (Math.random() * 3);
            const y = -45 + t * 25;
            pts.push(new THREE.Vector2(radius, y));
        }
        const chamberGeom = new THREE.LatheGeometry(pts, 64);
        const chamber = new THREE.Mesh(chamberGeom, magmaCoreMat);
        chamberGroup.add(chamber);

        // Branching conduits (TubeGeometry)
        for (let i = 0; i < 5; i++) {
            class CustomCurve extends THREE.Curve {
                getPoint(t) {
                    const x = (Math.random() - 0.5) * 5 * t;
                    const y = -20 + t * 18;
                    const z = (Math.random() - 0.5) * 20 * t;
                    return new THREE.Vector3(x, y, z);
                }
            }
            const path = new CustomCurve();
            const tubeGeom = new THREE.TubeGeometry(path, 20, 1.5 + Math.random(), 16, false);
            const tube = new THREE.Mesh(tubeGeom, magmaCoreMat);
            chamberGroup.add(tube);
        }

        return chamberGroup;
    }

    function createConvectionCells() {
        const convectionGroup = new THREE.Group();
        meshes.convectionBlobs = [];
        
        for (let side = -1; side <= 1; side += 2) {
            const cell = new THREE.Group();
            
            // Path Torus
            const pathGeom = new THREE.TorusGeometry(20, 1.5, 32, 100);
            const path = new THREE.Mesh(pathGeom, new THREE.MeshStandardMaterial({
                color: 0xff3300, emissive: 0x881100, wireframe: true, transparent: true, opacity: 0.15
            }));
            cell.add(path);
            
            // Magma Blobs traveling along Torus
            for (let j = 0; j < 12; j++) {
                const blobGeom = new THREE.SphereGeometry(2.5, 16, 16);
                // Distort blob
                const pos = blobGeom.attributes.position;
                for(let k=0; k<pos.count; k++) {
                    pos.setXYZ(k, pos.getX(k)*(1+Math.random()*0.3), pos.getY(k)*(1+Math.random()*0.3), pos.getZ(k)*(1+Math.random()*0.3));
                }
                blobGeom.computeVertexNormals();
                const blob = new THREE.Mesh(blobGeom, magmaCoolMat);
                cell.add(blob);
                meshes.convectionBlobs.push({
                    mesh: blob,
                    angle: (j / 12) * Math.PI * 2,
                    radius: 20,
                    direction: side // left cell spins one way, right spins other
                });
            }
            
            cell.position.set(side * 25, -35, 0);
            cell.rotation.x = 0; // Keep in XY plane to loop vertically
            convectionGroup.add(cell);
        }
        return convectionGroup;
    }

    function createHydrothermalVents() {
        const ventField = new THREE.Group();
        meshes.ventEmitters = [];

        for (let i = 0; i < 20; i++) {
            const ventGroup = new THREE.Group();
            
            // Base Mound
            const baseGeom = new THREE.ConeGeometry(3 + Math.random()*2, 4, 12);
            const base = new THREE.Mesh(baseGeom, oceanicCrustMat);
            base.position.y = 2;
            ventGroup.add(base);
            
            // Chimney Stacks
            let currentY = 4;
            const stackCount = 4 + Math.floor(Math.random() * 4);
            for (let j = 0; j < stackCount; j++) {
                const rad = 1.2 - (j * 0.15);
                const segHeight = 1.5 + Math.random();
                const segGeom = new THREE.CylinderGeometry(rad*0.7, rad, segHeight, 12);
                
                // Distort for organic jagged look
                const pos = segGeom.attributes.position;
                for (let k = 0; k < pos.count; k++) {
                    pos.setX(k, pos.getX(k) + (Math.random()-0.5)*0.4);
                    pos.setZ(k, pos.getZ(k) + (Math.random()-0.5)*0.4);
                }
                segGeom.computeVertexNormals();
                
                const seg = new THREE.Mesh(segGeom, lithosphereMat);
                seg.position.y = currentY + segHeight / 2;
                seg.rotation.x = (Math.random() - 0.5) * 0.3;
                seg.rotation.z = (Math.random() - 0.5) * 0.3;
                ventGroup.add(seg);
                currentY += segHeight * 0.85;
            }
            
            ventGroup.position.set((Math.random() - 0.5) * 15, 0, (Math.random() - 0.5) * 80);
            ventField.add(ventGroup);
            
            // Register emitter location in world space roughly relative to ventField
            meshes.ventEmitters.push(new THREE.Vector3(ventGroup.position.x, currentY + 1, ventGroup.position.z));
        }
        return ventField;
    }

    function createDeepSeaCrawler() {
        const crawler = new THREE.Group();
        
        // 1. Main Chassis (Complex Extrusion)
        const shape = new THREE.Shape();
        shape.moveTo(-5, -2);
        shape.lineTo(5, -2);
        shape.lineTo(6, 0);
        shape.lineTo(4, 3);
        shape.lineTo(-4, 3);
        shape.lineTo(-6, 0);
        shape.lineTo(-5, -2);
        
        const extrudeSettings = { depth: 6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const chassisGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        chassisGeom.translate(0, 0, -3); // Center
        const chassis = new THREE.Mesh(chassisGeom, darkSteel);
        crawler.add(chassis);

        // 2. High-tech Cabins with tinted glass and interiors
        for(let side = -1; side <= 1; side += 2) {
            const cabGroup = new THREE.Group();
            
            // Cabin Shell
            const cabGeom = new THREE.BoxGeometry(3, 3, 4);
            const cab = new THREE.Mesh(cabGeom, steel);
            cabGroup.add(cab);
            
            // Tinted Glass Windows
            const windowGeom = new THREE.PlaneGeometry(2.8, 1.5);
            const frontWindow = new THREE.Mesh(windowGeom, tinted);
            frontWindow.position.set(0, 0.5, 2.01);
            cabGroup.add(frontWindow);

            // Interior Details: Steering Wheel & Joysticks
            const steeringGeom = new THREE.TorusGeometry(0.4, 0.08, 16, 32);
            const steeringWheel = new THREE.Mesh(steeringGeom, plastic);
            steeringWheel.rotation.x = Math.PI / 3;
            steeringWheel.position.set(-0.5, 0, 1.5);
            cabGroup.add(steeringWheel);

            // Glowing Control Screens
            const screenGeom = new THREE.PlaneGeometry(0.8, 0.5);
            const screen = new THREE.Mesh(screenGeom, screenMat);
            screen.position.set(0, -0.2, 1.8);
            screen.rotation.x = -Math.PI / 6;
            cabGroup.add(screen);

            cabGroup.position.set(side * 2.5, 4.5, 1);
            crawler.add(cabGroup);
        }

        // 3. Exhaust Stacks (Cylinders emitting bubbles)
        for(let side = -1; side <= 1; side += 2) {
            const stackGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
            const stack = new THREE.Mesh(stackGeom, chrome);
            stack.position.set(side * 4, 4, -2);
            crawler.add(stack);
        }

        // 4. Mandated Complex Tires and Rims
        meshes.crawlerWheels = [];
        const wheelPositions = [
            [-5.5, -2, 4], [5.5, -2, 4],
            [-5.5, -2, 0], [5.5, -2, 0],
            [-5.5, -2, -4], [5.5, -2, -4]
        ];

        wheelPositions.forEach((pos, idx) => {
            const wheelGroup = new THREE.Group();
            
            // Tire Base (TorusGeometry)
            const tireGeom = new THREE.TorusGeometry(2.2, 1.0, 32, 64);
            const tire = new THREE.Mesh(tireGeom, rubber);
            wheelGroup.add(tire);
            
            // Hundreds of tiny extruded BoxGeometry lugs for aggressive treads
            const numLugs = 120;
            const lugGeom = new THREE.BoxGeometry(2.0, 0.25, 0.5);
            for (let j = 0; j < numLugs; j++) {
                const lug = new THREE.Mesh(lugGeom, rubber);
                const angle = (j / numLugs) * Math.PI * 2;
                lug.position.x = Math.cos(angle) * 3.1;
                lug.position.y = Math.sin(angle) * 3.1;
                lug.rotation.z = angle;
                lug.position.z = (j % 2 === 0) ? 0.3 : -0.3; // Stagger lugs
                wheelGroup.add(lug);
            }
            
            // Rims (CylinderGeometry with complex spoke arrays)
            const rimGeom = new THREE.CylinderGeometry(1.6, 1.6, 1.8, 32);
            const rim = new THREE.Mesh(rimGeom, chrome);
            rim.rotation.x = Math.PI / 2;
            wheelGroup.add(rim);
            
            const numSpokes = 16;
            for (let j = 0; j < numSpokes; j++) {
                const spokeGeom = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 16);
                const spoke = new THREE.Mesh(spokeGeom, steel);
                const angle = (j / numSpokes) * Math.PI * 2;
                spoke.rotation.z = angle;
                spoke.rotation.x = Math.PI / 2;
                wheelGroup.add(spoke);
            }
            
            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            wheelGroup.rotation.y = Math.PI / 2;
            crawler.add(wheelGroup);
            meshes.crawlerWheels.push(wheelGroup);
        });

        // 5. Hydraulic Boom Arm (Articulating with sine waves)
        const boomSystem = new THREE.Group();
        
        const mountGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
        const mount = new THREE.Mesh(mountGeom, darkSteel);
        boomSystem.add(mount);
        
        const armGeom = new THREE.BoxGeometry(1, 8, 1);
        armGeom.translate(0, 4, 0); // Pivot at base
        const arm = new THREE.Mesh(armGeom, steel);
        arm.position.y = 0.5;
        boomSystem.add(arm);
        meshes.boomArm = arm;
        
        // Hydraulic Piston (Cylinder within Cylinder)
        const pistonShellGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
        pistonShellGeom.translate(0, 2, 0);
        const pistonShell = new THREE.Mesh(pistonShellGeom, darkSteel);
        pistonShell.position.set(1.2, 0.5, 0);
        boomSystem.add(pistonShell);
        meshes.pistonShell = pistonShell;
        
        const pistonRodGeom = new THREE.CylinderGeometry(0.25, 0.25, 4, 16);
        pistonRodGeom.translate(0, 2, 0);
        const pistonRod = new THREE.Mesh(pistonRodGeom, chrome);
        pistonShell.add(pistonRod);
        meshes.pistonRod = pistonRod;
        
        boomSystem.position.set(0, 3, -4);
        crawler.add(boomSystem);

        return crawler;
    }

    function createMagneticStripes() {
        const stripeGroup = new THREE.Group();
        meshes.stripes = [];
        const stripeCount = 10;
        
        for(let i = 0; i < stripeCount; i++) {
            // Extruded chevrons for high-tech look
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(4, 2);
            shape.lineTo(0, 4);
            shape.lineTo(-4, 2);
            shape.lineTo(0, 0);
            
            const extSettings = { depth: 100, bevelEnabled: false };
            const geom = new THREE.ExtrudeGeometry(shape, extSettings);
            geom.translate(0, 0, -50);
            
            const isNormal = i % 2 === 0;
            const mesh = new THREE.Mesh(geom, isNormal ? neonCyan : neonMagenta);
            mesh.rotation.x = Math.PI / 2;
            
            // Setup animation data
            const side = i < stripeCount / 2 ? -1 : 1;
            const offset = (i % (stripeCount / 2)) * 25;
            
            mesh.position.set(side * offset, 8, 0);
            
            stripeGroup.add(mesh);
            meshes.stripes.push({ mesh, side, offset });
        }
        return stripeGroup;
    }

    // ==========================================
    // ASSEMBLE THE MASSIVE SCENE
    // ==========================================

    // 1. Tectonic Plates
    const leftPlate = createDeformedCrust(100, 150, 64, true);
    leftPlate.position.set(-50, 0, 0);
    group.add(leftPlate);
    meshes.leftPlate = leftPlate;

    const rightPlate = createDeformedCrust(100, 150, 64, false);
    rightPlate.position.set(50, 0, 0);
    group.add(rightPlate);
    meshes.rightPlate = rightPlate;

    // 2. Magma Core & Convection
    const magmaChamber = createMagmaChamber();
    group.add(magmaChamber);
    
    const convectionCells = createConvectionCells();
    group.add(convectionCells);

    // 3. Hydrothermal Vents
    const vents = createHydrothermalVents();
    vents.position.y = 8;
    group.add(vents);

    // 4. Instanced Particles (Black Smoke)
    const smokeCount = 800;
    const smokeGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const smokeInstanced = new THREE.InstancedMesh(smokeGeom, smokeMat, smokeCount);
    group.add(smokeInstanced);
    meshes.smokeInstanced = smokeInstanced;
    meshes.smokeData = [];
    for (let i = 0; i < smokeCount; i++) {
        meshes.smokeData.push({
            ventIndex: Math.floor(Math.random() * meshes.ventEmitters.length),
            life: Math.random(),
            speed: 0.01 + Math.random() * 0.02,
            offset: new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2)
        });
    }

    // 5. Magnetic Striping
    const striping = createMagneticStripes();
    group.add(striping);

    // 6. Deep Sea Tectonic Crawler
    const crawler = createDeepSeaCrawler();
    crawler.position.set(-30, 11.5, 20); // Sit on the left plate
    crawler.scale.set(0.6, 0.6, 0.6); // Scale appropriately
    group.add(crawler);

    // ==========================================
    // PARTS ARRAY DEFINITION
    // ==========================================
    parts.push(
        {
            name: "Abyssal Tectonic Crawler",
            description: "An ultra-heavy, hyper-complex deep sea exploration vehicle. It rolls across the newly formed oceanic crust monitoring thermal variations and tectonic shifts.",
            material: "Steel, Chrome, Rubber, Tinted Glass",
            function: "Autonomous and manned exploration of extreme depth environments.",
            assemblyOrder: 1,
            connections: ["Crawler Tires", "Crawler Hydraulic Boom", "Left Oceanic Crust"],
            failureEffect: "Loss of direct observation data; crew stranded in abyssal depths.",
            cascadeFailures: ["Complete mission abort", "Loss of telemetry"],
            originalPosition: { x: -30, y: 11.5, z: 20 },
            explodedPosition: { x: -60, y: 30, z: 40 }
        },
        {
            name: "Crawler Aggressive Off-Road Tires",
            description: "Massive TorusGeometry tires adorned with hundreds of extruded BoxGeometry lugs, providing absolute grip on jagged basalt.",
            material: "Vulcanized Rubber, Chrome",
            function: "Traction and weight distribution over chaotic tectonic terrain.",
            assemblyOrder: 2,
            connections: ["Abyssal Tectonic Crawler"],
            failureEffect: "Immobility of the crawler, getting stuck in rift faults.",
            cascadeFailures: ["Crawler immobilization", "Overheating due to lack of movement"],
            originalPosition: { x: 0, y: -2, z: 0 },
            explodedPosition: { x: -10, y: -10, z: -10 }
        },
        {
            name: "Crawler Hydraulic Boom Arm",
            description: "Articulated structural arm driven by perfectly synchronized nested cylinder pistons.",
            material: "Steel, Dark Steel, Chrome",
            function: "Sampling hydrothermal vent chimneys and deploying sensor arrays.",
            assemblyOrder: 3,
            connections: ["Abyssal Tectonic Crawler"],
            failureEffect: "Inability to manipulate physical environment or take core samples.",
            cascadeFailures: ["Loss of physical sampling capabilities"],
            originalPosition: { x: 0, y: 3, z: -4 },
            explodedPosition: { x: 0, y: 20, z: -20 }
        },
        {
            name: "Crawler Tinted Operator Cabins",
            description: "Dual control cabins featuring glowing screens, joysticks, steering wheels, and pressure-resistant tinted viewports.",
            material: "Steel, Tinted Glass, Plastic",
            function: "Protects operators from 400+ atm of pressure while providing interface controls.",
            assemblyOrder: 4,
            connections: ["Abyssal Tectonic Crawler"],
            failureEffect: "Immediate implosion and catastrophic loss of life.",
            cascadeFailures: ["Complete vehicle destruction"],
            originalPosition: { x: 2.5, y: 4.5, z: 1 },
            explodedPosition: { x: 10, y: 20, z: 10 }
        },
        {
            name: "Central Magma Chamber",
            description: "A massive bulbous LatheGeometry reservoir of ultra-hot molten rock directly beneath the mid-ocean ridge.",
            material: "Glowing Magma Core (Custom MeshStandardMaterial)",
            function: "Feeds molten material upwards to create new oceanic crust.",
            assemblyOrder: 5,
            connections: ["Magma Conduits", "Asthenosphere Base"],
            failureEffect: "Cessation of seafloor spreading and volcanic activity.",
            cascadeFailures: ["Ridge collapse", "Extinction of hydrothermal vent ecosystems"],
            originalPosition: { x: 0, y: -30, z: 0 },
            explodedPosition: { x: 0, y: -80, z: 0 }
        },
        {
            name: "Left Oceanic Crust Plate",
            description: "Massive deformed tectonic slab moving steadily away from the ridge axis, composed of lithosphere and basalt layers.",
            material: "Lithosphere, Oceanic Crust (Jagged displaced planes)",
            function: "Forms the ocean floor, carrying continents over millions of years.",
            assemblyOrder: 6,
            connections: ["Mid-Ocean Ridge Axis", "Right Oceanic Crust Plate"],
            failureEffect: "Plate lock causing immense seismic strain.",
            cascadeFailures: ["Megathrust earthquakes", "Tsunamis"],
            originalPosition: { x: -50, y: 0, z: 0 },
            explodedPosition: { x: -120, y: 0, z: 0 }
        },
        {
            name: "Right Oceanic Crust Plate",
            description: "The corresponding tectonic slab spreading to the right, exhibiting symmetrical magnetic striping.",
            material: "Lithosphere, Oceanic Crust",
            function: "Counterpart to the left plate, driven by convection currents.",
            assemblyOrder: 7,
            connections: ["Mid-Ocean Ridge Axis", "Left Oceanic Crust Plate"],
            failureEffect: "Subduction zone stall.",
            cascadeFailures: ["Global tectonic gridlock"],
            originalPosition: { x: 50, y: 0, z: 0 },
            explodedPosition: { x: 120, y: 0, z: 0 }
        },
        {
            name: "Hydrothermal Vent Field (Black Smokers)",
            description: "A cluster of towering, irregular cylindrical chimneys emitting superheated, mineral-rich black smoke (instanced particles).",
            material: "Lithosphere, Hot Rock",
            function: "Vents extreme heat and chemicals, supporting chemosynthetic life.",
            assemblyOrder: 8,
            connections: ["Mid-Ocean Ridge Axis", "Magma Chamber"],
            failureEffect: "Over-pressurization of the crustal layers.",
            cascadeFailures: ["Massive explosive seafloor eruptions"],
            originalPosition: { x: 0, y: 8, z: 0 },
            explodedPosition: { x: 0, y: 40, z: 20 }
        },
        {
            name: "Mantle Convection Cells",
            description: "Torus-guided currents of molten mantle dragging the tectonic plates apart via basal friction.",
            material: "Cooling Magma",
            function: "The primary engine driving plate tectonics and seafloor spreading.",
            assemblyOrder: 9,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate", "Magma Chamber"],
            failureEffect: "Complete halt of planetary tectonic activity.",
            cascadeFailures: ["Loss of planetary magnetic field", "Stagnation of geochemical cycles"],
            originalPosition: { x: 0, y: -35, z: 0 },
            explodedPosition: { x: 0, y: -100, z: 50 }
        },
        {
            name: "Magnetic Polarity Normal (Cyan)",
            description: "Glowing neon cyan wireframe extrusions representing sections of crust formed during normal Earth magnetic polarity.",
            material: "Neon Cyan Emissive",
            function: "Records the history of Earth's magnetic field reversals.",
            assemblyOrder: 10,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate"],
            failureEffect: "Loss of navigational markers for paleomagnetism.",
            cascadeFailures: ["Inability to map spreading rates"],
            originalPosition: { x: 0, y: 8, z: 0 },
            explodedPosition: { x: -30, y: 50, z: 0 }
        },
        {
            name: "Magnetic Polarity Reversed (Magenta)",
            description: "Glowing neon magenta wireframe extrusions representing crust formed during reversed magnetic polarity.",
            material: "Neon Magenta Emissive",
            function: "Provides stark contrast proving the symmetrical spreading of the seafloor.",
            assemblyOrder: 11,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate"],
            failureEffect: "Geomagnetic field decay.",
            cascadeFailures: ["Increased solar radiation hitting the surface"],
            originalPosition: { x: 25, y: 8, z: 0 },
            explodedPosition: { x: 30, y: 50, z: 0 }
        },
        {
            name: "Magma Branching Conduits",
            description: "Complex TubeGeometry pipelines funneling melt from the deep chamber to the surface rift.",
            material: "Glowing Magma Core",
            function: "Transports molten basalt to erupt as pillow lavas.",
            assemblyOrder: 12,
            connections: ["Magma Chamber", "Mid-Ocean Ridge Axis"],
            failureEffect: "Blockage causes lateral magma intrusion (dike swarms).",
            cascadeFailures: ["Off-axis volcanism"],
            originalPosition: { x: 0, y: -15, z: 0 },
            explodedPosition: { x: 0, y: -30, z: -40 }
        },
        {
            name: "Transform Faults",
            description: "Transverse fractures breaking the ridge into offset segments, simulated by sinewave displacements in the crust.",
            material: "Oceanic Crust",
            function: "Accommodates differential spreading rates along the spherical Earth.",
            assemblyOrder: 13,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate"],
            failureEffect: "Massive shear stress accumulation.",
            cascadeFailures: ["Catastrophic strike-slip earthquakes underwater"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -80 }
        },
        {
            name: "Ridge Rift Valley",
            description: "The central depressed axis where plates pull apart and fresh lava emerges.",
            material: "Oceanic Crust, Lithosphere",
            function: "The birthplace of all oceanic crust.",
            assemblyOrder: 14,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate"],
            failureEffect: "Rift jump to a new location.",
            cascadeFailures: ["Abandonment of the current ridge system"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 10, z: 0 }
        },
        {
            name: "Deep Ocean Sediment Layer",
            description: "Accumulated pelagic snow resting upon the older, cooler outer edges of the tectonic plates.",
            material: "Sediment",
            function: "Blankets the rough basalt, smoothing the abyssal plains.",
            assemblyOrder: 15,
            connections: ["Left Oceanic Crust Plate", "Right Oceanic Crust Plate"],
            failureEffect: "Exposure of raw reactive basalt to seawater.",
            cascadeFailures: ["Altered oceanic chemistry"],
            originalPosition: { x: -80, y: 2, z: 0 },
            explodedPosition: { x: -150, y: 20, z: 0 }
        }
    );

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Which component of the crawler allows it to maintain traction over the highly irregular, jagged basalts of the mid-ocean ridge?",
            options: [
                "The synchronized hydraulic boom arm.",
                "The glowing neon magnetic indicators.",
                "The complex TorusGeometry tires adorned with hundreds of extruded BoxGeometry lugs.",
                "The tinted operator cabins."
            ],
            correctAnswer: 2,
            explanation: "The specifically mandated tires with aggressive off-road treads allow the heavy tectonic crawler to navigate the chaotic seafloor terrain."
        },
        {
            question: "What geological feature is represented by the glowing cyan and magenta wireframe extrusions on the seafloor?",
            options: [
                "Bioluminescent deep-sea algae fields.",
                "Symmetrical magnetic striping recording Earth's paleomagnetic reversals.",
                "High-tech fiber optic communication cables.",
                "Areas of extreme hydrothermal venting."
            ],
            correctAnswer: 1,
            explanation: "The alternating cyan and magenta indicators represent bands of normal and reversed magnetic polarity, a key proof of seafloor spreading."
        },
        {
            question: "How do the mantle convection cells physically drive the movement of the massive tectonic plates?",
            options: [
                "By exerting magnetic repulsion against the crust.",
                "By freezing the asthenosphere into rigid blocks.",
                "Through basal friction as molten rock travels in massive Torus-shaped looping currents beneath the lithosphere.",
                "By shooting high-pressure steam into the transform faults."
            ],
            correctAnswer: 2,
            explanation: "Convection cells circulate heat from the deep mantle. As they flow horizontally beneath the lithosphere, basal friction drags the plates apart."
        },
        {
            question: "What provides the extreme heat that powers the Hydrothermal Vents (Black Smokers)?",
            options: [
                "The decay of pelagic sediment.",
                "Friction from the crawler's aggressive tires.",
                "The massive underlying LatheGeometry Magma Chamber.",
                "Solar radiation penetrating the abyssal depths."
            ],
            correctAnswer: 2,
            explanation: "The massive central magma chamber superheats seawater that seeps into the crust, forcing it back out through the vents loaded with minerals."
        },
        {
            question: "During operation, how does the Tectonic Crawler manipulate its environment to take samples?",
            options: [
                "By firing lasers from its tinted cabins.",
                "Using its articulating hydraulic boom arm driven by perfectly synchronized nested cylinder pistons.",
                "By accelerating its wheels to dig holes.",
                "By venting thermal bubbles from its exhaust stacks."
            ],
            correctAnswer: 1,
            explanation: "The crawler features a complex hydraulic boom arm. The pistons and boom joints articulate in perfect synchronization using sine waves to gather data and samples."
        }
    ];

    // ==========================================
    // HYPER-COMPLEX ANIMATION LOOP
    // ==========================================
    const description = "Ultra high-tech Seafloor Spreading Simulator. Features a hyper-realistic mid-ocean ridge, massive magnetic striping arrays, erupting hydrothermal vents, looping mantle convection, and a heavily detailed Tectonic Crawler navigating the abyss with aggressive tread tires and synchronized hydraulics.";

    const animate = (time, speed, activeMeshes) => {
        // 1. Convection Cells Orbiting
        if (activeMeshes.convectionBlobs) {
            activeMeshes.convectionBlobs.forEach(blobData => {
                const currentAngle = blobData.angle + (time * speed * 0.5 * blobData.direction);
                blobData.mesh.position.x = Math.cos(currentAngle) * blobData.radius;
                blobData.mesh.position.y = Math.sin(currentAngle) * blobData.radius;
                blobData.mesh.rotation.z += 0.05 * speed;
            });
        }

        // 2. Magma Chamber Pulsing
        magmaCoreMat.emissiveIntensity = 2.0 + Math.sin(time * speed * 2) * 1.0;

        // 3. Tectonic Plates Spreading
        // We simulate this by moving the plates outward slowly.
        const spreadDistance = (time * speed * 1.5) % 20; 
        if (activeMeshes.leftPlate) activeMeshes.leftPlate.position.x = -50 - spreadDistance;
        if (activeMeshes.rightPlate) activeMeshes.rightPlate.position.x = 50 + spreadDistance;

        // 4. Magnetic Stripes spreading
        if (activeMeshes.stripes) {
            activeMeshes.stripes.forEach(s => {
                let newOffset = s.offset + (time * speed * 1.5);
                if (newOffset > 100) newOffset = newOffset % 100;
                s.mesh.position.x = s.side * newOffset;
            });
        }

        // 5. Vent Particles Rising and Fading (Black Smoke)
        if (activeMeshes.smokeInstanced && activeMeshes.smokeData) {
            const dummy = new THREE.Object3D();
            activeMeshes.smokeData.forEach((data, index) => {
                data.life += data.speed * speed;
                if (data.life > 1.0) {
                    data.life = 0;
                    data.ventIndex = Math.floor(Math.random() * activeMeshes.ventEmitters.length);
                }
                
                const emitterPos = activeMeshes.ventEmitters[data.ventIndex];
                const height = data.life * 30; // smoke rises up 30 units
                const spread = data.life * 5; // expands as it rises
                
                dummy.position.set(
                    emitterPos.x + data.offset.x * spread,
                    emitterPos.y + height,
                    emitterPos.z + data.offset.z * spread
                );
                
                // Scale grows as it rises
                const scale = 1.0 + data.life * 3;
                dummy.scale.set(scale, scale, scale);
                dummy.updateMatrix();
                
                activeMeshes.smokeInstanced.setMatrixAt(index, dummy.matrix);
            });
            activeMeshes.smokeInstanced.instanceMatrix.needsUpdate = true;
        }

        // 6. Crawler Animation (Wheels, Hydraulics, Sine wave syncing)
        if (activeMeshes.crawlerWheels) {
            activeMeshes.crawlerWheels.forEach(wheel => {
                wheel.rotation.z = -time * speed * 2; // Rolling forward
            });
        }
        
        if (activeMeshes.boomArm && activeMeshes.pistonShell && activeMeshes.pistonRod) {
            // Articulate boom arm using sine waves
            const sineWave = Math.sin(time * speed * 1.5);
            const angle = (sineWave * 0.5 + 0.5) * (Math.PI / 3); // 0 to 60 degrees
            activeMeshes.boomArm.rotation.z = angle;
            
            // Move hydraulic piston perfectly in sync with boom
            // Piston shell tracks angle roughly
            activeMeshes.pistonShell.rotation.z = angle * 0.8;
            // Rod extends out of the shell based on angle
            activeMeshes.pistonRod.position.y = 2 + (sineWave * 0.5 + 0.5) * 1.8;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSeafloorSpreading() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
