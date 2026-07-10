import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const redLEDMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });

    const irLEDMat = new THREE.MeshStandardMaterial({
        color: 0x550000,
        emissive: 0x880000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const beamRedMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const beamIRMat = new THREE.MeshBasicMaterial({
        color: 0xffaaaa, // Visible representation of IR
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00aaff,
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.8
    });
    
    // Geometry
    const jawGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const rubberPadGeo = new THREE.BoxGeometry(3, 0.2, 1.8);
    const hingeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    hingeGeo.rotateX(Math.PI / 2);
    const ledGeo = new THREE.SphereGeometry(0.15, 16, 16);
    ledGeo.scale(1, 0.5, 1);
    const sensorGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const screenGeo = new THREE.BoxGeometry(1.5, 0.1, 1.2);
    const pcbGeo = new THREE.BoxGeometry(2, 0.1, 1.5);
    const fingerGeo = new THREE.CapsuleGeometry(0.6, 2, 4, 16);
    fingerGeo.rotateZ(Math.PI / 2);

    const beamGeo = new THREE.CylinderGeometry(0.05, 0.3, 1.2, 16);

    // Meshes
    const lowerJaw = new THREE.Mesh(jawGeo, plastic);
    lowerJaw.position.set(0, -0.4, 0);
    group.add(lowerJaw);
    
    const lowerRubber = new THREE.Mesh(rubberPadGeo, rubber);
    lowerRubber.position.set(0.2, -0.15, 0);
    lowerRubber.material.color.setHex(0x333333);
    group.add(lowerRubber);
    
    const photodetector = new THREE.Mesh(sensorGeo, darkSteel);
    photodetector.position.set(0.5, -0.05, 0);
    group.add(photodetector);

    const pcb = new THREE.Mesh(pcbGeo, copper);
    pcb.position.set(-0.5, -0.3, 0);
    group.add(pcb);
    
    const upperJawGroup = new THREE.Group();
    upperJawGroup.position.set(-1.5, 0.1, 0); // Hinge pivot point
    group.add(upperJawGroup);

    const upperJaw = new THREE.Mesh(jawGeo, plastic);
    upperJaw.position.set(1.5, 0.4, 0); // Offset from pivot
    upperJawGroup.add(upperJaw);
    
    const upperRubber = new THREE.Mesh(rubberPadGeo, rubber);
    upperRubber.position.set(1.7, 0.15, 0);
    upperRubber.material.color.setHex(0x333333);
    upperJawGroup.add(upperRubber);

    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(1.5, 0.65, 0);
    upperJawGroup.add(screen);

    const hinge = new THREE.Mesh(hingeGeo, steel);
    hinge.position.set(-1.5, 0, 0);
    group.add(hinge);

    const redLED = new THREE.Mesh(ledGeo, redLEDMat);
    redLED.position.set(2.0, 0.05, -0.2); // Relative to upper jaw group
    upperJawGroup.add(redLED);

    const irLED = new THREE.Mesh(ledGeo, irLEDMat);
    irLED.position.set(2.0, 0.05, 0.2);
    upperJawGroup.add(irLED);

    const finger = new THREE.Mesh(fingerGeo, new THREE.MeshStandardMaterial({
        color: 0xffcccc,
        transparent: true,
        opacity: 0.6,
        roughness: 0.5,
        transmission: 0.5 // Glass-like
    }));
    finger.position.set(1.0, 0, 0);
    group.add(finger);

    const redBeam = new THREE.Mesh(beamGeo, beamRedMat);
    redBeam.position.set(2.0, -0.3, -0.2);
    upperJawGroup.add(redBeam);

    const irBeam = new THREE.Mesh(beamGeo, beamIRMat);
    irBeam.position.set(2.0, -0.3, 0.2);
    upperJawGroup.add(irBeam);

    parts.push({
        name: "Lower Enclosure",
        description: "The bottom half of the clip, providing structure and housing the detector and processing electronics.",
        material: "plastic",
        function: "Structural support and housing for the photodetector and PCB.",
        assemblyOrder: 1,
        connections: ["Hinge", "Lower Rubber Pad", "PCB"],
        failureEffect: "Structural instability, potential exposure of internal components.",
        cascadeFailures: ["PCB", "Photodetector"],
        originalPosition: { x: 0, y: -0.4, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: lowerJaw
    });

    parts.push({
        name: "Main PCB & Microcontroller",
        description: "The brain of the device, processing the raw signals from the photodetector to calculate SpO2 and pulse rate.",
        material: "copper",
        function: "Signal processing, calculation of oxygen saturation via Beer-Lambert law, and driving the display.",
        assemblyOrder: 2,
        connections: ["Lower Enclosure", "Photodetector", "Display Screen", "LEDs"],
        failureEffect: "Device fails to operate, no readings calculated.",
        cascadeFailures: ["Display Screen"],
        originalPosition: { x: -0.5, y: -0.3, z: 0 },
        explodedPosition: { x: -1, y: -2.5, z: 0 },
        mesh: pcb
    });

    parts.push({
        name: "Photodetector",
        description: "A highly sensitive semiconductor device that captures the unabsorbed light passing through the finger.",
        material: "darkSteel",
        function: "Converts transmitted light into an electrical signal proportional to light intensity.",
        assemblyOrder: 3,
        connections: ["PCB", "Lower Enclosure"],
        failureEffect: "Inability to detect light, leading to a total failure to measure SpO2.",
        cascadeFailures: ["Main PCB"],
        originalPosition: { x: 0.5, y: -0.05, z: 0 },
        explodedPosition: { x: 0.5, y: -1.5, z: 0 },
        mesh: photodetector
    });
    
    parts.push({
        name: "Hinge & Spring Mechanism",
        description: "Provides clamping force to keep the device securely on the finger without occluding blood flow.",
        material: "steel",
        function: "Allows opening of the clip and maintains consistent pressure for accurate readings.",
        assemblyOrder: 4,
        connections: ["Lower Enclosure", "Upper Enclosure"],
        failureEffect: "Device cannot clamp onto finger, causing severe motion artifacts and ambient light leakage.",
        cascadeFailures: ["Photodetector (due to ambient light)"],
        originalPosition: { x: -1.5, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        mesh: hinge
    });

    parts.push({
        name: "Upper Enclosure",
        description: "The top half of the clip housing the light emitters (LEDs) and display.",
        material: "plastic",
        function: "Structural support for LEDs, upper rubber pad, and OLED display.",
        assemblyOrder: 5,
        connections: ["Hinge", "Upper Rubber Pad", "Red LED", "Infrared LED", "Display Screen"],
        failureEffect: "Structural instability, potential misalignment of LEDs and photodetector.",
        cascadeFailures: ["LEDs", "Display Screen"],
        originalPosition: { x: 1.5, y: 0.4, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: upperJaw
    });

    parts.push({
        name: "OLED Display Screen",
        description: "High-contrast screen displaying the SpO2 percentage, pulse rate, and a plethysmograph waveform.",
        material: "glass",
        function: "Provides real-time visual feedback of the patient's vitals to the user.",
        assemblyOrder: 6,
        connections: ["Upper Enclosure", "PCB"],
        failureEffect: "Vitals are calculated but cannot be read by the user.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 0.65, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: screen
    });

    parts.push({
        name: "Red Emitter LED (660nm)",
        description: "Emits red light. Deoxygenated hemoglobin (Hb) absorbs more red light than oxygenated hemoglobin (HbO2).",
        material: "glass",
        function: "Provides the red wavelength light source for absorption measurement.",
        assemblyOrder: 7,
        connections: ["Upper Enclosure", "PCB"],
        failureEffect: "Inability to differentiate between Hb and HbO2, resulting in failed SpO2 calculation.",
        cascadeFailures: [],
        originalPosition: { x: 2.0, y: 0.05, z: -0.2 },
        explodedPosition: { x: 0, y: 1.5, z: -1 },
        mesh: redLED
    });

    parts.push({
        name: "Infrared Emitter LED (940nm)",
        description: "Emits infrared light. Oxygenated hemoglobin (HbO2) absorbs more infrared light than deoxygenated hemoglobin (Hb).",
        material: "glass",
        function: "Provides the infrared wavelength light source for absorption measurement.",
        assemblyOrder: 8,
        connections: ["Upper Enclosure", "PCB"],
        failureEffect: "Inability to calculate the ratio of absorbances, resulting in failed SpO2 measurement.",
        cascadeFailures: [],
        originalPosition: { x: 2.0, y: 0.05, z: 0.2 },
        explodedPosition: { x: 0, y: 1.5, z: 1 },
        mesh: irLED
    });

    parts.push({
        name: "Translucent Finger Proxy",
        description: "Represents a human finger placed inside the device to demonstrate the transmission of light.",
        material: "plastic",
        function: "Acts as the medium through which light passes, absorbing specific wavelengths based on simulated arterial blood flow.",
        assemblyOrder: 9,
        connections: ["Lower Rubber Pad", "Upper Rubber Pad"],
        failureEffect: "N/A (Demonstration component)",
        cascadeFailures: [],
        originalPosition: { x: 1.0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 },
        mesh: finger
    });


    const description = "A high-tech Pulse Oximeter used to non-invasively measure the oxygen saturation (SpO2) of a patient's blood and their heart rate. It works on the principle of spectrophotometry, passing two wavelengths of light (red at 660nm and infrared at 940nm) through a translucent part of the body, usually a fingertip. Oxygenated hemoglobin absorbs more infrared light and lets more red light pass through, while deoxygenated hemoglobin absorbs more red light and lets more infrared light pass through. The photodetector measures the unabsorbed light, and the microcontroller calculates the ratio to determine SpO2.";

    const quizQuestions = [
        {
            question: "Why does a pulse oximeter use both Red and Infrared light?",
            options: [
                "Red light measures heart rate, while infrared measures oxygen.",
                "Oxygenated and deoxygenated hemoglobin have different absorption spectra for these two wavelengths.",
                "Infrared light is used for dark skin tones, and red light for light skin tones.",
                "To create a visible beam for alignment purposes."
            ],
            correct: 1,
            explanation: "The core principle relies on the different absorption properties of Hb (deoxygenated) and HbO2 (oxygenated) at 660nm (Red) and 940nm (Infrared). By comparing the ratio of absorption, the SpO2 can be accurately calculated.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the photodetector in this device?",
            options: [
                "To emit high-intensity light through the finger.",
                "To measure the ambient light in the room and calibrate the LEDs.",
                "To detect the amount of light that passes through the finger without being absorbed.",
                "To calculate the oxygen saturation directly."
            ],
            correct: 2,
            explanation: "The photodetector sits opposite the LEDs and converts the transmitted light (the light that wasn't absorbed by the finger/blood) into an electrical signal for the microcontroller to process.",
            difficulty: "Easy"
        },
        {
            question: "How does the pulse oximeter isolate the arterial blood signal from venous blood and tissue?",
            options: [
                "By only measuring during the peak of a heartbeat (systole).",
                "By using a very tight spring mechanism to squeeze out venous blood.",
                "By analyzing the pulsatile (AC) component of the absorption signal over time, filtering out the constant (DC) background absorption.",
                "It uses an ultrasound transducer alongside the LEDs."
            ],
            correct: 2,
            explanation: "Arterial blood volume changes with each heartbeat, creating a pulsatile (AC) change in light absorption. Venous blood, tissue, and bone have constant (DC) absorption. The processor isolates the AC component to measure only arterial blood.",
            difficulty: "Hard"
        }
    ];

    let pulsePhase = 0;

    function animate(time, speed, explodedParams) {
        const t = time * speed;
        
        // Simulating a heartbeat pulse
        pulsePhase += speed * 0.05;
        const pulse = Math.pow(Math.sin(pulsePhase), 4); // Sharp peaks
        
        // Flashing LEDs alternately (simulating time-division multiplexing common in real devices)
        const isRedPhase = Math.sin(t * 10) > 0;
        
        redLEDMat.emissiveIntensity = isRedPhase ? 2.0 + pulse * 1.5 : 0.1;
        irLEDMat.emissiveIntensity = !isRedPhase ? 0.8 + pulse * 0.5 : 0.05;
        
        beamRedMat.opacity = isRedPhase ? 0.4 + pulse * 0.2 : 0;
        beamIRMat.opacity = !isRedPhase ? 0.3 + pulse * 0.1 : 0;
        
        // Pulsing the finger slightly (simulating arterial expansion)
        const fingerScale = 1.0 + pulse * 0.02;
        finger.scale.set(1, fingerScale, 1);
        
        // Dynamic Screen display color shift (simulating pleth waveform moving)
        screenMat.emissive.setHSL((t * 0.1) % 1, 1, 0.5);

        // Hinge breathing movement - slow opening and closing
        // When not exploded
        if (explodedParams && explodedParams.explosionFactor === 0) {
            const jawAngle = (Math.sin(t) * 0.5 + 0.5) * 0.15; // 0 to 0.15 rad
            upperJawGroup.rotation.z = jawAngle;
        } else {
             upperJawGroup.rotation.z = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPulseOximeter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
