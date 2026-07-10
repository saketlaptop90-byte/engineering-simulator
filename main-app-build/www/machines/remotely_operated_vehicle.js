export function createRemotelyOperatedVehicle(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // 1. Frame Chassis
    const chassisGeo = new THREE.BoxGeometry(2, 1.5, 3);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    model.add(chassis);
    parts.push({
        name: "Frame Chassis",
        description: "The main structural framework that holds all other components of the ROV.",
        mesh: chassis
    });

    // 2. Syntactic Foam Buoyancy Block
    const foamGeo = new THREE.BoxGeometry(2.05, 0.8, 3.05);
    const foamMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.8 }); // yellow
    const foam = new THREE.Mesh(foamGeo, foamMat);
    foam.position.set(0, 1.15, 0);
    model.add(foam);
    parts.push({
        name: "Syntactic Foam Buoyancy Block",
        description: "Provides neutral buoyancy to the ROV, counteracting the weight of heavy metallic components.",
        mesh: foam
    });

    // 3. Tool Sled
    const sledGeo = new THREE.BoxGeometry(2.2, 0.3, 3.2);
    const sledMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.3 });
    const sled = new THREE.Mesh(sledGeo, sledMat);
    sled.position.set(0, -0.9, 0);
    model.add(sled);
    parts.push({
        name: "Tool Sled",
        description: "A specialized skid attached to the bottom, holding extra tools and instruments for specific missions.",
        mesh: sled
    });

    // 4. Tether Management System
    const tmsGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const tmsMat = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.6 });
    const tms = new THREE.Mesh(tmsGeo, tmsMat);
    tms.position.set(0, 1.8, 0);
    model.add(tms);
    parts.push({
        name: "Tether Management System",
        description: "Manages the umbilical tether connection and provides strain relief and spooling.",
        mesh: tms
    });

    // 5. Umbilical Cable
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    cableGeo.translate(0, 1, 0); // Translate so pivot is at the bottom
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(0, 2.05, 0);
    model.add(cable);
    parts.push({
        name: "Umbilical Cable",
        description: "Provides power, communication, and telemetry between the surface vessel and the ROV.",
        mesh: cable
    });

    // 6. Pan-and-Tilt Cameras
    const cameraGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cameraMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.1, metalness: 0.8 });
    const camera = new THREE.Mesh(cameraGeo, cameraMat);
    camera.position.set(0, 0.2, 1.5);
    model.add(camera);
    parts.push({
        name: "Pan-and-Tilt Cameras",
        description: "High-definition camera system providing visual feedback to the surface pilot.",
        mesh: camera
    });

    // 7. LED Light Arrays
    const ledGeo = new THREE.BoxGeometry(1.2, 0.2, 0.2);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0.6, 1.55);
    model.add(led);
    parts.push({
        name: "LED Light Arrays",
        description: "Powerful illuminators designed to light up the dark ocean environment.",
        mesh: led
    });

    // 8. Hydraulic Pump
    const pumpGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x0277bd, metalness: 0.6, roughness: 0.4 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.rotation.z = Math.PI / 2;
    pump.position.set(0, -0.2, 0);
    model.add(pump);
    parts.push({
        name: "Hydraulic Pump",
        description: "Generates hydraulic pressure needed to power thrusters and manipulator arms.",
        mesh: pump
    });

    // 9. Thruster Blocks
    const thrusterGeo = new THREE.BoxGeometry(2.4, 0.6, 1.2);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.5 });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.position.set(0, 0, -1);
    model.add(thruster);
    parts.push({
        name: "Thruster Blocks",
        description: "Propulsion units that allow the ROV to maneuver in all spatial axes.",
        mesh: thruster
    });

    // 10. Manipulator Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.04, 1.5, 8);
    armGeo.translate(0, 0.75, 0); // pivot at base
    const armMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(0.6, -0.5, 1.5);
    arm.rotation.x = Math.PI / 2;
    model.add(arm);
    parts.push({
        name: "Manipulator Arms",
        description: "Robotic arms used for grasping, cutting, and interacting with subsea infrastructure.",
        mesh: arm
    });

    function update(time) {
        // Sway the umbilical cable slightly as if in a water current
        cable.rotation.z = Math.sin(time * 0.5) * 0.1;
        cable.rotation.x = Math.cos(time * 0.4) * 0.1;

        // Pan and tilt cameras scanning motion
        camera.rotation.y = Math.sin(time * 0.8) * 0.5;
        camera.rotation.x = Math.cos(time * 1.5) * 0.2;

        // Manipulator arm moving up and down slightly
        arm.rotation.x = Math.PI / 2 + Math.sin(time * 2) * 0.2;
        arm.rotation.z = Math.cos(time * 1.5) * 0.1;

        // LED intensity pulsing
        ledMat.emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.2;

        // Thruster block running vibration effect
        thruster.position.y = Math.sin(time * 20) * 0.01;
    }

    const quizzes = [
        {
            question: "What provides the main upward force to keep the ROV neutrally buoyant?",
            options: ["Hydraulic Pump", "Syntactic Foam Buoyancy Block", "Thruster Blocks", "Tool Sled"],
            correctAnswer: 1
        },
        {
            question: "Which component carries power and communication data from the surface vessel?",
            options: ["Manipulator Arms", "Tether Management System", "Umbilical Cable", "Frame Chassis"],
            correctAnswer: 2
        },
        {
            question: "What generates the pressure required to operate the ROV's robotic arms?",
            options: ["LED Light Arrays", "Pan-and-Tilt Cameras", "Hydraulic Pump", "Thruster Blocks"],
            correctAnswer: 2
        },
        {
            question: "Which component allows the surface pilot to visually inspect subsea equipment?",
            options: ["Pan-and-Tilt Cameras", "Umbilical Cable", "Tether Management System", "Tool Sled"],
            correctAnswer: 0
        },
        {
            question: "What is attached to the bottom of the ROV to carry extra specialized instruments?",
            options: ["Tool Sled", "Syntactic Foam Buoyancy Block", "Frame Chassis", "LED Light Arrays"],
            correctAnswer: 0
        },
        {
            question: "Which component provides the directional force to maneuver the ROV?",
            options: ["Hydraulic Pump", "Manipulator Arms", "Tether Management System", "Thruster Blocks"],
            correctAnswer: 3
        }
    ];

    return { model, update, parts, quizzes };
}
