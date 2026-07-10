import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
    });

    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff5500,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.9,
    });
    
    const coolingZoneMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0022ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.3,
    });

    // Helper to add parts
    function addPart(name, mesh, info) {
        mesh.name = name;
        mesh.position.copy(info.originalPosition);
        group.add(mesh);
        parts.push({
            name,
            ...info
        });
    }

    // 1. Base / Framework
    const baseGeo = new THREE.BoxGeometry(20, 1, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    addPart("Main Base", baseMesh, {
        description: "Heavy steel structural foundation supporting the entire lehr.",
        material: "Dark Steel",
        function: "Provides rigid support and alignment for the conveyor and heating zones.",
        assemblyOrder: 1,
        connections: ["Conveyor Framework", "Oven Shell"],
        failureEffect: "Misalignment of the conveyor leading to glass breakage.",
        cascadeFailures: ["Conveyor Jam", "Thermal Seal Breach"],
        originalPosition: new THREE.Vector3(0, -2, 0),
        explodedPosition: new THREE.Vector3(0, -6, 0)
    });

    // 2. Oven Shell / Tunnel (Heating Zone)
    const shellGeo = new THREE.BoxGeometry(8, 4, 4.2);
    const shellMesh = new THREE.Mesh(shellGeo, steel);
    addPart("Heating Chamber Shell", shellMesh, {
        description: "Heavily insulated primary heating zone.",
        material: "Steel / Ceramic Insulation",
        function: "Maintains high temperatures to relieve internal stresses in glass.",
        assemblyOrder: 2,
        connections: ["Main Base", "Heating Elements"],
        failureEffect: "Heat loss, causing uneven annealing and brittle glass.",
        cascadeFailures: ["Product Rejection", "Energy Waste"],
        originalPosition: new THREE.Vector3(-6, 0.5, 0),
        explodedPosition: new THREE.Vector3(-6, 5, -5)
    });

    // 3. Heating Elements
    const elementGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.8);
    for(let i=0; i<5; i++) {
        const el = new THREE.Mesh(elementGeo, glowRed);
        el.rotation.x = Math.PI / 2;
        addPart(`Heating Element ${i+1}`, el, {
            description: "High-resistance silicon carbide heating element.",
            material: "Silicon Carbide",
            function: "Generates intense radiant heat to reach annealing temperature.",
            assemblyOrder: 3,
            connections: ["Heating Chamber Shell", "Power Supply"],
            failureEffect: "Cold spots in the annealing profile.",
            cascadeFailures: ["Thermal Shock in Glass"],
            originalPosition: new THREE.Vector3(-9 + i*1.5, 2, 0),
            explodedPosition: new THREE.Vector3(-9 + i*1.5, 6, 5)
        });
    }

    // 4. Cooling Chamber (Annealing / Strain Zone)
    const coolingGeo = new THREE.BoxGeometry(8, 3.5, 4.2);
    const coolingMesh = new THREE.Mesh(coolingGeo, aluminum);
    addPart("Cooling Chamber", coolingMesh, {
        description: "Controlled temperature gradient cooling section.",
        material: "Aluminum",
        function: "Gradually reduces glass temperature to prevent new stresses from forming.",
        assemblyOrder: 4,
        connections: ["Heating Chamber Shell", "Main Base", "Cooling Fans"],
        failureEffect: "Too rapid cooling leading to glass shattering.",
        cascadeFailures: ["Conveyor Jam from debris"],
        originalPosition: new THREE.Vector3(2, 0.25, 0),
        explodedPosition: new THREE.Vector3(2, 4, -5)
    });

    // 5. Cooling Fans
    const fanGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    for(let i=0; i<3; i++) {
        const fan = new THREE.Mesh(fanGeo, chrome);
        addPart(`Cooling Fan ${i+1}`, fan, {
            description: "Variable speed forced-air cooling fan.",
            material: "Chrome / Steel",
            function: "Regulates the precise cooling rate in the strain zone.",
            assemblyOrder: 5,
            connections: ["Cooling Chamber", "Control System"],
            failureEffect: "Loss of controlled cooling profile.",
            cascadeFailures: ["Glass Warpage", "Stress Fractures"],
            originalPosition: new THREE.Vector3(-0.5 + i*2.5, 2.25, 0),
            explodedPosition: new THREE.Vector3(-0.5 + i*2.5, 7, 0)
        });
    }

    // 6. Conveyor Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    for(let i=0; i<20; i++) {
        const roller = new THREE.Mesh(rollerGeo, steel);
        roller.rotation.x = Math.PI / 2;
        addPart(`Roller ${i+1}`, roller, {
            description: "Precision steel roller.",
            material: "Steel",
            function: "Transports glass smoothly through the lehr.",
            assemblyOrder: 6,
            connections: ["Main Base", "Drive Motor"],
            failureEffect: "Glass stops or scratches on the roller.",
            cascadeFailures: ["Product Pileup", "Surface Defects"],
            originalPosition: new THREE.Vector3(-9.5 + i*1, -1, 0),
            explodedPosition: new THREE.Vector3(-9.5 + i*1, -4, 5)
        });
    }

    // 7. Glass Sheets (Moving parts)
    const glassGeo = new THREE.BoxGeometry(1.5, 0.05, 3);
    for(let i=0; i<5; i++) {
        const sheetMat = glowRed.clone();
        const sheet = new THREE.Mesh(glassGeo, sheetMat);
        addPart(`Glass Sheet ${i+1}`, sheet, {
            description: "Continuous ribbon or sheets of float glass.",
            material: "Silica Glass",
            function: "The product being annealed to relieve internal stresses.",
            assemblyOrder: 7,
            connections: ["Conveyor Rollers"],
            failureEffect: "Shattering or unacceptable stress levels.",
            cascadeFailures: ["System Stop", "Scrap Generation"],
            originalPosition: new THREE.Vector3(-9.5 + i*3, -0.75, 0),
            explodedPosition: new THREE.Vector3(-9.5 + i*3, -0.75, 8)
        });
    }

    // 8. Control Panel
    const panelGeo = new THREE.BoxGeometry(1, 2, 1);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    addPart("Control Panel", panelMesh, {
        description: "Digital PLC interface for thermal profile management.",
        material: "Plastic / Electronics",
        function: "Monitors and adjusts zone temperatures and conveyor speed.",
        assemblyOrder: 8,
        connections: ["Heating Elements", "Cooling Fans", "Drive Motor"],
        failureEffect: "Loss of process control.",
        cascadeFailures: ["Thermal Runaway", "Complete Batch Loss"],
        originalPosition: new THREE.Vector3(8, 0, 2.5),
        explodedPosition: new THREE.Vector3(12, 0, 5)
    });

    const description = "The Annealing Lehr Oven is a long, temperature-controlled kiln used in glass manufacturing. Freshly formed glass is carried through on a conveyor belt. It enters a heating zone to relieve internal stresses, then slowly passes through a precise temperature gradient (cooling zone) to prevent new stresses from forming as it reaches room temperature. Proper annealing prevents the glass from being dangerously brittle.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the Annealing Lehr Oven in glass manufacturing?",
            options: [
                "To melt raw silica into liquid glass",
                "To cut the glass into precise sheets",
                "To relieve internal stresses by controlled heating and cooling",
                "To coat the glass with reflective materials"
            ],
            correct: 2,
            explanation: "Annealing involves heating the glass to its annealing point and slowly cooling it to relieve internal stresses, making it less brittle.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the cooling rate in the strain zone is too rapid?",
            options: [
                "The glass becomes significantly stronger",
                "The glass may shatter or warp due to thermal shock and new internal stresses",
                "The conveyor belt will overheat",
                "The heating elements will consume less power"
            ],
            correct: 1,
            explanation: "Rapid or uneven cooling induces extreme temperature gradients, creating new internal stresses that can cause the glass to warp or shatter instantly.",
            difficulty: "Medium"
        },
        {
            question: "Which component is critical for ensuring the glass travels at the correct speed through the thermal profile?",
            options: [
                "Cooling Fans",
                "Heating Chamber Shell",
                "Conveyor Rollers",
                "Ceramic Insulation"
            ],
            correct: 2,
            explanation: "The conveyor rollers (and drive motor) dictate the speed. Speed directly affects how long the glass stays in each temperature zone.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate fans
        for(let i=1; i<=3; i++) {
            const fan = meshes[`Cooling Fan ${i}`];
            if(fan) fan.rotation.y += 0.2 * speed;
        }

        // Rotate rollers
        for(let i=1; i<=20; i++) {
            const roller = meshes[`Roller ${i}`];
            if(roller) roller.rotation.y += 0.05 * speed; 
        }

        // Move glass and change color based on position
        for(let i=1; i<=5; i++) {
            const sheet = meshes[`Glass Sheet ${i}`];
            if(sheet) {
                sheet.position.x += 0.02 * speed;
                
                // Reset to start if it goes too far
                if(sheet.position.x > 9.5) {
                    sheet.position.x = -9.5;
                }

                // Color interpolation based on X position
                // Hot zone: x = -9 to -2
                // Cooling zone: x = -2 to 6
                // Cool: x > 6
                const x = sheet.position.x;
                if(sheet.material) {
                    if (x < -2) {
                        // Very hot (Red/Orange)
                        sheet.material.color.setHex(0xff3300);
                        sheet.material.emissive.setHex(0xff1100);
                        sheet.material.emissiveIntensity = 1.5;
                        sheet.material.opacity = 0.9;
                    } else if (x >= -2 && x < 6) {
                        // Transition phase
                        const progress = (x - (-2)) / 8; // 0 to 1
                        
                        // Interpolate color from Red to Light Blue/Clear
                        const r = Math.max(0.2, 1.0 - progress);
                        const g = Math.min(0.8, 0.2 + progress);
                        const b = Math.min(1.0, progress * 1.5);
                        
                        sheet.material.color.setRGB(r, g, b);
                        sheet.material.emissive.setRGB(r*0.5, 0, 0); // Fade emissive
                        sheet.material.emissiveIntensity = Math.max(0, 1.5 - progress * 1.5);
                        sheet.material.opacity = Math.max(0.4, 0.9 - progress * 0.5);
                    } else {
                        // Fully cooled glass
                        sheet.material.color.setHex(0xaaaaaa); // Slight tint
                        sheet.material.emissive.setHex(0x000000);
                        sheet.material.emissiveIntensity = 0;
                        sheet.material.opacity = 0.4;
                    }
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAnnealingLehrOven() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
