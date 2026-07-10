import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // --- MATERIALS CONFIGURATION ---
    const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1,
        transparent: true,
        roughness: 0,
        ior: 1.48,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const claddingMat = new THREE.MeshPhysicalMaterial({
        color: 0xddeeff,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.46,
        thickness: 4.0
    });

    const gelMat = new THREE.MeshPhysicalMaterial({
        color: 0x99ccff,
        transmission: 0.8,
        opacity: 0.7,
        transparent: true,
        roughness: 0.3,
        ior: 1.33
    });

    const bufferMat = plastic.clone();
    bufferMat.color.setHex(0x0044cc);
    bufferMat.roughness = 0.4;

    const foilMat = chrome.clone();
    foilMat.color.setHex(0xe0e0e0);
    foilMat.metalness = 1.0;
    foilMat.roughness = 0.2;
    foilMat.side = THREE.DoubleSide;

    const innerJacketMat = rubber.clone();
    innerJacketMat.color.setHex(0x1a1a1a);
    innerJacketMat.roughness = 0.9;

    const kevlarMat = new THREE.MeshStandardMaterial({
        color: 0xdeb831,
        roughness: 0.8,
        metalness: 0.1,
        wireframe: false
    });

    const outerJacketMat = rubber.clone();
    outerJacketMat.color.setHex(0xff6600); // Orange indicates Multi-Mode OM1/OM2
    outerJacketMat.roughness = 0.7;

    // --- GEOMETRY GENERATOR FOR SLICED CABLE LAYERS ---
    const thetaStart = 0;
    const thetaLength = Math.PI * 1.5; // 270 degrees solid, 90 degree cutaway

    function createRingSlice(innerRadius, outerRadius, startZ, length, material, name, assemblyOrder, description) {
        const shape = new THREE.Shape();
        if (innerRadius === 0) {
            shape.moveTo(0, 0);
            shape.absarc(0, 0, outerRadius, thetaStart, thetaStart + thetaLength, false);
            shape.lineTo(0, 0);
        } else {
            shape.absarc(0, 0, outerRadius, thetaStart, thetaStart + thetaLength, false);
            shape.lineTo(Math.cos(thetaStart + thetaLength) * innerRadius, Math.sin(thetaStart + thetaLength) * innerRadius);
            shape.absarc(0, 0, innerRadius, thetaStart + thetaLength, thetaStart, true);
            shape.lineTo(Math.cos(thetaStart) * outerRadius, Math.sin(thetaStart) * outerRadius);
        }
        
        const extrudeSettings = {
            depth: length,
            bevelEnabled: false,
            curveSegments: 64
        };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.z = startZ; 
        
        parts.push({
            name: name,
            description: description,
            material: material,
            function: description,
            assemblyOrder: assemblyOrder,
            originalPosition: mesh.position.clone(),
            explodedPosition: new THREE.Vector3(mesh.position.x, mesh.position.y + assemblyOrder * 12, mesh.position.z),
            connections: []
        });
        
        group.add(mesh);
        return mesh;
    }

    // --- CABLE LAYERS (Z goes from -100 to varying lengths) ---
    // 1. Core (Glass)
    createRingSlice(0, 2, -100, 190, coreMat, "Optical Core", 1, "Doped silica glass core. Highly pure medium where total internal reflection occurs.");
    
    // 2. Cladding (Glass)
    createRingSlice(2, 4.5, -100, 170, claddingMat, "Cladding", 2, "Lower refractive index glass surrounding the core to trap light within the core.");

    // 3. Thixotropic Gel (Water blocking)
    createRingSlice(4.5, 6, -100, 155, gelMat, "Thixotropic Gel", 3, "Moisture-blocking gel compound that cushions the delicate fiber and prevents water ingress.");

    // Add irregular gel impurities for ultra-realism
    const gelGroup = new THREE.Group();
    const impGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const impMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.5, transparent: true, opacity: 0.3 });
    for (let i = 0; i < 400; i++) {
        const angle = Math.random() * thetaLength;
        const r = 4.6 + Math.random() * 1.3;
        const z = -100 + Math.random() * 155;
        const drop = new THREE.Mesh(impGeom, impMat);
        drop.position.set(Math.cos(angle)*r, Math.sin(angle)*r, z);
        drop.scale.set(1, 1, 1 + Math.random()*3);
        gelGroup.add(drop);
    }
    group.add(gelGroup);

    // 4. Buffer Tube (Plastic)
    createRingSlice(6, 8, -100, 140, bufferMat, "Loose Buffer Tube", 4, "Rigid plastic tube protecting the core and cladding from physical micro-bending damage.");

    // 5. Moisture Barrier (Foil tape)
    createRingSlice(8, 8.5, -100, 125, foilMat, "Moisture Barrier Foil", 5, "Overlapping aluminum tape acting as an absolute moisture barrier.");

    // 6. Inner Jacket
    createRingSlice(8.5, 11, -100, 110, innerJacketMat, "Inner Jacket", 6, "Secondary rubber sleeve for tactical durability.");

    // 7. Aramid Yarn (Kevlar) - Procedurally generated thousands of strands
    const kevlarGroup = new THREE.Group();
    const kevlarFibers = 500;
    const kevlarGeom = new THREE.CylinderGeometry(0.06, 0.06, 95, 5);
    for (let i = 0; i < kevlarFibers; i++) {
        const angle = Math.random() * Math.PI * 2;
        if (angle > thetaLength) continue; // Leave the cutaway slice empty

        const mesh = new THREE.Mesh(kevlarGeom, kevlarMat);
        const radius = 11.2 + Math.random() * 2.6;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -52.5);
        mesh.rotation.x = Math.PI / 2; // Align along Z
        
        // Add helical twist
        const twist = 0.15 * (Math.random() > 0.5 ? 1 : -1);
        mesh.rotation.z = angle + Math.PI/2;
        mesh.rotation.y = twist; 
        
        kevlarGroup.add(mesh);
    }
    group.add(kevlarGroup);
    parts.push({
        name: "Aramid Yarn (Kevlar)",
        description: "High tensile strength synthetic fibers woven around the inner jacket to absorb pull-tension during installation.",
        material: kevlarMat,
        function: "Strain relief and mechanical strength.",
        assemblyOrder: 7,
        originalPosition: kevlarGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 84, 0),
        connections: []
    });

    // 8. Ripcord
    const ripcordGeom = new THREE.CylinderGeometry(0.4, 0.4, 85, 12);
    const ripcordMat = new THREE.MeshStandardMaterial({color: 0xffddaa, roughness: 1, metalness: 0});
    const ripcord = new THREE.Mesh(ripcordGeom, ripcordMat);
    ripcord.rotation.x = Math.PI / 2;
    // Embed it near the outer jacket inner wall, within the visible slice
    const rcAngle = Math.PI * 0.5; 
    ripcord.position.set(Math.cos(rcAngle) * 14.5, Math.sin(rcAngle) * 14.5, -57.5);
    group.add(ripcord);
    parts.push({
        name: "Ripcord",
        description: "Strong embedded nylon thread used by technicians to easily slice open the tough outer jacket.",
        material: ripcordMat,
        function: "Simplifies cable stripping.",
        assemblyOrder: 8,
        originalPosition: ripcord.position.clone(),
        explodedPosition: new THREE.Vector3(ripcord.position.x, ripcord.position.y + 96, ripcord.position.z),
        connections: []
    });

    // 9. Outer Jacket
    createRingSlice(14, 18, -100, 75, outerJacketMat, "Outer Jacket (LSZH)", 9, "Tough, weather-resistant outer sheath. Low Smoke Zero Halogen formulation.");

    // Outer Jacket Identification Stripe
    createRingSlice(17.8, 18.2, -100, 75, new THREE.MeshStandardMaterial({color: 0x111111, roughness: 0.9}), "Identification Stripe", 10, "Visual alignment and cable identification marker.");


    // --- ADVANCED LASER RAY TRACING ---
    const laserBeams = [];
    const photons = [];

    function createBouncingRay(startX, startY, startZ, vx, vy, vz, radiusLimit, endZ, colorHex, intensity) {
        const points = [];
        let curr = new THREE.Vector3(startX, startY, startZ);
        let dir = new THREE.Vector3(vx, vy, vz).normalize();
        points.push(curr.clone());
        
        let limit = 150;
        while(curr.z > endZ && limit-- > 0) {
            const a = dir.x * dir.x + dir.y * dir.y;
            const b = 2 * (curr.x * dir.x + curr.y * dir.y);
            const c = curr.x * curr.x + curr.y * curr.y - radiusLimit * radiusLimit;
            
            let t = -1;
            if (Math.abs(a) > 1e-8) {
                const disc = b * b - 4 * a * c;
                if (disc >= 0) {
                    const t1 = (-b + Math.sqrt(disc)) / (2 * a);
                    const t2 = (-b - Math.sqrt(disc)) / (2 * a);
                    if (t1 > 1e-4 && (t2 <= 1e-4 || t1 < t2)) t = t1;
                    else if (t2 > 1e-4) t = t2;
                }
            }
            
            if (t > 0) {
                let nextPoint = curr.clone().add(dir.clone().multiplyScalar(t));
                if (nextPoint.z < endZ) {
                    const tEnd = (endZ - curr.z) / dir.z;
                    nextPoint = curr.clone().add(dir.clone().multiplyScalar(tEnd));
                    points.push(nextPoint);
                    break;
                } else {
                    points.push(nextPoint);
                    const normal = new THREE.Vector3(-nextPoint.x, -nextPoint.y, 0).normalize();
                    dir.reflect(normal);
                    curr = nextPoint;
                }
            } else {
                const tEnd = (endZ - curr.z) / dir.z;
                const nextPoint = curr.clone().add(dir.clone().multiplyScalar(tEnd));
                points.push(nextPoint);
                break;
            }
        }
        
        const rayGroup = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: intensity, blending: THREE.AdditiveBlending });
        
        for(let i=0; i<points.length-1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
            const dist = p1.distanceTo(p2);
            const cylGeom = new THREE.CylinderGeometry(0.08, 0.08, dist, 8);
            const cyl = new THREE.Mesh(cylGeom, mat);
            cyl.userData = { phase: Math.random() * Math.PI * 2 };
            
            const mid = p1.clone().add(p2).multiplyScalar(0.5);
            cyl.position.copy(mid);
            cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
            
            rayGroup.add(cyl);
            laserBeams.push(cyl);
        }
        return { group: rayGroup, points };
    }

    function addPhotons(pathPoints, colorHex, count) {
        const particleGeom = new THREE.SphereGeometry(0.25, 12, 12);
        const particleMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
        
        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(particleGeom, particleMat);
            p.userData = {
                path: pathPoints,
                progress: Math.random(),
                speed: 0.005 + Math.random() * 0.003
            };
            photons.push(p);
            group.add(p); 
        }
    }

    function calculatePathLength(points) {
        let len = 0;
        for (let i = 0; i < points.length - 1; i++) {
            len += points[i].distanceTo(points[i+1]);
        }
        return len;
    }

    // MULTI-MODE SIMULATION: Multiple rays at different incidence angles
    const coreZEnd = -100;
    const coreZStart = 90;
    const radLim = 1.95; // Just inside the core-cladding boundary

    const mode1 = createBouncingRay(0, 0, coreZStart, 0.01, 0.01, -1, radLim, coreZEnd, 0xff0000, 0.8); // Axial
    const mode2 = createBouncingRay(0, 0, coreZStart, 0.1, 0.05, -1, radLim, coreZEnd, 0x00ff00, 0.6); // Low order
    const mode3 = createBouncingRay(0.5, -0.5, coreZStart, -0.15, 0.12, -1, radLim, coreZEnd, 0x0055ff, 0.6); // Skew ray
    const mode4 = createBouncingRay(-0.5, 0.5, coreZStart, 0.2, -0.18, -1, radLim, coreZEnd, 0xff00ff, 0.5); // High order
    const mode5 = createBouncingRay(0.2, -0.3, coreZStart, -0.22, -0.05, -1, radLim, coreZEnd, 0x00ffff, 0.5);
    const mode6 = createBouncingRay(-0.1, 0.8, coreZStart, 0.08, -0.25, -1, radLim, coreZEnd, 0xffff00, 0.5);
    
    group.add(mode1.group); group.add(mode2.group); group.add(mode3.group); 
    group.add(mode4.group); group.add(mode5.group); group.add(mode6.group);

    addPhotons(mode1.points, 0xff5555, 15);
    addPhotons(mode2.points, 0x55ff55, 20);
    addPhotons(mode3.points, 0x55aaff, 25);
    addPhotons(mode4.points, 0xff55ff, 30);
    addPhotons(mode5.points, 0x55ffff, 30);
    addPhotons(mode6.points, 0xffff55, 30);


    // --- TRANSMITTER ASSEMBLY (Z = 90) ---
    const txGroup = new THREE.Group();
    
    // LC Connector Ferrule Body
    const ferruleGeom = new THREE.CylinderGeometry(2, 2.5, 12, 32);
    const ferrule = new THREE.Mesh(ferruleGeom, new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.1, metalness: 0.1})); // Ceramic
    ferrule.rotation.x = Math.PI / 2;
    ferrule.position.z = 96;
    txGroup.add(ferrule);

    // Ferrule Flange
    const flangeGeom = new THREE.CylinderGeometry(3.5, 3.5, 3, 32);
    const flange = new THREE.Mesh(flangeGeom, aluminum);
    flange.rotation.x = Math.PI / 2;
    flange.position.z = 103.5;
    txGroup.add(flange);

    // Retention Spring
    const springGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(3, 0.3, 12, 32), steel);
        torus.position.z = 106 + i*0.8;
        springGroup.add(torus);
    }
    txGroup.add(springGroup);

    // Outer Connector Housing (Plastic)
    const housingShape = new THREE.Shape();
    housingShape.moveTo(-5, -5);
    housingShape.lineTo(5, -5);
    housingShape.lineTo(5, 5);
    housingShape.lineTo(-5, 5);
    const housingGeom = new THREE.ExtrudeGeometry(housingShape, { depth: 25, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.8, curveSegments: 16 });
    const housing = new THREE.Mesh(housingGeom, plastic);
    housing.position.set(0, 0, 105);
    txGroup.add(housing);

    // Grip Ridges on Housing
    for(let i=0; i<10; i++) {
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 1), rubber);
        ridge.position.set(0, 5.5, 110 + i*1.5);
        txGroup.add(ridge);
        const ridgeB = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 1), rubber);
        ridgeB.position.set(0, -5.5, 110 + i*1.5);
        txGroup.add(ridgeB);
    }

    // Laser Diode Emitter (Inside housing)
    const diodeGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const diodeMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const diode = new THREE.Mesh(diodeGeom, diodeMat);
    diode.rotation.x = Math.PI / 2;
    diode.position.z = 128;
    txGroup.add(diode);

    // Transmitter PCB
    const txPcb = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 12), new THREE.MeshStandardMaterial({color: 0x004400, roughness: 0.8}));
    txPcb.position.set(0, 0, 134);
    txGroup.add(txPcb);

    // Add TX to parts
    parts.push({
        name: "Optical Transmitter (LC Connector & Laser Diode)",
        description: "High-precision ceramic ferrule and VCSEL laser diode housing for injecting multi-mode optical signals.",
        material: aluminum,
        function: "Converts electrical signals to optical pulses and aligns them perfectly with the core.",
        assemblyOrder: 11,
        originalPosition: txGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 0, 50),
        connections: ["Optical Core"]
    });
    group.add(txGroup);


    // --- RECEIVER ASSEMBLY & PCB (Z = -100) ---
    const rxGroup = new THREE.Group();

    // Receiver block housing
    const rxBodyGeom = new THREE.CylinderGeometry(8, 8, 15, 32, 1, false, 0, Math.PI * 2);
    const rxBody = new THREE.Mesh(rxBodyGeom, darkSteel);
    rxBody.rotation.x = Math.PI / 2;
    rxBody.position.z = -107.5;
    rxGroup.add(rxBody);

    // Photodiode Lens Window
    const rxWindowGeom = new THREE.CylinderGeometry(3, 3, 2, 32);
    const rxWindow = new THREE.Mesh(rxWindowGeom, glass);
    rxWindow.rotation.x = Math.PI / 2;
    rxWindow.position.z = -101;
    rxGroup.add(rxWindow);

    // Avalanche Photodiode (APD) Active Area
    const apdGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const apdMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const apd = new THREE.Mesh(apdGeom, apdMat);
    apd.rotation.x = Math.PI / 2;
    apd.position.z = -102.5;
    rxGroup.add(apd);

    // Receiver Motherboard PCB
    const pcbGroup = new THREE.Group();
    const pcbBoard = new THREE.Mesh(new THREE.BoxGeometry(22, 1.5, 30), new THREE.MeshStandardMaterial({color: 0x005500, roughness: 0.8}));
    pcbBoard.position.set(0, -9, -122);
    pcbGroup.add(pcbBoard);
    
    // Transimpedance Amplifier (TIA) Chips and circuitry on PCB
    for(let i=0; i<8; i++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), plastic);
        chip.position.set(-6 + (i%4)*4, -7.75, -114 - Math.floor(i/4)*8);
        pcbGroup.add(chip);
        
        // Pins for chip
        for(let j=0; j<6; j++) {
            const pin1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.3), chrome);
            pin1.position.set(chip.position.x - 2, chip.position.y - 0.25, chip.position.z - 1.5 + j*0.6);
            pcbGroup.add(pin1);
            
            const pin2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.3), chrome);
            pin2.position.set(chip.position.x + 2, chip.position.y - 0.25, chip.position.z - 1.5 + j*0.6);
            pcbGroup.add(pin2);
        }
    }
    
    // Ribbon cable exiting PCB
    const ribbonGeom = new THREE.BoxGeometry(16, 0.5, 40);
    const ribbonMat = new THREE.MeshStandardMaterial({color: 0xcccccc});
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
    ribbon.position.set(0, -9, -150);
    pcbGroup.add(ribbon);

    rxGroup.add(pcbGroup);
    group.add(rxGroup);
    parts.push({
        name: "Optical Receiver & TIA Circuitry",
        description: "Avalanche Photodiode (APD) array with Transimpedance Amplifiers to convert faint optical pulses into strong electrical data streams.",
        material: darkSteel,
        function: "Optical to electrical signal conversion.",
        assemblyOrder: 12,
        originalPosition: rxGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -50, -50),
        connections: ["Optical Core"]
    });


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "What physical principle allows the optical core to trap and guide light pulses?",
            options: ["Electromagnetic Induction", "Total Internal Reflection", "Chromatic Dispersion", "Optical Defraction"],
            correctAnswer: 1,
            explanation: "Total Internal Reflection occurs when light propagating in the higher-index core hits the lower-index cladding boundary at a shallow angle, reflecting 100% of the light back."
        },
        {
            question: "What is the primary function of the Cladding layer?",
            options: ["To absorb stray light", "To provide structural strength against bending", "To provide a lower refractive index boundary", "To transmit secondary electrical signals"],
            correctAnswer: 2,
            explanation: "The cladding is made of glass with a slightly lower refractive index than the core. This index difference is mathematically required to achieve Total Internal Reflection."
        },
        {
            question: "Why are Aramid yarns (Kevlar) crucial in tactical fiber optic cables?",
            options: ["They conduct heat away from the core", "They prevent water ingress", "They provide immense tensile strength and prevent the fragile glass core from snapping under tension", "They filter out electromagnetic interference"],
            correctAnswer: 2,
            explanation: "Optical glass is extremely fragile under longitudinal stress. Aramid yarns act as a strength member, taking the entire pull-load when technicians route the cable."
        },
        {
            question: "What is the function of the Thixotropic Gel inside the buffer tube?",
            options: ["To amplify the optical signal", "To act as a moisture barrier and mechanical cushion", "To strip the outer jacket", "To reduce electromagnetic interference"],
            correctAnswer: 1,
            explanation: "Thixotropic gel blocks water from migrating down the cable if the jacket is compromised, and it cushions the delicate fiber against mechanical micro-bending."
        },
        {
            question: "In a Multi-Mode fiber, what causes 'Modal Dispersion'?",
            options: ["Light paths (modes) taking different routes and arriving at different times", "Material impurities absorbing specific wavelengths", "Interference from external magnetic fields", "The Kevlar jacket vibrating"],
            correctAnswer: 0,
            explanation: "Because multi-mode cores are wide, rays can bounce steeply (long path) or travel straight down the axis (short path). This causes the pulse to spread out over long distances, limiting bandwidth."
        }
    ];

    // --- ANIMATION LOOP ---
    function animate(time, speed, meshes) {
        // Animate the photons flying through the fiber modes
        photons.forEach(p => {
            p.userData.progress += p.userData.speed * speed;
            if (p.userData.progress > 1) {
                p.userData.progress = 0;
            }
            
            const path = p.userData.path;
            const totalLength = calculatePathLength(path);
            const targetDist = p.userData.progress * totalLength;
            
            let currDist = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i+1];
                const segLen = p1.distanceTo(p2);
                if (currDist + segLen >= targetDist) {
                    const ratio = (targetDist - currDist) / segLen;
                    p.position.lerpVectors(p1, p2, ratio);
                    break;
                }
                currDist += segLen;
            }
        });

        // Pulsate the stationary laser beam geometries to simulate high-speed data transmission
        laserBeams.forEach(b => {
            b.material.opacity = 0.4 + Math.sin(time * 15 * speed + b.userData.phase) * 0.4;
        });

        // Rotate the Kevlar helix slightly to show dynamic tension
        kevlarGroup.rotation.z = Math.sin(time * 0.5) * 0.05;
    }

    return {
        group,
        parts,
        description: "An ultra high-tech, highly detailed cross-section of a Tactical Multi-Mode Fiber Optic Cable. Features include a doped silica core, low-index cladding, moisture-blocking gel, Kevlar strain relief, and complex LC transmitter/receiver arrays with thousands of bouncing photon particles simulating Total Internal Reflection and Modal Dispersion.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createFiberOptic() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
