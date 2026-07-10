import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // Custom high-tech materials
    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ccff,
        emissive: 0x00ccff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.5,
        roughness: 0.1,
    });

    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
    });

    const hotSteel = new THREE.MeshPhysicalMaterial({
        color: 0xff7700,
        emissive: 0xaa2200,
        emissiveIntensity: 0.1, // this can change in animation
        metalness: 0.9,
        roughness: 0.4,
    });
    
    // Create Brake Rotor (Disc)
    const rotorGeo = new THREE.CylinderGeometry(5, 5, 0.4, 64);
    const rotorMesh = new THREE.Mesh(rotorGeo, steel);
    rotorMesh.rotation.x = Math.PI / 2;
    group.add(rotorMesh);
    
    // Add cooling vents to rotor
    const ventGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16);
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const vent = new THREE.Mesh(ventGeo, new THREE.MeshBasicMaterial({color: 0x000000}));
        vent.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        rotorMesh.add(vent);
    }

    // Caliper Body
    const caliperGeo = new THREE.BoxGeometry(4, 2, 2.5);
    const caliperMesh = new THREE.Mesh(caliperGeo, glowingRed);
    caliperMesh.position.set(0, 4, 0);
    group.add(caliperMesh);

    // Brake Pads
    const padGeo = new THREE.BoxGeometry(2.5, 1.5, 0.3);
    
    const padOutMesh = new THREE.Mesh(padGeo, darkSteel);
    padOutMesh.position.set(0, 3.8, 1);
    group.add(padOutMesh);

    const padInMesh = new THREE.Mesh(padGeo, darkSteel);
    padInMesh.position.set(0, 3.8, -1);
    group.add(padInMesh);

    // Pistons
    const pistonGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32);
    
    const piston1Mesh = new THREE.Mesh(pistonGeo, chrome);
    piston1Mesh.rotation.x = Math.PI / 2;
    piston1Mesh.position.set(-0.8, 3.8, -1.5);
    group.add(piston1Mesh);

    const piston2Mesh = new THREE.Mesh(pistonGeo, chrome);
    piston2Mesh.rotation.x = Math.PI / 2;
    piston2Mesh.position.set(0.8, 3.8, -1.5);
    group.add(piston2Mesh);

    // Brake Fluid Line
    const lineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 4.5, -1.25),
            new THREE.Vector3(0, 5.5, -2),
            new THREE.Vector3(2, 6, -3)
        ]), 
        20, 0.1, 8, false
    );
    const lineMesh = new THREE.Mesh(lineGeo, rubber);
    group.add(lineMesh);
    
    // Glowing fluid indicator inside the line
    const fluidMesh = new THREE.Mesh(lineGeo, glowingBlue);
    fluidMesh.scale.set(0.8, 0.8, 0.8);
    group.add(fluidMesh);

    const parts = [
        {
            name: "Brake Rotor",
            description: "A heavy steel disc connected to the wheel hub. The brake pads clamp against it to create friction.",
            material: "Steel / Hot Steel",
            function: "Dissipates heat and provides the friction surface for braking.",
            assemblyOrder: 1,
            connections: ["Wheel Hub", "Brake Pads"],
            failureEffect: "Warping causes vibration; excessive wear leads to loss of braking power.",
            cascadeFailures: ["Brake Pad destruction", "Wheel Hub stress"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 0 },
            mesh: rotorMesh
        },
        {
            name: "Caliper Body",
            description: "The main housing that holds the brake pads and pistons. Floating or fixed designs exist.",
            material: "Aluminum / Glowing Red Anodized",
            function: "Houses the hydraulic components and acts as a clamp.",
            assemblyOrder: 4,
            connections: ["Pistons", "Brake Pads", "Suspension Knuckle"],
            failureEffect: "Leaking fluid or seized slider pins leading to uneven pad wear.",
            cascadeFailures: ["Hydraulic pressure loss", "Overheating rotors"],
            originalPosition: { x: 0, y: 4, z: 0 },
            explodedPosition: { x: 0, y: 8, z: 0 },
            mesh: caliperMesh
        },
        {
            name: "Outer Brake Pad",
            description: "High-friction material bonded to a steel backing plate, located on the outside of the rotor.",
            material: "Dark Steel / Ceramic compound",
            function: "Contacts the rotor directly to generate stopping friction.",
            assemblyOrder: 3,
            connections: ["Caliper Body", "Brake Rotor"],
            failureEffect: "Reduced stopping power, metal-on-metal grinding if worn completely.",
            cascadeFailures: ["Rotor gouging"],
            originalPosition: { x: 0, y: 3.8, z: 1 },
            explodedPosition: { x: 0, y: 3.8, z: 4 },
            mesh: padOutMesh
        },
        {
            name: "Inner Brake Pad",
            description: "High-friction material on the inside of the rotor, directly pushed by the pistons.",
            material: "Dark Steel / Ceramic compound",
            function: "Generates friction against the inner face of the rotor.",
            assemblyOrder: 2,
            connections: ["Pistons", "Brake Rotor"],
            failureEffect: "Uneven braking or loss of stopping force.",
            cascadeFailures: ["Rotor gouging", "Piston over-extension"],
            originalPosition: { x: 0, y: 3.8, z: -1 },
            explodedPosition: { x: 0, y: 3.8, z: -4 },
            mesh: padInMesh
        },
        {
            name: "Hydraulic Pistons",
            description: "Cylinders that move outwards when hydraulic pressure is applied.",
            material: "Chrome / Steel",
            function: "Translates hydraulic pressure from brake fluid into mechanical clamping force.",
            assemblyOrder: 5,
            connections: ["Inner Brake Pad", "Caliper Body"],
            failureEffect: "Seizing, causing brakes to drag or fail to engage.",
            cascadeFailures: ["Pad glazing", "Rotor warping", "Fluid boiling"],
            originalPosition: { x: -0.8, y: 3.8, z: -1.5 },
            explodedPosition: { x: -3, y: 3.8, z: -6 },
            mesh: [piston1Mesh, piston2Mesh]
        },
        {
            name: "Brake Fluid Line",
            description: "High-pressure hose carrying hydraulic fluid.",
            material: "Rubber / Glowing Fluid",
            function: "Transmits force from the master cylinder to the caliper pistons.",
            assemblyOrder: 6,
            connections: ["Caliper Body"],
            failureEffect: "Rupture causes total loss of hydraulic pressure.",
            cascadeFailures: ["Complete brake failure"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 2, y: 8, z: -8 },
            mesh: [lineMesh, fluidMesh]
        }
    ];

    const description = "A high-performance automotive disc brake caliper assembly. Uses hydraulic pressure to actuate pistons, clamping brake pads against a spinning rotor to convert kinetic energy into thermal energy.";

    const quizQuestions = [
        {
            question: "What converts the kinetic energy of the vehicle into thermal energy during braking?",
            options: ["Hydraulic Pistons", "Brake Fluid", "Brake Pads and Rotor", "Caliper Body"],
            correct: 2,
            explanation: "The friction between the brake pads and the spinning rotor converts kinetic energy (motion) into thermal energy (heat).",
            difficulty: "Easy"
        },
        {
            question: "What is a direct consequence of a seized hydraulic piston?",
            options: ["The brake fluid will freeze", "The brake pads will constantly drag against the rotor", "The rotor will immediately shatter", "The steering wheel will lock"],
            correct: 1,
            explanation: "If a piston seizes, it cannot retract. This causes the pad to continuously rub against the rotor, creating excess heat and wear.",
            difficulty: "Medium"
        },
        {
            question: "Why might a brake rotor warp?",
            options: ["Excessive thermal cycling and localized hot spots", "Using high-octane fuel", "Low tire pressure", "Over-tightening the brake fluid line"],
            correct: 0,
            explanation: "Rotors warp when they are subjected to extreme heat and uneven cooling, or due to uneven pad deposits (often feeling like warping).",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the rotor continuously based on speed
        rotorMesh.rotation.y = time * speed * 2;
        
        // Simulate braking action
        // Braking cycle: engage -> hold -> release -> wait
        const brakeCycle = (time % 4);
        let brakingForce = 0;
        
        if (brakeCycle > 1 && brakeCycle < 2) {
            // Apply brakes
            brakingForce = (brakeCycle - 1);
        } else if (brakeCycle >= 2 && brakeCycle <= 3) {
            // Hold brakes
            brakingForce = 1;
        } else if (brakeCycle > 3) {
            // Release brakes
            brakingForce = 1 - (brakeCycle - 3);
        }
        
        // Move pads
        padOutMesh.position.z = 1 - (brakingForce * 0.15);
        padInMesh.position.z = -1 + (brakingForce * 0.15);
        
        // Move pistons
        piston1Mesh.position.z = -1.5 + (brakingForce * 0.15);
        piston2Mesh.position.z = -1.5 + (brakingForce * 0.15);
        
        // Heat simulation on rotor (glows orange when braking hard)
        if (brakingForce > 0) {
            hotSteel.emissiveIntensity = brakingForce * 0.8;
            rotorMesh.material = hotSteel;
        } else {
            hotSteel.emissiveIntensity = Math.max(0, hotSteel.emissiveIntensity - 0.05);
            if (hotSteel.emissiveIntensity < 0.05) {
                rotorMesh.material = steel;
            }
        }
        
        // Pulse the fluid
        fluidMesh.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.3 + (brakingForce * 0.5);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDiskBrakeCaliper() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
