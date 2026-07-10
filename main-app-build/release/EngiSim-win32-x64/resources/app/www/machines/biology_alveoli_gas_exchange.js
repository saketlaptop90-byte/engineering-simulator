import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon high-tech materials for biological entities
    const alveolarMembraneMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaaaa,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.2,
        emissive: 0xff5555,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const capillaryWallMat = new THREE.MeshPhysicalMaterial({
        color: 0xcc0000,
        transparent: true,
        opacity: 0.3,
        roughness: 0.3,
        transmission: 0.6,
        emissive: 0x550000,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide
    });

    const oxygenMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        roughness: 0.1,
        metalness: 0.8
    });

    const co2Mat = new THREE.MeshStandardMaterial({
        color: 0xaaff00,
        emissive: 0x55aa00,
        emissiveIntensity: 1.5,
        roughness: 0.5,
        metalness: 0.5
    });
    
    const rbcMat = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        emissive: 0x330000,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.4
    });

    // 1. Alveolar Sac (Expanding/Contracting core)
    const sacGeo = new THREE.SphereGeometry(3, 64, 64);
    const posAttribute = sacGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        const noise = Math.sin(x*3)*0.15 + Math.cos(y*3)*0.15 + Math.sin(z*3)*0.15;
        posAttribute.setXYZ(i, x+noise, y+noise, z+noise);
    }
    sacGeo.computeVertexNormals();
    
    const sacMesh = new THREE.Mesh(sacGeo, alveolarMembraneMat);
    sacMesh.position.set(0, 0, 0);
    group.add(sacMesh);
    meshes.alveolarSac = sacMesh;
    
    parts.push({
        name: "Alveolar Sac",
        description: "Cluster of microscopic air sacs where pulmonary gas exchange occurs.",
        material: "Semi-permeable Organic Membrane",
        function: "Provides a massively expanded surface area for the rapid diffusion of O2 and CO2.",
        assemblyOrder: 1,
        connections: ["Terminal Bronchiole", "Pulmonary Capillary Network"],
        failureEffect: "Reduced surface area for gas exchange, causing acute hypoxia.",
        cascadeFailures: ["Respiratory failure", "Systemic cellular death due to hypoxia"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 2. Capillary Network (Wraps around the sac)
    const capGeo = new THREE.TorusGeometry(3.2, 0.5, 32, 100, Math.PI * 2);
    const capillaryMesh1 = new THREE.Mesh(capGeo, capillaryWallMat);
    capillaryMesh1.rotation.x = Math.PI / 4;
    group.add(capillaryMesh1);
    
    const capillaryMesh2 = new THREE.Mesh(capGeo, capillaryWallMat);
    capillaryMesh2.rotation.x = -Math.PI / 4;
    capillaryMesh2.rotation.y = Math.PI / 2;
    group.add(capillaryMesh2);

    const capillaryGroup = new THREE.Group();
    capillaryGroup.add(capillaryMesh1);
    capillaryGroup.add(capillaryMesh2);
    meshes.capillaryNetwork = capillaryGroup;

    parts.push({
        name: "Capillary Network",
        description: "Ultra-thin microscopic blood vessels tightly wrapped around the alveoli.",
        material: "Endothelial Cells",
        function: "Transports deoxygenated blood to the alveoli and carries away newly oxygenated blood.",
        assemblyOrder: 2,
        connections: ["Alveolar Sac", "Pulmonary Arterioles", "Pulmonary Venules"],
        failureEffect: "Impaired blood perfusion preventing effective gas transfer.",
        cascadeFailures: ["Pulmonary hypertension", "Right-sided heart failure (Cor pulmonale)"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 3. Glowing Oxygen Molecules (O2)
    const o2Geo = new THREE.SphereGeometry(0.12, 16, 16);
    const o2Group = new THREE.Group();
    const numO2 = 40;
    const o2Data = [];
    for(let i=0; i<numO2; i++) {
        const o2 = new THREE.Mesh(o2Geo, oxygenMat);
        const phi = Math.acos(-1 + (2 * i) / numO2);
        const theta = Math.sqrt(numO2 * Math.PI) * phi;
        const r = Math.random() * 2.5;
        o2.position.setFromSphericalCoords(r, phi, theta);
        o2Group.add(o2);
        o2Data.push({ mesh: o2, startR: r, phi, theta });
    }
    group.add(o2Group);
    meshes.o2Molecules = o2Data;

    parts.push({
        name: "Oxygen Molecules (O2)",
        description: "Diatomic oxygen molecules inhaled into the lungs.",
        material: "Neon-cyan Gas",
        function: "Diffuses across the respiratory membrane into the blood to bind with hemoglobin molecules.",
        assemblyOrder: 3,
        connections: ["Alveolar Sac", "Hemoglobin in Red Blood Cells"],
        failureEffect: "Hypoxemia, leading to rapid cellular energy depletion (ATP loss).",
        cascadeFailures: ["Multiple organ dysfunction syndrome", "Brain death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 }
    });

    // 4. Glowing Carbon Dioxide Molecules (CO2)
    const co2Geo = new THREE.SphereGeometry(0.15, 16, 16);
    const co2Group = new THREE.Group();
    const numCO2 = 30;
    const co2Data = [];
    for(let i=0; i<numCO2; i++) {
        const co2 = new THREE.Mesh(co2Geo, co2Mat);
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI * 2;
        co2.position.set(
            (3.2 + Math.cos(theta)*0.2) * Math.cos(phi),
            (3.2 + Math.cos(theta)*0.2) * Math.sin(phi),
            Math.sin(theta)*0.2
        );
        co2Group.add(co2);
        co2Data.push({ mesh: co2, angle: phi, rOff: theta });
    }
    group.add(co2Group);
    meshes.co2Molecules = co2Data;

    parts.push({
        name: "Carbon Dioxide Molecules (CO2)",
        description: "Metabolic waste gas produced by cellular respiration.",
        material: "Neon-green Gas",
        function: "Diffuses from the blood plasma into the alveoli to be expelled during exhalation.",
        assemblyOrder: 4,
        connections: ["Capillary Network", "Alveolar Sac"],
        failureEffect: "Hypercapnia and dangerous respiratory acidosis.",
        cascadeFailures: ["Central nervous system depression", "Coma", "Death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 }
    });

    // 5. Red Blood Cells (Erythrocytes)
    const rbcGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 32);
    const rbcPos = rbcGeo.attributes.position;
    for(let i=0; i<rbcPos.count; i++) {
        const x = rbcPos.getX(i);
        const y = rbcPos.getY(i);
        const z = rbcPos.getZ(i);
        const distSq = x*x + z*z;
        if(distSq < 0.08) {
            rbcPos.setY(i, y * 0.3); // Biconcave disk shape
        }
    }
    rbcGeo.computeVertexNormals();

    const rbcGroup = new THREE.Group();
    const numRBC = 20;
    const rbcData = [];
    for(let i=0; i<numRBC; i++) {
        const rbc = new THREE.Mesh(rbcGeo, rbcMat.clone()); // clone material to alter colors individually
        const angle = (i / numRBC) * Math.PI * 2;
        rbcGroup.add(rbc);
        rbcData.push({ mesh: rbc, angle: angle });
    }
    group.add(rbcGroup);
    meshes.redBloodCells = rbcData;

    parts.push({
        name: "Red Blood Cells",
        description: "Biconcave erythrocytes flowing continuously through the pulmonary capillaries.",
        material: "Biological Cells (Hemoglobin-rich)",
        function: "Binds to oxygen via hemoglobin and transports it to systemic tissues.",
        assemblyOrder: 5,
        connections: ["Capillary Network", "Oxygen Molecules (O2)", "Carbon Dioxide Molecules (CO2)"],
        failureEffect: "Anemia or complete inability to transport sufficient oxygen.",
        cascadeFailures: ["Severe fatigue", "Myocardial Ischemia", "Systemic tissue infarction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    const description = "The Alveolar Gas Exchange Simulator is a high-fidelity visualization of the critical physiological processes occurring deep within the lungs. Deoxygenated blood, rich in carbon dioxide, flows through the capillary networks that tightly envelop the alveolar sacs. Driven by steep partial pressure gradients, neon-cyan oxygen molecules diffuse from the alveoli across the extremely thin respiratory membrane into the blood, binding to hemoglobin in the red blood cells. Simultaneously, neon-green carbon dioxide molecules diffuse from the blood plasma into the alveoli to be expelled during exhalation.";

    const quizQuestions = [
        {
            question: "What physical force drives the diffusion of oxygen from the alveoli into the capillaries?",
            options: [
                "Active transport by ATP-driven protein pumps",
                "Partial pressure gradients",
                "Osmotic pressure from plasma proteins",
                "Facilitated diffusion via transmembrane carrier proteins"
            ],
            correct: 1,
            explanation: "Gas exchange occurs via simple, passive diffusion driven strictly by partial pressure gradients; oxygen moves from an area of higher partial pressure (alveoli) to lower partial pressure (capillary blood).",
            difficulty: "Medium"
        },
        {
            question: "Which specific component of the red blood cell reversibly binds to oxygen?",
            options: [
                "Mitochondrial cytochromes",
                "Myoglobin",
                "Hemoglobin",
                "Serum Albumin"
            ],
            correct: 2,
            explanation: "Hemoglobin is the specialized iron-containing metalloprotein in red blood cells that reversibly binds oxygen, allowing for massive transport capacity through the bloodstream.",
            difficulty: "Easy"
        },
        {
            question: "According to Fick's Law, why is the respiratory membrane exceptionally thin (approx. 0.5 micrometers)?",
            options: [
                "To reduce the overall weight and mass of the lungs",
                "To increase pulmonary blood pressure",
                "To minimize the diffusion distance for respiratory gases",
                "To rapidly secrete surfactant into the capillaries"
            ],
            correct: 2,
            explanation: "Fick's law of diffusion states that the rate of gas transfer is inversely proportional to the thickness of the membrane. An ultra-thin membrane maximizes gas exchange efficiency.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Breathing animation: Alveolar sac smoothly expands and contracts
        const scale = 1 + 0.15 * Math.sin(time * 2 * speed);
        meshes.alveolarSac.scale.set(scale, scale, scale);

        // RBCs flowing through capillaries and changing color (oxygenation)
        meshes.redBloodCells.forEach(rbc => {
            rbc.angle += speed * 0.8;
            const r = 3.2;
            rbc.mesh.position.set(
                r * Math.cos(rbc.angle),
                r * Math.sin(rbc.angle),
                0
            );
            rbc.mesh.position.applyEuler(new THREE.Euler(Math.PI/4, 0, 0)); // Flow along Capillary 1
            rbc.mesh.lookAt(new THREE.Vector3(0,0,0)); // Always face center roughly
            
            const normalizedAngle = (rbc.angle % (Math.PI*2));
            if(normalizedAngle > Math.PI) {
                // Oxygenated state (Bright neon red)
                rbc.mesh.material.color.setHex(0xff1111);
                rbc.mesh.material.emissive.setHex(0xaa0000);
            } else {
                // Deoxygenated state (Dark purplish red)
                rbc.mesh.material.color.setHex(0x440022);
                rbc.mesh.material.emissive.setHex(0x110000);
            }
        });

        // Glowing Oxygen molecules animation (Diffusion)
        meshes.o2Molecules.forEach(o2 => {
            const cycle = (time * speed + o2.phi) % 6; 
            if(cycle < 2.5) {
                // Inside sac: random gas movement scaling with breathing
                const r = o2.startR * scale;
                o2.mesh.position.setFromSphericalCoords(r, o2.phi, o2.theta);
                o2.mesh.material.emissiveIntensity = 1.0;
                o2.mesh.visible = true;
            } else if(cycle < 4) {
                // Diffusing outwards through the membrane into the capillary
                const t = (cycle - 2.5) / 1.5;
                const targetR = 3.2; // Capillary radius
                const currentR = (o2.startR * scale) + t * (targetR - (o2.startR * scale));
                o2.mesh.position.setFromSphericalCoords(currentR, o2.phi, o2.theta);
                o2.mesh.material.emissiveIntensity = 2.0 + 1.0 * Math.sin(time * 15); // Intense glowing flash as it crosses
            } else {
                // Picked up by RBC / blood flow -> disappears temporarily
                o2.mesh.visible = false;
            }
        });

        // Glowing Carbon Dioxide molecules animation (Diffusion)
        meshes.co2Molecules.forEach(co2 => {
            const cycle = (time * speed + co2.angle) % 6;
            if(cycle < 2) {
                // Flowing along capillary from blood
                const r = 3.2;
                co2.mesh.position.set(
                    (r + Math.cos(co2.rOff)*0.2) * Math.cos(co2.angle - time*speed*0.5),
                    (r + Math.cos(co2.rOff)*0.2) * Math.sin(co2.angle - time*speed*0.5),
                    Math.sin(co2.rOff)*0.2
                );
                co2.mesh.position.applyEuler(new THREE.Euler(-Math.PI/4, Math.PI/2, 0)); // Flow along Capillary 2
                co2.mesh.visible = true;
                co2.mesh.material.emissiveIntensity = 1.0;
            } else if(cycle < 3.5) {
                // Diffusing inward into the alveolar sac
                const t = (cycle - 2) / 1.5;
                const startPos = co2.mesh.position.clone();
                startPos.lerp(new THREE.Vector3(0,0,0), t * 0.08); // Move radially inward
                co2.mesh.position.copy(startPos);
                co2.mesh.material.emissiveIntensity = 2.0 + 1.0 * Math.sin(time * 15); // Flash on crossing
            } else {
                // Inside sac, ready to be exhaled
                co2.mesh.visible = false;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createAlveoli() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
