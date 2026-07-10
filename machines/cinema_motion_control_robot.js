import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingNode = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc, emissive: 0x006655, emissiveIntensity: 2,
        roughness: 0.1, metalness: 0.9
    });

    const trackGeo = new THREE.BoxGeometry(20, 0.5, 2);
    const trackMesh = new THREE.Mesh(trackGeo, darkSteel);
    trackMesh.position.set(0, 0.25, 0);
    group.add(trackMesh);
    parts.push({
        name: "Linear Track System",
        description: "Heavy precision-milled steel rails.",
        material: "Steel",
        function: "Allows the entire robotic arm to move smoothly in the X-axis.",
        assemblyOrder: 1,
        connections: ["Robotic Base"],
        failureEffect: "Bump in tracking shot.",
        cascadeFailures: ["Ruined VFX composite"],
        originalPosition: {x:0, y:0.25, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    const baseGeo = new THREE.CylinderGeometry(2, 2, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, aluminum);
    baseMesh.position.set(0, 1.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Slew Base",
        description: "Rotating heavy-duty robot base.",
        material: "Aluminum",
        function: "Rotates the entire arm (pan).",
        assemblyOrder: 2,
        connections: ["Track", "Lower Arm"],
        failureEffect: "Motor slip.",
        cascadeFailures: ["Loss of absolute positioning"],
        originalPosition: {x:0, y:1.5, z:0},
        explodedPosition: {x:0, y:1.5, z:-5}
    });

    const lowerArmGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    const lowerArmMesh = new THREE.Mesh(lowerArmGeo, chrome);
    lowerArmMesh.position.set(0, 5, 0);
    group.add(lowerArmMesh);
    parts.push({
        name: "Main Boom Arm",
        description: "Long, stiff carbon-fiber or metal tube.",
        material: "Chrome / Carbon Fiber",
        function: "Provides the main vertical and reach extension.",
        assemblyOrder: 3,
        connections: ["Base", "Upper Arm"],
        failureEffect: "Arm flexion.",
        cascadeFailures: ["Camera shake during fast moves"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:-5, y:5, z:0}
    });

    const headGeo = new THREE.SphereGeometry(1, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, glowingNode);
    headMesh.position.set(0, 8, 0);
    group.add(headMesh);
    parts.push({
        name: "6-Axis Gimbal Head",
        description: "Glowing precision multi-axis camera mount.",
        material: "Glowing Node",
        function: "Holds the camera and controls exact pan, tilt, and roll with sub-millimeter repeatable precision.",
        assemblyOrder: 4,
        connections: ["Upper Arm", "Camera"],
        failureEffect: "Drift.",
        cascadeFailures: ["Mismatched VFX layers"],
        originalPosition: {x:0, y:8, z:0},
        explodedPosition: {x:5, y:8, z:0}
    });

    const description = "Cinema Motion Control Robot: A massive, extremely precise multi-axis robotic arm used in filmmaking. It can execute complex, high-speed camera movements and perfectly repeat them dozens of times, allowing visual effects artists to seamlessly composite multiple passes (e.g., CGI, actors, miniatures) over the exact same camera move.";

    const quizQuestions = [
        {
            question: "Why is 'perfect repeatability' the most important feature of a motion control robot?",
            options: ["To allow multiple identical passes (like an actor pass, a background pass, a CGI tracking pass) to be composited together perfectly in post-production", "Because human camera operators are too slow", "To prevent the robot from crashing into actors", "To keep the camera from overheating"],
            correct: 0,
            explanation: "If you want an actor to play twins and shake their own hand, the camera must do exactly the same move twice. Motion control robots can repeat moves with sub-millimeter accuracy.",
            difficulty: "Medium"
        },
        {
            question: "What type of motors are typically used in motion control robots to ensure precise positioning without slipping?",
            options: ["Servo motors with high-resolution absolute encoders", "Standard DC motors", "Combustion engines", "Spring-loaded motors"],
            correct: 0,
            explanation: "Servo motors combined with encoders track exactly how many fractions of a degree the motor has turned, allowing the computer to perfectly control and repeat the robot's spatial coordinates.",
            difficulty: "Hard"
        },
        {
            question: "Motion control robots are often used to shoot 'high-speed' tabletop commercials (like liquid splashing). Why?",
            options: ["They can accelerate the camera to match the speed of the splash perfectly, tracking the action in slow-motion", "Because the robots are waterproof", "To keep the food cold", "Because they are cheaper than human crews"],
            correct: 0,
            explanation: "When shooting at 1000 fps, a splash lasts a fraction of a second. A robot can be programmed to whip the camera around the splash in exactly that same fraction of a second, resulting in a dynamic slow-motion shot.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Complex robotic dance
        // Base slides on track
        if (group.children[0]) {
            // track is 0, base is 1
            if(group.children[1]) group.children[1].position.x = Math.sin(time * speed) * 8;
        }
        // Arm swings
        if (group.children[2]) {
            group.children[2].position.x = group.children[1].position.x;
            group.children[2].rotation.z = Math.sin(time * speed * 2) * 0.5;
        }
        // Head stays level
        if (group.children[3]) {
            const xOff = Math.sin(group.children[2].rotation.z) * 3;
            const yOff = Math.cos(group.children[2].rotation.z) * 3;
            group.children[3].position.set(
                group.children[2].position.x - xOff,
                group.children[2].position.y + yOff,
                0
            );
            // Spin head
            group.children[3].rotation.y = time * speed * 3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMotionControlRobot() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
