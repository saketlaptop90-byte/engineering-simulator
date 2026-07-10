export function createOceanEcosystem(THREE) {
    const mainGroup = new THREE.Group();
    
    // 1. Sunlight
    const sunGeom = new THREE.SphereGeometry(2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sunlight = new THREE.Mesh(sunGeom, sunMat);
    sunlight.position.set(0, 15, 0);
    sunlight.userData.name = 'Sunlight';
    mainGroup.add(sunlight);
    
    // 2. Phytoplankton
    const phytoGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const phytoMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const phytoplankton = new THREE.Mesh(phytoGeom, phytoMat);
    phytoplankton.position.set(-5, 5, -2);
    phytoplankton.userData.name = 'Phytoplankton';
    mainGroup.add(phytoplankton);
    
    // 3. Zooplankton
    const zooGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const zooMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const zooplankton = new THREE.Mesh(zooGeom, zooMat);
    zooplankton.position.set(-3, 6, -1);
    zooplankton.userData.name = 'Zooplankton';
    mainGroup.add(zooplankton);
    
    // 4. Small Fish
    const fishGroup = new THREE.Group();
    const fishBody = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 8), new THREE.MeshStandardMaterial({ color: 0xffa500 }));
    fishBody.rotation.x = Math.PI / 2;
    fishGroup.add(fishBody);
    fishGroup.position.set(0, 4, 3);
    fishGroup.userData.name = 'Small Fish';
    mainGroup.add(fishGroup);
    
    // 5. Jellyfish
    const jellyGroup = new THREE.Group();
    const jellyCap = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), 
        new THREE.MeshStandardMaterial({ color: 0xffb6c1, transparent: true, opacity: 0.7 })
    );
    jellyGroup.add(jellyCap);
    for(let i=0; i<4; i++) {
        const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), new THREE.MeshStandardMaterial({ color: 0xffb6c1 }));
        tentacle.position.set(Math.cos(i*Math.PI/2)*0.5, -1, Math.sin(i*Math.PI/2)*0.5);
        jellyGroup.add(tentacle);
    }
    jellyGroup.position.set(5, 5, 0);
    jellyGroup.userData.name = 'Jellyfish';
    mainGroup.add(jellyGroup);
    
    // 6. Sea Turtle
    const turtleGroup = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
    shell.scale.set(1, 0.5, 1.2);
    turtleGroup.add(shell);
    const flipper1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x006400 }));
    flipper1.position.set(1.5, 0, 1);
    turtleGroup.add(flipper1);
    const flipper2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x006400 }));
    flipper2.position.set(-1.5, 0, 1);
    turtleGroup.add(flipper2);
    turtleGroup.position.set(-6, 2, 4);
    turtleGroup.userData.name = 'Sea Turtle';
    mainGroup.add(turtleGroup);
    
    // 7. Shark
    const sharkGroup = new THREE.Group();
    const sharkBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.2, 4, 16), new THREE.MeshStandardMaterial({ color: 0x808080 }));
    sharkBody.rotation.x = Math.PI / 2;
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 3), new THREE.MeshStandardMaterial({ color: 0x808080 }));
    fin.position.set(0, 1, 0);
    sharkGroup.add(sharkBody);
    sharkGroup.add(fin);
    sharkGroup.position.set(0, 8, -6);
    sharkGroup.userData.name = 'Shark';
    mainGroup.add(sharkGroup);
    
    // 8. Whale
    const whaleGroup = new THREE.Group();
    const whaleBody = new THREE.Mesh(new THREE.CylinderGeometry(2, 1, 8, 16), new THREE.MeshStandardMaterial({ color: 0x1e90ff }));
    whaleBody.rotation.x = Math.PI / 2;
    whaleGroup.add(whaleBody);
    whaleGroup.position.set(-8, 10, -5);
    whaleGroup.userData.name = 'Whale';
    mainGroup.add(whaleGroup);
    
    // 9. Ocean Floor
    const floorGeom = new THREE.BoxGeometry(30, 1, 30);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c }); // sand color
    const oceanFloor = new THREE.Mesh(floorGeom, floorMat);
    oceanFloor.position.set(0, -5, 0);
    oceanFloor.userData.name = 'Ocean Floor';
    mainGroup.add(oceanFloor);
    
    // 10. Coral Fragment
    const coralGroup = new THREE.Group();
    const coralStem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), new THREE.MeshStandardMaterial({ color: 0xff6347 }));
    coralStem.position.set(0, 1, 0);
    coralGroup.add(coralStem);
    const coralBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5), new THREE.MeshStandardMaterial({ color: 0xff6347 }));
    coralBranch.rotation.z = Math.PI / 4;
    coralBranch.position.set(0.5, 1.5, 0);
    coralGroup.add(coralBranch);
    coralGroup.position.set(2, -4.5, 2);
    coralGroup.userData.name = 'Coral Fragment';
    mainGroup.add(coralGroup);
    
    // Animation function
    mainGroup.userData.animation = (time) => {
        const t = time * 0.001;
        
        // Phytoplankton and Zooplankton drift
        phytoplankton.position.x = -5 + Math.sin(t) * 1;
        zooplankton.position.x = -3 + Math.sin(t * 1.2) * 1;
        
        // Small fish swims in circle
        fishGroup.position.x = Math.cos(t * 2) * 4;
        fishGroup.position.z = Math.sin(t * 2) * 4 + 3;
        fishGroup.rotation.y = -t * 2;
        
        // Jellyfish bobs
        jellyGroup.position.y = 5 + Math.sin(t * 3) * 1;
        
        // Turtle swims slowly
        turtleGroup.position.x = -6 + Math.cos(t * 0.5) * 2;
        turtleGroup.position.z = 4 + Math.sin(t * 0.5) * 2;
        turtleGroup.rotation.y = -t * 0.5;
        
        // Shark patrols
        sharkGroup.position.x = Math.cos(t * 0.8) * 8;
        sharkGroup.position.z = Math.sin(t * 0.8) * 8 - 2;
        sharkGroup.rotation.y = -t * 0.8;
        
        // Whale moves majestically
        whaleGroup.position.x = -8 + Math.cos(t * 0.3) * 12;
        whaleGroup.position.z = -5 + Math.sin(t * 0.3) * 12;
        whaleGroup.rotation.y = -t * 0.3;
    };
    
    // 6 Quiz Questions
    mainGroup.userData.questions = [
        {
            text: "What is the primary source of energy for most ocean ecosystems?",
            options: ["Ocean currents", "Sunlight", "Geothermal vents", "Wind"],
            correctAnswer: 1
        },
        {
            text: "Which organisms form the base of the ocean food web?",
            options: ["Zooplankton", "Small fish", "Phytoplankton", "Corals"],
            correctAnswer: 2
        },
        {
            text: "What is a primary consumer in the ocean?",
            options: ["Zooplankton", "Shark", "Whale", "Phytoplankton"],
            correctAnswer: 0
        },
        {
            text: "Which of these is considered an apex predator?",
            options: ["Sea Turtle", "Jellyfish", "Small Fish", "Shark"],
            correctAnswer: 3
        },
        {
            text: "What role do corals primarily play in an ocean ecosystem?",
            options: ["Apex predator", "Providing habitat", "Decomposer", "Primary energy source"],
            correctAnswer: 1
        },
        {
            text: "How does energy transfer through a food web?",
            options: ["From consumers to producers", "From producers to consumers", "Randomly between all species", "It is recycled completely"],
            correctAnswer: 1
        }
    ];

    return mainGroup;
}
