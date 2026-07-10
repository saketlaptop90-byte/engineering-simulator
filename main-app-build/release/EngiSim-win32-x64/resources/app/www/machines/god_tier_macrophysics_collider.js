import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * MACROPHYSICS STELLAR COLLIDER (GOD TIER)
 * An immensely complex, hyper-realistic, galaxy-spanning particle accelerator.
 * It is designed to collide entire stars to form exotic singularities.
 * Features ultra-detailed components, mobile service crawlers, observation decks,
 * magnetic flux arrays, and a fully synchronized procedural animation loop.
 */
export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const starMaterialA = new THREE.MeshStandardMaterial({ 
        color: 0xff4400, 
        emissive: 0xff2200, 
        emissiveIntensity: 5.0, 
        wireframe: false, 
        roughness: 0.1, 
        metalness: 0.8
    });

    const starMaterialB = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0044ff, 
        emissiveIntensity: 5.0, 
        wireframe: false, 
        roughness: 0.1, 
        metalness: 0.8
    });

    const energyFieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, 
        emissive: 0x00aaaa, 
        emissiveIntensity: 2.0, 
        transmission: 0.9, 
        opacity: 0.4, 
        transparent: true, 
        roughness: 0.1,
        side: THREE.DoubleSide
    });

    const singularityMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, 
        emissive: 0x110022, 
        emissiveIntensity: 0.5, 
        roughness: 0.0, 
        metalness: 1.0
    });

    const shockwaveMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, 
        emissive: 0xffffff, 
        emissiveIntensity: 10.0, 
        transparent: true, 
        opacity: 0.0, 
        side: THREE.DoubleSide
    });

    const neonMaterialBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 5.0
    });

    const neonMaterialRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, 
        emissive: 0x00ff00, 
        emissiveIntensity: 2.0
    });

    const parts = [];
    const animatableMeshes = {
        crawlers: [],
        tires: [],
        booms: [],
        pistons: [],
        gears: [],
        neonLights: [],
        magneticRings: [],
        stars: [],
        singularity: null,
        shockwave: null,
        accretionDisk: null
    };

    // ==========================================
    // PROCEDURAL GEOMETRY GENERATORS
    // ==========================================

    /**
     * Generates a hyper-realistic tire with aggressive treads and detailed rims.
     */
    function createHyperRealisticTire() {
        const tireGroup = new THREE.Group();
        
        // Torus base for the tire
        const tireBase = new THREE.Mesh(new THREE.TorusGeometry(30, 10, 32, 100), rubber);
        tireGroup.add(tireBase);
        
        // Aggressive off-road treads (hundreds of lugs)
        const numLugs = 150;
        const lugGeo = new THREE.BoxGeometry(16, 5, 8);
        for(let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Staggered offset for realistic tread pattern
            const offset = (i % 2 === 0) ? 4 : -4;
            lug.position.set(Math.cos(angle) * 40, offset, Math.sin(angle) * 40);
            lug.lookAt(new THREE.Vector3(0, offset, 0));
            lug.rotation.y += Math.PI / 2;
            tireGroup.add(lug);
        }
        
        // Complex CylinderGeometry rims
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 19, 64), chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        // Detailed spoke array
        const numSpokes = 24;
        for(let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.5, 22, 16), steel);
            spoke.position.set(Math.cos(angle) * 11, 0, Math.sin(angle) * 11);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = -angle;
            tireGroup.add(spoke);
        }

        // Hubcap
        const hubcap = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 21, 32), darkSteel);
        hubcap.rotation.x = Math.PI / 2;
        tireGroup.add(hubcap);

        // Lug nuts
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const nut = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 22, 6), steel);
            nut.position.set(Math.cos(angle) * 4, 0, Math.sin(angle) * 4);
            nut.rotation.x = Math.PI / 2;
            tireGroup.add(nut);
        }

        return tireGroup;
    }

    /**
     * Generates a detailed hydraulic piston.
     */
    function createHydraulicPiston(length, radius) {
        const group = new THREE.Group();
        
        // Outer casing
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length * 0.6, 32), darkSteel);
        outer.position.y = length * 0.3;
        
        // Inner chrome rod
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 0.6, 32), chrome);
        inner.position.y = length * 0.7;
        
        // Connector joints
        const joint1 = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.5, 32, 32), steel);
        joint1.position.y = 0;
        
        const joint2 = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.2, 32, 32), steel);
        joint2.position.y = length;

        // Hydraulic fluid lines
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, length * 0.1, 0),
            new THREE.Vector3(radius * 2, length * 0.3, 0),
            new THREE.Vector3(radius * 1.5, length * 0.5, 0)
        ]);
        const hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, radius * 0.2, 8, false), rubber);

        group.add(outer);
        group.add(inner);
        group.add(joint1);
        group.add(joint2);
        group.add(hose);
        
        // Expose inner for animation
        group.userData.inner = inner;
        group.userData.joint2 = joint2;
        group.userData.baseLength = length;
        
        return group;
    }

    /**
     * Generates a hyper-detailed operator cabin.
     */
    function createDetailedCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main cabin body with extruded panels
        const bodyGeo = new THREE.BoxGeometry(40, 30, 40);
        const body = new THREE.Mesh(bodyGeo, darkSteel);
        cabinGroup.add(body);
        
        // Tinted Windows
        const windowGeo = new THREE.PlaneGeometry(38, 15);
        const frontWindow = new THREE.Mesh(windowGeo, tinted);
        frontWindow.position.set(0, 5, 20.1);
        cabinGroup.add(frontWindow);
        
        const sideWindowL = new THREE.Mesh(windowGeo, tinted);
        sideWindowL.rotation.y = -Math.PI / 2;
        sideWindowL.position.set(-20.1, 5, 0);
        cabinGroup.add(sideWindowL);
        
        const sideWindowR = new THREE.Mesh(windowGeo, tinted);
        sideWindowR.rotation.y = Math.PI / 2;
        sideWindowR.position.set(20.1, 5, 0);
        cabinGroup.add(sideWindowR);
        
        // Steering wheel
        const wheelGroup = new THREE.Group();
        const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 16, 64), plastic);
        const wheelCol = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), steel);
        wheelCol.rotation.x = Math.PI / 2;
        wheelCol.position.z = -2.5;
        wheelGroup.add(wheelRim);
        wheelGroup.add(wheelCol);
        wheelGroup.position.set(-10, -5, 10);
        wheelGroup.rotation.x = -Math.PI / 4;
        cabinGroup.add(wheelGroup);
        
        // Dual Joysticks
        for (let i = 0; i < 2; i++) {
            const joystick = new THREE.Group();
            const base = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), darkSteel);
            const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6), steel);
            stick.position.y = 3;
            const knob = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), plastic);
            knob.position.y = 6;
            joystick.add(base);
            joystick.add(stick);
            joystick.add(knob);
            joystick.position.set(10 + (i * 5), -10, 10);
            cabinGroup.add(joystick);
        }
        
        // Control Panels with glowing screens
        const panel = new THREE.Mesh(new THREE.BoxGeometry(38, 10, 5), plastic);
        panel.position.set(0, -10, 15);
        panel.rotation.x = -Math.PI / 6;
        cabinGroup.add(panel);
        
        for (let i = 0; i < 5; i++) {
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), screenMaterial);
            screen.position.set(-14 + (i * 7), -9, 17.6);
            screen.rotation.x = -Math.PI / 6;
            cabinGroup.add(screen);
        }
        
        // Dual Exhaust stacks
        for (let i = 0; i < 2; i++) {
            const stack = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20), chrome);
            stack.position.set(-15 + (i * 30), 25, -15);
            cabinGroup.add(stack);
        }
        
        // External Ladders
        const ladderGroup = new THREE.Group();
        const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30), steel);
        rail1.position.set(-2, 0, 0);
        const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30), steel);
        rail2.position.set(2, 0, 0);
        ladderGroup.add(rail1);
        ladderGroup.add(rail2);
        for(let j = 0; j < 10; j++) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4), steel);
            rung.rotation.z = Math.PI / 2;
            rung.position.y = -13 + (j * 3);
            ladderGroup.add(rung);
        }
        ladderGroup.position.set(-21, -5, -10);
        cabinGroup.add(ladderGroup);
        
        // Front Grille
        const grille = new THREE.Group();
        for(let k = 0; k < 15; k++) {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 1), chrome);
            bar.position.x = -14 + (k * 2);
            grille.add(bar);
        }
        grille.position.set(0, 0, -20.5);
        cabinGroup.add(grille);
        
        // Side mirrors
        for(let i = 0; i < 2; i++) {
            const mirrorGroup = new THREE.Group();
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5), steel);
            arm.rotation.z = Math.PI / 2;
            arm.position.x = i === 0 ? -2.5 : 2.5;
            const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 3), chrome);
            glassMesh.position.x = i === 0 ? -5 : 5;
            mirrorGroup.add(arm);
            mirrorGroup.add(glassMesh);
            mirrorGroup.position.set(i === 0 ? -20 : 20, 5, 15);
            cabinGroup.add(mirrorGroup);
        }

        // Add rivets
        for (let r = 0; r < 50; r++) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), darkSteel);
            rivet.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) > 0 ? 20 : -20
            );
            cabinGroup.add(rivet);
        }
        
        return cabinGroup;
    }

    /**
     * Generates a massive maintenance crawler integrating tires, cabins, booms, and pistons.
     */
    function createMaintenanceCrawler() {
        const crawler = new THREE.Group();
        
        // Crawler Base Chassis
        const baseGeo = new THREE.BoxGeometry(60, 20, 120);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        crawler.add(base);
        
        // 6-Wheel Drive System
        const positions = [
            [-35, -10, 45],
            [35, -10, 45],
            [-35, -10, 0],
            [35, -10, 0],
            [-35, -10, -45],
            [35, -10, -45]
        ];
        positions.forEach((pos, idx) => {
            const tire = createHyperRealisticTire();
            tire.position.set(pos[0], pos[1], pos[2]);
            crawler.add(tire);
            animatableMeshes.tires.push({ mesh: tire, side: pos[0] > 0 ? 1 : -1 });
        });
        
        // Operator Cabin
        const cabin = createDetailedCabin();
        cabin.position.set(0, 25, 30);
        crawler.add(cabin);
        
        // Rotating Crane Base
        const craneBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 10, 32), chrome);
        craneBase.position.set(0, 15, -30);
        crawler.add(craneBase);
        
        // Articulated Boom 1
        const boom1Group = new THREE.Group();
        boom1Group.position.set(0, 20, -30);
        
        const boom1Mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 80, 10), plastic);
        boom1Mesh.position.y = 40;
        boom1Group.add(boom1Mesh);
        
        // Piston for Boom 1
        const piston1 = createHydraulicPiston(60, 3);
        piston1.position.set(10, 0, 0);
        piston1.rotation.z = -Math.PI / 8;
        boom1Group.add(piston1);
        animatableMeshes.pistons.push(piston1);
        
        // Articulated Boom 2
        const boom2Group = new THREE.Group();
        boom2Group.position.set(0, 80, 0);
        
        const boom2Mesh = new THREE.Mesh(new THREE.BoxGeometry(8, 60, 8), darkSteel);
        boom2Mesh.position.y = 30;
        boom2Group.add(boom2Mesh);
        
        // Piston for Boom 2
        const piston2 = createHydraulicPiston(40, 2.5);
        piston2.position.set(-8, 0, 0);
        piston2.rotation.z = Math.PI / 6;
        boom2Group.add(piston2);
        animatableMeshes.pistons.push(piston2);
        
        boom1Group.add(boom2Group);
        crawler.add(boom1Group);
        
        animatableMeshes.booms.push({ b1: boom1Group, b2: boom2Group });
        animatableMeshes.crawlers.push(crawler);
        
        return crawler;
    }

    /**
     * Generates a massive observation deck for observing the collision.
     */
    function createObservationDeck() {
        const deckGroup = new THREE.Group();
        
        // Central Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(150, 200, 50, 64), darkSteel);
        deckGroup.add(hub);
        
        // Observation Windows (Lathe geometry for complex curves)
        const points = [];
        for (let i = 0; i <= 20; i++) {
            points.push(new THREE.Vector2(151 + Math.sin(i * 0.15) * 20, (i - 10) * 2.5));
        }
        const windowGeo = new THREE.LatheGeometry(points, 64);
        const windows = new THREE.Mesh(windowGeo, tinted);
        deckGroup.add(windows);
        
        // Sensor Antennas Array
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const antenna = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.5, 150, 16), steel);
            antenna.position.set(Math.cos(angle) * 160, 75, Math.sin(angle) * 160);
            antenna.rotation.x = Math.PI / 4;
            antenna.rotation.y = -angle;
            deckGroup.add(antenna);
            
            // Radar Dishes
            if (i % 2 === 0) {
                const dish = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32, 0, Math.PI, 0, Math.PI), aluminum);
                dish.position.set(Math.cos(angle) * 220, -25, Math.sin(angle) * 220);
                dish.lookAt(new THREE.Vector3(0, 0, 0));
                deckGroup.add(dish);
            }
        }
        
        // Giant Spoke Connections
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(40, 20, 500), darkSteel);
            spoke.position.set(Math.cos(angle) * 250, 0, Math.sin(angle) * 250);
            spoke.rotation.y = -angle;
            deckGroup.add(spoke);
            
            // Outer Stabilization Ring
            const ring = new THREE.Mesh(new THREE.TorusGeometry(450, 20, 32, 128), copper);
            deckGroup.add(ring);
        }

        // Add Neon Lights to the deck
        for (let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const light = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), neonMaterialBlue);
            light.position.set(Math.cos(angle) * 450, 25, Math.sin(angle) * 450);
            deckGroup.add(light);
            animatableMeshes.neonLights.push(light);
        }

        return deckGroup;
    }

    /**
     * Procedurally generates a complex truss network structure for containment tubes.
     */
    function createComplexTruss(length, radius, segments, material) {
        const trussGroup = new THREE.Group();
        const sides = 16;
        
        // Main longitudinal beams
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, length, 16), material);
            beam.rotation.x = Math.PI / 2;
            beam.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            trussGroup.add(beam);
        }
        
        // Cross braces and diagonal supports
        const segmentLength = length / segments;
        for (let s = 0; s < segments; s++) {
            const zOffset = -length / 2 + s * segmentLength + segmentLength / 2;
            for (let i = 0; i < sides; i++) {
                const angle1 = (i / sides) * Math.PI * 2;
                const angle2 = ((i + 1) % sides) / sides * Math.PI * 2;
                
                const p1 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, zOffset - segmentLength/2);
                const p2 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, zOffset + segmentLength/2);
                
                const dist = p1.distanceTo(p2);
                const brace = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.03, radius * 0.03, dist, 8), material);
                brace.position.copy(p1).lerp(p2, 0.5);
                brace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
                trussGroup.add(brace);
                
                // Opposite diagonal
                const p3 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, zOffset - segmentLength/2);
                const p4 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, zOffset + segmentLength/2);
                
                const brace2 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.03, radius * 0.03, p3.distanceTo(p4), 8), material);
                brace2.position.copy(p3).lerp(p4, 0.5);
                brace2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p4.clone().sub(p3).normalize());
                trussGroup.add(brace2);
                
                // Transverse structural ring
                const hBrace = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.04, radius * 0.04, p1.distanceTo(p3), 8), material);
                hBrace.position.copy(p1).lerp(p3, 0.5);
                hBrace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p3.clone().sub(p1).normalize());
                trussGroup.add(hBrace);
            }
        }
        return trussGroup;
    }

    /**
     * Generates magnetic flux rings that accelerate the stars.
     */
    function createMagneticRings(count, spacing, radius) {
        const ringsGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const zPos = (i - count / 2) * spacing;
            const ring = new THREE.Group();
            
            const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.1, 32, 100), copper);
            ring.add(torus);
            
            // Energy field inside ring
            const field = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, radius * 0.05, 64), energyFieldMaterial);
            field.rotation.x = Math.PI / 2;
            ring.add(field);
            
            // External stabilizing gears
            for(let g = 0; g < 4; g++) {
                const angle = (g / 4) * Math.PI * 2;
                const gear = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, radius * 0.15, 16), chrome);
                gear.position.set(Math.cos(angle) * (radius * 1.1), Math.sin(angle) * (radius * 1.1), 0);
                gear.rotation.x = Math.PI / 2;
                ring.add(gear);
                animatableMeshes.gears.push(gear);
            }
            
            ring.position.z = zPos;
            ringsGroup.add(ring);
            animatableMeshes.magneticRings.push(ring);
        }
        return ringsGroup;
    }

    /**
     * Extensively detailed central collision chamber geometry
     */
    function createCentralChamber() {
        const chamberGroup = new THREE.Group();
        
        // Massive spherical lattice
        const lattice = new THREE.Mesh(new THREE.IcosahedronGeometry(800, 3), darkSteel);
        lattice.material.wireframe = true;
        chamberGroup.add(lattice);

        // Solid inner casing with openings
        const casing = new THREE.Mesh(new THREE.SphereGeometry(780, 64, 64), steel);
        casing.material.transparent = true;
        casing.material.opacity = 0.8;
        chamberGroup.add(casing);

        // Huge event horizon baffles (Lathed)
        const bafflePoints = [];
        for (let i = 0; i < 60; i++) {
            bafflePoints.push(new THREE.Vector2(500 + Math.sin(i * 0.2) * 50, (i - 30) * 15));
        }
        const baffleGeo = new THREE.LatheGeometry(bafflePoints, 128);
        const baffleMat = new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.9, roughness: 0.1});
        const baffleTop = new THREE.Mesh(baffleGeo, baffleMat);
        baffleTop.rotation.x = Math.PI / 2;
        chamberGroup.add(baffleTop);
        
        const baffleBottom = new THREE.Mesh(baffleGeo, baffleMat);
        baffleBottom.rotation.x = -Math.PI / 2;
        chamberGroup.add(baffleBottom);

        // Superluminal Data Transmitters
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const transmitter = new THREE.Mesh(new THREE.CylinderGeometry(10, 50, 400, 32), chrome);
            transmitter.position.set(Math.cos(angle) * 850, Math.sin(angle) * 850, 0);
            transmitter.lookAt(new THREE.Vector3(0,0,0));
            transmitter.rotation.x -= Math.PI / 2;
            chamberGroup.add(transmitter);
        }

        return chamberGroup;
    }

    // ==========================================
    // MACHINE ASSEMBLY
    // ==========================================
    
    // 1. Central Collision Chamber
    const chamber = createCentralChamber();
    group.add(chamber);

    // 2. Stars
    const starGeometry = new THREE.IcosahedronGeometry(150, 6);
    const starA = new THREE.Mesh(starGeometry, starMaterialA);
    const starB = new THREE.Mesh(starGeometry, starMaterialB);
    group.add(starA);
    group.add(starB);
    animatableMeshes.stars.push({ mesh: starA, dir: 1, startPos: -4000 });
    animatableMeshes.stars.push({ mesh: starB, dir: -1, startPos: 4000 });

    // 3. Containment Tubes (Left & Right)
    const tubeLength = 3200;
    const trussLeft = createComplexTruss(tubeLength, 300, 30, darkSteel);
    trussLeft.position.z = -tubeLength / 2 - 800;
    group.add(trussLeft);
    
    const trussRight = createComplexTruss(tubeLength, 300, 30, darkSteel);
    trussRight.position.z = tubeLength / 2 + 800;
    group.add(trussRight);

    // 4. Magnetic Flux Rings
    const ringsLeft = createMagneticRings(40, 80, 450);
    ringsLeft.position.z = -2400;
    group.add(ringsLeft);
    
    const ringsRight = createMagneticRings(40, 80, 450);
    ringsRight.position.z = 2400;
    group.add(ringsRight);

    // 5. Observation Decks
    const deck1 = createObservationDeck();
    deck1.position.set(1500, 1500, 0);
    deck1.lookAt(new THREE.Vector3(0,0,0));
    group.add(deck1);

    const deck2 = createObservationDeck();
    deck2.position.set(-1500, -1500, 0);
    deck2.lookAt(new THREE.Vector3(0,0,0));
    group.add(deck2);

    // 6. Mobile Maintenance Crawlers driving on the tubes
    for(let i = 0; i < 4; i++) {
        const crawler = createMaintenanceCrawler();
        const zPos = -3000 + (i * 2000);
        crawler.position.set(0, 350, zPos);
        crawler.scale.set(0.5, 0.5, 0.5); // Scaled down for scale relative to stars
        group.add(crawler);
    }

    // 7. Exotic Singularity and Accretion Disk (Initially hidden)
    const singularity = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), singularityMaterial);
    group.add(singularity);
    animatableMeshes.singularity = singularity;

    const diskGeo = new THREE.TorusGeometry(3, 0.5, 32, 100);
    const diskMat = new THREE.MeshPhysicalMaterial({
        color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 15.0, transparent: true, opacity: 0.9, side: THREE.DoubleSide
    });
    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    group.add(accretionDisk);
    animatableMeshes.accretionDisk = accretionDisk;

    // 8. Gravitational Shockwave Emitter
    const shockwave = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), shockwaveMaterial);
    group.add(shockwave);
    animatableMeshes.shockwave = shockwave;

    // 9. Massive Energy Harnessing Struts
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 4000, 32), copper);
        strut.position.set(Math.cos(angle) * 1200, Math.sin(angle) * 1200, 0);
        strut.lookAt(new THREE.Vector3(0,0,0));
        strut.rotation.x -= Math.PI / 2;
        group.add(strut);
    }

    // ==========================================
    // PARTS ARRAY DEFINITION
    // ==========================================
    parts.push({
        name: "Central Macrophysics Collision Chamber",
        description: "The nexus of the collider, reinforced with a dark-steel lattice. Capable of containing energies that rival the Big Bang during stellar impact.",
        material: "Dark Steel Lattice and Opalescent Spacetime Casing",
        function: "Contains the exotic singularity and prevents vacuum decay.",
        assemblyOrder: 1,
        connections: ["Star Containment Tube Left", "Star Containment Tube Right", "Event Horizon Baffles"],
        failureEffect: "Instantaneous catastrophic false vacuum collapse expanding at the speed of light.",
        cascadeFailures: ["Singularity breach", "Spacetime anchor detachment", "Total system annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: "Star Containment Tube Left (Alpha Sector)",
        description: "A 3,200-kilometer long vacuum conduit that utilizes the Alcubierre metric to physically move a star without shredding the local spacetime.",
        material: "Hyper-Tensile Dark Steel Truss",
        function: "Guides Star Alpha into the collision chamber.",
        assemblyOrder: 2,
        connections: ["Central Macrophysics Collision Chamber", "Magnetic Flux Rings Left"],
        failureEffect: "The star's gravity escapes containment, ripping the collider apart.",
        cascadeFailures: ["Tube rupture", "Star trajectory deviation"],
        originalPosition: { x: 0, y: 0, z: -2400 },
        explodedPosition: { x: -2000, y: 500, z: -3000 }
    });

    parts.push({
        name: "Star Containment Tube Right (Beta Sector)",
        description: "Mirror sector conduit for Star Beta. Equipped with extreme quantum cooling loops.",
        material: "Hyper-Tensile Dark Steel Truss",
        function: "Guides Star Beta into the collision chamber.",
        assemblyOrder: 3,
        connections: ["Central Macrophysics Collision Chamber", "Magnetic Flux Rings Right"],
        failureEffect: "Spaghettification of the Beta Sector.",
        cascadeFailures: ["Cooling system meltdown", "Magnetic field inversion"],
        originalPosition: { x: 0, y: 0, z: 2400 },
        explodedPosition: { x: 2000, y: 500, z: 3000 }
    });

    parts.push({
        name: "Magnetic Flux Rings Array Left",
        description: "An array of 40 superconducting toruses generating a 10^15 Tesla magnetic field to accelerate Star Alpha.",
        material: "Superconducting Copper and Spacetime-woven Energy Fields",
        function: "Accelerates the stellar mass to 0.99c.",
        assemblyOrder: 4,
        connections: ["Star Containment Tube Left"],
        failureEffect: "Premature stellar core collapse due to extreme magnetic shear.",
        cascadeFailures: ["Supernova detonation within the tube"],
        originalPosition: { x: 0, y: 0, z: -2400 },
        explodedPosition: { x: -3000, y: -1000, z: -4000 }
    });

    parts.push({
        name: "Magnetic Flux Rings Array Right",
        description: "Mirror array of 40 superconducting toruses accelerating Star Beta.",
        material: "Superconducting Copper and Spacetime-woven Energy Fields",
        function: "Accelerates the stellar mass to 0.99c.",
        assemblyOrder: 5,
        connections: ["Star Containment Tube Right"],
        failureEffect: "Premature stellar core collapse.",
        cascadeFailures: ["Supernova detonation within the tube"],
        originalPosition: { x: 0, y: 0, z: 2400 },
        explodedPosition: { x: 3000, y: -1000, z: 4000 }
    });

    parts.push({
        name: "Guided Star Alpha",
        description: "A captive solar-mass main sequence star, artificially enriched with hyper-dense isotopes.",
        material: "Plasma and Exotic Fusion Core",
        function: "Projectile A for the singularity collision.",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "Stellar expansion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -4000 },
        explodedPosition: { x: -5000, y: 2000, z: -5000 }
    });

    parts.push({
        name: "Guided Star Beta",
        description: "A captive blue giant star, generating extreme UV radiation.",
        material: "Plasma and Exotic Fusion Core",
        function: "Projectile B for the singularity collision.",
        assemblyOrder: 7,
        connections: [],
        failureEffect: "Gamma ray burst.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 4000 },
        explodedPosition: { x: 5000, y: 2000, z: 5000 }
    });

    parts.push({
        name: "Observation Deck Alpha",
        description: "A heavily shielded platform situated lightyears away in scale, using tachyonic telemetry to observe the impact.",
        material: "Chrome, Dark Steel, and Tinted Plasteel Windows",
        function: "Safe observation of god-tier physics events.",
        assemblyOrder: 8,
        connections: ["Superluminal Data Transmitters"],
        failureEffect: "Radiation poisoning of observers.",
        cascadeFailures: ["Telemetry link severed"],
        originalPosition: { x: 1500, y: 1500, z: 0 },
        explodedPosition: { x: 2500, y: 3000, z: 1000 }
    });

    parts.push({
        name: "Observation Deck Beta",
        description: "Secondary observation deck for stereoscopic tachyonic interferometry.",
        material: "Chrome, Dark Steel, and Tinted Plasteel Windows",
        function: "Failsafe observation and data redundancy.",
        assemblyOrder: 9,
        connections: ["Superluminal Data Transmitters"],
        failureEffect: "Loss of binocular quantum resolution.",
        cascadeFailures: ["Telemetry link severed"],
        originalPosition: { x: -1500, y: -1500, z: 0 },
        explodedPosition: { x: -2500, y: -3000, z: -1000 }
    });

    parts.push({
        name: "Exotic Singularity Core",
        description: "The resultant hyper-dense anomaly formed from the collision, contained by the central chamber.",
        material: "Infinite Curvature Spacetime (Pure Black)",
        function: "Generates Hawking radiation and warp plasma.",
        assemblyOrder: 10,
        connections: ["Central Macrophysics Collision Chamber", "Event Horizon Baffles"],
        failureEffect: "Total ingestion of the local galactic sector.",
        cascadeFailures: ["Event horizon expansion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Cannot explode, it's a singularity
    });

    parts.push({
        name: "Accretion Disk",
        description: "Super-heated plasma swirling around the newly formed singularity at relativistic speeds.",
        material: "Super-heated Plasma",
        function: "Bleeds off excess angular momentum.",
        assemblyOrder: 11,
        connections: ["Exotic Singularity Core"],
        failureEffect: "Disk disruption causing relativistic plasma jets.",
        cascadeFailures: ["Chamber lattice melting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -500, z: 0 }
    });

    parts.push({
        name: "Gravitational Shockwave Emitter",
        description: "A byproduct of the collision, generating immense ripples in spacetime. The emitter channels these waves safely outward.",
        material: "Pure Energy",
        function: "Dissipates collision energy safely.",
        assemblyOrder: 12,
        connections: ["Central Macrophysics Collision Chamber"],
        failureEffect: "Uncontrolled spacetime rippling tearing planets apart.",
        cascadeFailures: ["Local gravity inversion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1000, z: 2000 }
    });

    parts.push({
        name: "Maintenance Crawler Fleet",
        description: "Gigantic 6-wheeled vehicles that traverse the containment tubes, repairing micro-fractures in spacetime.",
        material: "Dark Steel, Chrome, and Vulcanized Rubber",
        function: "Structural maintenance.",
        assemblyOrder: 13,
        connections: ["Star Containment Tube Left", "Star Containment Tube Right"],
        failureEffect: "Micro-fractures propagate into macro-tears.",
        cascadeFailures: ["Tube decompression"],
        originalPosition: { x: 0, y: 350, z: -3000 },
        explodedPosition: { x: 0, y: 1000, z: -4000 }
    });

    parts.push({
        name: "Energy Harnessing Struts",
        description: "Eight massive copper pillars that siphon Hawking radiation from the singularity to power the collider.",
        material: "Superconducting Copper",
        function: "Power generation.",
        assemblyOrder: 14,
        connections: ["Central Macrophysics Collision Chamber"],
        failureEffect: "Total power grid collapse.",
        cascadeFailures: ["Magnetic ring offline", "Containment failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2000, y: -2000, z: 0 }
    });

    parts.push({
        name: "Superluminal Data Transmitters",
        description: "Array of enormous antennas that beam telemetry to the observation decks faster than light.",
        material: "Chrome and Steel",
        function: "Data transmission bypassing causality.",
        assemblyOrder: 15,
        connections: ["Central Macrophysics Collision Chamber", "Observation Deck Alpha"],
        failureEffect: "Data corruption due to relativistic time dilation.",
        cascadeFailures: ["Observation blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -2000, y: 2000, z: 0 }
    });


    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    
    let state = 0; // 0: Idle/Prep, 1: Acceleration, 2: Impact, 3: Singularity Formation, 4: Dissipation
    let stateTimer = 0;

    const animate = function(time, speed, meshes) {
        stateTimer += speed;
        
        // 1. Continuous Animations (Crawlers, Tires, Gears, Neons)
        
        // Spin crawler tires and articulate booms
        if (meshes.tires) {
            meshes.tires.forEach(t => {
                t.mesh.rotation.x -= 0.05 * speed * t.side;
            });
        }
        
        if (meshes.booms) {
            meshes.booms.forEach((boom, idx) => {
                // Complex sine wave articulation
                const angle1 = Math.sin(time * 2 + idx) * 0.3;
                const angle2 = Math.cos(time * 2.5 + idx) * 0.4;
                boom.b1.rotation.z = angle1;
                boom.b2.rotation.z = angle2;
            });
        }

        if (meshes.pistons) {
            meshes.pistons.forEach(piston => {
                // Procedural piston sliding simulation
                const slide = (Math.sin(time * 5) + 1) / 2; // 0 to 1
                if(piston.userData.inner) {
                    piston.userData.inner.position.y = piston.userData.baseLength * 0.7 + slide * (piston.userData.baseLength * 0.2);
                }
            });
        }

        if (meshes.gears) {
            meshes.gears.forEach((gear, idx) => {
                gear.rotation.y += 0.1 * speed * (idx % 2 === 0 ? 1 : -1);
            });
        }

        if (meshes.neonLights) {
            meshes.neonLights.forEach((light, idx) => {
                const intensity = 5 + Math.sin(time * 10 + idx) * 3;
                light.material.emissiveIntensity = intensity;
            });
        }

        if (meshes.magneticRings) {
            meshes.magneticRings.forEach((ring, idx) => {
                ring.rotation.z += 0.01 * speed;
                // Pulse ring scale
                const p = 1 + Math.sin(time * 3 + ring.position.z) * 0.05;
                ring.scale.set(p, p, p);
            });
        }

        // 2. State Machine for the Stellar Collision
        
        if (state === 0) {
            // Idle / Prep Phase: Stars at far ends
            meshes.stars.forEach(s => {
                s.mesh.position.z = s.startPos;
                s.mesh.scale.set(1, 1, 1);
                s.mesh.rotation.y += 0.01 * speed;
                s.mesh.rotation.x += 0.005 * speed;
            });
            meshes.singularity.scale.set(0.001, 0.001, 0.001);
            meshes.accretionDisk.scale.set(0.001, 0.001, 0.001);
            meshes.shockwave.scale.set(0.001, 0.001, 0.001);
            meshes.shockwave.material.opacity = 0;
            
            if (stateTimer > 100) {
                state = 1; // Move to Acceleration
                stateTimer = 0;
            }
        } 
        else if (state === 1) {
            // Acceleration Phase
            const duration = 200;
            const progress = Math.min(stateTimer / duration, 1.0);
            // Exponential acceleration curve
            const dist = 4000 * Math.pow(1 - progress, 3);
            
            meshes.stars.forEach(s => {
                s.mesh.position.z = s.dir > 0 ? -dist : dist;
                // Spin faster as they approach
                s.mesh.rotation.y += (0.01 + progress * 0.2) * speed;
            });
            
            if (progress >= 1.0) {
                state = 2; // Impact
                stateTimer = 0;
            }
        }
        else if (state === 2) {
            // Impact Phase
            meshes.stars.forEach(s => {
                s.mesh.scale.set(0.001, 0.001, 0.001); // Hide stars instantly
            });
            
            // Expand shockwave rapidly
            const waveScale = stateTimer * 80;
            meshes.shockwave.scale.set(waveScale, waveScale, waveScale);
            meshes.shockwave.material.opacity = Math.max(1.0 - (stateTimer / 20), 0);
            
            if (stateTimer > 30) {
                state = 3; // Singularity
                stateTimer = 0;
            }
        }
        else if (state === 3) {
            // Singularity Formation & Sustenance
            const duration = 300;
            const growth = Math.min(stateTimer / 50, 1.0);
            
            meshes.singularity.scale.set(growth * 150, growth * 150, growth * 150);
            meshes.accretionDisk.scale.set(growth * 300, growth * 300, growth * 300);
            
            // Spin the accretion disk furiously
            meshes.accretionDisk.rotation.x = Math.sin(time) * 0.2;
            meshes.accretionDisk.rotation.y += 0.2 * speed;
            meshes.accretionDisk.rotation.z = Math.cos(time) * 0.2;
            
            if (stateTimer > duration) {
                state = 4; // Dissipation
                stateTimer = 0;
            }
        }
        else if (state === 4) {
            // Dissipation via Hawking Radiation
            const decay = Math.max(1.0 - stateTimer / 100, 0.001);
            meshes.singularity.scale.set(decay * 150, decay * 150, decay * 150);
            meshes.accretionDisk.scale.set(decay * 300, decay * 300, decay * 300);
            
            if (stateTimer > 100) {
                state = 0; // Reset
                stateTimer = 0;
            }
        }
    };

    const description = "The Macrophysics Stellar Collider (God Tier) is an instrument of unimaginable scale. By artificially confining two main-sequence stars within Alcubierre-warped vacuum tubes, it accelerates them to 0.99c using superconducting magnetic flux toruses. Upon collision within the dark-steel lattice chamber, the combined kinetic and mass-energy overwhelms degeneracy pressure, instantly forming an exotic, naked singularity. This phenomenon allows researchers on tachyonic-linked observation decks to study extreme quantum gravity and Hawking radiation safely, before the singularity is intentionally dissipated to prevent cosmic vacuum collapse.";

    const quizQuestions = [
        {
            question: "In the context of macrophysics stellar collisions, if two solar-mass stars collide head-on at 0.99c, what is the primary mechanism of energy dissipation immediately prior to event horizon formation?",
            options: [
                "Neutrino cooling via Urca processes",
                "Gravitational wave emission carrying away angular momentum and mass-energy",
                "Photon diffusion through the hyper-dense quark-gluon plasma",
                "Tachyonic pair production in the ergosphere"
            ],
            answer: 1,
            explanation: "At relativistic speeds approaching c, the primary energy radiation mechanism from such massive bodies is the violent emission of gravitational waves, which can carry away a significant fraction of the system's total rest mass energy before an event horizon can fully form."
        },
        {
            question: "When the collider utilizes macroscopic magnetic flux rings to accelerate a star, what is the required order of magnitude for the magnetic field to overcome the star's immense inertia without initiating premature core collapse due to magnetic shear?",
            options: [
                "10^5 Tesla",
                "10^25 Tesla",
                "10^15 Tesla",
                "10^-5 Tesla"
            ],
            answer: 2,
            explanation: "A field on the order of 10^15 Tesla (similar to a magnetar) is required to manipulate the plasma effectively at a macro scale. Exceeding this by too much (e.g., 10^25) would overcome electron degeneracy pressure, triggering premature collapse."
        },
        {
            question: "Assuming the observation decks are situated 3 lightyears away from the collision chamber, how is real-time observation of the singularity maintained without violating the causality of normal spacetime?",
            options: [
                "By exploiting closed timelike curves within a Gödel metric",
                "Through quantum entanglement of macroscopic observational states",
                "Via Superluminal tachyonic telemetry bypassing the Minkowski light cone",
                "It is impossible; the observations are inherently delayed by 3 years"
            ],
            answer: 2,
            explanation: "The machine explicitly utilizes Superluminal Data Transmitters acting via tachyonic telemetry, a theoretical mechanism that transmits information faster than light outside the standard Minkowski light cone limitations."
        },
        {
            question: "The 3,200-kilometer containment tube must prevent the stellar bodies from gravitationally shredding the infrastructure. Which mathematical metric best describes this artificial spacetime geometry?",
            options: [
                "Schwarzschild metric",
                "Alcubierre metric",
                "Kerr-Newman metric",
                "Reissner-Nordström metric"
            ],
            answer: 1,
            explanation: "The Alcubierre metric allows for the contraction of spacetime in front of a mass and expansion behind it, effectively isolating the mass within a 'warp bubble' and neutralizing gravitational shear forces on the surrounding tube."
        },
        {
            question: "If the collider's impact successfully forms a 'naked' singularity rather than a standard black hole, which fundamental hypothesis of modern astrophysics is immediately violated, and what is the observational consequence?",
            options: [
                "Hawking's Area Theorem; the singularity's entropy decreases",
                "Penrose's Weak Cosmic Censorship Hypothesis; infinite curvature becomes visible to distant observers",
                "The Chandrasekhar Limit; white dwarfs become stable at infinite mass",
                "The No-Hair Theorem; the singularity loses its mass, charge, and spin"
            ],
            answer: 1,
            explanation: "Roger Penrose's Weak Cosmic Censorship Hypothesis posits that singularities must be hidden behind an event horizon. A naked singularity violates this, allowing regions of infinite curvature to be causally connected to, and visible by, the outside universe."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, animatableMeshes)
    };
}
