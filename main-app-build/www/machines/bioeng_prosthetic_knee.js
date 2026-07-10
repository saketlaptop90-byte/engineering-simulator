import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Materials
    const carbonFiberMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6,
        metalness: 0.8,
        wireframe: false,
    });
    
    const glowingBlueMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const glowingRedMat = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff2200,
        emissiveIntensity: 0.8,
    });

    const sensorChipMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
    });

    // 1. Thigh Socket Adapter (Top)
    const socketGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.6, 32);
    const socketAdapter = new THREE.Mesh(socketGeo, carbonFiberMat);
    socketAdapter.position.set(0, 3.5, 0);
    group.add(socketAdapter);
    meshes['socketAdapter'] = socketAdapter;
    parts.push({
        name: "Thigh Socket Adapter",
        description: "Carbon fiber interface connecting the patient's residual limb to the knee joint.",
        material: "Carbon Fiber",
        function: "Transfers weight and motion securely.",
        assemblyOrder: 1,
        connections: ["Main Frame", "Patient Socket"],
        failureEffect: "Limb detachment, total structural failure.",
        cascadeFailures: ["Loss of control", "Frame stress"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 5.5, z: 0 }
    });

    // 2. Main Frame Chassis
    const frameGeo = new THREE.BoxGeometry(0.8, 1.8, 0.9);
    const mainFrame = new THREE.Mesh(frameGeo, darkSteel);
    mainFrame.position.set(0, 2.3, 0);
    group.add(mainFrame);
    meshes['mainFrame'] = mainFrame;
    parts.push({
        name: "Main Frame Chassis",
        description: "Titanium-alloy structural body housing the electronic and hydraulic systems.",
        material: "Dark Steel / Titanium",
        function: "Structural support and protective casing.",
        assemblyOrder: 2,
        connections: ["Socket Adapter", "Knee Axis", "Microprocessor"],
        failureEffect: "Internal components exposed, frame collapse.",
        cascadeFailures: ["Hydraulic breach", "Microprocessor damage"],
        originalPosition: { x: 0, y: 2.3, z: 0 },
        explodedPosition: { x: -2, y: 2.3, z: 0 }
    });

    // 3. Microprocessor Unit
    const cpuGeo = new THREE.BoxGeometry(0.6, 0.4, 0.2);
    const cpu = new THREE.Mesh(cpuGeo, sensorChipMat);
    cpu.position.set(0, 2.5, 0.46);
    group.add(cpu);
    meshes['cpu'] = cpu;
    parts.push({
        name: "Microprocessor Unit",
        description: "The 'brain' of the knee, sampling sensor data 1000 times per second.",
        material: "Silicon/Gold",
        function: "Calculates gait phase and adjusts hydraulic resistance instantly.",
        assemblyOrder: 3,
        connections: ["Main Frame", "Sensors", "Hydraulic Valves"],
        failureEffect: "Knee locks up or goes entirely loose.",
        cascadeFailures: ["Fall hazard", "Hydraulic failure"],
        originalPosition: { x: 0, y: 2.5, z: 0.46 },
        explodedPosition: { x: 0, y: 2.5, z: 2 }
    });

    // 4. Status LED Matrix
    const ledGeo = new THREE.PlaneGeometry(0.4, 0.2);
    const led = new THREE.Mesh(ledGeo, glowingBlueMat);
    led.position.set(0, 2.5, 0.57);
    group.add(led);
    meshes['led'] = led;
    parts.push({
        name: "Status LED Matrix",
        description: "Visual indicator for battery life and active walking mode.",
        material: "LED / Glass",
        function: "Provides system feedback to the user.",
        assemblyOrder: 4,
        connections: ["Microprocessor"],
        failureEffect: "Loss of visual status.",
        cascadeFailures: ["Unknown battery state"],
        originalPosition: { x: 0, y: 2.5, z: 0.57 },
        explodedPosition: { x: 0, y: 2.5, z: 2.5 }
    });

    // 5. Main Knee Axis (Hinge)
    const axisGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 32);
    axisGeo.rotateZ(Math.PI / 2);
    const kneeAxis = new THREE.Mesh(axisGeo, chrome);
    kneeAxis.position.set(0, 1.4, 0);
    group.add(kneeAxis);
    meshes['kneeAxis'] = kneeAxis;
    parts.push({
        name: "Main Knee Axis",
        description: "Low-friction chrome-plated rotational joint.",
        material: "Chrome / Steel",
        function: "Allows flexion and extension of the lower limb.",
        assemblyOrder: 5,
        connections: ["Main Frame", "Lower Pylon"],
        failureEffect: "Inability to bend or extend.",
        cascadeFailures: ["Hydraulic piston sheer"],
        originalPosition: { x: 0, y: 1.4, z: 0 },
        explodedPosition: { x: 3, y: 1.4, z: 0 }
    });

    // 6. Hydraulic Damper Cylinder
    const damperGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const damper = new THREE.Mesh(damperGeo, steel);
    damper.position.set(0, 0.6, -0.2);
    group.add(damper);
    meshes['damper'] = damper;
    parts.push({
        name: "Hydraulic Damper Cylinder",
        description: "Contains magnetorheological fluid or hydraulic oil for variable resistance.",
        material: "Steel",
        function: "Provides resistance to control swing and stance phases.",
        assemblyOrder: 6,
        connections: ["Knee Axis", "Hydraulic Piston"],
        failureEffect: "Loss of damping, knee buckles freely.",
        cascadeFailures: ["Fall hazard"],
        originalPosition: { x: 0, y: 0.6, z: -0.2 },
        explodedPosition: { x: 0, y: 0.6, z: -2 }
    });

    // 7. Hydraulic Piston Rod
    const pistonGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16);
    const piston = new THREE.Mesh(pistonGeo, glowingRedMat);
    piston.position.set(0, 1.3, -0.2);
    group.add(piston);
    meshes['piston'] = piston;
    parts.push({
        name: "Hydraulic Piston Rod",
        description: "Actuator rod moving through the hydraulic fluid.",
        material: "Titanium / Glowing Accents",
        function: "Transfers mechanical force to the damping fluid.",
        assemblyOrder: 7,
        connections: ["Hydraulic Damper Cylinder", "Main Frame"],
        failureEffect: "Rod snaps, complete loss of resistance.",
        cascadeFailures: ["Damper cylinder rupture"],
        originalPosition: { x: 0, y: 1.3, z: -0.2 },
        explodedPosition: { x: 0, y: 2.0, z: -2 }
    });

    // 8. Lower Pylon (Shin)
    const pylonGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16);
    const pylon = new THREE.Mesh(pylonGeo, aluminum);
    pylon.position.set(0, -0.5, 0);
    group.add(pylon);
    meshes['pylon'] = pylon;
    parts.push({
        name: "Lower Pylon",
        description: "Lightweight tubular structure representing the shin.",
        material: "Aluminum",
        function: "Connects the knee joint to the prosthetic foot.",
        assemblyOrder: 8,
        connections: ["Knee Axis", "Ankle/Foot"],
        failureEffect: "Pylon snaps, catastrophic limb failure.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -3.0, z: 0 }
    });

    const description = "An advanced Microprocessor Prosthetic Knee (MPK). It uses a sophisticated array of sensors and a microprocessor to monitor the user's gait continuously. By adjusting hydraulic or pneumatic resistance in real-time, it provides stability during the stance phase and a smooth, natural swing phase, greatly reducing the risk of stumbling and falling compared to mechanical knees.";

    const quizQuestions = [
        {
            question: "What is the primary function of the microprocessor in this prosthetic knee?",
            options: [
                "To power the hydraulic pump for active movement",
                "To calculate gait phase and adjust resistance dynamically",
                "To transmit Bluetooth audio",
                "To cool the hydraulic fluid"
            ],
            correct: 1,
            explanation: "The microprocessor calculates the user's gait phase based on sensor inputs and adjusts hydraulic damping in real-time to ensure stability and fluid motion.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the hydraulic damper fails?",
            options: [
                "The knee locks in a straight position permanently",
                "The knee buckles freely, posing a severe fall hazard",
                "The microprocessor takes over physical movement",
                "The pylon snaps"
            ],
            correct: 1,
            explanation: "The damper provides resistance. Without it, there is no support during the stance phase, causing the knee to buckle under weight.",
            difficulty: "Hard"
        },
        {
            question: "Which material is heavily utilized for the main structural elements like the Main Frame and Socket Adapter to keep weight low while maintaining strength?",
            options: [
                "Cast Iron",
                "Copper",
                "Carbon Fiber and Titanium/Steel alloys",
                "Rubber"
            ],
            correct: 2,
            explanation: "Prosthetics require a high strength-to-weight ratio, making carbon fiber and titanium/dark steel ideal choices for structural components.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Simulate walking cycle
        const walkCycle = time * speed * 2;
        
        // Flexion and extension of the knee (Main frame and socket stay still relative to thigh, lower leg swings)
        // To make it look right without complex rigging, we'll swing the lower parts.
        const kneeAngle = (Math.sin(walkCycle) * 0.5 + 0.5) * -1.2; // Angle from 0 to -1.2 radians
        
        // Pivot point is kneeAxis (y=1.4, z=0)
        const pivotY = 1.4;
        const pivotZ = 0;

        function rotateAroundPivot(mesh, originalY, originalZ, angle) {
            const dy = originalY - pivotY;
            const dz = originalZ - pivotZ;
            
            const newZ = dz * Math.cos(angle) - dy * Math.sin(angle) + pivotZ;
            const newY = dz * Math.sin(angle) + dy * Math.cos(angle) + pivotY;
            
            mesh.position.y = newY;
            mesh.position.z = newZ;
            mesh.rotation.x = angle;
        }

        if(meshesObj.pylon) {
            rotateAroundPivot(meshesObj.pylon, -0.5, 0, kneeAngle);
        }
        
        if(meshesObj.damper) {
             rotateAroundPivot(meshesObj.damper, 0.6, -0.2, kneeAngle);
        }

        if(meshesObj.piston) {
            meshesObj.piston.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(walkCycle)) * 1.5;
        }

        if(meshesObj.led) {
            meshesObj.led.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5; // Blinking LED
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createProstheticKnee() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
