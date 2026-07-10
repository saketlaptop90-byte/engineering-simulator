import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing material for Bio-ink
    const bioInkMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const heatedNozzleMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.4
    });

    // 1. Base Frame
    const baseGeom = new THREE.BoxGeometry(2, 6, 2);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.set(0, 3, 0);
    group.add(base);
    meshes.base = base;
    parts.push({
        name: "Base Frame",
        description: "Provides structural support for the extruder assembly, minimizing vibrations during high-precision bioprinting.",
        material: "Dark Steel",
        function: "Structural support and mounting",
        assemblyOrder: 1,
        connections: ["StepperMotor", "SyringeClamp"],
        failureEffect: "Vibrations and inaccurate printing",
        cascadeFailures: ["MicroNozzle", "SyringeBarrel"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: -3, y: 3, z: -3 }
    });

    // 2. Stepper Motor
    const motorGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const motor = new THREE.Mesh(motorGeom, chrome);
    motor.position.set(0, 6.75, 0);
    group.add(motor);
    meshes.motor = motor;
    parts.push({
        name: "Precision Stepper Motor",
        description: "Drives the lead screw to push the plunger with micrometer accuracy.",
        material: "Chrome / Copper",
        function: "Actuation of the syringe plunger",
        assemblyOrder: 2,
        connections: ["BaseFrame", "LeadScrew"],
        failureEffect: "Inconsistent extrusion rate or complete halt",
        cascadeFailures: ["PlungerPusher", "BioInkFlow"],
        originalPosition: { x: 0, y: 6.75, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 3. Lead Screw
    const screwGeom = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
    const screw = new THREE.Mesh(screwGeom, steel);
    screw.position.set(0, 4.5, 1);
    group.add(screw);
    meshes.screw = screw;
    parts.push({
        name: "Lead Screw",
        description: "Converts rotational motion from the stepper motor into precise linear motion.",
        material: "Steel",
        function: "Linear translation",
        assemblyOrder: 3,
        connections: ["StepperMotor", "PlungerPusher"],
        failureEffect: "Skipped layers or inaccurate bio-ink deposition",
        cascadeFailures: ["ExtrudedThread"],
        originalPosition: { x: 0, y: 4.5, z: 1 },
        explodedPosition: { x: 0, y: 4.5, z: 4 }
    });

    // 4. Syringe Barrel
    const syringeGeom = new THREE.CylinderGeometry(0.6, 0.6, 3, 32);
    const syringe = new THREE.Mesh(syringeGeom, glass);
    syringe.position.set(0, 3, 1);
    group.add(syringe);
    meshes.syringe = syringe;
    parts.push({
        name: "Syringe Barrel",
        description: "Sterile reservoir containing the bio-ink (cells + hydrogel).",
        material: "Glass",
        function: "Bio-ink containment",
        assemblyOrder: 4,
        connections: ["BaseFrame", "BioInkVolume", "MicroNozzle"],
        failureEffect: "Contamination or leakage of bio-ink",
        cascadeFailures: ["MicroNozzle", "ExtrudedThread"],
        originalPosition: { x: 0, y: 3, z: 1 },
        explodedPosition: { x: -3, y: 3, z: 4 }
    });

    // 5. Bio-Ink Volume (Inside Syringe)
    const bioInkGeom = new THREE.CylinderGeometry(0.55, 0.55, 2.5, 32);
    const bioInk = new THREE.Mesh(bioInkGeom, bioInkMaterial);
    bioInk.position.set(0, 2.75, 1);
    group.add(bioInk);
    meshes.bioInk = bioInk;
    parts.push({
        name: "Bio-Ink Hydrogel",
        description: "The living material being extruded, consisting of stem cells suspended in a biocompatible hydrogel matrix.",
        material: "Glowing Hydrogel",
        function: "Printing material",
        assemblyOrder: 5,
        connections: ["SyringeBarrel", "PlungerPusher"],
        failureEffect: "Cell death or poor print fidelity",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2.75, z: 1 },
        explodedPosition: { x: 3, y: 2.75, z: 4 }
    });

    // 6. Plunger
    const plungerGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.2, 32);
    const plunger = new THREE.Mesh(plungerGeom, rubber);
    plunger.position.set(0, 4, 1);
    group.add(plunger);
    meshes.plunger = plunger;
    
    const plungerRodGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const plungerRod = new THREE.Mesh(plungerRodGeom, aluminum);
    plungerRod.position.set(0, 4.85, 1);
    group.add(plungerRod);
    meshes.plungerRod = plungerRod;

    const plungerArmGeom = new THREE.BoxGeometry(1.5, 0.3, 0.5);
    const plungerArm = new THREE.Mesh(plungerArmGeom, aluminum);
    plungerArm.position.set(0, 5.5, 1);
    group.add(plungerArm);
    meshes.plungerArm = plungerArm;

    parts.push({
        name: "Plunger Assembly",
        description: "Pushes the bio-ink down through the syringe to the nozzle. Driven by the lead screw.",
        material: "Rubber / Aluminum",
        function: "Displacement of bio-ink",
        assemblyOrder: 6,
        connections: ["LeadScrew", "BioInkVolume"],
        failureEffect: "Loss of pressure, preventing extrusion",
        cascadeFailures: ["ExtrudedThread"],
        originalPosition: { x: 0, y: 4, z: 1 },
        explodedPosition: { x: 0, y: 6, z: 3 }
    });

    // 7. MicroNozzle
    const nozzleGeom = new THREE.ConeGeometry(0.2, 0.8, 16);
    const nozzle = new THREE.Mesh(nozzleGeom, heatedNozzleMaterial);
    nozzle.position.set(0, 1.1, 1);
    nozzle.rotation.x = Math.PI;
    group.add(nozzle);
    meshes.nozzle = nozzle;
    parts.push({
        name: "MicroNozzle",
        description: "Precision-engineered tip for extruding fine filaments of bio-ink. Often heated or cooled to control hydrogel crosslinking.",
        material: "Heated Metal",
        function: "Extrusion profiling and crosslinking initiation",
        assemblyOrder: 7,
        connections: ["SyringeBarrel", "ExtrudedThread"],
        failureEffect: "Clogging or cell shearing due to high pressure",
        cascadeFailures: ["SyringeBarrel", "StepperMotor"],
        originalPosition: { x: 0, y: 1.1, z: 1 },
        explodedPosition: { x: 0, y: 0, z: 1 }
    });

    // 8. Extruded Thread
    const threadGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const thread = new THREE.Mesh(threadGeom, bioInkMaterial);
    thread.position.set(0, 0, 1);
    group.add(thread);
    meshes.thread = thread;
    parts.push({
        name: "Extruded Bio-Thread",
        description: "The printed filament forming the 3D tissue construct.",
        material: "Glowing Hydrogel",
        function: "Tissue formation",
        assemblyOrder: 8,
        connections: ["MicroNozzle"],
        failureEffect: "Poor structural integrity of the printed tissue",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 1 },
        explodedPosition: { x: 0, y: -2, z: 1 }
    });

    const description = "The 3D Bioprinting Extruder is a highly specialized piece of medical engineering equipment designed to precisely deposit living cells and biocompatible materials (bio-inks) layer by layer. This model features a mechanical syringe pump system driven by a high-resolution stepper motor, ensuring micrometer-scale accuracy required for tissue engineering and regenerative medicine applications.";

    const quizQuestions = [
        {
            question: "Why is a syringe pump commonly used in 3D bioprinting instead of a filament drive gear?",
            options: [
                "Bio-inks are typically liquid or gel-like hydrogels, not solid filaments.",
                "Syringe pumps are cheaper to manufacture.",
                "Filament drives cause the extruder to overheat.",
                "Syringe pumps print faster than filament drives."
            ],
            correct: 0,
            explanation: "Bio-inks consist of living cells suspended in a liquid or gel matrix. A syringe or pneumatic pump is required to contain and extrude this non-solid material gently.",
            difficulty: "Medium"
        },
        {
            question: "What is a major risk when extruding living cells through a highly restricted micro-nozzle?",
            options: [
                "The nozzle might freeze.",
                "High shear stress can damage or kill the living cells.",
                "The bio-ink might turn into a solid plastic.",
                "The stepper motor will spin too fast."
            ],
            correct: 1,
            explanation: "Pushing viscous bio-inks through narrow nozzles generates shear stress. If this stress is too high, it ruptures the cell membranes, significantly reducing the viability of the printed tissue.",
            difficulty: "Hard"
        },
        {
            question: "What role does the lead screw play in this extruder design?",
            options: [
                "It heats the bio-ink to body temperature.",
                "It crosslinks the hydrogel.",
                "It converts the rotational motion of the stepper motor into precise linear motion to push the plunger.",
                "It cleans the micro-nozzle after a print."
            ],
            correct: 2,
            explanation: "The lead screw acts as a linear actuator, translating the rotational steps of the motor into a very precise downward force on the syringe plunger.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed) {
        // Rotate lead screw
        meshes.screw.rotation.y = time * speed * 2;
        
        // Simulate plunger going down and up
        const cycle = (Math.sin(time * speed * 0.5) + 1) / 2; // 0 to 1
        
        const maxPlungerY = 4;
        const minPlungerY = 2;
        const currentPlungerY = maxPlungerY - (cycle * (maxPlungerY - minPlungerY));
        
        meshes.plunger.position.y = currentPlungerY;
        meshes.plungerRod.position.y = currentPlungerY + 0.85;
        meshes.plungerArm.position.y = currentPlungerY + 1.5;
        
        // Bio-ink volume scaling
        const maxBioInkHeight = 2.5;
        const minBioInkHeight = 0.5;
        const currentHeight = maxBioInkHeight - (cycle * (maxBioInkHeight - minBioInkHeight));
        meshes.bioInk.scale.y = currentHeight / maxBioInkHeight;
        meshes.bioInk.position.y = 1.5 + (currentHeight / 2); // Base of syringe is at y=1.5
        
        // Extruded thread scaling and glowing
        meshes.thread.scale.y = cycle * 2 + 0.1;
        meshes.thread.position.y = 0.7 - (meshes.thread.scale.y * 1.5 / 2);
        
        meshes.bioInk.material.emissiveIntensity = 0.5 + (Math.sin(time * speed * 5) * 0.3);
        meshes.thread.material.emissiveIntensity = 0.5 + (Math.sin(time * speed * 5) * 0.3);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBioprintingExtruder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
