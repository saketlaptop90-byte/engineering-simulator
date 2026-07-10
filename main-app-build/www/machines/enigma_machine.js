export function createEnigmaMachine(THREE) {
    const group = new THREE.Group();
    group.name = "EnigmaMachine";

    // Materials
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 });
    const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const lampboardMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const plugboardMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8 });

    // 1. Base Casing
    const baseGeom = new THREE.BoxGeometry(10, 4, 10);
    const base = new THREE.Mesh(baseGeom, caseMat);
    base.position.set(0, 2, 0);
    base.name = "Base";
    group.add(base);

    // 2. Keyboard (Slanted front)
    const keyboardGeom = new THREE.BoxGeometry(9, 0.5, 3);
    const keyboard = new THREE.Mesh(keyboardGeom, keyboardMat);
    keyboard.position.set(0, 2.5, 3);
    keyboard.rotation.x = Math.PI / 12; // 15 degrees
    keyboard.name = "Keyboard";
    group.add(keyboard);

    // 3. Lampboard (Above keyboard)
    const lampboardGeom = new THREE.BoxGeometry(9, 0.5, 3);
    const lampboard = new THREE.Mesh(lampboardGeom, lampboardMat);
    lampboard.position.set(0, 3.2, 0);
    lampboard.rotation.x = Math.PI / 18; // 10 degrees
    lampboard.name = "Lampboard";
    group.add(lampboard);

    // 4. Rotor 1 (Fast)
    const rotorGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const rotor1 = new THREE.Mesh(rotorGeom, rotorMat);
    rotor1.position.set(1.5, 4.5, -2);
    rotor1.rotation.z = Math.PI / 2;
    rotor1.name = "Rotor1";
    group.add(rotor1);

    // 5. Rotor 2 (Middle)
    const rotor2 = new THREE.Mesh(rotorGeom, rotorMat);
    rotor2.position.set(0, 4.5, -2);
    rotor2.rotation.z = Math.PI / 2;
    rotor2.name = "Rotor2";
    group.add(rotor2);

    // 6. Rotor 3 (Slow)
    const rotor3 = new THREE.Mesh(rotorGeom, rotorMat);
    rotor3.position.set(-1.5, 4.5, -2);
    rotor3.rotation.z = Math.PI / 2;
    rotor3.name = "Rotor3";
    group.add(rotor3);

    // 7. Reflector
    const reflectorGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const reflector = new THREE.Mesh(reflectorGeom, metalMat);
    reflector.position.set(-2.5, 4.5, -2);
    reflector.rotation.z = Math.PI / 2;
    reflector.name = "Reflector";
    group.add(reflector);

    // 8. Plugboard (Front panel)
    const plugboardGeom = new THREE.BoxGeometry(9, 2, 0.2);
    const plugboard = new THREE.Mesh(plugboardGeom, plugboardMat);
    plugboard.position.set(0, 1.5, 5.1);
    plugboard.name = "Plugboard";
    group.add(plugboard);

    // 9. Cables (Connecting plugboard)
    const cableGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const cable = new THREE.Mesh(cableGeom, cableMat);
    cable.position.set(0, 1.5, 5.3);
    cable.rotation.z = Math.PI / 4;
    cable.name = "Cables";
    group.add(cable);

    // 10. Cover (Top protective lid)
    const coverGeom = new THREE.BoxGeometry(9, 0.2, 3);
    const cover = new THREE.Mesh(coverGeom, coverMat);
    cover.position.set(0, 4, 2);
    cover.name = "Cover";
    group.add(cover);

    // Animation Mixin
    group.userData.animation = function(time) {
        // Rotors spinning to simulate encryption process
        rotor1.rotation.x = time * 2;
        rotor2.rotation.x = time * 0.5;
        rotor3.rotation.x = time * 0.1;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What was the main purpose of the Enigma machine?",
            options: [
                "To encrypt and decrypt secret messages",
                "To calculate artillery trajectories",
                "To store digital data",
                "To intercept radio signals"
            ],
            answer: 0
        },
        {
            question: "Which component of the Enigma machine allowed its electrical pathways to be altered, adding immense cryptographic complexity?",
            options: [
                "The Plugboard (Steckerbrett)",
                "The Keyboard",
                "The Power switch",
                "The Lampboard"
            ],
            answer: 0
        },
        {
            question: "Who is famous for leading the team that broke the Enigma code at Bletchley Park?",
            options: [
                "Alan Turing",
                "Albert Einstein",
                "Nikola Tesla",
                "Thomas Edison"
            ],
            answer: 0
        },
        {
            question: "What function did the reflector serve in the Enigma machine?",
            options: [
                "It sent the electrical signal back through the rotors, allowing the same machine to encrypt and decrypt.",
                "It reflected light to the lampboard.",
                "It cooled the rotors during fast typing.",
                "It scrambled the initial input before reaching the first rotor."
            ],
            answer: 0
        },
        {
            question: "How did the rotors function when a key was pressed?",
            options: [
                "The fast rotor advanced by one step, occasionally turning the next rotor.",
                "All rotors turned simultaneously.",
                "The rotors randomly shifted positions.",
                "They remained stationary until the message was complete."
            ],
            answer: 0
        },
        {
            question: "During which major conflict was the Enigma machine most famously used by the German military?",
            options: [
                "World War II",
                "World War I",
                "The Cold War",
                "The Vietnam War"
            ],
            answer: 0
        }
    ];

    return group;
}
