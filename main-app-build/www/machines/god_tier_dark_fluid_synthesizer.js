import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The God Tier Dark Fluid Synthesizer is a monumental feat of hyper-dimensional engineering, designed to safely extract, contain, and synthesize a stabilized form of Dark Fluid—a theoretical substance that unifies the attractive forces of Dark Matter with the repulsive, accelerated expansion properties of Dark Energy. Built upon a colossal mobile crawler chassis to prevent localized tectonic devastation during phase-shifts, the machine features a lathed singularity core, immense treaded locomotion assemblies, and an array of graviton repulsor shields. Operating at galactic energy scales, it utilizes quantum vacuum pumps and chronological synchronizers to maintain an artificial Chaplygin gas state, projecting torsion fields to prevent catastrophic topological breakdown of the local spacetime manifold.";

    // --- Custom Emissive & High-Tech Materials ---
    const darkEnergyGlow = new THREE.MeshStandardMaterial({
        color: 0x8a2be2, emissive: 0x8a2be2, emissiveIntensity: 3.5, transparent: true, opacity: 0.85, wireframe: false
    });

    const darkEnergyWireframe = new THREE.MeshStandardMaterial({
        color: 0xbf00ff, emissive: 0xbf00ff, emissiveIntensity: 4.0, wireframe: true, transparent: true, opacity: 0.9
    });

    const darkMatterGlow = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a, emissive: 0x110022, emissiveIntensity: 1.5, transparent: true, opacity: 0.9
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3.0, transparent: true, opacity: 0.7
    });

    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 0.98, opacity: 1, metalness: 0.1, roughness: 0, ior: 2.8, thickness: 8.0, specularIntensity: 1.0, specularColor: 0xffffff,
    });

    const alienAlloy = new THREE.MeshStandardMaterial({
        color: 0x15151e, metalness: 0.95, roughness: 0.15, envMapIntensity: 2.0, clearcoat: 0.5, clearcoatRoughness: 0.2
    });

    // --- Animation State Object ---
    const animObjects = {
        wheels: [],
        pistons: [],
        rings: [],
        shockwaves: [],
        lenses: [],
        fluidCores: [],
        gears: [],
        pumpArms: [],
        anchors: [],
        particles: [],
        repulsors: []
    };

    // --- Sub-component Generator Functions ---

    function createComplexWheel(wheelGroup, x, y, z) {
        const wGroup = new THREE.Group();
        
        // Rim base
        const rimGeo = new THREE.CylinderGeometry(15, 15, 12, 64);
        const rim = new THREE.Mesh(rimGeo, steel);
        rim.rotation.x = Math.PI / 2;
        wGroup.add(rim);

        // Complex Spokes
        const spokeCount = 16;
        for (let i = 0; i < spokeCount; i++) {
            const spokeGroup = new THREE.Group();
            const spokeBase = new THREE.CylinderGeometry(1.5, 2.5, 14, 16);
            const spokeMesh = new THREE.Mesh(spokeBase, darkSteel);
            spokeMesh.position.y = 7;
            spokeGroup.add(spokeMesh);

            const spokeDetailGeo = new THREE.BoxGeometry(2, 8, 4);
            const sdMesh = new THREE.Mesh(spokeDetailGeo, chrome);
            sdMesh.position.y = 8;
            spokeGroup.add(sdMesh);

            const hydraulicLineGeo = new THREE.CylinderGeometry(0.5, 0.5, 14, 8);
            const hlMesh = new THREE.Mesh(hydraulicLineGeo, copper);
            hlMesh.position.set(2, 7, 0);
            spokeGroup.add(hlMesh);

            spokeGroup.rotation.z = (i / spokeCount) * Math.PI * 2;
            wGroup.add(spokeGroup);
        }

        // Tire Main Body
        const tireGeo = new THREE.TorusGeometry(20, 7, 64, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.x = Math.PI / 2;
        wGroup.add(tire);

        // Aggressive Treads
        const treadCount = 180;
        const treadShape = new THREE.Shape();
        treadShape.moveTo(-3, -1);
        treadShape.lineTo(3, -1);
        treadShape.lineTo(4, 1.5);
        treadShape.lineTo(1, 2);
        treadShape.lineTo(-1, 2);
        treadShape.lineTo(-4, 1.5);
        treadShape.lineTo(-3, -1);
        
        const extrudeSettings = { depth: 14, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
        const treadGeo = new THREE.ExtrudeGeometry(treadShape, extrudeSettings);
        treadGeo.center();
        
        for (let i = 0; i < treadCount; i++) {
            const theta = (i / treadCount) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, rubber);
            tread.position.set(26.5 * Math.cos(theta), 26.5 * Math.sin(theta), 0);
            tread.rotation.z = theta + Math.PI / 2;
            tread.rotation.x = Math.PI / 2;
            wGroup.add(tread);
        }

        wGroup.position.set(x, y, z);
        animObjects.wheels.push(wGroup);
        wheelGroup.add(wGroup);
    }

    function createHydraulicPiston(pGroup, x, y, z, rotX, rotY, rotZ, scale, phaseOffset) {
        const hGroup = new THREE.Group();

        const cylinderOuter = new THREE.CylinderGeometry(4, 4, 30, 32);
        const outerMesh = new THREE.Mesh(cylinderOuter, darkSteel);
        outerMesh.position.y = 15;
        hGroup.add(outerMesh);

        const cylinderInner = new THREE.CylinderGeometry(2, 2, 30, 32);
        const innerMesh = new THREE.Mesh(cylinderInner, chrome);
        innerMesh.position.y = 35;
        hGroup.add(innerMesh);

        const mountGeo = new THREE.BoxGeometry(10, 6, 10);
        const mount = new THREE.Mesh(mountGeo, steel);
        hGroup.add(mount);
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4, 5, 0),
            new THREE.Vector3(8, 10, 0),
            new THREE.Vector3(8, 25, 0),
            new THREE.Vector3(3, 28, 0)
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 32, 0.8, 12, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        hGroup.add(tube);

        hGroup.position.set(x, y, z);
        hGroup.rotation.set(rotX, rotY, rotZ);
        hGroup.scale.set(scale, scale, scale);
        
        animObjects.pistons.push({ inner: innerMesh, offset: phaseOffset });
        pGroup.add(hGroup);
    }

    function createReactorCore(coreGroup) {
        const points = [];
        for (let i = 0; i <= 300; i++) {
            const y = i * 0.4;
            let x = 25;
            x += Math.sin(y * 0.8) * 4; 
            x += Math.cos(y * 3) * 1.5; 
            if (i > 220) x -= (i - 220) * 0.4; 
            if (i < 40) x += (40 - i) * 0.6;   
            if (i % 15 < 4) x -= 5; 
            points.push(new THREE.Vector2(x, y));
        }
        const coreGeo = new THREE.LatheGeometry(points, 256);
        const core = new THREE.Mesh(coreGeo, steel);
        
        const panelGeo = new THREE.CylinderGeometry(23, 23, 100, 128, 1, true, 0, Math.PI * 2);
        const panel = new THREE.Mesh(panelGeo, darkEnergyWireframe);
        panel.position.y = 60;
        
        coreGroup.add(core);
        coreGroup.add(panel);
        
        // Confinement Cage
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const barGeo = new THREE.CylinderGeometry(1.5, 1.5, 130, 16);
            const bar = new THREE.Mesh(barGeo, alienAlloy);
            bar.position.set(30 * Math.cos(angle), 60, 30 * Math.sin(angle));
            coreGroup.add(bar);
        }
    }

    function createCentrifugeRing(ringGroup, radius, tube, speedMulti, yPos, colorMat) {
        const rGroup = new THREE.Group();
        
        const ringGeo = new THREE.TorusGeometry(radius, tube, 64, 256);
        const ring = new THREE.Mesh(ringGeo, darkSteel);
        rGroup.add(ring);
        
        const lugCount = 120;
        const lugGeo = new THREE.BoxGeometry(tube * 1.5, tube * 0.3, tube * 2.5);
        for (let i = 0; i < lugCount; i++) {
            const theta = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, colorMat);
            lug.position.set(radius * Math.cos(theta), radius * Math.sin(theta), 0);
            lug.rotation.z = theta;
            rGroup.add(lug);
        }

        // Inner glowing track
        const trackGeo = new THREE.TorusGeometry(radius - tube * 0.9, tube * 0.2, 32, 128);
        const track = new THREE.Mesh(trackGeo, darkEnergyGlow);
        rGroup.add(track);

        rGroup.position.y = yPos;
        rGroup.rotation.x = Math.PI / 2;
        animObjects.rings.push({ mesh: rGroup, speed: speedMulti });
        ringGroup.add(rGroup);
    }

    function createQuantumPump(pGroup, x, y, z, rotY, phaseOffset) {
        const qGroup = new THREE.Group();
        
        const baseGeo = new THREE.CylinderGeometry(6, 10, 12, 16);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 6;
        qGroup.add(base);

        const jointGeo = new THREE.SphereGeometry(5, 32, 32);
        const joint = new THREE.Mesh(jointGeo, chrome);
        joint.position.y = 12;
        qGroup.add(joint);

        const armPivot = new THREE.Group();
        armPivot.position.y = 12;
        
        const armShape = new THREE.Shape();
        armShape.moveTo(-3, 0);
        armShape.lineTo(3, 0);
        armShape.lineTo(2, 40);
        armShape.lineTo(-2, 40);
        armShape.lineTo(-3, 0);
        const armGeo = new THREE.ExtrudeGeometry(armShape, { depth: 4, bevelEnabled: true });
        armGeo.center();
        const arm = new THREE.Mesh(armGeo, aluminum);
        arm.position.y = 20; 
        armPivot.add(arm);

        const chamberGeo = new THREE.TorusKnotGeometry(5, 1.5, 128, 32);
        const chamber = new THREE.Mesh(chamberGeo, darkEnergyGlow);
        chamber.position.y = 40;
        armPivot.add(chamber);

        qGroup.add(armPivot);
        qGroup.position.set(x, y, z);
        qGroup.rotation.y = rotY;
        
        animObjects.pumpArms.push({ pivot: armPivot, chamber: chamber, offset: phaseOffset });
        pGroup.add(qGroup);
    }

    function createGroundAnchors(anchorGroup, x, y, z, rotY, phase) {
        const aGroup = new THREE.Group();
        
        const houseGeo = new THREE.BoxGeometry(18, 25, 18);
        const house = new THREE.Mesh(houseGeo, darkSteel);
        house.position.y = 12.5;
        aGroup.add(house);
        
        const stakeGeo = new THREE.CylinderGeometry(0, 5, 40, 4);
        const stake = new THREE.Mesh(stakeGeo, chrome);
        stake.position.y = -10;
        stake.rotation.y = Math.PI / 4;
        
        aGroup.add(stake);
        aGroup.position.set(x, y, z);
        aGroup.rotation.y = rotY;
        
        animObjects.anchors.push({ mesh: stake, offset: phase });
        anchorGroup.add(aGroup);
    }

    function createIntakeValves(valveGroup) {
        for (let i = 0; i < 6; i++) {
            const vGroup = new THREE.Group();
            const funnelGeo = new THREE.CylinderGeometry(15, 4, 20, 8);
            const funnel = new THREE.Mesh(funnelGeo, steel);
            funnel.position.y = 10;
            vGroup.add(funnel);
            
            const blades = new THREE.Group();
            const bladeGeo = new THREE.BoxGeometry(26, 1.5, 2);
            for (let b = 0; b < 4; b++) {
                const blade = new THREE.Mesh(bladeGeo, chrome);
                blade.rotation.y = (b / 4) * Math.PI;
                blades.add(blade);
            }
            blades.position.y = 18;
            vGroup.add(blades);
            animObjects.gears.push({ mesh: blades, speed: 2.0 }); 

            const angle = (i / 6) * Math.PI * 2;
            vGroup.position.set(55 * Math.cos(angle), 30, 55 * Math.sin(angle));
            vGroup.rotation.x = Math.PI / 2;
            vGroup.rotation.y = angle;
            valveGroup.add(vGroup);
        }
    }

    function createExhaustStacks(stackGroup) {
        for (let i = 0; i < 4; i++) {
            const sGroup = new THREE.Group();
            const pipeGeo = new THREE.CylinderGeometry(6, 6, 80, 32);
            const pipe = new THREE.Mesh(pipeGeo, darkSteel);
            pipe.position.y = 40;
            sGroup.add(pipe);
            
            const ringGeo = new THREE.TorusGeometry(8, 1, 16, 32);
            for(let r=1; r<=4; r++) {
                const ring = new THREE.Mesh(ringGeo, copper);
                ring.position.y = 15 * r;
                ring.rotation.x = Math.PI/2;
                sGroup.add(ring);
            }
            
            for (let p = 0; p < 15; p++) {
                const partGeo = new THREE.SphereGeometry(3, 16, 16);
                const part = new THREE.Mesh(partGeo, darkMatterGlow);
                part.position.y = 80 + Math.random() * 30;
                sGroup.add(part);
                animObjects.particles.push({
                    mesh: part,
                    baseY: 80,
                    offset: Math.random() * Math.PI * 2,
                    speed: 1.5 + Math.random() * 2
                });
            }
            
            const pos = [ [-45, -60], [45, -60], [-45, 60], [45, 60] ];
            sGroup.position.set(pos[i][0], 80, pos[i][1]);
            sGroup.rotation.x = pos[i][1] < 0 ? -0.2 : 0.2;
            sGroup.rotation.z = pos[i][0] < 0 ? 0.2 : -0.2;
            stackGroup.add(sGroup);
        }
    }

    function createCabin(cabinGroup) {
        const cabin = new THREE.Group();
        
        const bodyShape = new THREE.Shape();
        bodyShape.moveTo(0,0);
        bodyShape.lineTo(35, 0);
        bodyShape.lineTo(40, 15);
        bodyShape.lineTo(25, 30);
        bodyShape.lineTo(-10, 30);
        bodyShape.lineTo(-15, 15);
        bodyShape.lineTo(0,0);
        const exSet = { depth: 30, bevelEnabled: true, bevelSize: 2, bevelThickness: 2 };
        const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, exSet);
        bodyGeo.center();
        const body = new THREE.Mesh(bodyGeo, alienAlloy);
        cabin.add(body);
        
        const winGeo = new THREE.BoxGeometry(42, 12, 32);
        const window = new THREE.Mesh(winGeo, tinted);
        window.position.set(2, 6, 0);
        cabin.add(window);
        
        const wheelGeo = new THREE.TorusGeometry(3, 0.8, 16, 32);
        const steering = new THREE.Mesh(wheelGeo, plastic);
        steering.position.set(16, 0, 0);
        steering.rotation.y = Math.PI / 2;
        cabin.add(steering);
        
        const panelGeo = new THREE.BoxGeometry(6, 6, 25);
        const panel = new THREE.Mesh(panelGeo, steel);
        panel.position.set(13, -4, 0);
        cabin.add(panel);

        const screenGeo = new THREE.PlaneGeometry(5, 3);
        const screenMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.5});
        for (let i = 0; i < 4; i++) {
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.set(12.9, -1, -9 + i * 6);
            screen.rotation.y = Math.PI / 2;
            cabin.add(screen);
        }

        cabin.position.set(0, 150, 80);
        cabinGroup.add(cabin);
    }

    function createPipingSystem(pipeGroup) {
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const r1 = 35;
            const r2 = 65;
            const r3 = 85;
            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(r1 * Math.cos(angle), 20, r1 * Math.sin(angle)),
                new THREE.Vector3(r2 * Math.cos(angle), 50, r2 * Math.sin(angle)),
                new THREE.Vector3(r3 * Math.cos(angle + 0.4), 90, r3 * Math.sin(angle + 0.4)),
                new THREE.Vector3(r2 * Math.cos(angle + 0.8), 130, r2 * Math.sin(angle + 0.8)),
                new THREE.Vector3(15 * Math.cos(angle + 1.2), 170, 15 * Math.sin(angle + 1.2))
            ]);
            const tubeGeo = new THREE.TubeGeometry(path, 128, 2.5, 16, false);
            const tube = new THREE.Mesh(tubeGeo, copper);
            pipeGroup.add(tube);
        }
    }

    function createFluidVessels(vesselGroup) {
        for (let i = 0; i < 8; i++) {
            const vGroup = new THREE.Group();
            const angle = (i / 8) * Math.PI * 2;
            
            const shellGeo = new THREE.SphereGeometry(14, 32, 32);
            const shell = new THREE.Mesh(shellGeo, lensMaterial);
            vGroup.add(shell);
            
            const fluidGeo = new THREE.TorusKnotGeometry(6, 2, 100, 16);
            const fluid = new THREE.Mesh(fluidGeo, darkMatterGlow);
            vGroup.add(fluid);
            animObjects.fluidCores.push({ mesh: fluid, offset: i });

            const baseGeo = new THREE.CylinderGeometry(10, 14, 10, 32);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            base.position.y = -15;
            vGroup.add(base);

            vGroup.position.set(70 * Math.cos(angle), 80, 70 * Math.sin(angle));
            vesselGroup.add(vGroup);
        }
    }

    function createLensingMatrix(lensGroup) {
        for (let i = 0; i < 12; i++) {
            const lGroup = new THREE.Group();
            const sphereGeo = new THREE.SphereGeometry(8, 64, 64);
            const sphere = new THREE.Mesh(sphereGeo, lensMaterial);
            lGroup.add(sphere);

            const ringGeo = new THREE.TorusGeometry(12, 0.5, 16, 64);
            const ring = new THREE.Mesh(ringGeo, chrome);
            lGroup.add(ring);
            
            animObjects.lenses.push({ group: lGroup, index: i });
            lensGroup.add(lGroup);
        }
    }

    function createRepulsorShields(shieldGroup) {
        for (let i = 0; i < 8; i++) {
            const sGroup = new THREE.Group();
            const pillarGeo = new THREE.CylinderGeometry(3, 5, 120, 16);
            const pillar = new THREE.Mesh(pillarGeo, alienAlloy);
            pillar.position.y = 60;
            sGroup.add(pillar);

            const emitterGeo = new THREE.IcosahedronGeometry(10, 1);
            const emitter = new THREE.Mesh(emitterGeo, darkEnergyGlow);
            emitter.position.y = 130;
            sGroup.add(emitter);
            
            animObjects.repulsors.push({ mesh: emitter, offset: i });

            const angle = (i / 8) * Math.PI * 2;
            sGroup.position.set(100 * Math.cos(angle), 0, 100 * Math.sin(angle));
            shieldGroup.add(sGroup);
        }
    }

    // --- Assembly of 18 Master Parts ---

    // Part 1: Crawler Chassis Platform
    const p1 = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-60, -100); chassisShape.lineTo(60, -100); chassisShape.lineTo(80, -60);
    chassisShape.lineTo(80, 60); chassisShape.lineTo(60, 100); chassisShape.lineTo(-60, 100);
    chassisShape.lineTo(-80, 60); chassisShape.lineTo(-80, -60); chassisShape.lineTo(-60, -100);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 20, bevelEnabled: true, bevelSize: 3, bevelThickness: 3 });
    chassisGeo.center();
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 15;
    p1.add(chassisMesh);
    group.add(p1);
    parts.push({
        name: 'Crawler Chassis Platform',
        description: 'The monumental foundational superstructure forged from hyper-dense alien alloy, providing structural integrity against extreme localized gravity gradients.',
        material: 'Dark Steel / Alien Alloy',
        function: 'Supports the mass of the synthesizer and distributes tectonic stress during traversal.',
        assemblyOrder: 1, connections: ['Locomotion Wheel Assemblies', 'Hydraulic Suspension System'],
        failureEffect: 'Structural collapse leading to immediate crushing of planetary crust.',
        cascadeFailures: ['Primary Reactor Core', 'Sub-etheric Anchors'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: -80, z: 0 }
    });

    // Part 2: Locomotion Wheel Assemblies
    const p2 = new THREE.Group();
    const wheelPositions = [
        [-90, 0, -80], [90, 0, -80], [-90, 0, -30], [90, 0, -30],
        [-90, 0, 30], [90, 0, 30], [-90, 0, 80], [90, 0, 80]
    ];
    wheelPositions.forEach(pos => createComplexWheel(p2, pos[0], pos[1], pos[2]));
    group.add(p2);
    parts.push({
        name: 'Locomotion Wheel Assemblies',
        description: 'Eight gargantuan, independently driven off-road crawler wheels with ultra-aggressive treads to ensure traction across highly warped topological terrain.',
        material: 'Rubber / Steel / Chrome / Copper',
        function: 'Provides omnidirectional mobility for the God Tier Synthesizer.',
        assemblyOrder: 2, connections: ['Crawler Chassis Platform', 'Hydraulic Suspension System'],
        failureEffect: 'Total loss of mobility; machine becomes stranded in localized gravity wells.',
        cascadeFailures: ['Sub-etheric Anchors'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -200, y: -20, z: 0 }
    });

    // Part 3: Hydraulic Suspension System
    const p3 = new THREE.Group();
    wheelPositions.forEach((pos, i) => {
        createHydraulicPiston(p3, pos[0] > 0 ? pos[0] - 20 : pos[0] + 20, 10, pos[2], 0, 0, pos[0] > 0 ? 0.2 : -0.2, 1, i);
    });
    group.add(p3);
    parts.push({
        name: 'Hydraulic Suspension System',
        description: 'Massive hydraulic compensators filled with exotic incompressible fluids, designed to absorb extreme shocks from dimensional tunneling recoil.',
        material: 'Dark Steel / Chrome / Rubber',
        function: 'Dampens recoil and maintains a level operating plane for the core.',
        assemblyOrder: 3, connections: ['Crawler Chassis Platform', 'Locomotion Wheel Assemblies'],
        failureEffect: 'Severe mechanical shearing across the chassis during operation.',
        cascadeFailures: ['Primary Reactor Core'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 200, y: 0, z: -100 }
    });

    // Part 4: Primary Reactor Core
    const p4 = new THREE.Group();
    p4.position.y = 25;
    createReactorCore(p4);
    group.add(p4);
    parts.push({
        name: 'Primary Reactor Core',
        description: 'The towering lathed singularity chamber at the heart of the machine. Its undulating geometry focuses tachyon beams to stabilize naked singularities.',
        material: 'Steel / Dark Energy Wireframe / Alien Alloy',
        function: 'Houses the dimensional breach that acts as the seed for Dark Fluid extraction.',
        assemblyOrder: 4, connections: ['Crawler Chassis Platform', 'Dark Matter Centrifuge Rings', 'Hyper-dimensional Cooling Pipes'],
        failureEffect: 'Runaway singularity expansion, resulting in immediate localized spaghettification.',
        cascadeFailures: ['Lensing Array Matrix', 'Fluid Containment Vessels'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // Part 5: Dark Matter Centrifuge Rings
    const p5 = new THREE.Group();
    createCentrifugeRing(p5, 55, 6, 1.5, 45, steel);
    createCentrifugeRing(p5, 75, 8, -1.2, 65, darkSteel);
    createCentrifugeRing(p5, 95, 10, 2.0, 85, chrome);
    group.add(p5);
    parts.push({
        name: 'Dark Matter Centrifuge Rings',
        description: 'Concentric counter-rotating tori equipped with thousands of magnetic confinement lugs. They spin at relativistic speeds to separate baryonic contaminants.',
        material: 'Steel / Dark Steel / Chrome / Dark Energy Glow',
        function: 'Purifies the extracted vacuum energy into weaponizable/usable Dark Fluid.',
        assemblyOrder: 5, connections: ['Primary Reactor Core'],
        failureEffect: 'Catastrophic centripetal disintegration sending shrapnel at relativistic velocities.',
        cascadeFailures: ['Graviton Repulsor Shields', 'Fluid Containment Vessels'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 300, z: 0 }
    });

    // Part 6: Lensing Array Matrix
    const p6 = new THREE.Group();
    createLensingMatrix(p6);
    group.add(p6);
    parts.push({
        name: 'Lensing Array Matrix',
        description: 'A constellation of hyper-refractive crystal spheres floating above the core. These manipulate optical and gravitational paths to mask the negative mass signatures.',
        material: 'Physical Transmission Lens / Chrome',
        function: 'Compensates for extreme spacetime curvature by generating inverse lensing fields.',
        assemblyOrder: 6, connections: ['Primary Reactor Core', 'Torsion Field Generators'],
        failureEffect: 'Unfiltered gravitational waves shatter all surrounding baryonic structures.',
        cascadeFailures: ['Observation Deck & Control Nexus'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // Part 7: Fluid Containment Vessels
    const p7 = new THREE.Group();
    createFluidVessels(p7);
    group.add(p7);
    parts.push({
        name: 'Fluid Containment Vessels',
        description: 'Spherical reinforced glass tanks housing swirling, agitated Dark Fluid in a metastable state. Glowing torus knots represent the internal fluid dynamics.',
        material: 'Physical Lens / Dark Matter Glow / Dark Steel',
        function: 'Temporarily stores the synthesized Dark Fluid before offloading.',
        assemblyOrder: 7, connections: ['Hyper-dimensional Cooling Pipes', 'Primary Reactor Core'],
        failureEffect: 'Fluid breach causes immediate local expansion of space, tearing objects apart.',
        cascadeFailures: ['Plasma Exhaust Manifolds'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -300, y: 100, z: 0 }
    });

    // Part 8: Quantum Vacuum Pumps
    const p8 = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        createQuantumPump(p8, 45 * Math.cos(angle), 25, 45 * Math.sin(angle), -angle, i);
    }
    group.add(p8);
    parts.push({
        name: 'Quantum Vacuum Pumps',
        description: 'Articulated robotic pumping arms that exploit the dynamical Casimir effect to physically draw virtual particles from the quantum vacuum.',
        material: 'Dark Steel / Chrome / Aluminum / Dark Energy Glow',
        function: 'Provides the raw quantum foam necessary for fluid synthesis.',
        assemblyOrder: 8, connections: ['Crawler Chassis Platform', 'Primary Reactor Core'],
        failureEffect: 'Vacuum collapse leading to total energy depletion in the sector.',
        cascadeFailures: ['Dark Matter Centrifuge Rings'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 300, y: 100, z: 300 }
    });

    // Part 9: Baryonic Matter Intake Valves
    const p9 = new THREE.Group();
    createIntakeValves(p9);
    group.add(p9);
    parts.push({
        name: 'Baryonic Matter Intake Valves',
        description: 'Hexagonal spinning funnels that harvest trace atmospheric and terrestrial matter to act as a catalyst for the dark fluid reaction.',
        material: 'Steel / Chrome',
        function: 'Catalyzes the dark fluid transition phase.',
        assemblyOrder: 9, connections: ['Primary Reactor Core'],
        failureEffect: 'Reaction stalls, causing the singularity to slowly evaporate via Hawking radiation.',
        cascadeFailures: ['Exhaust Stacks'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: -300 }
    });

    // Part 10: Graviton Repulsor Shields
    const p10 = new THREE.Group();
    createRepulsorShields(p10);
    group.add(p10);
    parts.push({
        name: 'Graviton Repulsor Shields',
        description: 'Eight monolithic pillars arrayed around the perimeter, emitting intense localized anti-gravity fields to protect the machine from its own gravitational output.',
        material: 'Alien Alloy / Dark Energy Glow',
        function: 'Maintains structural cohesion of the synthesizer during max output.',
        assemblyOrder: 10, connections: ['Crawler Chassis Platform'],
        failureEffect: 'The machine crushes itself under the weight of an artificial black hole.',
        cascadeFailures: ['Crawler Chassis Platform', 'Primary Reactor Core'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: 400 }
    });

    // Part 11: Torsion Field Generators
    const p11 = new THREE.Group();
    for(let i=0; i<6; i++) {
        const tgGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 15, 16), alienAlloy);
        base.position.y = 7.5;
        tgGroup.add(base);
        for(let r=1; r<=3; r++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(3 + r*2.5, 0.8, 16, 64), copper);
            ring.position.y = 15 + r*4;
            ring.rotation.x = Math.PI/2;
            tgGroup.add(ring);
            animObjects.rings.push({ mesh: ring, speed: 3.0 });
        }
        const angle = (i/6)*Math.PI*2;
        tgGroup.position.set(40*Math.cos(angle), 130, 40*Math.sin(angle));
        tgGroup.lookAt(0, 150, 0);
        p11.add(tgGroup);
    }
    group.add(p11);
    parts.push({
        name: 'Torsion Field Generators',
        description: 'Upper-deck arrays consisting of stacked copper tori. They induce a localized non-zero Cartan torsion, allowing for FTL dimensional phase shifting.',
        material: 'Alien Alloy / Copper',
        function: 'Prevents topological tearing of the spacetime fabric.',
        assemblyOrder: 11, connections: ['Primary Reactor Core', 'Lensing Array Matrix'],
        failureEffect: 'Spontaneous generation of un-traversable wormholes.',
        cascadeFailures: ['Lensing Array Matrix'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 250, z: -250 }
    });

    // Part 12: Hyper-dimensional Cooling Pipes
    const p12 = new THREE.Group();
    createPipingSystem(p12);
    group.add(p12);
    parts.push({
        name: 'Hyper-dimensional Cooling Pipes',
        description: 'An intricate network of copper and alien-alloy tubes that circulate liquid helium and exotic particles to bleed off the immense heat of dimensional friction.',
        material: 'Copper',
        function: 'Thermal regulation of the singularity core and fluid vessels.',
        assemblyOrder: 12, connections: ['Primary Reactor Core', 'Fluid Containment Vessels'],
        failureEffect: 'Core meltdown resulting in a localized false-vacuum collapse.',
        cascadeFailures: ['Primary Reactor Core', 'Exotic Mass Heat Sinks'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -200, y: 200, z: 200 }
    });

    // Part 13: Plasma Exhaust Manifolds
    const p13 = new THREE.Group();
    for(let i=0; i<8; i++) {
        const mGroup = new THREE.Group();
        const mGeo = new THREE.BoxGeometry(8, 20, 8);
        const mMesh = new THREE.Mesh(mGeo, darkSteel);
        mGroup.add(mMesh);
        const glowGeo = new THREE.PlaneGeometry(6, 18);
        const glow = new THREE.Mesh(glowGeo, plasmaMaterial);
        glow.position.z = 4.1;
        mGroup.add(glow);
        const angle = (i/8)*Math.PI*2 + 0.2;
        mGroup.position.set(28*Math.cos(angle), 40, 28*Math.sin(angle));
        mGroup.rotation.y = -angle;
        p13.add(mGroup);
    }
    group.add(p13);
    parts.push({
        name: 'Plasma Exhaust Manifolds',
        description: 'Heavy duty vents attached to the core base that forcefully expel superheated plasma and excess baryonic radiation.',
        material: 'Dark Steel / Plasma Emissive',
        function: 'Vents lethal radiation away from the crawler chassis.',
        assemblyOrder: 13, connections: ['Primary Reactor Core'],
        failureEffect: 'Radiation flood melting the lower chassis and wheel assemblies.',
        cascadeFailures: ['Locomotion Wheel Assemblies'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 200, y: 50, z: 200 }
    });

    // Part 14: Chrono-sync Regulators
    const p14 = new THREE.Group();
    for(let i=0; i<4; i++) {
        const gGeo = new THREE.CylinderGeometry(12, 12, 4, 16);
        const gear = new THREE.Mesh(gGeo, chrome);
        
        for(let t=0; t<8; t++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), chrome);
            const ta = (t/8)*Math.PI*2;
            tooth.position.set(13*Math.cos(ta), 0, 13*Math.sin(ta));
            tooth.rotation.y = -ta;
            gear.add(tooth);
        }
        gear.position.set(0, 110 + i*6, 0);
        animObjects.gears.push({ mesh: gear, speed: i%2===0 ? 1 : -1 });
        p14.add(gear);
    }
    group.add(p14);
    parts.push({
        name: 'Chrono-sync Regulators',
        description: 'Interlocking temporal gears that counteract the Lense-Thirring frame-dragging effect caused by the spinning singularity.',
        material: 'Chrome',
        function: 'Maintains chronological stability within the machine’s localized reference frame.',
        assemblyOrder: 14, connections: ['Primary Reactor Core', 'Torsion Field Generators'],
        failureEffect: 'Severe time dilation; the front of the machine ages millions of years instantly.',
        cascadeFailures: ['Observation Deck & Control Nexus'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 350, z: 150 }
    });

    // Part 15: Exotic Mass Heat Sinks
    const p15 = new THREE.Group();
    for(let i=0; i<360; i+=10) {
        const angle = i * Math.PI / 180;
        const sinkGeo = new THREE.BoxGeometry(2, 40, 6);
        const sink = new THREE.Mesh(sinkGeo, darkSteel);
        sink.position.set(24 * Math.cos(angle), 140, 24 * Math.sin(angle));
        sink.rotation.y = -angle;
        p15.add(sink);
    }
    group.add(p15);
    parts.push({
        name: 'Exotic Mass Heat Sinks',
        description: 'Hundreds of densely packed finned extrusions near the top of the core. They bleed off excess negative energy into the surrounding vacuum.',
        material: 'Dark Steel',
        function: 'Prevents the upper arrays from freezing due to extreme endothermic dark energy reactions.',
        assemblyOrder: 15, connections: ['Primary Reactor Core'],
        failureEffect: 'Upper assembly shatters from absolute zero thermal shock.',
        cascadeFailures: ['Lensing Array Matrix'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 450, z: 0 }
    });

    // Part 16: Sub-etheric Anchors
    const p16 = new THREE.Group();
    const anchorPositions = [ [-75, 0, -75], [75, 0, -75], [-75, 0, 75], [75, 0, 75] ];
    anchorPositions.forEach((pos, i) => createGroundAnchors(p16, pos[0], pos[1], pos[2], i*Math.PI/2, i));
    group.add(p16);
    parts.push({
        name: 'Sub-etheric Anchors',
        description: 'Massive pneumatic stakes that dynamically drive themselves deep into the planetary crust to anchor the machine against violent dimensional recoil.',
        material: 'Dark Steel / Chrome',
        function: 'Prevents the synthesizer from being launched into orbit during peak synthesis.',
        assemblyOrder: 16, connections: ['Crawler Chassis Platform'],
        failureEffect: 'Machine achieves unintentional and catastrophic atmospheric exit.',
        cascadeFailures: ['Locomotion Wheel Assemblies', 'Crawler Chassis Platform'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: -150, z: 200 }
    });

    // Part 17: Exhaust Stacks
    const p17 = new THREE.Group();
    createExhaustStacks(p17);
    group.add(p17);
    parts.push({
        name: 'Exhaust Stacks',
        description: 'Towering cylindrical chimneys that vent corrupted baryonic particles and dark matter soot away from the main arrays.',
        material: 'Dark Steel / Copper / Dark Matter Emissive',
        function: 'Ejects hazardous waste products generated during synthesis.',
        assemblyOrder: 17, connections: ['Crawler Chassis Platform'],
        failureEffect: 'Internal fouling of the singularity leading to immediate engine death.',
        cascadeFailures: ['Primary Reactor Core'],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -300, y: 150, z: -300 }
    });

    // Part 18: Observation Deck & Control Nexus
    const p18 = new THREE.Group();
    createCabin(p18);
    group.add(p18);
    parts.push({
        name: 'Observation Deck & Control Nexus',
        description: 'A heavily shielded, tinted-glass command cabin suspended high above the chassis. Contains advanced holographic inputs for manual synthesis overrides.',
        material: 'Alien Alloy / Tinted Glass / Plastic / Steel / Emissive Screens',
        function: 'Provides a safe haven for operators to oversee galactic-scale physics operations.',
        assemblyOrder: 18, connections: ['Crawler Chassis Platform', 'Lensing Array Matrix'],
        failureEffect: 'Immediate crew vaporization due to tachyon bombardment.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 500, z: 300 }
    });

    // --- Extreme Cosmology Quiz ---
    const quizQuestions = [
        {
            question: "In the context of the Dark Fluid theory, which posits a unified phenomenological framework for dark matter and dark energy, how does the Chaplygin gas equation of state (p = -A/ρ) resolve the transition from a matter-dominated epoch to an accelerated expansion?",
            options: [
                "It acts as pressureless dust at high densities and a cosmological constant at low densities.",
                "It introduces a scalar field that strictly couples to baryonic matter only.",
                "It demands a constant deceleration parameter across all scale factors.",
                "It negates the need for a metric tensor in general relativity."
            ],
            correctAnswer: "It acts as pressureless dust at high densities and a cosmological constant at low densities."
        },
        {
            question: "If the Dark Fluid Synthesizer's torsion fields induce a localized non-zero Cartan torsion in spacetime, how does this affect the geodesic deviation equation for fermionic particle beams?",
            options: [
                "It modifies the Riemann curvature tensor to include an antisymmetric part, altering spin precession.",
                "It strictly zeroes out the Weyl tensor, leaving only Ricci scalar effects.",
                "It causes all geodesics to become closed timelike curves instantly.",
                "It decouples the spin-connection from the metric entirely."
            ],
            correctAnswer: "It modifies the Riemann curvature tensor to include an antisymmetric part, altering spin precession."
        },
        {
            question: "During the extraction of repulsive dark energy, the Lensing Array compensates for a negative effective mass. According to the generalized Einstein field equations with a negative stress-energy tensor trace, what topological anomaly must the array project?",
            options: [
                "A repulsive Einstein-Rosen bridge (traversable wormhole) with exotic matter.",
                "A standard Schwarzschild event horizon.",
                "A Kerr-Newman naked singularity.",
                "A Minkowski flat space bubble."
            ],
            correctAnswer: "A repulsive Einstein-Rosen bridge (traversable wormhole) with exotic matter."
        },
        {
            question: "The Quantum Pumps operate on the principle of the dynamical Casimir effect. To synthesize dark fluid, they oscillate boundaries at relativistic speeds. What is the primary output of this specific quantum vacuum excitation?",
            options: [
                "Pairs of real photons and localized negative energy density regions.",
                "A Bose-Einstein condensate of tachyons.",
                "Complete suppression of zero-point energy.",
                "Spontaneous symmetry breaking of the strong nuclear force."
            ],
            correctAnswer: "Pairs of real photons and localized negative energy density regions."
        },
        {
            question: "When aligning the Chrono-sync Regulators, a temporal phase shift is required to counteract the frame-dragging (Lense-Thirring effect) of the rotating singularity. If the singularity has angular momentum J and mass M, what is the induced precession angular velocity (Ω) at the equator of radius r?",
            options: [
                "Ω = 2GJ / (c^2 r^3)",
                "Ω = GM / (c^2 r^2)",
                "Ω = 4GJ / (c^3 r^4)",
                "Ω = J / (GM r)"
            ],
            correctAnswer: "Ω = 2GJ / (c^2 r^3)"
        }
    ];

    // --- Extreme Animation Logic ---
    const animate = (time, speed) => {
        const t = time * speed;
        
        // Massive wheels rolling
        animObjects.wheels.forEach(w => {
            w.rotation.x += 0.05 * speed;
        });

        // Hydraulic pistons compensating for rough terrain
        animObjects.pistons.forEach(p => {
            p.inner.position.y = 35 + Math.sin(t * 3 + p.offset) * 8;
        });

        // Centrifuge Rings spinning at massive speeds
        animObjects.rings.forEach(r => {
            r.mesh.rotation.z += 0.1 * r.speed * speed;
        });

        // Lensing Array complex orbital patterns
        animObjects.lenses.forEach(l => {
            const angle = t * 0.5 + l.index;
            const rad = 60 + Math.sin(t * 2 + l.index) * 20;
            l.group.position.set(rad * Math.cos(angle), 180 + Math.sin(t*3)*15, rad * Math.sin(angle));
            l.group.rotation.x += 0.02 * speed;
            l.group.rotation.y += 0.03 * speed;
        });

        // Fluid cores pulsating and swirling
        animObjects.fluidCores.forEach(f => {
            f.mesh.rotation.y += 0.08 * speed;
            f.mesh.rotation.x = Math.sin(t + f.offset) * 0.5;
            f.mesh.scale.setScalar(1 + Math.sin(t * 5 + f.offset) * 0.1);
        });

        // Vacuum Pumps driving back and forth
        animObjects.pumpArms.forEach(p => {
            p.pivot.rotation.x = Math.sin(t * 4 + p.offset) * 0.6;
            p.chamber.rotation.y += 0.2 * speed;
            p.chamber.scale.setScalar(1 + Math.cos(t * 8 + p.offset) * 0.2);
        });

        // Chrono-sync and intake gears
        animObjects.gears.forEach(g => {
            g.mesh.rotation.y += 0.05 * g.speed * speed;
        });

        // Ground anchors hammering
        animObjects.anchors.forEach(a => {
            a.mesh.position.y = -10 + Math.abs(Math.sin(t * 8 + a.offset)) * 20;
        });

        // Particle Exhaust Simulation
        animObjects.particles.forEach(p => {
            p.mesh.position.y += p.speed * speed;
            p.mesh.position.x += Math.sin(t * 5 + p.offset) * 1.5;
            p.mesh.position.z += Math.cos(t * 4 + p.offset) * 1.5;
            const life = 1 - ((p.mesh.position.y - p.baseY) / 60);
            p.mesh.scale.setScalar(Math.max(0.01, life * 1.5));
            if (p.mesh.position.y > p.baseY + 60) {
                p.mesh.position.y = p.baseY;
                p.mesh.position.x = 0;
                p.mesh.position.z = 0;
                p.mesh.scale.setScalar(1.5);
            }
        });

        // Graviton Repulsors pulsing energy
        animObjects.repulsors.forEach(r => {
            r.mesh.rotation.y += 0.04 * speed;
            r.mesh.scale.setScalar(1 + Math.sin(t * 10 + r.offset) * 0.3);
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
