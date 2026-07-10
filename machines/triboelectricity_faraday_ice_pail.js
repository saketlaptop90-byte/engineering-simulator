import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animRefs = {};

    // Custom Materials for Hyper-Realism
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.2 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const wireframeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.5 });
    
    const description = "The Faraday Ice Pail experiment is a masterclass demonstration of electrostatic induction and charge conservation. This hyper-advanced setup features a precision-machined hollow aluminum cylinder (the 'ice pail') mounted on high-grade ribbed synthetic rubber insulators, a fully automated robotic crane to manipulate a high-voltage charged brass sphere, and an ultra-sensitive vacuum-sealed gold-leaf electroscope. Advanced digital telemetry monitors charge transfer in real time. When the charged sphere is lowered into the hollow pail, it induces an equal and opposite charge on the inner wall, forcing an identical charge to the outer wall and down to the electroscope, causing the gold leaves to fiercely repel each other. Touching the sphere to the inner wall completes the transfer.";

    const quizQuestions = [
        {
            question: "What happens to the gold leaves of the electroscope when the positively charged sphere is lowered into the ice pail without touching it?",
            options: [
                "They diverge because positive charge is induced on the outer surface.",
                "They collapse because the electric field is shielded.",
                "They diverge because negative charge is transferred to them.",
                "They vibrate continuously due to alternating currents."
            ],
            answer: 0,
            explanation: "The positively charged sphere induces a negative charge on the inner wall of the pail, forcing the remaining positive charge to the outer wall and down to the electroscope, making the leaves repel."
        },
        {
            question: "If the charged sphere touches the inside of the pail, what happens to the charge on the sphere?",
            options: [
                "It becomes completely neutral.",
                "Its charge doubles.",
                "Its charge remains the same.",
                "It reverses polarity."
            ],
            answer: 0,
            explanation: "Inside a closed conductor, all excess charge resides purely on the outer surface. When the sphere touches the inside, it becomes part of the interior and loses all its charge to the outer surface."
        },
        {
            question: "After the sphere touches the inside and is removed, what is the state of the electroscope?",
            options: [
                "The leaves remain diverged.",
                "The leaves collapse immediately.",
                "The leaves alternate between diverging and collapsing.",
                "The electroscope becomes permanently grounded."
            ],
            answer: 0,
            explanation: "The charge has permanently transferred to the exterior of the pail and electroscope. Since the net charge remains on the outer surfaces, the leaves stay diverged even after the neutral sphere is removed."
        },
        {
            question: "Why is the Faraday Ice Pail placed on an intricate insulating stand?",
            options: [
                "To prevent the induced charge from leaking to the ground.",
                "To keep the aluminum pail thermally regulated.",
                "To increase the overall capacitance of the system.",
                "To shield it from ambient magnetic fields."
            ],
            answer: 0,
            explanation: "The insulator prevents the charge on the outer surface of the pail from flowing into the ground, ensuring it correctly travels to the electroscope for accurate measurement."
        },
        {
            question: "What underlying physics principle dictates that the induced charge on the inner wall is exactly equal in magnitude to the charge on the sphere?",
            options: [
                "Gauss's Law",
                "Faraday's Law of Induction",
                "Ohm's Law",
                "Ampere's Law"
            ],
            answer: 0,
            explanation: "According to Gauss's Law, if you draw a Gaussian surface inside the conducting material of the pail (where the electric field is zero), the net enclosed charge must be zero. Therefore, inner wall charge + sphere charge = 0."
        }
    ];

    // ==========================================
    // 1. BASE PLATFORM & ENVIRONMENT
    // ==========================================
    const baseGeo = new THREE.CylinderGeometry(25, 26, 3, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = -1.5;
    group.add(baseMesh);

    // Platform details (rivets, grating, hex bolts)
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const rivetGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 6);
        const rivet = new THREE.Mesh(rivetGeo, chrome);
        rivet.position.set(Math.cos(angle) * 24, 1.5, Math.sin(angle) * 24);
        baseMesh.add(rivet);
    }
    
    // Glowing alignment ring
    const gratingGeo = new THREE.TorusGeometry(23, 0.15, 16, 64);
    const grating = new THREE.Mesh(gratingGeo, neonBlue);
    grating.rotation.x = Math.PI / 2;
    grating.position.y = 1.6;
    baseMesh.add(grating);

    parts.push({
        name: "Main Seismic Isolation Platform",
        description: "A heavy, active vibration-dampened dark steel platform. It thoroughly isolates the delicate electrostatic components from seismic anomalies and grounding loops.",
        material: "darkSteel",
        function: "Structural support and environmental isolation.",
        assemblyOrder: 1,
        connections: ["Insulating Stand", "Electroscope Base", "Crane Assembly"],
        failureEffect: "System instability and measurement noise.",
        cascadeFailures: ["Electroscope miscalibration", "Crane misalignment"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // 2. INSULATING STAND & PAIL BASE
    // ==========================================
    const standGroup = new THREE.Group();
    standGroup.position.set(-8, 0, 0);
    group.add(standGroup);

    const standBaseGeo = new THREE.CylinderGeometry(6, 7, 2, 32);
    const standBase = new THREE.Mesh(standBaseGeo, steel);
    standBase.position.y = 1;
    standGroup.add(standBase);

    // Complex insulator pillars with creepage ribs
    for(let i=0; i<4; i++){
        const angle = (i/4) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.8, 1.2, 6, 16);
        const pillar = new THREE.Mesh(pillarGeo, rubber);
        pillar.position.set(Math.cos(angle)*4, 4, Math.sin(angle)*4);
        
        // Glass ribs for electrical tracking prevention
        for(let j=0; j<6; j++){
            const ribGeo = new THREE.TorusGeometry(1.6, 0.25, 16, 32);
            const rib = new THREE.Mesh(ribGeo, glass);
            rib.rotation.x = Math.PI / 2;
            rib.position.y = -2.5 + j * 1;
            pillar.add(rib);
        }
        standGroup.add(pillar);
    }

    const standTopGeo = new THREE.CylinderGeometry(5.5, 6, 1, 32);
    const standTop = new THREE.Mesh(standTopGeo, plastic);
    standTop.position.y = 7.5;
    standGroup.add(standTop);

    parts.push({
        name: "High-Voltage Dielectric Stand",
        description: "Constructed of synthetic rubber and ribbed tempered glass to maximize creepage distance. Prevents multi-kilovolt charges from sparking to the ground.",
        material: "rubber/glass",
        function: "Absolute electrical isolation of the ice pail.",
        assemblyOrder: 2,
        connections: ["Main Isolation Platform", "Faraday Ice Pail"],
        failureEffect: "Massive charge leakage to ground.",
        cascadeFailures: ["Zero reading on electroscope", "False negative measurement"],
        originalPosition: { x: -8, y: 3.5, z: 0 },
        explodedPosition: { x: -8, y: 15, z: 15 }
    });

    // ==========================================
    // 3. FARADAY ICE PAIL & INTERNAL MESH
    // ==========================================
    const pailPoints = [];
    pailPoints.push(new THREE.Vector2(0, 0));
    pailPoints.push(new THREE.Vector2(4.5, 0));
    pailPoints.push(new THREE.Vector2(5.5, 12)); // Inner taper
    pailPoints.push(new THREE.Vector2(6, 12));   // Rim top
    pailPoints.push(new THREE.Vector2(6.5, 11.5)); // Rim outer edge
    pailPoints.push(new THREE.Vector2(5.5, 0));
    pailPoints.push(new THREE.Vector2(5.5, -0.5)); // Outer bottom
    pailPoints.push(new THREE.Vector2(0, -0.5));

    const pailGeo = new THREE.LatheGeometry(pailPoints, 64);
    const pailMesh = new THREE.Mesh(pailGeo, aluminum);
    pailMesh.position.y = 8;
    standGroup.add(pailMesh);

    // Pail handles/mounts for the connection wire
    const handleMountGeo = new THREE.BoxGeometry(2, 2, 2.5);
    const handleMount1 = new THREE.Mesh(handleMountGeo, steel);
    handleMount1.position.set(6, 10, 0);
    pailMesh.add(handleMount1);
    
    // Internal conductive mesh (to ensure perfectly uniform charge capture)
    const innerMeshGeo = new THREE.CylinderGeometry(4.4, 5.4, 11, 32, 1, true);
    const innerMesh = new THREE.Mesh(innerMeshGeo, wireframeMat);
    innerMesh.position.y = 6;
    pailMesh.add(innerMesh);

    parts.push({
        name: "Hollow Aluminum Pail",
        description: "The core Faraday cavity of the experiment. Its hollow geometry allows external and internal electrostatic charge distributions to separate strictly.",
        material: "aluminum",
        function: "Conductive cavity to capture and isolate induced charge.",
        assemblyOrder: 3,
        connections: ["Dielectric Stand", "Induction Wire"],
        failureEffect: "Unable to properly separate charges.",
        cascadeFailures: ["Experiment failure"],
        originalPosition: { x: -8, y: 8, z: 0 },
        explodedPosition: { x: -8, y: 30, z: 0 }
    });

    parts.push({
        name: "Internal Conduction Mesh",
        description: "A highly conductive fine wire mesh lining the interior of the ice pail, ensuring extremely uniform charge distribution when the sphere touches the inner wall.",
        material: "aluminum/copper",
        function: "Immediate and total charge absorption.",
        assemblyOrder: 4,
        connections: ["Hollow Aluminum Pail"],
        failureEffect: "Localized charge pockets.",
        cascadeFailures: ["Incomplete charge transfer"],
        originalPosition: { x: -8, y: 14, z: 0 },
        explodedPosition: { x: -8, y: 35, z: 0 }
    });

    // ==========================================
    // 4. PRECISION ELECTROSCOPE
    // ==========================================
    const electroGroup = new THREE.Group();
    electroGroup.position.set(10, 0, 8);
    group.add(electroGroup);

    // Base
    const eBaseGeo = new THREE.CylinderGeometry(4, 4.5, 1.5, 32);
    const eBase = new THREE.Mesh(eBaseGeo, darkSteel);
    eBase.position.y = 0.75;
    electroGroup.add(eBase);

    // Dials and glowing readouts
    const dialGeo = new THREE.CylinderGeometry(0.8, 1, 0.5, 16);
    const dial = new THREE.Mesh(dialGeo, plastic);
    dial.position.set(0, 1.5, 3.5);
    dial.rotation.x = Math.PI/4;
    electroGroup.add(dial);
    
    const dialScreen = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), neonGreen);
    dialScreen.position.set(0, 0.26, 0);
    dialScreen.rotation.x = -Math.PI/2;
    dial.add(dialScreen);

    // Grounding switch mechanism
    const switchGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const gSwitch = new THREE.Mesh(switchGeo, copper);
    gSwitch.position.set(3, 1.5, 0);
    electroGroup.add(gSwitch);

    // Glass bell jar
    const jarPoints = [];
    jarPoints.push(new THREE.Vector2(3.5, 0));
    jarPoints.push(new THREE.Vector2(3.5, 6));
    jarPoints.push(new THREE.Vector2(2, 9));
    jarPoints.push(new THREE.Vector2(1, 10));
    jarPoints.push(new THREE.Vector2(1, 11));
    const jarGeo = new THREE.LatheGeometry(jarPoints, 32);
    const jar = new THREE.Mesh(jarGeo, tinted);
    jar.position.y = 1.5;
    electroGroup.add(jar);

    // Center rod and terminal
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const rod = new THREE.Mesh(rodGeo, copper);
    rod.position.y = 7.5;
    electroGroup.add(rod);
    
    const terminalGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const terminal = new THREE.Mesh(terminalGeo, brassMaterial);
    terminal.position.y = 13;
    electroGroup.add(terminal);

    // Measurement scale inside the jar
    const scaleGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32, 1, false, 0, Math.PI);
    const scale = new THREE.Mesh(scaleGeo, plastic);
    scale.position.y = 6;
    scale.rotation.x = Math.PI/2;
    scale.rotation.y = Math.PI;
    electroGroup.add(scale);
    
    // Glowing Scale markings
    for(let i=0; i<=10; i++) {
        const markGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        const mark = new THREE.Mesh(markGeo, neonBlue);
        const angle = (i/10) * Math.PI - Math.PI/2;
        mark.position.set(Math.sin(angle)*2.2, Math.cos(angle)*2.2, 0.1);
        mark.rotation.z = -angle;
        scale.add(mark);
    }

    // Gold Leaves (Pivot mechanism)
    const leavesPivot = new THREE.Group();
    leavesPivot.position.y = 4.5;
    electroGroup.add(leavesPivot);

    const leafGeo = new THREE.BoxGeometry(0.8, 4, 0.02);
    leafGeo.translate(0, -2, 0); // Origin at top hinge

    const leftLeaf = new THREE.Mesh(leafGeo, goldMaterial);
    const rightLeaf = new THREE.Mesh(leafGeo, goldMaterial);
    leavesPivot.add(leftLeaf);
    leavesPivot.add(rightLeaf);
    
    animRefs.leftLeaf = leftLeaf;
    animRefs.rightLeaf = rightLeaf;
    animRefs.dialScreen = dialScreen;

    parts.push({
        name: "Vacuum-Sealed Electrometer",
        description: "A highly sensitive electrometer featuring a tinted glass bell jar maintained under vacuum to eliminate air currents and atmospheric ionization losses.",
        material: "glass/copper/steel",
        function: "Housing and protection of delicate charge indicators.",
        assemblyOrder: 5,
        connections: ["Main Isolation Platform", "Induction Wire"],
        failureEffect: "Inability to accurately measure charge.",
        cascadeFailures: ["Loss of quantifiable data"],
        originalPosition: { x: 10, y: 6, z: 8 },
        explodedPosition: { x: 30, y: 6, z: 20 }
    });

    parts.push({
        name: "Ultra-Thin Gold Leaves",
        description: "Two strips of heavily beaten gold foil, precisely 0.1 microns thick. Their extremely low mass allows them to respond dramatically to minute electrostatic repulsion.",
        material: "gold",
        function: "Deflects under mutual electrostatic repulsion to visually indicate charge.",
        assemblyOrder: 6,
        connections: ["Electroscope Rod"],
        failureEffect: "Tearing or fusing of the delicate leaves.",
        cascadeFailures: ["Electroscope total failure"],
        originalPosition: { x: 10, y: 4.5, z: 8 },
        explodedPosition: { x: 30, y: 4.5, z: 30 }
    });

    parts.push({
        name: "Discharge Grounding Switch",
        description: "A heavy-duty mechanical copper throw switch used to instantly drain the accumulated electrostatic charge from the electroscope safely into the earth ground.",
        material: "copper",
        function: "Resets the system to an absolute zero charge state.",
        assemblyOrder: 7,
        connections: ["Electroscope Base"],
        failureEffect: "Unable to reset experiment.",
        cascadeFailures: ["Continuous false positives in next cycle"],
        originalPosition: { x: 13, y: 1.5, z: 8 },
        explodedPosition: { x: 20, y: 1.5, z: -10 }
    });

    // ==========================================
    // 5. CONNECTING WIRE (High Voltage Cable)
    // ==========================================
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 18, 0), // Pail rim attachment
        new THREE.Vector3(2, 19, 4),
        new THREE.Vector3(6, 17, 7),
        new THREE.Vector3(10, 13, 8)  // Electroscope terminal
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.4, 16, false);
    const wireMesh = new THREE.Mesh(tubeGeo, rubber);
    group.add(wireMesh);
    
    // Machined Wire connectors
    const connectorGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);
    const conn1 = new THREE.Mesh(connectorGeo, chrome);
    conn1.position.set(-2, 18, 0);
    conn1.rotation.z = Math.PI/4;
    group.add(conn1);

    const conn2 = new THREE.Mesh(connectorGeo, chrome);
    conn2.position.set(10, 13.5, 8);
    group.add(conn2);

    parts.push({
        name: "Superconducting Induction Cable",
        description: "A heavily shielded, extremely low-resistance multi-core cable designed to transfer electrostatic charge instantly between the pail and the electroscope.",
        material: "copper/rubber",
        function: "Charge transmission pathway.",
        assemblyOrder: 8,
        connections: ["Faraday Ice Pail", "Vacuum-Sealed Electrometer"],
        failureEffect: "Charge leakage or incomplete transfer over distance.",
        cascadeFailures: ["Inaccurate readings"],
        originalPosition: { x: 4, y: 16, z: 4 },
        explodedPosition: { x: 4, y: 40, z: 15 }
    });

    // ==========================================
    // 6. ROBOTIC CRANE ASSEMBLY & HYDRAULICS
    // ==========================================
    const craneGroup = new THREE.Group();
    // Positioned so the arm exactly reaches the pail
    craneGroup.position.set(-8, 0, -16);
    group.add(craneGroup);

    // Crane Base
    const cBaseGeo = new THREE.BoxGeometry(8, 4, 8);
    const cBase = new THREE.Mesh(cBaseGeo, steel);
    cBase.position.y = 2;
    craneGroup.add(cBase);

    // Crane Pillar
    const cPillarGeo = new THREE.CylinderGeometry(2, 2.5, 35, 32);
    const cPillar = new THREE.Mesh(cPillarGeo, darkSteel);
    cPillar.position.y = 19.5;
    craneGroup.add(cPillar);

    // Detailed rivets on pillar
    for(let i=0; i<40; i++) {
        const h = (i/40) * 30 - 15;
        for(let j=0; j<4; j++) {
            const angle = (j/4) * Math.PI*2;
            const rGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const rMesh = new THREE.Mesh(rGeo, chrome);
            rMesh.position.set(Math.cos(angle)*2.2, h, Math.sin(angle)*2.2);
            cPillar.add(rMesh);
        }
    }

    // Crane Arm (Boom) pointing along +Z towards pail
    const cArmGroup = new THREE.Group();
    cArmGroup.position.set(0, 35, 0);
    cArmGroup.rotation.y = Math.PI / 2; // Point along original Z axis logic (we fixed rotation above)
    // Actually, if crane is at z=-16 and pail at z=0, the crane arm needs to point along +Z.
    // In local space, let's just make the arm extend along +Z directly.
    cArmGroup.rotation.y = -Math.PI / 2; // Adjusting so boom extends to the pail
    craneGroup.add(cArmGroup);
    
    const boomGeo = new THREE.BoxGeometry(20, 2.5, 2.5);
    const boom = new THREE.Mesh(boomGeo, steel);
    boom.position.set(8, 0, 0); // extending out
    cArmGroup.add(boom);

    // Support strut
    const strutGeo = new THREE.CylinderGeometry(0.6, 0.6, 18);
    const strut = new THREE.Mesh(strutGeo, chrome);
    strut.position.set(5, -6, 0);
    strut.rotation.z = Math.PI / 4;
    cArmGroup.add(strut);

    // Heavy-Duty Hydraulic Actuators
    const pistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
    const piston = new THREE.Mesh(pistonGeo, chrome);
    piston.position.set(2, -8, 2);
    piston.rotation.z = Math.PI / 6;
    cArmGroup.add(piston);

    // Winch Mechanism on boom
    const winchGeo = new THREE.CylinderGeometry(2, 2, 3.5, 32);
    const winch = new THREE.Mesh(winchGeo, darkSteel);
    winch.rotation.x = Math.PI/2;
    winch.position.set(16, 1, 0);
    cArmGroup.add(winch);
    
    animRefs.winch = winch;

    // Glowing active strips on crane boom
    const stripGeo = new THREE.BoxGeometry(19, 0.2, 2.6);
    const strip = new THREE.Mesh(stripGeo, neonBlue);
    strip.position.set(8, 0, 0);
    cArmGroup.add(strip);

    parts.push({
        name: "Robotic Boom Arm",
        description: "A precision-controlled boom constructed of hardened steel, utilized for the unperturbed, vibrationless lowering of the charged sphere.",
        material: "steel",
        function: "Vertical and horizontal positioning of the charged sphere.",
        assemblyOrder: 9,
        connections: ["Crane Pillar", "Winch Assembly"],
        failureEffect: "Sphere strikes the pail prematurely.",
        cascadeFailures: ["Premature charge transfer", "Physical damage to pail"],
        originalPosition: { x: -8, y: 35, z: -8 },
        explodedPosition: { x: -8, y: 50, z: -30 }
    });

    parts.push({
        name: "Heavy-Duty Hydraulic Actuators",
        description: "Provides the immense yet highly controlled force required to precisely angle the massive steel crane arm without jarring the delicate suspended sphere.",
        material: "chrome",
        function: "Boom angle manipulation.",
        assemblyOrder: 10,
        connections: ["Crane Pillar", "Robotic Boom Arm"],
        failureEffect: "Sudden arm drop.",
        cascadeFailures: ["Structural damage", "Experiment destruction"],
        originalPosition: { x: -8, y: 27, z: -14 },
        explodedPosition: { x: -8, y: 40, z: -40 }
    });

    // ==========================================
    // 7. SUSPENSION CABLE & CHARGED SPHERE
    // ==========================================
    const sphereAssembly = new THREE.Group();
    // Positioned exactly over the pail
    sphereAssembly.position.set(-8, 36, 0);
    group.add(sphereAssembly);
    
    animRefs.sphereAssembly = sphereAssembly;

    // Cable (scales on Y axis)
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    cableGeo.translate(0, -0.5, 0); 
    const cable = new THREE.Mesh(cableGeo, plastic);
    sphereAssembly.add(cable);
    animRefs.cable = cable;

    // The Brass Sphere
    const sphereGeo = new THREE.SphereGeometry(3, 64, 64);
    const sphere = new THREE.Mesh(sphereGeo, brassMaterial);
    sphere.position.y = -1; 
    sphereAssembly.add(sphere);
    animRefs.sphere = sphere;
    
    // Emissive Aura to visually represent electrostatic charge
    const auraGeo = new THREE.SphereGeometry(3.3, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    sphere.add(aura);
    animRefs.aura = aura;

    parts.push({
        name: "Positively Charged Brass Sphere",
        description: "A perfectly spherical solid brass conductor, charged to high positive potential. The sphere serves as the master inducer in this electrostatic demonstration.",
        material: "brass",
        function: "Carries the initial inducing charge into the Faraday cavity.",
        assemblyOrder: 11,
        connections: ["Insulating Silk Suspension Thread"],
        failureEffect: "No charge induced.",
        cascadeFailures: ["Experiment nullified"],
        originalPosition: { x: -8, y: 25, z: 0 },
        explodedPosition: { x: -8, y: 60, z: 0 }
    });

    parts.push({
        name: "Insulating Silk Suspension Thread",
        description: "A highly tensile, non-conductive silk and nylon composite filament. Ensures absolutely no charge is lost to the grounded crane mechanism above.",
        material: "plastic",
        function: "Supports and completely insulates the charged sphere.",
        assemblyOrder: 12,
        connections: ["Winch Assembly", "Positively Charged Brass Sphere"],
        failureEffect: "Charge bleeds up the thread.",
        cascadeFailures: ["Loss of charge on sphere before insertion"],
        originalPosition: { x: -8, y: 30, z: 0 },
        explodedPosition: { x: -8, y: 55, z: 10 }
    });

    // ==========================================
    // 8. CONTROL CONSOLE & HIGH VOLTAGE GENERATOR
    // ==========================================
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(-20, 0, 15);
    group.add(consoleGroup);

    // Generator Base
    const genBaseGeo = new THREE.BoxGeometry(10, 8, 8);
    const genBase = new THREE.Mesh(genBaseGeo, steel);
    genBase.position.y = 4;
    consoleGroup.add(genBase);

    // Cooling fins for the generator
    for(let i=0; i<25; i++) {
        const finGeo = new THREE.BoxGeometry(11, 0.2, 9);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.y = 0.5 + i * 0.3;
        consoleGroup.add(fin);
    }

    // High Voltage Power Regulators
    const regGeo = new THREE.CylinderGeometry(2, 2, 4, 16);
    const regulator = new THREE.Mesh(regGeo, darkSteel);
    regulator.position.set(0, 10, -6);
    regulator.rotation.x = Math.PI/2;
    consoleGroup.add(regulator);

    // Control Panel slant
    const panelGeo = new THREE.PlaneGeometry(8, 6);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, 8, 3.5);
    panel.rotation.x = -Math.PI / 4;
    consoleGroup.add(panel);
    
    // Panel Buttons and screens
    for(let i=0; i<3; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
        const btn = new THREE.Mesh(btnGeo, i==0 ? neonRed : neonBlue);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(-2 + i*2, 0, 1);
        panel.add(btn);
    }
    const mainScreenGeo = new THREE.PlaneGeometry(6, 2.5);
    const mainScreen = new THREE.Mesh(mainScreenGeo, neonGreen);
    mainScreen.position.set(0, 1.5, 0.1);
    panel.add(mainScreen);

    // Van de Graaff style dome on generator
    const domePillarGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 16);
    const domePillar = new THREE.Mesh(domePillarGeo, plastic);
    domePillar.position.set(0, 14, -2);
    consoleGroup.add(domePillar);

    const domeGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const dome = new THREE.Mesh(domeGeo, aluminum);
    dome.position.set(0, 19, -2);
    consoleGroup.add(dome);

    // Connecting arm to charge the sphere before experiment
    const chargeArmGeo = new THREE.CylinderGeometry(0.3, 0.3, 20);
    const chargeArm = new THREE.Mesh(chargeArmGeo, copper);
    chargeArm.position.set(6, 19, -8); // Angles towards the crane drop path
    chargeArm.rotation.x = Math.PI/2;
    chargeArm.rotation.y = Math.PI/4.5;
    consoleGroup.add(chargeArm);

    parts.push({
        name: "High Voltage Charge Generator",
        description: "A continuous-belt electrostatic generator capable of accumulating up to 500,000 volts, used to uniformly charge the brass sphere prior to decent.",
        material: "aluminum/plastic/steel",
        function: "Source of high-voltage electrostatic charge.",
        assemblyOrder: 13,
        connections: ["Operations & Telemetry Console"],
        failureEffect: "Inability to charge the sphere.",
        cascadeFailures: ["Complete system paralysis"],
        originalPosition: { x: -20, y: 19, z: 13 },
        explodedPosition: { x: -35, y: 19, z: 30 }
    });

    parts.push({
        name: "Operations & Telemetry Console",
        description: "An advanced digital terminal tracking voltage induction, humidity, air pressure, and crane telemetry. Features glowing real-time analysis screens.",
        material: "darkSteel/glass",
        function: "Operator interface and environmental monitoring.",
        assemblyOrder: 14,
        connections: ["Main Isolation Platform"],
        failureEffect: "Loss of control of robotic crane.",
        cascadeFailures: ["Sphere collision", "Unrecorded data"],
        originalPosition: { x: -20, y: 4, z: 15 },
        explodedPosition: { x: -35, y: 4, z: 40 }
    });

    parts.push({
        name: "Thyristor Power Regulators",
        description: "Actively regulates the intense voltage generated by the Van de Graaff system, ensuring a stable, non-arcing charge is delivered cleanly to the brass sphere.",
        material: "steel/copper",
        function: "Voltage stabilization and arc prevention.",
        assemblyOrder: 15,
        connections: ["High Voltage Charge Generator"],
        failureEffect: "Massive voltage surges.",
        cascadeFailures: ["Dielectric breakdown", "Catastrophic arcing"],
        originalPosition: { x: -20, y: 10, z: 9 },
        explodedPosition: { x: -35, y: 10, z: 0 }
    });

    // 16. Environmental Monitoring Sensors
    const envSensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
    const envSensor = new THREE.Mesh(envSensorGeo, chrome);
    envSensor.position.set(-10, 2.5, -10);
    baseMesh.add(envSensor);
    parts.push({
        name: "Hygrometer & Barometer Array",
        description: "Precision instruments tracking ambient humidity and air pressure. High humidity can cause charge to leak rapidly into the air, ruining the experiment.",
        material: "chrome",
        function: "Environmental data logging.",
        assemblyOrder: 16,
        connections: ["Main Seismic Isolation Platform"],
        failureEffect: "Unrecognized environmental interference.",
        cascadeFailures: ["Charge leakage", "Data corruption"],
        originalPosition: { x: -10, y: 1, z: -10 },
        explodedPosition: { x: -10, y: 10, z: -25 }
    });

    // ==========================================
    // 9. HYPER-SYNCHRONIZED ANIMATION LOGIC
    // ==========================================
    let phaseTime = 0;
    const animate = (time, speed, meshes) => {
        phaseTime += speed * 0.015; // Controlled speed multiplier
        const cycle = phaseTime % 40; // 40-second long highly detailed sequence
        
        let cableLength = 2;
        let leafAngle = 0;
        let auraIntensity = 0.5;
        let screenColor = 0x00ff00; // Normal/Green
        
        // Phase 1: 0 - 5 : Idle, fully charged sphere suspended high.
        if (cycle < 5) {
            cableLength = 2;
            leafAngle = 0;
            auraIntensity = 0.5 + Math.sin(phaseTime * 5) * 0.1;
            screenColor = 0x00ff00;
            animRefs.cable.rotation.z = 0;
        }
        // Phase 2: 5 - 13 : Lowering into the pail (Induction phase)
        else if (cycle < 13) {
            const t = (cycle - 5) / 8; // 0 to 1
            const smoothT = t * t * (3 - 2 * t); // Smoothstep
            cableLength = 2 + smoothT * 22; // Lowers deep into the pail
            
            // As it lowers, it induces charge on inner wall, sending opposite charge to electroscope
            leafAngle = smoothT * (Math.PI / 3.5);
            auraIntensity = 0.5 + Math.sin(phaseTime * 10) * 0.15;
            screenColor = 0xffff00; // Warning/Yellow: Induction active
            animRefs.cable.rotation.z = 0;
        }
        // Phase 3: 13 - 16 : Resting inside, maximum induction
        else if (cycle < 16) {
            cableLength = 24; 
            leafAngle = Math.PI / 3.5; // Max divergence due to full induction
            auraIntensity = 0.5;
            screenColor = 0xffff00;
            animRefs.cable.rotation.z = 0;
        }
        // Phase 4: 16 - 20 : Sphere swings and touches the inner wall (Transfer phase)
        else if (cycle < 20) {
            cableLength = 24;
            const t = (cycle - 16) / 4;
            // Swing the cable slightly so sphere touches wall
            const smoothSwing = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; 
            animRefs.cable.rotation.z = smoothSwing * 0.15; // Swing towards inner wall
            
            if (t > 0.5) {
                // Charge is physically transferred!
                auraIntensity = 0; // Sphere completely loses its charge
                leafAngle = Math.PI / 3.5; // Leaves remain diverged (pail retained the charge on its outside)
                screenColor = 0xff0000; // Alert/Red: Charge completely transferred
                
                // Visual flash on electroscope at exact moment of transfer
                if (t > 0.5 && t < 0.6) {
                    animRefs.leftLeaf.material.emissiveIntensity = 3;
                    animRefs.rightLeaf.material.emissiveIntensity = 3;
                } else {
                    animRefs.leftLeaf.material.emissiveIntensity = 0;
                    animRefs.rightLeaf.material.emissiveIntensity = 0;
                }
            } else {
                auraIntensity = 0.5;
                leafAngle = Math.PI / 3.5;
            }
        }
        // Phase 5: 20 - 28 : Raising the neutralized sphere back up
        else if (cycle < 28) {
            animRefs.cable.rotation.z = 0;
            const t = (cycle - 20) / 8;
            const smoothT = t * t * (3 - 2 * t);
            cableLength = 24 - smoothT * 22; // Retract cable
            
            auraIntensity = 0; // Sphere remains neutral
            leafAngle = Math.PI / 3.5; // Leaves stay powerfully diverged, proving conservation! 
            screenColor = 0xff0000;
        }
        // Phase 6: 28 - 32 : Grounding switch engaged to reset
        else if (cycle < 32) {
            cableLength = 2;
            auraIntensity = 0;
            
            // Gradually collapse leaves as switch drains charge
            if (cycle > 29) {
                const t = (cycle - 29) / 3;
                leafAngle = (1 - t) * (Math.PI / 3.5);
                if (leafAngle < 0) leafAngle = 0;
                screenColor = 0x00ff00; // Back to safe green
            } else {
                leafAngle = Math.PI / 3.5;
                screenColor = 0xff0000;
            }
        }
        // Phase 7: 32 - 40 : Recharge the sphere via generator arm
        else {
            cableLength = 2;
            leafAngle = 0;
            const t = (cycle - 32) / 8;
            auraIntensity = t * 0.5; // Sphere regains glowing aura
            
            // Winch subtly rotates to adjust tension
            animRefs.winch.rotation.z += 0.05 * speed;
        }

        // Apply calculated transformations
        animRefs.cable.scale.y = cableLength;
        animRefs.sphere.position.y = -cableLength;
        
        // Mechanical Winch spinning
        if ((cycle >= 5 && cycle < 13) || (cycle >= 20 && cycle < 28)) {
            animRefs.winch.rotation.z += (cycle < 13 ? 0.15 : -0.15) * speed;
        }
        
        // Pivot the gold leaves perfectly symmetrically
        animRefs.leftLeaf.rotation.z = leafAngle;
        animRefs.rightLeaf.rotation.z = -leafAngle;
        
        // Pulsate the sphere's aura to indicate live high voltage
        animRefs.aura.material.opacity = auraIntensity;
        if (auraIntensity > 0) {
            animRefs.aura.scale.setScalar(1 + Math.sin(phaseTime * 20) * 0.03);
        } else {
            animRefs.aura.scale.setScalar(0.01);
        }

        // Update telemetry screens
        animRefs.dialScreen.material.color.setHex(screenColor);
        animRefs.dialScreen.material.emissive.setHex(screenColor);
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFaradayIcePail() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
