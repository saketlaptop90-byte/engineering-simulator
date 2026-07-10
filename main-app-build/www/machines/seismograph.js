export function createSeismograph(THREE) {
    const group = new THREE.Group();

    const parts = [
        { name: "Base", description: "The foundation of the seismograph that attaches firmly to the earth." },
        { name: "Support Frame", description: "The rigid structure that holds the pendulum and drum." },
        { name: "Pendulum Mass", description: "A heavy weight that remains stationary during an earthquake due to inertia." },
        { name: "Hanging Wire", description: "Suspends the pendulum mass from the support frame." },
        { name: "Pen/Stylus", description: "Attached to the mass, it records movement onto the rotating drum." },
        { name: "Rotating Drum", description: "A cylindrical drum that rotates at a constant speed." },
        { name: "Paper Roll", description: "Wraps around the drum to capture the seismogram." },
        { name: "Spring", description: "Provides restoring force or dampening to the pendulum system." },
        { name: "Anchor", description: "Secures the seismograph firmly to bedrock." },
        { name: "Recording Trace", description: "The zigzag pattern representing seismic waves." }
    ];

    // Create materials
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5 });
    const massMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8 }); // Copper
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const penMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const drumMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const springMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const traceMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    // 1. Base
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 6);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.25, 0);
    group.add(base);

    // 2. Support Frame
    const frameGeo = new THREE.BoxGeometry(0.5, 8, 1);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(-4, 4.5, 0);
    group.add(frame);
    
    const frameTopGeo = new THREE.BoxGeometry(4, 0.5, 1);
    const frameTop = new THREE.Mesh(frameTopGeo, frameMat);
    frameTop.position.set(-2, 8.25, 0);
    group.add(frameTop);

    // 3. Pendulum Mass
    const massGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const mass = new THREE.Mesh(massGeo, massMat);
    mass.position.set(-0.5, 4, 0);
    group.add(mass);

    // 4. Hanging Wire
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(-0.5, 6.25, 0);
    group.add(wire);

    // 5. Pen/Stylus
    const penGeo = new THREE.ConeGeometry(0.1, 1, 16);
    const pen = new THREE.Mesh(penGeo, penMat);
    pen.rotation.z = -Math.PI / 2;
    pen.position.set(1, 4, 0);
    group.add(pen);

    // 6. Rotating Drum
    const drumGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.rotation.x = Math.PI / 2;
    drum.position.set(3, 4, 0);
    group.add(drum);

    // 7. Paper Roll
    const paperGeo = new THREE.CylinderGeometry(1.51, 1.51, 3.8, 32);
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = Math.PI / 2;
    paper.position.set(3, 4, 0);
    group.add(paper);

    // 8. Spring
    const springGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const spring = new THREE.Mesh(springGeo, springMat);
    spring.rotation.z = Math.PI / 2;
    spring.position.set(-2.5, 4, 0);
    group.add(spring);

    // 9. Anchor
    const anchorGeo = new THREE.BoxGeometry(11, 0.2, 7);
    const anchor = new THREE.Mesh(anchorGeo, anchorMat);
    anchor.position.set(0, 0, 0);
    group.add(anchor);

    // 10. Recording Trace
    const traceGeo = new THREE.TorusGeometry(1.52, 0.02, 16, 100);
    const trace = new THREE.Mesh(traceGeo, traceMat);
    trace.rotation.x = Math.PI / 2;
    trace.position.set(3, 4, 0);
    group.add(trace);

    let time = 0;
    function update(delta) {
        time += delta;
        // Rotate drum slowly
        drum.rotation.y = time * 0.5;
        paper.rotation.y = time * 0.5;
        
        // Vibrate base and frame (earthquake simulation)
        const shake = Math.sin(time * 20) * 0.1 * Math.max(0, Math.sin(time * 2));
        base.position.x = shake;
        frame.position.x = -4 + shake;
        frameTop.position.x = -2 + shake;
        drum.position.x = 3 + shake;
        paper.position.x = 3 + shake;
        
        // Trace also moves with the drum
        trace.position.x = 3 + shake;
        trace.position.y = 4 + shake * 2;
    }

    const questions = [
        {
            question: "What does a seismograph measure?",
            options: ["Temperature", "Wind speed", "Earthquakes and seismic waves", "Atmospheric pressure"],
            correctAnswer: 2
        },
        {
            question: "Which part of the seismograph tends to stay stationary during an earthquake due to inertia?",
            options: ["The rotating drum", "The pendulum mass", "The support frame", "The anchor"],
            correctAnswer: 1
        },
        {
            question: "What is the rotating drum covered with to record the motion?",
            options: ["A mirror", "Paper", "Sand", "Magnetic tape"],
            correctAnswer: 1
        },
        {
            question: "Who invented the first known seismoscope in 132 AD?",
            options: ["Isaac Newton", "Albert Einstein", "Zhang Heng", "Galileo Galilei"],
            correctAnswer: 2
        },
        {
            question: "The scale commonly used to measure earthquake magnitude based on seismograph data is?",
            options: ["Richter scale", "Fahrenheit scale", "Mohs scale", "Beaufort scale"],
            correctAnswer: 0
        },
        {
            question: "The zigzag line drawn by a seismograph is called a?",
            options: ["Seismogram", "Cardiogram", "Telegram", "Hologram"],
            correctAnswer: 0
        }
    ];

    return { group, parts, update, questions };
}
