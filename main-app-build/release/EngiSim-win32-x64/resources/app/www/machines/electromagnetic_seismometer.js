export function createElectromagneticSeismometer(THREE) {
    const group = new THREE.Group();

    // 10 parts
    const parts = [
        { name: 'Baseplate', description: 'Mounts the seismometer firmly to the ground to pick up vibrations.' },
        { name: 'PendulumMass', description: 'The inert mass that tends to stay stationary during an earthquake due to inertia.' },
        { name: 'SuspensionSpring', description: 'Supports the pendulum mass, allowing it to move relative to the frame.' },
        { name: 'PermanentMagnet', description: 'Provides a magnetic field. Movement relative to the coil generates an electric signal.' },
        { name: 'WireCoil', description: 'Conductive coil that moves relative to the magnet to induce a current.' },
        { name: 'DampingSystem', description: 'Prevents the pendulum from oscillating endlessly after a vibration.' },
        { name: 'SupportFrame', description: 'The rigid structure attached to the baseplate that holds the components.' },
        { name: 'RecordingDrum', description: 'Rotates steadily to record the seismogram.' },
        { name: 'Stylus', description: 'Traces the motion of the pendulum mass onto the recording drum.' },
        { name: 'GlassEnclosure', description: 'Protects the delicate internal components from air currents and dust.' }
    ];

    // Build the 3D model
    const materialBase = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const materialMass = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const materialSpring = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const materialMagnet = new THREE.MeshStandardMaterial({ color: 0x1111aa });
    const materialCoil = new THREE.MeshStandardMaterial({ color: 0xcc7722 });
    const materialDamping = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const materialFrame = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const materialDrum = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const materialStylus = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const materialGlass = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.3 });

    // 1. Baseplate
    const baseGeometry = new THREE.BoxGeometry(10, 0.5, 6);
    const baseplate = new THREE.Mesh(baseGeometry, materialBase);
    baseplate.position.y = 0.25;
    group.add(baseplate);

    // 2. SupportFrame
    const frameGeometry = new THREE.BoxGeometry(0.5, 8, 4);
    const supportFrame = new THREE.Mesh(frameGeometry, materialFrame);
    supportFrame.position.set(-4, 4.5, 0);
    group.add(supportFrame);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 1), materialFrame);
    frameTop.position.set(-1, 8.25, 0);
    group.add(frameTop);

    // 3. SuspensionSpring
    const springGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 16, 20);
    const suspensionSpring = new THREE.Mesh(springGeometry, materialSpring);
    suspensionSpring.position.set(-1, 6, 0);
    group.add(suspensionSpring);

    // 4. PendulumMass
    const massGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const pendulumMass = new THREE.Mesh(massGeometry, materialMass);
    pendulumMass.position.set(-1, 3, 0);
    group.add(pendulumMass);

    // 5. PermanentMagnet
    const magnetGeometry = new THREE.BoxGeometry(1, 1, 1);
    const permanentMagnet = new THREE.Mesh(magnetGeometry, materialMagnet);
    permanentMagnet.position.set(0, -1.5, 0);
    pendulumMass.add(permanentMagnet); // attach to mass

    // 6. WireCoil
    const coilGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16);
    const wireCoil = new THREE.Mesh(coilGeometry, materialCoil);
    wireCoil.position.set(-1, 1.5, 0);
    group.add(wireCoil); // attached to base

    // 7. DampingSystem
    const dampingGeometry = new THREE.BoxGeometry(2, 0.5, 2);
    const dampingSystem = new THREE.Mesh(dampingGeometry, materialDamping);
    dampingSystem.position.set(-1, 0.75, 0);
    group.add(dampingSystem);

    // 8. RecordingDrum
    const drumGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const recordingDrum = new THREE.Mesh(drumGeometry, materialDrum);
    recordingDrum.rotation.x = Math.PI / 2;
    recordingDrum.position.set(3, 3, 0);
    group.add(recordingDrum);

    // 9. Stylus
    const stylusGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const stylus = new THREE.Mesh(stylusGeometry, materialStylus);
    stylus.rotation.z = Math.PI / 2;
    stylus.position.set(2.5, 0, 0);
    pendulumMass.add(stylus);

    // 10. GlassEnclosure
    const glassGeometry = new THREE.BoxGeometry(11, 9, 7);
    const glassEnclosure = new THREE.Mesh(glassGeometry, materialGlass);
    glassEnclosure.position.set(0, 4.5, 0);
    group.add(glassEnclosure);

    const quiz = [
        {
            question: "What principle allows the pendulum mass of a seismometer to remain relatively stationary during an earthquake?",
            options: ["Magnetism", "Inertia", "Capillary action", "Friction"],
            correctAnswer: 1
        },
        {
            question: "How does an electromagnetic seismometer generate its signal?",
            options: ["By a physical stylus scratching paper", "By relative motion between a magnet and a wire coil", "By changing air pressure inside the enclosure", "By chemical reactions in the damping fluid"],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the damping system in a seismometer?",
            options: ["To amplify the earthquake signal", "To prevent the pendulum from oscillating continuously", "To keep the glass enclosure clear", "To cool the wire coil"],
            correctAnswer: 1
        },
        {
            question: "Which component attaches the seismometer to the ground and moves with it during an earthquake?",
            options: ["Suspension Spring", "Pendulum Mass", "Baseplate", "Recording Drum"],
            correctAnswer: 2
        },
        {
            question: "What does the suspension spring do in a vertical seismometer?",
            options: ["Counters gravity to suspend the mass", "Rotates the recording drum", "Creates the magnetic field", "Heats up the enclosure"],
            correctAnswer: 0
        },
        {
            question: "Why are sensitive seismometers often housed in a glass enclosure or vault?",
            options: ["To look aesthetically pleasing", "To protect against air currents, temperature changes, and dust", "To block electromagnetic interference", "To allow sunlight to power them"],
            correctAnswer: 1
        }
    ];

    group.userData = {
        parts: parts,
        quiz: quiz,
        animation: function(time) {
            // Ground vibration: Move the baseplate and frame (the whole group)
            // But we want the pendulum to remain relatively stationary.
            // A simple way is to vibrate the group, and apply an opposite translation to the pendulum.
            
            const amplitude = 0.2;
            const frequency = 5; // Hz
            
            // Ground shaking (vibrates horizontally)
            const displacement = amplitude * Math.sin(time * frequency);
            
            group.position.x = displacement;
            
            // Pendulum stays stationary relative to world
            // So its local position must move in the opposite direction
            pendulumMass.position.x = -1 - displacement;
            
            // The drum rotates steadily
            recordingDrum.rotation.y = time * 0.5;
        }
    };

    return group;
}
