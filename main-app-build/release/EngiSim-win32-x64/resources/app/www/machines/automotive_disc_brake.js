import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const carbonCeramic = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
    });

    const hotGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 0.0, // Will be animated
        roughness: 0.6,
        metalness: 0.3
    });

    const caliperRed = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        roughness: 0.3,
        metalness: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const padMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1
    });

    // 1. Wheel Hub / Spindle
    const hubGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    hubGeometry.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeometry, steel);
    const hubPos = { x: 0, y: 0, z: -2 };
    hub.position.set(hubPos.x, hubPos.y, hubPos.z);
    group.add(hub);
    parts.push({
        name: "Wheel Hub",
        description: "The central mounting point for the brake rotor and the wheel. It houses the wheel bearings and allows the wheel assembly to rotate freely.",
        material: "Steel",
        function: "Supports the rotating weight of the vehicle and transfers braking forces to the suspension.",
        assemblyOrder: 1,
        connections: ["Suspension Upright", "Brake Rotor", "Axle Shaft"],
        failureEffect: "Wheel wobble, bearing failure, or catastrophic loss of wheel attachment.",
        cascadeFailures: ["Brake rotor misalignment", "Caliper damage", "Suspension failure"],
        originalPosition: hubPos,
        explodedPosition: { x: 0, y: 0, z: -6 }
    });

    // 2. Brake Rotor (Disc)
    const rotorDiskGeom = new THREE.CylinderGeometry(6, 6, 0.8, 64);
    rotorDiskGeom.rotateX(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorDiskGeom, hotGlowMaterial);
    
    // Add inner hub part of rotor
    const rotorHatGeom = new THREE.CylinderGeometry(3, 3, 1.5, 32);
    rotorHatGeom.rotateX(Math.PI / 2);
    rotorHatGeom.translate(0, 0, 0.35);
    const rotorHat = new THREE.Mesh(rotorHatGeom, darkSteel);
    rotor.add(rotorHat);

    // Drilling holes in rotor visually
    const holeGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    holeGeom.rotateX(Math.PI / 2);
    const numHoles = 24;
    for(let i=0; i<numHoles; i++) {
        const angle = (i / numHoles) * Math.PI * 2;
        const h = new THREE.Mesh(holeGeom, new THREE.MeshBasicMaterial({color: 0x000000}));
        h.position.set(Math.cos(angle)*4.5, Math.sin(angle)*4.5, 0);
        rotor.add(h);
    }

    const rotorPos = { x: 0, y: 0, z: 0 };
    rotor.position.set(rotorPos.x, rotorPos.y, rotorPos.z);
    group.add(rotor);
    parts.push({
        name: "Ventilated Brake Rotor",
        description: "A large disc made of cast iron or carbon-ceramic that rotates with the wheel. Features internal vanes for cooling and cross-drilled holes for gas dispersion.",
        material: "Carbon-Ceramic / Cast Iron",
        function: "Provides the friction surface for the brake pads. Converts kinetic energy into thermal energy to slow the vehicle.",
        assemblyOrder: 2,
        connections: ["Wheel Hub", "Brake Pads", "Wheel"],
        failureEffect: "Reduced braking performance, severe vibration during braking (warped rotor), or rotor cracking.",
        cascadeFailures: ["Brake pad glazing", "Caliper piston blowback", "Loss of braking power"],
        originalPosition: rotorPos,
        explodedPosition: { x: 0, y: 0, z: -2 }
    });

    // 3. Brake Caliper Bracket
    const bracketGeom = new THREE.BoxGeometry(4, 7, 2);
    const bracket = new THREE.Mesh(bracketGeom, darkSteel);
    const bracketPos = { x: -6.5, y: 0, z: -1.5 };
    bracket.position.set(bracketPos.x, bracketPos.y, bracketPos.z);
    group.add(bracket);
    parts.push({
        name: "Caliper Bracket",
        description: "A heavy-duty mounting bracket attached to the vehicle's suspension upright.",
        material: "Forged Steel / Aluminum",
        function: "Holds the brake pads in place and provides the mounting structure for the caliper body.",
        assemblyOrder: 3,
        connections: ["Suspension Upright", "Brake Pads", "Caliper Body"],
        failureEffect: "Caliper misalignment or detachment, causing catastrophic brake failure.",
        cascadeFailures: ["Brake line rupture", "Wheel lockup"],
        originalPosition: bracketPos,
        explodedPosition: { x: -10, y: 0, z: -3 }
    });

    // 4. Brake Pads
    const padOuterGeom = new THREE.BoxGeometry(2, 4, 0.5);
    const padInnerGeom = new THREE.BoxGeometry(2, 4, 0.5);
    
    const padOuter = new THREE.Mesh(padOuterGeom, padMaterial);
    const padInner = new THREE.Mesh(padInnerGeom, padMaterial);

    const padOuterPos = { x: -5.5, y: 0, z: 0.6 };
    const padInnerPos = { x: -5.5, y: 0, z: -0.6 };
    
    padOuter.position.set(padOuterPos.x, padOuterPos.y, padOuterPos.z);
    padInner.position.set(padInnerPos.x, padInnerPos.y, padInnerPos.z);
    group.add(padOuter);
    group.add(padInner);

    parts.push({
        name: "Brake Pads",
        description: "Friction material bonded to a steel backing plate. Positioned on either side of the brake rotor.",
        material: "Ceramic / Semi-Metallic Compound",
        function: "Clamps onto the spinning rotor to generate friction, slowing down the vehicle.",
        assemblyOrder: 4,
        connections: ["Caliper Bracket", "Caliper Pistons", "Brake Rotor"],
        failureEffect: "Metal-on-metal grinding, complete loss of braking ability, excessive stopping distance.",
        cascadeFailures: ["Rotor gouging", "Caliper destruction"],
        originalPosition: padOuterPos,
        explodedPosition: { x: -8, y: 0, z: 2 } // For outer pad
    });

    // 5. Brake Caliper Body (Floating/Fixed)
    const caliperGeom = new THREE.BoxGeometry(4.5, 6, 3.5);
    const caliper = new THREE.Mesh(caliperGeom, caliperRed);
    const caliperPos = { x: -6.5, y: 0, z: 0 };
    caliper.position.set(caliperPos.x, caliperPos.y, caliperPos.z);
    group.add(caliper);
    
    parts.push({
        name: "Brake Caliper Body",
        description: "A large hydraulic clamp painted in high-temperature red enamel. Houses the hydraulic pistons.",
        material: "Aluminum Alloy",
        function: "Squeezes the brake pads against the rotor when hydraulic pressure is applied via the brake pedal.",
        assemblyOrder: 5,
        connections: ["Caliper Bracket", "Hydraulic Line", "Brake Pads"],
        failureEffect: "Fluid leak resulting in loss of hydraulic pressure, or seized caliper causing constant pad drag.",
        cascadeFailures: ["Rotor overheating", "Pad fire", "Brake fluid boiling"],
        originalPosition: caliperPos,
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    // 6. Caliper Pistons
    const pistonGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    pistonGeom.rotateX(Math.PI / 2);
    const piston1 = new THREE.Mesh(pistonGeom, chrome);
    const piston2 = new THREE.Mesh(pistonGeom, chrome);
    
    const piston1Pos = { x: -6.5, y: 1.5, z: -1.0 };
    const piston2Pos = { x: -6.5, y: -1.5, z: -1.0 };
    piston1.position.set(piston1Pos.x, piston1Pos.y, piston1Pos.z);
    piston2.position.set(piston2Pos.x, piston2Pos.y, piston2Pos.z);
    
    group.add(piston1);
    group.add(piston2);
    
    parts.push({
        name: "Hydraulic Pistons",
        description: "Precision-machined cylindrical plungers located inside the caliper body.",
        material: "Chrome-Plated Steel / Phenolic",
        function: "Extends outward under hydraulic pressure to force the brake pads against the spinning rotor.",
        assemblyOrder: 6,
        connections: ["Caliper Body", "Brake Pads", "Hydraulic Fluid"],
        failureEffect: "Stuck piston leading to unequal braking force, vehicle pulling to one side, or premature pad wear.",
        cascadeFailures: ["Overheated rotor", "Pad disintegration"],
        originalPosition: piston1Pos,
        explodedPosition: { x: -12, y: 2, z: -3 }
    });

    // 7. Brake Line / Hose
    const hoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7, 2.5, 0),
        new THREE.Vector3(-8, 5, 0),
        new THREE.Vector3(-6, 8, -2),
        new THREE.Vector3(-2, 10, -3)
    ]);
    const hoseGeom = new THREE.TubeGeometry(hoseCurve, 20, 0.2, 8, false);
    const hose = new THREE.Mesh(hoseGeom, rubber);
    group.add(hose);
    parts.push({
        name: "Braided Brake Line",
        description: "A flexible hose wrapped in stainless steel braiding to prevent expansion under high pressure.",
        material: "Teflon / Stainless Steel / Rubber",
        function: "Transmits highly pressurized DOT 4 brake fluid from the master cylinder to the brake caliper.",
        assemblyOrder: 7,
        connections: ["Caliper Body", "Hard Brake Line"],
        failureEffect: "Spongy brake pedal, fluid leakage, sudden loss of braking capability.",
        cascadeFailures: ["Total vehicle brake failure"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x: -3, y: 5, z: -5}
    });

    const description = "The Automotive Disc Brake is a highly efficient friction-based deceleration mechanism. It operates by converting the kinetic energy of a moving vehicle into thermal energy through the application of friction. Hydraulic pressure from the brake pedal forces the caliper pistons to squeeze high-friction brake pads against a spinning carbon-ceramic or cast-iron rotor. This assembly features advanced vented and cross-drilled rotors to dissipate massive amounts of heat generated during intense braking.";

    const quizQuestions = [
        {
            question: "What is the primary function of the brake rotor's internal vanes and cross-drilled holes?",
            options: [
                "To reduce the manufacturing weight of the car",
                "To cool the rotor by dissipating heat and allowing gases to escape",
                "To improve the aerodynamic profile of the wheel",
                "To increase the friction coefficient for the brake pads"
            ],
            correct: 1,
            explanation: "Braking generates extreme heat. The vanes draw air through the rotor to cool it, while the cross-drilled holes allow hot gases and brake dust to escape, preventing 'brake fade'.",
            difficulty: "Medium"
        },
        {
            question: "Which component directly applies pressure to the brake pads?",
            options: [
                "The Wheel Hub",
                "The Caliper Bracket",
                "The Hydraulic Pistons",
                "The Master Cylinder"
            ],
            correct: 2,
            explanation: "Pressurized brake fluid forces the hydraulic pistons out of the caliper body, which directly pushes the brake pads against the spinning rotor.",
            difficulty: "Easy"
        },
        {
            question: "What happens if a caliper piston seizes (gets stuck)?",
            options: [
                "The rotor will spin faster",
                "The brake pad will constantly drag against the rotor, causing severe overheating",
                "The brake fluid will immediately drain out",
                "The steering wheel will lock up"
            ],
            correct: 1,
            explanation: "A seized piston won't retract when the brake pedal is released, causing the pad to drag constantly. This leads to massive heat buildup, glazed pads, and warped rotors.",
            difficulty: "Hard"
        }
    ];

    let brakeIntensity = 0;
    
    function animate(time, speed, meshes) {
        // Find meshes
        const hubMesh = group.children[0];
        const rotorMesh = group.children[1]; // Rotor
        const padOut = group.children[3];
        const padIn = group.children[4];
        const caliperBody = group.children[5];

        // Rotation speed based on global speed and brake intensity
        const cycle = (time * speed) % 10; // 10 second cycle
        
        // 0-4s: Accelerating/cruising
        // 4-6s: Braking hard
        // 6-10s: Cooling down / stopped
        
        let currentRotationSpeed = 0.5 * speed;
        
        if (cycle < 4) {
            brakeIntensity = 0;
            currentRotationSpeed = 0.5 * speed; // Cruising
        } else if (cycle >= 4 && cycle < 6) {
            // Braking phase
            brakeIntensity = Math.min(1, (cycle - 4) * 2); // Ramp up to 1
            currentRotationSpeed = (0.5 * speed) * (1 - brakeIntensity * 0.9); // Slow down
        } else {
            // Cooldown phase
            brakeIntensity = Math.max(0, 1 - (cycle - 6) / 4); // Ramp down to 0
            currentRotationSpeed = (0.5 * speed) * 0.1; // Slow rolling
        }
        
        // Rotate the rotor and hub
        rotorMesh.rotation.z -= currentRotationSpeed;
        hubMesh.rotation.z -= currentRotationSpeed;
        
        // Animate Brake Pads clamping
        padOut.position.z = 0.6 - (brakeIntensity * 0.15);
        padIn.position.z = -0.6 + (brakeIntensity * 0.15);
        
        // Animate Glowing Material
        hotGlowMaterial.emissiveIntensity = brakeIntensity * 1.5;
        
        // Adding micro-vibration to caliper when braking hard
        if (brakeIntensity > 0.5) {
            caliperBody.position.y = (Math.random() - 0.5) * 0.05;
        } else {
            caliperBody.position.y = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDiscBrake() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
