import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createBacteriophage(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const capsidSolidMat = tinted(glass, 0x88ccff);
    capsidSolidMat.transparent = true;
    capsidSolidMat.opacity = 0.3;
    
    const capsidWireMat = tinted(blueAccent, 0x4488ff);
    capsidWireMat.wireframe = true;

    const capsidGroup = new THREE.Group();
    const capsidGeo = new THREE.IcosahedronGeometry(2, 0);
    const capsidSolid = new THREE.Mesh(capsidGeo, capsidSolidMat);
    const capsidWire = new THREE.Mesh(capsidGeo, capsidWireMat);
    capsidGroup.add(capsidSolid, capsidWire);
    capsidGroup.position.set(0, 5, 0);
    group.add(capsidGroup);
    parts.push({
        name: "Icosahedral Head (Capsid)",
        description: "The 20-sided protein shell that securely encloses the viral genetic material.",
        material: "Protein (simulated crystalline)",
        function: "Protects the viral DNA from environmental degradation and provides structure.",
        assemblyOrder: 1,
        connections: ["Viral DNA", "Collar"],
        failureEffect: "Exposure and rapid degradation of the viral DNA.",
        cascadeFailures: ["Viral DNA"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        group: capsidGroup
    });

    const dnaGroup = new THREE.Group();
    const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.15, 100, 16, 3, 7);
    const dnaMatGlow = tinted(purpleAccent, 0xff00ff);
    dnaMatGlow.emissive = new THREE.Color(0xff00ff);
    dnaMatGlow.emissiveIntensity = 0.6;
    const dnaMesh = new THREE.Mesh(dnaGeo, dnaMatGlow);
    dnaGroup.add(dnaMesh);
    dnaGroup.position.set(0, 5, 0);
    group.add(dnaGroup);
    parts.push({
        name: "Viral DNA",
        description: "The genetic payload of the bacteriophage, tightly packed inside the transparent capsid.",
        material: "Nucleic Acid",
        function: "Contains the genetic instructions to hijack the host cell and replicate the virus.",
        assemblyOrder: 2,
        connections: ["Icosahedral Head (Capsid)"],
        failureEffect: "Inability to successfully replicate inside the host bacterium.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 4, y: 8, z: 0 },
        group: dnaGroup
    });

    const collarGroup = new THREE.Group();
    const collarGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
    const collarMesh = new THREE.Mesh(collarGeo, tinted(aluminum, 0xaaaaaa));
    collarGroup.add(collarMesh);
    collarGroup.position.set(0, 2.8, 0);
    group.add(collarGroup);
    parts.push({
        name: "Collar",
        description: "A ring-like structure connecting the head to the central tail sheath.",
        material: "Structural Protein",
        function: "Acts as a foundational attachment point between the heavy capsid and the contractile tail.",
        assemblyOrder: 3,
        connections: ["Icosahedral Head (Capsid)", "Contractile Sheath"],
        failureEffect: "Detachment of the head from the tail structure.",
        cascadeFailures: ["Icosahedral Head (Capsid)"],
        originalPosition: { x: 0, y: 2.8, z: 0 },
        explodedPosition: { x: 0, y: 5.5, z: 0 },
        group: collarGroup
    });

    const sheathGroup = new THREE.Group();
    const sheathCoilGeo = new THREE.TorusGeometry(0.35, 0.15, 16, 32);
    const sheathMat = tinted(plastic, 0x55aa55);
    for (let i = 0; i < 10; i++) {
        const ring = new THREE.Mesh(sheathCoilGeo, sheathMat);
        ring.position.y = (i * 0.25) - 1.125;
        ring.rotation.x = Math.PI / 2;
        sheathGroup.add(ring);
    }
    const innerTubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 16);
    const innerTube = new THREE.Mesh(innerTubeGeo, tinted(titanium, 0x888888));
    sheathGroup.add(innerTube);
    sheathGroup.position.set(0, 1.35, 0);
    group.add(sheathGroup);
    parts.push({
        name: "Contractile Sheath",
        description: "A central cylindrical tube composed of helical proteins surrounding a rigid inner core.",
        material: "Contractile Protein",
        function: "Compresses to forcefully drive the inner tube through the host cell wall, creating a channel for DNA injection.",
        assemblyOrder: 4,
        connections: ["Collar", "Base Plate"],
        failureEffect: "Failure to puncture host cell wall and inject genetic material.",
        cascadeFailures: ["Viral DNA"],
        originalPosition: { x: 0, y: 1.35, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        group: sheathGroup
    });

    const plateGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(1, 1, 0.2, 6);
    const plateMesh = new THREE.Mesh(plateGeo, tinted(darkSteel, 0x444444));
    plateGroup.add(plateMesh);
    plateGroup.position.set(0, 0, 0);
    group.add(plateGroup);
    parts.push({
        name: "Base Plate",
        description: "A hexagonal plate at the bottom of the tail sheath that acts as the control hub.",
        material: "Complex Protein",
        function: "Senses binding events from the tail fibers and triggers the contraction of the sheath.",
        assemblyOrder: 5,
        connections: ["Contractile Sheath", "Tail Fibers", "Tail Pins"],
        failureEffect: "Inability to initiate the infection sequence upon finding a host.",
        cascadeFailures: ["Contractile Sheath"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        group: plateGroup
    });

    const fiberAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
    const fiberNames = ["Tail Fiber 1", "Tail Fiber 2", "Tail Fiber 3", "Tail Fiber 4"];
    const tailFibers = [];
    
    for (let i = 0; i < 4; i++) {
        const fiberGroup = new THREE.Group();
        const angle = fiberAngles[i];
        
        fiberGroup.position.set(Math.cos(angle)*0.8, 0, Math.sin(angle)*0.8);
        fiberGroup.rotation.y = Math.PI/2 - angle;

        const upperLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 2);
        upperLegGeo.translate(0, -1, 0);
        const upperLegHinge = new THREE.Group();
        upperLegHinge.rotation.x = -Math.PI/3;
        const upperMesh = new THREE.Mesh(upperLegGeo, tinted(carbonFiber, 0x333333));
        upperLegHinge.add(upperMesh);
        
        const lowerLegGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5);
        lowerLegGeo.translate(0, -1.25, 0);
        const lowerLegHinge = new THREE.Group();
        lowerLegHinge.position.set(0, -2, 0);
        lowerLegHinge.rotation.x = Math.PI/4;
        const lowerMesh = new THREE.Mesh(lowerLegGeo, tinted(carbonFiber, 0x333333));
        lowerLegHinge.add(lowerMesh);
        
        upperLegHinge.add(lowerLegHinge);
        fiberGroup.add(upperLegHinge);
        
        fiberGroup.userData = { upperLegHinge, lowerLegHinge, baseAngle: angle };
        
        group.add(fiberGroup);
        tailFibers.push(fiberGroup);
        
        const dirX = Math.cos(angle);
        const dirZ = Math.sin(angle);
        
        parts.push({
            name: fiberNames[i],
            description: "A long, jointed appendage used to locate and bind to specific receptors on a host cell surface.",
            material: "Receptor-binding Protein",
            function: "Recognizes the specific host cell and securely anchors the bacteriophage.",
            assemblyOrder: 6 + i,
            connections: ["Base Plate"],
            failureEffect: "Inability to recognize or bind to the host cell, rendering the virus harmless.",
            cascadeFailures: ["Base Plate", "Contractile Sheath"],
            originalPosition: { x: dirX*0.8, y: 0, z: dirZ*0.8 },
            explodedPosition: { x: dirX*4, y: -2, z: dirZ*4 },
            group: fiberGroup
        });
    }

    const pinsGroup = new THREE.Group();
    const pinGeo = new THREE.ConeGeometry(0.05, 0.5, 8);
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const pin = new THREE.Mesh(pinGeo, titanium);
        pin.position.set(Math.cos(angle) * 0.9, -0.35, Math.sin(angle) * 0.9);
        pin.rotation.x = Math.PI;
        pinsGroup.add(pin);
    }
    group.add(pinsGroup);
    parts.push({
        name: "Tail Pins",
        description: "Sharp spikes extending downwards from the base plate.",
        material: "Piercing Protein",
        function: "Punctures the outer membrane of the host cell during initial attachment to anchor the base plate.",
        assemblyOrder: 10,
        connections: ["Base Plate"],
        failureEffect: "Reduced efficiency in penetrating the host cell wall.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        group: pinsGroup
    });

    const quizQuestions = [
        {
            question: "What is the primary difference between the lytic and lysogenic cycles of a bacteriophage?",
            options: [
                "Lytic destroys the host cell immediately, lysogenic integrates DNA into the host genome.",
                "Lytic occurs in plants, lysogenic occurs in bacteria.",
                "Lytic replicates RNA, lysogenic replicates DNA.",
                "Lysogenic destroys the host cell, lytic integrates DNA."
            ],
            correctAnswerIndex: 0,
            explanation: "In the lytic cycle, the virus rapidly replicates and bursts the host cell. In the lysogenic cycle, the viral DNA integrates into the host's DNA and remains dormant.",
            difficulty: "Medium"
        },
        {
            question: "What geometric shape best describes the head (capsid) of a typical bacteriophage?",
            options: [
                "Tetrahedron",
                "Icosahedron",
                "Dodecahedron",
                "Cylinder"
            ],
            correctAnswerIndex: 1,
            explanation: "The capsid of a typical bacteriophage forms an icosahedron, a 20-sided polyhedron that efficiently packs genetic material.",
            difficulty: "Easy"
        },
        {
            question: "What determines the host specificity of a bacteriophage?",
            options: [
                "The size of its capsid",
                "The length of its DNA",
                "The tail fibers binding to specific receptors",
                "The contraction of its sheath"
            ],
            correctAnswerIndex: 2,
            explanation: "Tail fibers have specific proteins that act like keys, fitting only into specific receptor locks on the surface of susceptible host bacteria.",
            difficulty: "Medium"
        },
        {
            question: "How does the bacteriophage inject its DNA into the host cell?",
            options: [
                "It gets swallowed whole by the bacterium.",
                "It dissolves the entire host cell wall with acid.",
                "The sheath contracts, driving the inner tube through the cell wall.",
                "The tail fibers act as microscopic needles."
            ],
            correctAnswerIndex: 2,
            explanation: "When triggered, the contractile sheath compresses, thrusting the rigid inner tube through the bacterial membrane to create a channel for the DNA.",
            difficulty: "Hard"
        },
        {
            question: "Why are bacteriophages considered obligate intracellular parasites?",
            options: [
                "They can only survive in oxygen-free environments.",
                "They lack their own cellular machinery to synthesize proteins or generate energy.",
                "They must feed on other viruses to grow.",
                "They are single-celled organisms that hunt bacteria."
            ],
            correctAnswerIndex: 1,
            explanation: "Viruses do not have ribosomes or metabolic enzymes. They must hijack a host cell's machinery to replicate.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the tail pins on the base plate?",
            options: [
                "To puncture the host cell's outer membrane during attachment.",
                "To store extra genetic material.",
                "To swim through fluid environments.",
                "To communicate with other bacteriophages."
            ],
            correctAnswerIndex: 0,
            explanation: "Tail pins help anchor the base plate firmly to the host surface and initiate the puncturing of the cell wall before DNA injection.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        const pulse = 1 + 0.03 * Math.sin(time * 3 * speed);
        capsidGroup.scale.set(pulse, pulse, pulse);
        
        dnaGroup.rotation.y = time * 0.5 * speed;
        dnaGroup.rotation.z = time * 0.3 * speed;
        
        tailFibers.forEach((fiberGroup, index) => {
            const offset = index * Math.PI / 2;
            const flex1 = Math.sin(time * 2 * speed + offset) * 0.1;
            const flex2 = Math.cos(time * 2 * speed + offset) * 0.15;
            
            if (fiberGroup.userData.upperLegHinge) {
                fiberGroup.userData.upperLegHinge.rotation.x = -Math.PI/3 + flex1;
                fiberGroup.userData.lowerLegHinge.rotation.x = Math.PI/4 + flex2;
            }
        });
    }

    return {
        group,
        parts,
        description: "A detailed 3D model of a Bacteriophage Virus, demonstrating its geometric capsid, genetic payload, and specialized injection machinery.",
        quizQuestions,
        animate
    };
}
