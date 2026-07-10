import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material for fluid and indicators
    const glowingFluidMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const neonAccentMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8
    });

    const siliconeTubingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.5
    });

    // 1. Base Housing
    const housingGeom = new THREE.BoxGeometry(4, 3, 3);
    const housing = new THREE.Mesh(housingGeom, darkSteel);
    housing.position.set(0, -1.5, 0);
    group.add(housing);
    parts.push({
        name: "Pump Housing",
        description: "Main casing enclosing the motor and control electronics.",
        material: "darkSteel",
        function: "Protects internal components and provides structural stability.",
        assemblyOrder: 1,
        connections: ["Motor", "Display Panel"],
        failureEffect: "Exposure of internals to environmental damage.",
        cascadeFailures: ["Motor Failure", "Electrical Short"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 2. Rotor Head
    const rotorGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const rotor = new THREE.Mesh(rotorGeom, aluminum);
    rotor.rotation.x = Math.PI / 2;
    rotor.position.set(0, 0, 1.6);
    group.add(rotor);
    parts.push({
        name: "Rotor Assembly",
        description: "Rotating assembly that houses the pinch rollers.",
        material: "aluminum",
        function: "Drives the rollers to compress the tubing and move fluid.",
        assemblyOrder: 2,
        connections: ["Motor", "Rollers"],
        failureEffect: "Pump stops delivering fluid.",
        cascadeFailures: ["Tubing Wear", "Flow Rate Error"],
        originalPosition: { x: 0, y: 0, z: 1.6 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // 3. Rollers
    const meshes = {};
    meshes.rotor = rotor;
    meshes.rollers = [];
    const numRollers = 3;
    for (let i = 0; i < numRollers; i++) {
        const rollerGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
        const roller = new THREE.Mesh(rollerGeom, chrome);
        
        const angle = (i / numRollers) * Math.PI * 2;
        roller.position.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);
        roller.rotation.x = Math.PI / 2;
        
        rotor.add(roller);
        meshes.rollers.push(roller);
    }
    parts.push({
        name: "Pinch Rollers",
        description: "Precision-machined cylinders that squeeze the tubing.",
        material: "chrome",
        function: "Occludes the tubing, trapping fluid and pushing it forward.",
        assemblyOrder: 3,
        connections: ["Rotor Assembly", "Silicone Tubing"],
        failureEffect: "Loss of occlusion, leading to backflow or inaccurate dosing.",
        cascadeFailures: ["Tubing Rupture"],
        originalPosition: { x: 0, y: 0, z: 1.6 },
        explodedPosition: { x: 0, y: 2, z: 5 }
    });

    // 4. Silicone Tubing (Curved track around rotor)
    const curvePoints = [
        new THREE.Vector3(-2, -1, 1.8),
        new THREE.Vector3(-1.4, 0, 1.8),
        new THREE.Vector3(-1, 1, 1.8),
        new THREE.Vector3(0, 1.5, 1.8),
        new THREE.Vector3(1, 1, 1.8),
        new THREE.Vector3(1.4, 0, 1.8),
        new THREE.Vector3(2, -1, 1.8)
    ];
    const tubingCurve = new THREE.CatmullRomCurve3(curvePoints);
    const tubingGeom = new THREE.TubeGeometry(tubingCurve, 64, 0.25, 16, false);
    const tubing = new THREE.Mesh(tubingGeom, siliconeTubingMaterial);
    group.add(tubing);
    parts.push({
        name: "Silicone Tubing",
        description: "Biocompatible, flexible tubing carrying the medical fluid.",
        material: "Silicone",
        function: "Acts as the sterile pathway for fluid; compressed to create pumping action.",
        assemblyOrder: 4,
        connections: ["Rollers", "Patient Line"],
        failureEffect: "Fluid leakage or contamination.",
        cascadeFailures: ["Loss of Sterility", "Air Embolism"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 2 }
    });

    // 5. Glowing Fluid Particles (Inside tubing)
    meshes.fluids = [];
    for(let i=0; i<15; i++) {
        const fluidGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const fluid = new THREE.Mesh(fluidGeom, glowingFluidMaterial);
        const t = i / 15;
        const pos = tubingCurve.getPoint(t);
        fluid.position.copy(pos);
        group.add(fluid);
        meshes.fluids.push({mesh: fluid, t: t});
    }

    // 6. Display Screen
    const screenGeom = new THREE.PlaneGeometry(2, 1);
    const screen = new THREE.Mesh(screenGeom, neonAccentMaterial);
    screen.position.set(0, -0.5, 1.51);
    group.add(screen);
    parts.push({
        name: "Digital Display",
        description: "High-contrast OLED screen displaying flow rate and volume.",
        material: "Glass / Neon",
        function: "User interface for setting parameters and monitoring operation.",
        assemblyOrder: 5,
        connections: ["Pump Housing"],
        failureEffect: "Inability to read or set pump parameters.",
        cascadeFailures: ["User Error"],
        originalPosition: { x: 0, y: -0.5, z: 1.51 },
        explodedPosition: { x: 0, y: -1, z: 3 }
    });

    const description = "A Medical Peristaltic Pump, commonly used in bypass surgeries, dialysis, or IV infusions. It moves fluid by compressing a flexible tube with rollers, ensuring the fluid never touches the pump's internal mechanism (maintaining sterility).";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a peristaltic pump in medical applications?",
            options: [
                "It can pump highly viscous solids.",
                "The fluid never touches the pump's moving parts.",
                "It operates completely silently.",
                "It requires no power source."
            ],
            correct: 1,
            explanation: "In a peristaltic pump, the fluid is contained within the tubing, ensuring sterility and preventing cross-contamination.",
            difficulty: "Medium"
        },
        {
            question: "What happens if a pinch roller fails to fully occlude the tubing?",
            options: [
                "The pump moves fluid faster.",
                "The motor overheats immediately.",
                "Fluid may flow backward (backflow) or dosage will be inaccurate.",
                "The tubing will permanently stretch."
            ],
            correct: 2,
            explanation: "Complete occlusion is necessary to seal the tubing and push fluid forward. Incomplete occlusion allows fluid to slip back, reducing accuracy.",
            difficulty: "Hard"
        },
        {
            question: "Which component directly acts upon the silicone tubing to propel the fluid?",
            options: [
                "The Digital Display",
                "The Motor Housing",
                "The Pinch Rollers",
                "The Power Supply"
            ],
            correct: 2,
            explanation: "The pinch rollers compress the tubing and roll along it, pushing the trapped fluid ahead.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshesObj = meshes) => {
        if (!meshesObj) return;
        
        // Rotate rotor
        if (meshesObj.rotor) {
            meshesObj.rotor.rotation.z = -time * speed;
        }

        // Counter-rotate rollers to simulate rolling on the tube
        if (meshesObj.rollers) {
            meshesObj.rollers.forEach(roller => {
                roller.rotation.y = time * speed * 3;
            });
        }

        // Animate fluid moving through tube
        if (meshesObj.fluids) {
            meshesObj.fluids.forEach(fluidData => {
                fluidData.t += 0.005 * speed;
                if (fluidData.t > 1) fluidData.t -= 1;
                const newPos = tubingCurve.getPoint(fluidData.t);
                fluidData.mesh.position.copy(newPos);
            });
        }
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPeristalticPump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
