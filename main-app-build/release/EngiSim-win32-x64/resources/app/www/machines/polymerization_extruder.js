export function createPolymerizationExtruder(THREE) {
    const extruderGroup = new THREE.Group();

    // 1. Feed Hopper
    const hopperGeometry = new THREE.CylinderGeometry(2, 0.5, 3, 16);
    const hopperMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const hopper = new THREE.Mesh(hopperGeometry, hopperMaterial);
    hopper.position.set(-6, 3, 0);
    extruderGroup.add(hopper);

    // 2. Twin Screws
    const screwsGroup = new THREE.Group();
    const screwGeometry = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
    const screwMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
    const screw1 = new THREE.Mesh(screwGeometry, screwMaterial);
    screw1.rotation.z = Math.PI / 2;
    screw1.position.set(0, 0, -0.6);
    const screw2 = new THREE.Mesh(screwGeometry, screwMaterial);
    screw2.rotation.z = Math.PI / 2;
    screw2.position.set(0, 0, 0.6);
    
    // Add flights to screws for visual rotation
    const flightGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 100, Math.PI * 2);
    for(let i=0; i<10; i++) {
        const flight1 = new THREE.Mesh(flightGeo, screwMaterial);
        flight1.rotation.y = Math.PI / 2;
        flight1.rotation.x = 0.2;
        flight1.position.y = -5 + i;
        screw1.add(flight1);
        const flight2 = new THREE.Mesh(flightGeo, screwMaterial);
        flight2.rotation.y = Math.PI / 2;
        flight2.rotation.x = -0.2;
        flight2.position.y = -5 + i;
        screw2.add(flight2);
    }
    screwsGroup.add(screw1);
    screwsGroup.add(screw2);
    extruderGroup.add(screwsGroup);

    // 3. Heated Barrel
    const barrelGeometry = new THREE.CylinderGeometry(1.6, 1.6, 12, 32);
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.5, transparent: true, opacity: 0.4 });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0, 0);
    extruderGroup.add(barrel);

    // 4. Die Head
    const dieGeometry = new THREE.ConeGeometry(1.6, 2, 32);
    const dieMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const die = new THREE.Mesh(dieGeometry, dieMaterial);
    die.rotation.z = -Math.PI / 2;
    die.position.set(7, 0, 0);
    extruderGroup.add(die);

    // 5. Polymer Melt Zone (inside barrel, visual effect)
    const meltGeometry = new THREE.CylinderGeometry(1.2, 1.2, 8, 16);
    const meltMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, transparent: true, opacity: 0.8 });
    const melt = new THREE.Mesh(meltGeometry, meltMaterial);
    melt.rotation.z = Math.PI / 2;
    melt.position.set(2, 0, 0);
    extruderGroup.add(melt);

    // 6. Drive Motor
    const motorGeometry = new THREE.BoxGeometry(4, 4, 4);
    const motorMaterial = new THREE.MeshStandardMaterial({ color: 0x111155, metalness: 0.4, roughness: 0.6 });
    const motor = new THREE.Mesh(motorGeometry, motorMaterial);
    motor.position.set(-10, 0, 0);
    extruderGroup.add(motor);

    // 7. Gearbox
    const gearboxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const gearboxMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7, roughness: 0.4 });
    const gearbox = new THREE.Mesh(gearboxGeometry, gearboxMaterial);
    gearbox.position.set(-7, 0, 0);
    extruderGroup.add(gearbox);

    // 8. Cooling Bath
    const bathGeometry = new THREE.BoxGeometry(10, 2, 4);
    const bathMaterial = new THREE.MeshStandardMaterial({ color: 0x3388ff, transparent: true, opacity: 0.6 });
    const bath = new THREE.Mesh(bathGeometry, bathMaterial);
    bath.position.set(14, -0.5, 0);
    extruderGroup.add(bath);

    // 9. Pelletizer
    const pelletizerGeometry = new THREE.BoxGeometry(3, 4, 3);
    const pelletizerMaterial = new THREE.MeshStandardMaterial({ color: 0x448844, metalness: 0.5, roughness: 0.5 });
    const pelletizer = new THREE.Mesh(pelletizerGeometry, pelletizerMaterial);
    pelletizer.position.set(20, -1, 0);
    const bladeGeo = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 1, 0);
    blade.rotation.x = Math.PI / 2;
    pelletizer.add(blade);
    extruderGroup.add(pelletizer);

    // 10. Control Panel
    const panelGeometry = new THREE.BoxGeometry(1, 4, 2);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(-6, 0, 3);
    
    // Add screen to control panel
    const screenGeo = new THREE.PlaneGeometry(0.8, 1.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0.51, 1, 0);
    screen.rotation.y = Math.PI / 2;
    panel.add(screen);
    extruderGroup.add(panel);

    // Extruded strand
    const strandGeo = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
    const strandMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const strand = new THREE.Mesh(strandGeo, strandMat);
    strand.rotation.z = Math.PI / 2;
    strand.position.set(14, 0, 0);
    extruderGroup.add(strand);

    // Animation Loop
    extruderGroup.userData.update = function(t) {
        // Twin screws rotating (co-rotating)
        screw1.rotation.x = t * 2;
        screw2.rotation.x = t * 2; 
        
        // Pelletizer blade rotating
        blade.rotation.y = t * 10;

        // Melt pulse effect
        meltMaterial.emissiveIntensity = 0.5 + 0.3 * Math.sin(t * 5);
        
        // Flow of strand (texture displacement if we had UVs, but we'll pulse it)
        const coolColor = new THREE.Color(0xffffff);
        const hotColor = new THREE.Color(0xffaa00);
        // Animate color based on time
        strandMat.color.lerpColors(hotColor, coolColor, (Math.sin(t * 2) + 1) / 2);
    };

    // Quiz Questions
    extruderGroup.userData.quiz = [
        {
            question: "What is the primary function of the Twin Screws in a polymerization extruder?",
            options: [
                "To cool the polymer",
                "To melt and mix the polymer",
                "To cut the polymer into pellets",
                "To control the motor speed"
            ],
            correctOption: 1
        },
        {
            question: "Which component is responsible for shaping the extruded polymer melt?",
            options: [
                "Feed Hopper",
                "Heated Barrel",
                "Die Head",
                "Gearbox"
            ],
            correctOption: 2
        },
        {
            question: "What does the Heated Barrel do in the extrusion process?",
            options: [
                "Solidifies the polymer",
                "Provides the mechanical drive",
                "Heats and maintains the temperature of the polymer melt",
                "Cuts the extruded strands"
            ],
            correctOption: 2
        },
        {
            question: "What is the purpose of the Cooling Bath?",
            options: [
                "To heat the polymer",
                "To solidify the extruded polymer strands before cutting",
                "To lubricate the screws",
                "To power the motor"
            ],
            correctOption: 1
        },
        {
            question: "Which part cuts the cooled polymer strands into small pieces?",
            options: [
                "Die Head",
                "Pelletizer",
                "Drive Motor",
                "Control Panel"
            ],
            correctOption: 1
        },
        {
            question: "What does the Gearbox do in the polymerization extruder assembly?",
            options: [
                "Heats the barrel",
                "Adjusts the speed and torque from the drive motor to the screws",
                "Feeds raw materials into the hopper",
                "Cools the extruded strands"
            ],
            correctOption: 1
        }
    ];

    return extruderGroup;
}
