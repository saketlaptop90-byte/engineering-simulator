import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Materials
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const pulseMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 1 });
    const goldPinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 1.0 });
    const substrateMat = new THREE.MeshStandardMaterial({ color: 0xcc7722, roughness: 0.6, metalness: 0.1, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const siliconMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    const wireframeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2, wireframe: true });
    
    // --------------------------------------------------------
    // 1. Subretinal Polyimide Substrate
    // --------------------------------------------------------
    const substrateGeom = new THREE.SphereGeometry(15, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4);
    const substrateMesh = new THREE.Mesh(substrateGeom, substrateMat);
    substrateMesh.rotation.x = Math.PI; 
    substrateMesh.position.y = 10;
    
    const substrateInnerGeom = new THREE.SphereGeometry(14.8, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4);
    const substrateInnerMesh = new THREE.Mesh(substrateInnerGeom, darkSteel);
    substrateInnerMesh.rotation.x = Math.PI;
    substrateInnerMesh.position.y = 10;
    
    const substrateGroup = new THREE.Group();
    substrateGroup.add(substrateMesh);
    substrateGroup.add(substrateInnerMesh);
    group.add(substrateGroup);
    meshes.substrate = substrateGroup;

    parts.push({
        name: "Polyimide Subretinal Substrate",
        description: "A highly flexible, biocompatible polyimide base that contours perfectly to the macular curvature of the human retina.",
        material: "Polyimide / Dark Steel",
        function: "Provides the structural foundation for the electrode arrays and photovoltaic receivers.",
        assemblyOrder: 1,
        connections: ["Electrode Grid", "Photovoltaic Array"],
        failureEffect: "Substrate detachment leading to complete device failure and potential retinal tearing.",
        cascadeFailures: ["Electrode Dislocation", "Signal Loss"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // --------------------------------------------------------
    // 2. Titanium Reinforcement Mesh
    // --------------------------------------------------------
    const frameGeom = new THREE.SphereGeometry(15.2, 48, 48, 0, Math.PI * 2, 0, Math.PI / 4.1);
    const frameMesh = new THREE.Mesh(frameGeom, wireframeMat);
    frameMesh.rotation.x = Math.PI;
    frameMesh.position.y = 10;
    group.add(frameMesh);
    
    parts.push({
        name: "Titanium Exoskeletal Lattice",
        description: "A micro-machined titanium wireframe bonded to the outer polyimide layer.",
        material: "Surgical Grade Titanium",
        function: "Provides structural rigidity to prevent the substrate from folding or buckling during surgical insertion.",
        assemblyOrder: 2,
        connections: ["Polyimide Subretinal Substrate"],
        failureEffect: "Buckling of the array, causing uneven electrode contact.",
        cascadeFailures: ["Focal Blind Spots"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // --------------------------------------------------------
    // 3. Photovoltaic Hex Array
    // --------------------------------------------------------
    const photoGroup = new THREE.Group();
    const photoRadius = 14.9;
    const hexGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 6);
    hexGeom.rotateX(Math.PI / 2);
    
    const photoMeshes = [];
    for (let phi = 0.05; phi < Math.PI / 4 - 0.05; phi += 0.05) {
        let circum = 2 * Math.PI * photoRadius * Math.sin(phi);
        let numHex = Math.floor(circum / 0.35);
        for (let i = 0; i < numHex; i++) {
            let theta = (i / numHex) * Math.PI * 2;
            let mesh = new THREE.Mesh(hexGeom, siliconMat.clone());
            mesh.position.setFromSphericalCoords(photoRadius, phi, theta);
            mesh.lookAt(0, 0, 0); 
            photoGroup.add(mesh);
            photoMeshes.push(mesh);
        }
    }
    photoGroup.rotation.x = Math.PI;
    photoGroup.position.y = 10;
    group.add(photoGroup);
    meshes.photoGroup = photoGroup;
    meshes.photoMeshes = photoMeshes;

    parts.push({
        name: "Photovoltaic Pixel Array",
        description: "Thousands of microscopic silicon photodiodes arranged in a dense hexagonal lattice.",
        material: "Silicon / Semiconductor",
        function: "Converts patterned near-infrared light pulses into localized electrical currents.",
        assemblyOrder: 3,
        connections: ["Polyimide Subretinal Substrate", "ASIC Signal Bus"],
        failureEffect: "Loss of visual resolution in specific sectors of the patient's field of view.",
        cascadeFailures: ["Focal Blindness"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --------------------------------------------------------
    // 4. Penetrating Micro-Electrode Array
    // --------------------------------------------------------
    const electrodeGroup = new THREE.Group();
    const elecRadius = 14.7;
    const needleGeom = new THREE.CylinderGeometry(0.015, 0.04, 1.2, 8);
    needleGeom.translate(0, 0.6, 0);
    needleGeom.rotateX(Math.PI / 2);
    
    const electrodeMeshes = [];
    for (let phi = 0.05; phi < Math.PI / 5; phi += 0.1) {
        let circum = 2 * Math.PI * elecRadius * Math.sin(phi);
        let numElec = Math.floor(circum / 0.6);
        for (let i = 0; i < numElec; i++) {
            let theta = (i / numElec) * Math.PI * 2;
            let mesh = new THREE.Mesh(needleGeom, chrome);
            
            mesh.position.setFromSphericalCoords(elecRadius, phi, theta);
            mesh.lookAt(0, 0, 0); 
            
            const tipGeom = new THREE.SphereGeometry(0.04, 8, 8);
            const tipMesh = new THREE.Mesh(tipGeom, laserMat.clone());
            tipMesh.position.z = 1.2;
            mesh.add(tipMesh);
            
            electrodeGroup.add(mesh);
            electrodeMeshes.push({ base: mesh, tip: tipMesh });
        }
    }
    electrodeGroup.rotation.x = Math.PI;
    electrodeGroup.position.y = 10;
    group.add(electrodeGroup);
    meshes.electrodeMeshes = electrodeMeshes;

    parts.push({
        name: "Penetrating Micro-Electrode Array",
        description: "High-density iridium-oxide coated micro-needles designed to penetrate the inner limiting membrane.",
        material: "Chrome / Iridium-Oxide",
        function: "Delivers biphasic electrical pulses directly to the surviving retinal ganglion cells.",
        assemblyOrder: 4,
        connections: ["ASIC Signal Bus", "Retinal Ganglion Cells"],
        failureEffect: "Failure to stimulate nerve pathways, resulting in total device ineffectiveness.",
        cascadeFailures: ["Tissue Scarring", "Electrode Degradation"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // --------------------------------------------------------
    // 5. Titanium Hermetic Housing
    // --------------------------------------------------------
    const asicHousingGeom = new THREE.BoxGeometry(6, 1.8, 6);
    const housingMesh = new THREE.Mesh(asicHousingGeom, steel);
    
    const finGeom = new THREE.BoxGeometry(0.2, 0.6, 5.8);
    for (let i = -2.5; i <= 2.5; i += 0.5) {
        const fin = new THREE.Mesh(finGeom, aluminum);
        fin.position.set(i, 1.2, 0);
        housingMesh.add(fin);
    }
    
    const portGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);
    portGeom.rotateZ(Math.PI / 2);
    const port1 = new THREE.Mesh(portGeom, copper);
    port1.position.set(3.2, 0, -1.5);
    housingMesh.add(port1);
    const port2 = new THREE.Mesh(portGeom, copper);
    port2.position.set(3.2, 0, 1.5);
    housingMesh.add(port2);
    
    housingMesh.position.set(22, 5, 0);
    housingMesh.rotation.z = Math.PI / 8;
    group.add(housingMesh);

    parts.push({
        name: "Titanium Hermetic Housing",
        description: "A laser-welded titanium capsule protecting the delicate microelectronics.",
        material: "Surgical Grade Titanium",
        function: "Maintains a hermetically sealed, dry environment for the data processing core within the highly corrosive eye.",
        assemblyOrder: 5,
        connections: ["Data Processing ASIC", "Flexible Ribbon Cable"],
        failureEffect: "Fluid ingress, leading to catastrophic short circuits.",
        cascadeFailures: ["ASIC Destruction", "Ocular Toxicity"],
        originalPosition: { x: 22, y: 5, z: 0 },
        explodedPosition: { x: 45, y: 5, z: 0 }
    });

    // --------------------------------------------------------
    // 6. Neuromorphic Processing ASIC
    // --------------------------------------------------------
    const asicGeom = new THREE.BoxGeometry(4.5, 0.2, 4.5);
    const asicMesh = new THREE.Mesh(asicGeom, siliconMat);
    
    const chipGeom = new THREE.BoxGeometry(2.5, 0.3, 2.5);
    const chipMesh = new THREE.Mesh(chipGeom, darkSteel);
    chipMesh.position.y = 0.25;
    asicMesh.add(chipMesh);
    
    // Dynamic Circuit Traces Texture
    function createTraceTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 512);
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 80; i++) {
            ctx.beginPath();
            let x = Math.random() * 512;
            let y = Math.random() * 512;
            ctx.moveTo(x, y);
            for(let j=0; j<5; j++) {
                if(Math.random() > 0.5) x += (Math.random() - 0.5) * 120;
                else y += (Math.random() - 0.5) * 120;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    const traceGeom = new THREE.PlaneGeometry(4, 4);
    const traceMat = new THREE.MeshBasicMaterial({ map: createTraceTexture(), transparent: true, blending: THREE.AdditiveBlending });
    const traceMesh = new THREE.Mesh(traceGeom, traceMat);
    traceMesh.rotation.x = -Math.PI / 2;
    traceMesh.position.y = 0.11;
    asicMesh.add(traceMesh);
    meshes.traceMesh = traceMesh;

    const pinGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
    for (let x = -2.0; x <= 2.0; x += 0.4) {
        const pin1 = new THREE.Mesh(pinGeom, goldPinMat); pin1.position.set(x, -0.3, -2.1); asicMesh.add(pin1);
        const pin2 = new THREE.Mesh(pinGeom, goldPinMat); pin2.position.set(x, -0.3, 2.1); asicMesh.add(pin2);
    }
    for (let z = -1.6; z <= 1.6; z += 0.4) {
        const pin1 = new THREE.Mesh(pinGeom, goldPinMat); pin1.position.set(-2.1, -0.3, z); asicMesh.add(pin1);
        const pin2 = new THREE.Mesh(pinGeom, goldPinMat); pin2.position.set(2.1, -0.3, z); asicMesh.add(pin2);
    }

    asicMesh.position.copy(housingMesh.position);
    asicMesh.rotation.copy(housingMesh.rotation);
    group.add(asicMesh);

    parts.push({
        name: "Neuromorphic Processing ASIC",
        description: "A massively parallel ASIC designed to translate pixel data into temporal neural spike codes.",
        material: "Silicon / Gold / Copper",
        function: "Performs real-time signal processing, edge detection, and encoding of the visual scene for the brain.",
        assemblyOrder: 6,
        connections: ["Titanium Hermetic Housing", "Flexible Ribbon Cable"],
        failureEffect: "Loss of translation; device provides static noise.",
        cascadeFailures: ["Overheating", "Data Corruption"],
        originalPosition: { x: 22, y: 5, z: 0 },
        explodedPosition: { x: 22, y: 25, z: 0 }
    });

    // --------------------------------------------------------
    // 7. Receiver Telemetry Coil
    // --------------------------------------------------------
    const coilGroup = new THREE.Group();
    const coilPath = new THREE.TorusGeometry(8, 0.08, 16, 120);
    const coilCount = 25;
    
    for (let i = 0; i < coilCount; i++) {
        const coilLoop = new THREE.Mesh(coilPath, copper);
        coilLoop.scale.set(1 - (i * 0.008), 1 - (i * 0.008), 1);
        coilLoop.position.z = i * 0.12;
        coilGroup.add(coilLoop);
    }
    
    const encapGeom = new THREE.TorusGeometry(7.8, 1.4, 32, 64);
    const encapMesh = new THREE.Mesh(encapGeom, new THREE.MeshStandardMaterial({ color: 0x999999, transparent: true, opacity: 0.5, roughness: 0.1 }));
    encapMesh.position.z = (coilCount * 0.12) / 2;
    coilGroup.add(encapMesh);

    // Brackets
    const bracketGeom = new THREE.BoxGeometry(2.5, 3.0, 0.8);
    for(let i=0; i<4; i++) {
        const bracket = new THREE.Mesh(bracketGeom, steel);
        bracket.position.setFromSphericalCoords(7.8, Math.PI/2, i * Math.PI/2);
        bracket.lookAt(0,0,0);
        coilGroup.add(bracket);
        
        const screwGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 8);
        screwGeom.rotateX(Math.PI/2);
        const screw1 = new THREE.Mesh(screwGeom, chrome); screw1.position.set(0.6, 0.8, 0.4); bracket.add(screw1);
        const screw2 = new THREE.Mesh(screwGeom, chrome); screw2.position.set(-0.6, -0.8, 0.4); bracket.add(screw2);
    }

    coilGroup.position.set(35, 0, 15);
    coilGroup.lookAt(22, 5, 0);
    group.add(coilGroup);
    meshes.coilGroup = coilGroup;

    parts.push({
        name: "Inductive Receiver Coil & Brackets",
        description: "A 25-turn copper coil encapsulated in medical-grade silicone with titanium suturing brackets.",
        material: "Copper / Silicone / Titanium",
        function: "Receives wireless AC power and high-frequency telemetry from external transmitter glasses.",
        assemblyOrder: 7,
        connections: ["Titanium Hermetic Housing", "Power Conduit"],
        failureEffect: "Total loss of power and data; complete system shutdown.",
        cascadeFailures: ["Battery Depletion"],
        originalPosition: { x: 35, y: 0, z: 15 },
        explodedPosition: { x: 60, y: 0, z: 30 }
    });

    // --------------------------------------------------------
    // 8. Tantalum Micro-Capacitor Bank
    // --------------------------------------------------------
    const capGroup = new THREE.Group();
    const capGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    
    for(let i=0; i<5; i++) {
        const cap = new THREE.Mesh(capGeom, plastic);
        cap.position.set(-2.0 + i*1.0, 0.8, 1.4);
        cap.rotation.x = Math.PI / 2;
        capGroup.add(cap);
        
        const ringGeom = new THREE.TorusGeometry(0.41, 0.05, 8, 16);
        const ring = new THREE.Mesh(ringGeom, aluminum);
        ring.position.copy(cap.position);
        ring.rotation.copy(cap.rotation);
        capGroup.add(ring);
    }
    capGroup.position.copy(housingMesh.position);
    capGroup.rotation.copy(housingMesh.rotation);
    group.add(capGroup);

    parts.push({
        name: "Tantalum Micro-Capacitor Bank",
        description: "High-density energy storage capacitors mounted on the ASIC board.",
        material: "Tantalum / Ceramic",
        function: "Smooths the AC power from the receiver coil and provides burst energy for simultaneous multi-electrode stimulation.",
        assemblyOrder: 8,
        connections: ["Neuromorphic Processing ASIC"],
        failureEffect: "Inability to fire multiple electrodes simultaneously, severely degrading image contrast.",
        cascadeFailures: ["Brown-out Resets"],
        originalPosition: { x: 22, y: 5, z: 0 },
        explodedPosition: { x: 22, y: 15, z: 8 }
    });

    // --------------------------------------------------------
    // 9. Flexible Polyimide Ribbon Cable
    // --------------------------------------------------------
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(20, 5, 0),    
        new THREE.Vector3(14, 13, 0),   
        new THREE.Vector3(9, 16, 0),    
        new THREE.Vector3(0, 25, 0)     
    ]);
    const cableGeom = new THREE.TubeGeometry(cableCurve, 64, 1.8, 16, false);
    const cableMesh = new THREE.Mesh(cableGeom, substrateMat);
    // Flattening via scale
    cableMesh.scale.z = 0.15; 
    group.add(cableMesh);

    const dataLineGeom = new THREE.TubeGeometry(cableCurve, 64, 1.85, 16, false);
    const dataLineMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.3 });
    const dataLineMesh = new THREE.Mesh(dataLineGeom, dataLineMat);
    dataLineMesh.scale.z = 0.16;
    group.add(dataLineMesh);
    meshes.dataLineMesh = dataLineMesh;

    parts.push({
        name: "High-Density Polyimide Ribbon",
        description: "An ultra-thin, flexible micro-cable containing hundreds of microscopic gold traces.",
        material: "Polyimide / Gold",
        function: "Transmits electrical stimulation patterns from the ASIC to the subretinal electrode array without restricting saccadic eye movement.",
        assemblyOrder: 9,
        connections: ["Data Processing ASIC", "Polyimide Subretinal Substrate"],
        failureEffect: "Severed connection leads to loss of signal transmission to the retina.",
        cascadeFailures: ["Signal Arching", "Thermal Tissue Damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 15 }
    });

    // --------------------------------------------------------
    // 10. Power and Telemetry Conduit
    // --------------------------------------------------------
    const pwrCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(35, 0, 15),
        new THREE.Vector3(30, 2, 8),
        new THREE.Vector3(24, 4.5, 1)
    ]);
    const pwrGeom = new THREE.TubeGeometry(pwrCurve, 32, 0.5, 16, false);
    const pwrMesh = new THREE.Mesh(pwrGeom, rubber);
    group.add(pwrMesh);

    parts.push({
        name: "Power and Telemetry Conduit",
        description: "A heavily shielded, silicone-jacketed dual wire conduit with steel braiding.",
        material: "Silicone / Copper / Steel Braiding",
        function: "Carries high-frequency AC power and modulated telemetry signals from the induction coil.",
        assemblyOrder: 10,
        connections: ["Inductive Receiver Coil", "Titanium Hermetic Housing"],
        failureEffect: "Intermittent power loss causing rapid, disorienting implant reboots.",
        cascadeFailures: ["System Reset Loops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: -10, z: 10 }
    });

    // --------------------------------------------------------
    // 11. Dichroic Optical Filter Layer
    // --------------------------------------------------------
    const filterGeom = new THREE.SphereGeometry(15.1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4);
    const filterMesh = new THREE.Mesh(filterGeom, new THREE.MeshStandardMaterial({ color: 0x8800ff, transparent: true, opacity: 0.25, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide }));
    filterMesh.rotation.x = Math.PI;
    filterMesh.position.y = 10;
    group.add(filterMesh);

    parts.push({
        name: "Dichroic Optical Filter Coating",
        description: "A nanometer-thick coating deposited over the photovoltaic array.",
        material: "Titanium Dioxide / Silicon Dioxide",
        function: "Filters out harmful UV and excessive visible ambient light, passing only near-IR control pulses.",
        assemblyOrder: 11,
        connections: ["Photovoltaic Pixel Array"],
        failureEffect: "Photodiode saturation from ambient light, completely blinding the digital vision system.",
        cascadeFailures: ["Sensor Overload"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // --------------------------------------------------------
    // 12. Fluid Micro-Seals
    // --------------------------------------------------------
    const sealGeom = new THREE.TorusGeometry(3.6, 0.25, 16, 64);
    const sealMesh = new THREE.Mesh(sealGeom, rubber);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.copy(housingMesh.position);
    sealMesh.rotation.copy(housingMesh.rotation);
    sealMesh.translateY(0.9);
    group.add(sealMesh);

    parts.push({
        name: "Fluoropolymer Micro-Seals",
        description: "Chemically inert O-ring seals placed at every cable ingress point on the titanium housing.",
        material: "Fluoropolymer Elastomer",
        function: "Provides a secondary barrier against microscopic fluid ingress along the cable sheathing.",
        assemblyOrder: 12,
        connections: ["Titanium Hermetic Housing", "Power and Telemetry Conduit"],
        failureEffect: "Slow seepage of saline fluids over years.",
        cascadeFailures: ["Internal Corrosion", "Short Circuits"],
        originalPosition: { x: 22, y: 5.9, z: 0 },
        explodedPosition: { x: 22, y: 12, z: 0 }
    });

    // --------------------------------------------------------
    // 13. Epiretinal Micro-Tacks
    // --------------------------------------------------------
    const tackGroup = new THREE.Group();
    const tackGeom = new THREE.CylinderGeometry(0.12, 0.02, 2.5, 12);
    tackGeom.translate(0, -1.25, 0);
    const tackHeadGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    tackHeadGeom.translate(0, 0.1, 0);
    
    for(let i=0; i<4; i++) {
        const tackMesh = new THREE.Mesh(tackGeom, chrome);
        const tackHead = new THREE.Mesh(tackHeadGeom, chrome);
        tackMesh.add(tackHead);
        
        tackMesh.position.setFromSphericalCoords(15, Math.PI / 4 + 0.05, i * Math.PI/2);
        tackMesh.lookAt(0, 0, 0);
        tackMesh.rotateX(-Math.PI / 2); 
        tackGroup.add(tackMesh);
    }
    tackGroup.rotation.x = Math.PI;
    tackGroup.position.y = 10;
    group.add(tackGroup);

    parts.push({
        name: "Epiretinal Titanium Micro-Tacks",
        description: "Four titanium micro-tacks used by surgeons to securely pin the subretinal array to the scleral wall.",
        material: "Titanium Alloy",
        function: "Prevents mechanical migration of the implant within the vitreous chamber over the patient's lifetime.",
        assemblyOrder: 13,
        connections: ["Polyimide Subretinal Substrate", "Sclera"],
        failureEffect: "Implant migration, leading to rapid loss of visual alignment.",
        cascadeFailures: ["Retinal Tearing", "Intraocular Hemorrhage"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // --------------------------------------------------------
    // 14. Vitreous Ground Electrode
    // --------------------------------------------------------
    const groundGeom = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16);
    groundGeom.rotateZ(Math.PI / 2);
    const groundMesh = new THREE.Mesh(groundGeom, chrome);
    groundMesh.position.set(16, 9, 3);
    groundMesh.lookAt(0, 10, 0);
    
    // Add tiny fins to ground for surface area
    const gFinGeom = new THREE.BoxGeometry(2.3, 0.2, 1.4);
    for(let i=0; i<3; i++) {
        const gFin = new THREE.Mesh(gFinGeom, chrome);
        gFin.position.set(0, 0, (i-1)*0.4);
        groundMesh.add(gFin);
    }
    group.add(groundMesh);

    parts.push({
        name: "Vitreous Ground Electrode Array",
        description: "A large-surface-area platinum-iridium electrode exposed directly to the vitreous humor.",
        material: "Platinum-Iridium",
        function: "Provides a low-impedance electrical return path for the biphasic stimulation pulses emitted by the micro-electrode array.",
        assemblyOrder: 14,
        connections: ["Titanium Hermetic Housing", "Vitreous Humor"],
        failureEffect: "Extreme impedance mismatch, causing tissue burning at the active micro-electrodes.",
        cascadeFailures: ["Tissue Necrosis", "Emergency Device Shutdown"],
        originalPosition: { x: 16, y: 9, z: 3 },
        explodedPosition: { x: 16, y: 20, z: 15 }
    });

    // --------------------------------------------------------
    // 15. Auxiliary Optic Nerve Stimulator (Fractal Dendrites)
    // --------------------------------------------------------
    const nerveGroup = new THREE.Group();
    const bundleGeom = new THREE.CylinderGeometry(1.2, 1.2, 6, 32);
    const bundleMesh = new THREE.Mesh(bundleGeom, rubber);
    
    const fiberMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 1.5 });
    
    function createBranch(radius, length, depth) {
        if (depth === 0) return new THREE.Group();
        const branchGroup = new THREE.Group();
        const geom = new THREE.CylinderGeometry(radius * 0.7, radius, length, 8);
        geom.translate(0, length / 2, 0);
        const mesh = new THREE.Mesh(geom, fiberMat);
        branchGroup.add(mesh);
        
        const numBranches = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numBranches; i++) {
            const childBranch = createBranch(radius * 0.7, length * 0.85, depth - 1);
            childBranch.position.y = length;
            childBranch.rotation.z = (Math.random() - 0.5) * Math.PI / 1.5;
            childBranch.rotation.x = (Math.random() - 0.5) * Math.PI / 1.5;
            childBranch.rotation.y = Math.random() * Math.PI * 2;
            branchGroup.add(childBranch);
        }
        return branchGroup;
    }

    for (let i = 0; i < 15; i++) {
        const rootBranch = createBranch(0.12, 2.0, 4);
        let r = Math.random() * 0.9;
        let t = Math.random() * Math.PI * 2;
        rootBranch.position.set(r * Math.cos(t), 3.0, r * Math.sin(t));
        bundleMesh.add(rootBranch);
    }
    
    nerveGroup.add(bundleMesh);
    nerveGroup.position.set(0, 32, 0);
    group.add(nerveGroup);

    parts.push({
        name: "Auxiliary Optic Nerve Interface (Dendritic Bundle)",
        description: "A direct penetrating nerve bundle interface featuring fractal-grown graphene micro-dendrites.",
        material: "Silicone / Graphene Fibers",
        function: "Bypasses a completely deteriorated retina to inject structured neural codes directly into the optic nerve head.",
        assemblyOrder: 15,
        connections: ["Data Processing ASIC", "Optic Nerve"],
        failureEffect: "Complete failure to interface with the optic nerve, resulting in zero visual perception.",
        cascadeFailures: ["Optic Neuropathy", "Glia Scarring"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 65, z: 0 }
    });

    // --------------------------------------------------------
    // Description and Quiz
    // --------------------------------------------------------
    const description = "The Cyber Bionic Retinal Implant is an ultra-high-tech, next-generation neuro-prosthesis designed to restore sight to the profoundly blind. It bridges the gap between digital optical sensors and biological neural pathways. Featuring a flexible polyimide substrate contoured precisely to the macula, an exoskeletal titanium reinforcement lattice, thousands of iridium-oxide micro-electrodes, a highly integrated neuromorphic ASIC encased in hermetic titanium, and an extra-ocular induction coil for wireless power, this machine is a marvel of microscopic biomedical engineering. Its operation relies on translating patterned near-infrared light pulses into precise, biphasic electrical spike trains that stimulate the surviving retinal ganglion cells or the optic nerve directly.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Tantalum Micro-Capacitor Bank?",
            options: [
                "To store visual data temporarily.",
                "To smooth AC power and provide burst energy for multi-electrode stimulation.",
                "To filter out ultraviolet light.",
                "To anchor the implant to the sclera."
            ],
            correctAnswer: 1,
            explanation: "The capacitors store electrical energy to handle sudden high-current demands when multiple stimulating electrodes must fire simultaneously to generate a complex visual pattern."
        },
        {
            question: "Why is the Neuromorphic ASIC enclosed in a Titanium Hermetic Housing?",
            options: [
                "For aesthetic purposes.",
                "To improve wireless signal reception.",
                "To protect the delicate microelectronics from the highly corrosive environment of ocular fluids.",
                "To act as the primary ground electrode."
            ],
            correctAnswer: 2,
            explanation: "Ocular fluids (like vitreous humor) are saline and highly corrosive to standard electronics. A laser-welded titanium housing provides a hermetic (air and watertight) seal ensuring longevity."
        },
        {
            question: "What material is used to coat the Penetrating Micro-Electrode Array to ensure efficient charge transfer?",
            options: [
                "Gold",
                "Copper",
                "Iridium-Oxide",
                "Silicone"
            ],
            correctAnswer: 2,
            explanation: "Iridium-Oxide is highly valued in neural interfaces for its superior charge-injection capacity, allowing safe and efficient transfer of electrical pulses into nerve tissue without degrading the electrode."
        },
        {
            question: "What is the specific role of the Dichroic Optical Filter Layer?",
            options: [
                "It colors the eye to hide the implant.",
                "It filters out harmful UV and excessive visible light, allowing only specific near-IR control pulses to reach the photodiodes.",
                "It acts as a physical barrier against bacteria.",
                "It magnifies the incoming light."
            ],
            correctAnswer: 1,
            explanation: "The photodiodes must be activated by specific, patterned near-infrared light from external glasses. The filter prevents ambient visible light from saturating the sensors and blinding the system."
        },
        {
            question: "How does the implant receive operational power and visual data?",
            options: [
                "Through a physical wire passing completely through the optic nerve.",
                "Via a surgically implanted lithium-ion battery.",
                "Through magnetic induction via the extra-ocular Receiver Telemetry Coil.",
                "By metabolizing glucose directly from the retinal bloodstream."
            ],
            correctAnswer: 2,
            explanation: "The Inductive Receiver Coil picks up an alternating magnetic field generated by an external coil (usually mounted on glasses), extracting both AC power and modulated data simultaneously."
        }
    ];

    // --------------------------------------------------------
    // Animation Loop
    // --------------------------------------------------------
    const animate = (time, speed, meshes) => {
        // 1. Sweep activation across the Photovoltaic Array
        if (meshes.photoMeshes) {
            meshes.photoMeshes.forEach((mesh, index) => {
                const delay = index * 0.0012;
                const wave = (Math.sin(time * speed * 4 + delay * 80) + 1) / 2;
                if (wave > 0.92) {
                    mesh.material.emissive.setHex(0xff0055);
                    mesh.material.emissiveIntensity = 2.5;
                } else {
                    mesh.material.emissive.setHex(0x220000);
                    mesh.material.emissiveIntensity = 0.5;
                }
            });
        }

        // 2. Fire the Micro-Electrodes (delayed correlation to photo array)
        if (meshes.electrodeMeshes) {
            meshes.electrodeMeshes.forEach((elec, index) => {
                const delay = index * 0.0012;
                const fire = (Math.sin(time * speed * 4 + delay * 80 - 0.4) + 1) / 2; 
                if (fire > 0.96) {
                    elec.tip.material.emissiveIntensity = 6.0;
                    elec.tip.scale.set(1.8, 1.8, 1.8);
                } else {
                    elec.tip.material.emissiveIntensity = 0.4;
                    elec.tip.scale.set(1, 1, 1);
                }
            });
        }

        // 3. Telemetry Coil Energy Pulse
        if (meshes.coilGroup) {
            meshes.coilGroup.children.forEach((loop, index) => {
                if(loop.geometry.type === 'TorusGeometry' && index < 25) {
                    const powerWave = (Math.sin(time * speed * 15 - index * 0.6) + 1) / 2;
                    if(powerWave > 0.85) {
                        loop.material.emissive.setHex(0x0055ff);
                        loop.material.emissiveIntensity = 1.5;
                    } else {
                        loop.material.emissive.setHex(0x000000);
                    }
                }
            });
        }

        // 4. Scroll Data on ASIC Traces
        if (meshes.traceMesh) {
            meshes.traceMesh.material.map.offset.y = (time * speed * 0.3) % 1;
            meshes.traceMesh.material.map.offset.x = (time * speed * 0.15) % 1;
        }

        // 5. Pulse Data Ribbon Lines
        if (meshes.dataLineMesh) {
            meshes.dataLineMesh.material.opacity = 0.15 + ((Math.sin(time * speed * 25) + 1) / 2) * 0.4;
        }
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBionicRetinalImplant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
