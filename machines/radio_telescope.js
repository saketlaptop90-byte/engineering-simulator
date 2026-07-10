export function createRadioTelescope(THREE) {
    // Array group to hold multiple telescopes
    const arrayGroup = new THREE.Group();

    // Materials
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9, metalness: 0.1 });
    const whiteMetalMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide });
    const grayMetalMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.6, metalness: 0.6 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.8 });
    const blueCabinMat = new THREE.MeshStandardMaterial({ color: 0x2a52be, roughness: 0.5, metalness: 0.4 });
    const gearMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.9 });

    function buildSingleTelescope() {
        const telescope = new THREE.Group();
        telescope.name = "RadioTelescope";

        // Part 1: Base
        const baseGeo = new THREE.CylinderGeometry(36, 40, 4, 64);
        const part1_base = new THREE.Mesh(baseGeo, concreteMat);
        part1_base.position.y = 2;
        part1_base.name = "Part1_Base";
        telescope.add(part1_base);

        // Pedestal Group (Azimuth)
        const pedestalGroup = new THREE.Group();
        pedestalGroup.position.y = 4;
        pedestalGroup.name = "PedestalGroup";
        telescope.add(pedestalGroup);

        // Part 2: Pedestal
        const pedestalGeo = new THREE.CylinderGeometry(24, 28, 16, 64);
        const part2_pedestal = new THREE.Mesh(pedestalGeo, whiteMetalMat);
        part2_pedestal.position.y = 8;
        part2_pedestal.name = "Part2_Pedestal";
        pedestalGroup.add(part2_pedestal);

        // Yoke Group
        const yokeGroup = new THREE.Group();
        yokeGroup.position.y = 16;
        yokeGroup.name = "YokeGroup";
        pedestalGroup.add(yokeGroup);

        // Part 3: Yoke
        const yokeShape = new THREE.Shape();
        yokeShape.moveTo(-50, 0);
        yokeShape.lineTo(50, 0);
        yokeShape.lineTo(50, 52);
        yokeShape.lineTo(38, 52);
        yokeShape.lineTo(38, 8);
        yokeShape.lineTo(-38, 8);
        yokeShape.lineTo(-38, 52);
        yokeShape.lineTo(-50, 52);
        yokeShape.lineTo(-50, 0);
        
        const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
        const yokeGeo = new THREE.ExtrudeGeometry(yokeShape, extrudeSettings);
        yokeGeo.translate(0, 0, -10);
        const part3_yoke = new THREE.Mesh(yokeGeo, grayMetalMat);
        part3_yoke.name = "Part3_Yoke";
        yokeGroup.add(part3_yoke);

        // Part 10: Control Cabin
        const cabinGeo = new THREE.BoxGeometry(16, 12, 16);
        const part10_cabin = new THREE.Mesh(cabinGeo, blueCabinMat);
        part10_cabin.position.set(-58, 26, 0);
        part10_cabin.name = "Part10_ControlCabin";
        yokeGroup.add(part10_cabin);

        // Altitude Group (Elevation)
        const altitudeGroup = new THREE.Group();
        altitudeGroup.position.set(0, 46, 0);
        altitudeGroup.name = "AltitudeGroup";
        yokeGroup.add(altitudeGroup);

        // Part 4: Elevation Gear
        const gearGeo = new THREE.CylinderGeometry(20, 20, 4, 32);
        const part4_gear = new THREE.Mesh(gearGeo, gearMat);
        part4_gear.rotation.z = Math.PI / 2;
        part4_gear.position.set(36, 0, 0);
        part4_gear.name = "Part4_ElevationGear";
        altitudeGroup.add(part4_gear);

        // Part 5: Parabolic Dish
        const dishGeo = new THREE.SphereGeometry(40, 64, 32, 0, Math.PI * 2, 0, Math.PI / 3);
        const part5_dish = new THREE.Mesh(dishGeo, whiteMetalMat);
        part5_dish.rotation.x = -Math.PI / 2;
        part5_dish.position.z = 35;
        part5_dish.name = "Part5_ParabolicDish";
        altitudeGroup.add(part5_dish);

        // Part 6: Receiver
        const receiverGeo = new THREE.CylinderGeometry(2, 2, 6, 16);
        const part6_receiver = new THREE.Mesh(receiverGeo, grayMetalMat);
        part6_receiver.rotation.x = Math.PI / 2;
        part6_receiver.position.z = -2;
        part6_receiver.name = "Part6_Receiver";
        altitudeGroup.add(part6_receiver);

        // Part 7: Feed Legs
        const part7_feedLegs = new THREE.Group();
        part7_feedLegs.name = "Part7_FeedLegs";
        const rimZ = 15;
        const rimR = 34.64;
        const subZ = 16.5;
        const subR = 3;
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + Math.PI / 4;
            const startX = rimR * Math.cos(angle);
            const startY = rimR * Math.sin(angle);
            const endX = subR * Math.cos(angle);
            const endY = subR * Math.sin(angle);
            
            const start = new THREE.Vector3(startX, startY, rimZ);
            const end = new THREE.Vector3(endX, endY, subZ);
            const dist = start.distanceTo(end);
            
            const legGeo = new THREE.CylinderGeometry(0.5, 0.5, dist, 8);
            const leg = new THREE.Mesh(legGeo, grayMetalMat);
            
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            leg.position.copy(mid);
            
            const dir = new THREE.Vector3().subVectors(end, start).normalize();
            leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            
            part7_feedLegs.add(leg);
        }
        altitudeGroup.add(part7_feedLegs);

        // Part 8: Subreflector
        const subGeo = new THREE.CylinderGeometry(4, 0.5, 2, 32);
        const part8_subreflector = new THREE.Mesh(subGeo, whiteMetalMat);
        part8_subreflector.rotation.x = Math.PI / 2;
        part8_subreflector.position.z = 17;
        part8_subreflector.name = "Part8_Subreflector";
        altitudeGroup.add(part8_subreflector);

        // Part 9: Counterweight
        const cwGeo = new THREE.BoxGeometry(30, 12, 16);
        const part9_counterweight = new THREE.Mesh(cwGeo, darkMetalMat);
        part9_counterweight.position.z = -20;
        part9_counterweight.name = "Part9_Counterweight";
        altitudeGroup.add(part9_counterweight);

        return telescope;
    }

    const mainTelescope = buildSingleTelescope();
    arrayGroup.add(mainTelescope);

    const clones = [];
    const positions = [
        new THREE.Vector3(200, 0, -150),
        new THREE.Vector3(-200, 0, -150),
        new THREE.Vector3(0, 0, -300)
    ];

    for (let pos of positions) {
        const clone = mainTelescope.clone();
        clone.position.copy(pos);
        arrayGroup.add(clone);
        clones.push(clone);
    }
    
    const groundGeo = new THREE.PlaneGeometry(2000, 2000);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x3d4a3d, roughness: 1.0, metalness: 0.0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    arrayGroup.add(ground);

    let time = 0;

    return {
        model: arrayGroup,
        update: function(deltaTime) {
            time += deltaTime;
            const telescopes = [mainTelescope, ...clones];
            telescopes.forEach((tel, index) => {
                const phase = index * 0.5;
                const az = Math.sin(time * 0.1 + phase) * Math.PI / 2;
                const alt = Math.PI / 4 + Math.sin(time * 0.15 + phase) * Math.PI / 6;

                const ped = tel.children.find(c => c.name === "PedestalGroup");
                if (ped) {
                    ped.rotation.y = az;
                    const yoke = ped.children.find(c => c.name === "YokeGroup");
                    if (yoke) {
                        const altGroup = yoke.children.find(c => c.name === "AltitudeGroup");
                        if (altGroup) altGroup.rotation.x = -alt;
                    }
                }
            });
        },
        metadata: {
            name: 'Radio Telescope Array',
            description: 'A detailed 3D model of a Cassegrain Radio Telescope Array with 10 distinct parts and altitude-azimuth kinematics.',
            quiz: [
                {
                    question: "What is the primary function of the parabolic dish in a radio telescope?",
                    options: [
                        "To collect and focus incoming radio waves.",
                        "To transmit high-power lasers into space.",
                        "To protect the receiver from rain.",
                        "To generate magnetic fields."
                    ],
                    correctAnswerIndex: 0
                },
                {
                    question: "What role does the subreflector play in a Cassegrain telescope design?",
                    options: [
                        "It provides structural support to the feed legs.",
                        "It reflects the concentrated radio waves from the main dish back toward the receiver.",
                        "It filters out visible light from the incoming signal.",
                        "It cools down the primary receiver."
                    ],
                    correctAnswerIndex: 1
                },
                {
                    question: "Why are the feed legs made as thin as structurally possible?",
                    options: [
                        "To reduce the overall weight of the mount.",
                        "To save on manufacturing costs.",
                        "To minimize the blockage and scattering of incoming radio waves.",
                        "To allow wind to pass through and cool the receiver."
                    ],
                    correctAnswerIndex: 2
                },
                {
                    question: "What is the purpose of the altitude-azimuth mount?",
                    options: [
                        "It allows the telescope to track celestial objects across the sky.",
                        "It fixes the telescope perfectly to the Earth's magnetic north.",
                        "It prevents the dish from rusting.",
                        "It spins the telescope rapidly to create a centrifuge effect."
                    ],
                    correctAnswerIndex: 0
                },
                {
                    question: "Why is a large counterweight needed behind the dish?",
                    options: [
                        "To house the control computers safely.",
                        "To balance the massive weight of the dish structure around the altitude pivot.",
                        "To act as a secondary antenna for low frequencies.",
                        "To store reserve power generators."
                    ],
                    correctAnswerIndex: 1
                },
                {
                    question: "What does the receiver do once the radio waves are focused onto it?",
                    options: [
                        "It captures the radio signals and converts them into electrical signals.",
                        "It bounces the waves back into space.",
                        "It turns the radio waves into visible light instantly.",
                        "It physically vibrates to create sound waves."
                    ],
                    correctAnswerIndex: 0
                }
            ]
        }
    };
}

