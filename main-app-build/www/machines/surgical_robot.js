export function createSurgicalRobot(THREE) {
    const group = new THREE.Group();

    // Materials
    const columnMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.5, roughness: 0.2 });
    const boomMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.3 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.4 });
    const endoscopeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const manipulatorMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    const toolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.5 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 });
    const cameraMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.4, roughness: 0.6 });
    const powerMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.5 });

    // 1. Central Column
    const columnGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const centralColumn = new THREE.Mesh(columnGeo, columnMat);
    centralColumn.position.set(0, 1.5, 0);
    group.add(centralColumn);

    // 2. Primary Boom
    const boomGeo = new THREE.BoxGeometry(2, 0.4, 0.4);
    const primaryBoom = new THREE.Mesh(boomGeo, boomMat);
    primaryBoom.position.set(0, 3, 0);
    group.add(primaryBoom);

    // 3. Instrument Arms
    const instrumentArmGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const instrumentArm1 = new THREE.Mesh(instrumentArmGeo, armMat);
    instrumentArm1.position.set(-1, 2, 0);
    const instrumentArm2 = new THREE.Mesh(instrumentArmGeo, armMat);
    instrumentArm2.position.set(1, 2, 0);
    group.add(instrumentArm1);
    group.add(instrumentArm2);

    // 4. Endoscope Arm
    const endoscopeArmGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const endoscopeArm = new THREE.Mesh(endoscopeArmGeo, endoscopeMat);
    endoscopeArm.position.set(0, 2.25, 0.5);
    group.add(endoscopeArm);

    // 5. Surgical Manipulators
    const manipulatorGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const manipulator1 = new THREE.Mesh(manipulatorGeo, manipulatorMat);
    manipulator1.position.set(0, -1, 0);
    instrumentArm1.add(manipulator1);
    const manipulator2 = new THREE.Mesh(manipulatorGeo, manipulatorMat);
    manipulator2.position.set(0, -1, 0);
    instrumentArm2.add(manipulator2);

    // 6. Tool Interface
    const toolGeo = new THREE.ConeGeometry(0.05, 0.3, 16);
    const toolInterface1 = new THREE.Mesh(toolGeo, toolMat);
    toolInterface1.position.set(0, -0.15, 0);
    manipulator1.add(toolInterface1);
    const toolInterface2 = new THREE.Mesh(toolGeo, toolMat);
    toolInterface2.position.set(0, -0.15, 0);
    manipulator2.add(toolInterface2);

    // 7. Fiber Optic Cables
    const cableGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,3,0), new THREE.Vector3(0,0,-1)), 20, 0.05, 8, false);
    const fiberOpticCables = new THREE.Mesh(cableGeo, cableMat);
    group.add(fiberOpticCables);

    // 8. Stereoscopic Camera
    const cameraGeo = new THREE.BoxGeometry(0.3, 0.2, 0.4);
    const stereoscopicCamera = new THREE.Mesh(cameraGeo, cameraMat);
    stereoscopicCamera.position.set(0, -0.75, 0);
    endoscopeArm.add(stereoscopicCamera);

    // 9. Control Console
    const consoleGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const controlConsole = new THREE.Mesh(consoleGeo, consoleMat);
    controlConsole.position.set(3, 0.5, 2);
    group.add(controlConsole);

    // 10. Power Unit
    const powerGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const powerUnit = new THREE.Mesh(powerGeo, powerMat);
    powerUnit.position.set(-2, 0.75, -2);
    group.add(powerUnit);

    const parts = [
        { name: "Central Column", description: "The main support structure of the patient cart." },
        { name: "Primary Boom", description: "Extends from the central column to support the arms." },
        { name: "Instrument Arms", description: "Robotic arms that hold and move surgical instruments." },
        { name: "Endoscope Arm", description: "Holds the 3D camera to provide vision inside the patient." },
        { name: "Surgical Manipulators", description: "Precision wrists that mimic the surgeon's hand movements." },
        { name: "Tool Interface", description: "Connects interchangeable surgical instruments to the manipulators." },
        { name: "Fiber Optic Cables", description: "Transmits high-definition stereoscopic video from the camera." },
        { name: "Stereoscopic Camera", description: "Provides 3D high-definition vision of the surgical field." },
        { name: "Control Console", description: "The master controller where the surgeon sits and operates." },
        { name: "Power Unit", description: "Supplies electrical power and processing to the robotic system." }
    ];

    const quizQuestions = [
        {
            question: "Which component provides the surgeon with a 3D view of the surgical field?",
            options: ["Instrument Arms", "Stereoscopic Camera", "Power Unit", "Central Column"],
            answer: 1,
            explanation: "The stereoscopic camera on the endoscope provides a high-definition 3D view."
        },
        {
            question: "What mimics the surgeon's hand movements inside the patient?",
            options: ["Primary Boom", "Control Console", "Surgical Manipulators", "Fiber Optic Cables"],
            answer: 2,
            explanation: "Surgical manipulators act like wrists, translating the surgeon's hand movements into precise instrument movements."
        },
        {
            question: "Where does the surgeon sit to control the robot?",
            options: ["Control Console", "Central Column", "Power Unit", "Endoscope Arm"],
            answer: 0,
            explanation: "The surgeon sits at the control console to view the surgical field and manipulate the instruments."
        },
        {
            question: "What holds the interchangeable surgical instruments?",
            options: ["Tool Interface", "Stereoscopic Camera", "Fiber Optic Cables", "Primary Boom"],
            answer: 0,
            explanation: "The tool interface connects specific surgical instruments (like forceps or scissors) to the robot."
        },
        {
            question: "What acts as the main support structure for the patient cart?",
            options: ["Control Console", "Power Unit", "Central Column", "Surgical Manipulators"],
            answer: 2,
            explanation: "The central column provides the sturdy base and support for all the robotic arms."
        },
        {
            question: "Which part transmits the video feed from the camera to the console?",
            options: ["Instrument Arms", "Fiber Optic Cables", "Power Unit", "Tool Interface"],
            answer: 1,
            explanation: "Fiber optic cables transmit high-bandwidth data like the HD 3D video feed from the camera."
        }
    ];

    function update(time) {
        // Animation: Surgical arms moving
        instrumentArm1.rotation.x = Math.sin(time * 2) * 0.2;
        instrumentArm1.rotation.z = Math.cos(time * 1.5) * 0.1;
        
        instrumentArm2.rotation.x = Math.sin(time * 2 + Math.PI) * 0.2;
        instrumentArm2.rotation.z = Math.cos(time * 1.5 + Math.PI) * 0.1;

        manipulator1.rotation.y = Math.sin(time * 3) * 0.5;
        manipulator2.rotation.y = Math.sin(time * 3 + Math.PI) * 0.5;
        
        endoscopeArm.rotation.x = Math.sin(time * 1) * 0.1;
    }

    return { group, update, parts, quizQuestions };
}
