import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for visual flair
    const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.7,
        metalness: 0.1,
    });

    const cartilageMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8,
        emissive: 0x002244,
        emissiveIntensity: 0.5
    });

    const synovialFluidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.1,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true
    });

    const capsuleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3366,
        transmission: 0.5,
        opacity: 0.4,
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        side: THREE.DoubleSide
    });

    const ligamentMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaaaa,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x330000
    });

    // --- Mesh creation ---

    // 1. Superior Bone (e.g., Femur)
    const superiorGroup = new THREE.Group();
    superiorGroup.position.set(0, 1.5, 0);
    
    const superiorBoneGeoReal = new THREE.CylinderGeometry(1.2, 1.5, 8, 32);
    const superiorBoneRealMesh = new THREE.Mesh(superiorBoneGeoReal, boneMaterial);
    superiorBoneRealMesh.position.set(0, 4, 0);
    superiorGroup.add(superiorBoneRealMesh);
    group.add(superiorGroup);

    parts.push({
        name: "Superior Bone (Femur)",
        description: "The upper skeletal element of the joint providing structural support and leverage.",
        material: "boneMaterial",
        function: "Transmits forces and provides a rigid lever for movement.",
        assemblyOrder: 1,
        connections: ["Articular Cartilage", "Joint Capsule", "Ligaments"],
        failureEffect: "Fracture leads to complete loss of structural integrity and load-bearing capacity.",
        cascadeFailures: ["Cartilage damage", "Capsule rupture"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 2. Inferior Bone (e.g., Tibia)
    const inferiorBoneGeo = new THREE.CylinderGeometry(1.5, 1.2, 8, 32);
    const inferiorBoneMesh = new THREE.Mesh(inferiorBoneGeo, boneMaterial);
    inferiorBoneMesh.position.set(0, -4, 0);
    
    const inferiorGroup = new THREE.Group();
    inferiorGroup.position.set(0, -1.5, 0);
    inferiorGroup.add(inferiorBoneMesh);
    group.add(inferiorGroup);

    parts.push({
        name: "Inferior Bone (Tibia)",
        description: "The lower skeletal element, acting as the foundation for the articulation.",
        material: "boneMaterial",
        function: "Supports weight and articulates with the superior bone.",
        assemblyOrder: 2,
        connections: ["Articular Cartilage", "Joint Capsule", "Ligaments"],
        failureEffect: "Inability to support body weight or maintain joint alignment.",
        cascadeFailures: ["Ligament avulsion", "Joint dislocation"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 3. Superior Articular Cartilage
    const supCartGeo = new THREE.SphereGeometry(1.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const supCartMesh = new THREE.Mesh(supCartGeo, cartilageMaterial);
    supCartMesh.position.set(0, 0, 0);
    superiorGroup.add(supCartMesh);

    parts.push({
        name: "Superior Articular Cartilage",
        description: "A smooth, glassy layer of hyaline cartilage covering the end of the superior bone.",
        material: "cartilageMaterial",
        function: "Reduces friction and absorbs shock during movement.",
        assemblyOrder: 3,
        connections: ["Superior Bone", "Synovial Fluid"],
        failureEffect: "Increased friction leading to pain, inflammation, and osteoarthritis.",
        cascadeFailures: ["Bone erosion", "Synovial inflammation"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 0 }
    });

    // 4. Inferior Articular Cartilage
    const infCartGeo = new THREE.SphereGeometry(1.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const infCartMesh = new THREE.Mesh(infCartGeo, cartilageMaterial);
    infCartMesh.rotation.x = Math.PI;
    infCartMesh.position.set(0, 0, 0);
    inferiorGroup.add(infCartMesh);

    parts.push({
        name: "Inferior Articular Cartilage",
        description: "Hyaline cartilage layer protecting the inferior bone's articular surface.",
        material: "cartilageMaterial",
        function: "Provides a frictionless gliding surface opposing the superior cartilage.",
        assemblyOrder: 4,
        connections: ["Inferior Bone", "Synovial Fluid"],
        failureEffect: "Grinding of bone-on-bone, severe pain, restricted mobility.",
        cascadeFailures: ["Bone spur formation", "Joint deformity"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -3.5, z: 0 }
    });

    // 5. Synovial Fluid
    const fluidGeo = new THREE.SphereGeometry(1.7, 32, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, synovialFluidMaterial);
    fluidMesh.scale.y = 0.6;
    group.add(fluidMesh);

    parts.push({
        name: "Synovial Fluid",
        description: "Viscous, non-Newtonian fluid filling the joint cavity. Represented as a glowing neon core.",
        material: "synovialFluidMaterial",
        function: "Lubricates the joint, supplies nutrients to the avascular cartilage, and acts as a shock absorber.",
        assemblyOrder: 5,
        connections: ["Articular Cartilage", "Synovial Membrane"],
        failureEffect: "Loss of lubrication, accelerated cartilage wear, stiffness.",
        cascadeFailures: ["Cartilage degradation", "Inflammation of synovial membrane"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // 6. Joint Capsule / Synovial Membrane
    const capsuleGeo = new THREE.CylinderGeometry(2.2, 2.2, 4, 32, 1, true);
    const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMaterial);
    group.add(capsuleMesh);

    parts.push({
        name: "Joint Capsule",
        description: "A two-layered fibrous sheath enclosing the joint cavity. The inner lining (synovial membrane) secretes the fluid.",
        material: "capsuleMaterial",
        function: "Provides structural stability and seals the synovial fluid within the joint space.",
        assemblyOrder: 6,
        connections: ["Superior Bone", "Inferior Bone"],
        failureEffect: "Fluid leakage, joint instability, and potential infection entry.",
        cascadeFailures: ["Loss of synovial fluid", "Cartilage friction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 }
    });

    // 7. Ligaments (Collateral)
    const ligGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    
    const leftLigament = new THREE.Mesh(ligGeo, ligamentMaterial);
    leftLigament.position.set(-2.4, 0, 0);
    group.add(leftLigament);

    const rightLigament = new THREE.Mesh(ligGeo, ligamentMaterial);
    rightLigament.position.set(2.4, 0, 0);
    group.add(rightLigament);

    parts.push({
        name: "Collateral Ligaments",
        description: "Dense, fibrous connective tissue bands flanking the joint.",
        material: "ligamentMaterial",
        function: "Restricts abnormal lateral/medial movement, ensuring joint tracks correctly.",
        assemblyOrder: 7,
        connections: ["Superior Bone", "Inferior Bone"],
        failureEffect: "Joint hyperextension or unnatural lateral bending (sprain/tear).",
        cascadeFailures: ["Joint subluxation", "Cartilage shear damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });


    const description = "A high-tech, cybernetic visualization of a biological Synovial Joint. " +
                        "This interactive model highlights the frictionless articulation mechanisms " +
                        "evolved by nature, showcasing hyaline cartilage, a glowing non-Newtonian " +
                        "synovial fluid core, and the encapsulating fibrous sheath.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Synovial Fluid within the joint cavity?",
            options: [
                "To connect bone to bone directly.",
                "To lubricate the joint and nourish the articular cartilage.",
                "To produce red blood cells.",
                "To generate the electrical impulses that cause muscle contraction."
            ],
            correct: 1,
            explanation: "Synovial fluid acts as a biological lubricant reducing friction between the articular cartilages, and it also supplies oxygen and nutrients to the cartilage, which lacks its own blood supply.",
            difficulty: "Medium"
        },
        {
            question: "Which component is directly responsible for restricting abnormal lateral movement of a hinge joint like the knee?",
            options: [
                "Articular Cartilage",
                "Synovial Membrane",
                "Collateral Ligaments",
                "Bone Marrow"
            ],
            correct: 2,
            explanation: "Ligaments are tough bands of fibrous tissue that connect bones to other bones, stabilizing the joint and preventing unnatural or excessive movements.",
            difficulty: "Easy"
        },
        {
            question: "Why is the articular cartilage described as a 'frictionless gliding surface'?",
            options: [
                "It is constantly regenerating at a rate faster than it wears down.",
                "It has a very low coefficient of friction when lubricated by synovial fluid.",
                "It is coated in a layer of adipose (fat) tissue.",
                "It physically repels the opposing cartilage using electromagnetic fields."
            ],
            correct: 1,
            explanation: "Healthy hyaline (articular) cartilage, when bathed in synovial fluid, has a coefficient of friction lower than ice on ice, allowing for incredibly smooth movement.",
            difficulty: "Medium"
        }
    ];

    // Export meshes for animation access
    const meshes = {
        superiorGroup,
        inferiorGroup,
        fluidMesh,
        capsuleMesh,
        leftLigament,
        rightLigament
    };

    function animate(time, speed, meshes) {
        // Hinge movement: Superior bone bends back and forth
        const angle = Math.sin(time * speed) * (Math.PI / 4); 
        meshes.superiorGroup.rotation.z = angle;

        // Fluid pulsates slightly to simulate biological vitality
        const pulse = 0.6 + Math.sin(time * speed * 2) * 0.05;
        meshes.fluidMesh.scale.y = pulse;
        meshes.fluidMesh.scale.x = 1 + Math.sin(time * speed * 3) * 0.02;
        meshes.fluidMesh.scale.z = 1 + Math.cos(time * speed * 3) * 0.02;

        // Dynamic ligament stretching (visual approximation)
        const stretchDist = Math.abs(angle);
        meshes.leftLigament.scale.y = 1 + stretchDist * 0.1;
        meshes.rightLigament.scale.y = 1 + stretchDist * 0.1;
        
        // Dynamic material updates (glowing effect)
        const emissivePulse = 0.5 + Math.sin(time * speed * 4) * 0.3;
        meshes.fluidMesh.material.emissiveIntensity = emissivePulse;
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createSynovialJoint() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
