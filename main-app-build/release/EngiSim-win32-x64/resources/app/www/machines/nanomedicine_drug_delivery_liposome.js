import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        outerShell: null,
        innerShell: null,
        payloads: [],
        antibodies: [],
        pegChains: [],
        thrusters: [],
        cholesterol: [],
        processor: null,
        energyCells: [],
        sensors: [],
        ribs: [],
        valves: [],
        tethers: []
    };

    // --- HYPER-REALISTIC & GLOWING CUSTOM MATERIALS ---
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, wireframe: false, roughness: 0.2, metalness: 0.8
    });
    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.5
    });
    const neonYellow = new THREE.MeshStandardMaterial({
        color: 0xffff00, emissive: 0xffffaa, emissiveIntensity: 1.2, roughness: 0.1, metalness: 0.9
    });
    const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 1.0, transparent: true, opacity: 0.6
    });
    const transparentLipid = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.4, side: THREE.DoubleSide
    });
    const innerLipid = new THREE.MeshPhysicalMaterial({
        color: 0x4488aa, transmission: 0.5, opacity: 0.8, transparent: true, roughness: 0.4, side: THREE.DoubleSide
    });
    const bioluminescent = new THREE.MeshStandardMaterial({
        color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 2.5
    });
    const payloadMat = new THREE.MeshStandardMaterial({
        color: 0xff3300, emissive: 0xaa1100, emissiveIntensity: 1.8, roughness: 0.3, metalness: 0.7
    });

    // --- UTILITY FUNCTIONS ---
    function getSphericalPos(radius, phi, theta) {
        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // --- COMPONENT BUILDERS ---

    // 1. & 2. Lipid Bilayer Shells
    const outerRadius = 25;
    const innerRadius = 22;
    
    // High-poly Icosahedron for realistic uneven biological surface
    const outerGeo = new THREE.IcosahedronGeometry(outerRadius, 8);
    const outerShell = new THREE.Mesh(outerGeo, transparentLipid);
    group.add(outerShell);
    meshes.outerShell = outerShell;

    const innerGeo = new THREE.IcosahedronGeometry(innerRadius, 6);
    const innerShell = new THREE.Mesh(innerGeo, innerLipid);
    group.add(innerShell);
    meshes.innerShell = innerShell;

    // 3. Structural Scaffold Ribs (Reinforcement inside inner shell)
    const ribGeo = new THREE.TorusGeometry(innerRadius - 0.5, 0.4, 16, 100);
    for (let i = 0; i < 3; i++) {
        const rib = new THREE.Mesh(ribGeo, darkSteel);
        if (i === 0) rib.rotation.x = Math.PI / 2;
        if (i === 1) rib.rotation.y = Math.PI / 2;
        group.add(rib);
        meshes.ribs.push(rib);
    }

    // 4. Quantum Processor Node (Center Core)
    const procGroup = new THREE.Group();
    const procCoreGeo = new THREE.DodecahedronGeometry(3, 1);
    const procCore = new THREE.Mesh(procCoreGeo, chrome);
    procGroup.add(procCore);

    const procRingGeo = new THREE.TorusGeometry(5, 0.2, 16, 64);
    const procRing = new THREE.Mesh(procRingGeo, neonCyan);
    procRing.rotation.x = Math.PI / 2;
    procGroup.add(procRing);

    group.add(procGroup);
    meshes.processor = procGroup;

    // 5. Hydrophilic Payload (DNA/RNA complex inside core)
    for (let i = 0; i < 6; i++) {
        const dnaGroup = new THREE.Group();
        const helixPoints1 = [];
        const helixPoints2 = [];
        for (let j = 0; j < 20; j++) {
            const t = j * 0.5;
            helixPoints1.push(new THREE.Vector3(Math.cos(t)*1.5, j*0.5 - 5, Math.sin(t)*1.5));
            helixPoints2.push(new THREE.Vector3(Math.cos(t+Math.PI)*1.5, j*0.5 - 5, Math.sin(t+Math.PI)*1.5));
        }
        const helixCurve1 = new THREE.CatmullRomCurve3(helixPoints1);
        const helixCurve2 = new THREE.CatmullRomCurve3(helixPoints2);
        
        const tubeGeo1 = new THREE.TubeGeometry(helixCurve1, 64, 0.2, 8, false);
        const tubeGeo2 = new THREE.TubeGeometry(helixCurve2, 64, 0.2, 8, false);
        
        const strand1 = new THREE.Mesh(tubeGeo1, payloadMat);
        const strand2 = new THREE.Mesh(tubeGeo2, bioluminescent);
        
        dnaGroup.add(strand1);
        dnaGroup.add(strand2);
        
        dnaGroup.position.set(
            randomRange(-10, 10),
            randomRange(-10, 10),
            randomRange(-10, 10)
        );
        dnaGroup.rotation.set(randomRange(0, Math.PI), randomRange(0, Math.PI), 0);
        
        group.add(dnaGroup);
        meshes.payloads.push(dnaGroup);
    }

    // 6. Energy Cells (Micro-batteries around processor)
    const cellGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    for (let i = 0; i < 8; i++) {
        const cell = new THREE.Mesh(cellGeo, copper);
        const angle = (i / 8) * Math.PI * 2;
        cell.position.set(Math.cos(angle) * 8, 0, Math.sin(angle) * 8);
        cell.rotation.x = Math.PI / 2;
        cell.rotation.z = angle;
        group.add(cell);
        meshes.energyCells.push(cell);
    }

    // 7. Targeting Ligands (Antibodies on surface)
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const branchGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    for (let i = 0; i < 40; i++) {
        const phi = Math.acos(-1 + (2 * i) / 40);
        const theta = Math.sqrt(40 * Math.PI) * phi;
        
        const abGroup = new THREE.Group();
        
        const stem = new THREE.Mesh(stemGeo, rubber);
        stem.position.y = 1.5;
        
        const leftBranch = new THREE.Mesh(branchGeo, neonYellow);
        leftBranch.position.set(-0.7, 3.5, 0);
        leftBranch.rotation.z = Math.PI / 4;
        
        const rightBranch = new THREE.Mesh(branchGeo, neonYellow);
        rightBranch.position.set(0.7, 3.5, 0);
        rightBranch.rotation.z = -Math.PI / 4;
        
        abGroup.add(stem, leftBranch, rightBranch);
        
        const pos = getSphericalPos(outerRadius, phi, theta);
        abGroup.position.copy(pos);
        abGroup.lookAt(new THREE.Vector3(0,0,0));
        abGroup.rotateX(Math.PI / 2); // point outwards
        
        group.add(abGroup);
        meshes.antibodies.push(abGroup);
    }

    // 8. PEGylation Polymers (Stealth Coating)
    for (let i = 0; i < 150; i++) {
        const phi = randomRange(0, Math.PI);
        const theta = randomRange(0, Math.PI * 2);
        const pos = getSphericalPos(outerRadius, phi, theta);
        
        const points = [];
        let currentPos = pos.clone();
        const normal = pos.clone().normalize();
        
        for (let j = 0; j < 5; j++) {
            points.push(currentPos.clone());
            currentPos.add(normal.clone().multiplyScalar(1.5));
            currentPos.add(new THREE.Vector3(randomRange(-0.5, 0.5), randomRange(-0.5, 0.5), randomRange(-0.5, 0.5)));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        const peg = new THREE.Mesh(tubeGeo, glass);
        group.add(peg);
        meshes.pegChains.push(peg);
    }

    // 9. Nano-Propulsion Thrusters
    const thrusterBaseGeo = new THREE.CylinderGeometry(1.5, 1.2, 2, 32);
    const thrusterRingGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
    for (let i = 0; i < 12; i++) {
        // Place at specific icosahedron-like vertices for symmetry
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        const pos = getSphericalPos(outerRadius, phi, theta);
        
        const tGroup = new THREE.Group();
        
        const base = new THREE.Mesh(thrusterBaseGeo, chrome);
        const ring = new THREE.Mesh(thrusterRingGeo, neonCyan);
        ring.position.y = 1;
        ring.rotation.x = Math.PI / 2;
        
        const exhaustGeo = new THREE.ConeGeometry(1, 3, 16);
        const exhaust = new THREE.Mesh(exhaustGeo, bioluminescent);
        exhaust.position.y = 2.5;
        
        tGroup.add(base, ring, exhaust);
        
        tGroup.position.copy(pos);
        tGroup.lookAt(new THREE.Vector3(0,0,0));
        tGroup.rotateX(-Math.PI / 2);
        
        group.add(tGroup);
        meshes.thrusters.push(tGroup);
    }

    // 10. Sensor Receptors
    const sensorGeo = new THREE.CylinderGeometry(2, 0.5, 1, 32);
    for (let i = 0; i < 6; i++) {
        const phi = randomRange(0, Math.PI);
        const theta = randomRange(0, Math.PI * 2);
        const pos = getSphericalPos(outerRadius, phi, theta);
        
        const sensor = new THREE.Mesh(sensorGeo, tinted);
        sensor.position.copy(pos);
        sensor.lookAt(new THREE.Vector3(0,0,0));
        sensor.rotateX(Math.PI / 2);
        
        // Add glowing center
        const glowCore = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), neonMagenta);
        glowCore.position.y = 0.5;
        sensor.add(glowCore);
        
        group.add(sensor);
        meshes.sensors.push(sensor);
    }

    // 11. Cholesterol Stabilizers
    const cholGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    for (let i = 0; i < 100; i++) {
        const phi = randomRange(0, Math.PI);
        const theta = randomRange(0, Math.PI * 2);
        const pos = getSphericalPos((outerRadius + innerRadius)/2, phi, theta);
        
        const chol = new THREE.Mesh(cholGeo, plastic);
        chol.position.copy(pos);
        chol.lookAt(new THREE.Vector3(0,0,0));
        chol.rotateX(Math.PI / 2);
        
        group.add(chol);
        meshes.cholesterol.push(chol);
    }

    // 12. Payload Release Valves
    const valveGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.5, 32);
    for (let i = 0; i < 4; i++) {
        const phi = Math.PI / 2;
        const theta = (i / 4) * Math.PI * 2;
        const pos = getSphericalPos(outerRadius, phi, theta);
        
        const valve = new THREE.Mesh(valveGeo, darkSteel);
        valve.position.copy(pos);
        valve.lookAt(new THREE.Vector3(0,0,0));
        valve.rotateX(Math.PI / 2);
        
        const irisGeo = new THREE.CircleGeometry(2, 8);
        const iris = new THREE.Mesh(irisGeo, steel);
        iris.position.y = 0.8;
        iris.rotation.x = -Math.PI / 2;
        valve.add(iris);
        
        group.add(valve);
        meshes.valves.push(valve);
    }

    // 13. Data Transceiver Nodes
    const transGeo = new THREE.ConeGeometry(0.5, 4, 16);
    for(let i=0; i<3; i++) {
        const phi = Math.PI / 4;
        const theta = (i/3) * Math.PI * 2;
        const pos = getSphericalPos(outerRadius, phi, theta);
        
        const transceiver = new THREE.Mesh(transGeo, copper);
        transceiver.position.copy(pos);
        transceiver.lookAt(new THREE.Vector3(0,0,0));
        transceiver.rotateX(-Math.PI / 2);
        
        group.add(transceiver);
    }

    // 14. Internal Tether Network
    for(let i=0; i<8; i++) {
        const start = new THREE.Vector3(0,0,0);
        const angle = (i/8) * Math.PI * 2;
        const end = new THREE.Vector3(Math.cos(angle)*innerRadius, Math.sin(angle)*innerRadius, 0);
        
        const points = [start, end];
        const curve = new THREE.LineCurve3(start, end);
        const tube = new THREE.TubeGeometry(curve, 8, 0.1, 8, false);
        const tether = new THREE.Mesh(tube, neonCyan);
        group.add(tether);
        meshes.tethers.push(tether);
    }

    // 15. Hydrophobic Payload (Membrane Integrated)
    const hydroPayloadGeo = new THREE.TorusGeometry(1, 0.4, 16, 32);
    for(let i=0; i<20; i++) {
        const phi = randomRange(0, Math.PI);
        const theta = randomRange(0, Math.PI * 2);
        const pos = getSphericalPos(23.5, phi, theta);
        
        const hydro = new THREE.Mesh(hydroPayloadGeo, neonMagenta);
        hydro.position.copy(pos);
        hydro.lookAt(new THREE.Vector3(0,0,0));
        group.add(hydro);
    }

    // --- PARTS METADATA ---
    parts.push(
        {
            name: "Outer Lipid Monolayer",
            description: "The primary protective barrier constructed from synthetic phospholipids to evade immediate immune detection.",
            material: "Transparent Lipid / Phosphatidylcholine",
            function: "Encapsulates the internal environment, providing structural integrity against hemodynamic shear forces.",
            assemblyOrder: 1,
            connections: ["Inner Lipid Monolayer", "Targeting Ligands", "PEGylation Polymers", "Cholesterol Stabilizers"],
            failureEffect: "Premature rupture leading to unintended payload release in non-target tissues.",
            cascadeFailures: ["Loss of internal pressure", "Payload degradation", "Complete mission failure"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 40, z: 0 }
        },
        {
            name: "Inner Lipid Monolayer",
            description: "The secondary barrier forming the aqueous core boundary.",
            material: "Synthetic Lipid Array",
            function: "Maintains the internal chemical micro-environment necessary for hydrophilic payload stability.",
            assemblyOrder: 2,
            connections: ["Outer Lipid Monolayer", "Structural Scaffold Ribs", "Internal Tether Network"],
            failureEffect: "Osmotic imbalance and core collapse.",
            cascadeFailures: ["Hydrophilic payload denaturation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -40, z: 0 }
        },
        {
            name: "Hydrophilic Drug Payload",
            description: "Complex DNA/RNA therapeutic strands suspended within the aqueous core.",
            material: "Bioluminescent Genetic Material",
            function: "Delivers gene-editing or therapeutic instructions directly to the diseased cell nucleus.",
            assemblyOrder: 12,
            connections: ["Inner Aqueous Core"],
            failureEffect: "Ineffective treatment, failure to alter cellular function.",
            cascadeFailures: ["None directly, but negates the entire purpose of the machine."],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 30, y: 0, z: -30 }
        },
        {
            name: "Hydrophobic Drug Payload",
            description: "Therapeutic molecules embedded directly between the lipid monolayers.",
            material: "Neon Magenta Synthetic Compounds",
            function: "Releases secondary therapeutic agents targeting the cell membrane upon liposome fusion.",
            assemblyOrder: 3,
            connections: ["Outer Lipid Monolayer", "Inner Lipid Monolayer"],
            failureEffect: "Reduced synergistic therapeutic effect.",
            cascadeFailures: ["Decreased overall efficacy"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -30, y: 0, z: 30 }
        },
        {
            name: "Targeting Ligands (Antibodies)",
            description: "Y-shaped surface proteins engineered to recognize specific biomarkers.",
            material: "Rubber & Neon Yellow Polymers",
            function: "Ensures the liposome binds exclusively to specific diseased cell receptors (e.g., tumor antigens).",
            assemblyOrder: 5,
            connections: ["Outer Lipid Monolayer"],
            failureEffect: "Inability to bind to target cells; random systemic circulation.",
            cascadeFailures: ["Eventual clearance by liver/spleen without delivering payload"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 60, z: 0 }
        },
        {
            name: "PEGylation Polymers",
            description: "Wavy, flexible polyethylene glycol chains blanketing the outer surface.",
            material: "Glass-like Hydrophilic Polymer",
            function: "Creates a 'stealth' hydration layer that prevents immune system opsonization.",
            assemblyOrder: 6,
            connections: ["Outer Lipid Monolayer"],
            failureEffect: "Rapid recognition and destruction by macrophages.",
            cascadeFailures: ["Complete mission failure prior to reaching target"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 50, y: 50, z: 50 }
        },
        {
            name: "Cholesterol Stabilizers",
            description: "Rigid molecular structures bridging the inner and outer monolayers.",
            material: "Plastic/Steroid Matrix",
            function: "Regulates membrane fluidity, preventing premature leakage of the payload.",
            assemblyOrder: 4,
            connections: ["Outer Lipid Monolayer", "Inner Lipid Monolayer"],
            failureEffect: "Membrane becomes too permeable or overly rigid.",
            cascadeFailures: ["Payload leakage", "Inability to fuse with target cell"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 40, y: 0, z: 0 }
        },
        {
            name: "Nano-Propulsion Thrusters",
            description: "Advanced bio-compatible micro-engines.",
            material: "Chrome & Bioluminescent Plasma",
            function: "Provides active vectoring and mobility through dense biological fluids.",
            assemblyOrder: 7,
            connections: ["Outer Lipid Monolayer", "Energy Cells"],
            failureEffect: "Loss of active mobility, relying solely on passive blood flow.",
            cascadeFailures: ["Significantly increased time to target"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -50, y: -50, z: -50 }
        },
        {
            name: "Quantum Processor Node",
            description: "The computational core of the hybrid nanobot.",
            material: "Chrome & Neon Cyan Circuitry",
            function: "Processes sensor data, controls thrusters, and authorizes payload release.",
            assemblyOrder: 10,
            connections: ["Internal Tether Network", "Energy Cells", "Data Transceiver Nodes"],
            failureEffect: "Loss of all autonomous functions.",
            cascadeFailures: ["Navigation failure", "Valve lockout"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 50 }
        },
        {
            name: "Energy Cells",
            description: "Bio-galvanic micro-batteries drawing power from ambient glucose.",
            material: "Copper",
            function: "Supplies continuous electrical power to the processor and thrusters.",
            assemblyOrder: 11,
            connections: ["Quantum Processor Node", "Nano-Propulsion Thrusters"],
            failureEffect: "Power starvation.",
            cascadeFailures: ["Processor shutdown", "Thruster failure", "Sensor blindness"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -20, z: 30 }
        },
        {
            name: "Sensor Receptors",
            description: "Dish-like environmental analysis arrays.",
            material: "Tinted Glass & Neon Magenta",
            function: "Detects chemical gradients, pH levels, and proximity to target biomarkers.",
            assemblyOrder: 8,
            connections: ["Outer Lipid Monolayer", "Quantum Processor Node"],
            failureEffect: "Blindness to local chemical environments.",
            cascadeFailures: ["Inability to verify target acquisition"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -60 }
        },
        {
            name: "Structural Scaffold Ribs",
            description: "Metallic reinforcing torus networks inside the liposome.",
            material: "Dark Steel",
            function: "Prevents mechanical crushing under high vascular pressure.",
            assemblyOrder: 13,
            connections: ["Inner Lipid Monolayer"],
            failureEffect: "Structural collapse of the liposome.",
            cascadeFailures: ["Catastrophic payload expulsion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -40, y: 40, z: -40 }
        },
        {
            name: "Data Transceiver Nodes",
            description: "Communication spikes penetrating the membrane.",
            material: "Copper",
            function: "Allows swarm intelligence and coordination between millions of identical nanobots.",
            assemblyOrder: 9,
            connections: ["Quantum Processor Node", "Outer Lipid Monolayer"],
            failureEffect: "Isolation from the nanobot swarm.",
            cascadeFailures: ["Decreased collective targeting efficiency"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 60, y: -20, z: 0 }
        },
        {
            name: "Payload Release Valves",
            description: "Iris-controlled physical ejection ports.",
            material: "Dark Steel & Steel",
            function: "Mechanically opens to forcefully inject payloads upon successful target binding.",
            assemblyOrder: 14,
            connections: ["Outer Lipid Monolayer", "Inner Lipid Monolayer", "Quantum Processor Node"],
            failureEffect: "Valves jam closed.",
            cascadeFailures: ["Payload cannot be delivered even if target is reached"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -60, y: 20, z: 0 }
        },
        {
            name: "Internal Tether Network",
            description: "Glowing fiber-optic lines anchoring the core components to the shell.",
            material: "Neon Cyan Optic Cabling",
            function: "Provides physical stabilization and high-speed data transfer from shell sensors to the central processor.",
            assemblyOrder: 15,
            connections: ["Inner Lipid Monolayer", "Quantum Processor Node"],
            failureEffect: "Core displacement during extreme maneuvering.",
            cascadeFailures: ["Data lag", "Processor damage"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -50, z: -50 }
        }
    );

    const description = "The Advanced Drug Delivery Liposome is a marvel of hybrid nanomedicine, blending biological lipid structures with highly advanced bionic nanotechnology. Equipped with stealth PEGylation, targeting antibodies, and quantum-processed active propulsion, it navigates the human vasculature to deliver complex genetic payloads directly into diseased cells with unparalleled precision.";

    const quizQuestions = [
        {
            question: "What is the primary function of the PEGylation Polymers in this advanced liposome design?",
            options: [
                "To increase the speed of the nanobot in the bloodstream.",
                "To provide a stealth coating that evades the host's immune system.",
                "To physically puncture target cell membranes.",
                "To generate electrical power for the Quantum Processor."
            ],
            correctAnswer: 1,
            explanation: "Polyethylene glycol (PEG) chains create a hydrophilic steric barrier that prevents opsonization and clearance by the reticuloendothelial system, significantly increasing circulation time."
        },
        {
            question: "How do Targeting Ligands (Antibodies) improve the efficacy of nanomedicines?",
            options: [
                "By binding exclusively to specific biomarkers on diseased cells.",
                "By hardening the outer shell against shear forces.",
                "By dissolving blood clots in the path of the liposome.",
                "By acting as secondary thrusters."
            ],
            correctAnswer: 0,
            explanation: "Targeting ligands are engineered to recognize and bind to overexpressed receptors on target cells (e.g., cancer cells), ensuring the drug is delivered only where needed, reducing systemic toxicity."
        },
        {
            question: "What role does Cholesterol play in the lipid bilayer?",
            options: [
                "It serves as the primary energy source for the micro-batteries.",
                "It provides structural stability and regulates membrane fluidity.",
                "It acts as the primary therapeutic payload.",
                "It communicates with other nanobots."
            ],
            correctAnswer: 1,
            explanation: "Cholesterol molecules intercalate between phospholipids, preventing the membrane from becoming too fluid at body temperature and reducing the premature leakage of the encapsulated drugs."
        },
        {
            question: "Why is an inner aqueous core essential for this machine?",
            options: [
                "To cool down the Quantum Processor.",
                "To encapsulate hydrophilic (water-soluble) drugs that cannot dissolve in lipids.",
                "To provide buoyancy in the bloodstream.",
                "To act as a shock absorber during cellular collisions."
            ],
            correctAnswer: 1,
            explanation: "The aqueous core is vital for carrying hydrophilic therapeutic agents, such as DNA, RNA, or certain proteins, which would otherwise be incompatible with the hydrophobic lipid bilayer."
        },
        {
            question: "In this advanced hybrid liposome, what triggers the Payload Release Valves?",
            options: [
                "A random timer set during manufacturing.",
                "External magnetic fields applied by a doctor.",
                "Authorization from the Quantum Processor upon confirming target binding via sensors.",
                "Immune system macrophages attempting to eat the liposome."
            ],
            correctAnswer: 2,
            explanation: "The Quantum Processor analyzes data from the Sensor Receptors and, upon positive confirmation of target cell biomarkers, sends a signal to actuate the Payload Release Valves, ensuring zero collateral damage."
        }
    ];

    // --- ANIMATION LOOP ---
    function animate(time, speed, activeMeshes = meshes) {
        const t = time * speed;
        
        // Global rotation
        group.rotation.y = t * 0.1;
        group.rotation.x = Math.sin(t * 0.05) * 0.2;

        // Pulse the processor core
        if (activeMeshes.processor) {
            const scale = 1 + Math.sin(t * 4) * 0.15;
            activeMeshes.processor.scale.set(scale, scale, scale);
            activeMeshes.processor.rotation.z = t * 0.5;
            activeMeshes.processor.rotation.x = t * 0.3;
        }

        // Wiggle the stealth PEG chains organically
        if (activeMeshes.pegChains) {
            activeMeshes.pegChains.forEach((chain, i) => {
                chain.rotation.x = Math.sin(t * 2 + i) * 0.1;
                chain.rotation.z = Math.cos(t * 2.5 + i) * 0.1;
            });
        }

        // Rotate thruster exhausts
        if (activeMeshes.thrusters) {
            activeMeshes.thrusters.forEach((thruster, i) => {
                // Thruster exhausts pulsate and spin
                const exhaust = thruster.children[2];
                if(exhaust) {
                    exhaust.rotation.y = t * 10;
                    exhaust.scale.y = 1 + Math.sin(t * 15 + i) * 0.2;
                }
            });
        }

        // Animate DNA payloads floating in the core
        if (activeMeshes.payloads) {
            activeMeshes.payloads.forEach((payload, i) => {
                payload.rotation.y += 0.02 * speed;
                payload.rotation.x += 0.01 * speed;
                payload.position.y += Math.sin(t * 3 + i) * 0.03;
            });
        }

        // Pulse tethers
        if (activeMeshes.tethers) {
            activeMeshes.tethers.forEach((tether, i) => {
                tether.material.emissiveIntensity = 0.5 + Math.sin(t * 5 - i) * 0.5;
            });
        }
        
        // Wobble Receptors/Antibodies
        if (activeMeshes.antibodies) {
            activeMeshes.antibodies.forEach((ab, i) => {
                ab.rotation.z = Math.sin(t * 3 + i) * 0.05;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDrugDeliveryLiposome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
