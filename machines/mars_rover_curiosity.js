export function createMarsRoverCuriosity(THREE) {
    const roverGroup = new THREE.Group();

    // 1. Chassis
    const chassisGeometry = new THREE.BoxGeometry(2, 1, 3);
    const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassis.position.set(0, 0, 0);
    roverGroup.add(chassis);

    // 2. Rocker-bogie suspension system
    const suspensionGroup = new THREE.Group();
    
    const rockerMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const rockerGeom = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    
    const leftRocker = new THREE.Mesh(rockerGeom, rockerMaterial);
    leftRocker.rotation.x = Math.PI / 2;
    leftRocker.position.set(-1.2, -0.5, 0);
    suspensionGroup.add(leftRocker);
    
    const rightRocker = new THREE.Mesh(rockerGeom, rockerMaterial);
    rightRocker.rotation.x = Math.PI / 2;
    rightRocker.position.set(1.2, -0.5, 0);
    suspensionGroup.add(rightRocker);
    
    roverGroup.add(suspensionGroup);

    // 3. 6 Wheels
    const wheelsGroup = new THREE.Group();
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wheelPositions = [
        [-1.3, -0.8, 1.2], [-1.3, -0.8, 0], [-1.3, -0.8, -1.2],
        [1.3, -0.8, 1.2], [1.3, -0.8, 0], [1.3, -0.8, -1.2]
    ];
    
    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos[0], pos[1], pos[2]);
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheelGroup.add(wheel);
        wheelsGroup.add(wheelGroup);
    });
    suspensionGroup.add(wheelsGroup);

    // 4. RTG power source
    const rtgGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 16);
    const rtgMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const rtg = new THREE.Mesh(rtgGeometry, rtgMaterial);
    rtg.position.set(0, 0.5, -1.5);
    rtg.rotation.x = Math.PI / 2;
    roverGroup.add(rtg);

    // 5. Robotic arm
    const armGroup = new THREE.Group();
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(0, 0.75, 0);
    armGroup.add(arm);
    armGroup.position.set(0.8, 0.5, 1.2);
    armGroup.rotation.x = Math.PI / 4;
    roverGroup.add(armGroup);

    // 6. Main camera mast
    const mastGroup = new THREE.Group();
    const mastGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
    const mastMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(0, 0.75, 0);
    mastGroup.add(mast);
    mastGroup.position.set(-0.8, 0.5, 1.2);
    roverGroup.add(mastGroup);

    // 7. UHF antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0.5, 0.9, -0.5);
    roverGroup.add(antenna);

    // 8. Drill/spectrometer payload
    const drillGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const drillMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const drill = new THREE.Mesh(drillGeometry, drillMaterial);
    drill.position.set(0, 1.5, 0);
    armGroup.add(drill);

    // 9. Hazard cameras
    const hazcamGroup = new THREE.Group();
    const hazcamGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
    const hazcamMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const hazcam1 = new THREE.Mesh(hazcamGeometry, hazcamMaterial);
    hazcam1.position.set(-0.5, -0.3, 1.5);
    hazcamGroup.add(hazcam1);
    const hazcam2 = new THREE.Mesh(hazcamGeometry, hazcamMaterial);
    hazcam2.position.set(0.5, -0.3, 1.5);
    hazcamGroup.add(hazcam2);
    roverGroup.add(hazcamGroup);

    // 10. Communication deck
    const deckGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    const deckMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, 0.51, 0);
    roverGroup.add(deck);

    // Kinematics animation function
    let time = 0;
    roverGroup.userData.update = function(deltaTime) {
        time += deltaTime;
        
        // Rocker-bogie suspension adapting to terrain simulation
        const leftPitch = Math.sin(time * 2.0) * 0.15;
        const rightPitch = Math.cos(time * 2.2) * 0.15;
        leftRocker.rotation.x = Math.PI / 2 + leftPitch; 
        rightRocker.rotation.x = Math.PI / 2 + rightPitch;
        
        // Suspension chassis pivot
        suspensionGroup.rotation.z = Math.sin(time * 1.5) * 0.05;
        suspensionGroup.position.y = Math.abs(Math.sin(time * 3.0)) * 0.05;

        // Wheels rotating
        wheelsGroup.children.forEach(wheelGroup => {
            wheelGroup.children[0].rotation.y -= deltaTime * 2.5;
        });

        // Mast panning
        mastGroup.rotation.y = Math.sin(time * 0.8) * Math.PI / 3;
    };

    // Internal animation loop just in case
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        if (roverGroup.userData.update) {
            roverGroup.userData.update(dt);
        }
    }
    if (typeof requestAnimationFrame !== 'undefined') {
        animate();
    }

    const parts = [
        { name: "Chassis", description: "Main body of the rover, protecting electronics and instruments." },
        { name: "Rocker-bogie suspension system", description: "Provides stability and allows traversal of rough terrain without springs." },
        { name: "6 Wheels", description: "Aluminum wheels with cleats for traction on the Martian surface." },
        { name: "RTG power source", description: "Radioisotope Thermoelectric Generator providing constant electrical power." },
        { name: "Robotic arm", description: "Used to handle, drill, and analyze rock and soil samples." },
        { name: "Main camera mast", description: "Holds the navigation and science cameras (Mastcam, ChemCam) high above the chassis." },
        { name: "UHF antenna", description: "Used for communication with orbital relay spacecraft like the Mars Reconnaissance Orbiter." },
        { name: "Drill/spectrometer payload", description: "Instruments on the end of the robotic arm for detailed chemical analysis." },
        { name: "Hazard cameras", description: "Cameras mounted low for detecting obstacles and safe autonomous pathfinding." },
        { name: "Communication deck", description: "Platform hosting various antennas and environmental sensing instruments." }
    ];

    const quiz = [
        {
            question: "What type of power source does the Mars Rover Curiosity use?",
            options: ["Solar Panels", "Radioisotope Thermoelectric Generator (RTG)", "Lithium-ion Batteries only", "Hydrogen Fuel Cells"],
            answer: 1
        },
        {
            question: "What is the primary function of the rocker-bogie suspension system?",
            options: ["To increase the rover's top speed", "To keep all 6 wheels on the ground over uneven terrain", "To jump over large boulders", "To provide steering to the middle wheels"],
            answer: 1
        },
        {
            question: "Which component is primarily responsible for detailed analysis and collection of rock samples?",
            options: ["RTG power source", "Drill/spectrometer payload", "UHF antenna", "Hazard cameras"],
            answer: 1
        },
        {
            question: "How does Curiosity communicate with Earth most efficiently for large data transfers?",
            options: ["Direct-to-Earth X-band antenna", "Via Martian internet cables", "Using its UHF antenna to relay data through Mars orbiters", "Optical lasers"],
            answer: 2
        },
        {
            question: "What part houses the ChemCam instrument and provides a high vantage point?",
            options: ["Chassis", "Robotic arm", "Communication deck", "Main camera mast"],
            answer: 3
        },
        {
            question: "Why does Curiosity have 6 wheels instead of 4?",
            options: ["For aesthetic symmetry", "To provide better traction, stability, and weight distribution on soft sand", "Because two are spare wheels", "To increase its maximum speed"],
            answer: 1
        }
    ];

    return {
        model: roverGroup,
        parts: parts,
        quiz: quiz,
        update: (deltaTime) => roverGroup.userData.update(deltaTime)
    };
}
