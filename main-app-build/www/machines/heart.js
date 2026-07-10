import { steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead, rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber, redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent, electrolyte, fire, wireCoil, tinted } from '../utils/materials.js';

export function createHeart(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "A detailed 3D model of the human heart, showcasing the four chambers, major blood vessels, and internal valves responsible for circulating blood throughout the body. Experience the dynamic pulsing of the heartbeat mechanism in real-time.";

    // Custom materials based on the provided imported materials
    const muscleMat = tinted(rubber, 0x8b0000); // Deep red muscular tissue
    const oxygenatedMat = tinted(plastic, 0xff2222); // Bright red for oxygenated blood vessels
    const deoxygenatedMat = tinted(plastic, 0x2222ff); // Blue for deoxygenated blood vessels
    const valveMat = tinted(whitePlastic, 0xdddddd); // Off-white for internal flaps

    // Helper to add parts
    function addPart(name, desc, meshGroup, metadata) {
        meshGroup.userData = { name };
        group.add(meshGroup);
        parts.push({
            name,
            description: desc,
            ...metadata,
            group: meshGroup
        });
    }

    // 1. Left Ventricle (Thickest muscular wall)
    const lvGroup = new THREE.Group();
    const lvGeom = new THREE.SphereGeometry(2.2, 32, 32);
    const lvMesh = new THREE.Mesh(lvGeom, muscleMat);
    lvMesh.scale.set(1, 1.5, 1);
    lvMesh.position.set(1, -1.5, 0);
    lvGroup.add(lvMesh);
    addPart("Left Ventricle", "Thickest muscular wall of the heart, responsible for pumping oxygenated blood to the entire body.", lvGroup, {
        material: "Cardiac Muscle",
        function: "Pumps oxygenated blood to the systemic circulation via the aorta.",
        assemblyOrder: 1,
        connections: ["Left Atrium", "Aorta", "Mitral Valve"],
        failureEffect: "Heart failure, inability to pump sufficient blood to the body.",
        cascadeFailures: ["Systemic organ failure", "Fatigue"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(4, -3, 0)
    });

    // 2. Right Ventricle
    const rvGroup = new THREE.Group();
    const rvGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const rvMesh = new THREE.Mesh(rvGeom, muscleMat);
    rvMesh.scale.set(1.2, 1.3, 0.9);
    rvMesh.position.set(-1.2, -1.2, 0.8);
    rvGroup.add(rvMesh);
    addPart("Right Ventricle", "Muscular chamber that pumps deoxygenated blood to the lungs.", rvGroup, {
        material: "Cardiac Muscle",
        function: "Pumps deoxygenated blood to the pulmonary circulation.",
        assemblyOrder: 2,
        connections: ["Right Atrium", "Pulmonary Artery", "Tricuspid Valve"],
        failureEffect: "Right-sided heart failure.",
        cascadeFailures: ["Fluid buildup in extremities", "Increased venous pressure"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-4, -3, 2)
    });

    // 3. Left Atrium
    const laGroup = new THREE.Group();
    const laGeom = new THREE.SphereGeometry(1.3, 32, 32);
    const laMesh = new THREE.Mesh(laGeom, muscleMat);
    laMesh.position.set(1.4, 1.5, -0.5);
    laGroup.add(laMesh);
    addPart("Left Atrium", "Upper chamber that receives oxygenated blood from the lungs.", laGroup, {
        material: "Cardiac Muscle",
        function: "Passes oxygenated blood to the left ventricle.",
        assemblyOrder: 3,
        connections: ["Left Ventricle", "Pulmonary Veins", "Mitral Valve"],
        failureEffect: "Blood buildup in pulmonary veins.",
        cascadeFailures: ["Pulmonary edema", "Shortness of breath"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(3, 4, -2)
    });

    // 4. Right Atrium
    const raGroup = new THREE.Group();
    const raGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const raMesh = new THREE.Mesh(raGeom, muscleMat);
    raMesh.position.set(-1.6, 1.4, 0.2);
    raGroup.add(raMesh);
    addPart("Right Atrium", "Upper chamber that receives deoxygenated blood from the body.", raGroup, {
        material: "Cardiac Muscle",
        function: "Passes deoxygenated blood to the right ventricle.",
        assemblyOrder: 4,
        connections: ["Right Ventricle", "Superior Vena Cava", "Inferior Vena Cava", "Tricuspid Valve"],
        failureEffect: "Reduced blood flow to the lungs.",
        cascadeFailures: ["Fatigue", "Irregular heartbeat"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-4, 4, 0)
    });

    // 5. Aorta (Massive red arching tube)
    const aortaGroup = new THREE.Group();
    const aortaTube = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2, 16), oxygenatedMat);
    aortaTube.position.set(0.5, 1.8, 0);
    const aortaArch = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.7, 16, 32, Math.PI), oxygenatedMat);
    aortaArch.position.set(1.4, 2.8, 0);
    aortaGroup.add(aortaTube);
    aortaGroup.add(aortaArch);
    addPart("Aorta", "Massive red arching tube.", aortaGroup, {
        material: "Arterial Tissue",
        function: "Distributes high-pressure oxygenated blood from the left ventricle to the body.",
        assemblyOrder: 5,
        connections: ["Left Ventricle"],
        failureEffect: "Aortic rupture causes massive internal bleeding.",
        cascadeFailures: ["Rapid blood pressure drop", "Fatal internal hemorrhage"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(2, 6, 0)
    });

    // 6. Pulmonary Artery (Blue branching tube)
    const paGroup = new THREE.Group();
    const paBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16), deoxygenatedMat);
    paBase.position.set(-0.5, 1.8, 0.8);
    paBase.rotation.z = -0.4;
    const paBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 16), deoxygenatedMat);
    paBranch.position.set(-0.5, 2.8, 0.8);
    paBranch.rotation.z = Math.PI / 2;
    paGroup.add(paBase);
    paGroup.add(paBranch);
    addPart("Pulmonary Artery", "Blue branching tube carrying deoxygenated blood.", paGroup, {
        material: "Arterial Tissue",
        function: "Carries deoxygenated blood from the right ventricle to the lungs.",
        assemblyOrder: 6,
        connections: ["Right Ventricle"],
        failureEffect: "Impaired blood flow to the lungs.",
        cascadeFailures: ["Hypoxia", "Cyanosis"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-2, 5, 3)
    });

    // 7. Superior Vena Cava
    const svcGroup = new THREE.Group();
    const svcMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16), deoxygenatedMat);
    svcMesh.position.set(-1.8, 3.2, 0.2);
    svcGroup.add(svcMesh);
    addPart("Superior Vena Cava", "Large vein carrying blood from the upper body.", svcGroup, {
        material: "Venous Tissue",
        function: "Returns deoxygenated blood from the head and upper body to the right atrium.",
        assemblyOrder: 7,
        connections: ["Right Atrium"],
        failureEffect: "Blood pooling in the upper body.",
        cascadeFailures: ["Facial swelling", "Increased intracranial pressure"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-5, 7, 0)
    });

    // 8. Inferior Vena Cava
    const ivcGroup = new THREE.Group();
    const ivcMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16), deoxygenatedMat);
    ivcMesh.position.set(-1.8, -2.0, -0.2);
    ivcGroup.add(ivcMesh);
    addPart("Inferior Vena Cava", "Large vein carrying blood from the lower body.", ivcGroup, {
        material: "Venous Tissue",
        function: "Returns deoxygenated blood from the lower body to the right atrium.",
        assemblyOrder: 8,
        connections: ["Right Atrium"],
        failureEffect: "Blood pooling in the lower body.",
        cascadeFailures: ["Peripheral edema", "Liver congestion"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-5, -6, -1)
    });

    // 9. Mitral Valve (internal flaps)
    const mvGroup = new THREE.Group();
    const mvMesh = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.3, 16, 1, true), valveMat);
    mvMesh.position.set(1.2, 0.2, -0.2);
    mvGroup.add(mvMesh);
    addPart("Mitral Valve", "Internal flaps between the left atrium and ventricle.", mvGroup, {
        material: "Fibrous Tissue",
        function: "Prevents backflow of blood into the left atrium during ventricular contraction.",
        assemblyOrder: 9,
        connections: ["Left Atrium", "Left Ventricle"],
        failureEffect: "Blood regurgitation into the left atrium.",
        cascadeFailures: ["Heart murmur", "Reduced cardiac output"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(6, 0, -1)
    });

    // 10. Tricuspid Valve (internal flaps)
    const tvGroup = new THREE.Group();
    const tvMesh = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.3, 16, 1, true), valveMat);
    tvMesh.position.set(-1.4, 0.2, 0.4);
    tvGroup.add(tvMesh);
    addPart("Tricuspid Valve", "Internal flaps between the right atrium and ventricle.", tvGroup, {
        material: "Fibrous Tissue",
        function: "Prevents backflow of blood into the right atrium during ventricular contraction.",
        assemblyOrder: 10,
        connections: ["Right Atrium", "Right Ventricle"],
        failureEffect: "Blood regurgitation into the right atrium.",
        cascadeFailures: ["Increased venous pressure", "Liver enlargement"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-6, 0, 1)
    });

    const quizQuestions = [
        {
            question: "Which chamber of the heart has the thickest muscular wall?",
            options: ["Right Atrium", "Left Ventricle", "Right Ventricle", "Left Atrium"],
            correctAnswerIndex: 1,
            explanation: "The left ventricle has the thickest wall because it must pump blood at high pressure to the entire systemic circulation.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the Aorta?",
            options: ["Carry deoxygenated blood to the lungs", "Receive blood from the body", "Distribute oxygenated blood to the body", "Supply blood directly to the heart muscle"],
            correctAnswerIndex: 2,
            explanation: "The aorta is the massive main artery that carries highly pressurized, oxygenated blood from the left ventricle to the rest of the body.",
            difficulty: "easy"
        },
        {
            question: "Which vessel uniquely carries deoxygenated blood away from the heart?",
            options: ["Superior Vena Cava", "Aorta", "Pulmonary Vein", "Pulmonary Artery"],
            correctAnswerIndex: 3,
            explanation: "The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs, making it the only artery to carry deoxygenated blood.",
            difficulty: "medium"
        },
        {
            question: "Where is the Mitral Valve located within the heart?",
            options: ["Between the left atrium and left ventricle", "Between the right atrium and right ventricle", "At the exit of the aorta", "At the exit of the pulmonary artery"],
            correctAnswerIndex: 0,
            explanation: "The mitral valve (bicuspid valve) separates the left atrium from the left ventricle, controlling oxygenated blood flow.",
            difficulty: "medium"
        },
        {
            question: "What is the primary role of the Vena Cava (Superior and Inferior)?",
            options: ["Pump oxygenated blood to the body", "Oxygenate the blood in the lungs", "Return deoxygenated blood to the right atrium", "Prevent backflow of blood into the ventricles"],
            correctAnswerIndex: 2,
            explanation: "The superior and inferior vena cava are massive veins responsible for returning deoxygenated blood from the body to the right atrium.",
            difficulty: "easy"
        },
        {
            question: "What immediate effect does a malfunctioning heart valve typically have?",
            options: ["The heart completely stops beating", "Blood regurgitates (flows backward)", "The blood spontaneously oxygenates", "The heart muscle thickens instantly"],
            correctAnswerIndex: 1,
            explanation: "Valve failure (regurgitation) allows blood to flow backward, decreasing the heart's overall pumping efficiency and leading to murmurs.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Heartbeat animation: pulsing scale simulating 'lub-dub'
        // A mathematical combination of sine waves produces the double-beat effect
        const beat = Math.max(0, Math.sin(time * speed * 4) + Math.sin(time * speed * 4 + 1.5) * 0.5);
        const chamberScale = 1 + beat * 0.08; // Main expansion for muscular chambers
        const vesselScale = 1 + beat * 0.03;  // Lesser expansion for vessels

        meshes.forEach(item => {
            if (item.group) {
                const name = item.name || "";
                if (name.includes("Ventricle") || name.includes("Atrium")) {
                    // Chambers expand significantly to simulate contraction/expansion
                    item.group.scale.set(chamberScale, chamberScale, chamberScale);
                } else if (name.includes("Valve")) {
                    // Valves rapidly change their shape simulating opening/closing
                    const valveOpen = 1 - beat * 0.6;
                    item.group.scale.set(1, Math.max(0.1, valveOpen), 1);
                } else {
                    // Aorta, Pulmonary Artery, Vena Cava pulse slightly with blood flow
                    item.group.scale.set(vesselScale, vesselScale, vesselScale);
                }
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Export a generic 'create' function as well to support different import conventions
export const create = createHeart;
